import type { ReactNode } from "react";
import { BadgeCheck, Briefcase, ClipboardCheck, Compass, FolderCheck, LayoutDashboard, MessageSquare, Route, Target, User } from "lucide-react";
import { Brand } from "@/components/brand";
import { NavLink } from "@/components/nav-link";
import { SignOut } from "@/components/sign-out";
import { requireCandidate } from "@/lib/data";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

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

export const dynamic = "force-dynamic";

export default async function CandidateLayout({ children }: { children: ReactNode }) {
  const { profile, role } = await requireCandidate();
  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row selection:bg-primary/30">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="pointer-events-none fixed inset-0 -z-10 hero-glow opacity-25" />
      <div className="pointer-events-none fixed top-0 -z-10 h-screen w-full bg-[radial-gradient(ellipse_at_top_right,oklch(0.65_0.25_290/0.15),transparent_60%)]" />

      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      
      {/* High-Visibility Clean Floating Left Sidebar */}
      <aside className="sticky top-6 z-10 hidden h-[calc(100vh-48px)] ml-6 mt-6 w-[290px] shrink-0 flex-col overflow-y-auto scrollbar-hide rounded-[2rem] border border-white bg-white/80 px-5 py-6 shadow-[0_8px_40px_rgb(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-2xl lg:flex dark:border-white/10 dark:bg-black/60 dark:shadow-[0_8px_40px_rgb(0,0,0,0.4)]">
        
        <div className="mb-5 px-1 flex items-center justify-between">
          <Brand href="/" />
          <ThemeToggle />
        </div>
        
        {/* Target Role Card */}
        <div className="mb-5 rounded-2xl border border-white/80 bg-white px-5 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 dark:text-white/70">
            <Target className="size-3.5 text-primary dark:text-white" aria-hidden /> Target role
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground/90 dark:text-white">{role.title}</p>
        </div>

        {/* Navigation */}
        <nav aria-label="Main" className="flex flex-1 flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <NavLink key={href} href={href} label={label} icon={<Icon className="size-5" aria-hidden />} />
          ))}
          <div className="mt-auto border-t border-foreground/5 pt-3 dark:border-white/10">
            <NavLink href="/#roles" label="Career Explorer" icon={<Compass className="size-5" aria-hidden />} />
          </div>
        </nav>
        
        {/* Profile / Sign Out */}
        <div className="mt-3 border-t border-foreground/5 pt-3 dark:border-white/10">
          <SignOut email={profile.name ? `${profile.name} · ${profile.email}` : profile.email} />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-black/60">
        <div className="flex items-center justify-between px-4 py-4">
          <Brand href="/" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary shadow-[inset_0_1px_2px_rgb(255,255,255,0.4)] hidden sm:inline-block">{role.title}</span>
            <SignOut variant="compact" />
          </div>
        </div>
        <nav aria-label="Main" className="relative flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {NAV.map(({ href, label, icon: Icon }) => (
            <NavLink key={href} href={href} label={label} icon={<Icon className="size-4" aria-hidden />} compact />
          ))}
        </nav>
      </header>

      <main id="main" className="z-10 flex-1 px-4 py-6 sm:px-6 lg:px-12 lg:py-6 flex flex-col">
        <div className="mx-auto w-full max-w-[2000px] flex-1 flex flex-col pb-6">{children}</div>
      </main>
    </div>
  );
}
