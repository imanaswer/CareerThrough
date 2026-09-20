import "server-only";
import {
  SCORED_DIMENSIONS,
  type Band,
  type Dimension,
  type Job,
  type Priority,
  type Role,
} from "@/content/taxonomy";
import { getSkill } from "@/content/skills";
import { matchJobs } from "./matching";
import { rankNextActions, type NextAction } from "./next-action";

/** Bump when the maths below changes. Stored on every readiness snapshot. */
export const FORMULA_VERSION = "readiness-v2";

/** A resume claim is not proof. It can never lift a skill above this level. */
export const RESUME_CLAIM_CAP = 30;

/**
 * The top band has to be earned, not accumulated. Multiple-choice questions can show
 * knowledge, so on their own they take a skill no higher than this. Going above it needs
 * demonstrated ability: project evidence for the skill, or a passed interview on it.
 * That is what keeps "85%+" meaning industry-ready rather than good-at-quizzes.
 */
export const KNOWLEDGE_ONLY_CAP = 84;

/** The highest difficulty band must have been answered correctly to pass the cap. */
export const MASTERY_MIN_PEAK = 4;

/** Assessed evidence is still valid at this age, but we start telling the candidate to re-verify. */
export const REASSESS_AFTER_DAYS = 300;

export type EvidenceType = "assessment" | "project" | "resume_claim" | "interview";

/** Interview score (0-100) that counts as demonstrated ability for the cap. */
export const INTERVIEW_PASS = 70;
export type Confidence = "low" | "medium" | "high" | "very_high";

export type EvidenceItem = {
  id: string;
  skillId: string;
  type: EvidenceType;
  /** baseline | skill | final | resume | project */
  source: string;
  refId: string | null;
  url: string | null;
  score: number | null;
  confidence: Confidence;
  verified: boolean;
  detail?: {
    correct?: number;
    total?: number;
    title?: string;
    status?: string;
    liveUrl?: string;
    demoUrl?: string;
    /** Highest difficulty band answered correctly, from adaptive scoring. */
    peakCorrect?: number;
    scoringVersion?: string;
  } | null;
  createdAt: Date;
  expiresAt: Date | null;
};

export type SkillStatus = "meets" | "close" | "gap" | "no_evidence";
export type SkillConfidence = "none" | "low" | "medium" | "strong";

export const CONFIDENCE_LABELS: Record<SkillConfidence, string> = {
  none: "No evidence",
  low: "Low — self-reported",
  medium: "Medium — assessed",
  strong: "Strong — assessed + project",
};

export type SkillReadiness = {
  skillId: string;
  name: string;
  dimension: Dimension;
  priority: Priority;
  weight: number;
  level: number;
  target: number;
  /** level - target, negative when below target. */
  gap: number;
  /** Share of the overall score this skill contributes (0-100 points). */
  contribution: number;
  maxContribution: number;
  /** Readiness points this skill is currently giving up. The "why am I at X%" ranking. */
  lostPoints: number;
  status: SkillStatus;
  confidence: SkillConfidence;
  assessed: boolean;
  hasProject: boolean;
  hasExpiredEvidence: boolean;
  /** Number of opportunities whose hard requirements this skill currently fails. */
  blocksJobs: number;
  /** Evidence is still valid but old enough to re-verify. */
  reassessRecommended: boolean;
  /** Scored above the knowledge-only cap but not yet demonstrated: the raw score. */
  cappedFrom: number | null;
  lastVerifiedAt: string | null;
  /** Ids of evidence rows that produced this level, newest first. */
  evidenceIds: string[];
  explanation: string;
};

export type Readiness = {
  roleId: string;
  score: number;
  band: Band;
  perSkill: SkillReadiness[];
  gaps: Record<Priority, string[]>;
  strengths: string[];
  /** How much of the role has been proven at all, rather than how well. */
  evidenceCoverage: { assessed: number; total: number };
  dimensions: { dimension: Dimension; pct: number | null; note?: string }[];
  nextActions: NextAction[];
  explanation: string;
  formulaVersion: string;
};

export function bandFor(role: Role, score: number): Band {
  return [...role.bands].sort((a, b) => b.min - a.min).find((b) => score >= b.min) ?? role.bands[0];
}

function isLive(e: EvidenceItem, now: Date) {
  return !e.expiresAt || e.expiresAt > now;
}

const SOURCE_LABEL: Record<string, string> = {
  baseline: "baseline assessment",
  skill: "skill assessment",
  final: "final verification",
};

export function computeReadiness(
  role: Role,
  evidence: EvidenceItem[],
  opts: { now?: Date; jobs?: Job[]; hasFinal?: boolean; skipActions?: boolean } = {},
): Readiness {
  const now = opts.now ?? new Date();
  // Skills whose interview has been evaluated and passed. Until a scorer is connected
  // there are none, so the cap holds on knowledge alone.
  const interviewPassed = new Set(
    evidence.filter((e) => e.type === "interview" && (e.score ?? 0) >= INTERVIEW_PASS).map((e) => e.skillId),
  );
  const scored = role.skills.filter((rs) => SCORED_DIMENSIONS.includes(getSkill(rs.skillId).dimension));
  const totalWeight = scored.reduce((s, rs) => s + rs.weight, 0);

  const perSkill: SkillReadiness[] = scored.map((rs) => {
    const skill = getSkill(rs.skillId);
    const mine = evidence
      .filter((e) => e.skillId === rs.skillId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const live = mine.filter((e) => isLive(e, now));
    const hasExpiredEvidence = mine.length > live.length;

    const assessment = live.find((e) => e.type === "assessment" && e.score !== null);
    const claim = live.find((e) => e.type === "resume_claim");
    const project = live.find((e) => e.type === "project");

    let level = 0;
    let explanation: string;
    let cappedFrom: number | null = null;
    const used: EvidenceItem[] = [];

    if (assessment) {
      level = Math.round(assessment.score!);
      used.push(assessment);
      const d = assessment.detail;
      const how = d?.correct != null && d?.total != null ? `, ${d.correct} of ${d.total} correct` : "";
      explanation = `${level}% — ${SOURCE_LABEL[assessment.source] ?? "assessment"}${how}. Target level is ${rs.target}%.`;
      // Above the cap you are claiming industry readiness, so it takes more than answers.
      const demonstrated = Boolean(project) || interviewPassed.has(rs.skillId);
      const reachedTop = (assessment.detail?.peakCorrect ?? 0) >= MASTERY_MIN_PEAK;
      if (level > KNOWLEDGE_ONLY_CAP && !(demonstrated && reachedTop)) {
        cappedFrom = level;
        level = KNOWLEDGE_ONLY_CAP;
        explanation =
          `${level}% — ${SOURCE_LABEL[assessment.source] ?? "assessment"}${how}, scored ${cappedFrom}%. ` +
          `Held at ${KNOWLEDGE_ONLY_CAP}% because questions alone show knowledge, not industry readiness. ` +
          (reachedTop
            ? "Submit project evidence for this skill, or pass its interview, to go higher. "
            : "Answer the hardest questions correctly and add practical evidence to go higher. ") +
          `Target level is ${rs.target}%.`;
      }
    } else if (claim) {
      level = Math.min(claim.score ?? RESUME_CLAIM_CAP, RESUME_CLAIM_CAP);
      used.push(claim);
      explanation = `${level}% — listed on your resume but not yet assessed. Resume claims are capped at ${RESUME_CLAIM_CAP}% until you verify them. Target level is ${rs.target}%.`;
    } else if (hasExpiredEvidence) {
      explanation = `0% — your previous evidence has expired. Retake the assessment to restore this skill. Target level is ${rs.target}%.`;
    } else {
      explanation = `0% — no evidence yet. Take the assessment to establish your level. Target level is ${rs.target}%.`;
    }
    if (project) {
      used.push(project);
      explanation += assessment
        ? " A submitted project strengthens the confidence of this evidence."
        : " A project is on record, but a level is only set by an assessment.";
    }

    const confidence: SkillConfidence = assessment ? (project ? "strong" : "medium") : claim || project ? "low" : "none";
    const ratio = Math.min(level / rs.target, 1);
    const gap = level - rs.target;
    const status: SkillStatus =
      used.length === 0 ? "no_evidence" : gap >= 0 ? "meets" : gap >= -10 ? "close" : "gap";

    return {
      skillId: rs.skillId,
      name: skill.name,
      dimension: skill.dimension,
      priority: rs.priority,
      weight: rs.weight,
      level,
      target: rs.target,
      gap,
      contribution: round1((rs.weight * ratio * 100) / totalWeight),
      maxContribution: round1((rs.weight * 100) / totalWeight),
      lostPoints: round1(((rs.weight * 100) / totalWeight) * (1 - ratio)),
      status,
      confidence,
      assessed: Boolean(assessment),
      hasProject: Boolean(project),
      hasExpiredEvidence,
      blocksJobs: 0, // filled in below, once every skill has a level to match jobs against
      reassessRecommended: Boolean(
        assessment && now.getTime() - assessment.createdAt.getTime() > REASSESS_AFTER_DAYS * 86_400_000,
      ),
      cappedFrom,
      lastVerifiedAt: assessment ? assessment.createdAt.toISOString() : null,
      evidenceIds: used.map((e) => e.id),
      explanation,
    };
  });

  const score = Math.round(
    (perSkill.reduce((s, p) => s + p.weight * Math.min(p.level / p.target, 1), 0) / totalWeight) * 100,
  );
  const band = bandFor(role, score);

  // Jobs can only be matched once every skill has a level and the role score exists,
  // so this runs here and the result is shared with the next-action ranking below.
  const jobs = opts.jobs ?? [];
  const blocked = new Map<string, number>();
  for (const m of matchJobs(jobs, role, { score, perSkill })) {
    // Only hard-requirement misses count: a job locked purely on role readiness
    // is not blocked *by* any one skill.
    for (const miss of m.missing) blocked.set(miss.skillId, (blocked.get(miss.skillId) ?? 0) + 1);
  }
  for (const p of perSkill) p.blocksJobs = blocked.get(p.skillId) ?? 0;

  const gaps: Record<Priority, string[]> = { critical: [], important: [], nice: [] };
  for (const p of perSkill) if (p.gap < 0) gaps[p.priority].push(p.skillId);
  const strengths = perSkill
    .filter((p) => p.status === "meets" && p.assessed)
    .sort((a, b) => b.level - a.level)
    .map((p) => p.skillId);

  const dimensions = role.dimensions.map((dimension) => {
    if (dimension === "interview") return { dimension, pct: null, note: "Not yet assessed" };
    const ds = perSkill.filter((p) => p.dimension === dimension);
    const w = ds.reduce((s, p) => s + p.weight, 0);
    if (!w) return { dimension, pct: null, note: "Not part of this role" };
    return {
      dimension,
      pct: Math.round((ds.reduce((s, p) => s + p.weight * Math.min(p.level / p.target, 1), 0) / w) * 100),
    };
  });

  const partial = { roleId: role.id, score, band, perSkill, gaps };
  // The simulation path skips this: it only needs the score, and ranking would be thrown away.
  const nextActions = opts.skipActions
    ? []
    : rankNextActions(role, partial, {
        blocked,
        projectRequiredBy: jobs.filter((j) => j.requiresProject).length,
        hasFinal: opts.hasFinal ?? false,
      });

  const unassessed = perSkill.filter((p) => !p.assessed).length;
  const explanation =
    `Your readiness is ${score}/100 (${band.label}) for ${role.title}. ` +
    `Each skill counts up to its target level and no further, weighted by how much the role depends on it. ` +
    (unassessed
      ? `${unassessed} of ${perSkill.length} skills have no assessed evidence yet, so they count for little or nothing. `
      : `All ${perSkill.length} scored skills have assessed evidence. `) +
    `Interview readiness is not yet assessed and is not part of this number.`;

  return {
    ...partial,
    strengths,
    evidenceCoverage: { assessed: perSkill.length - unassessed, total: perSkill.length },
    dimensions,
    nextActions,
    explanation,
    formulaVersion: FORMULA_VERSION,
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
