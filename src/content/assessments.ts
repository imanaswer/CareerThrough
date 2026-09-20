import "server-only"; // this module holds answer keys
import type { AssessmentDef, Question } from "./taxonomy";
import { GROUPS, getSkill } from "./skills";
import { getRole } from "./roles";

export const QUESTIONS: Question[] = GROUPS.flatMap((g) => g.questions);

const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return byId.get(id);
}

export function questionsForSkill(skillId: string): Question[] {
  return QUESTIONS.filter((q) => q.skillId === skillId);
}

const MIN_PER_QUESTION = 1.25;

/**
 * Assessment ids are derived, not stored:
 *   baseline:<roleId>  — 3 questions per role skill
 *   skill:<skillId>    — 6 questions on one skill
 *   final:<roleId>     — 4 questions per role skill
 */
export function getAssessment(id: string): AssessmentDef | null {
  const [kind, ref] = id.split(":");
  if (!ref) return null;
  try {
    if (kind === "baseline" || kind === "final") {
      const role = getRole(ref);
      const perSkill = kind === "baseline" ? 3 : 4;
      const skillIds = role.skills.map((s) => s.skillId);
      return {
        id,
        kind,
        title: `${role.title} ${kind === "baseline" ? "baseline" : "final verification"}`,
        roleId: role.id,
        skillIds,
        questionsPerSkill: perSkill,
        durationMin: Math.ceil(skillIds.length * perSkill * MIN_PER_QUESTION),
      };
    }
    if (kind === "skill") {
      const skill = getSkill(ref);
      return {
        id,
        kind,
        title: `${skill.name} assessment`,
        roleId: null,
        skillIds: [skill.id],
        questionsPerSkill: 6,
        durationMin: 10,
      };
    }
  } catch {
    return null;
  }
  return null;
}
