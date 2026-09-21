import type { InterviewPrompt } from "@/content/taxonomy";
import { analyseAnswer, type AnswerFeedback } from "./feedback";

/**
 * The practice write-up, built in the browser from a transcript that was never stored.
 * Uses the same analysis as the server so practice and assessment say the same things.
 */

export type TranscriptTurn = { speaker: "interviewer" | "candidate"; text: string; promptId?: string };
export type PracticePromptLite = Pick<InterviewPrompt, "id" | "prompt" | "kind" | "minWords" | "lookFor">;

const KIND_LABEL = { behavioural: "Behavioural", technical: "Technical", situational: "Situational" };

export type ReportItem = {
  promptId: string;
  prompt: string;
  kindLabel: string;
  answer: string;
  feedback: AnswerFeedback | null;
};

export function analysePracticeTranscript(transcript: TranscriptTurn[], prompts: PracticePromptLite[]): ReportItem[] {
  const byId = new Map(prompts.map((p) => [p.id, p]));
  const answers: { promptId: string; answer: string }[] = [];
  let current: string | null = null;

  for (const turn of transcript) {
    if (turn.speaker === "interviewer" && turn.promptId) {
      current = turn.promptId;
      if (!answers.some((a) => a.promptId === current)) answers.push({ promptId: current, answer: "" });
    } else if (turn.speaker === "candidate" && current) {
      const entry = answers.find((a) => a.promptId === current)!;
      entry.answer = `${entry.answer} ${turn.text}`.trim();
    }
  }

  return answers.map(({ promptId, answer }) => {
    const p = byId.get(promptId);
    return {
      promptId,
      prompt: p?.prompt ?? promptId,
      kindLabel: p ? KIND_LABEL[p.kind] : "Question",
      answer,
      feedback: p && answer ? analyseAnswer(p as InterviewPrompt, answer) : null,
    };
  });
}
