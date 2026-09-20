import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

// Runs only when a real Postgres is provided: TEST_DATABASE_URL=postgres://... npm test
const url = process.env.TEST_DATABASE_URL;
if (url) process.env.POSTGRES_URL = url;

describe.skipIf(!url)("data layer against Postgres", () => {
  it("evidence → versioned snapshot → state, journey and unlock events", async () => {
    const { db, profile, evidence, readinessSnapshot, careerEvent } = await import("@/db");
    const { getRole } = await import("@/content/roles");
    const { QUESTIONS, getAssessment } = await import("@/content/assessments");
    const { evidenceFromAdaptive } = await import("./attempt");
    const { scoreAdaptive, startDifficulty } = await import("./adaptive");
    const { selectQuestions } = await import("./assessment");
    const { getCandidateState, recordSnapshot } = await import("./data");
    const { CONTENT_VERSION } = await import("@/content/version");

    const userId = randomUUID();
    const role = getRole("qa-engineer");
    await db.insert(profile).values({ userId, name: "Test Candidate", targetRoleId: role.id, enrolledAt: new Date(), confirmedAt: new Date() });

    // Resume claim only: capped, nothing unlocked.
    await db.insert(evidence).values({ userId, skillId: "manual-testing", type: "resume_claim", source: "resume", score: 30, confidence: "low", contentVersion: CONTENT_VERSION });
    const first = await db.transaction((tx) => recordSnapshot(tx, userId, role, "profile_confirmed"));
    expect(first.before).toBeNull();
    expect(first.after.perSkill.find((p) => p.skillId === "manual-testing")?.level).toBe(30);

    // A perfect baseline, scored by the real engine.
    const def = getAssessment(`baseline:${role.id}`)!;
    const issued = selectQuestions(def, QUESTIONS, "seed");
    const score = scoreAdaptive(
      issued.map((q) => ({ question: q, choice: q.answer })),
      startDifficulty("baseline"),
      Object.fromEntries(def.skillIds.map((id) => [id, def.questionsPerSkill])),
      "seed",
    );
    const rows = evidenceFromAdaptive(def, score, { id: randomUUID(), verified: true, completedAt: new Date() });
    const second = await db.transaction(async (tx) => {
      await tx.insert(evidence).values(rows.map((r) => ({ ...r, userId, contentVersion: CONTENT_VERSION })));
      return recordSnapshot(tx, userId, role, "baseline:test");
    });
    expect(second.before?.score).toBe(first.after.score);
    // Knowledge alone is capped: a perfect paper cannot claim industry readiness on its own.
    expect(second.after.score).toBeLessThanOrEqual(84);
    expect(second.after.score).toBeGreaterThan(50);

    const [p] = await db.select().from(profile).where(eq(profile.userId, userId));
    const state = await getCandidateState(userId, p, role);
    expect(state.readiness.score).toBe(second.after.score);
    expect(state.snapshots).toHaveLength(2);
    expect(state.snapshots[1]).toMatchObject({ formulaVersion: "readiness-v1", contentVersion: CONTENT_VERSION });
    // No project yet → project-gated jobs stay locked, the rest unlock.
    expect(state.matches.some((m) => m.unlocked)).toBe(true);
    expect(state.matches.filter((m) => !m.unlocked).every((m) => m.blockers.some((b) => b.kind === "project"))).toBe(true);

    const events = await db.select().from(careerEvent).where(eq(careerEvent.userId, userId));
    expect(events.filter((e) => e.eventType === "READINESS_UPDATED")).toHaveLength(2);
    expect(events.some((e) => e.eventType === "JOB_UNLOCKED")).toBe(true);

    // Historical snapshot is stored whole, so it stays reproducible.
    const [snap] = await db.select().from(readinessSnapshot).where(eq(readinessSnapshot.userId, userId)).limit(1);
    expect(snap.breakdown.perSkill.length).toBe(role.skills.length);

    for (const t of [careerEvent, readinessSnapshot, evidence]) await db.delete(t).where(eq(t.userId, userId));
    await db.delete(profile).where(eq(profile.userId, userId));
  });
});
