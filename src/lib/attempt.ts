import "server-only";
import type { AssessmentDef, PublicQuestion, Question } from "@/content/taxonomy";
import { getQuestion, questionsForSkill } from "@/content/assessments";
import {
  nextDifficulty,
  nextSkill,
  pickQuestion,
  scoreAdaptive,
  startDifficulty,
  type AdaptiveScore,
  type AskedAnswer,
} from "./adaptive";
import { toPublic } from "./assessment";
import type { Confidence, EvidenceType } from "./readiness";

/**
 * A progressive attempt: one question at a time, each chosen from how the last was
 * answered. Questions are issued by the server as it goes, so the browser never holds
 * the rest of the paper — and the ladder cannot be gamed by looking ahead.
 */

export type AttemptRow = {
  id: string;
  assessmentId: string;
  kind: "baseline" | "skill" | "final";
  questionIds: string[];
  answers: Record<string, number> | null;
  stage: "knowledge" | "interview" | "complete";
};

export function quotaBySkill(def: AssessmentDef): Record<string, number> {
  return Object.fromEntries(def.skillIds.map((id) => [id, def.questionsPerSkill]));
}

export function totalQuestions(def: AssessmentDef): number {
  return def.skillIds.length * def.questionsPerSkill;
}

/** Questions issued so far, paired with what the candidate chose. */
export function askedSoFar(attempt: AttemptRow): AskedAnswer[] {
  const answers = attempt.answers ?? {};
  return attempt.questionIds
    .map((id) => getQuestion(id))
    .filter((q): q is Question => Boolean(q))
    .map((question) => ({ question, choice: answers[question.id] }));
}

/**
 * The next question, or undefined when the knowledge section is done.
 * Deterministic: the same attempt with the same answers always yields the same question.
 */
export function nextQuestion(attempt: AttemptRow, def: AssessmentDef): Question | undefined {
  const asked = askedSoFar(attempt);
  const progress = Object.fromEntries(
    def.skillIds.map((id) => [
      id,
      { asked: asked.filter((a) => a.question.skillId === id).length, quota: def.questionsPerSkill },
    ]),
  );
  const skillId = nextSkill(progress, def.skillIds);
  if (!skillId) return undefined;

  const start = startDifficulty(def.kind);
  const wanted = nextDifficulty(
    asked.filter((a) => a.question.skillId === skillId),
    start,
  );
  return pickQuestion(questionsForSkill(skillId), new Set(attempt.questionIds), wanted, attempt.id);
}

export type AttemptProgress = {
  answered: number;
  total: number;
  /** 1-4, shown to the candidate so the ladder is visible rather than mysterious. */
  difficulty: number;
  skillName?: string;
};

/** The current question plus progress, safe to send to the browser. */
export function currentView(attempt: AttemptRow, def: AssessmentDef): { question: PublicQuestion; progress: AttemptProgress } | undefined {
  const currentId = attempt.questionIds.at(-1);
  const question = currentId ? getQuestion(currentId) : undefined;
  if (!question) return undefined;
  const answers = attempt.answers ?? {};
  return {
    question: toPublic(question),
    progress: {
      answered: Object.keys(answers).length,
      total: totalQuestions(def),
      difficulty: difficultyLabel(question, attempt, def),
    },
  };
}

function difficultyLabel(question: Question, attempt: AttemptRow, def: AssessmentDef) {
  const asked = askedSoFar(attempt).filter((a) => a.question.skillId === question.skillId && a.question.id !== question.id);
  return nextDifficulty(asked, startDifficulty(def.kind));
}

export function scoreAttemptAdaptive(attempt: AttemptRow, def: AssessmentDef): AdaptiveScore {
  return scoreAdaptive(askedSoFar(attempt), startDifficulty(def.kind), quotaBySkill(def), attempt.id);
}

export type NewEvidence = {
  skillId: string;
  type: EvidenceType;
  source: string;
  refId: string;
  url: null;
  score: number;
  confidence: Confidence;
  verified: boolean;
  detail: { correct: number; total: number; title: string; peakCorrect: number; scoringVersion: string };
  createdAt: Date;
  expiresAt: Date;
};

/** Assessed evidence goes stale: skills must be re-verified after a year. */
export const EVIDENCE_TTL_DAYS = 365;

/** One evidence row per skill, carrying how hard the questions were that they got right. */
export function evidenceFromAdaptive(
  def: AssessmentDef,
  score: AdaptiveScore,
  attempt: { id: string; verified: boolean; completedAt: Date },
): NewEvidence[] {
  const expiresAt = new Date(attempt.completedAt.getTime() + EVIDENCE_TTL_DAYS * 86_400_000);
  return Object.entries(score.bySkill).map(([skillId, s]) => ({
    skillId,
    type: "assessment" as const,
    source: def.kind,
    refId: attempt.id,
    url: null,
    score: s.pct,
    confidence: "medium" as const,
    verified: attempt.verified,
    detail: {
      correct: s.correct,
      total: s.total,
      title: def.title,
      peakCorrect: s.peakCorrect,
      scoringVersion: score.scoringVersion,
    },
    createdAt: attempt.completedAt,
    expiresAt,
  }));
}
