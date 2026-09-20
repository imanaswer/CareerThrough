import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile, requireUser } from "@/lib/data";
import { getRole } from "@/content/roles";
import { EMPTY_RESUME } from "@/lib/resume-schema";
import { OnboardingForm } from "./form";

export const metadata: Metadata = { title: "Your profile" };

export default async function OnboardingPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (!profile?.targetRoleId) redirect("/#roles");
  const role = getRole(profile.targetRoleId);
  return (
    <>
      <p className="text-sm font-medium text-primary">Step 2 of 8 · Profile</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Start with the real you</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload your actual resume — not one tuned for a job ad. We use it as your starting point for {role.title}. Anything you list is a
        <strong className="text-foreground"> claim, not proof</strong>: it counts for at most 30% of a skill until you verify it in an assessment.
      </p>
      <OnboardingForm initial={profile.resume ?? EMPTY_RESUME} hasExisting={Boolean(profile.confirmedAt)} baselineHref={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`} />
    </>
  );
}
