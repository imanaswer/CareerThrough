"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Circle } from "lucide-react";
import { cn } from "cn";
import type { Stage } from "@/lib/journey";

/** The 8 stages, expandable. Every item is derived from stored state, never from clicking around. */
export function Journey({ stages }: { stages: Stage[] }) {
  const current = stages.find((s) => s.state === "current") ?? stages[stages.length - 1];
  const [openId, setOpenId] = useState(current.id);
  const open = stages.find((s) => s.id === openId) ?? current;

  return (
    <div>
      <ol className="relative flex items-start gap-1 overflow-x-auto py-12 px-4 -mx-4 sm:px-2 sm:mx-0 scrollbar-hide">
        {stages.map((s, i) => (
          <li key={s.id} className="group flex min-w-[76px] flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={cn("h-0.5 flex-1 rounded-full transition-all duration-700", i === 0 ? "bg-transparent" : s.state === "upcoming" ? "bg-foreground/5" : "bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_10px_oklch(0.65_0.25_290/0.5)]")} />
              <div className="relative flex items-center justify-center mx-3 sm:mx-4">
                {/* Outer animated pulse for current step */}
                {s.state === "current" && (
                  <div className="absolute inset-0 -m-3 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/20" aria-hidden />
                )}
                <button
                  onClick={() => setOpenId(s.id)}
                  aria-expanded={openId === s.id}
                  aria-current={s.state === "current" ? "step" : undefined}
                  className={cn(
                    "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 backdrop-blur-md transition-all duration-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                    s.state === "completed" && "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.65_0.25_290/0.6)]",
                    s.state === "current" && "border-primary bg-background text-primary shadow-[0_0_20px_oklch(0.65_0.25_290/0.4)] ring-4 ring-primary/20",
                    s.state === "upcoming" && "border-white/20 bg-white/50 text-muted-foreground shadow-sm dark:border-white/10 dark:bg-black/50",
                    openId === s.id && s.state !== "current" && "ring-4 ring-primary/15",
                  )}
                >
                  {s.state === "completed" ? <Check className="size-4" strokeWidth={3} aria-hidden /> : <Circle className={cn("size-2.5", s.state === "current" && "fill-current animate-pulse")} aria-hidden />}
                  <span className="sr-only">{s.label} — {s.state}</span>
                </button>
              </div>
              <span className={cn("h-0.5 flex-1 rounded-full transition-all duration-700", i === stages.length - 1 ? "bg-transparent" : s.state === "completed" ? "bg-gradient-to-r from-primary to-primary/50 shadow-[0_0_10px_oklch(0.65_0.25_290/0.5)]" : "bg-foreground/5")} />
            </div>
            <span className={cn("mt-4 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300", s.state === "upcoming" && "text-muted-foreground/60", openId === s.id && "text-primary drop-shadow-md", s.state === "completed" && "text-foreground/80")}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      <div className="group relative mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:bg-white/50 dark:border-white/10 dark:bg-black/40">
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-[50px] transition-transform duration-700 group-hover:scale-125" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-50 dark:from-white/10" pointer-events-none="true" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/5 pb-4">
            <p className="flex items-center gap-3 text-base font-semibold tracking-tight text-foreground/90">
              {open.label}
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", open.state === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : open.state === "current" ? "bg-primary text-primary-foreground shadow-[0_0_15px_oklch(0.65_0.25_290/0.4)]" : "bg-muted text-muted-foreground")}>
                {open.state === "completed" ? "Completed" : open.state === "current" ? "You are here" : "Upcoming"}
              </span>
            </p>
            <ChevronDown className="size-5 text-muted-foreground/50 transition-transform duration-300 group-hover:text-primary/70" aria-hidden />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{open.detail}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {open.items.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border", item.done ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_10px_rgb(16,185,129,0.3)]" : "border-foreground/20")}>
                  {item.done && <Check className="size-2.5" strokeWidth={3} aria-label="Done" />}
                </span>
                <span className={cn(item.done ? "text-muted-foreground line-through opacity-70" : "font-medium text-foreground/90")}>{item.label}</span>
              </li>
            ))}
          </ul>
          {open.state !== "completed" ? (
            <Link href={open.href} className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20">
              {open.cta} <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
