import "server-only";
import type { AssessmentDef, InterviewPrompt, Role } from "@/content/taxonomy";
import { promptsForRole, promptsForSkill } from "@/content/interview";

/**
 * Which interview questions follow the multiple-choice section, and in what order.
 * Always progressive: warm-up first, then core, then probing. Never the reverse.
 */
export function selectPrompts(
  def: AssessmentDef,
  role: Role,
  opts: { weakestSkillIds?: string[] } = {},
): InterviewPrompt[] {
  const byDepth = (a: InterviewPrompt, b: InterviewPrompt) => a.depth - b.depth;
  const role_ = promptsForRole(role.id);

  if (def.kind === "skill") {
    // Two questions on the skill just tested: explain it, then defend a judgement.
    return promptsForSkill(def.skillIds[0]).slice(0, 2).sort(byDepth);
  }

  if (def.kind === "baseline") {
    // Short and gentle: this is their first contact with the interview.
    return [
      ...role_.filter((p) => p.depth === 1).slice(0, 2),
      ...role_.filter((p) => p.depth === 2).slice(0, 1),
    ].sort(byDepth);
  }

  // Final verification: a full mock interview across the role and its critical skills.
  const technical = (opts.weakestSkillIds ?? role.skills.filter((s) => s.priority === "critical").map((s) => s.skillId))
    .slice(0, 2)
    .flatMap((skillId) => promptsForSkill(skillId).filter((p) => p.depth === 3).slice(0, 1));

  return [
    ...role_.filter((p) => p.depth === 1).slice(0, 1),
    ...role_.filter((p) => p.depth === 2).slice(0, 2),
    ...technical,
    ...role_.filter((p) => p.depth === 3).slice(0, 1),
  ].sort(byDepth);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
