import "server-only";
import type { Job, Role } from "@/content/taxonomy";
import { computeReadiness, type EvidenceItem, type Readiness } from "./readiness";
import { matchJobs, type JobMatch } from "./matching";
import type { NextAction, ProjectedImpact } from "./next-action";

/**
 * "What would this action change?" — answered by re-running the real readiness and
 * matching engines over the candidate's real evidence plus one hypothetical result.
 * Nothing is estimated: the numbers are what the engine would produce if the
 * candidate reached the target, and the UI must always say "if".
 */
export function projectSkillImpact(
  role: Role,
  base: Readiness,
  baseMatches: JobMatch[],
  evidence: EvidenceItem[],
  skillId: string,
  opts: { jobs: Job[]; now?: Date },
): ProjectedImpact | undefined {
  const now = opts.now ?? new Date();
  const roleSkill = role.skills.find((s) => s.skillId === skillId);
  const current = base.perSkill.find((p) => p.skillId === skillId);
  // Already at or above target: "reaching the target" would mean going backwards, so there is
  // nothing honest to project.
  if (!roleSkill || !current || current.level >= roleSkill.target) return undefined;

  const hypothetical: EvidenceItem = {
    id: "__projected__",
    skillId,
    type: "assessment",
    source: "skill",
    refId: null,
    url: null,
    score: roleSkill.target,
    confidence: "medium",
    verified: true,
    detail: null,
    // Must outrank any real attempt recorded this same millisecond, or the engine
    // would keep the existing (lower) level and the projection would read as zero.
    createdAt: new Date(now.getTime() + 1000),
    expiresAt: null,
  };

  const after = computeReadiness(role, [...evidence, hypothetical], {
    now,
    jobs: opts.jobs,
    skipActions: true,
  });
  const wasUnlocked = new Set(baseMatches.filter((m) => m.unlocked).map((m) => m.jobId));

  return {
    skillId,
    from: current.level,
    to: roleSkill.target,
    deltaScore: Math.max(after.score - base.score, 0),
    unlockedJobIds: matchJobs(opts.jobs, role, after)
      .filter((m) => m.unlocked && !wasUnlocked.has(m.jobId))
      .map((m) => m.jobId),
  };
}

/** Attach a projection to each skill-based recommendation. Non-skill actions get none. */
export function withProjectedImpact(
  role: Role,
  readiness: Readiness,
  matches: JobMatch[],
  evidence: EvidenceItem[],
  jobs: Job[],
  now?: Date,
): NextAction[] {
  return readiness.nextActions.map((a) =>
    a.skillId
      ? { ...a, impact: projectSkillImpact(role, readiness, matches, evidence, a.skillId, { jobs, now }) }
      : a,
  );
}

export type NextUnlock = {
  match: JobMatch;
  /** Requirements satisfied out of everything this job asks for. */
  met: number;
  total: number;
  progressPct: number;
};

/**
 * The closest locked opportunity: fewest blockers first, then best skill coverage.
 * Deterministic — the matching engine decides, not a ranking heuristic over job desirability.
 */
export function nextUnlock(matches: JobMatch[]): NextUnlock | undefined {
  const locked = [...matches]
    .filter((m) => !m.unlocked)
    .sort((a, b) => a.blockers.length - b.blockers.length || b.matchPct - a.matchPct || a.jobId.localeCompare(b.jobId));
  const match = locked[0];
  if (!match) return undefined;
  const total = match.meets.length + match.blockers.length;
  const met = match.meets.length;
  return { match, met, total, progressPct: total ? Math.round((met / total) * 100) : 0 };
}
