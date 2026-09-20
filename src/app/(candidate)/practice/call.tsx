"use client";

import { useRouter } from "next/navigation";
import { InterviewCall, type CallTurn } from "@/components/interview-call";
import { finishInterview, interviewTurn } from "../../actions";

/** Practice conversation: rehearsal only, nothing stored as evidence. */
export function PracticeCall({ setId, title, subtitle, durationMin }: { setId: string; title: string; subtitle: string; durationMin: number }) {
  const router = useRouter();
  return (
    <InterviewCall
      title={title}
      subtitle={subtitle}
      durationMin={durationMin}
      finishLabel="End practice"
      onTurn={async (transcript: CallTurn[]) => {
        const res = await interviewTurn({ mode: "practice", setId, transcript });
        if ("error" in res) throw new Error(res.error);
        return res;
      }}
      onFinish={async (transcript) => {
        await finishInterview({ mode: "practice", setId, transcript });
        // The write-up is built from the transcript in the browser, so nothing is stored.
        sessionStorage.setItem("practice-transcript", JSON.stringify({ setId, transcript }));
        router.push("/practice/report");
      }}
    />
  );
}
