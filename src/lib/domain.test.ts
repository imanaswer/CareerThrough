import { describe, expect, it } from "vitest";
import { ROLES, getRole } from "@/content/roles";
import { SKILLS } from "@/content/skills";
import { QUESTIONS, getAssessment } from "@/content/assessments";
import { PLANS } from "@/content/plans";
import { JOBS, jobsForRole } from "@/content/jobs";
import { bands, type Job, type Question, type Role } from "@/content/taxonomy";
import { FORMULA_VERSION, RESUME_CLAIM_CAP, computeReadiness, type EvidenceItem } from "./readiness";
import { matchJob, matchJobs, requiredReadiness } from "./matching";
import { nextUnlock, projectSkillImpact } from "./simulate";
import { claimedSkills } from "./resume-claims";
import { EMPTY_RESUME } from "./resume-schema";
import { evidenceFromScore, isVerified, scoreAttempt, selectQuestions, toPublic } from "./assessment";
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

describe("assessment", () => {
  const def = getAssessment("skill:sql")!;
  const issued = selectQuestions(def, QUESTIONS, "attempt-1");
  const allRight = Object.fromEntries(issued.map((q) => [q.id, q.answer]));

  it("derives assessment definitions from ids and rejects unknown ones", () => {
    expect(getAssessment("baseline:qa-engineer")).toMatchObject({ kind: "baseline", questionsPerSkill: 3 });
    expect(getAssessment("skill:nope")).toBeNull();
    expect(getAssessment("garbage")).toBeNull();
  });
  it("selects reproducibly, covers every topic, and never exposes answer keys", () => {
    expect(issued).toHaveLength(6);
    expect(new Set(issued.map((q) => q.topicId)).size).toBe(4);
    expect(selectQuestions(def, QUESTIONS, "attempt-1").map((q) => q.id)).toEqual(issued.map((q) => q.id));
    const pub = toPublic(issued[0]) as Record<string, unknown>;
    expect("answer" in pub || "explanation" in pub).toBe(false);
  });
  it("scores on the server, per skill and per topic", () => {
    const s = scoreAttempt(issued, allRight);
    expect(s).toMatchObject({ correct: 6, total: 6, pct: 100 });
    expect(s.bySkill.sql.pct).toBe(100);
    const half = scoreAttempt(issued, Object.fromEntries(issued.slice(0, 3).map((q) => [q.id, q.answer])));
    expect(half.pct).toBe(50);
  });
  it("treats invalid, missing and injected answers as wrong", () => {
    const q = issued[0] as Question;
    const s = scoreAttempt(issued, { [q.id]: 99, "not-issued-q": 0, [issued[1].id]: -1, [issued[2].id]: 1.5 });
    expect(s.correct).toBe(0);
    expect(s.total).toBe(6);
  });
  it("creates one expiring evidence row per skill", () => {
    const at = new Date("2026-09-19T10:00:00Z");
    const rows = evidenceFromScore(def, scoreAttempt(issued, allRight), { id: "a1", verified: true, completedAt: at });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ skillId: "sql", type: "assessment", source: "skill", score: 100, confidence: "medium", verified: true, refId: "a1" });
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
    const r = computeReadiness(role, [ev("manual-testing", 90, { createdAt: old, expiresAt: new Date(NOW.getTime() + 86_400_000) })], { now: NOW });
    expect(r.perSkill[0]).toMatchObject({ reassessRecommended: true, level: 90 });
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
