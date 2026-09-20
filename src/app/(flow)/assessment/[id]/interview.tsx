"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, MessageSquare, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/pending";
import { submitInterviewAnswer, type InterviewResult } from "../../../actions";

export type PublicPrompt = {
  id: string;
  kind: "behavioural" | "technical" | "situational";
  depth: 1 | 2 | 3;
  prompt: string;
  context?: string;
  lookFor: string[];
  minWords: number;
};

const KIND_LABEL = { behavioural: "Behavioural", technical: "Technical", situational: "Situational" };
const DEPTH_LABEL = { 1: "Warm-up", 2: "Core question", 3: "Probing question" };

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/**
 * The interview section that follows every assessment. Answers are written, stored
 * and evaluated later — the product never pretends an unevaluated answer passed.
 */
export function InterviewRunner({
  attemptId,
  prompts,
  startIndex,
  scoringAvailable,
}: {
  attemptId: string;
  prompts: PublicPrompt[];
  startIndex: number;
  scoringAvailable: boolean;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(startIndex);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const startedAt = useRef(0);
  const prompt = prompts[index];

  useEffect(() => {
    startedAt.current = Date.now();
  }, [index]);

  function send(skipped: boolean) {
    setError(null);
    start(async () => {
      let res: InterviewResult;
      try {
        res = await submitInterviewAnswer({
          attemptId,
          promptId: prompt.id,
          answer: skipped ? "" : text,
          seconds: startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0,
          skipped,
        });
      } catch (e) {
        if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
        setError("We couldn't reach the server. Your answer is still here — try again.");
        return;
      }
      if ("error" in res) {
        setError(res.error);
        return;
      }
      if (res.done) {
        router.push(res.resultPath);
        return;
      }
      setText("");
      setIndex((i) => Math.min(i + 1, prompts.length - 1));
    });
  }

  const count = words(text);
  const short = count > 0 && count < prompt.minWords;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 border-b bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="size-4 text-primary" aria-hidden />
            Interview
          </p>
          <p className="text-xs text-muted-foreground">Question {index + 1} of {prompts.length}</p>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={prompts.length} aria-valuenow={index} aria-label="Interview progress">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(index / prompts.length) * 100}%` }} />
        </div>
      </div>

      <div className="card-soft mt-6 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{KIND_LABEL[prompt.kind]}</span>
          <span className="text-xs text-muted-foreground">{DEPTH_LABEL[prompt.depth]}</span>
        </div>
        {prompt.context ? <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">{prompt.context}</p> : null}
        <p className="mt-3 text-lg font-medium leading-relaxed">{prompt.prompt}</p>

        <details className="mt-3 text-sm">
          <summary className="inline-flex cursor-pointer items-center gap-1.5 text-primary hover:underline">
            <Lightbulb className="size-3.5" aria-hidden />
            What a strong answer covers
          </summary>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {prompt.lookFor.map((l) => <li key={l}>• {l}</li>)}
          </ul>
        </details>

        <div className="mt-4">
          <label htmlFor="answer" className="sr-only">Your answer</label>
          <Textarea
            id="answer"
            rows={9}
            value={text}
            disabled={pending}
            onChange={(e) => setText(e.target.value)}
            placeholder="Answer as you would out loud in an interview. Specifics beat generalities."
          />
          <p className={cn("mt-1.5 text-xs", short ? "text-amber-700" : "text-muted-foreground")}>
            {count} words · aim for at least {prompt.minWords}
            {short ? " — a short answer scores poorly on depth and evidence" : ""}
          </p>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" className="h-10 px-4 text-muted-foreground" disabled={pending} onClick={() => send(true)}>
          Skip this question
        </Button>
        <Button className="h-10 px-5" disabled={pending || count < 10} onClick={() => send(false)}>
          {pending ? <Spinner /> : null}
          {pending ? "Saving…" : index + 1 === prompts.length ? "Finish and see results" : "Next question"}
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {scoringAvailable
          ? "Your answers are scored against a fixed rubric. AI assists the evaluation; it never decides your eligibility for a job."
          : "Your answers are recorded now and evaluated once interview scoring is connected. Until then they do not change your readiness."}
      </p>
    </div>
  );
}
