import "server-only";
import type { AssessmentDef, PublicQuestion, Question } from "@/content/taxonomy";

/** More tab switches than this and the attempt is recorded but not marked verified. */
export const MAX_TAB_SWITCHES = 3;
/** Grace for network latency on submit. */
export const GRACE_SECONDS = 30;
/** Hours before the same assessment can be retaken. The pool is small; retakes should follow practice. */
export const RETAKE_COOLDOWN_HOURS = 6;

// Small seeded PRNG so question selection is reproducible from the attempt id.
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick questions per skill, round-robin across topics so every attempt covers the skill's breadth. */
export function selectQuestions(def: AssessmentDef, pool: Question[], seed: string): Question[] {
  const rand = rng(seed);
  return def.skillIds.flatMap((skillId) => {
    const byTopic = new Map<string, Question[]>();
    for (const q of pool.filter((q) => q.skillId === skillId)) {
      byTopic.set(q.topicId, [...(byTopic.get(q.topicId) ?? []), q]);
    }
    const queues = shuffle([...byTopic.values()].map((qs) => shuffle(qs, rand)), rand);
    const picked: Question[] = [];
    while (picked.length < def.questionsPerSkill && queues.some((q) => q.length)) {
      for (const queue of queues) {
        const q = queue.shift();
        if (q && picked.length < def.questionsPerSkill) picked.push(q);
      }
    }
    return picked;
  });
}

/** Strip the answer key. The only question shape allowed to reach the browser. */
export function toPublic(q: Question): PublicQuestion {
  return { id: q.id, skillId: q.skillId, topicId: q.topicId, prompt: q.prompt, options: q.options };
}

/** "Verified" = finished inside the time limit, server-scored, tab switches within tolerance. */
export function isVerified(a: { startedAt: Date; completedAt: Date; durationMin: number; tabSwitches: number }) {
  const elapsed = (a.completedAt.getTime() - a.startedAt.getTime()) / 1000;
  return elapsed <= a.durationMin * 60 + GRACE_SECONDS && a.tabSwitches <= MAX_TAB_SWITCHES;
}

export function isExpired(startedAt: Date, durationMin: number, now: Date) {
  return (now.getTime() - startedAt.getTime()) / 1000 > durationMin * 60 + GRACE_SECONDS;
}
