"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { attempt, db, evidence, interviewResponse, profile } from "@/db";
import { CONTENT_VERSION } from "@/content/version";
import { ROLES, getRole } from "@/content/roles";
import type { Role } from "@/content/taxonomy";
import { getAssessment } from "@/content/assessments";
import { getPlan } from "@/content/plans";
import { jobsForRole } from "@/content/jobs";
import { getProfile, getUser, liveReadiness, recordSnapshot, requireCandidate, requireUser, type Tx } from "@/lib/data";
import { logEvent } from "@/lib/events";
import { resumeSchema } from "@/lib/resume-schema";
import { claimedSkills } from "@/lib/resume-claims";
import { RESUME_CLAIM_CAP } from "@/lib/readiness";
import { RETAKE_COOLDOWN_HOURS, isExpired, isVerified } from "@/lib/assessment";
import { currentView, evidenceFromAdaptive, nextQuestion, scoreAttemptAdaptive, totalQuestions } from "@/lib/attempt";
import { countWords, selectPrompts } from "@/lib/interview/select";
import { RUBRIC_VERSION, evaluateAnswer } from "@/lib/interview/provider";
import { getPrompt } from "@/content/interview";
import { computeImpact } from "@/lib/impact";
import { SCORING_VERSION } from "@/lib/adaptive";
import { matchJobs } from "@/lib/matching";
import { supabaseServer } from "@/lib/supabase/server";

export type ActionResult = { error: string; values?: Record<string, string> } | { ok: true; message?: string };

const roleIds = ROLES.map((r) => r.id) as [string, ...string[]];

// ── Auth ───────────────────────────────────────────────────────

const credentials = z.object({ email: z.email(), password: z.string().min(8, "Use at least 8 characters.").max(72) });
const safeNext = (next: unknown) => (typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");

export async function signIn(_: ActionResult | null, form: FormData): Promise<ActionResult> {
  const parsed = credentials.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error?.code === "email_not_confirmed") return { error: "Your email isn't confirmed yet. Open the confirmation link we sent you, then sign in." };
  if (error) return { error: "That email and password don't match. Try again or create an account." };
  redirect(safeNext(form.get("next")));
}

export async function signUp(_: ActionResult | null, form: FormData): Promise<ActionResult> {
  const parsed = credentials.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await supabaseServer();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext(form.get("next")))}` },
  });
  if (error) {
    const friendly: Record<string, string> = {
      over_email_send_rate_limit: "Too many confirmation emails were requested just now. Wait a few minutes and try again.",
      email_address_invalid: "That email address was rejected. Use a real inbox you can open — the confirmation link is sent there.",
      weak_password: "Choose a stronger password (at least 8 characters).",
    };
    return { error: friendly[error.code ?? ""] ?? error.message };
  }
  // Supabase hides whether an email exists: an already-registered address comes back with no identities.
  if (data.user && data.user.identities?.length === 0) return { error: "An account with this email already exists. Sign in instead." };
  if (!data.session) return { ok: true, message: `We sent a confirmation link to ${parsed.data.email}. Open it on this device to finish creating your account (check spam too).` };
  redirect(safeNext(form.get("next")));
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}

// ── Enrollment ─────────────────────────────────────────────────

/** Free in v1: pricing is not decided, so there is no checkout and no fake price. */
export async function enroll(form: FormData) {
  const roleId = z.enum(roleIds).parse(form.get("roleId"));
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/roles/${roleId}`)}`);
  const existing = await getProfile(user.id);
  if (existing?.targetRoleId === roleId) redirect(existing.confirmedAt ? "/dashboard" : "/onboarding");

  await db.transaction(async (tx) => {
    const now = new Date();
    await tx
      .insert(profile)
      .values({ userId: user.id, email: user.email, targetRoleId: roleId, enrolledAt: now })
      .onConflictDoUpdate({ target: profile.userId, set: { targetRoleId: roleId, enrolledAt: now } });
    await logEvent(user.id, "ROLE_SELECTED", { roleId }, tx);
    await logEvent(user.id, "ENROLLMENT_COMPLETED", { roleId, pricing: "free_v1" }, tx);
    // Switching role: existing evidence still counts for shared skills, so re-score against the new role.
    if (existing?.confirmedAt) await recordSnapshot(tx, user.id, getRole(roleId), "role_changed");
  });
  redirect(existing?.confirmedAt ? "/dashboard" : "/onboarding");
}

// ── Profile ────────────────────────────────────────────────────

/** The user has reviewed and edited the parsed resume. Only now does it become (capped) evidence. */
export async function confirmProfile(input: unknown): Promise<ActionResult> {
  const parsed = resumeSchema.safeParse(input);
  if (!parsed.success) return { error: "Some fields are too long or invalid. Please review and try again." };
  const resume = parsed.data;
  if (!resume.name) return { error: "Please add your name." };

  const user = await requireUser();
  const p = await getProfile(user.id);
  if (!p?.targetRoleId) return { error: "Choose a target role first." };
  const role = getRole(p.targetRoleId);

  await db.transaction(async (tx) => {
    await tx.update(profile).set({ name: resume.name, resume, confirmedAt: new Date() }).where(eq(profile.userId, user.id));
    await tx.delete(evidence).where(and(eq(evidence.userId, user.id), eq(evidence.type, "resume_claim")));
    const claims = claimedSkills(role, resume);
    if (claims.length) {
      await tx.insert(evidence).values(
        claims.map((skillId) => ({
          userId: user.id,
          skillId,
          type: "resume_claim" as const,
          source: "resume",
          score: RESUME_CLAIM_CAP,
          confidence: "low" as const,
          verified: false,
          detail: { title: "Listed on your confirmed resume" },
          contentVersion: CONTENT_VERSION,
        })),
      );
      await logEvent(user.id, "EVIDENCE_ADDED", { type: "resume_claim", skills: claims }, tx);
    }
    await logEvent(user.id, "PROFILE_CONFIRMED", { claimedSkills: claims.length }, tx);
    await recordSnapshot(tx, user.id, role, "profile_confirmed");
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

// ── Assessments ────────────────────────────────────────────────

export async function startAttempt(form: FormData) {
  const assessmentId = z.string().max(80).parse(form.get("assessmentId"));
  const { user, role } = await requireCandidate();
  const def = getAssessment(assessmentId);
  const path = `/assessment/${encodeURIComponent(assessmentId)}`;
  if (!def) redirect("/assessments");

  // Only assessments that belong to the candidate's role.
  const roleSkills = new Set(role.skills.map((s) => s.skillId));
  if ((def.roleId && def.roleId !== role.id) || !def.skillIds.every((s) => roleSkills.has(s))) redirect("/assessments");

  const [last] = await db
    .select()
    .from(attempt)
    .where(and(eq(attempt.userId, user.id), eq(attempt.assessmentId, def.id)))
    .orderBy(desc(attempt.startedAt))
    .limit(1);
  const now = new Date();
  if (last && !last.completedAt && !isExpired(last.startedAt, last.durationMin, now)) redirect(path); // resume open attempt
  if (last?.completedAt && now.getTime() - last.completedAt.getTime() < RETAKE_COOLDOWN_HOURS * 3_600_000) redirect(path);
  if (def.kind === "final") {
    const { readiness } = await liveReadiness(user.id, role);
    if (readiness.gaps.critical.length > 0 || readiness.score < role.readyThreshold) redirect(path);
  }

  const id = randomUUID();
  // Only the first question is issued. The rest are chosen as the candidate answers,
  // so the paper adapts and the browser never holds what comes next.
  const first = nextQuestion({ id, assessmentId: def.id, kind: def.kind, questionIds: [], answers: {}, stage: "knowledge" }, def);
  if (!first) redirect("/assessments");
  await db.transaction(async (tx) => {
    await tx.insert(attempt).values({
      id,
      userId: user.id,
      assessmentId: def.id,
      kind: def.kind,
      roleId: role.id,
      questionIds: [first.id],
      answers: {},
      stage: "knowledge",
      durationMin: def.durationMin,
      contentVersion: CONTENT_VERSION,
      scoringVersion: SCORING_VERSION,
      startedAt: now,
    });
    const started = { baseline: "BASELINE_STARTED", skill: "SKILL_ASSESSMENT_STARTED", final: "FINAL_ASSESSMENT_STARTED" } as const;
    await logEvent(user.id, started[def.kind], { assessmentId: def.id, attemptId: id }, tx);
  });
  redirect(path);
}

const answerInput = z.object({
  attemptId: z.uuid(),
  questionId: z.string().max(80),
  choice: z.number().int().min(0).max(9).nullable(),
  tabSwitches: z.number().int().min(0).max(999),
});

export type AnswerResult =
  | { error: string }
  | { done: false; question: { id: string; skillId: string; topicId: string; prompt: string; options: string[] }; progress: { answered: number; total: number; difficulty: number } }
  | { done: true; stage: "interview" };

/**
 * Record one answer and hand back the next question. The choice is all the client sends;
 * correctness, difficulty and the score stay on the server.
 */
export async function answerQuestion(input: unknown): Promise<AnswerResult> {
  const parsed = answerInput.safeParse(input);
  if (!parsed.success) return { error: "That answer was not valid." };
  const { attemptId, questionId, choice, tabSwitches } = parsed.data;
  const { user } = await requireCandidate();

  return db.transaction(async (tx): Promise<AnswerResult> => {
    const [a] = await tx.select().from(attempt).where(and(eq(attempt.id, attemptId), eq(attempt.userId, user.id))).limit(1);
    const def = a && getAssessment(a.assessmentId);
    if (!a || !def || a.stage !== "knowledge" || a.completedAt) return { error: "This assessment is no longer open." };
    if (isExpired(a.startedAt, a.durationMin, new Date())) return { error: "Time is up. Submit to see your result." };
    // Only the question actually on screen can be answered, and only once.
    if (a.questionIds.at(-1) !== questionId) return { error: "That question is no longer the current one." };

    const answers = { ...(a.answers ?? {}), ...(choice === null ? {} : { [questionId]: choice }) };
    const asked = choice === null ? { ...answers, [questionId]: -1 } : answers; // skipped counts as wrong
    const next = nextQuestion({ ...a, answers: asked }, def);

    if (next) {
      await tx
        .update(attempt)
        .set({ answers: asked, questionIds: [...a.questionIds, next.id], tabSwitches })
        .where(eq(attempt.id, a.id));
      const view = currentView({ ...a, answers: asked, questionIds: [...a.questionIds, next.id] }, def)!;
      return { done: false, question: view.question, progress: view.progress };
    }

    // Knowledge section finished: move to the interview.
    const prompts = selectPrompts(def, getRole(a.roleId));
    await tx
      .update(attempt)
      .set({ answers: asked, tabSwitches, stage: "interview", interviewPromptIds: prompts.map((p) => p.id) })
      .where(eq(attempt.id, a.id));
    return { done: true, stage: "interview" };
  });
}

const interviewInput = z.object({
  attemptId: z.uuid(),
  promptId: z.string().max(80),
  answer: z.string().max(6000),
  seconds: z.number().int().min(0).max(36_000),
  skipped: z.boolean().optional(),
});

export type InterviewResult = { error: string } | { done: false; promptId: string } | { done: true; resultPath: string };

/** Store one interview answer, then move on or finish the attempt. */
export async function submitInterviewAnswer(input: unknown): Promise<InterviewResult> {
  const parsed = interviewInput.safeParse(input);
  if (!parsed.success) return { error: "That answer was not valid." };
  const { attemptId, promptId, answer, seconds, skipped } = parsed.data;
  const { user, role } = await requireCandidate();

  const outcome = await db.transaction(async (tx): Promise<InterviewResult> => {
    const [a] = await tx.select().from(attempt).where(and(eq(attempt.id, attemptId), eq(attempt.userId, user.id))).limit(1);
    const def = a && getAssessment(a.assessmentId);
    if (!a || !def || a.stage !== "interview") return { error: "This interview is no longer open." };

    const answered = await tx.select({ promptId: interviewResponse.promptId }).from(interviewResponse).where(eq(interviewResponse.attemptId, a.id));
    const done = new Set(answered.map((r) => r.promptId));
    const expected = a.interviewPromptIds.find((id) => !done.has(id));
    if (expected !== promptId) return { error: "That question is no longer the current one." };

    const prompt = getPrompt(promptId);
    if (!prompt) return { error: "That question could not be found." };
    const words = countWords(answer);
    if (!skipped && words < 10) return { error: `Please write a fuller answer — at least ${prompt.minWords} words is a realistic interview response.` };

    // Evaluation is deferred until a scorer exists. Nothing is scored optimistically.
    const evaluated = skipped ? null : await evaluateAnswer({ prompt, answer, words, seconds });
    await tx.insert(interviewResponse).values({
      userId: user.id,
      attemptId: a.id,
      promptId,
      skillId: prompt.skillId ?? null,
      roleId: role.id,
      answer: skipped ? "" : answer,
      words: skipped ? 0 : words,
      seconds,
      status: skipped ? "skipped" : evaluated?.status === "scored" ? "scored" : "pending",
      rubric: evaluated?.status === "scored" ? evaluated.evaluation.rubric : null,
      score: evaluated?.status === "scored" ? evaluated.evaluation.score : null,
      feedback: evaluated?.status === "scored" ? evaluated.evaluation.feedback : null,
      provider: evaluated?.status === "scored" ? evaluated.evaluation.provider : null,
      model: evaluated?.status === "scored" ? evaluated.evaluation.model : null,
      rubricVersion: RUBRIC_VERSION,
      contentVersion: CONTENT_VERSION,
      scoredAt: evaluated?.status === "scored" ? new Date() : null,
    });

    const nextPrompt = a.interviewPromptIds.find((id) => !done.has(id) && id !== promptId);
    if (nextPrompt) return { done: false, promptId: nextPrompt };
    return { done: true, resultPath: await finalizeAttempt(tx, user.id, role, a.id) };
  });

  if ("done" in outcome && outcome.done) revalidatePath("/", "layout");
  return outcome;
}

/** Score the knowledge section, write evidence, snapshot readiness and record the impact. */
async function finalizeAttempt(tx: Tx, userId: string, role: Role, attemptId: string): Promise<string> {
  const [a] = await tx.select().from(attempt).where(eq(attempt.id, attemptId)).limit(1);
  const def = getAssessment(a.assessmentId)!;
  const completedAt = new Date();
  const verified = isVerified({ startedAt: a.startedAt, completedAt, durationMin: a.durationMin, tabSwitches: a.tabSwitches });
  const score = scoreAttemptAdaptive(a, def);

  const jobs = jobsForRole(role.id);
  const before = await liveReadiness(userId, role, tx);
  const rows = evidenceFromAdaptive(def, score, { id: a.id, verified, completedAt });
  await tx.insert(evidence).values(rows.map((r) => ({ ...r, userId, contentVersion: a.contentVersion })));
  await logEvent(userId, "EVIDENCE_ADDED", { type: "assessment", attemptId: a.id, skills: rows.map((r) => r.skillId) }, tx);

  const snap = await recordSnapshot(tx, userId, role, `${def.kind}:${a.id}`);
  const impact = computeImpact(
    before.evidence.length ? before.readiness : null,
    snap.after,
    rows.map((r) => r.skillId),
    before.matches,
    matchJobs(jobs, role, snap.after),
  );
  await tx
    .update(attempt)
    .set({ score, impact, verified, stage: "complete", completedAt, scoringVersion: score.scoringVersion })
    .where(eq(attempt.id, a.id));

  const done = { baseline: "BASELINE_COMPLETED", skill: "SKILL_ASSESSMENT_COMPLETED", final: "FINAL_ASSESSMENT_COMPLETED" } as const;
  await logEvent(userId, done[def.kind], { attemptId: a.id, pct: score.pct, verified, tabSwitches: a.tabSwitches }, tx);

  if (def.kind === "final" && snap.after.gaps.critical.length === 0 && snap.after.score >= role.readyThreshold) {
    const p = await getProfileTx(tx, userId);
    if (p && !p.cardSlug) {
      await tx.update(profile).set({ cardSlug: randomUUID().replace(/-/g, "").slice(0, 12) }).where(eq(profile.userId, userId));
      await logEvent(userId, "CAREER_CARD_CREATED", { roleId: role.id, readiness: snap.after.score }, tx);
    }
  }
  return `/assessment/${encodeURIComponent(a.assessmentId)}/result?a=${a.id}`;
}

async function getProfileTx(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], userId: string) {
  const [row] = await tx.select().from(profile).where(eq(profile.userId, userId)).limit(1);
  return row;
}

// ── Plan ───────────────────────────────────────────────────────

/** Tracks practice only. Finishing content never changes readiness — evidence does. */
export async function completePlanDay(form: FormData) {
  const { skillId, day } = z
    .object({ skillId: z.string().max(60), day: z.coerce.number().int().min(0).max(9) })
    .parse(Object.fromEntries(form));
  const { user, role } = await requireCandidate();
  const plan = getPlan(skillId);
  if (!plan || !plan.days[day] || !role.skills.some((s) => s.skillId === skillId)) return;
  await logEvent(user.id, "PLAN_DAY_COMPLETED", { skillId, day });
  revalidatePath("/plan", "layout");
  revalidatePath("/dashboard");
}

// ── Project evidence ───────────────────────────────────────────

const httpsUrl = z.url({ protocol: /^https$/ }).max(300);
const projectInput = z.object({
  repoUrl: httpsUrl.refine((u) => ["github.com", "gitlab.com", "bitbucket.org"].includes(new URL(u).hostname), {
    message: "Use a github.com, gitlab.com or bitbucket.org repository link.",
  }),
  liveUrl: httpsUrl.optional(),
  demoUrl: httpsUrl.optional(),
});

/**
 * Deterministic link validation only — v1 makes no claim of human review.
 * We only ever call the GitHub API with a parsed owner/repo (never fetch a user-supplied URL).
 */
async function validateRepo(repoUrl: string): Promise<"recorded" | "pending" | "not_found"> {
  const u = new URL(repoUrl);
  if (u.hostname !== "github.com") return "pending";
  const [owner, repo] = u.pathname.split("/").filter(Boolean);
  if (!owner || !repo || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return "not_found";
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo.replace(/\.git$/, "")}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (res.status === 404) return "not_found";
    return res.ok ? "recorded" : "pending";
  } catch {
    return "pending";
  }
}

export async function submitProject(_: ActionResult | null, form: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries([...form].filter(([, v]) => typeof v === "string" && v.trim() !== ""));
  // React resets a form after its action runs, so errors hand the typed values back.
  const values = raw as Record<string, string>;
  const parsed = projectInput.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const { user, role } = await requireCandidate();

  const status = await validateRepo(parsed.data.repoUrl);
  if (status === "not_found") return { error: "We couldn't find a public repository at that link. Check the URL and that the repo is public.", values };

  await db.transaction(async (tx) => {
    await tx.delete(evidence).where(and(eq(evidence.userId, user.id), eq(evidence.type, "project"), eq(evidence.refId, role.project.id)));
    await tx.insert(evidence).values(
      role.project.skillIds.map((skillId) => ({
        userId: user.id,
        skillId,
        type: "project" as const,
        source: "project",
        refId: role.project.id,
        url: parsed.data.repoUrl,
        score: null,
        confidence: "high" as const,
        verified: false, // no human review in v1
        detail: { title: role.project.title, status, liveUrl: parsed.data.liveUrl, demoUrl: parsed.data.demoUrl },
        contentVersion: CONTENT_VERSION,
      })),
    );
    await logEvent(user.id, "PROJECT_SUBMITTED", { projectId: role.project.id, status }, tx);
    await logEvent(user.id, "EVIDENCE_ADDED", { type: "project", skills: role.project.skillIds }, tx);
    await recordSnapshot(tx, user.id, role, `project:${role.project.id}`);
  });
  revalidatePath("/", "layout");
  return {
    ok: true,
    message: status === "recorded" ? "Repository found. Project evidence recorded." : "Submitted. Link validation is pending.",
  };
}

// ── Career Card ────────────────────────────────────────────────

export async function setCardVisibility(form: FormData) {
  const isPublic = form.get("public") === "true";
  const { user, profile: p } = await requireCandidate();
  if (!p.cardSlug) return; // no card yet: nothing to share
  await db.update(profile).set({ cardPublic: isPublic }).where(eq(profile.userId, user.id));
  await logEvent(user.id, isPublic ? "CAREER_CARD_SHARED" : "CAREER_CARD_HIDDEN", { slug: p.cardSlug });
  revalidatePath("/card");
  revalidatePath(`/c/${p.cardSlug}`);
}
