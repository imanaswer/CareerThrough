import type { Metadata } from "next";
import { PageHeader } from "@/components/bits";
import { promptsForRole, promptsForSkill } from "@/content/interview";
import { requireCandidate } from "@/lib/data";
import { ReportClient } from "./report-client";

export const metadata: Metadata = { title: "Practice write-up" };

/** The report is built from the transcript the browser still holds — practice stores nothing. */
export default async function PracticeReportPage() {
  const { role } = await requireCandidate();
  const prompts = [...promptsForRole(role.id), ...role.skills.flatMap((s) => promptsForSkill(s.skillId))];
  return (
    <>
      <PageHeader
        title="How that went"
        subtitle="Written from what you said, on the things that can be measured. None of this is stored or counted as evidence."
      />
      <ReportClient
        prompts={prompts.map((p) => ({ id: p.id, prompt: p.prompt, kind: p.kind, minWords: p.minWords, lookFor: p.lookFor }))}
      />
    </>
  );
}
