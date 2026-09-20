import { LinkArrow } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Chip, PageHeader, Panel, StatusChip, Verified } from "@/components/bits";
import { getAssessment } from "@/content/assessments";
import { getCandidateState, requireCandidate } from "@/lib/data";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Assessments" };

export default async function AssessmentsPage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, completed, baselineDone, hasFinal } = await getCandidateState(user.id, profile, role);
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

        <Panel title="2 · Skill assessments">
          {!baselineDone ? <p className="text-sm text-muted-foreground">Take the baseline first. Skill assessments then let you update one skill at a time.</p> : (
            <ul className="divide-y">
              {readiness.perSkill.map((s) => (
                <li key={s.skillId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{s.name}</span><StatusChip status={s.status} /><span className="text-sm tabular-nums text-muted-foreground">{s.level}% / {s.target}%</span></div>
                  <Link href={link(`skill:${s.skillId}`)} className="text-sm font-medium text-primary hover:underline">{s.gap < 0 ? "Take assessment" : "Re-verify"} →</Link>
                </li>
              ))}
            </ul>
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
