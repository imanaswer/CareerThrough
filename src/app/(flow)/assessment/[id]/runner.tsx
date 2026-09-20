"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Clock, EyeOff } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/pending";
import type { PublicQuestion } from "@/content/taxonomy";
import { submitAttempt } from "../../../actions";

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function Runner({ attemptId, title, questions, deadline, skillNames }: { attemptId: string; title: string; questions: PublicQuestion[]; deadline: number; skillNames: Record<string, string> }) {
  const storageKey = `attempt:${attemptId}`;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(() => deadline - Date.now());
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, startSubmit] = useTransition();
  const tabSwitches = useRef(0);
  const [switches, setSwitches] = useState(0);
  const sent = useRef(false);

  // Survive an accidental refresh. Only chosen options live here; scoring is server-side.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      // Restoring from sessionStorage must happen after hydration, so an effect is the right place.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) { setAnswers(saved.answers ?? {}); tabSwitches.current = saved.tabSwitches ?? 0; setSwitches(tabSwitches.current); }
    } catch {}
  }, [storageKey]);
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ answers, tabSwitches: switches })); } catch {}
  }, [answers, switches, storageKey]);

  const submit = useCallback(() => {
    if (sent.current) return;
    sent.current = true;
    setError(null);
    startSubmit(async () => {
      try {
        const result = await submitAttempt({ attemptId, answers, tabSwitches: tabSwitches.current });
        if (result && "error" in result) { setError(result.error); sent.current = false; }
        else sessionStorage.removeItem(storageKey);
      } catch (e) {
        // redirect() throws by design; anything else is a real failure.
        if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
        setError("We couldn't submit your answers. Check your connection and try again — your answers are still here.");
        sent.current = false;
      }
    });
  }, [attemptId, answers, storageKey]);

  useEffect(() => {
    const t = setInterval(() => setLeft(deadline - Date.now()), 1000);
    return () => clearInterval(t);
  }, [deadline]);
  useEffect(() => { if (left <= 0) submit(); }, [left, submit]);

  useEffect(() => {
    const onHide = () => { if (document.hidden) { tabSwitches.current += 1; setSwitches(tabSwitches.current); } };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const q = questions[index];
  const answered = Object.keys(answers).length;
  const low = left < 60_000;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 border-b bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{title}</p>
          <p role="timer" aria-live={low ? "polite" : "off"} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums", low ? "bg-rose-50 text-rose-700" : "bg-secondary text-secondary-foreground")}>
            <Clock className="size-3.5" aria-hidden />{mmss(left)}
          </p>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>
        <p className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Question {index + 1} of {questions.length} · {answered} answered</span>
          {switches > 0 ? <span className="flex items-center gap-1 text-amber-700"><EyeOff className="size-3" aria-hidden />{switches} tab switch{switches > 1 ? "es" : ""} recorded</span> : null}
        </p>
      </div>

      <fieldset className="card-soft mt-6 p-6" disabled={submitting}>
        <legend className="sr-only">Question {index + 1}</legend>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{skillNames[q.skillId]}</p>
        <p className="mt-2 whitespace-pre-wrap font-medium leading-relaxed">{q.prompt}</p>
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Options">
          {q.options.map((opt, i) => {
            const checked = answers[q.id] === i;
            return (
              <label key={i} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring", checked ? "border-primary bg-secondary" : "hover:bg-muted/60")}>
                <input type="radio" name={q.id} className="mt-0.5 accent-[var(--primary)]" checked={checked} onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))} />
                <span className="whitespace-pre-wrap">{opt}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

      {confirming && !submitting ? (
        <div role="alertdialog" aria-label="Unanswered questions" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">{questions.length - answered} of {questions.length} questions are unanswered.</p>
          <p className="mt-1">Unanswered questions are marked wrong, and this result becomes your evidence for {Object.keys(skillNames).length === 1 ? "this skill" : "every skill it covers"}. There is no partial credit for skipping.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" className="h-9 px-4" onClick={() => { setConfirming(false); const first = questions.findIndex((q) => answers[q.id] === undefined); if (first >= 0) setIndex(first); }}>
              Go to first unanswered
            </Button>
            <Button variant="ghost" className="h-9 px-4" onClick={submit}>Submit anyway</Button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" className="h-10 px-5" disabled={index === 0 || submitting} onClick={() => setIndex(index - 1)}>Previous</Button>
        {index < questions.length - 1 ? (
          <Button className="h-10 px-5" disabled={submitting} onClick={() => setIndex(index + 1)}>Next</Button>
        ) : (
          <Button className="h-10 px-5" disabled={submitting} onClick={() => (answered < questions.length && !confirming ? setConfirming(true) : submit())}>
            {submitting ? <Spinner /> : null}
            {submitting ? "Scoring…" : answered < questions.length ? `Submit (${questions.length - answered} unanswered)` : "Submit answers"}
          </Button>
        )}
      </div>

      <nav aria-label="Jump to question" className="mt-6 flex flex-wrap gap-1.5">
        {questions.map((item, i) => (
          <button key={item.id} onClick={() => setIndex(i)} aria-label={`Question ${i + 1}${answers[item.id] !== undefined ? ", answered" : ""}`} aria-current={i === index}
            className={cn("size-8 rounded-lg text-xs font-medium tabular-nums", i === index ? "bg-primary text-primary-foreground" : answers[item.id] !== undefined ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground")}>
            {i + 1}
          </button>
        ))}
      </nav>
    </div>
  );
}
