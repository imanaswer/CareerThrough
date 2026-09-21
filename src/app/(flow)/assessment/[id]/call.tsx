"use client";

import { useRouter } from "next/navigation";
import { InterviewCall, type CallTurn } from "@/components/interview-call";
import { finishInterview, interviewTurn } from "../../../actions";

/** The interview section of an assessment, run as a conversation. */
export function AssessmentCall({ attemptId, title, subtitle, durationMin }: { attemptId: string; title: string; subtitle: string; durationMin: number }) {
  const router = useRouter();
  return (
    <InterviewCall
      title={title}
      subtitle={subtitle}
      durationMin={durationMin}
      finishLabel="Finish and see results"
      onTurn={async (transcript: CallTurn[]) => {
        const res = await interviewTurn({ mode: "assessment", setId: attemptId, transcript });
        if ("error" in res) throw new Error(res.error);
        return res;
      }}
      onFinish={async (transcript) => {
        const res = await finishInterview({ mode: "assessment", setId: attemptId, transcript });
        if ("ok" in res) router.push(res.href);
      }}
    />
  );
}
