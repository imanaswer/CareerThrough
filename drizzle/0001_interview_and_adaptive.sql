CREATE TABLE "interview_response" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"attempt_id" uuid NOT NULL,
	"prompt_id" text NOT NULL,
	"skill_id" text,
	"role_id" text NOT NULL,
	"answer" text NOT NULL,
	"words" integer NOT NULL,
	"seconds" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"rubric" jsonb,
	"score" integer,
	"feedback" jsonb,
	"provider" text,
	"model" text,
	"rubric_version" text NOT NULL,
	"content_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scored_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "stage" text DEFAULT 'knowledge' NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "interview_prompt_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "scoring_version" text;--> statement-breakpoint
CREATE INDEX "interview_user_idx" ON "interview_response" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "interview_attempt_idx" ON "interview_response" USING btree ("attempt_id");--> statement-breakpoint
-- Same rule as every other table: server-side access only.
ALTER TABLE "interview_response" ENABLE ROW LEVEL SECURITY;
