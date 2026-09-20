import "server-only";
import { careerEvent, db } from "@/db";

export type CareerEventType =
  | "ROLE_SELECTED"
  | "ENROLLMENT_COMPLETED"
  | "RESUME_UPLOADED"
  | "PROFILE_CONFIRMED"
  | "BASELINE_STARTED"
  | "BASELINE_COMPLETED"
  | "SKILL_ASSESSMENT_STARTED"
  | "SKILL_ASSESSMENT_COMPLETED"
  | "FINAL_ASSESSMENT_STARTED"
  | "FINAL_ASSESSMENT_COMPLETED"
  | "PLAN_DAY_COMPLETED"
  | "INTERVIEW_PRACTISED"
  | "PROJECT_SUBMITTED"
  | "EVIDENCE_ADDED"
  | "READINESS_UPDATED"
  | "JOB_UNLOCKED"
  | "CAREER_CARD_CREATED"
  | "CAREER_CARD_SHARED"
  | "CAREER_CARD_HIDDEN";

type Tx = Pick<typeof db, "insert">;

export async function logEvent(
  userId: string,
  eventType: CareerEventType,
  metadata: Record<string, unknown> = {},
  tx: Tx = db,
) {
  await tx.insert(careerEvent).values({ userId, eventType, metadata });
}
