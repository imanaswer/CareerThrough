import type { ReactNode } from "react";
import { BadgeCheck, Briefcase, ClipboardCheck, Compass, FolderCheck, LayoutDashboard, MessageSquare, Route, Target, User } from "lucide-react";
import { Brand } from "@/components/brand";
import { NavLink } from "@/components/nav-link";
import { SignOut } from "@/components/sign-out";
import { requireCandidate } from "@/lib/data";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plan", label: "My Plan", icon: Route },
  { href: "/practice", label: "Practice", icon: MessageSquare },
  { href: "/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/evidence", label: "Evidence", icon: FolderCheck },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/card", label: "Career Card", icon: BadgeCheck },
  { href: "/profile", label: "Profile", icon: User },
];

// Per-user data: never prerender or cache these routes.
export const dynamic = "force-dynamic";

export default async function CandidateLayout({ children }: { children: ReactNode }) {
  const { profile, role } = await requireCandidate();
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-60 overflow-y-autoshrink-0 flex-col border-r bg-card px-4 py-5 lg:flex">
        <Brand href="/dashboard" />
        <div className="mt-6 rounded-xl bg-secondary px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <Target className="size-3" aria-hidden /> Target role
          </p>
          <p className="text-sm font-semibold text-secondary-foreground">{role.title}</p>
        </div>
        <nav aria-label="Main" className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <NavLink key={href} href={href}>
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
          <div className="mt-4 border-t pt-4">
            <NavLink href="/#roles">
              <Compass className="size-4" aria-hidden />
              Career Explorer
            </NavLink>
          </div>
        </nav>
        <SignOut email={profile.name ? `${profile.name} · ${profile.email}` : profile.email} />
      </aside>

      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand href="/dashboard" />
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{role.title}</span>
            <SignOut variant="compact" />
          </div>
        </div>
        <nav aria-label="Main" className="relative flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map(({ href, label }) => (
            <NavLink key={href} href={href} compact>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-8">
        <div className="mx-auto max-w-[1560px]">{children}</div>
      </main>
    </div>
  );
}
