import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * Read at call time, and prefer the non-public names.
 *
 * Next inlines every `process.env.NEXT_PUBLIC_*` during the build, while Vercel
 * withholds variables marked sensitive until runtime. A sensitive NEXT_PUBLIC_ var
 * therefore compiles to undefined and the app looks unconfigured in production.
 * Nothing here runs in the browser, so the server-side names are the right ones.
 */
function supabaseUrl() {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function supabaseAnonKey() {
  return process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function supabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

/** Cookie-bound client: auth only. Tables are never read through this key. */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(supabaseUrl()!, supabaseAnonKey()!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component: the proxy refreshes the session instead.
        }
      },
    },
  });
}

/** Service-role client: private Storage only. Never import from client code. */
export function supabaseAdmin() {
  return createClient(supabaseUrl()!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
