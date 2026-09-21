import { SubmitButton } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { Clock, ListChecks, Lock, ShieldCheck, TimerOff } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/bits";
import { attempt, db } from "@/db";
import { getAssessment } from "@/content/assessments";
import { skillName } from "@/content/skills";
import { liveReadiness, requireCandidate } from "@/lib/data";
import { GRACE_SECONDS, MAX_TAB_SWITCHES, RETAKE_COOLDOWN_HOURS, isExpired } from "@/lib/assessment";
import { currentView, totalQuestions } from "@/lib/attempt";
import { selectPrompts } from "@/lib/interview/select";
import { startAttempt } from "../../../actions";
import { Runner } from "./runner";
import { AssessmentCall } from "./call";

export const metadata: Metadata = { title: "Assessment" };

const EFFECT = {
  baseline: "This sets your starting level for every role skill. It replaces resume claims with assessed evidence and produces your first real readiness score.",
  skill: "Your result becomes the new level for this skill — up or down. It is recorded as evidence and your readiness, gaps and job matches are recalculated immediately.",
  final: "This re-tests every role skill. Passing it with no critical gaps issues your Career Card. Results replace your current levels." };

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const id = decodeURIComponent((await params).id);
  const { user, role } = await requireCandidate();
  const def = getAssessment(id);
  const roleSkills = new Set(role.skills.map((s) => s.skillId));
  if (!def || (def.roleId && def.roleId !== role.id) || !def.skillIds.every((s) => roleSkills.has(s))) notFound();

  const [last] = await db
    .select()
    .from(attempt)
    .where(and(eq(attempt.userId, user.id), eq(attempt.assessmentId, def.id)))
    .orderBy(desc(attempt.startedAt))
    .limit(1);
  const now = new Date();

  if (last && !last.completedAt) {
    // Mid-interview: the knowledge section is already scored and stored.
    if (last.stage === "interview") {
      return (
        <AssessmentCall
          attemptId={last.id}
          title="Interviewer"
          subtitle={`Career Through · ${def.title}`}
          durationMin={Math.max(10, last.interviewPromptIds.length * 4)}
        />
      );
    }
    if (!isExpired(last.startedAt, last.durationMin, now)) {
      // Answer keys never leave the server: only the public shape is passed to the client.
      const view = currentView(last, def);
      if (view) {
        return (
          <Runner
            attemptId={last.id}
            title={def.title}
            question={view.question}
            progress={view.progress}
            deadline={last.startedAt.getTime() + last.durationMin * 60_000}
            skillNames={Object.fromEntries(def.skillIds.map((s) => [s, skillName(s)]))}
          />
        );
      }
    }
  }

  // An attempt that ran out of time mid-question was never scored and added no evidence.
  const ranOut = Boolean(last && !last.completedAt && last.stage === "knowledge");
  const total = totalQuestions(def);
  const interviewCount = selectPrompts(def, role).length;
  const resultHref = last?.completedAt ? `/assessment/${encodeURIComponent(def.id)}/result?a=${last.id}` : null;
  const cooldownEnds = last?.completedAt ? last.completedAt.getTime() + RETAKE_COOLDOWN_HOURS * 3_600_000 : 0;

  let blocked: string | null = null;
  if (cooldownEnds > now.getTime()) blocked = `You can retake this in about ${Math.ceil((cooldownEnds - now.getTime()) / 3_600_000)} hour(s). Use the time to work through the plan — a retake straight away rarely changes the result.`;
  else if (def.kind === "final") {
    const { readiness } = await liveReadiness(user.id, role);
    if (readiness.gaps.critical.length > 0 || readiness.score < role.readyThreshold) {
      blocked = `Final verification opens when you have no critical gaps and at least ${role.readyThreshold}% readiness for ${role.title}. You're at ${readiness.score}% with ${readiness.gaps.critical.length} critical gap(s).`;
    }
  }

  return (
    <div className="card-soft p-6 sm:p-8">
      <Chip className="bg-secondary text-secondary-foreground ring-transparent capitalize">{def.kind === "final" ? "Final verification" : `${def.kind} assessment`}</Chip>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{def.title}</h1>

      {ranOut ? (
        <p role="status" className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <TimerOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          Your previous attempt ran out of time before it was submitted, so it was not scored and added no evidence. You can start a fresh attempt.
        </p>
      ) : null}

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-muted/60 p-4"><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><ListChecks className="size-3.5" aria-hidden />Questions</dt><dd className="mt-1 text-lg font-semibold">{total} multiple choice</dd><dd className="text-xs text-muted-foreground">then {interviewCount} interview question{interviewCount === 1 ? "" : "s"}</dd></div>
        <div className="rounded-xl bg-muted/60 p-4"><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" aria-hidden />Time limit</dt><dd className="mt-1 text-lg font-semibold">{def.durationMin} minutes</dd></div>
        <div className="rounded-xl bg-muted/60 p-4"><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" aria-hidden />Integrity</dt><dd className="mt-1 text-sm font-medium">Verified, tamper-resistant</dd></div>
      </dl>

      <h2 className="mt-6 text-sm font-semibold">Skills assessed</h2>
      <div className="mt-2 flex flex-wrap gap-1.5">{def.skillIds.map((s) => <Chip key={s} className="bg-background ring-border">{skillName(s)}</Chip>)}</div>

      <h2 className="mt-6 text-sm font-semibold">How this affects your readiness</h2>
      <p className="mt-1 text-sm text-muted-foreground">{EFFECT[def.kind]}</p>
      {last?.completedAt ? (
        <p className="mt-2 text-sm text-muted-foreground">
          You scored {last.score?.pct ?? 0}% last time. Your level is always your most recent result, so a retake replaces
          {def.kind === "baseline" ? " every level this assessment covers" : " this level"} — up or down.
        </p>
      ) : null}

      <h2 className="mt-6 text-sm font-semibold">What &ldquo;verified&rdquo; means</h2>
      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
        <li>• The timer runs on the server and starts when you click Start. It keeps running if you close the tab.</li>
        <li>• Answers are scored on the server. Your browser never receives the answer key.</li>
        <li>• Questions adapt: get one right and the next is harder, get one wrong and it steps back. Harder questions are worth more, and you cannot return to a previous one.</li>
        <li>• Skipped questions are marked wrong.</li>
        <li>• The interview that follows is written, not timed. It is recorded as evidence of how you explain your work.</li>
        <li>• Tab switches are recorded. More than {MAX_TAB_SWITCHES}, or finishing more than {GRACE_SECONDS}s late, and the result is recorded but not marked verified.</li>
      </ul>

      {blocked ? (
        <div className="mt-8 space-y-3">
          <p className="flex gap-2 rounded-xl border bg-muted/60 p-3 text-sm"><Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />{blocked}</p>
          <div className="flex flex-wrap gap-3">
            {resultHref ? <Link href={resultHref} className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}>View last result</Link> : null}
            <Link href={def.kind === "skill" ? `/plan/${def.skillIds[0]}` : "/dashboard"} className={cn(buttonVariants(), "h-10 px-5")}>{def.kind === "skill" ? "Open the plan" : "Back to dashboard"}</Link>
          </div>
        </div>
      ) : (
        <form action={startAttempt} className="mt-8 flex flex-wrap items-center gap-4">
          <input type="hidden" name="assessmentId" value={def.id} />
          <SubmitButton className="h-11 px-6 text-base" pendingLabel="Preparing your questions…">
            {last?.completedAt ? "Retake — the timer begins now" : "Start — the timer begins now"}
          </SubmitButton>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Not now</Link>
        </form>
      )}
    </div>
  );
}
