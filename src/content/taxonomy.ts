// Types for all in-code content. Content lives in code (versioned by CONTENT_VERSION);
// user data lives in Postgres and stamps the version it was scored against.

export type Dimension = "technical" | "aptitude" | "communication" | "soft_skills" | "interview";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  technical: "Technical",
  aptitude: "Aptitude",
  communication: "Communication",
  soft_skills: "Soft Skills",
  interview: "Interview",
};

/** Dimensions that count toward the numeric readiness score. Interview joins in v2. */
export const SCORED_DIMENSIONS: Dimension[] = ["technical", "aptitude", "communication", "soft_skills"];

export type Priority = "critical" | "important" | "nice";

export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: "Critical",
  important: "Important",
  nice: "Nice to have",
};

export type Topic = { id: string; name: string };

export type Skill = {
  id: string;
  name: string;
  dimension: Dimension;
  description: string;
  /** Exactly 4 topics. Questions and plan days both map onto these. */
  topics: Topic[];
};

export type Question = {
  id: string;
  skillId: string;
  topicId: string;
  prompt: string;
  options: string[];
  /** Index into options. NEVER sent to the client. */
  answer: number;
  explanation: string;
};

/** Question as the browser sees it. */
export type PublicQuestion = Omit<Question, "answer" | "explanation">;

export type PlanDay = {
  /** Topic this day closes, or null for the final practical day. */
  topicId: string | null;
  title: string;
  minutes: number;
  summary: string;
  learn: string[];
  practice: string;
};

export type SkillPlan = { skillId: string; days: PlanDay[] };

export type RoleSkill = {
  skillId: string;
  /** Level (0-100) the role expects. */
  target: number;
  /** Relative weight inside the readiness score. */
  weight: number;
  priority: Priority;
  prerequisites?: string[];
};

export type BandId = "foundation" | "developing" | "entry_ready" | "strong" | "highly_ready";

export type Band = { id: BandId; label: string; min: number; access: string };

export type ProjectBrief = {
  id: string;
  title: string;
  brief: string;
  requirements: string[];
  skillIds: string[];
};

export type Role = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  whatYouDo: string[];
  dimensions: Dimension[];
  skills: RoleSkill[];
  /** Per-role band floors. Roles override these; 60 is not universally "job-ready". */
  bands: Band[];
  /** Readiness needed before the Career Card says "Ready". */
  readyThreshold: number;
  journeyEstimate: string;
  project: ProjectBrief;
};

export type JobLevel = "internship" | "entry" | "junior";

export type HardRequirement = {
  skillId: string;
  min: number;
  /** If true the level must come from assessed evidence, not a resume claim. */
  requiresAssessed?: boolean;
};

export type Job = {
  id: string;
  roleId: string;
  title: string;
  /** Fictional employers: v1 jobs are seed content, not live postings. */
  company: string;
  location: string;
  employmentType: "Full-time" | "Internship" | "Contract";
  level: JobLevel;
  summary: string;
  /** Skills used for match %. */
  skills: { skillId: string; weight: number }[];
  hardRequirements: HardRequirement[];
  /** Role readiness needed before this job unlocks. */
  minReadiness: number;
  requiresProject?: boolean;
};

export type AssessmentKind = "baseline" | "skill" | "final";

export type AssessmentDef = {
  id: string;
  kind: AssessmentKind;
  title: string;
  roleId: string | null;
  skillIds: string[];
  questionsPerSkill: number;
  durationMin: number;
};

export const DEFAULT_BANDS: Band[] = [
  { id: "foundation", label: "Foundation", min: 0, access: "Preparation only" },
  { id: "developing", label: "Developing", min: 40, access: "Keep closing critical gaps" },
  { id: "entry_ready", label: "Entry-ready", min: 60, access: "Eligible entry-level opportunities" },
  { id: "strong", label: "Strong", min: 70, access: "Broader role opportunities" },
  { id: "highly_ready", label: "Highly ready", min: 80, access: "High-readiness opportunities, subject to job requirements" },
];

/** Build a role's bands by overriding default floors. */
export function bands(overrides: Partial<Record<BandId, number>> = {}): Band[] {
  return DEFAULT_BANDS.map((b) => ({ ...b, min: overrides[b.id] ?? b.min }));
}

// ── Interview ──────────────────────────────────────────────────
// Open-ended prompts asked after the multiple-choice section. Answers are stored
// and evaluated by a pluggable provider; no score is invented before one exists.

export type InterviewKind = "behavioural" | "technical" | "situational";

/** Progressive depth: 1 warm-up, 2 core, 3 probing. Always asked in this order. */
export type Depth = 1 | 2 | 3;

export type InterviewPrompt = {
  id: string;
  kind: InterviewKind;
  /** Behavioural and situational prompts belong to a role; technical ones to a skill. */
  roleId?: string;
  skillId?: string;
  depth: Depth;
  prompt: string;
  /** Optional scenario shown above the question. */
  context?: string;
  /** What a strong answer contains. Anchors the rubric and the candidate's feedback. */
  lookFor: string[];
  /** Asked only if the answer is thin. */
  followUp?: string;
  minWords: number;
};
