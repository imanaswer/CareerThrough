import { LinkArrow } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronRight, Lock, Target, Shield, Clock } from "lucide-react";
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
    <div className="mx-auto max-w-6xl pb-10">
      <PageHeader title="Assessments" subtitle="Assessments are how claims become evidence. Each is timed, scored on the server and records tab switches — verified, tamper-resistant." />
      
      <div className="space-y-6">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
          <Panel title="1 · Baseline" className="relative overflow-hidden group">
            <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-10 dark:opacity-20 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
              <Target className="size-48" aria-hidden />
            </div>
            
            <p className="text-base text-muted-foreground/90 dark:text-white/80 pr-12 relative z-10">Measures every {role.title} skill in one sitting, to set your starting point.</p>
            {baselineDone ? (
              <div className="mt-8 relative z-10">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400"><Check className="size-5" aria-hidden /> Completed</p>
                <Link href={link(`baseline:${role.id}`)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all rounded-full px-5 py-2">Retake baseline <LinkArrow /></Link>
                <p className="mt-3 text-xs text-muted-foreground dark:text-white/60 leading-relaxed max-w-sm">A retake replaces every level it covers — useful if your first attempt was cut short.</p>
              </div>
            ) : (
              <div className="mt-8 relative z-10">
                <Link href={link(`baseline:${role.id}`)} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all rounded-full px-6 py-2.5">Start baseline <LinkArrow /></Link>
              </div>
            )}
          </Panel>

          <Panel title="3 · Final verification" className="relative overflow-hidden group">
            <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-10 dark:opacity-20 transition-transform group-hover:scale-110 group-hover:-rotate-12 duration-700">
              <Shield className="size-48" aria-hidden />
            </div>
            
            <p className="text-base text-muted-foreground/90 dark:text-white/80 pr-12 relative z-10">Re-tests all role skills. Passing with no critical gaps issues your Career Card.</p>
            
            <div className="mt-8 relative z-10">
              {hasFinal ? (
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400"><Check className="size-5" aria-hidden /> Completed</p>
              ) : finalOpen ? (
                <Link href={link(`final:${role.id}`)} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg hover:scale-105 transition-all rounded-full px-6 py-2.5">Start final verification <LinkArrow /></Link>
              ) : (
                <div className="rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 p-4">
                  <p className="flex items-start gap-3 text-sm text-muted-foreground dark:text-white/70">
                    <Lock className="mt-0.5 size-5 shrink-0 text-amber-500" aria-hidden />
                    <span>Opens at <strong>{role.readyThreshold}% readiness</strong> with no critical gaps. You&apos;re at <strong>{readiness.score}%</strong> with <strong>{readiness.gaps.critical.length} critical gap(s)</strong>.</span>
                  </p>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <Panel
          title="2 · Skill assessments"
          action={
            baselineDone ? (
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-white/60 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full border border-white/60 dark:border-white/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> {needsWork.length} to improve
                <span className="w-px h-4 bg-foreground/10 mx-1" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {onTarget.length} on target
              </span>
            ) : null
          }
        >
          {!baselineDone ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Clock className="size-8 text-primary" aria-hidden />
              </div>
              <p className="text-lg font-medium text-foreground dark:text-white">Baseline required</p>
              <p className="text-sm text-muted-foreground dark:text-white/70 mt-2 max-w-md">Take the baseline assessment first to unlock individual skill assessments.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {[
                { skills: needsWork, title: "Below target", blurb: "Each one replaces your current level — up or down.", color: "text-amber-600 dark:text-amber-400" },
                { skills: onTarget, title: "Meeting target", blurb: "Re-verify to keep the evidence fresh, or to push the level higher.", color: "text-emerald-600 dark:text-emerald-400" },
              ]
                .filter((g) => g.skills.length)
                .map((group) => (
                  <section key={group.title}>
                    <div className="flex items-baseline gap-3 mb-4">
                      <h3 className={cn("text-lg font-bold tracking-tight", group.color)}>
                        {group.title} <span className="text-muted-foreground/50 font-normal ml-1">· {group.skills.length}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-white/60">{group.blurb}</p>
                    </div>
                    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          {completed.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground dark:text-white/60">No assessments yet. Your attempts and results will be listed here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-foreground/5 dark:divide-white/10">
              {completed.map((a) => (
                <li key={a.id} className="group flex flex-wrap items-center justify-between gap-4 py-4 transition-colors hover:bg-white/40 dark:hover:bg-white/5 -mx-4 px-4 rounded-2xl">
                  <div>
                    <p className="font-semibold text-foreground dark:text-white text-base">{getAssessment(a.assessmentId)?.title ?? a.assessmentId}</p>
                    <p className="text-sm text-muted-foreground dark:text-white/60 mt-1">{shortDate(a.completedAt!)} · content {a.contentVersion}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Verified verified={a.verified} />
                    <Chip className="bg-white dark:bg-black/40 border border-foreground/10 dark:border-white/20 text-sm py-1 shadow-sm font-bold tabular-nums">{a.score?.pct ?? 0}%</Chip>
                    <Link href={`${link(a.assessmentId)}/result?a=${a.id}`} className="flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors">
                      Result <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

/** One skill, framed around the action: where you are, what it needs, and the assessment. */
function AssessmentCard({ skill, href }: { skill: SkillReadiness; href: string }) {
  const distance = Math.max(-skill.gap, 0);
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-bold leading-tight text-foreground dark:text-white text-[15px]">{skill.name}</h4>
        <StatusChip status={skill.status} />
      </div>

      <div className="mt-4 bg-white/50 dark:bg-black/20 rounded-2xl p-4 border border-foreground/5 dark:border-white/5">
        <p className="flex items-baseline gap-1.5 mb-3">
          <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground dark:text-white">{skill.level}<span className="text-xl">%</span></span>
          <span className="text-sm font-medium text-muted-foreground dark:text-white/60">/ {skill.target}% target</span>
        </p>
        <LevelBar level={skill.level} target={skill.target} status={skill.status} label={skill.name} />
      </div>

      <p className="mt-4 flex-1 text-sm font-medium text-muted-foreground/80 dark:text-white/70">
        {!skill.assessed
          ? "Not assessed yet — mostly unproven."
          : distance > 0
            ? <span className="text-amber-600 dark:text-amber-400">{distance} points to requirement{skill.blocksJobs ? ` · blocks ${skill.blocksJobs} job${skill.blocksJobs === 1 ? "" : "s"}` : ""}</span>
            : skill.reassessRecommended
              ? <span className="text-indigo-600 dark:text-indigo-400">Verified {timeAgo(skill.lastVerifiedAt!)} — due for reassessment</span>
              : `Verified ${timeAgo(skill.lastVerifiedAt!)}`}
      </p>

      <Link href={href} className={cn(buttonVariants({ variant: skill.gap < 0 ? "default" : "secondary" }), "mt-5 h-12 w-full rounded-xl font-semibold shadow-sm transition-all hover:scale-[1.02]")}>
        {!skill.assessed ? "Take assessment" : skill.gap < 0 ? "Improve level" : "Re-verify"}
        <LinkArrow />
      </Link>
    </article>
  );
}
