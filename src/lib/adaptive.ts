import "server-only";
import type { Question, Skill } from "@/content/taxonomy";
import { getSkill } from "@/content/skills";

/**
 * Progressive (adaptive) question selection and scoring.
 *
 * Difficulty comes from the skill's own topic order, which is authored
 * foundational → applied, so topic 1 is the easiest and topic 4 the most applied.
 * Get one right and the next is harder; get one wrong and it steps back down.
 */
export const SCORING_VERSION = "adaptive-v1";

export const MAX_DIFFICULTY = 4;
export const MIN_DIFFICULTY = 1;

/** Harder questions are worth more. A score is earned weight over the best possible run. */
const WEIGHT: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4 };

export function difficultyOf(question: Question, skill: Skill = getSkill(question.skillId)): number {
  const i = skill.topics.findIndex((t) => t.id === question.topicId);
  return i < 0 ? MIN_DIFFICULTY : i + 1;
}

const clamp = (d: number) => Math.min(Math.max(d, MIN_DIFFICULTY), MAX_DIFFICULTY);

/** Where a skill's ladder starts: a baseline opens gently, a re-assessment opens mid. */
export function startDifficulty(kind: "baseline" | "skill" | "final"): number {
  return kind === "baseline" ? 1 : 2;
}

/**
 * The ceiling for an attempt: the weight you would earn by answering every question
 * correctly and climbing the whole way. Scoring against this — not against the questions
 * you happened to be asked — is what stops an easy run from producing a high score.
 */
export function maxWeight(count: number, start: number): number {
  let d = clamp(start);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += WEIGHT[d];
    d = clamp(d + 1);
  }
  return total;
}

export type AskedAnswer = { question: Question; choice: number | undefined };

/** Difficulty for the next question, from how the candidate has done so far. */
export function nextDifficulty(asked: AskedAnswer[], start: number): number {
  let d = clamp(start);
  for (const { question, choice } of asked) {
    d = clamp(d + (choice === question.answer ? 1 : -1));
  }
  return d;
}

/**
 * Pick the next question for a skill at the wanted difficulty, falling back to the
 * nearest available band when that one is exhausted. Deterministic given the attempt id.
 */
export function pickQuestion(pool: Question[], usedIds: Set<string>, wanted: number, seed: string): Question | undefined {
  const skill = pool.length ? getSkill(pool[0].skillId) : undefined;
  if (!skill) return undefined;
  const available = pool.filter((q) => !usedIds.has(q.id));
  if (!available.length) return undefined;

  const byDistance = available
    .map((q) => ({ q, d: difficultyOf(q, skill) }))
    .sort((a, b) => {
      const da = Math.abs(a.d - wanted);
      const db = Math.abs(b.d - wanted);
      // Prefer the wanted band, then the nearest; on a tie prefer the harder one,
      // then a stable hash so the same attempt always sees the same question.
      return da - db || b.d - a.d || hash(seed + a.q.id) - hash(seed + b.q.id);
    });
  return byDistance[0]?.q;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

export type SkillProgress = { asked: number; quota: number };

/**
 * Which skill to ask about next: whichever is furthest behind its quota, so a
 * multi-skill assessment stays balanced even if the candidate stops early.
 */
export function nextSkill(progress: Record<string, SkillProgress>, order: string[]): string | undefined {
  const pending = order.filter((id) => progress[id] && progress[id].asked < progress[id].quota);
  if (!pending.length) return undefined;
  return pending.reduce((best, id) => (progress[id].asked < progress[best].asked ? id : best), pending[0]);
}

export type AdaptiveSkillScore = {
  correct: number;
  total: number;
  /** Difficulty-weighted percentage: the level this skill is actually set to. */
  pct: number;
  earned: number;
  possible: number;
  /** Highest difficulty answered correctly — used to gate the top band. */
  peakCorrect: number;
  topics: Record<string, { correct: number; total: number; pct: number }>;
};

export type AdaptiveScore = {
  correct: number;
  total: number;
  pct: number;
  scoringVersion: string;
  bySkill: Record<string, AdaptiveSkillScore>;
};

/**
 * Score an attempt by difficulty. Answering only the easy questions correctly earns
 * little weight against the full ladder, so a weak run cannot reach a strong score.
 */
export function scoreAdaptive(asked: AskedAnswer[], start: number, quotaBySkill: Record<string, number>): AdaptiveScore {
  const bySkill: Record<string, AdaptiveSkillScore> = {};
  let correct = 0;

  for (const { question, choice } of asked) {
    const skill = getSkill(question.skillId);
    const d = difficultyOf(question, skill);
    const ok = Number.isInteger(choice) && choice === question.answer;
    const s = (bySkill[question.skillId] ??= {
      correct: 0,
      total: 0,
      pct: 0,
      earned: 0,
      possible: 0,
      peakCorrect: 0,
      topics: {},
    });
    const t = (s.topics[question.topicId] ??= { correct: 0, total: 0, pct: 0 });
    s.total++;
    t.total++;
    if (ok) {
      s.correct++;
      t.correct++;
      s.earned += WEIGHT[d];
      s.peakCorrect = Math.max(s.peakCorrect, d);
      correct++;
    }
  }

  for (const [skillId, s] of Object.entries(bySkill)) {
    s.possible = maxWeight(quotaBySkill[skillId] ?? s.total, start);
    s.pct = s.possible ? Math.min(Math.round((s.earned / s.possible) * 100), 100) : 0;
    for (const t of Object.values(s.topics)) t.pct = t.total ? Math.round((t.correct / t.total) * 100) : 0;
  }

  const earned = Object.values(bySkill).reduce((n, s) => n + s.earned, 0);
  const possible = Object.values(bySkill).reduce((n, s) => n + s.possible, 0);

  return {
    correct,
    total: asked.length,
    pct: possible ? Math.min(Math.round((earned / possible) * 100), 100) : 0,
    scoringVersion: SCORING_VERSION,
    bySkill,
  };
}
