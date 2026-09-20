import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { attempt, careerEvent, db, evidence, interviewResponse, profile, readinessSnapshot } from "@/db";
import { CONTENT_VERSION } from "@/content/version";
import { getRole } from "@/content/roles";
import { jobsForRole } from "@/content/jobs";
import type { Role } from "@/content/taxonomy";
import { supabaseConfigured, supabaseServer } from "./supabase/server";
import { FORMULA_VERSION, computeReadiness, type EvidenceItem, type Readiness } from "./readiness";
import { matchJobs, type JobMatch } from "./matching";
import { nextUnlock, withProjectedImpact } from "./simulate";
import { computeJourney } from "./journey";
import { logEvent } from "./events";

export type Profile = typeof profile.$inferSelect;
export type Attempt = typeof attempt.$inferSelect;
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const getUser = cache(async () => {
  if (!supabaseConfigured) return null;
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const [row] = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
  return row ?? null;
});

/** Signed in, enrolled in a role and profile confirmed — otherwise send them to the right step. */
export async function requireCandidate() {
  const user = await requireUser();
  const p = await getProfile(user.id);
  if (!p?.targetRoleId) redirect("/#roles");
  if (!p.confirmedAt) redirect("/onboarding");
  return { user, profile: p, role: getRole(p.targetRoleId) };
}

export async function getEvidence(userId: string, tx: Tx | typeof db = db): Promise<EvidenceItem[]> {
  return tx.select().from(evidence).where(eq(evidence.userId, userId)).orderBy(desc(evidence.createdAt));
}

async function hasFinalAttempt(userId: string, roleId: string, tx: Tx | typeof db = db) {
  const [row] = await tx
    .select({ id: attempt.id })
    .from(attempt)
    .where(and(eq(attempt.userId, userId), eq(attempt.assessmentId, `final:${roleId}`), isNotNull(attempt.completedAt)))
    .limit(1);
  return Boolean(row);
}

/** Compute live readiness + job matches from evidence. Pure read: nothing is stored. */
export async function liveReadiness(userId: string, role: Role, tx: Tx | typeof db = db) {
  const [items, hasFinal] = await Promise.all([getEvidence(userId, tx), hasFinalAttempt(userId, role.id, tx)]);
  const jobs = jobsForRole(role.id);
  const readiness = computeReadiness(role, items, { jobs, hasFinal });
  const matches = matchJobs(jobs, role, readiness);
  // What each recommendation would change, from the same engines. Stored on the snapshot
  // so the assessment result page can show the projection the candidate was given.
  readiness.nextActions = withProjectedImpact(role, readiness, matches, items, jobs);
  return { readiness, matches, evidence: items, hasFinal, unlock: nextUnlock(matches) };
}

/**
 * The one place readiness is persisted. Call inside the transaction that added evidence.
 * Stores a versioned snapshot and logs what changed, including newly unlocked jobs.
 */
export async function recordSnapshot(tx: Tx, userId: string, role: Role, trigger: string) {
  const [prev] = await tx
    .select()
    .from(readinessSnapshot)
    .where(and(eq(readinessSnapshot.userId, userId), eq(readinessSnapshot.roleId, role.id)))
    .orderBy(desc(readinessSnapshot.createdAt))
    .limit(1);

  const { readiness, matches } = await liveReadiness(userId, role, tx);
  const unlockedJobIds = matches.filter((m) => m.unlocked).map((m) => m.jobId);

  await tx.insert(readinessSnapshot).values({
    userId,
    roleId: role.id,
    score: readiness.score,
    band: readiness.band.id,
    breakdown: readiness,
    gaps: readiness.gaps,
    nextActions: readiness.nextActions,
    unlockedJobIds,
    trigger,
    formulaVersion: FORMULA_VERSION,
    contentVersion: CONTENT_VERSION,
  });
  await logEvent(userId, "READINESS_UPDATED", { from: prev?.score ?? null, to: readiness.score, trigger }, tx);
  const before = new Set(prev?.unlockedJobIds ?? []);
  for (const jobId of unlockedJobIds.filter((id) => !before.has(id))) {
    await logEvent(userId, "JOB_UNLOCKED", { jobId, readiness: readiness.score }, tx);
  }

  return { before: (prev?.breakdown as Readiness | undefined) ?? null, after: readiness, matchesAfter: matches };
}

/** Everything the candidate screens need, in one round of parallel queries. */
export async function getCandidateState(userId: string, p: Profile, role: Role) {
  const [live, snapshots, attempts, events, interviews] = await Promise.all([
    liveReadiness(userId, role),
    db
      .select({
        id: readinessSnapshot.id,
        score: readinessSnapshot.score,
        band: readinessSnapshot.band,
        gaps: readinessSnapshot.gaps,
        trigger: readinessSnapshot.trigger,
        formulaVersion: readinessSnapshot.formulaVersion,
        contentVersion: readinessSnapshot.contentVersion,
        createdAt: readinessSnapshot.createdAt,
      })
      .from(readinessSnapshot)
      .where(and(eq(readinessSnapshot.userId, userId), eq(readinessSnapshot.roleId, role.id)))
      .orderBy(readinessSnapshot.createdAt),
    db
      .select()
      .from(attempt)
      .where(and(eq(attempt.userId, userId), eq(attempt.roleId, role.id)))
      .orderBy(desc(attempt.startedAt)),
    db
      .select()
      .from(careerEvent)
      .where(and(eq(careerEvent.userId, userId), eq(careerEvent.eventType, "PLAN_DAY_COMPLETED"))),
    db
      .select({ status: interviewResponse.status, score: interviewResponse.score })
      .from(interviewResponse)
      .where(eq(interviewResponse.userId, userId)),
  ]);

  const interview = {
    answered: interviews.filter((r) => r.status !== "skipped").length,
    scored: interviews.filter((r) => r.status === "scored").length,
    average: (() => {
      const scores = interviews.map((r) => r.score).filter((n): n is number => n !== null);
      return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    })(),
  };

  const completed = attempts.filter((a) => a.completedAt);
  const baselineDone = completed.some((a) => a.kind === "baseline");
  const baselineSnapshot = snapshots.find((s) => s.trigger.startsWith("baseline"));
  const hasProject = live.evidence.some((e) => e.type === "project");

  const journey = computeJourney({
    roleId: p.targetRoleId,
    roleTitle: role.title,
    profileConfirmed: Boolean(p.confirmedAt),
    claimedSkills: live.evidence.filter((e) => e.type === "resume_claim").length,
    baselineDone,
    actedOnGaps: completed.some((a) => a.kind !== "baseline") || events.length > 0 || hasProject,
    criticalGapsAtBaseline: baselineSnapshot?.gaps.critical.length ?? live.readiness.gaps.critical.length,
    criticalGapsNow: live.readiness.gaps.critical.length,
    skillAssessments: completed.filter((a) => a.kind === "skill").length,
    evidenceCount: live.evidence.length,
    assessedSkills: live.readiness.evidenceCoverage.assessed,
    totalSkills: live.readiness.evidenceCoverage.total,
    hasProject,
    finalDone: live.hasFinal,
    hasCard: Boolean(p.cardSlug),
    cardPublic: p.cardPublic,
    unlockedJobs: live.matches.filter((m) => m.unlocked).length,
    totalJobs: live.matches.length,
  });

  const planDone = new Set(events.map((e) => `${e.metadata.skillId}:${e.metadata.day}`));

  return { ...live, snapshots, attempts, completed, baselineDone, hasProject, journey, planDone, interview };
}

export type CandidateState = Awaited<ReturnType<typeof getCandidateState>>;
export type { JobMatch };

export function cardStatus(role: Role, r: Readiness, hasFinal: boolean): "Ready" | "Developing" | "Not yet ready" {
  if (hasFinal && r.gaps.critical.length === 0 && r.score >= role.readyThreshold) return "Ready";
  return r.score >= (role.bands.find((b) => b.id === "developing")?.min ?? 40) ? "Developing" : "Not yet ready";
}
