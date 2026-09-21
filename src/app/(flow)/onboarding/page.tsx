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
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Step 2 of 8 · Profile</p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Start with the real you</h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
          Upload your actual resume — not one tuned for a job ad. We use it as your starting point for <span className="font-medium text-foreground">{role.title}</span>. Anything you list is a
          <strong className="text-foreground font-medium"> claim, not proof</strong>: it counts for at most 30% of a skill until you verify it in an assessment.
        </p>
      </div>
      <OnboardingForm initial={profile.resume ?? EMPTY_RESUME} hasExisting={Boolean(profile.confirmedAt)} baselineHref={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`} />
    </>
  );
}
