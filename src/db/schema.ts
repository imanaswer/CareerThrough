import { boolean, index, integer, jsonb, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { EvidenceItem, Readiness } from "@/lib/readiness";
import type { AttemptScore } from "@/lib/assessment";
import type { Impact } from "@/lib/impact";
import type { ResumeData } from "@/lib/resume-schema";

// userId is Supabase auth.users.id. All access goes through Drizzle on the server;
// RLS is enabled with no policies so the public API key can read nothing (see migration).

const ts = (name: string) => timestamp(name, { withTimezone: true });

type EvidenceDetail = NonNullable<EvidenceItem["detail"]>;

export const profile = pgTable("profile", {
  userId: uuid("user_id").primaryKey(),
  name: text("name").notNull().default(""),
  email: text("email"),
  targetRoleId: text("target_role_id"),
  enrolledAt: ts("enrolled_at"),
  resume: jsonb("resume").$type<ResumeData>(),
  resumePath: text("resume_path"),
  confirmedAt: ts("confirmed_at"),
  cardSlug: text("card_slug").unique(),
  cardPublic: boolean("card_public").notNull().default(false),
  createdAt: ts("created_at").notNull().defaultNow(),
});

export const attempt = pgTable(
  "attempt",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    assessmentId: text("assessment_id").notNull(),
    kind: text("kind").$type<"baseline" | "skill" | "final">().notNull(),
    roleId: text("role_id").notNull(),
    /** Questions issued so far. Grows as the adaptive ladder serves them. */
    questionIds: jsonb("question_ids").$type<string[]>().notNull(),
    answers: jsonb("answers").$type<Record<string, number>>(),
    score: jsonb("score_by_skill").$type<AttemptScore>(),
    /** knowledge → interview → complete. */
    stage: text("stage").$type<"knowledge" | "interview" | "complete">().notNull().default("knowledge"),
    /** Interview prompts issued for this attempt, in order. */
    interviewPromptIds: jsonb("interview_prompt_ids").$type<string[]>().notNull().default([]),
    scoringVersion: text("scoring_version"),
    impact: jsonb("impact").$type<Impact>(),
    verified: boolean("verified").notNull().default(false),
    tabSwitches: integer("tab_switches").notNull().default(0),
    durationMin: integer("duration_min").notNull(),
    contentVersion: text("content_version").notNull(),
    startedAt: ts("started_at").notNull().defaultNow(),
    completedAt: ts("completed_at"),
  },
  (t) => [index("attempt_user_idx").on(t.userId, t.startedAt)],
);

export const evidence = pgTable(
  "evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    skillId: text("skill_id").notNull(),
    type: text("type").$type<"assessment" | "project" | "resume_claim" | "interview">().notNull(),
    source: text("source").notNull(),
    refId: text("ref_id"),
    url: text("url"),
    score: real("score"),
    confidence: text("confidence").$type<"low" | "medium" | "high" | "very_high">().notNull(),
    verified: boolean("verified").notNull().default(false),
    detail: jsonb("detail").$type<EvidenceDetail>(),
    contentVersion: text("content_version").notNull(),
    createdAt: ts("created_at").notNull().defaultNow(),
    expiresAt: ts("expires_at"),
  },
  (t) => [index("evidence_user_idx").on(t.userId, t.createdAt)],
);

/** One open-ended interview answer. Kept separate so it can be re-scored or human-reviewed later. */
export const interviewResponse = pgTable(
  "interview_response",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    attemptId: uuid("attempt_id").notNull(),
    promptId: text("prompt_id").notNull(),
    skillId: text("skill_id"),
    roleId: text("role_id").notNull(),
    answer: text("answer").notNull(),
    words: integer("words").notNull(),
    seconds: integer("seconds").notNull().default(0),
    /** pending until a scorer runs; skipped if the candidate passed on the question. */
    status: text("status").$type<"pending" | "scored" | "skipped" | "failed">().notNull().default("pending"),
    /** Rubric dimension → 0-4, once scored. */
    rubric: jsonb("rubric").$type<Record<string, number>>(),
    score: integer("score"),
    feedback: jsonb("feedback").$type<{ strengths: string[]; improve: string[]; summary: string }>(),
    provider: text("provider"),
    model: text("model"),
    rubricVersion: text("rubric_version").notNull(),
    contentVersion: text("content_version").notNull(),
    createdAt: ts("created_at").notNull().defaultNow(),
    scoredAt: ts("scored_at"),
  },
  (t) => [index("interview_user_idx").on(t.userId, t.createdAt), index("interview_attempt_idx").on(t.attemptId)],
);

export const readinessSnapshot = pgTable(
  "readiness_snapshot",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    roleId: text("role_id").notNull(),
    score: integer("score").notNull(),
    band: text("band").notNull(),
    breakdown: jsonb("breakdown").$type<Readiness>().notNull(),
    gaps: jsonb("gaps").$type<Readiness["gaps"]>().notNull(),
    nextActions: jsonb("next_actions").$type<Readiness["nextActions"]>().notNull(),
    unlockedJobIds: jsonb("unlocked_job_ids").$type<string[]>().notNull().default([]),
    trigger: text("trigger").notNull(),
    formulaVersion: text("formula_version").notNull(),
    contentVersion: text("content_version").notNull(),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("snapshot_user_idx").on(t.userId, t.createdAt)],
);

export const careerEvent = pgTable(
  "career_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    eventType: text("event_type").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("event_user_idx").on(t.userId, t.createdAt)],
);
