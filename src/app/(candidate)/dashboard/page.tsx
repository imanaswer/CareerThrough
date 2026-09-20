import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ClipboardCheck, FolderCheck, Lock, LockOpen, Target, TrendingUp } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Chip, EmptyState, Gauge, Panel } from "@/components/bits";
import { Journey } from "@/components/journey";
import { NextMove } from "@/components/next-move";
import { NextUnlock } from "@/components/next-unlock";
import { SkillCard, SkillLine } from "@/components/skill-card";
import { WhyNotReady } from "@/components/why-not-ready";
import { ReadinessWhy } from "@/components/readiness-why";
import { ReadinessTrend, SkillsRadar } from "@/components/charts";
import { CONTENT_VERSION } from "@/content/version";
import { DIMENSION_LABELS } from "@/content/taxonomy";
import { getJob } from "@/content/jobs";
import { CONFIDENCE_LABELS } from "@/lib/readiness";
import { getCandidateState, requireCandidate } from "@/lib/data";
import { shortDate, timeAgo } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { user, profile, role } = await requireCandidate();
  const state = await getCandidateState(user.id, profile, role);
  const { readiness, matches, evidence, snapshots, journey, baselineDone, unlock } = state;
  const baselineHref = `/assessment/${encodeURIComponent(`baseline:${role.id}`)}`;
  const first = profile.name.split(" ")[0] || "there";

  const header = (
    <header className="mb-6">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Target className="size-3.5" aria-hidden />
        {role.title}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back, {first}</h1>
    </header>
  );

  if (!baselineDone) {
    return (
      <>
        {header}
        <Panel title="Your career journey" className="mb-5"><Journey stages={journey} /></Panel>
        <EmptyState
          icon={ClipboardCheck}
          title="Take your baseline to see how ready you are"
          body={`Your profile is a starting claim. The baseline measures every ${role.title} skill so we can show your real readiness, your gaps and what to do first.`}
          href={baselineHref}
          cta="Start baseline assessment"
        />
      </>
    );
  }

  const [nba, ...upNext] = readiness.nextActions;
  const bySkill = new Map(readiness.perSkill.map((p) => [p.skillId, p]));
  const critical = readiness.gaps.critical.map((id) => bySkill.get(id)!);
  const gapSkills = readiness.perSkill.filter((p) => p.gap < 0);
  const unlocked = matches.filter((m) => m.unlocked);
  const conf = { strong: 0, medium: 0, low: 0, none: 0 };
  for (const p of readiness.perSkill) conf[p.confidence]++;
  const prev = snapshots.at(-2);
  const delta = prev ? readiness.score - prev.score : 0;
  const nextBand = role.bands.find((b) => b.min > readiness.score);
  const baselineScore = snapshots.find((s) => s.trigger.startsWith("baseline"))?.score;
  const stale = readiness.perSkill.filter((p) => p.reassessRecommended);
  const zeroStart = readiness.score === 0;

  return (
    <>
      {header}

      {nba ? (
        <div className="mb-5">
          <NextMove action={nba} upNext={upNext} formulaVersion={readiness.formulaVersion} />
        </div>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
            <Panel title="Where do I stand?" action={<ReadinessWhy role={role} readiness={readiness} contentVersion={CONTENT_VERSION} />}>
              <Gauge score={readiness.score} label={`${role.title} readiness`} />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Chip className="bg-secondary text-secondary-foreground ring-transparent">{readiness.band.label}</Chip>
                {delta ? (
                  <Chip className={delta > 0 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}>
                    <TrendingUp className="size-3" aria-hidden />{delta > 0 ? "+" : ""}{delta} since last update
                  </Chip>
                ) : null}
              </div>
              {zeroStart ? (
                <p className="mt-4 rounded-xl bg-muted/60 p-3 text-center text-sm">
                  <span className="font-medium">This is your starting measurement, not a verdict.</span> 0 means we haven&apos;t proven these skills yet —
                  we&apos;ve identified {readiness.perSkill.length} to work through, starting with the one above.
                </p>
              ) : (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {readiness.band.access}.{nextBand ? ` ${nextBand.label} starts at ${nextBand.min}% for this role.` : ""}
                </p>
              )}
              <div className="mt-4 flex justify-center">
                <WhyNotReady role={role} readiness={readiness} contentVersion={CONTENT_VERSION} />
              </div>
              <dl className="mt-4 space-y-1.5 border-t pt-4 text-sm">
                {readiness.dimensions.map((d) => (
                  <div key={d.dimension} className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">{DIMENSION_LABELS[d.dimension]}</dt>
                    <dd className={cn("tabular-nums", d.pct === null && "text-xs text-muted-foreground")}>{d.pct !== null ? `${d.pct}%` : d.note}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel title={unlock ? "Next unlock" : "Opportunities"}>
              {unlock ? (
                <NextUnlock unlock={unlock} />
              ) : (
                <div className="flex h-full flex-col justify-center text-center">
                  <p className="text-3xl font-semibold tabular-nums">{unlocked.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {unlocked.length === matches.length
                      ? `Every ${role.title} opportunity is unlocked. Keep your evidence fresh to stay eligible.`
                      : "opportunities unlocked"}
                  </p>
                  <Link href="/jobs" className={cn(buttonVariants({ variant: "secondary" }), "mt-4 h-9")}>View opportunities</Link>
                </div>
              )}
            </Panel>
          </div>

          <Panel
            title={critical.length ? `Critical gaps (${critical.length})` : gapSkills.length ? `Skill gaps (${gapSkills.length})` : "Skill gaps"}
            action={<Link href="/plan" className="text-xs font-medium text-primary hover:underline">Open my plan →</Link>}
          >
            {gapSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">Every role skill meets its target. Keep your evidence fresh and move to final verification.</p>
            ) : (
              <div className="space-y-3">
                {(critical.length ? critical : gapSkills).slice(0, 3).map((s) => (
                  <SkillCard key={s.skillId} skill={s} evidence={evidence} formulaVersion={readiness.formulaVersion} />
                ))}
                {(critical.length ? critical : gapSkills).length > 3 ? (
                  <p className="text-xs text-muted-foreground">
                    Plus {(critical.length ? critical : gapSkills).length - 3} more — <Link href="/plan" className="text-primary hover:underline">see your full plan</Link>.
                  </p>
                ) : null}
              </div>
            )}
          </Panel>

          <Panel title="My skills vs the role target" action={<Link href="/evidence" className="text-xs font-medium text-primary hover:underline">All evidence →</Link>}>
            <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-6 lg:grid-cols-2">
              <SkillsRadar data={readiness.perSkill.map((p) => ({ skill: p.name.length > 16 ? p.name.slice(0, 15) + "…" : p.name, level: p.level, target: p.target }))} />
              <div className="min-w-0 divide-y">
                {readiness.perSkill.map((s) => <SkillLine key={s.skillId} skill={s} />)}
              </div>
            </div>
          </Panel>

          <Panel title="Your career journey"><Journey stages={journey} /></Panel>
        </div>

        <aside className="space-y-5" aria-label="Status">
          <Panel title="How strong is my evidence?">
            <p className="text-sm">
              <span className="text-2xl font-semibold tabular-nums">{readiness.evidenceCoverage.assessed}</span>
              <span className="text-muted-foreground"> of {readiness.evidenceCoverage.total} skills assessed</span>
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {(["strong", "medium", "low", "none"] as const).map((k) => (
                <li key={k} className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">{CONFIDENCE_LABELS[k]}</span>
                  <span className="font-semibold tabular-nums">{conf[k]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Claim → assess → practise → verify. Resume claims cap at 30%; a project raises confidence on assessed skills.</p>
            {stale.length ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
                {stale.length} {stale.length === 1 ? "skill needs" : "skills need"} reassessment: {stale.map((s) => s.name).join(", ")}
              </p>
            ) : null}
          </Panel>

          <Panel title="Opportunities" action={<Link href="/jobs" className="text-xs font-medium text-primary hover:underline">All →</Link>}>
            <p className="text-sm">
              <span className="text-2xl font-semibold tabular-nums">{unlocked.length}</span>
              <span className="text-muted-foreground"> of {matches.length} unlocked</span>
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {unlocked.slice(0, 3).map((m) => (
                <li key={m.jobId} className="flex gap-2">
                  <LockOpen className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                  <span>{getJob(m.jobId)?.title} <span className="text-muted-foreground">· {m.matchPct}% match</span></span>
                </li>
              ))}
              {!unlocked.length ? (
                <li className="flex gap-2 text-muted-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                  Nothing unlocked yet — the next one is {getJob(unlock?.match.jobId ?? "")?.title ?? "shown above"}.
                </li>
              ) : null}
            </ul>
          </Panel>

          <Panel title="Progress">
            {snapshots.length > 1 ? (
              <>
                <ReadinessTrend data={snapshots.map((s) => ({ date: new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), score: s.score }))} />
                <dl className="mt-3 space-y-1.5 text-sm">
                  {baselineScore !== undefined ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Since baseline</dt>
                      <dd className="font-semibold tabular-nums">{readiness.score - baselineScore >= 0 ? "+" : ""}{readiness.score - baselineScore} points</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Critical gaps</dt>
                    <dd className="font-semibold tabular-nums">{readiness.gaps.critical.length}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Assessments completed</dt>
                    <dd className="font-semibold tabular-nums">{state.completed.length}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Verified skills</dt>
                    <dd className="font-semibold tabular-nums">{readiness.perSkill.filter((p) => p.assessed && p.gap >= 0).length}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-muted-foreground">{snapshots.length} snapshots since {shortDate(snapshots[0].createdAt)}, each versioned so past scores stay reproducible.</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Your trend appears after your next piece of evidence. Readiness only moves when evidence does — not when you study.</p>
            )}
          </Panel>

          <Panel title="Recent evidence" action={<Link href="/evidence" className="text-xs font-medium text-primary hover:underline">All →</Link>}>
            <ul className="space-y-2.5 text-sm">
              {evidence.slice(0, 5).map((e) => (
                <li key={e.id} className="flex gap-2">
                  <FolderCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    {bySkill.get(e.skillId)?.name ?? e.skillId}
                    {e.type === "assessment" && e.score !== null ? ` — ${Math.round(e.score)}%` : e.type === "project" ? " — project" : " — resume claim"}
                    <span className="block text-xs text-muted-foreground">{timeAgo(e.createdAt)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Career Card">
            <p className="text-sm text-muted-foreground">
              {profile.cardSlug
                ? `Issued. ${profile.cardPublic ? "Public — anyone with the link can view it." : "Private — only you can see it."}`
                : "Issued when you pass final verification with no critical gaps."}
            </p>
            <Link href="/card" className={cn(buttonVariants({ variant: "secondary" }), "mt-3 h-9 w-full")}>
              {profile.cardSlug ? "Open Career Card" : "See what's required"}
              <BadgeCheck className="size-4" aria-hidden />
            </Link>
          </Panel>
        </aside>
      </div>
    </>
  );
}
