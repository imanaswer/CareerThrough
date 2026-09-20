import type { SkillPlan } from "./taxonomy";
import { GROUPS } from "./skills";

export const PLANS: SkillPlan[] = GROUPS.flatMap((g) => g.plans);

const bySkill = new Map(PLANS.map((p) => [p.skillId, p]));

export function getPlan(skillId: string): SkillPlan | undefined {
  return bySkill.get(skillId);
}
