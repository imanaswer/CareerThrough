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
      <ol className="relative flex items-start gap-1 overflow-x-auto pb-1">
        {stages.map((s, i) => (
          <li key={s.id} className="flex min-w-[76px] flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : s.state === "upcoming" ? "bg-border" : "bg-primary")} />
              <button
                onClick={() => setOpenId(s.id)}
                aria-expanded={openId === s.id}
                aria-current={s.state === "current" ? "step" : undefined}
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  s.state === "completed" && "border-primary bg-primary text-primary-foreground",
                  s.state === "current" && "border-primary bg-background text-primary ring-4 ring-primary/15",
                  s.state === "upcoming" && "border-border bg-background text-muted-foreground",
                  openId === s.id && s.state !== "current" && "ring-4 ring-primary/10",
                )}
              >
                {s.state === "completed" ? <Check className="size-3.5" aria-hidden /> : <Circle className={cn("size-2", s.state === "current" && "fill-current")} aria-hidden />}
                <span className="sr-only">{s.label} — {s.state}</span>
              </button>
              <span className={cn("h-0.5 flex-1", i === stages.length - 1 ? "bg-transparent" : s.state === "completed" ? "bg-primary" : "bg-border")} />
            </div>
            <span className={cn("mt-2 text-[11px] font-medium leading-tight", s.state === "upcoming" && "text-muted-foreground", openId === s.id && "text-primary")}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-xl border bg-muted/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            {open.label}
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", open.state === "completed" ? "bg-emerald-100 text-emerald-800" : open.state === "current" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
              {open.state === "completed" ? "Completed" : open.state === "current" ? "You are here" : "Upcoming"}
            </span>
          </p>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{open.detail}</p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {open.items.map((item) => (
            <li key={item.label} className="flex items-start gap-2">
              {item.done ? <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-label="Done" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" aria-label="To do" />}
              <span className={item.done ? "text-muted-foreground" : ""}>{item.label}</span>
            </li>
          ))}
        </ul>
        {open.state !== "completed" ? (
          <Link href={open.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {open.cta} <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
