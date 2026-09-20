"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, EyeOff, Signal, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/pending";
import { answerQuestion, type AnswerResult } from "../../../actions";

type Q = { id: string; skillId: string; topicId: string; prompt: string; options: string[] };
type Progress = { answered: number; total: number; difficulty: number };

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const DIFFICULTY_LABEL = ["", "Foundational", "Core", "Applied", "Advanced"];

/**
 * Progressive runner: answer, then the server decides what comes next.
 * There is no going back — the next question depends on this one, which is what
 * makes the ladder meaningful.
 */
export function Runner({
  attemptId,
  title,
  question,
  progress,
  deadline,
  skillNames,
}: {
  attemptId: string;
  title: string;
  question: Q;
  progress: Progress;
  deadline: number;
  skillNames: Record<string, string>;
}) {
  const router = useRouter();
  const [q, setQ] = useState(question);
  const [p, setP] = useState(progress);
  const [choice, setChoice] = useState<number | null>(null);
  const [left, setLeft] = useState(() => deadline - Date.now());
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const tabSwitches = useRef(0);
  const [switches, setSwitches] = useState(0);
  const outOfTime = useRef(false);

  const send = useCallback(
    (picked: number | null) => {
      setError(null);
      start(async () => {
        let res: AnswerResult;
        try {
          res = await answerQuestion({ attemptId, questionId: q.id, choice: picked, tabSwitches: tabSwitches.current });
        } catch {
          setError("We couldn't reach the server. Your previous answers are saved — try again.");
          return;
        }
        if ("error" in res) {
          setError(res.error);
          if (/no longer open|Time is up/i.test(res.error)) router.refresh();
          return;
        }
        if (res.done) {
          router.refresh(); // hands over to the interview stage
          return;
        }
        setQ(res.question);
        setP(res.progress);
        setChoice(null);
      });
    },
    [attemptId, q.id, router],
  );

  useEffect(() => {
    const t = setInterval(() => setLeft(deadline - Date.now()), 1000);
    return () => clearInterval(t);
  }, [deadline]);

  useEffect(() => {
    if (left <= 0 && !outOfTime.current) {
      outOfTime.current = true;
      send(null);
    }
  }, [left, send]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) {
        tabSwitches.current += 1;
        setSwitches(tabSwitches.current);
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const low = left < 60_000;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 border-b bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{title}</p>
          <p
            role="timer"
            aria-live={low ? "polite" : "off"}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums",
              low ? "bg-rose-50 text-rose-700" : "bg-secondary text-secondary-foreground",
            )}
          >
            <Clock className="size-3.5" aria-hidden />
            {mmss(left)}
          </p>
        </div>
        <div
          className="mt-2 h-1.5 rounded-full bg-muted"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={p.total}
          aria-valuenow={p.answered}
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(p.answered / p.total) * 100}%` }} />
        </div>
        <p className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs text-muted-foreground">
          <span>Question {p.answered + 1} of {p.total}</span>
          {switches > 0 ? (
            <span className="flex items-center gap-1 text-amber-700">
              <EyeOff className="size-3" aria-hidden />
              {switches} tab switch{switches > 1 ? "es" : ""} recorded
            </span>
          ) : null}
        </p>
      </div>

      <fieldset className="card-soft mt-6 p-6" disabled={pending}>
        <legend className="sr-only">Question {p.answered + 1}</legend>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{skillNames[q.skillId] ?? q.skillId}</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-primary" title="The questions get harder as you get them right">
            <Signal className="size-3.5" aria-hidden />
            {DIFFICULTY_LABEL[p.difficulty]}
            <span className="flex gap-0.5" aria-hidden>
              {[1, 2, 3, 4].map((d) => (
                <span key={d} className={cn("size-1.5 rounded-full", d <= p.difficulty ? "bg-primary" : "bg-muted-foreground/25")} />
              ))}
            </span>
          </p>
        </div>
        <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">{q.prompt}</p>
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Options">
          {q.options.map((opt, i) => (
            <label
              key={i}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring",
                choice === i ? "border-primary bg-secondary" : "hover:bg-muted/60",
              )}
            >
              <input
                type="radio"
                name={q.id}
                className="mt-0.5 accent-[var(--primary)]"
                checked={choice === i}
                onChange={() => setChoice(i)}
              />
              <span className="whitespace-pre-wrap">{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" className="h-10 px-4 text-muted-foreground" disabled={pending} onClick={() => send(null)}>
          Skip — counts as wrong
        </Button>
        <Button className="h-10 px-5" disabled={pending || choice === null} onClick={() => send(choice)}>
          {pending ? <Spinner /> : null}
          {pending ? "Saving…" : p.answered + 1 === p.total ? "Submit and start interview" : "Submit answer"}
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Each answer decides what comes next, so you can&apos;t return to a previous question. Answer as well as you can — the
        harder questions are worth more.
      </p>
    </div>
  );
}
