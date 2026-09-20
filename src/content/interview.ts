import type { InterviewPrompt } from "./taxonomy";
import { prompts as rolePrompts } from "./interview/roles";
import { prompts as technicalA } from "./interview/technical-a";
import { prompts as technicalB } from "./interview/technical-b";

export const INTERVIEW_PROMPTS: InterviewPrompt[] = [...rolePrompts, ...technicalA, ...technicalB];

const byId = new Map(INTERVIEW_PROMPTS.map((p) => [p.id, p]));

export function getPrompt(id: string): InterviewPrompt | undefined {
  return byId.get(id);
}

export function promptsForRole(roleId: string): InterviewPrompt[] {
  return INTERVIEW_PROMPTS.filter((p) => p.roleId === roleId).sort((a, b) => a.depth - b.depth);
}

export function promptsForSkill(skillId: string): InterviewPrompt[] {
  return INTERVIEW_PROMPTS.filter((p) => p.skillId === skillId).sort((a, b) => a.depth - b.depth);
}
