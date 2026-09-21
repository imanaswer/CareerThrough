import "server-only";
import type { InterviewPrompt } from "@/content/taxonomy";
import { getPrompt } from "@/content/interview";
import { analyseAnswer, type Signal } from "./feedback";
import { countWords } from "./select";

/**
 * Runs the interview as a conversation rather than a form.
 *
 * The interviewer greets you, says what the session is for, asks a question, and — when
 * an answer is thin — probes the specific thing that was thin before moving on. That
 * probe is chosen from the same analysis the practice feedback uses, so the follow-up is
 * about what you actually did, not a random second question.
 *
 * When a model is connected it can replace `nextInterviewerTurn` wholesale; the shape of
 * a turn, and the rule that nothing here produces a score, both stay the same.
 */

export type Speaker = "interviewer" | "candidate";

export type Turn = {
  speaker: Speaker;
  text: string;
  /** Set on interviewer turns that pose one of the planned questions. */
  promptId?: string;
  /** True when the interviewer is digging into the previous answer. */
  probe?: boolean;
};

export type ConversationState = {
  promptIds: string[];
  transcript: Turn[];
  candidateName: string;
  roleTitle: string;
  /** Skills from the confirmed profile, so the opening can reference their real background. */
  profileSkills?: string[];
  /** Skills below target, so the interviewer can be honest about the gap like a real recruiter. */
  weakSkills?: string[];
};

export type InterviewerTurn = { text: string; promptId?: string; probe?: boolean; done?: boolean };

/** One probe per weak signal — each asks for the exact thing the answer was missing. */
const PROBES: Record<string, string> = {
  ownership: "You've described what the team did. What was your part in it specifically — what did you do yourself?",
  specifics: "Can you put some numbers on that? How many, how long, or how much did it change?",
  structure: "And how did it end? What actually changed once you'd done that?",
  reasoning: "Why that approach rather than the alternative? What did you give up by choosing it?",
  length: "Take a bit more time with that one — walk me through it properly, from the start.",
  confidence: "You sound unsure there. Say it plainly: what do you actually think is the right answer?",
};

const ACKS = [
  "Got it, thank you.",
  "That's clear, thanks.",
  "Understood.",
  "Okay, that makes sense.",
  "Right, thank you.",
];

/** Deterministic so a session can be replayed exactly. */
function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

const GREETING = "Hello, can you hear me?";

function opening(state: ConversationState): string {
  const first = state.candidateName.split(" ")[0] || "there";
  const lines = [
    `Hey ${first}, good to meet you. Today I'd like to spend the time on your ${state.roleTitle} preparation — I'm keen to understand the work you've actually done and how you went about it.`,
  ];
  if (state.profileSkills?.length) {
    lines.push(`Your profile lists ${state.profileSkills.slice(0, 3).join(", ")}, so I'll dig into some of that.`);
  }
  if (state.weakSkills?.length) {
    lines.push(
      `I'll also be honest with you: ${state.weakSkills.slice(0, 2).join(" and ")} ${state.weakSkills.length === 1 ? "is" : "are"} where your evidence is thinnest right now, so expect me to push there.`,
    );
  }
  lines.push("There are no trick questions. Take your time, and use real examples.");
  return lines.join(" ");
}

function askOf(prompt: InterviewPrompt, index: number): string {
  const lead =
    index === 0
      ? "Let's start here. "
      : prompt.depth === 3
        ? "Right, something harder. "
        : pick(["Next one. ", "Okay. ", "Let's move on. "], index);
  return `${lead}${prompt.context ? `${prompt.context} ` : ""}${prompt.prompt}`;
}

/** The last planned question the interviewer asked, and everything said since. */
function currentQuestion(state: ConversationState) {
  for (let i = state.transcript.length - 1; i >= 0; i--) {
    const turn = state.transcript[i];
    if (turn.speaker === "interviewer" && turn.promptId) {
      return {
        promptId: turn.promptId,
        index: state.promptIds.indexOf(turn.promptId),
        answers: state.transcript.slice(i + 1).filter((t) => t.speaker === "candidate"),
        probed: state.transcript.slice(i + 1).some((t) => t.speaker === "interviewer" && t.probe),
      };
    }
  }
  return null;
}

function weakest(signals: Signal[]): Signal | undefined {
  return signals.find((s) => s.state === "bad") ?? signals.find((s) => s.state === "warn");
}

/** What the interviewer says next, given everything said so far. */
export function nextInterviewerTurn(state: ConversationState): InterviewerTurn {
  const said = state.transcript.filter((t) => t.speaker === "interviewer");
  const heard = state.transcript.filter((t) => t.speaker === "candidate");

  // 1. Mic check, then the opening once they have replied.
  if (!said.length) return { text: GREETING };
  if (said.length === 1 && heard.length >= 1) {
    const firstPrompt = getPrompt(state.promptIds[0]);
    return {
      text: `${opening(state)}\n\n${firstPrompt ? askOf(firstPrompt, 0) : ""}`.trim(),
      promptId: state.promptIds[0],
    };
  }
  if (said.length === 1) return { text: GREETING };

  const current = currentQuestion(state);
  if (!current) return { text: GREETING };

  const prompt = getPrompt(current.promptId);
  const answer = current.answers.map((a) => a.text).join(" ");
  if (!prompt || !answer.trim()) return { text: "Take your time — whenever you're ready." };

  // 2. Probe once, on whatever the answer was actually missing.
  if (!current.probed) {
    const feedback = analyseAnswer(prompt, answer);
    const weak = weakest(feedback.signals);
    const tooShort = countWords(answer) < prompt.minWords * 0.75;
    if (weak && (weak.state === "bad" || tooShort)) {
      return { text: PROBES[weak.id] ?? prompt.followUp ?? "Can you give me a concrete example of that?", probe: true };
    }
    if (prompt.followUp && feedback.possiblyMissing.length) {
      return { text: prompt.followUp, probe: true };
    }
  }

  // 3. Acknowledge, then the next question — or close.
  const next = state.promptIds[current.index + 1];
  const ack = pick(ACKS, current.index);
  if (!next) {
    return {
      text: `${ack} That's everything I wanted to cover. Thanks for talking it through with me — you'll see the write-up on the next screen.`,
      done: true,
    };
  }
  const nextPrompt = getPrompt(next);
  return { text: `${ack} ${nextPrompt ? askOf(nextPrompt, current.index + 1) : ""}`.trim(), promptId: next };
}

/** The candidate's full answer to one question, for storage and scoring. */
export function answersByPrompt(transcript: Turn[]): Record<string, string> {
  const out: Record<string, string> = {};
  let promptId: string | null = null;
  for (const turn of transcript) {
    if (turn.speaker === "interviewer" && turn.promptId) promptId = turn.promptId;
    else if (turn.speaker === "candidate" && promptId) out[promptId] = `${out[promptId] ?? ""} ${turn.text}`.trim();
  }
  return out;
}
