import { randomBytes, randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { attempt, db, evidence, profile } from "@/db";
import { CONTENT_VERSION } from "@/content/version";
import { getRole } from "@/content/roles";
import { QUESTIONS, getAssessment } from "@/content/assessments";
import { jobsForRole } from "@/content/jobs";
import { evidenceFromScore, scoreAttempt, selectQuestions } from "./assessment";
import { computeImpact } from "./impact";
import { matchJobs } from "./matching";
import { computeReadiness } from "./readiness";
import { liveReadiness, recordSnapshot } from "./data";
import { claimedSkills } from "./resume-claims";
import { EMPTY_RESUME } from "./resume-schema";
import { logEvent } from "./events";

// Seeds a demo candidate at an exact readiness by choosing how many questions they get
// right, then running the real scorer. Nothing is hand-written: the score emerges.
const TARGET = Number(process.env.SEED_TARGET ?? 69);
const ROLE = getRole(process.env.SEED_ROLE ?? "devops-engineer");
const EMAIL = process.env.SEED_EMAIL ?? "demo@gteceducation.com";

describe.skipIf(!process.env.SEED_DEMO)("seed demo candidate", () => {
  it(`creates an account at exactly ${TARGET}% readiness`, async () => {
    const jobs = jobsForRole(ROLE.id);
    const skillIds = ROLE.skills.map((s) => s.skillId);

    const baselineDef = getAssessment(`baseline:${ROLE.id}`)!;
    const baselineId = randomUUID();
    const baselineQs = selectQuestions(baselineDef, QUESTIONS, baselineId);

    // A believable starting point: stronger on fundamentals, weak on the specialist skills.
    const strong = ["linux", "git", "comm-written", "apt-logical"];
    const weak = ["iac", "monitoring", "networking"];
    const retakeSkills = ["docker", "ci-cd"].filter((id) => skillIds.includes(id));

    /** Answer the issued questions so each skill lands on a chosen number correct. */
    const answersFor = (questions: typeof baselineQs, correctBySkill: Map<string, number>) => {
      const left = new Map(correctBySkill);
      const answers: Record<string, number> = {};
      for (const q of questions) {
        const remaining = left.get(q.skillId) ?? 0;
        const right = remaining > 0;
        if (right) left.set(q.skillId, remaining - 1);
        answers[q.id] = right ? q.answer : (q.answer + 1) % q.options.length;
      }
      return answers;
    };

    // Search only over results a candidate could actually get: whole questions right,
    // 0-3 on the baseline and 0-6 on a retake. The engine decides the score.
    const rand = (n: number) => Math.floor(Math.random() * n);
    let plan: { baseline: Map<string, number>; correct: number[] } | undefined;
    for (let attemptNo = 0; attemptNo < 40_000 && !plan; attemptNo++) {
      const baseline = new Map(
        skillIds.map((id) => [id, strong.includes(id) ? 2 + rand(2) : weak.includes(id) ? rand(2) : 1 + rand(2)] as const),
      );
      const correct = retakeSkills.map(() => 3 + rand(4));
      const baselineTry = evidenceFromScore(baselineDef, scoreAttempt(baselineQs, answersFor(baselineQs, baseline)), {
        id: baselineId,
        verified: true,
        completedAt: new Date(Date.now() - 12 * 86_400_000),
      }).map((r, i) => ({ ...r, id: `b${i}`, detail: r.detail ?? null }));
      const retakes = retakeSkills.map((skillId, i) => ({
        id: `r${i}`,
        skillId,
        type: "assessment" as const,
        source: "skill",
        refId: null,
        url: null,
        score: Math.round((correct[i] / 6) * 100),
        confidence: "medium" as const,
        verified: true,
        detail: { correct: correct[i], total: 6 },
        createdAt: new Date(),
        expiresAt: null,
      }));
      if (computeReadiness(ROLE, [...baselineTry, ...retakes], { jobs }).score === TARGET) plan = { baseline, correct };
    }
    expect(plan, `no combination of results reaches exactly ${TARGET}%`).toBeDefined();

    // ── Write it, through the same paths the app uses ───────────────
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const existing = (await admin.auth.admin.listUsers()).data.users.find((u) => u.email === EMAIL);
    if (existing) {
      for (const t of [attempt, evidence]) await db.delete(t).where(eq(t.userId, existing.id));
      await admin.auth.admin.deleteUser(existing.id);
    }
    const password = "CT-" + randomBytes(9).toString("base64url");
    const { data: created, error } = await admin.auth.admin.createUser({ email: EMAIL, password, email_confirm: true });
    expect(error, error?.message).toBeNull();
    const userId = created!.user!.id;

    const resume = {
      ...EMPTY_RESUME,
      name: "Priya Nair",
      headline: "Final-year B.E. student targeting platform engineering",
      skills: ["Linux", "Git", "Docker", "Jenkins", "AWS", "Bash"],
      education: [{ institution: "PES Institute of Technology", degree: "B.E. Computer Science", year: "2026" }],
      projects: [{ name: "Containerised CI pipeline for a class project", description: "Dockerised a Node service and deployed it from GitHub Actions.", url: "" }],
      experience: [],
      certifications: [],
      links: [],
    };

    await db.insert(profile).values({
      userId,
      email: EMAIL,
      name: resume.name,
      targetRoleId: ROLE.id,
      enrolledAt: new Date(Date.now() - 14 * 86_400_000),
      confirmedAt: new Date(Date.now() - 14 * 86_400_000),
      resume,
    });

    await db.transaction(async (tx) => {
      const claims = claimedSkills(ROLE, resume);
      await tx.insert(evidence).values(
        claims.map((skillId) => ({
          userId,
          skillId,
          type: "resume_claim" as const,
          source: "resume",
          score: 30,
          confidence: "low" as const,
          verified: false,
          detail: { title: "Listed on your confirmed resume" },
          contentVersion: CONTENT_VERSION,
          createdAt: new Date(Date.now() - 14 * 86_400_000),
        })),
      );
      await logEvent(userId, "ROLE_SELECTED", { roleId: ROLE.id }, tx);
      await logEvent(userId, "PROFILE_CONFIRMED", { claimedSkills: claims.length }, tx);
      await recordSnapshot(tx, userId, ROLE, "profile_confirmed");
    });

    /** Record one completed attempt exactly as submitAttempt would. */
    async function record(assessmentId: string, id: string, questions: typeof baselineQs, correct: Map<string, number>, daysAgo: number) {
      const def = getAssessment(assessmentId)!;
      const completedAt = new Date(Date.now() - daysAgo * 86_400_000);
      const answers = answersFor(questions, correct);
      const score = scoreAttempt(questions, answers);
      await db.transaction(async (tx) => {
        const before = await liveReadiness(userId, ROLE, tx);
        const rows = evidenceFromScore(def, score, { id, verified: true, completedAt });
        await tx.insert(attempt).values({
          id,
          userId,
          assessmentId: def.id,
          kind: def.kind,
          roleId: ROLE.id,
          questionIds: questions.map((q) => q.id),
          answers,
          score,
          verified: true,
          tabSwitches: 0,
          durationMin: def.durationMin,
          contentVersion: CONTENT_VERSION,
          startedAt: new Date(completedAt.getTime() - def.durationMin * 60_000),
          completedAt,
        });
        await tx.insert(evidence).values(rows.map((r) => ({ ...r, userId, createdAt: completedAt, contentVersion: CONTENT_VERSION })));
        const snap = await recordSnapshot(tx, userId, ROLE, `${def.kind}:${id}`);
        const impact = computeImpact(
          before.evidence.length ? before.readiness : null,
          snap.after,
          rows.map((r) => r.skillId),
          before.matches,
          matchJobs(jobs, ROLE, snap.after),
        );
        await tx.update(attempt).set({ impact }).where(eq(attempt.id, id));
        await logEvent(userId, def.kind === "baseline" ? "BASELINE_COMPLETED" : "SKILL_ASSESSMENT_COMPLETED", { attemptId: id, pct: score.pct }, tx);
      });
    }

    await record(baselineDef.id, baselineId, baselineQs, plan!.baseline, 12);
    for (const [i, skillId] of retakeSkills.entries()) {
      const id = randomUUID();
      const def = getAssessment(`skill:${skillId}`)!;
      await record(def.id, id, selectQuestions(def, QUESTIONS, id), new Map([[skillId, plan!.correct[i]]]), 6 - i * 4);
    }

    const final = await liveReadiness(userId, ROLE);
    expect(final.readiness.score).toBe(TARGET);

    const [p] = await db.select().from(profile).where(eq(profile.userId, userId));
    writeFileSync(process.env.SEED_OUT ?? "demo-credentials.json",
      JSON.stringify({
        email: EMAIL,
        password,
        readiness: final.readiness.score,
        band: final.readiness.band.label,
        role: ROLE.title,
        name: p.name,
        criticalGaps: final.readiness.gaps.critical.length,
        unlocked: final.matches.filter((m) => m.unlocked).length,
        of: final.matches.length,
        nextMove: final.readiness.nextActions[0]?.title,
      }),
    );
  }, 120_000);
});
