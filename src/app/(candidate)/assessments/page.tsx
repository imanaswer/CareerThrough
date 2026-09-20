import { LinkArrow } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Chip, LevelBar, PageHeader, Panel, StatusChip, Verified } from "@/components/bits";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import type { SkillReadiness } from "@/lib/readiness";
import { shortDate, timeAgo } from "@/lib/format";
import { getAssessment } from "@/content/assessments";
import { getCandidateState, requireCandidate } from "@/lib/data";

export const metadata: Metadata = { title: "Assessments" };

export default async function AssessmentsPage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, completed, baselineDone, hasFinal } = await getCandidateState(user.id, profile, role);
  // Weakest first: the assessment you most need is the one furthest below its target.
  const needsWork = readiness.perSkill.filter((p) => p.gap < 0).sort((a, b) => a.level / a.target - b.level / b.target);
  const onTarget = readiness.perSkill.filter((p) => p.gap >= 0).sort((a, b) => Number(b.reassessRecommended) - Number(a.reassessRecommended) || b.level - a.level);
  const finalOpen = baselineDone && readiness.gaps.critical.length === 0 && readiness.score >= role.readyThreshold;
  const link = (id: string) => `/assessment/${encodeURIComponent(id)}`;

  return (
    <>
      <PageHeader title="Assessments" subtitle="Assessments are how claims become evidence. Each is timed, scored on the server and records tab switches — verified, tamper-resistant." />
      <div className="space-y-5">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
          <Panel title="1 · Baseline">
            <p className="text-sm text-muted-foreground">Measures every {role.title} skill in one sitting, to set your starting point.</p>
            {baselineDone ? (
              <>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700"><Check className="size-4" aria-hidden />Completed</p>
                <Link href={link(`baseline:${role.id}`)} className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline">Retake the baseline <LinkArrow /></Link>
                <p className="mt-1 text-xs text-muted-foreground">A retake replaces every level it covers — useful if your first attempt was cut short or submitted by accident.</p>
              </>
            ) : (
              <Link href={link(`baseline:${role.id}`)} className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline">Start baseline <LinkArrow /></Link>
            )}
          </Panel>
          <Panel title="3 · Final verification">
            <p className="text-sm text-muted-foreground">Re-tests all role skills. Passing with no critical gaps issues your Career Card.</p>
            {hasFinal ? <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700"><Check className="size-4" aria-hidden />Completed</p> : finalOpen ? <Link href={link(`final:${role.id}`)} className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline">Start final verification <LinkArrow /></Link> : <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><Lock className="mt-0.5 size-4 shrink-0" aria-hidden />Opens at {role.readyThreshold}% readiness with no critical gaps. You&apos;re at {readiness.score}% with {readiness.gaps.critical.length} critical gap(s).</p>}
          </Panel>
        </div>

        <Panel
          title="2 · Skill assessments"
          action={
            baselineDone ? (
              <span className="text-xs text-muted-foreground">
                {needsWork.length} to improve · {onTarget.length} meeting target
              </span>
            ) : null
          }
        >
          {!baselineDone ? (
            <p className="text-sm text-muted-foreground">Take the baseline first. Skill assessments then let you update one skill at a time.</p>
          ) : (
            <div className="space-y-5">
              {[
                { skills: needsWork, title: "Below target", blurb: "Each one replaces your current level — up or down." },
                { skills: onTarget, title: "Meeting target", blurb: "Re-verify to keep the evidence fresh, or to push the level higher." },
              ]
                .filter((g) => g.skills.length)
                .map((group) => (
                  <section key={group.title}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.title} <span className="font-normal">· {group.skills.length}</span>
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{group.blurb}</p>
                    <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {group.skills.map((s) => (
                        <li key={s.skillId}>
                          <AssessmentCard skill={s} href={link(`skill:${s.skillId}`)} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          )}
        </Panel>

        <Panel title="History">
          {completed.length === 0 ? <p className="text-sm text-muted-foreground">No assessments yet. Your attempts and results will be listed here.</p> : (
            <ul className="divide-y">
              {completed.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div><p className="font-medium">{getAssessment(a.assessmentId)?.title ?? a.assessmentId}</p><p className="text-xs text-muted-foreground">{shortDate(a.completedAt!)} · content {a.contentVersion}</p></div>
                  <div className="flex items-center gap-3"><Verified verified={a.verified} /><Chip className="bg-background ring-border tabular-nums">{a.score?.pct ?? 0}%</Chip><Link href={`${link(a.assessmentId)}/result?a=${a.id}`} className="font-medium text-primary hover:underline">Result →</Link></div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

/** One skill, framed around the action: where you are, what it needs, and the assessment. */
function AssessmentCard({ skill, href }: { skill: SkillReadiness; href: string }) {
  const distance = Math.max(-skill.gap, 0);
  return (
    <article className="flex h-full flex-col rounded-2xl border p-4 transition-colors hover:border-primary/30 hover:bg-muted/30">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium leading-tight">{skill.name}</h4>
        <StatusChip status={skill.status} />
      </div>

      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tabular-nums">{skill.level}%</span>
        <span className="text-sm text-muted-foreground">/ {skill.target}% target</span>
      </p>
      <div className="mt-2"><LevelBar level={skill.level} target={skill.target} status={skill.status} label={skill.name} /></div>

      <p className="mt-2 flex-1 text-xs text-muted-foreground">
        {!skill.assessed
          ? "Not assessed yet — this is mostly unproven."
          : distance > 0
            ? `${distance} points to the requirement${skill.blocksJobs ? ` · blocks ${skill.blocksJobs} ${skill.blocksJobs === 1 ? "opportunity" : "opportunities"}` : ""}`
            : skill.reassessRecommended
              ? `Verified ${timeAgo(skill.lastVerifiedAt!)} — due for reassessment`
              : `Verified ${timeAgo(skill.lastVerifiedAt!)}`}
      </p>

      <Link href={href} className={cn(buttonVariants({ variant: skill.gap < 0 ? "default" : "secondary" }), "mt-3 h-9 w-full")}>
        {!skill.assessed ? "Take assessment" : skill.gap < 0 ? "Improve this level" : "Re-verify"}
        <LinkArrow />
      </Link>
    </article>
  );
}
