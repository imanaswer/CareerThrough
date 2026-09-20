import { LinkArrow } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowRight, BadgeCheck, Check, LockOpen, TrendingUp, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Panel, Verified } from "@/components/bits";
import { attempt, db } from "@/db";
import { getAssessment } from "@/content/assessments";
import { getSkill, skillName } from "@/content/skills";
import { getJob } from "@/content/jobs";
import { liveReadiness, requireCandidate } from "@/lib/data";

export const metadata: Metadata = { title: "Assessment result" };

export default async function ResultPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ a?: string }> }) {
  const id = decodeURIComponent((await params).id);
  const attemptId = (await searchParams).a;
  const { user, role } = await requireCandidate();
  if (!attemptId || !/^[0-9a-f-]{36}$/i.test(attemptId)) notFound();

  const [a] = await db.select().from(attempt).where(and(eq(attempt.id, attemptId), eq(attempt.userId, user.id), eq(attempt.assessmentId, id))).limit(1);
  const def = getAssessment(id);
  if (!a?.completedAt || !a.score || !a.impact || !def) notFound();
  const { score, impact } = a;
  // The recommendation is "what to do now", so it comes from live state, not the stored snapshot.
  const { readiness } = await liveReadiness(user.id, role);
  const nba = readiness.nextActions[0];
  const roleSkill = new Map(role.skills.map((s) => [s.skillId, s]));
  const single = def.kind === "skill";

  return (
    <div className="space-y-5">
      <div className="surface-hero rounded-3xl p-7 sm:p-9">
        <p className="text-sm text-white/80">{def.title} · submitted</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-semibold tabular-nums tracking-tight">{score.pct}%</p>
            <p className="mt-1 text-white/85">{score.correct} of {score.total} correct</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Role readiness</p>
            <p className="text-2xl font-semibold tabular-nums">
              {impact.scoreBefore !== null ? <>{impact.scoreBefore}% <ArrowRight className="inline size-5" aria-label="to" /> </> : null}
              {impact.scoreAfter}%
            </p>
            {impact.scoreBefore !== null ? (
              <p className="text-sm text-white/85">{impact.delta > 0 ? `+${impact.delta}` : impact.delta} readiness points{impact.bandChanged ? ` · ${impact.bandChanged}` : ""}</p>
            ) : <p className="text-sm text-white/85">Your first assessed readiness</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Verified verified={a.verified} />
        <span>{a.tabSwitches} tab switch{a.tabSwitches === 1 ? "" : "es"} recorded · content {a.contentVersion}</span>
      </div>
      {!a.verified ? (
        <p role="status" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          This attempt went over the time limit or had too many tab switches, so it is recorded but not marked verified. The score still counts; a clean retake will restore the verified mark.
        </p>
      ) : null}

      {impact.delta < 0 ? (
        <p className="rounded-xl border bg-muted/60 p-3 text-sm">Your readiness went down because your level is always your most recent assessed score — evidence, not your best attempt. The plan below targets exactly what slipped.</p>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3">
        <StatTile label="Readiness" value={`${impact.scoreAfter}`} sub={impact.scoreBefore !== null ? `from ${impact.scoreBefore} · ${impact.delta >= 0 ? "+" : ""}${impact.delta}` : "first measurement"} tone={impact.delta > 0 ? "up" : impact.delta < 0 ? "down" : "flat"} />
        <StatTile
          label="Critical gaps"
          value={impact.criticalGaps ? `${impact.criticalGaps.before} → ${impact.criticalGaps.after}` : `${readiness.gaps.critical.length}`}
          sub={impact.criticalGaps && impact.criticalGaps.after < impact.criticalGaps.before ? "gaps closed" : "remaining"}
          tone={impact.criticalGaps && impact.criticalGaps.after < impact.criticalGaps.before ? "up" : "flat"}
        />
        <StatTile
          label="Opportunities"
          value={impact.unlockedJobIds.length ? `+${impact.unlockedJobIds.length}` : "0"}
          sub={impact.unlockedJobIds.length ? "newly unlocked" : "no new unlocks"}
          tone={impact.unlockedJobIds.length ? "up" : "flat"}
        />
      </div>

      <Panel title={single ? "Breakdown by topic" : "Breakdown by skill"}>
        <ul className="space-y-3">
          {single
            ? getSkill(def.skillIds[0]).topics.map((t) => {
                const s = score.bySkill[def.skillIds[0]]?.topics[t.id];
                return s ? <Row key={t.id} name={t.name} pct={s.pct} sub={`${s.correct}/${s.total}`} /> : null;
              })
            : Object.entries(score.bySkill).map(([skillId, s]) => {
                const target = roleSkill.get(skillId)?.target ?? 0;
                return <Row key={skillId} name={skillName(skillId)} pct={s.pct} target={target} sub={`${s.correct}/${s.total} · target ${target}%`} />;
              })}
        </ul>
        {def.kind === "baseline" ? <p className="mt-4 text-xs text-muted-foreground">The baseline asks 3 questions per skill, so levels are coarse. A skill assessment (6 questions) gives a sharper reading.</p> : null}
      </Panel>

      <div className="grid gap-5 sm:grid-cols-2">
        <Panel title="Evidence added">
          <ul className="space-y-2 text-sm">
            {impact.skills.map((s) => (
              <li key={s.skillId} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2"><Check className="size-4 text-emerald-600" aria-hidden />{s.name}</span>
                <span className="tabular-nums text-muted-foreground">{s.before}% → <span className="font-medium text-foreground">{s.after}%</span></span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="What changed">
          <ul className="space-y-2 text-sm">
            {impact.notes.map((n) => <li key={n} className="flex gap-2"><TrendingUp className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />{n}</li>)}
            {impact.unlockedJobIds.map((jid) => (
              <li key={jid} className="flex gap-2"><LockOpen className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /><span>Unlocked: <Link href="/jobs" className="font-medium text-primary hover:underline">{getJob(jid)?.title} at {getJob(jid)?.company}</Link></span></li>
            ))}
            {impact.remainingGaps.length ? (
              <li className="text-muted-foreground">Still below target: {impact.remainingGaps.map((s, i) => (
                <span key={s}>{i ? ", " : ""}<Link href={`/plan/${s}`} className="text-primary hover:underline">{skillName(s)}</Link></span>
              ))}</li>
            ) : null}
            {!impact.notes.length && !impact.unlockedJobIds.length && !impact.remainingGaps.length ? <li className="text-muted-foreground">Every skill in this assessment meets its target.</li> : null}
          </ul>
        </Panel>
      </div>

      {def.kind === "final" ? (
        <p className="flex gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
          <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          {impact.remainingGaps.some((s) => roleSkill.get(s)?.priority === "critical") || impact.scoreAfter < role.readyThreshold
            ? "Final verification recorded, but it surfaced gaps that must be closed before your Career Card is issued."
            : "Final verification passed. Your Career Card has been issued — it's private until you choose to share it."}
        </p>
      ) : null}

      {nba ? (
        <Panel title="Your next move">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">{nba.title}</p>
              {nba.current !== null && nba.target !== null ? (
                <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">{nba.current}% → {nba.target}%</p>
              ) : null}
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{nba.why}</p>
              {nba.impact ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  If you reach {nba.impact.to}%: <span className="font-medium text-foreground">+{nba.impact.deltaScore} readiness</span>
                  {nba.impact.unlockedJobIds.length ? `, unlocking ${nba.impact.unlockedJobIds.length} ${nba.impact.unlockedJobIds.length === 1 ? "opportunity" : "opportunities"}` : ""}.
                </p>
              ) : null}
            </div>
            <Link href={nba.href} className={cn(buttonVariants({ variant: "secondary" }), "h-10 shrink-0 px-4")}>
              {nba.action} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Panel>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className={cn(buttonVariants(), "h-11 px-6 text-base")}>View your updated readiness <LinkArrow /></Link>
        {def.kind === "final" ? <Link href="/card" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6 text-base")}>Open Career Card</Link> : null}
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "up" | "down" | "flat" }) {
  return (
    <div className="card-soft p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tabular-nums", tone === "up" && "text-emerald-700", tone === "down" && "text-rose-600")}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Row({ name, pct, sub, target }: { name: string; pct: number; sub: string; target?: number }) {
  const ok = target === undefined ? pct >= 75 : pct >= target;
  return (
    <li>
      <div className="flex justify-between gap-3 text-sm"><span className="font-medium">{name}</span><span className="tabular-nums"><span className="font-semibold">{pct}%</span> <span className="text-muted-foreground">({sub})</span></span></div>
      <div className="relative mt-1.5 h-2 rounded-full bg-muted">
        <div className={cn("h-full rounded-full", ok ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${pct}%` }} />
        {target !== undefined ? <div className="absolute -top-1 h-4 w-0.5 rounded bg-foreground/70" style={{ left: `${target}%` }} aria-hidden /> : null}
      </div>
    </li>
  );
}
