import type { ReactNode } from "react";
import Link from "next/link";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import type { SkillStatus } from "@/lib/readiness";

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, action, className, children, id }: { title?: string; action?: ReactNode; className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={cn("group relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-white/50 p-6 sm:p-8 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/50", className)}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[60px] transition-transform duration-700 group-hover:scale-110" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/10 blur-[60px] transition-transform duration-700 group-hover:scale-110" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-50 dark:from-white/10" pointer-events-none="true" />
      
      {title ? (
        <div className="relative z-10 mb-6 flex items-center justify-between gap-3 border-b border-foreground/5 pb-5">
          <h2 className="text-base font-semibold tracking-tight text-foreground/90">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

/** Every empty state says what to do next. */
export function EmptyState({ icon: Icon, title, body, href, cta }: { icon: LucideIcon; title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/40 px-6 py-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:bg-white/50 dark:border-white/10 dark:bg-black/40">


      <div className="relative z-10 mb-6">
        <div className="absolute -inset-4 animate-pulse rounded-full bg-primary/20 blur-xl transition-all duration-700 group-hover:bg-primary/30 group-hover:blur-2xl" />
        <span className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_0_30px_oklch(0.65_0.25_290/0.4)] ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="size-8" strokeWidth={1.5} aria-hidden />
        </span>
      </div>

      <p className="relative z-10 text-xl font-bold tracking-tight text-foreground">{title}</p>
      <p className="relative z-10 mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      
      {href && cta ? (
        <Link href={href} className={cn(buttonVariants({ size: "lg" }), "relative z-10 mt-8 rounded-full bg-foreground px-8 font-semibold text-background shadow-lg transition-all hover:scale-105 hover:bg-foreground/90 hover:shadow-xl")}>
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

const STATUS_BAR: Record<SkillStatus, string> = {
  meets: "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_12px_rgb(16,185,129,0.5)]",
  close: "bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_12px_rgb(245,158,11,0.5)]",
  gap: "bg-gradient-to-r from-rose-400 to-rose-500 shadow-[0_0_12px_rgb(244,63,94,0.5)]",
  no_evidence: "bg-gradient-to-r from-foreground/20 to-foreground/30",
};

/** Level bar with a target marker: answers "where am I vs where I need to be". */
export function LevelBar({ level, target, status, label }: { level: number; target: number; status: SkillStatus; label: string }) {
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={level}
      aria-valuetext={`${level}% of a ${target}% target`}
      className="relative h-2.5 w-full rounded-full bg-foreground/5 shadow-[inset_0_1px_3px_rgb(0,0,0,0.1)] border border-foreground/5 overflow-visible"
    >
      <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", STATUS_BAR[status])} style={{ width: `${level}%` }} />
      <div className="absolute top-1/2 -mt-2 h-4 w-1.5 rounded-full bg-foreground shadow-md ring-2 ring-background z-10" style={{ left: `calc(${target}% - 3px)` }} aria-hidden />
    </div>
  );
}

const STATUS_CHIP: Record<SkillStatus, [string, string]> = {
  meets: ["Meets target", "bg-emerald-50 text-emerald-700 ring-emerald-200"],
  close: ["Close to target", "bg-amber-50 text-amber-800 ring-amber-200"],
  gap: ["Below target", "bg-rose-50 text-rose-700 ring-rose-200"],
  no_evidence: ["No evidence yet", "bg-muted text-muted-foreground ring-border"],
};

export function StatusChip({ status }: { status: SkillStatus }) {
  const [label, cls] = STATUS_CHIP[status];
  return <Chip className={cls}>{status === "meets" ? <Check className="size-3" aria-hidden /> : null}{label}</Chip>;
}

export function Chip({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn("inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", className)}>{children}</span>;
}

export function Verified({ verified }: { verified: boolean }) {
  return verified ? (
    <Chip className="bg-indigo-50 text-indigo-700 ring-indigo-200">
      <Check className="size-3" aria-hidden />
      Verified, tamper-resistant
    </Chip>
  ) : (
    <Chip className="bg-muted text-muted-foreground ring-border">Recorded, not verified</Chip>
  );
}

/** Semi-circular readiness gauge. Plain SVG: no chart library needed. */
export function Gauge({ score, label, light }: { score: number; label: string; light?: boolean }) {
  const r = 80;
  const len = Math.PI * r;
  return (
    <div className="relative mx-auto w-full max-w-[220px]" role="img" aria-label={`${label}: ${score} out of 100`}>
      <svg viewBox="0 0 200 112" className="w-full">
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" strokeWidth="14" strokeLinecap="round" className={light ? "stroke-white/25" : "stroke-primary/15 dark:stroke-primary/20"} />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - score / 100)}
          className={cn("transition-[stroke-dashoffset] duration-1000", light ? "stroke-white" : "stroke-primary")}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="text-4xl font-semibold tabular-nums tracking-tight">
          {score}
          <span className={cn("text-lg font-medium", light ? "text-white/70" : "text-muted-foreground")}>/100</span>
        </p>
        <p className={cn("text-xs", light ? "text-white/80" : "text-muted-foreground")}>{label}</p>
      </div>
    </div>
  );
}
