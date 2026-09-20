import "server-only";
import type { Band, Priority, Role } from "@/content/taxonomy";
import { getPlan } from "@/content/plans";
import type { SkillReadiness } from "./readiness";

export type NextAction = {
  id: string;
  kind: "assess" | "plan" | "project" | "final" | "card";
  skillId: string | null;
  title: string;
  current: number | null;
  target: number | null;
  why: string;
  /** Short bullets behind the recommendation, for the "why now" list. */
  reasons: string[];
  action: string;
  href: string;
  blocksJobs: number;
  /** Filled in by the projection in simulate.ts; absent means we cannot state an impact. */
  impact?: ProjectedImpact;
};

export type ProjectedImpact = {
  /** The skill this projection raises to its target. */
  skillId: string;
  from: number;
  to: number;
  /** Readiness points gained IF the target is reached. Never a promise of a score. */
  deltaScore: number;
  unlockedJobIds: string[];
};

type ReadinessCore = {
  roleId: string;
  score: number;
  band: Band;
  perSkill: SkillReadiness[];
  gaps: Record<Priority, string[]>;
};

const PRIORITY_RANK: Record<Priority, number> = { critical: 0, important: 1, nice: 2 };

/**
 * Deterministic Next Best Action ranking.
 * Order: critical gaps → skills blocking jobs → role weight → closest to target.
 * A gap's unmet prerequisite is always pulled ahead of it.
 * Then required evidence (project), then required assessment (final verification).
 */
export function rankNextActions(
  role: Role,
  r: ReadinessCore,
  ctx: { blocked: Map<string, number>; projectRequiredBy: number; hasFinal: boolean },
): NextAction[] {
  const { blocked } = ctx;

  const gapSkills = r.perSkill
    .filter((p) => p.gap < 0)
    .sort(
      (a, b) =>
        PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
        (blocked.get(b.skillId) ?? 0) - (blocked.get(a.skillId) ?? 0) ||
        b.weight - a.weight ||
        b.gap - a.gap || // gaps are negative: closest to target first
        a.skillId.localeCompare(b.skillId),
    );

  // Prerequisites first.
  const prereqs = new Map(role.skills.map((s) => [s.skillId, s.prerequisites ?? []]));
  for (let i = 0; i < gapSkills.length; i++) {
    for (const pre of prereqs.get(gapSkills[i].skillId) ?? []) {
      const j = gapSkills.findIndex((g) => g.skillId === pre);
      if (j > i) gapSkills.splice(i, 0, ...gapSkills.splice(j, 1));
    }
  }

  const PRIORITY_REASON: Record<Priority, string> = {
    critical: "Critical role skill",
    important: "Important role skill",
    nice: "Nice-to-have for this role",
  };

  const actions: NextAction[] = gapSkills.map((p) => {
    const n = blocked.get(p.skillId) ?? 0;
    const blocks = n ? ` and currently blocks ${n} ${n === 1 ? "opportunity" : "opportunities"}` : "";
    const tier = p.priority === "critical" ? "a critical role requirement" : p.priority === "important" ? "an important role skill" : "a nice-to-have for this role";
    const reasons = [
      PRIORITY_REASON[p.priority],
      ...(n ? [`Blocks ${n} ${n === 1 ? "opportunity" : "opportunities"}`] : []),
      `Current ${p.level}% · target ${p.target}%`,
    ];
    if (!p.assessed) {
      return {
        id: `assess:${p.skillId}`,
        kind: "assess",
        skillId: p.skillId,
        title: `Verify ${p.name}`,
        current: p.level,
        target: p.target,
        why: `${p.name} is ${tier}${blocks}. You have no assessed evidence for it yet, so it barely counts toward your readiness.`,
        reasons: [...reasons, p.hasExpiredEvidence ? "Previous evidence expired" : "Not yet assessed — assessment available now"],
        action: `Take the ${p.name} assessment`,
        href: `/assessment/skill:${p.skillId}`,
        blocksJobs: n,
      };
    }
    const days = getPlan(p.skillId)?.days.length;
    return {
      id: `plan:${p.skillId}`,
      kind: "plan",
      skillId: p.skillId,
      title: `Improve ${p.name}`,
      current: p.level,
      target: p.target,
      why: `This is ${tier}${blocks}. You are ${-p.gap} points below the ${p.target}% target.`,
      reasons: [...reasons, days ? `${days}-day plan, then re-assess to prove it` : "Re-assess to update this level"],
      action: days ? `Start ${days}-day ${p.name} plan` : `Retake the ${p.name} assessment`,
      href: days ? `/plan/${p.skillId}` : `/assessment/skill:${p.skillId}`,
      blocksJobs: n,
    };
  });

  const hasProject = r.perSkill.some((p) => p.hasProject);
  if (!hasProject) {
    const needing = ctx.projectRequiredBy;
    const project: NextAction = {
      id: "project",
      kind: "project",
      skillId: null,
      title: `Build your project: ${role.project.title}`,
      current: null,
      target: null,
      why: `Projects are practical evidence. ${needing} ${role.title} ${needing === 1 ? "opportunity requires" : "opportunities require"} one, and it strengthens the confidence of your assessed skills.`,
      reasons: [
        "Practical evidence, not a claim",
        ...(needing ? [`Required by ${needing} ${needing === 1 ? "opportunity" : "opportunities"}`] : []),
        "Raises evidence confidence on the skills it covers",
      ],
      action: "View project brief",
      href: "/plan#project",
      blocksJobs: needing,
    };
    // After critical gaps, before everything else.
    const firstNonCritical = actions.findIndex((a) => {
      const p = r.perSkill.find((s) => s.skillId === a.skillId);
      return p?.priority !== "critical";
    });
    actions.splice(firstNonCritical === -1 ? actions.length : firstNonCritical, 0, project);
  }

  if (!ctx.hasFinal && r.gaps.critical.length === 0 && r.score >= role.readyThreshold) {
    actions.unshift({
      id: "final",
      kind: "final",
      skillId: null,
      title: "Take your final verification",
      current: r.score,
      target: role.readyThreshold,
      why: `You have closed every critical gap and reached ${r.score}% readiness. The final verification re-tests all role skills and unlocks your Career Card.`,
      reasons: ["No critical gaps remaining", `Readiness ${r.score}% — threshold is ${role.readyThreshold}%`, "Issues your Career Card"],
      action: "Start final verification",
      href: `/assessment/final:${role.id}`,
      blocksJobs: 0,
    });
  }

  if (ctx.hasFinal && actions.length === 0) {
    actions.push({
      id: "card",
      kind: "card",
      skillId: null,
      title: "Share your Career Card",
      current: null,
      target: null,
      why: "Every role skill meets its target with assessed evidence. Your Career Card is your proof.",
      reasons: ["Every role skill meets its target", "Final verification complete"],
      action: "Open Career Card",
      href: "/card",
      blocksJobs: 0,
    });
  }

  return actions;
}
