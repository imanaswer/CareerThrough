import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/onboarding", "/assessment", "/assessments", "/plan", "/evidence", "/jobs", "/card", "/profile"];

// Refreshes the Supabase session cookie and keeps signed-out users out of candidate routes.
// Pages still call requireUser(): this is the first gate, not the only one.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  const { data } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // If the callback URL isn't allow-listed in Supabase, the confirmation link lands on the site root
  // with ?code=. Finish sign-in anyway instead of silently dropping it.
  if (path === "/" && request.nextUrl.searchParams.has("code")) {
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    return NextResponse.redirect(callback);
  }
  if (!data.user && PROTECTED.some((p) => path === p || path.startsWith(p + "/"))) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
