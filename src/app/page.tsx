import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bug,
  Compass,
  Infinity as InfinityIcon,
  LayoutTemplate,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Blobs, FloatingGlyphs, LoopPath } from "@/components/landing/decor";
import { RoleDemo, type DemoRole } from "@/components/landing/role-demo";
import { ROLES } from "@/content/roles";
import { SKILLS, skillName } from "@/content/skills";
import { jobsForRole } from "@/content/jobs";
import { CONTENT_VERSION } from "@/content/version";
import { computeReadiness, type EvidenceItem } from "@/lib/readiness";
import { matchJobs } from "@/lib/matching";

/**
 * Each role owns one colour, used for its tab, its card and its accents. That is the
 * rule for colour on this page: the indigo brand for everything shared, a role's own
 * hue wherever that role is the subject.
 */
const ROLE_STYLE: Record<string, { hue: string; tint: string; short: string; icon: LucideIcon }> = {
  "data-analyst": { hue: "#2563eb", tint: "bg-blue-50", short: "Data", icon: BarChart3 },
  "frontend-developer": { hue: "#db2777", tint: "bg-pink-50", short: "Frontend", icon: LayoutTemplate },
  "backend-developer": { hue: "#7c3aed", tint: "bg-violet-50", short: "Backend", icon: Server },
  "qa-engineer": { hue: "#059669", tint: "bg-emerald-50", short: "QA", icon: Bug },
  "devops-engineer": { hue: "#ea580c", tint: "bg-orange-50", short: "DevOps", icon: InfinityIcon },
};

/**
 * A sample candidate, used only to demonstrate the product on the landing page.
 * The levels below are illustrative; everything derived from them (readiness, gaps,
 * which opportunities open) is produced by the same engines the app runs on, so the
 * preview cannot drift away from how the product actually behaves.
 */
const SAMPLE_LEVELS = [17, 33, 17, 67, 67, 17, 50, 50, 83, 67, 50, 33];

function demoFor(role: (typeof ROLES)[number]): DemoRole {
  const now = new Date();
  const evidence: EvidenceItem[] = role.skills.map((rs, i) => ({
    id: `sample-${rs.skillId}`,
    skillId: rs.skillId,
    type: "assessment",
    source: "skill",
    refId: null,
    url: null,
    score: SAMPLE_LEVELS[i % SAMPLE_LEVELS.length],
    confidence: "medium",
    verified: true,
    detail: { correct: 4, total: 6, peakCorrect: 3 },
    createdAt: now,
    expiresAt: null,
  }));

  const jobs = jobsForRole(role.id);
  const readiness = computeReadiness(role, evidence, { jobs, now });
  const matches = matchJobs(jobs, role, readiness);
  const locked = matches
    .filter((m) => !m.unlocked && m.blockers.length)
    .sort((a, b) => a.blockers.length - b.blockers.length || b.matchPct - a.matchPct)[0];
  const lockedJob = locked ? jobs.find((j) => j.id === locked.jobId) : undefined;
  const style = ROLE_STYLE[role.id];

  return {
    id: role.id,
    slug: role.slug,
    title: role.title,
    short: style.short,
    hue: style.hue,
    score: readiness.score,
    band: readiness.band.label,
    skills: readiness.perSkill.slice(0, 5).map((p) => ({ name: p.name, level: p.level, target: p.target, meets: p.gap >= 0 })),
    criticalGaps: readiness.gaps.critical.length,
    unlocked: matches.filter((m) => m.unlocked).length,
    totalJobs: matches.length,
    nextJob: lockedJob && locked ? { title: lockedJob.title, company: lockedJob.company, blocker: locked.blockers[0].message } : null,
  };
}

const LOOP = [
  { icon: Compass, title: "Pick the role", body: "Start from the job you want. Its skills, targets and thresholds come with it." },
  { icon: Target, title: "See where you stand", body: "An adaptive test that gets harder as you get it right, so the score means something." },
  { icon: Sparkles, title: "Close what matters", body: "One action at a time, picked by what blocks the most opportunities." },
  { icon: BadgeCheck, title: "Prove it, get access", body: "Evidence opens real roles. Locked ones say exactly what is missing." },
];

const LADDER = [
  { cap: 30, label: "You said you know it", detail: "A claim on a resume. Capped here until something backs it up.", bar: "bg-slate-300" },
  { cap: 84, label: "You passed the test", detail: "Adaptive and timed. The hard questions are worth more than the easy ones.", bar: "bg-primary/60" },
  { cap: 100, label: "You did the work", detail: "A project, or an interview on the skill. Nothing else reaches the top band.", bar: "bg-primary" },
];

export default function Home() {
  const demos = ROLES.map(demoFor);
  const ticker = SKILLS.filter((s) => s.dimension === "technical").map((s) => s.name);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b">
          <Blobs />
          <FloatingGlyphs />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-20">
            <div>
              <span
                className="rise inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 backdrop-blur"
                style={{ ["--i" as string]: 0 }}
              >
                <Sparkles className="size-3.5" aria-hidden />
                Not a course platform
              </span>
              <h1
                className="rise mt-5 text-[2.4rem] font-semibold leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem]"
                style={{ ["--i" as string]: 1 }}
              >
                Choose the role.
                <br />
                Prove you&apos;re ready.
                <br />
                <span className="shine">Get access.</span>
              </h1>
              <p className="rise mt-6 max-w-md text-lg text-muted-foreground" style={{ ["--i" as string]: 2 }}>
                Know how ready you are for a specific job, why, and what to fix next.
              </p>
              <div className="rise mt-8 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
                <Link
                  href="#roles"
                  className={cn(buttonVariants(), "group h-12 px-7 text-base shadow-lg shadow-primary/25 transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0")}
                >
                  Explore roles
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <Link
                  href="#how"
                  className={cn(buttonVariants({ variant: "outline" }), "h-12 bg-background/70 px-7 text-base backdrop-blur transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0")}
                >
                  How it works
                </Link>
              </div>
            </div>

            <div className="rise lg:rotate-[0.6deg] lg:transition-transform lg:duration-500 lg:hover:rotate-0" style={{ ["--i" as string]: 4 }}>
              <RoleDemo roles={demos} />
            </div>
          </div>
        </section>

        <section className="marquee overflow-hidden border-b bg-card py-3.5" aria-hidden>
          <div className="marquee-track gap-3">
            {[...ticker, ...ticker].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        <section id="roles" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="reveal text-3xl font-semibold tracking-tight sm:text-4xl">Pick your target role</h2>
            <p className="reveal mt-2 max-w-xl text-muted-foreground">
              Five complete tracks. Each brings its own skills, targets, assessments and openings.
            </p>
            <div className="reveal-stagger mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role, i) => {
                const demo = demos[i];
                const style = ROLE_STYLE[role.id];
                const Icon = style.icon;
                const critical = role.skills.filter((s) => s.priority === "critical");
                return (
                  <article
                    key={role.id}
                    className="card-soft group relative flex flex-col overflow-hidden p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <span
                      aria-hidden
                      className="absolute -right-10 -top-10 size-28 rounded-full opacity-15 transition-transform duration-500 group-hover:scale-150"
                      style={{ backgroundColor: style.hue }}
                    />
                    <span className={cn("grid size-11 place-items-center rounded-2xl", style.tint)} style={{ color: style.hue }}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{role.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{role.tagline}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {critical.map((s) => (
                        <span key={s.skillId} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {skillName(s.skillId)}
                        </span>
                      ))}
                    </div>
                    <dl className="mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center">
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Skills</dt>
                        <dd className="text-lg font-semibold tabular-nums">{role.skills.length}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Openings</dt>
                        <dd className="text-lg font-semibold tabular-nums">{demo.totalJobs}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Ready at</dt>
                        <dd className="text-lg font-semibold tabular-nums">{role.readyThreshold}%</dd>
                      </div>
                    </dl>
                    <Link
                      href={`/roles/${role.slug}`}
                      className="mt-5 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: style.hue }}
                    >
                      View role
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="dotfield scroll-mt-20 border-y bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="reveal text-3xl font-semibold tracking-tight sm:text-4xl">One loop, from goal to offer</h2>
            <p className="reveal mt-2 max-w-xl text-muted-foreground">
              Learning only counts when it produces evidence. That is the whole design.
            </p>

            <div className="relative mt-12">
              <LoopPath />
              <ol className="reveal-stagger relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {LOOP.map(({ icon: Icon, title, body }, i) => (
                  <li key={title} className="group">
                    <span className="grid size-12 place-items-center rounded-2xl bg-background text-primary shadow-sm ring-1 ring-primary/15 transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <p className="mt-4 text-xs font-semibold tabular-nums text-primary/70">0{i + 1}</p>
                    <h3 className="mt-1 font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <h2 className="reveal text-3xl font-semibold tracking-tight sm:text-4xl">A score you can argue with</h2>
              <p className="reveal mt-4 text-lg text-muted-foreground">
                Saying you know something is worth 30. Proving it on paper is worth 84. The top band is reserved for work you
                have actually done, so nobody arrives there by being good at quizzes.
              </p>
              <p className="reveal mt-3 text-muted-foreground">
                Every number opens up: the evidence behind it, the target it is measured against, and what it takes to move.
              </p>
              <Link href="#roles" className={cn(buttonVariants({ variant: "outline" }), "reveal mt-7 h-11 px-6 text-base")}>
                Start with a role
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <ul className="reveal-stagger space-y-3">
              {LADDER.map((row) => (
                <li key={row.cap} className="card-soft p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{row.label}</p>
                    <p className="text-3xl font-semibold tabular-nums">
                      {row.cap}
                      <span className="text-sm font-normal text-muted-foreground">%</span>
                    </p>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-muted">
                    <div
                      className={cn("h-full origin-left rounded-full transition-transform duration-700", row.bar)}
                      style={{ transform: `scaleX(${row.cap / 100})`, width: "100%" }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{row.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="surface-hero reveal relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-12">
            <span aria-hidden className="blob left-[-6%] top-[-40%] size-72 bg-white/25" />
            <span aria-hidden className="blob right-[-4%] bottom-[-50%] size-80 bg-fuchsia-300/30" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Find out where you actually stand</h2>
              <p className="mx-auto mt-4 max-w-lg text-white/90">
                Pick a role, take the baseline, and see your readiness with the evidence behind it.
              </p>
              <Link
                href="#roles"
                className={cn(buttonVariants(), "mt-8 h-12 bg-white px-8 text-base text-primary transition-transform duration-150 hover:-translate-y-0.5 hover:bg-white active:translate-y-0")}
              >
                Explore roles
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-4" aria-hidden />Evidence before claims</span>
                <span className="flex items-center gap-1.5"><Lock className="size-4" aria-hidden />Eligibility is rule-based, never AI</span>
                <span className="flex items-center gap-1.5"><BadgeCheck className="size-4" aria-hidden />Every score traces to evidence</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <p className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          Career Through · Openings shown here are sample listings used to demonstrate readiness-based matching · content {CONTENT_VERSION}
        </p>
      </footer>
    </>
  );
}
