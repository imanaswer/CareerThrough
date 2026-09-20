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
    <>
      <PageHeader title="Evidence" subtitle="What proves your ability. Every score in Career Through traces back to something on this page." />
      <ol className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border bg-muted/40 p-4 text-sm">
        {[
          ["Claim", "You list a skill — capped at 30%"],
          ["Assess", "A timed, server-scored assessment sets the level"],
          ["Practise", "A plan targets what the assessment exposed"],
          ["Verify", "Re-assess, and add project evidence"],
          ["Evidence", "Confidence rises; recruiters see the date"],
        ].map(([step, detail], i) => (
          <li key={step} className="flex items-center gap-2">
            {i ? <span className="text-muted-foreground" aria-hidden>→</span> : null}
            <span className="group relative">
              <span className="font-medium">{step}</span>
              <span className="block max-w-[14rem] text-xs text-muted-foreground">{detail}</span>
            </span>
          </li>
        ))}
      </ol>
      {evidence.length === 0 ? (
        <EmptyState icon={FolderCheck} title="No evidence yet" body="Evidence comes from assessments and projects. Start with the baseline to create your first verified evidence." href={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`} cta="Start baseline assessment" />
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
          <Panel title="By skill">
            <div className="space-y-3">{readiness.perSkill.map((s) => <SkillCard key={s.skillId} skill={s} evidence={evidence} formulaVersion={readiness.formulaVersion} />)}</div>
          </Panel>
          <Panel title="Timeline">
            <div className="space-y-3">
              {evidence.map((e) => (
                <div key={e.id}>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{skillName(e.skillId)}</p>
                  <ul><EvidenceLine e={e} /></ul>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}
