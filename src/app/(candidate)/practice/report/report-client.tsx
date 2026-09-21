"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, MessageSquare, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/bits";
import { analysePracticeTranscript, type PracticePromptLite, type TranscriptTurn } from "@/lib/interview/client-feedback";

const STATE_STYLE = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  bad: "border-rose-200 bg-rose-50 text-rose-900",
};
const ICON = { good: Check, warn: AlertTriangle, bad: TriangleAlert };

export function ReportClient({ prompts }: { prompts: PracticePromptLite[] }) {
  const [state, setState] = useState<{ transcript: TranscriptTurn[] } | null>(null);

  useEffect(() => {
    // The transcript only exists in this tab, so it can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const raw = sessionStorage.getItem("practice-transcript"); if (raw) setState(JSON.parse(raw)); } catch { /* cleared or blocked storage: nothing to report */ }
  }, []);

  if (!state?.transcript?.length) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No practice session to write up"
        body="Finish a practice interview and the write-up appears here. It is built from your transcript in this browser, so it disappears when you close the tab."
        href="/practice"
        cta="Start practising"
      />
    );
  }

  const report = analysePracticeTranscript(state.transcript, prompts);

  return (
    <div className="space-y-5">
      {report.map((item) => (
        <section key={item.promptId} className="card-soft p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.kindLabel}</p>
          <h2 className="mt-1 font-medium">{item.prompt}</h2>
          <blockquote className="mt-3 border-l-2 border-muted pl-3 text-sm text-muted-foreground">{item.answer || "You didn't answer this one."}</blockquote>
          {item.feedback ? (
            <>
              <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm">{item.feedback.headline}</p>
              <ul className="mt-3 space-y-2">
                {item.feedback.signals.map((s) => {
                  const Icon = ICON[s.state];
                  return (
                    <li key={s.id} className={cn("flex gap-2.5 rounded-xl border p-3 text-sm", STATE_STYLE[s.state])}>
                      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span><span className="font-medium">{s.label}: </span>{s.detail}</span>
                    </li>
                  );
                })}
              </ul>
              {item.feedback.possiblyMissing.length ? (
                <div className="mt-3 text-sm">
                  <p className="font-medium">We couldn&apos;t see these points</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">{item.feedback.possiblyMissing.map((m) => <li key={m}>• {m}</li>)}</ul>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ))}
      <div className="flex flex-wrap gap-3">
        <Link href="/practice" className={cn(buttonVariants(), "h-10 px-5")}>Practise again</Link>
        <Link href="/assessments" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}>Take a scored assessment</Link>
      </div>
    </div>
  );
}
