"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock, LockOpen } from "lucide-react";
import { cn } from "cn";

/**
 * The hero's visual: a working miniature of the product rather than a picture of one.
 * Every number here came from the real readiness and matching engines at build time
 * (see the page that renders this), run over a sample profile. Switching role re-runs
 * nothing in the browser; it swaps between results the engine already produced.
 */

export type DemoSkill = { name: string; level: number; target: number; meets: boolean };

export type DemoRole = {
  id: string;
  slug: string;
  title: string;
  /** Short label for the tab strip, so five roles fit on one line. */
  short: string;
  /** Per-role accent, applied consistently to its tab and its card. */
  hue: string;
  score: number;
  band: string;
  skills: DemoSkill[];
  criticalGaps: number;
  unlocked: number;
  totalJobs: number;
  nextJob: { title: string; company: string; blocker: string } | null;
};

export function RoleDemo({ roles }: { roles: DemoRole[] }) {
  const [activeId, setActiveId] = useState(roles[0].id);
  const role = roles.find((r) => r.id === activeId) ?? roles[0];
  const arc = Math.PI * 80;

  return (
    <div className="card-soft overflow-hidden">
      <div className="flex flex-wrap gap-1.5 border-b bg-muted/40 p-3">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveId(r.id)}
            aria-pressed={r.id === activeId}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-[background-color,color,transform] duration-200 active:translate-y-px",
              r.id === activeId
                ? "text-white shadow-sm"
                : "bg-background text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
            )}
            style={r.id === activeId ? { backgroundColor: r.hue } : undefined}
          >
            {r.short}
          </button>
        ))}
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:p-6">
        <div>
          <div className="relative mx-auto w-[150px]" role="img" aria-label={`Sample readiness for ${role.title}: ${role.score} out of 100`}>
            <svg viewBox="0 0 200 112" className="w-full">
              <path d="M20 100 A80 80 0 0 1 180 100" fill="none" strokeWidth="14" strokeLinecap="round" className="stroke-muted" />
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={arc}
                strokeDashoffset={arc * (1 - role.score / 100)}
                stroke={role.hue}
                className="transition-[stroke-dashoffset,stroke] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center">
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                <span className="tally" style={{ ["--num" as string]: role.score }} aria-hidden />
                <span className="sr-only">{role.score}</span>
                <span className="text-base font-medium text-muted-foreground">/100</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{role.band}</p>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Sample profile, scored by the live engine.
          </p>
        </div>

        <div>
          <ul className="space-y-2.5">
            {role.skills.map((s) => (
              <li key={s.name}>
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="truncate font-medium">{s.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {s.level}% / {s.target}%
                  </span>
                </div>
                <div className="relative mt-1 h-1.5 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full origin-left rounded-full transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
                      s.meets ? "bg-emerald-500" : "bg-rose-500",
                    )}
                    style={{ transform: `scaleX(${Math.max(s.level, 2) / 100})`, width: "100%" }}
                  />
                  <span className="absolute -top-1 h-3.5 w-0.5 rounded bg-foreground/60" style={{ left: `${s.target}%` }} aria-hidden />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border p-3">
            {role.nextJob ? (
              <>
                <p className="flex items-center gap-1.5 text-xs font-medium">
                  <Lock className="size-3 text-muted-foreground" aria-hidden />
                  {role.nextJob.title}
                  <span className="font-normal text-muted-foreground">at {role.nextJob.company}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{role.nextJob.blocker}</p>
              </>
            ) : (
              <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <LockOpen className="size-3" aria-hidden />
                Every {role.title} opportunity unlocked
              </p>
            )}
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="size-3 text-emerald-600" aria-hidden />
                {role.unlocked} of {role.totalJobs} unlocked
              </span>
              <span>{role.criticalGaps} critical {role.criticalGaps === 1 ? "gap" : "gaps"}</span>
            </p>
          </div>

          <Link
            href={`/roles/${role.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium transition-transform duration-200 hover:translate-x-0.5 hover:underline"
            style={{ color: role.hue }}
          >
            See the {role.title} path <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
