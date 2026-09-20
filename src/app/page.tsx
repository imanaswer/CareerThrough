import { LinkArrow } from "@/components/pending";
import Link from "next/link";
import { BadgeCheck, ClipboardCheck, Compass, Briefcase, Route, ShieldCheck, Target } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Chip } from "@/components/bits";
import { ROLES } from "@/content/roles";
import { skillName } from "@/content/skills";
import { jobsForRole } from "@/content/jobs";

const STEPS = [
  { icon: Compass, title: "Choose the role", body: "Start from the job you want, not a list of courses. See exactly what it requires." },
  { icon: ClipboardCheck, title: "Prove where you stand", body: "Add your real profile and take a baseline. Resume claims are not proof — evidence is." },
  { icon: Target, title: "See your gaps, explained", body: "A readiness score you can interrogate: every number links to the evidence behind it." },
  { icon: Route, title: "Do what you need, not everything", body: "A next best action and short plans for your gaps only. Skip what you've already shown." },
  { icon: BadgeCheck, title: "Earn your Career Card", body: "A verified career identity — assessed skills, projects and freshness. You control who sees it." },
  { icon: Briefcase, title: "Unlock opportunities", body: "Jobs open up as your evidence grows, and locked ones tell you exactly what is missing." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <Chip className="bg-secondary text-secondary-foreground ring-transparent">Not a course platform</Chip>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Choose the role.
            <br />
            Prove you&apos;re ready.
            <br />
            <span className="bg-gradient-to-r from-primary to-fuchsia-600 bg-clip-text text-transparent">Get access to opportunities.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Career Through turns a career goal into verified employability. Know how ready you are for a specific job, why, what to fix next, and which opportunities it unlocks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#roles" className={cn(buttonVariants(), "h-11 px-6 text-base")}>
              Explore roles <LinkArrow />
            </Link>
            <Link href="#how" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6 text-base")}>How it works</Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            Evidence before claims. Every score is explainable and traceable.
          </p>
        </section>

        <section id="roles" className="scroll-mt-20 border-y bg-muted/40 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">Pick your target role</h2>
            <p className="mt-1 text-muted-foreground">Five complete role tracks. Each has its own skills, targets, assessments and opportunities.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role) => {
                const jobs = jobsForRole(role.id);
                const core = role.skills.filter((s) => s.priority === "critical");
                return (
                  <article key={role.id} className="card-soft flex flex-col p-6 transition-shadow hover:shadow-lg">
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{role.tagline}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Critical skills</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {core.map((s) => <Chip key={s.skillId} className="bg-background ring-border">{skillName(s.skillId)}</Chip>)}
                    </div>
                    <dl className="mt-4 space-y-1.5 text-sm">
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Assessed on</dt><dd className="text-right">{role.skills.length} skills · 4 dimensions</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Sample opportunities</dt><dd className="text-right">{jobs.slice(0, 2).map((j) => j.title).join(", ")}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Typical journey</dt><dd className="text-right">{role.journeyEstimate.split(" from")[0]}</dd></div>
                    </dl>
                    <Link href={`/roles/${role.slug}`} className={cn(buttonVariants({ variant: "secondary" }), "mt-6 h-10 w-full")}>
                      View role <LinkArrow />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">One loop, from goal to opportunity</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-2xl border p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" aria-hidden /></span>
                  <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Career Through · Opportunities shown in this version are sample listings used to demonstrate readiness-based matching.
      </footer>
    </>
  );
}
