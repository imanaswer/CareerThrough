import { LinkArrow } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { Chip, EmptyState, PageHeader, Panel, StatusChip } from "@/components/bits";
import { PRIORITY_LABELS } from "@/content/taxonomy";
import { getPlan } from "@/content/plans";
import { skillName } from "@/content/skills";
import { getCandidateState, requireCandidate } from "@/lib/data";
import { ProjectForm } from "./project-form";

export const metadata: Metadata = { title: "My Plan" };

const PROJECT_STATE = { none: "Not started", pending: "Validation pending", recorded: "Evidence recorded" };

export default async function PlanPage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, evidence, planDone, baselineDone } = await getCandidateState(user.id, profile, role);
  if (!baselineDone) {
    return (<><PageHeader title="My Plan" /><EmptyState icon={CheckCircle2} title="Your plan is built from your baseline" body="We only plan for gaps you actually have. Take the baseline first so you don't study what you already know." href={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`} cta="Start baseline assessment" /></>);
  }

  const bySkill = new Map(readiness.perSkill.map((p) => [p.skillId, p]));
  const actions = readiness.nextActions.filter((a) => a.skillId);
  const project = evidence.find((e) => e.type === "project" && e.refId === role.project.id);
  const projectState = !project ? "none" : project.detail?.status === "recorded" ? "recorded" : "pending";

  return (
    <>
      <PageHeader title="My Plan" subtitle={`Only what you need for ${role.title}, in priority order. Working through a plan does not raise your readiness — passing the assessment at the end does.`} />
      <div className="space-y-5">
        <Panel title={`Skills to close (${actions.length})`}>
          {actions.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><PartyPopper className="size-4 text-primary" aria-hidden />No skill gaps left. Finish your project and take the final verification.</p>
          ) : (
            <ol className="divide-y">
              {actions.map((a, i) => {
                const s = bySkill.get(a.skillId!)!;
                const days = getPlan(s.skillId)?.days ?? [];
                const done = days.filter((_, d) => planDone.has(`${s.skillId}:${d}`)).length;
                return (
                  <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-medium"><span className="text-muted-foreground tabular-nums">{i + 1}.</span>{s.name}<StatusChip status={s.status} /><Chip className="bg-background text-muted-foreground ring-border">{PRIORITY_LABELS[s.priority]}</Chip></p>
                      <p className="mt-1 text-sm text-muted-foreground">{s.level}% → target {s.target}%{a.blocksJobs ? ` · blocks ${a.blocksJobs} opportunit${a.blocksJobs === 1 ? "y" : "ies"}` : ""}{s.assessed ? ` · ${done}/${days.length} days practised` : ""}</p>
                      {a.impact ? (
                        <p className="mt-0.5 text-xs text-emerald-700">
                          Reaching {a.impact.to}% is worth +{a.impact.deltaScore} readiness
                          {a.impact.unlockedJobIds.length ? ` and unlocks ${a.impact.unlockedJobIds.length} ${a.impact.unlockedJobIds.length === 1 ? "opportunity" : "opportunities"}` : ""}.
                        </p>
                      ) : null}
                    </div>
                    <Link href={a.href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">{a.action}<LinkArrow /></Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <Panel id="project" title="Your role project — practical evidence" className="scroll-mt-24">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{role.project.title}</p>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{role.project.brief}</p>
            </div>
            <Chip className={projectState === "recorded" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : projectState === "pending" ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-muted text-muted-foreground ring-border"}>{PROJECT_STATE[projectState]}</Chip>
          </div>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requirements</p>
              <ul className="mt-2 space-y-1.5 text-sm">{role.project.requirements.map((r) => <li key={r}>• {r}</li>)}</ul>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Skills this evidences</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{role.project.skillIds.map((s) => <Chip key={s} className="bg-background ring-border">{skillName(s)}</Chip>)}</div>
            </div>
            <div>
              <ProjectForm repoUrl={project?.url ?? ""} liveUrl={project?.detail?.liveUrl ?? ""} demoUrl={project?.detail?.demoUrl ?? ""} submitted={Boolean(project)} />
              <p className="mt-3 text-xs text-muted-foreground">We check that the repository link is real and public. Projects are not human-reviewed in this version: they strengthen the confidence of your assessed skills and satisfy jobs that ask for project evidence, but they never set a skill level.</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
