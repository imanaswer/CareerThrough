import Link from "next/link";
import { BadgeCheck, ClipboardCheck, Compass, Briefcase, Route, ShieldCheck, Target, ArrowRight, Check, BarChart3, Bug, Infinity as InfinityIcon, LayoutTemplate, Server, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Chip } from "@/components/bits";
import { HeroButtons } from "@/components/hero-buttons";
import { TiltCard } from "@/components/tilt-card";
import { CinematicText } from "@/components/cinematic-text";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EvidenceScaleAccordion } from "@/components/evidence-scale-accordion";
import { CtaSection } from "@/components/cta-section";
import { HeroMockup } from "@/components/hero-mockup";
import { FloatingIcons } from "@/components/floating-icons";
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
      <main className="relative flex flex-col items-center overflow-clip selection:bg-primary/30">
        
        {/* Background Effects */}
        <div className="hero-glow" />
        <div className="absolute top-0 -z-10 h-[100vh] w-full bg-[radial-gradient(ellipse_at_top_right,oklch(0.65_0.25_290/0.15),transparent_60%)]" />

        {/* HERO SECTION - SPLIT SCREEN */}
        <section className="relative mx-auto flex min-h-[95vh] w-full max-w-7xl flex-col justify-center px-4 pt-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pt-0">
          
          {/* Left Column: Typography & Actions */}
          <div className="flex w-full flex-col items-start gap-6 lg:w-[45%] z-20">
            <Chip className="border-foreground/10 bg-foreground/5 backdrop-blur-md text-foreground">Not a course platform</Chip>
            
            <h1 className="flex flex-col text-5xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <CinematicText text="Choose the role." delay={2.2} />
              <CinematicText text="Prove you're ready." className="opacity-50" delay={2.6} />
              <CinematicText text="Get access." className="text-gradient-primary font-semibold" delay={3.0} />
            </h1>
            
            <p className="mt-4 max-w-xl text-lg font-light text-muted-foreground sm:text-xl">
              Know how ready you are for a specific job, why, and what to fix next.
            </p>
            
            <div className="mt-4 w-full max-w-sm">
              <HeroButtons />
            </div>
          </div>

          {/* Right Column: Floating Mockup */}
          <div className="mt-16 flex w-full justify-center lg:mt-0 lg:w-[55%] lg:justify-end z-10">
            <ScrollReveal delay={0.5}>
              <FloatingIcons>
                <HeroMockup />
              </FloatingIcons>
            </ScrollReveal>
          </div>
        </section>

        {/* ROLES SECTION */}
        <section id="roles" className="relative w-full scroll-mt-20 py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-5xl">Pick your target role</h2>
              <p className="mt-4 max-w-xl text-muted-foreground">Five complete role tracks. Each has its own skills, targets, assessments and opportunities.</p>
            </div>
            
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role, index) => {
                const jobs = jobsForRole(role.id);
                const core = role.skills.filter((s) => s.priority === "critical");
                return (
                  <ScrollReveal key={role.id} index={index}>
                    <TiltCard className="card-soft group flex flex-col p-8">
                      <h3 className="text-2xl font-medium text-foreground">{role.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{role.tagline}</p>
                    
                    <div className="mt-8">
                      <p className="text-xs font-medium uppercase tracking-widest text-primary">Critical Skills</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {core.map((s) => (
                          <span key={s.skillId} className="rounded-md border border-foreground/10 bg-foreground/5 px-2.5 py-1 text-xs text-foreground/80">
                            {skillName(s.skillId)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex-1 space-y-3 border-t border-foreground/10 pt-6 text-sm">
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Assessed on</span><span className="text-right text-foreground/90">{role.skills.length} skills</span></div>
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Sample Jobs</span><span className="text-right text-foreground/90">{jobs.slice(0, 1).map((j) => j.title).join(", ")} +more</span></div>
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Typical journey</span><span className="text-right text-foreground/90">{role.journeyEstimate.split(" from")[0]}</span></div>
                    </div>
                    
                    <Link href={`/roles/${role.slug}`} className="relative z-10 mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-foreground/10 font-medium text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      View full track
                    </Link>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section id="how" className="relative w-full scroll-mt-20 overflow-hidden border-t border-foreground/10 bg-foreground/[0.02] py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-16 md:w-1/2">
              <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-5xl">One continuous loop.</h2>
              <p className="mt-4 text-lg text-muted-foreground">From setting a goal to landing the opportunity, everything is connected and evidence-based.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {LOOP.map(({ icon: Icon, title, body }, i) => (
                <ScrollReveal key={title} index={i}>
                  <div className="card-soft flex h-full flex-col p-8">
                    <div className="flex items-center gap-4">
                      <div className="grid size-12 place-items-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/30">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-foreground">{title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>


        {/* REDESIGNED SCORE SECTION - ACCORDION */}
        <EvidenceScaleAccordion />

        {/* REDESIGNED CTA SECTION - EDITORIAL GRID */}
        <CtaSection />

      </main>
      {/* PREMIUM CINEMATIC FOOTER - SINGLE LINE */}
      <footer className="relative w-full bg-background py-8 overflow-hidden border-t">
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[100px] bg-primary/5 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 flex justify-center text-center">
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-foreground/40 hover:text-foreground/60 transition-colors duration-300">
            Career Through &middot; Openings shown here are sample listings used to demonstrate readiness-based matching &middot; Content {CONTENT_VERSION}
          </p>
        </div>
      </footer>
    </>
  );
}
