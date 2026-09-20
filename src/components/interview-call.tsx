"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { BadgeCheck, Clock, Keyboard, Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/pending";

export type CallTurn = { speaker: "interviewer" | "candidate"; text: string; promptId?: string; probe?: boolean };

export type TurnResponse = { text: string; promptId?: string; probe?: boolean; done?: boolean };

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// Speech recognition is still vendor-prefixed in Chrome and missing elsewhere.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.continuous = true;
  r.interimResults = true;
  r.lang = "en-IN";
  return r;
}

/**
 * A spoken interview: the interviewer talks, you answer out loud, and the transcript
 * builds as you go. Voice uses the browser's own speech engines, so it works without any
 * API key; typing is always available and is the only mode in browsers without speech.
 */
export function InterviewCall({
  title,
  subtitle,
  durationMin,
  onTurn,
  onFinish,
  finishLabel = "Finish",
}: {
  title: string;
  subtitle: string;
  durationMin: number;
  onTurn: (transcript: CallTurn[]) => Promise<TurnResponse>;
  onFinish: (transcript: CallTurn[]) => Promise<void>;
  finishLabel?: string;
}) {
  const [transcript, setTranscript] = useState<CallTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [left, setLeft] = useState(durationMin * 60_000);

  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const supportsVoice = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const began = useRef(false);
  const endedRef = useRef(false);

  const speak = useCallback(
    (text: string) => {
      if (!speakerOn || typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, " "));
      u.rate = 1.02;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    },
    [speakerOn],
  );

  const advance = useCallback(
    (next: CallTurn[]) => {
      setTranscript(next);
      start(async () => {
        try {
          const turn = await onTurn(next);
          setTranscript((t) => [...t, { speaker: "interviewer", text: turn.text, promptId: turn.promptId, probe: turn.probe }]);
          speak(turn.text);
          if (turn.done) setEnded(true);
        } catch {
          setError("We lost the connection for a moment. Your transcript is safe — try answering again.");
        }
      });
    },
    [onTurn, speak],
  );

  // Opening turn.
  useEffect(() => {
    if (began.current) return;
    began.current = true;
    supportsVoice.current = Boolean(getRecognition());
    setTyping(!supportsVoice.current);
    advance([]);
  }, [advance]);

  useEffect(() => {
    const t = setInterval(() => setLeft((ms) => Math.max(ms - 1000, 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (left === 0 && !endedRef.current) {
      endedRef.current = true;
      setEnded(true);
    }
  }, [left]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [transcript, interim]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function toggleMic() {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const r = getRecognition();
    if (!r) {
      setTyping(true);
      setError("This browser can't do speech to text. Chrome supports it — for now, type your answer.");
      return;
    }
    recognition.current = r;
    let finalText = "";
    r.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript + " ";
        else live += res[0].transcript;
      }
      setInterim(live);
      setDraft(finalText.trim());
    };
    r.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed") setError("Microphone access was blocked. Allow it in the browser, or type instead.");
    };
    r.onend = () => {
      setListening(false);
      setInterim("");
    };
    window.speechSynthesis?.cancel();
    r.start();
    setListening(true);
  }

  function send() {
    const text = draft.trim();
    if (!text || pending || ended) return;
    recognition.current?.stop();
    setDraft("");
    setInterim("");
    advance([...transcript, { speaker: "candidate", text }]);
  }

  const answered = transcript.some((t) => t.speaker === "candidate");

  return (
    <div className="card-soft flex h-[min(78vh,760px)] flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">CT</span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-semibold">
            {title}
            <BadgeCheck className="size-4 text-primary" aria-label="Career Through interviewer" />
          </p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </header>

      <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite" aria-label="Interview transcript">
        {transcript.map((t, i) => (
          <div key={i} className={cn("flex gap-2.5", t.speaker === "candidate" && "flex-row-reverse")}>
            <span
              className={cn(
                "mt-1 grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold",
                t.speaker === "interviewer" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
              )}
              aria-hidden
            >
              {t.speaker === "interviewer" ? "CT" : "You"}
            </span>
            <p
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                t.speaker === "interviewer" ? "bg-muted text-foreground" : "bg-primary/10 text-foreground ring-1 ring-primary/15",
                t.probe && "border-l-2 border-primary",
              )}
            >
              {t.text}
            </p>
          </div>
        ))}
        {interim ? (
          <div className="flex flex-row-reverse gap-2.5">
            <span className="mt-1 size-7 shrink-0" aria-hidden />
            <p className="max-w-[80%] rounded-2xl bg-primary/5 px-4 py-2.5 text-sm italic text-muted-foreground ring-1 ring-primary/10">{interim}</p>
          </div>
        ) : null}
        {pending ? (
          <div className="flex gap-2.5">
            <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground" aria-hidden>CT</span>
            <p className="rounded-2xl bg-muted px-4 py-3">
              <span className="flex gap-1" aria-label="Interviewer is thinking">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      {error ? <p role="alert" className="border-t bg-amber-50 px-4 py-2 text-xs text-amber-900">{error}</p> : null}

      {typing && !ended ? (
        <div className="border-t px-4 py-3">
          <label htmlFor="say" className="sr-only">Your answer</label>
          <div className="flex items-end gap-2">
            <Textarea
              id="say"
              rows={2}
              value={draft}
              disabled={pending}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
              }}
              placeholder="Type your answer…  (⌘↵ to send)"
            />
            <Button className="h-10 px-4" disabled={pending || !draft.trim()} onClick={send}>
              {pending ? <Spinner /> : <Send className="size-4" aria-hidden />}
              Send
            </Button>
          </div>
        </div>
      ) : null}

      <footer className="flex items-center justify-between gap-3 border-t px-4 py-3">
        <span className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium tabular-nums">
          <Clock className="size-3.5 text-muted-foreground" aria-hidden />
          {mmss(left)}
        </span>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label={speakerOn ? "Mute the interviewer" : "Unmute the interviewer"} onClick={() => { setSpeakerOn((v) => { if (v) window.speechSynthesis?.cancel(); return !v; }); }}>
            {speakerOn ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
          </Button>
          <Button variant="ghost" size="icon" aria-label={typing ? "Answer by voice" : "Answer by typing"} onClick={() => setTyping((v) => !v)}>
            <Keyboard className={cn("size-4", typing && "text-primary")} aria-hidden />
          </Button>

          {!typing && !ended ? (
            <Button
              size="icon"
              aria-label={listening ? "Stop and send" : "Hold to answer"}
              onClick={listening ? send : toggleMic}
              disabled={pending}
              className={cn("size-12 rounded-full", listening ? "bg-rose-600 text-white hover:bg-rose-600/90" : "bg-foreground text-background hover:bg-foreground/90")}
            >
              {listening ? <MicOff className="size-5" aria-hidden /> : <Mic className="size-5" aria-hidden />}
            </Button>
          ) : null}

          <Button
            size="icon"
            aria-label={ended ? finishLabel : "End the interview"}
            disabled={pending}
            onClick={() => start(async () => { recognition.current?.stop(); window.speechSynthesis?.cancel(); await onFinish(transcript); })}
            className="size-12 rounded-full bg-rose-600 text-white hover:bg-rose-600/90"
          >
            <X className="size-5" aria-hidden />
          </Button>
        </div>
      </footer>

      {listening ? (
        <p className="border-t bg-muted/40 px-4 py-1.5 text-center text-xs text-muted-foreground">
          Listening — speak naturally, then press the red button when you&apos;re done.
        </p>
      ) : null}
      {ended ? (
        <p className="border-t bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground">
          The interview is over. Press the red button to see your write-up.
        </p>
      ) : !answered && !typing ? (
        <p className="border-t bg-muted/40 px-4 py-1.5 text-center text-xs text-muted-foreground">
          Press the microphone to answer out loud, or switch to typing with the keyboard button.
        </p>
      ) : null}
    </div>
  );
}
