CREATE TABLE "attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"assessment_id" text NOT NULL,
	"kind" text NOT NULL,
	"role_id" text NOT NULL,
	"question_ids" jsonb NOT NULL,
	"answers" jsonb,
	"score_by_skill" jsonb,
	"impact" jsonb,
	"verified" boolean DEFAULT false NOT NULL,
	"tab_switches" integer DEFAULT 0 NOT NULL,
	"duration_min" integer NOT NULL,
	"content_version" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "career_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_id" text NOT NULL,
	"type" text NOT NULL,
	"source" text NOT NULL,
	"ref_id" text,
	"url" text,
	"score" real,
	"confidence" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"detail" jsonb,
	"content_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text,
	"target_role_id" text,
	"enrolled_at" timestamp with time zone,
	"resume" jsonb,
	"resume_path" text,
	"confirmed_at" timestamp with time zone,
	"card_slug" text,
	"card_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_card_slug_unique" UNIQUE("card_slug")
);
--> statement-breakpoint
CREATE TABLE "readiness_snapshot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" text NOT NULL,
	"score" integer NOT NULL,
	"band" text NOT NULL,
	"breakdown" jsonb NOT NULL,
	"gaps" jsonb NOT NULL,
	"next_actions" jsonb NOT NULL,
	"unlocked_job_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"trigger" text NOT NULL,
	"formula_version" text NOT NULL,
	"content_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "attempt_user_idx" ON "attempt" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE INDEX "event_user_idx" ON "career_event" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "evidence_user_idx" ON "evidence" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "snapshot_user_idx" ON "readiness_snapshot" USING btree ("user_id","created_at");--> statement-breakpoint
-- All access is server-side via Drizzle (table owner, bypasses RLS).
-- RLS on with no policies = the public anon/authenticated API keys can read nothing.
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "attempt" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "readiness_snapshot" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "career_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- Private bucket for resume PDFs; read/written only with the service role key.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
