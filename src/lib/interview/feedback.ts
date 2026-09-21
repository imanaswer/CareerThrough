import type { InterviewPrompt } from "@/content/taxonomy";
import { SKILLS } from "@/content/skills";

/**
 * Instant, rule-based feedback on an interview answer.
 *
 * This does not judge whether an answer is *good* — no rule can. It reports things that
 * are objectively checkable (length, structure, specifics, ownership, hedging) and flags
 * the prompt's own markers it could not find, hedged as "we couldn't see", never as
 * "you failed". Real evaluation is the scorer's job; this is a rehearsal mirror so a
 * candidate can fix the obvious problems before anyone reads the answer.
 */

export type Signal = {
  id: string;
  label: string;
  state: "good" | "warn" | "bad";
  detail: string;
};

export type AnswerFeedback = {
  words: number;
  signals: Signal[];
  /** Markers from the prompt we could not find any trace of. */
  possiblyMissing: string[];
  /** One sentence, the single most useful thing to change. */
  headline: string;
};

const STOPWORDS = new Set(
  "a an the and or but if then than that this those these is are was were be been being to of in on for with at by from as it its into about over under your you их my our we they he she them his her i me do does did doing done have has had having not no yes can could should would will shall may might must very really just so such own same other more most some any each few own how what when where which who whom why name names naming state states stating mention mentions mentioning give gives giving show shows showing explain explains explaining specific concrete clear".split(
    /\s+/,
  ),
);

const STAR = {
  situation: /\b(when|during|while|at the time|we were|i was|the (project|team|system|app|company)|last (year|term|semester)|in my)\b/i,
  action: /\b(i (did|built|wrote|tested|fixed|added|checked|ran|created|designed|reproduced|debugged|reviewed|raised|proposed|led|set up|configured)|my (approach|first step)|so i|then i)\b/i,
  result: /\b(as a result|which meant|in the end|after (that|the fix)|the (result|outcome|impact) was|we (shipped|released|reduced|improved|caught|avoided)|it (worked|passed|dropped|went from))\b/i,
};

const HEDGES = /\b(maybe|probably|kind of|sort of|i guess|i think maybe|somewhat|a bit|basically|just kind of|or something|stuff like that|etc)\b/gi;
const FILLER = /\b(obviously|literally|actually|basically|simply|very very)\b/gi;

/** Technology and tool names we know about, used to detect concrete specifics. */
const VOCAB = new Set(
  SKILLS.flatMap((s) => [s.name.toLowerCase(), ...s.topics.map((t) => t.name.toLowerCase())])
    .flatMap((n) => n.split(/[^a-z0-9+#.]+/))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
);

const countMatches = (text: string, re: RegExp) => (text.match(re) ?? []).length;

export function analyseAnswer(prompt: InterviewPrompt, answer: string): AnswerFeedback {
  const text = answer.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const n = words.length;
  const lower = text.toLowerCase();
  const signals: Signal[] = [];

  // ── Length ──
  if (n < prompt.minWords * 0.6) {
    signals.push({
      id: "length",
      label: "Length",
      state: "bad",
      detail: `${n} words. An interviewer would expect around ${prompt.minWords} here — this is too short to show your reasoning.`,
    });
  } else if (n < prompt.minWords) {
    signals.push({ id: "length", label: "Length", state: "warn", detail: `${n} words, a little under the ${prompt.minWords} this question deserves.` });
  } else if (n > prompt.minWords * 3.5) {
    signals.push({ id: "length", label: "Length", state: "warn", detail: `${n} words. Strong content, but this long an answer loses an interviewer — aim to land the point sooner.` });
  } else {
    signals.push({ id: "length", label: "Length", state: "good", detail: `${n} words — a realistic spoken length.` });
  }

  // ── Structure (situation → action → result) ──
  const parts = (["situation", "action", "result"] as const).filter((k) => STAR[k].test(text));
  if (prompt.kind === "technical") {
    const reasons = countMatches(lower, /\b(because|so that|the reason|which means|otherwise|trade-?off|downside|instead of)\b/g);
    signals.push(
      reasons >= 2
        ? { id: "reasoning", label: "Reasoning", state: "good", detail: `You explain why, not just what (${reasons} places where you justify a choice).` }
        : {
            id: "reasoning",
            label: "Reasoning",
            state: reasons === 1 ? "warn" : "bad",
            detail:
              reasons === 1
                ? "You justify one choice. Technical answers get their marks from the why — add the trade-off you accepted."
                : "This reads as what you would do, not why. Say what you chose it over, and what it costs.",
          },
    );
  } else {
    signals.push(
      parts.length === 3
        ? { id: "structure", label: "Structure", state: "good", detail: "Situation, action and result are all present — that is the shape interviewers listen for." }
        : {
            id: "structure",
            label: "Structure",
            state: parts.length === 2 ? "warn" : "bad",
            detail: `We can see the ${parts.length ? parts.join(" and ") : "story"} but not the ${
              (["situation", "action", "result"] as const).filter((k) => !parts.includes(k)).join(" or ") || "rest"
            }. Set the scene, say what you personally did, then how it ended.`,
          },
    );
  }

  // ── Specifics ──
  const numbers = countMatches(text, /\b\d+([.,]\d+)?%?\b/g);
  const named = [...new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9+#.]/g, "")).filter((w) => VOCAB.has(w)))];
  const specifics = numbers + named.length;
  signals.push(
    specifics >= 3
      ? {
          id: "specifics",
          label: "Specifics",
          state: "good",
          detail: `Concrete: ${numbers ? `${numbers} number${numbers > 1 ? "s" : ""}` : "no numbers"}${named.length ? `, and you name ${named.slice(0, 4).join(", ")}` : ""}.`,
        }
      : {
          id: "specifics",
          label: "Specifics",
          state: specifics >= 1 ? "warn" : "bad",
          detail: numbers
            ? "Some detail, but few named tools or techniques. Naming what you actually used is what separates you from a generic answer."
            : "No numbers and few named tools. Add one measurable detail — how many, how long, how much it dropped.",
        },
  );

  // ── Ownership ──
  const i = countMatches(lower, /\bi\b/g);
  const we = countMatches(lower, /\bwe\b/g);
  if (prompt.kind !== "technical") {
    signals.push(
      i === 0 && we > 0
        ? { id: "ownership", label: "Ownership", state: "bad", detail: `You say "we" ${we} times and "I" never. An interviewer cannot tell what you did.` }
        : i >= we
          ? { id: "ownership", label: "Ownership", state: "good", detail: `Your own contribution is clear ("I" ${i} times).` }
          : { id: "ownership", label: "Ownership", state: "warn", detail: `More "we" (${we}) than "I" (${i}). Credit the team once, then say what was yours.` },
    );
  }

  // ── Hedging ──
  const hedges = countMatches(text, HEDGES) + countMatches(text, FILLER);
  if (hedges >= 3) {
    signals.push({
      id: "confidence",
      label: "Confidence",
      state: hedges >= 5 ? "bad" : "warn",
      detail: `${hedges} hedging or filler phrases ("maybe", "kind of", "basically"). Each one makes a correct answer sound unsure — state it plainly.`,
    });
  } else {
    signals.push({ id: "confidence", label: "Confidence", state: "good", detail: "You state things plainly, with little hedging." });
  }

  // ── Prompt markers we cannot see ──
  const possiblyMissing = prompt.lookFor.filter((marker) => {
    const keys = marker
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w));
    if (!keys.length) return false;
    const hits = keys.filter((k) => lower.includes(k.slice(0, Math.max(4, k.length - 2)))).length;
    return hits / keys.length < 0.34;
  });

  const worst = signals.find((s) => s.state === "bad") ?? signals.find((s) => s.state === "warn");
  const headline = worst
    ? worst.detail
    : possiblyMissing.length
      ? "Solid answer. The points below are the ones we could not see — check whether you covered them."
      : "Well-structured, specific and confident. This is the standard to keep.";

  return { words: n, signals, possiblyMissing, headline };
}
