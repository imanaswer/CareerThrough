import type { Skill } from "./taxonomy";
import * as data from "./skills/data";
import * as frontend from "./skills/frontend";
import * as backend from "./skills/backend";
import * as qa from "./skills/qa";
import * as devops from "./skills/devops";
import * as shared from "./skills/shared";

export const GROUPS = [data, frontend, backend, qa, devops, shared];

export const SKILLS: Skill[] = GROUPS.flatMap((g) => g.skills);

const byId = new Map(SKILLS.map((s) => [s.id, s]));

export function getSkill(id: string): Skill {
  const s = byId.get(id);
  if (!s) throw new Error(`Unknown skill: ${id}`);
  return s;
}

export function skillName(id: string): string {
  return byId.get(id)?.name ?? id;
}
