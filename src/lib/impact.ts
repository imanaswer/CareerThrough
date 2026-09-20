import "server-only";
import { PRIORITY_LABELS } from "@/content/taxonomy";
import type { Readiness } from "./readiness";
import type { JobMatch } from "./matching";

export type Impact = {
  scoreBefore: number | null;
  scoreAfter: number;
  delta: number;
  bandChanged: string | null;
  skills: { skillId: string; name: string; before: number; after: number }[];
  resolvedGaps: string[];
  remainingGaps: string[];
  /** Critical gap count before/after. Optional: attempts recorded before this field existed lack it. */
  criticalGaps?: { before: number; after: number };
  coverage?: { before: number; after: number; total: number };
  /** e.g. "SQL moved from Critical gap → meets target" */
  notes: string[];
  unlockedJobIds: string[];
};

/** What a new piece of evidence actually changed. Shown after every assessment. */
export function computeImpact(
  before: Readiness | null,
  after: Readiness,
  touchedSkillIds: string[],
  jobsBefore: JobMatch[],
  jobsAfter: JobMatch[],
): Impact {
  const prev = new Map(before?.perSkill.map((p) => [p.skillId, p]) ?? []);
  const touched = after.perSkill.filter((p) => touchedSkillIds.includes(p.skillId));

  const resolved = touched.filter((p) => p.gap >= 0 && (prev.get(p.skillId)?.gap ?? -1) < 0);
  const remaining = touched.filter((p) => p.gap < 0);
  const wasUnlocked = new Set(jobsBefore.filter((j) => j.unlocked).map((j) => j.jobId));

  return {
    criticalGaps: {
      // Without a prior snapshot, every critical skill was an open gap — not every skill.
      before: before?.gaps.critical.length ?? after.perSkill.filter((p) => p.priority === "critical").length,
      after: after.gaps.critical.length,
    },
    coverage: {
      before: before?.perSkill.filter((p) => p.assessed).length ?? 0,
      after: after.evidenceCoverage.assessed,
      total: after.evidenceCoverage.total,
    },
    scoreBefore: before?.score ?? null,
    scoreAfter: after.score,
    delta: after.score - (before?.score ?? 0),
    bandChanged: before && before.band.id !== after.band.id ? `${before.band.label} → ${after.band.label}` : null,
    skills: touched.map((p) => ({
      skillId: p.skillId,
      name: p.name,
      before: prev.get(p.skillId)?.level ?? 0,
      after: p.level,
    })),
    resolvedGaps: resolved.map((p) => p.skillId),
    remainingGaps: remaining.map((p) => p.skillId),
    notes: resolved.map((p) => `${p.name}: ${PRIORITY_LABELS[p.priority]} gap closed — now meets the ${p.target}% target.`),
    unlockedJobIds: jobsAfter.filter((j) => j.unlocked && !wasUnlocked.has(j.jobId)).map((j) => j.jobId),
  };
}
