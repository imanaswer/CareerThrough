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
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Brand href="/dashboard" />
          {user ? <SignOut variant="compact" /> : null}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
