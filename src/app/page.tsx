import Link from "next/link";
import { BadgeCheck, ClipboardCheck, Compass, Briefcase, Route, ShieldCheck, Target, ArrowRight, Check } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Chip } from "@/components/bits";
import { HeroButtons } from "@/components/hero-buttons";
import { FluidBackground } from "@/components/fluid-background";
import { TiltCard } from "@/components/tilt-card";
import { CinematicText } from "@/components/cinematic-text";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EvidenceScaleAccordion } from "@/components/evidence-scale-accordion";
import { CtaSection } from "@/components/cta-section";
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
      <main className="relative flex flex-col items-center overflow-clip selection:bg-primary/30">
        
        {/* Background Effects */}
        <FluidBackground />
        <div className="hero-glow" />
        <div className="absolute top-0 -z-10 h-[100vh] w-full bg-[radial-gradient(ellipse_at_top_center,oklch(0.65_0.25_290/0.15),transparent_50%)]" />

        {/* HERO SECTION */}
        <section className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-4 pt-24 sm:px-6">
          <div className="flex flex-col items-start gap-6">
            <Chip className="border-foreground/10 bg-foreground/5 backdrop-blur-md text-foreground">Not a course platform</Chip>
            
            <h1 className="flex max-w-4xl flex-col text-5xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-7xl md:text-8xl">
              <CinematicText text="Choose the role." delay={2.2} />
              <CinematicText text="Prove you're ready." className="opacity-50" delay={2.6} />
              <CinematicText text="Get opportunities." className="text-gradient-primary font-semibold" delay={3.0} />
            </h1>
            
            <p className="mt-4 max-w-2xl text-lg font-light text-muted-foreground sm:text-xl">
              Career Through turns a career goal into verified employability. Stop guessing what you need. Know how ready you are, what to fix next, and the exact opportunities it unlocks.
            </p>
            
            <HeroButtons />
            
            <div className="mt-12 flex items-center gap-3 rounded-full border border-foreground/5 bg-foreground/5 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              <span>Evidence before claims. Every score is explainable and traceable.</span>
            </div>
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
              {STEPS.map(({ icon: Icon, title, body }, i) => (
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
      <footer className="relative w-full bg-background py-8 overflow-hidden">
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[100px] bg-primary/5 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 flex justify-center text-center">
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-foreground/40 hover:text-foreground/60 transition-colors duration-300">
            Career Through &middot; Openings shown here are sample listings used to demonstrate readiness-based matching &middot; Content 2026.09.1
          </p>
        </div>
      </footer>
    </>
  );
}
