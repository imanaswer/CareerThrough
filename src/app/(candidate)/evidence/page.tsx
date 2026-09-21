import type { Metadata } from "next";
import { FolderCheck } from "lucide-react";
import { EmptyState, PageHeader, Panel } from "@/components/bits";
import { EvidenceLine } from "@/components/skill-row";
import { SkillCard } from "@/components/skill-card";
import { skillName } from "@/content/skills";
import { getCandidateState, requireCandidate } from "@/lib/data";

export const metadata: Metadata = { title: "Evidence" };

export default async function EvidencePage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, evidence } = await getCandidateState(user.id, profile, role);

  return (
    <div className="w-full pb-10">
      <PageHeader title="Evidence" subtitle="What proves your ability. Every score in Career Through traces back to something on this page." />
      
      <div className="mb-10">
        <h2 className="sr-only">Evidence Process</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Claim", "You list a skill — capped at 30%", "01"],
            ["Assess", "A timed, server-scored assessment sets the level", "02"],
            ["Practise", "A plan targets what the assessment exposed", "03"],
            ["Verify", "Re-assess, and add project evidence", "04"],
            ["Evidence", "Confidence rises; recruiters see the date", "05"],
          ].map(([step, detail, num], i) => (
            <div key={step} className="group relative flex flex-col justify-between rounded-3xl border border-white/60 bg-white/40 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/10">
              
              {/* Connector line for desktop */}
              {i < 4 && (
                <div className="absolute top-1/2 -right-4 z-10 hidden w-4 -translate-y-1/2 border-t-[4px] border-dotted border-primary/60 lg:block dark:border-primary/80" />
              )}
              
              <div className="mb-4 flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20 shadow-inner dark:bg-primary/20">
                  {num}
                </span>
                {i === 4 ? (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/20 shadow-sm dark:text-emerald-400">
                    Goal
                  </span>
                ) : null}
              </div>
              
              <div>
                <h3 className="mb-1.5 font-bold text-base text-foreground dark:text-white">{step}</h3>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground dark:text-white/60">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {evidence.length === 0 ? (
        <EmptyState icon={FolderCheck} title="No evidence yet" body="Evidence comes from assessments and projects. Start with the baseline to create your first verified evidence." href={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`} cta="Start baseline assessment" />
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2 xl:gap-8">
          <Panel title="By skill" className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-4">{readiness.perSkill.map((s) => <SkillCard key={s.skillId} skill={s} evidence={evidence} formulaVersion={readiness.formulaVersion} />)}</div>
          </Panel>
          <Panel title="Timeline" className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-foreground/10 dark:before:bg-white/10">
              {evidence.map((e) => (
                <div key={e.id} className="relative pl-10">
                  <div className="absolute left-2.5 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-background dark:ring-black" />
                  <p className="mb-3 text-sm font-bold tracking-tight text-foreground/80 dark:text-white/80">{skillName(e.skillId)}</p>
                  <ul className="space-y-3"><EvidenceLine e={e} /></ul>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
