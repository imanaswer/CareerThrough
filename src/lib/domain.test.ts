import { describe, expect, it } from "vitest";
import { ROLES, getRole } from "@/content/roles";
import { SKILLS, getSkill } from "@/content/skills";
import { QUESTIONS, getAssessment, questionsForSkill } from "@/content/assessments";
import { PLANS } from "@/content/plans";
import { JOBS, jobsForRole } from "@/content/jobs";
import { bands, type Job, type Question, type Role } from "@/content/taxonomy";
import { FORMULA_VERSION, INTERVIEW_PASS, KNOWLEDGE_ONLY_CAP, RESUME_CLAIM_CAP, computeReadiness, type EvidenceItem } from "./readiness";
import { matchJob, matchJobs, requiredReadiness } from "./matching";
import { nextUnlock, projectSkillImpact } from "./simulate";
import { claimedSkills } from "./resume-claims";
import { EMPTY_RESUME } from "./resume-schema";
import { isVerified, toPublic } from "./assessment";
import { difficultyOf, nextDifficulty, pickQuestion, scoreAdaptive, startDifficulty, SCORING_VERSION } from "./adaptive";
import { evidenceFromAdaptive } from "./attempt";
import { selectPrompts } from "./interview/select";
import { evaluateAnswer, interviewScoringAvailable } from "./interview/provider";
import { rubricToScore } from "./interview/rubric";
import { analyseAnswer } from "./interview/feedback";
import { answersByPrompt, nextInterviewerTurn, type Turn } from "./interview/conductor";
import { INTERVIEW_PROMPTS, promptsForRole, promptsForSkill } from "@/content/interview";
import { computeJourney } from "./journey";
import { computeImpact } from "./impact";

const NOW = new Date("2026-09-19T00:00:00Z");
let n = 0;
function ev(skillId: string, score: number | null, over: Partial<EvidenceItem> = {}): EvidenceItem {
  return {
    id: `e${++n}`, skillId, type: "assessment", source: "skill", refId: null, url: null, score,
    confidence: "medium", verified: true, detail: { correct: 3, total: 6 },
    createdAt: new Date("2026-09-01T00:00:00Z"), expiresAt: null, ...over,
  };
}

// Tiny role so the arithmetic is checkable by hand.
const role: Role = {
  ...getRole("qa-engineer"),
  skills: [
    { skillId: "manual-testing", target: 80, weight: 3, priority: "critical" },
    { skillId: "sql", target: 60, weight: 1, priority: "important" },
  ],
};

describe("content integrity", () => {
  it("every skill has 4 topics, 8 questions (2 per topic) and a 5-day plan", () => {
    for (const s of SKILLS) {
      expect(s.topics, s.id).toHaveLength(4);
      const qs = QUESTIONS.filter((q) => q.skillId === s.id);
      expect(qs, s.id).toHaveLength(8);
      for (const t of s.topics) expect(qs.filter((q) => q.topicId === t.id), t.id).toHaveLength(2);
      const plan = PLANS.find((p) => p.skillId === s.id);
      expect(plan?.days.map((d) => d.topicId), s.id).toEqual([...s.topics.map((t) => t.id), null]);
    }
  });
  it("questions are well-formed and ids are unique", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(q.options, q.id).toHaveLength(4);
      expect(new Set(q.options).size, q.id).toBe(4);
      expect(q.answer >= 0 && q.answer < 4, q.id).toBe(true);
    }
  });
  it("roles and jobs only reference known skills; jobs only need skills the role measures", () => {
    const known = new Set(SKILLS.map((s) => s.id));
    for (const r of ROLES) {
      for (const s of r.skills) expect(known.has(s.skillId), `${r.id}:${s.skillId}`).toBe(true);
      for (const p of r.skills.flatMap((s) => s.prerequisites ?? [])) expect(known.has(p), p).toBe(true);
      expect(jobsForRole(r.id).length).toBeGreaterThanOrEqual(5);
    }
    for (const j of JOBS) {
      const roleSkills = new Set(getRole(j.roleId).skills.map((s) => s.skillId));
      for (const s of [...j.skills, ...j.hardRequirements]) expect(roleSkills.has(s.skillId), `${j.id}:${s.skillId}`).toBe(true);
    }
  });
});

describe("readiness", () => {
  it("no evidence → 0, foundation, nothing assumed", () => {
    const r = computeReadiness(role, [], { now: NOW });
    expect(r.score).toBe(0);
    expect(r.band.id).toBe("foundation");
    expect(r.perSkill.every((p) => p.status === "no_evidence" && p.confidence === "none")).toBe(true);
    expect(r.gaps.critical).toEqual(["manual-testing"]);
  });
  it("resume-only evidence is capped and low confidence", () => {
    const r = computeReadiness(role, [ev("manual-testing", 95, { type: "resume_claim", source: "resume", confidence: "low" })], { now: NOW });
    const p = r.perSkill[0];
    expect(p.level).toBe(RESUME_CLAIM_CAP);
    expect(p.confidence).toBe("low");
    expect(p.assessed).toBe(false);
    expect(p.explanation).toContain("capped");
  });
  it("assessed evidence beats a resume claim, and the latest assessment wins", () => {
    const r = computeReadiness(role, [
      ev("manual-testing", 30, { type: "resume_claim", source: "resume" }),
      ev("manual-testing", 40, { createdAt: new Date("2026-08-01") }),
      ev("manual-testing", 70, { createdAt: new Date("2026-09-10"), detail: { correct: 4, total: 6 } }),
    ], { now: NOW });
    expect(r.perSkill[0].level).toBe(70);
    expect(r.perSkill[0].explanation).toContain("4 of 6 correct");
  });
  it("weights skills and clips at target", () => {
    // manual 40/80 = .5 (w3), sql 100 clipped to 1 (w1) → (1.5 + 1) / 4 = 62.5 → 63
    const r = computeReadiness(role, [ev("manual-testing", 40), ev("sql", 100)], { now: NOW });
    expect(r.score).toBe(63);
    expect(r.perSkill[1].contribution).toBe(r.perSkill[1].maxContribution);
    expect(r.strengths).toEqual(["sql"]);
  });
  it("classifies gaps by the role's priorities", () => {
    const r = computeReadiness(role, [ev("manual-testing", 75), ev("sql", 20)], { now: NOW });
    expect(r.gaps).toEqual({ critical: ["manual-testing"], important: ["sql"], nice: [] });
    expect(r.perSkill[0].status).toBe("close");
    expect(r.perSkill[1].status).toBe("gap");
  });
  it("uses role-specific band thresholds — the same score is a different band per role", () => {
    const strict: Role = { ...role, bands: bands({ entry_ready: 65 }) };
    const e = [ev("manual-testing", 40), ev("sql", 100)]; // 63
    expect(computeReadiness(role, e, { now: NOW }).band.id).toBe("entry_ready"); // QA floor 58
    expect(computeReadiness(strict, e, { now: NOW }).band.id).toBe("developing");
  });
  it("stamps the formula version and excludes interview from the number", () => {
    const r = computeReadiness(getRole("qa-engineer"), [], { now: NOW });
    expect(r.formulaVersion).toBe(FORMULA_VERSION);
    expect(r.dimensions.find((d) => d.dimension === "interview")).toEqual({ dimension: "interview", pct: null, note: "Not yet assessed" });
    expect(r.perSkill.some((p) => p.dimension === "interview")).toBe(false);
  });
  it("ignores expired evidence and says so", () => {
    const r = computeReadiness(role, [ev("manual-testing", 90, { expiresAt: new Date("2026-01-01") })], { now: NOW });
    expect(r.perSkill[0].level).toBe(0);
    expect(r.perSkill[0].hasExpiredEvidence).toBe(true);
    expect(r.perSkill[0].explanation).toContain("expired");
  });
  it("a project strengthens confidence but never sets a level", () => {
    const proj = ev("sql", null, { type: "project", source: "project", confidence: "high" });
    expect(computeReadiness(role, [proj], { now: NOW }).perSkill[1]).toMatchObject({ level: 0, confidence: "low" });
    expect(computeReadiness(role, [proj, ev("sql", 70)], { now: NOW }).perSkill[1]).toMatchObject({ level: 70, confidence: "strong" });
  });
  it("is deterministic", () => {
    const e = [ev("manual-testing", 55), ev("sql", 45)];
    expect(computeReadiness(role, e, { now: NOW })).toEqual(computeReadiness(role, e, { now: NOW }));
  });
});

describe("next best action", () => {
  const qa = getRole("qa-engineer");
  const jobs = jobsForRole(qa.id);
  it("puts critical gaps that block jobs first, with a reason", () => {
    const e = qa.skills.map((s) => ev(s.skillId, s.skillId === "api-testing" ? 40 : 90));
    const [first] = computeReadiness(qa, e, { now: NOW, jobs }).nextActions;
    expect(first).toMatchObject({ kind: "plan", skillId: "api-testing", href: "/plan/api-testing" });
    expect(first.blocksJobs).toBeGreaterThan(0);
    expect(first.why).toContain("critical");
  });
  it("asks for an assessment when a gap has no assessed evidence", () => {
    const [first] = computeReadiness(qa, [], { now: NOW, jobs }).nextActions;
    expect(first.kind).toBe("assess");
  });
  it("pulls an unmet prerequisite ahead of the skill that needs it", () => {
    const fe = getRole("frontend-developer");
    const e = fe.skills.map((s) => ev(s.skillId, ["react", "javascript"].includes(s.skillId) ? 40 : 95));
    const ids = computeReadiness(fe, e, { now: NOW, jobs: jobsForRole(fe.id) }).nextActions.map((a) => a.skillId);
    expect(ids.indexOf("javascript")).toBeLessThan(ids.indexOf("react"));
  });
  it("offers final verification once critical gaps are closed and the role threshold is reached", () => {
    const e = qa.skills.map((s) => ev(s.skillId, 95));
    expect(computeReadiness(qa, e, { now: NOW, jobs }).nextActions[0].kind).toBe("final");
  });
});

describe("matching", () => {
  const job: Job = {
    id: "j", roleId: role.id, title: "t", company: "c", location: "l", employmentType: "Full-time", level: "entry",
    summary: "", minReadiness: 50, skills: [{ skillId: "manual-testing", weight: 2 }, { skillId: "sql", weight: 1 }],
    hardRequirements: [{ skillId: "manual-testing", min: 75, requiresAssessed: true }, { skillId: "sql", min: 60 }],
  };
  const ctx = (manual: number, sql: number) => computeReadiness(role, [ev("manual-testing", manual), ev("sql", sql)], { now: NOW });

  it("hard requirements met → eligible and unlocked", () => {
    const m = matchJob(job, role, ctx(80, 70));
    expect(m).toMatchObject({ eligible: true, unlocked: true, matchPct: 100, summary: "Eligible based on current role requirements." });
    expect(m.meets).toHaveLength(2);
  });
  it("hard requirement failed → locked with the exact reason and a link to fix it", () => {
    const m = matchJob(job, role, ctx(71, 70));
    expect(m.unlocked).toBe(false);
    expect(m.missing).toHaveLength(1);
    expect(m.missing[0]).toMatchObject({ skillId: "manual-testing", current: 71, required: 75, reason: "below", href: "/plan/manual-testing" });
    expect(m.missing[0].message).toContain("reach 75%");
    expect(m.summary).toBe("One remaining requirement.");
  });
  it("reports multiple missing skills", () => {
    expect(matchJob(job, role, ctx(50, 20)).missing.map((x) => x.skillId)).toEqual(["manual-testing", "sql"]);
  });
  it("a resume claim cannot satisfy a requirement that needs assessed evidence", () => {
    const r = computeReadiness(role, [ev("manual-testing", 30, { type: "resume_claim", source: "resume" }), ev("sql", 70)], { now: NOW });
    expect(matchJob({ ...job, hardRequirements: [{ skillId: "manual-testing", min: 20, requiresAssessed: true }] }, role, r).missing[0].reason).toBe("not_assessed");
  });
  it("eligible but below the readiness band stays locked", () => {
    const m = matchJob({ ...job, minReadiness: 99 }, role, ctx(76, 60)); // readiness 96
    expect(m.eligible).toBe(true);
    expect(m.unlocked).toBe(false);
    expect(m.blockers[0].kind).toBe("readiness");
  });
  it("unlock threshold is role-specific", () => {
    const strict: Role = { ...role, bands: bands({ entry_ready: 72 }) };
    expect(requiredReadiness(job, role)).toBe(58); // QA entry floor
    expect(requiredReadiness(job, strict)).toBe(72);
  });
  it("project requirement blocks until a project is on record", () => {
    const m = matchJob({ ...job, requiresProject: true }, role, ctx(80, 70));
    expect(m.eligible).toBe(false);
    expect(m.blockers.map((b) => b.kind)).toEqual(["project"]);
  });
});

describe("adaptive assessment", () => {
  const def = getAssessment("skill:sql")!;
  const pool = questionsForSkill("sql");
  const skill = getSkill("sql");
  const byDifficulty = (d: number) => pool.filter((q) => difficultyOf(q, skill) === d);
  const run = (answers: (q: Question) => number | undefined, kind: "baseline" | "skill" = "skill", count = 6) => {
    const start = startDifficulty(kind);
    const asked: { question: Question; choice: number | undefined }[] = [];
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      const wanted = nextDifficulty(asked, start);
      const q = pickQuestion(pool, used, wanted, "seed");
      if (!q) break;
      used.add(q.id);
      asked.push({ question: q, choice: answers(q) });
    }
    return { asked, score: scoreAdaptive(asked, start, { sql: count }, "seed") };
  };

  it("derives assessment definitions from ids and rejects unknown ones", () => {
    expect(getAssessment("baseline:qa-engineer")).toMatchObject({ kind: "baseline", questionsPerSkill: 3 });
    expect(getAssessment("skill:nope")).toBeNull();
    expect(getAssessment("garbage")).toBeNull();
  });

  it("gets harder on a correct answer and easier on a wrong one", () => {
    const climb = run((q) => q.answer);
    // The pool holds two questions per band, so a perfect run climbs and then reuses what is left.
    expect(climb.asked.map((a) => difficultyOf(a.question, skill))).toEqual([2, 3, 4, 4, 3, 2]);
    const fall = run((q) => (q.answer + 1) % 4);
    const path = fall.asked.map((a) => difficultyOf(a.question, skill));
    expect(path.slice(0, 3)).toEqual([2, 1, 1]);
    // Only two questions exist per band, so a failing run eventually exhausts the easy ones
    // and is offered harder ones again — but it stays easier overall than a climbing run.
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    expect(mean(path)).toBeLessThan(mean(climb.asked.map((a) => difficultyOf(a.question, skill))));
  });

  it("scores by difficulty, so an easy run cannot look like a strong one", () => {
    // Right on the easiest band only, wrong on anything harder.
    const easyOnly = run((q) => (difficultyOf(q, skill) <= 1 ? q.answer : (q.answer + 1) % 4));
    expect(easyOnly.score.bySkill.sql.correct).toBeGreaterThan(0);
    expect(easyOnly.score.bySkill.sql.pct).toBeLessThan(40);
    expect(run((q) => q.answer).score.bySkill.sql.pct).toBe(100);
  });

  it("records the hardest band answered correctly", () => {
    expect(run((q) => q.answer).score.bySkill.sql.peakCorrect).toBe(4);
    expect(run((q) => (difficultyOf(q, skill) <= 1 ? q.answer : (q.answer + 1) % 4)).score.bySkill.sql.peakCorrect).toBe(1);
  });

  it("treats a skip or an invalid choice as wrong", () => {
    const skipped = run(() => undefined);
    expect(skipped.score.correct).toBe(0);
    expect(skipped.score.bySkill.sql.pct).toBe(0);
    expect(run(() => 99).score.correct).toBe(0);
  });

  it("never exposes answer keys to the browser", () => {
    const pub = toPublic(pool[0]) as Record<string, unknown>;
    expect("answer" in pub || "explanation" in pub).toBe(false);
  });

  it("falls back to the nearest band when one is exhausted", () => {
    const used = new Set(byDifficulty(4).map((q) => q.id));
    const picked = pickQuestion(pool, used, 4, "seed")!;
    expect(difficultyOf(picked, skill)).toBe(3);
  });

  it("creates one expiring evidence row per skill, carrying the peak difficulty", () => {
    const at = new Date("2026-09-19T10:00:00Z");
    const { score } = run((q) => q.answer);
    const rows = evidenceFromAdaptive(def, score, { id: "a1", verified: true, completedAt: at });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ skillId: "sql", type: "assessment", score: 100, verified: true, refId: "a1" });
    expect(rows[0].detail).toMatchObject({ peakCorrect: 4, scoringVersion: SCORING_VERSION });
    expect(rows[0].expiresAt.getTime()).toBeGreaterThan(at.getTime());
  });

  it("verified = in time and within tab-switch tolerance", () => {
    const startedAt = new Date("2026-09-19T10:00:00Z");
    const at = (min: number) => new Date(startedAt.getTime() + min * 60_000);
    expect(isVerified({ startedAt, completedAt: at(9), durationMin: 10, tabSwitches: 0 })).toBe(true);
    expect(isVerified({ startedAt, completedAt: at(12), durationMin: 10, tabSwitches: 0 })).toBe(false);
    expect(isVerified({ startedAt, completedAt: at(9), durationMin: 10, tabSwitches: 9 })).toBe(false);
  });
});

describe("the 85% bar: knowledge alone cannot claim industry readiness", () => {
  const perfect = (skillId: string, over: Partial<EvidenceItem> = {}) =>
    ev(skillId, 100, { detail: { correct: 6, total: 6, peakCorrect: 4 }, ...over });

  it("caps a perfect paper below the top band", () => {
    const r = computeReadiness(role, [perfect("manual-testing"), perfect("sql")], { now: NOW });
    const p = r.perSkill[0];
    expect(p.level).toBe(KNOWLEDGE_ONLY_CAP);
    expect(p.cappedFrom).toBe(100);
    expect(p.explanation).toContain("knowledge, not industry readiness");
  });

  it("lifts the cap only with practical evidence AND the hardest questions answered", () => {
    const project = ev("manual-testing", null, { type: "project", source: "project", confidence: "high" });
    const withProject = computeReadiness(role, [perfect("manual-testing"), project], { now: NOW });
    expect(withProject.perSkill[0].level).toBe(100);
    expect(withProject.perSkill[0].cappedFrom).toBeNull();

    // A project cannot rescue someone who never answered a hard question.
    const shallow = ev("manual-testing", 100, { detail: { correct: 6, total: 6, peakCorrect: 2 } });
    expect(computeReadiness(role, [shallow, project], { now: NOW }).perSkill[0].level).toBe(KNOWLEDGE_ONLY_CAP);
  });

  it("accepts a passed interview as the practical evidence", () => {
    const interview = ev("manual-testing", INTERVIEW_PASS, { type: "interview", source: "interview", confidence: "high" });
    expect(computeReadiness(role, [perfect("manual-testing"), interview], { now: NOW }).perSkill[0].level).toBe(100);
    const failed = ev("manual-testing", INTERVIEW_PASS - 1, { type: "interview", source: "interview" });
    expect(computeReadiness(role, [perfect("manual-testing"), failed], { now: NOW }).perSkill[0].level).toBe(KNOWLEDGE_ONLY_CAP);
  });

  it("leaves scores below the cap untouched", () => {
    const r = computeReadiness(role, [ev("manual-testing", 70, { detail: { correct: 4, total: 6, peakCorrect: 3 } })], { now: NOW });
    expect(r.perSkill[0]).toMatchObject({ level: 70, cappedFrom: null });
  });
});

describe("interview", () => {
  it("asks progressively: warm-up, then core, then probing", () => {
    const qa = getRole("qa-engineer");
    for (const id of [`baseline:${qa.id}`, `final:${qa.id}`, "skill:api-testing"]) {
      const prompts = selectPrompts(getAssessment(id)!, qa);
      expect(prompts.length, id).toBeGreaterThan(0);
      const depths = prompts.map((p) => p.depth);
      expect(depths, id).toEqual([...depths].sort((a, b) => a - b));
    }
  });
  it("asks about the skill just tested, and about the role at the end", () => {
    const qa = getRole("qa-engineer");
    expect(selectPrompts(getAssessment("skill:api-testing")!, qa).every((p) => p.skillId === "api-testing")).toBe(true);
    expect(selectPrompts(getAssessment(`final:${qa.id}`)!, qa).some((p) => p.kind === "technical")).toBe(true);
  });
  it("every prompt is well-formed and every skill has one", () => {
    const ids = new Set(INTERVIEW_PROMPTS.map((p) => p.id));
    expect(ids.size).toBe(INTERVIEW_PROMPTS.length);
    for (const p of INTERVIEW_PROMPTS) {
      expect(Boolean(p.roleId) !== Boolean(p.skillId), p.id).toBe(true);
      expect(p.lookFor.length, p.id).toBeGreaterThanOrEqual(3);
      expect(p.minWords, p.id).toBeGreaterThanOrEqual(40);
    }
    for (const s of SKILLS) expect(promptsForSkill(s.id).length, s.id).toBeGreaterThanOrEqual(2);
    for (const r of ROLES) expect(promptsForRole(r.id).length, r.id).toBeGreaterThanOrEqual(5);
  });
  it("scores only from the rubric, and an unevaluated answer stays pending", async () => {
    expect(rubricToScore({ relevance: 4, evidence: 4, structure: 4, communication: 4 }, "behavioural")).toBe(100);
    expect(rubricToScore({ relevance: 2, evidence: 2, structure: 2, communication: 2 }, "behavioural")).toBe(50);
    expect(rubricToScore({}, "technical")).toBe(0);
    expect(interviewScoringAvailable()).toBe(false);
    const prompt = promptsForSkill("sql")[0];
    const outcome = await evaluateAnswer({ prompt, answer: "An answer.", words: 2, seconds: 30 });
    expect(outcome.status).toBe("pending");
  });
});

describe("journey + impact", () => {
  it("marks the first incomplete stage as current", () => {
    const j = computeJourney({
      roleId: "qa-engineer", roleTitle: "QA Engineer", profileConfirmed: true, claimedSkills: 3, baselineDone: true, actedOnGaps: true,
      criticalGapsAtBaseline: 4, criticalGapsNow: 2, skillAssessments: 2, evidenceCount: 9, assessedSkills: 8, totalSkills: 11,
      hasProject: false, finalDone: false, hasCard: false, cardPublic: false, unlockedJobs: 1, totalJobs: 5,
    });
    expect(j.map((s) => s.state)).toEqual(["completed", "completed", "completed", "completed", "current", "upcoming", "upcoming", "upcoming"]);
    expect(j[4].detail).toContain("2 of 4");
    expect(j[5].items.map((i) => i.label)).toContain("8 of 11 skills backed by assessment");
  });
  it("reports score delta, closed gaps and newly unlocked jobs", () => {
    const qa = getRole("qa-engineer");
    const jobs = jobsForRole(qa.id);
    const base = qa.skills.map((s) => ev(s.skillId, s.skillId === "manual-testing" ? 40 : 90, { createdAt: new Date("2026-08-01") }));
    const before = computeReadiness(qa, base, { now: NOW, jobs });
    const after = computeReadiness(qa, [...base, ev("manual-testing", 90)], { now: NOW, jobs });
    const impact = computeImpact(before, after, ["manual-testing"], jobs.map((j) => matchJob(j, qa, before)), jobs.map((j) => matchJob(j, qa, after)));
    expect(impact.delta).toBeGreaterThan(0);
    expect(impact.resolvedGaps).toEqual(["manual-testing"]);
    expect(impact.unlockedJobIds.length).toBeGreaterThan(0);
  });
});

describe("projected impact", () => {
  const qa = getRole("qa-engineer");
  const jobs = jobsForRole(qa.id);
  const base = (levels: Record<string, number>) =>
    qa.skills.map((s) => ev(s.skillId, levels[s.skillId] ?? 90));

  const project = (evidence: EvidenceItem[], skillId: string) => {
    const r = computeReadiness(qa, evidence, { now: NOW, jobs });
    return projectSkillImpact(qa, r, matchJobs(jobs, qa, r), evidence, skillId, { jobs, now: NOW });
  };

  it("projects a real gain from the same engine, never a negative one", () => {
    const e = base({ "api-testing": 30 });
    const impact = project(e, "api-testing")!;
    expect(impact).toMatchObject({ skillId: "api-testing", from: 30, to: 70 });
    expect(impact.deltaScore).toBeGreaterThan(0);
    // The projection equals what the engine actually produces at that level.
    const actual = computeReadiness(qa, [...e, ev("api-testing", 70, { createdAt: new Date("2026-09-18") })], { now: NOW, jobs });
    expect(computeReadiness(qa, e, { now: NOW, jobs }).score + impact.deltaScore).toBe(actual.score);
  });
  it("returns nothing for a skill already at or above target", () => {
    expect(project(base({ "api-testing": 95 }), "api-testing")).toBeUndefined();
    expect(project(base({}), "manual-testing")).toBeUndefined();
  });
  it("outranks a real assessment recorded the same instant", () => {
    const same = qa.skills.map((s) => ev(s.skillId, 30, { createdAt: NOW }));
    expect(project(same, "api-testing")!.deltaScore).toBeGreaterThan(0);
  });
  it("reports only jobs the projection actually unlocks", () => {
    const e = base({ "api-testing": 20 });
    const before = computeReadiness(qa, e, { now: NOW, jobs });
    const locked = new Set(matchJobs(jobs, qa, before).filter((m) => !m.unlocked).map((m) => m.jobId));
    for (const id of project(e, "api-testing")!.unlockedJobIds) expect(locked.has(id)).toBe(true);
  });
  it("counts blocked opportunities per skill and evidence coverage", () => {
    const r = computeReadiness(qa, base({ "api-testing": 20 }), { now: NOW, jobs });
    expect(r.perSkill.find((p) => p.skillId === "api-testing")!.blocksJobs).toBeGreaterThan(0);
    expect(r.evidenceCoverage).toEqual({ assessed: qa.skills.length, total: qa.skills.length });
    expect(computeReadiness(qa, [], { now: NOW, jobs }).evidenceCoverage.assessed).toBe(0);
  });
  it("picks the closest locked opportunity as the next unlock", () => {
    const r = computeReadiness(qa, base({ "api-testing": 20 }), { now: NOW, jobs });
    const u = nextUnlock(matchJobs(jobs, qa, r))!;
    expect(u.match.unlocked).toBe(false);
    expect(u.progressPct).toBeGreaterThanOrEqual(0);
    expect(u.met + u.match.blockers.length).toBe(u.total);
  });
  it("recommends re-assessment once evidence is old, before it expires", () => {
    const old = new Date(NOW.getTime() - 320 * 86_400_000);
    const r = computeReadiness(role, [ev("manual-testing", 70, { createdAt: old, expiresAt: new Date(NOW.getTime() + 86_400_000) })], { now: NOW });
    expect(r.perSkill[0]).toMatchObject({ reassessRecommended: true, level: 70 });
  });
});

describe("resume claims", () => {
  it("matches the everyday name of skills whose title carries extra words", () => {
    const resume = { ...EMPTY_RESUME, skills: ["Linux", "Docker", "Git", "Jenkins", "AWS"] };
    const claimed = claimedSkills(getRole("devops-engineer"), resume);
    expect(claimed).toEqual(expect.arrayContaining(["linux", "docker", "git", "ci-cd", "cloud-fundamentals"]));
  });
  it("does not match a word that merely contains a skill name", () => {
    // "digital" contains "git"; "spare" contains "r". Substring hits must not become claims.
    const resume = { ...EMPTY_RESUME, skills: ["Digital marketing", "Legitimate research"] };
    expect(claimedSkills(getRole("backend-developer"), resume)).toEqual([]);
  });
  it("only claims technical skills — aptitude and communication must be assessed", () => {
    const resume = { ...EMPTY_RESUME, skills: ["Communication", "Logical reasoning", "SQL"] };
    expect(claimedSkills(getRole("data-analyst"), resume)).toEqual(["sql"]);
  });
});

describe("practice feedback", () => {
  const prompt = promptsForRole("qa-engineer").find((p) => p.depth === 2 && p.kind === "behavioural")!;
  const technical = promptsForSkill("sql")[1];
  const state = (f: ReturnType<typeof analyseAnswer>, id: string) => f.signals.find((s) => s.id === id)?.state;

  it("flags an answer that is too short", () => {
    const f = analyseAnswer(prompt, "I worked in a team and it went fine.");
    expect(state(f, "length")).toBe("bad");
    expect(f.headline).toContain("too short");
  });

  it("flags a story with no result", () => {
    const f = analyseAnswer(
      prompt,
      "When I was working on my college project I was responsible for the test plan. I wrote the cases myself and I ran them every evening, and I checked each screen carefully against the requirements document that the team had agreed at the start of the term.",
    );
    expect(state(f, "structure")).not.toBe("good");
  });

  it("flags hiding behind 'we'", () => {
    const f = analyseAnswer(
      prompt,
      "When we built the booking system we found a bug where we double-booked slots. We reproduced it, we checked the logs and we fixed the locking. As a result we shipped on time and we reduced complaints by 40 percent after the release went out to all of the users.",
    );
    expect(state(f, "ownership")).toBe("bad");
    expect(f.signals.find((s) => s.id === "ownership")!.detail).toContain('"I" never');
  });

  it("flags hedging that makes a right answer sound unsure", () => {
    const f = analyseAnswer(
      technical,
      "I think maybe a LEFT JOIN is basically kind of like an INNER JOIN, sort of, but it probably keeps some rows or something, and the filter is maybe in the WHERE clause or stuff like that depending on what you want from the query really.",
    );
    expect(state(f, "confidence")).not.toBe("good");
  });

  it("recognises a strong, specific answer with a result", () => {
    const f = analyseAnswer(
      prompt,
      "When I was testing our college booking system I found that two people could book the same slot. I reproduced it by opening 2 browsers, then I read the API logs and saw the row was never locked. I wrote a test case for the race and reported it with the log line and a rate of 3 failures in 30 attempts. As a result the fix shipped that week and I re-ran the case 30 times to confirm it held.",
    );
    expect(state(f, "structure")).toBe("good");
    expect(state(f, "ownership")).toBe("good");
    expect(state(f, "specifics")).toBe("good");
    expect(state(f, "confidence")).toBe("good");
  });

  it("asks technical answers for reasoning, not a story", () => {
    const f = analyseAnswer(technical, "A LEFT JOIN keeps all left rows. An INNER JOIN keeps matching rows. I would use LEFT JOIN for customers with no orders. The syntax differs slightly between the two forms but both are standard SQL and widely supported everywhere.");
    expect(f.signals.some((s) => s.id === "reasoning")).toBe(true);
    expect(f.signals.some((s) => s.id === "structure")).toBe(false);
  });

  it("hedges its own certainty about missing points", () => {
    const f = analyseAnswer(prompt, "Short answer about nothing in particular at all, just words with no content whatsoever here.");
    expect(f.possiblyMissing.length).toBeGreaterThan(0);
    for (const m of f.possiblyMissing) expect(prompt.lookFor).toContain(m);
  });
});

describe("interview conversation", () => {
  const qa = getRole("qa-engineer");
  const promptIds = promptsForRole(qa.id).slice(0, 3).map((p) => p.id);
  const base = { promptIds, candidateName: "Priya Nair", roleTitle: qa.title, profileSkills: ["Manual Testing", "Postman"], weakSkills: ["API Testing"] };
  const say = (transcript: Turn[]) => nextInterviewerTurn({ ...base, transcript });
  const strong =
    "When I was testing our college booking system I found that two people could book the same slot. I reproduced it by opening 2 browsers, then I read the API logs and saw the row was never locked. I wrote a test case for the race and reported it with the log line and a rate of 3 failures in 30 attempts. As a result the fix shipped that week and I re-ran it 30 times to confirm.";

  it("opens with a mic check, then introduces itself using the real profile", () => {
    const hello = say([]);
    expect(hello.text).toBe("Hello, can you hear me?");
    expect(hello.promptId).toBeUndefined();

    const opening = say([
      { speaker: "interviewer", text: "Hello, can you hear me?" },
      { speaker: "candidate", text: "Yes, I can hear you." },
    ]);
    expect(opening.text).toContain("Priya");
    expect(opening.text).toContain("QA Engineer");
    expect(opening.text).toContain("Manual Testing");
    expect(opening.text).toContain("API Testing"); // honest about the weakest area
    expect(opening.promptId).toBe(promptIds[0]);
  });

  it("probes the exact weakness instead of moving on", () => {
    const after = (answer: string) =>
      say([
        { speaker: "interviewer", text: "Hello, can you hear me?" },
        { speaker: "candidate", text: "Yes." },
        { speaker: "interviewer", text: "...", promptId: promptIds[0] },
        { speaker: "candidate", text: answer },
      ]);

    const noOwnership = after(
      "When we built the booking system we found a bug where we double-booked slots. We reproduced it, we checked the logs and we fixed the locking. As a result we shipped on time and we cut complaints by 40 percent for all of the users.",
    );
    expect(noOwnership.probe).toBe(true);
    expect(noOwnership.text).toContain("What was your part in it");

    expect(after("It went fine.").probe).toBe(true);
  });

  it("does not interrogate a strong answer about what it already contains", () => {
    const next = say([
      { speaker: "interviewer", text: "Hello, can you hear me?" },
      { speaker: "candidate", text: "Yes." },
      { speaker: "interviewer", text: "...", promptId: promptIds[0] },
      { speaker: "candidate", text: strong },
    ]);
    // It may ask the question's own follow-up, but never the probes for things it has.
    expect(next.text).not.toContain("What was your part in it");
    expect(next.text).not.toContain("Can you put some numbers on that");
    expect(next.text).not.toContain("And how did it end");
  });

  it("always reaches the end: every question asked once, then a close", () => {
    const transcript: Turn[] = [];
    let turn = say(transcript);
    const asked: string[] = [];
    for (let i = 0; i < 40 && !turn.done; i++) {
      transcript.push({ speaker: "interviewer", text: turn.text, promptId: turn.promptId, probe: turn.probe });
      if (turn.promptId) asked.push(turn.promptId);
      transcript.push({ speaker: "candidate", text: strong });
      turn = say(transcript);
    }
    expect(turn.done).toBe(true);
    expect(asked).toEqual(promptIds);
  });

  it("only probes once per question", () => {
    const turns: Turn[] = [
      { speaker: "interviewer", text: "Hello, can you hear me?" },
      { speaker: "candidate", text: "Yes." },
      { speaker: "interviewer", text: "...", promptId: promptIds[0] },
      { speaker: "candidate", text: "It went fine." },
      { speaker: "interviewer", text: "Can you give me a concrete example?", probe: true },
      { speaker: "candidate", text: "Not really, it just went fine." },
    ];
    expect(say(turns).promptId).toBe(promptIds[1]);
  });

  it("collects each question's answer, including what was said to a probe", () => {
    const answers = answersByPrompt([
      { speaker: "interviewer", text: "...", promptId: promptIds[0] },
      { speaker: "candidate", text: "First part." },
      { speaker: "interviewer", text: "And how did it end?", probe: true },
      { speaker: "candidate", text: "Second part." },
      { speaker: "interviewer", text: "...", promptId: promptIds[1] },
      { speaker: "candidate", text: "Other answer." },
    ]);
    expect(answers[promptIds[0]]).toBe("First part. Second part.");
    expect(answers[promptIds[1]]).toBe("Other answer.");
  });
});
