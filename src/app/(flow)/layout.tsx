import type { ReactNode } from "react";
import { Brand } from "@/components/brand";
import { SignOut } from "@/components/sign-out";
import { getUser } from "@/lib/data";

// Focused, distraction-free shell for onboarding and assessments.
// Per-user data: never prerender or cache these routes.
export const dynamic = "force-dynamic";

export default async function FlowLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  return (
    <div className="min-h-screen relative flex flex-col items-center selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="hero-glow opacity-30" />
      <div className="absolute top-0 -z-10 h-[100vh] w-full bg-[radial-gradient(ellipse_at_top_right,oklch(0.65_0.25_290/0.15),transparent_60%)]" />

      <header className="w-full border-b border-foreground/10 bg-background/50 backdrop-blur-md z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Brand href="/dashboard" />
          {user ? <SignOut variant="compact" /> : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 lg:py-20 z-10">{children}</main>
    </div>
  );
}
