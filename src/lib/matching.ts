import "server-only";
import type { BandId, Job, JobLevel, Role } from "@/content/taxonomy";
import { skillName } from "@/content/skills";
import type { SkillReadiness } from "./readiness";

/** The role band a job level needs. Floors are per role, so "entry" is not 60 everywhere. */
const LEVEL_BAND: Record<JobLevel, BandId> = {
  internship: "developing",
  entry: "entry_ready",
  junior: "strong",
};

export type RequirementCheck = {
  skillId: string;
  name: string;
  current: number;
  required: number;
  met: boolean;
  reason: "met" | "below" | "not_assessed";
  message: string;
  href: string | null;
};

export type Blocker = { kind: "skill" | "readiness" | "project"; message: string; href: string };

export type JobMatch = {
  jobId: string;
  matchPct: number;
  meets: RequirementCheck[];
  missing: RequirementCheck[];
  /** All hard requirements (and project requirement) satisfied. */
  eligible: boolean;
  /** Eligible AND role readiness is high enough. Only unlocked jobs are actionable. */
  unlocked: boolean;
  requiredReadiness: number;
  blockers: Blocker[];
  summary: string;
};

export type MatchContext = { score: number; perSkill: SkillReadiness[] };

export function requiredReadiness(job: Job, role: Role): number {
  const floor = role.bands.find((b) => b.id === LEVEL_BAND[job.level])?.min ?? 0;
  return Math.max(job.minReadiness, floor);
}

export function matchJob(job: Job, role: Role, ctx: MatchContext): JobMatch {
  const bySkill = new Map(ctx.perSkill.map((p) => [p.skillId, p]));

  const checks: RequirementCheck[] = job.hardRequirements.map((req) => {
    const p = bySkill.get(req.skillId);
    const current = p?.level ?? 0;
    const name = skillName(req.skillId);
    const base = { skillId: req.skillId, name, current, required: req.min };
    if (req.requiresAssessed && !p?.assessed) {
      return {
        ...base,
        met: false,
        reason: "not_assessed",
        message: `Missing: ${name}. Take the ${name} assessment to establish verified evidence.`,
        href: `/assessment/skill:${req.skillId}`,
      };
    }
    if (current < req.min) {
      return {
        ...base,
        met: false,
        reason: "below",
        message: `Missing: ${name}. Reach ${req.min}% to satisfy this requirement, from ${current}% today.`,
        href: `/plan/${req.skillId}`,
      };
    }
    return { ...base, met: true, reason: "met", message: `${name} ${current}% meets the ${req.min}% requirement.`, href: null };
  });

  const meets = checks.filter((c) => c.met);
  const missing = checks.filter((c) => !c.met);

  // Match % = weighted coverage of the job's skills against what the job asks for.
  const reqBySkill = new Map(job.hardRequirements.map((r) => [r.skillId, r.min]));
  const totalWeight = job.skills.reduce((s, k) => s + k.weight, 0);
  const covered = job.skills.reduce((s, k) => {
    const p = bySkill.get(k.skillId);
    const need = reqBySkill.get(k.skillId) ?? p?.target ?? 70;
    return s + k.weight * Math.min((p?.level ?? 0) / need, 1);
  }, 0);
  const matchPct = totalWeight ? Math.round((covered / totalWeight) * 100) : 0;

  const hasProject = ctx.perSkill.some((p) => p.hasProject);
  const projectOk = !job.requiresProject || hasProject;
  const needReadiness = requiredReadiness(job, role);
  const readinessOk = ctx.score >= needReadiness;

  const blockers: Blocker[] = missing.map((m) => ({ kind: "skill", message: m.message, href: m.href! }));
  if (!projectOk) {
    blockers.push({
      kind: "project",
      message: "This role asks for project evidence. Submit your role project.",
      href: "/plan#project",
    });
  }
  if (!readinessOk) {
    blockers.push({
      kind: "readiness",
      message: `Role readiness ${ctx.score}%. This opportunity opens at ${needReadiness}% for ${role.title}.`,
      href: "/dashboard",
    });
  }

  const eligible = missing.length === 0 && projectOk;
  const unlocked = eligible && readinessOk;
  const summary = unlocked
    ? "Eligible based on current role requirements."
    : blockers.length === 1
      ? "One remaining requirement."
      : `${blockers.length} remaining requirements.`;

  return { jobId: job.id, matchPct, meets, missing, eligible, unlocked, requiredReadiness: needReadiness, blockers, summary };
}

export function matchJobs(jobs: Job[], role: Role, ctx: MatchContext): JobMatch[] {
  return jobs.map((j) => matchJob(j, role, ctx));
}
