import { SubmitButton } from "@/components/pending";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ROLES, findRoleBySlug } from "@/content/roles";
import { getSkill } from "@/content/skills";
import { jobsForRole } from "@/content/jobs";
import { DIMENSION_LABELS, PRIORITY_LABELS } from "@/content/taxonomy";
import { requiredReadiness } from "@/lib/matching";
import { enroll } from "../../actions";
import { CinematicText } from "@/components/cinematic-text";
import { MagneticButton } from "@/components/magnetic-button";
import { HorizontalScrollJourney } from "@/components/horizontal-scroll-journey";
import { InteractiveSkillList } from "@/components/interactive-skill-list";

export function generateStaticParams() {
  return ROLES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const role = findRoleBySlug((await params).slug);
  return { title: role?.title, description: role?.tagline };
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const role = findRoleBySlug((await params).slug);
  if (!role) notFound();
  const jobs = jobsForRole(role.id);

  // Prepare skills for interactive list
  const skillsData = role.skills.map(rs => ({ rs, s: getSkill(rs.skillId) }));

  return (
    <>
      <SiteHeader />
      
      <main className="relative flex flex-col lg:flex-row w-full min-h-screen bg-background">
        
        {/* Left Column (Sticky Hero) */}
        <div className="lg:sticky lg:top-0 lg:h-screen w-full lg:w-5/12 p-8 lg:p-16 flex flex-col justify-center border-r border-foreground/5 bg-foreground/[0.01] backdrop-blur-xl z-10">
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-widest mb-6">Career path</p>
          <h1 className="flex flex-col text-5xl font-semibold tracking-tighter sm:text-7xl">
            <CinematicText text={role.title} delay={0.2} />
          </h1>
          <p className="mt-8 text-xl font-light leading-relaxed text-foreground/70 max-w-md">
            {role.description}
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-8">
            {[
              [`${role.skills.length}`, "Skills"],
              ["4", "Dimensions"],
              [`${role.skills.length + 2}`, "Assessments"],
              ["1", "Project"],
            ].map(([n, label]) => (
              <div key={label} className="flex flex-col">
                <dt className="text-4xl font-light tabular-nums text-foreground">{n}</dt>
                <dd className="text-xs uppercase tracking-widest text-foreground/40 mt-1">{label}</dd>
              </div>
            ))}
          </dl>
          <form action={enroll} className="mt-16 flex flex-col gap-4 items-start">
            <input type="hidden" name="roleId" value={role.id} />
            <MagneticButton>
              <SubmitButton pendingLabel="Setting up..." className="h-14 rounded-full bg-foreground px-10 font-semibold text-lg text-background hover:bg-foreground/90 shadow-[0_0_20px_rgba(var(--foreground),0.2)]">
                Start this path
              </SubmitButton>
            </MagneticButton>
            <span className="text-xs text-foreground/40 uppercase tracking-widest mt-2">{role.journeyEstimate}</span>
          </form>
        </div>

        {/* Right Column (Scrollable Content) */}
        <div className="w-full lg:w-7/12 flex flex-col pt-32 lg:pt-0">
          
          {/* Section: Horizontal Journey */}
          <HorizontalScrollJourney stages={["Baseline", "Understand", "Build", "Verify", "Career Card", "Opportunities"]} />

          {/* Section: Interactive Skills */}
          <section className="px-6 lg:px-20 pb-16 pt-10 bg-background z-20 relative -mt-[25vh] lg:-mt-[35vh]">
            <h2 className="text-2xl font-semibold text-foreground mb-10">What you&apos;ll prove</h2>
            <InteractiveSkillList skills={skillsData} />
          </section>

          {/* Section: Opportunities (Bento Card style) */}
          <section className="px-6 lg:px-20 py-16 z-10 relative">
            <h2 className="text-2xl font-semibold text-foreground mb-10">Real-world Opportunities</h2>
            <div className="grid gap-6">
              {jobs.map((j) => (
                <div key={j.id} className="group relative overflow-hidden rounded-3xl bg-foreground/[0.02] border border-foreground/10 p-8 backdrop-blur-md transition-all hover:bg-foreground/[0.04]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                    <div>
                      <h3 className="text-3xl font-medium text-foreground">{j.title}</h3>
                      <p className="text-lg text-foreground/50 mt-2">{j.company} · {j.location} · {j.employmentType}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      <span className="flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-2 text-sm text-foreground/80 ring-1 ring-foreground/10">
                        <Lock className="size-4" /> Opens at {requiredReadiness(j, role)}%
                      </span>
                      <span className="text-xs text-foreground/40">+{j.hardRequirements.length} specific skills</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: The Details (Bento Grid) */}
          <section className="px-6 lg:px-20 py-16 grid sm:grid-cols-2 gap-6 z-10 relative">
            <div className="rounded-3xl bg-foreground/[0.02] border border-foreground/5 p-8 backdrop-blur-md hover:bg-foreground/[0.04] transition-colors">
              <h3 className="text-xl font-medium text-foreground mb-6">How you&apos;re assessed</h3>
              <ul className="space-y-4">
                {role.dimensions.map((d) => (
                  <li key={d} className="flex justify-between items-center gap-4 border-b border-foreground/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-foreground/80 font-medium">{DIMENSION_LABELS[d]}</span>
                    <span className="text-sm text-foreground/40 text-right">{d === "interview" ? "Not yet assessed" : "Timed, server-scored"}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-foreground/30 leading-relaxed">
                Assessments are verified and tamper-resistant: timed, scored on the server, with tab switches recorded.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-foreground/[0.02] border border-foreground/5 p-8 backdrop-blur-md hover:bg-foreground/[0.04] transition-colors flex-1">
                <h3 className="text-xl font-medium text-foreground mb-6">What gets verified</h3>
                <ul className="space-y-4 text-foreground/60">
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> Every skill level, from an assessment you took</li>
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> Your role project: <strong className="text-foreground/90">{role.project.title}</strong></li>
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> A final verification across all role skills</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-foreground/[0.02] border border-foreground/5 p-8 backdrop-blur-md hover:bg-foreground/[0.04] transition-colors flex-1">
                <h3 className="text-xl font-medium text-foreground mb-6">What your Career Card contains</h3>
                <ul className="space-y-4 text-foreground/60">
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> Role readiness and status for {role.title}</li>
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> Each skill with its evidence and confidence</li>
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> Project evidence and last-verified dates</li>
                  <li className="flex gap-3"><span className="text-foreground/20">•</span> Private by default. You decide if it&apos;s public.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
