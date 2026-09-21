import Link from "next/link";
import { ArrowRight, Check, LockOpen, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { getJob } from "@/content/jobs";
import type { NextAction } from "@/lib/next-action";
import { Why } from "./why";

/**
 * The single highest-priority action. Deliberately one CTA: the dashboard's job is to
 * answer "what should I do next", not to offer a menu.
 */
export function NextMove({ action, upNext, formulaVersion }: { action: NextAction; upNext: NextAction[]; formulaVersion: string }) {
  const impact = action.impact;
  const unlocks = impact?.unlockedJobIds.map((id) => getJob(id)).filter((j) => j !== undefined) ?? [];

  return (
    <section aria-labelledby="next-move" className="surface-hero overflow-hidden rounded-3xl">
      <div className="p-6 sm:p-7">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80">
          <Sparkles className="size-3.5" aria-hidden />
          Your next move
        </p>
        <h2 id="next-move" className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">{action.title}</h2>

        {action.current !== null && action.target !== null ? (
          <div className="mt-3 max-w-sm">
            <p className="flex items-baseline gap-2 text-sm text-white/90">
              <span className="text-2xl font-semibold tabular-nums">{action.current}%</span>
              <ArrowRight className="size-4" aria-hidden />
              <span className="text-2xl font-semibold tabular-nums">{action.target}%</span>
              <span className="text-white/75">{action.kind === "final" ? "readiness threshold" : "target"}</span>
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${Math.min((action.current / Math.max(action.target, 1)) * 100, 100)}%` }} />
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Why now</p>
            <ul className="mt-2 space-y-1 text-sm text-white/90">
              {action.reasons.map((r) => (
                <li key={r} className="flex gap-2"><span aria-hidden>•</span>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Expected impact</p>
            {impact ? (
              <ul className="mt-2 space-y-1 text-sm text-white/90">
                <li className="flex gap-2">
                  <TrendingUp className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>If you reach {impact.to}%: <strong>+{impact.deltaScore} readiness points</strong></span>
                </li>
                <li className="flex gap-2">
                  <LockOpen className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    {unlocks.length
                      ? `Unlocks ${unlocks.length} ${unlocks.length === 1 ? "opportunity" : "opportunities"}: ${unlocks.map((j) => j.title).join(", ")}`
                      : action.blocksJobs
                        ? `Clears this requirement on ${action.blocksJobs} ${action.blocksJobs === 1 ? "opportunity" : "opportunities"}`
                        : "No opportunity unlocks from this one alone"}
                  </span>
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-sm text-white/90">
                {action.kind === "project"
                  ? "Satisfies the project requirement on opportunities that ask for one, and raises evidence confidence."
                  : action.kind === "final"
                    ? "Issues your Career Card. It re-tests every role skill, so your levels can move either way."
                    : "May unlock opportunities requiring this skill."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={action.href} className={cn(buttonVariants(), "h-11 bg-white px-6 text-base text-primary hover:bg-white/90")}>
            {action.action} <ArrowRight className="size-4" aria-hidden />
          </Link>
          <span className="text-white [&_button]:text-white/90 [&_button:hover]:text-white">
            <Why label="Why this?" title="Why this action, ahead of everything else" description={action.why}>
              <div>
                <p className="mb-2 font-medium">How the order is decided</p>
                <ol className="space-y-1 text-xs text-muted-foreground">
                  <li>1. Critical role skills below target</li>
                  <li>2. Skills blocking the most opportunities</li>
                  <li>3. Heaviest weight in the role</li>
                  <li>4. Closest to its target, so the quickest win</li>
                  <li>5. A skill&apos;s prerequisite always comes before it</li>
                </ol>
              </div>
              {impact ? (
                <div className="rounded-xl bg-muted/60 p-3 text-xs">
                  <p className="font-medium text-foreground">How the impact is calculated</p>
                  <p className="mt-1 text-muted-foreground">
                    We re-run the same readiness and matching engines over your real evidence with one change: {action.title.replace(/^(Improve|Verify) /, "")} at
                    its {impact.to}% target. That produces +{impact.deltaScore} points and {unlocks.length} new {unlocks.length === 1 ? "unlock" : "unlocks"}. It is
                    what would happen if you reach the target — not a prediction of your score.
                  </p>
                </div>
              ) : null}
              {upNext.length ? (
                <div>
                  <p className="mb-2 font-medium">Queued after this</p>
                  <ol className="space-y-1 text-xs text-muted-foreground">
                    {upNext.slice(0, 4).map((a, i) => <li key={a.id}>{i + 2}. {a.title}</li>)}
                  </ol>
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground">Formula {formulaVersion}. Ranking is rule-based and deterministic — the same evidence always produces the same recommendation.</p>
            </Why>
          </span>
        </div>
      </div>

      {upNext.length ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/15 bg-black/10 px-6 py-3 text-xs text-white/80 sm:px-7">
          <span className="font-medium uppercase tracking-wider">Then</span>
          {upNext.slice(0, 3).map((a) => (
            <span key={a.id} className="flex items-center gap-1.5">
              <Check className="size-3" aria-hidden />
              {a.title}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
