"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Lightbulb, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/pending";
import type { AnswerFeedback } from "@/lib/interview/feedback";
import { practiceAnswer, type PracticeResult } from "../../actions";

export type PracticePrompt = {
  id: string;
  kind: "behavioural" | "technical" | "situational";
  depth: 1 | 2 | 3;
  prompt: string;
  context?: string;
  lookFor: string[];
  minWords: number;
  label: string;
};

const STATE_STYLE = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  bad: "border-rose-200 bg-rose-50 text-rose-900",
};
const STATE_ICON = { good: Check, warn: AlertTriangle, bad: TriangleAlert };

export function PracticeClient({ prompts }: { prompts: PracticePrompt[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const prompt = prompts[index];

  function analyse() {
    setError(null);
    start(async () => {
      const res: PracticeResult = await practiceAnswer({ promptId: prompt.id, answer: text });
      if ("error" in res) setError(res.error);
      else setFeedback(res.feedback);
    });
  }

  function move(next: number) {
    setIndex(next);
    setText("");
    setFeedback(null);
    setError(null);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4">
        <div className="card-soft p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{prompt.label}</span>
            <span className="text-xs text-muted-foreground">Question {index + 1} of {prompts.length}</span>
          </div>
          {prompt.context ? <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">{prompt.context}</p> : null}
          <h2 className="mt-3 text-lg font-medium leading-relaxed">{prompt.prompt}</h2>

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
            <label htmlFor="practice" className="sr-only">Your answer</label>
            <Textarea
              id="practice"
              rows={8}
              value={text}
              disabled={pending}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say it the way you would out loud. Nothing here is recorded as evidence — this is rehearsal."
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {text.trim().split(/\s+/).filter(Boolean).length} words · aim for around {prompt.minWords}
            </p>
          </div>

          {error ? <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p> : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button className="h-10 px-5" disabled={pending} onClick={analyse}>
              {pending ? <Spinner /> : <Sparkles className="size-4" aria-hidden />}
              {pending ? "Checking…" : feedback ? "Check again" : "Get feedback"}
            </Button>
            {feedback ? (
              <Button variant="outline" className="h-10 px-4" onClick={() => { setText(""); setFeedback(null); }}>
                <RotateCcw className="size-4" aria-hidden />
                Try this one again
              </Button>
            ) : null}
            {index + 1 < prompts.length ? (
              <button onClick={() => move(index + 1)} className="text-sm font-medium text-primary hover:underline">
                Next question →
              </button>
            ) : null}
          </div>
        </div>

        {feedback ? (
          <div className="card-soft p-5 sm:p-6">
            <h3 className="text-sm font-semibold">What your answer does, and what it misses</h3>
            <p className="mt-2 rounded-xl bg-muted/60 p-3 text-sm">{feedback.headline}</p>

            <ul className="mt-4 space-y-2">
              {feedback.signals.map((s) => {
                const Icon = STATE_ICON[s.state];
                return (
                  <li key={s.id} className={cn("flex gap-2.5 rounded-xl border p-3 text-sm", STATE_STYLE[s.state])}>
                    <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      <span className="font-medium">{s.label}: </span>
                      {s.detail}
                    </span>
                  </li>
                );
              })}
            </ul>

            {feedback.possiblyMissing.length ? (
              <div className="mt-4">
                <p className="text-sm font-medium">We couldn&apos;t see these points in your answer</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {feedback.possiblyMissing.map((m) => <li key={m}>• {m}</li>)}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  This is a word-level check, so if you covered one of these in different words, ignore it.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="card-soft p-4">
          <p className="text-sm font-semibold">Questions</p>
          <ol className="mt-2 space-y-1">
            {prompts.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => move(i)}
                  aria-current={i === index}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    i === index ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {i + 1}. {p.prompt.length > 54 ? p.prompt.slice(0, 53) + "…" : p.prompt}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="card-soft p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How this feedback works</p>
          <p className="mt-2">
            It checks things that can be measured: length, whether the story has a situation, action and result, whether you name
            real tools and numbers, whether you say &ldquo;I&rdquo; or only &ldquo;we&rdquo;, and how much you hedge.
          </p>
          <p className="mt-2">
            It cannot tell you whether your answer is <em>right</em> — that is what the scored interview in an assessment is for.
            Practice here as often as you like; nothing is recorded as evidence.
          </p>
        </div>
      </aside>
    </div>
  );
}
