import "server-only";

export type StageId =
  | "discover"
  | "profile"
  | "baseline"
  | "understand"
  | "build"
  | "verify"
  | "career_card"
  | "opportunities";

export type StageState = "completed" | "current" | "upcoming";

export type StageItem = { done: boolean; label: string };

export type Stage = {
  id: StageId;
  label: string;
  state: StageState;
  detail: string;
  href: string;
  cta: string;
  items: StageItem[];
};

export type JourneyInput = {
  roleId: string | null;
  roleTitle: string;
  profileConfirmed: boolean;
  claimedSkills: number;
  baselineDone: boolean;
  /** Any skill assessment, plan activity or project after the baseline. */
  actedOnGaps: boolean;
  criticalGapsAtBaseline: number;
  criticalGapsNow: number;
  skillAssessments: number;
  evidenceCount: number;
  assessedSkills: number;
  totalSkills: number;
  hasProject: boolean;
  finalDone: boolean;
  hasCard: boolean;
  cardPublic: boolean;
  unlockedJobs: number;
  totalJobs: number;
};

/** Derive the 8-stage journey from real state. First incomplete stage is "current". */
export function computeJourney(j: JourneyInput): Stage[] {
  const closed = Math.max(j.criticalGapsAtBaseline - j.criticalGapsNow, 0);
  const buildDone = j.baselineDone && j.criticalGapsNow === 0 && j.hasProject;
  const buildDetail = !j.baselineDone
    ? "Close your gaps and build evidence"
    : j.criticalGapsNow > 0
      ? `Close critical gaps — ${closed} of ${j.criticalGapsAtBaseline} completed`
      : j.hasProject
        ? "Critical gaps closed, project on record"
        : "Critical gaps closed — submit your project";

  const stages: (Omit<Stage, "state"> & { done: boolean })[] = [];
  const add = (id: StageId, label: string, done: boolean, detail: string, href: string, cta: string, items: StageItem[]) =>
    stages.push({ id, label, detail, href, cta, done, items });

  add("discover", "Discover", Boolean(j.roleId), j.roleId ? "Target role chosen" : "Choose your target role", "/", "Explore roles", [
    { done: Boolean(j.roleId), label: j.roleId ? `Target role: ${j.roleTitle}` : "Choose a target role" },
  ]);
  add("profile", "Profile", j.profileConfirmed, j.profileConfirmed ? "Profile confirmed" : "Add your real profile", "/onboarding", "Complete profile", [
    { done: j.profileConfirmed, label: "Profile reviewed and confirmed" },
    { done: j.claimedSkills > 0, label: `${j.claimedSkills} skills claimed from your resume (capped until assessed)` },
  ]);
  add("baseline", "Baseline", j.baselineDone, j.baselineDone ? "Baseline complete" : "Measure where you stand", "/assessments", "Start baseline", [
    { done: j.baselineDone, label: `Baseline across all ${j.totalSkills} role skills` },
  ]);
  add("understand", "Understand", j.baselineDone && j.actedOnGaps, "Review your readiness and gaps", "/dashboard", "View readiness", [
    { done: j.baselineDone, label: "Readiness measured from evidence" },
    { done: j.baselineDone, label: `${j.criticalGapsNow} critical gaps identified` },
    { done: j.actedOnGaps, label: "Acted on your first gap" },
  ]);
  add("build", "Build", buildDone, buildDetail, "/plan", "Open my plan", [
    { done: j.baselineDone && j.criticalGapsNow === 0, label: `Critical gaps closed — ${closed} of ${j.criticalGapsAtBaseline}` },
    { done: j.skillAssessments > 0, label: `${j.skillAssessments} skill assessments passed into evidence` },
    { done: j.hasProject, label: "Project evidence submitted" },
  ]);
  add("verify", "Verify", j.finalDone, j.finalDone ? "Final verification complete" : "Pass the final verification", "/assessments", "Final verification", [
    { done: j.assessedSkills > 0, label: `${j.assessedSkills} of ${j.totalSkills} skills backed by assessment` },
    { done: j.evidenceCount > 0, label: `${j.evidenceCount} evidence records` },
    { done: j.finalDone, label: "Final verification across all role skills" },
  ]);
  add("career_card", "Career Card", j.hasCard, j.hasCard ? "Career Card issued" : "Receive your Career Card", "/card", "Open Career Card", [
    { done: j.hasCard, label: "Career Card issued" },
    { done: j.cardPublic, label: "Shared with a public link (optional)" },
  ]);
  add(
    "opportunities",
    "Opportunities",
    j.hasCard && j.unlockedJobs > 0,
    j.unlockedJobs ? `${j.unlockedJobs} ${j.unlockedJobs === 1 ? "opportunity" : "opportunities"} unlocked` : "Unlock matched opportunities",
    "/jobs",
    "View opportunities",
    [{ done: j.unlockedJobs > 0, label: `${j.unlockedJobs} of ${j.totalJobs} opportunities unlocked` }],
  );

  let currentSet = false;
  return stages.map(({ done, ...s }) => {
    if (done) return { ...s, state: "completed" as const };
    if (!currentSet) {
      currentSet = true;
      return { ...s, state: "current" as const };
    }
    return { ...s, state: "upcoming" as const };
  });
}
