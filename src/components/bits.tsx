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
    <section id={id} className={cn("card-soft p-5", className)}>
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Every empty state says what to do next. */
export function EmptyState({ icon: Icon, title, body, href, cta }: { icon: LucideIcon; title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-muted/40 px-6 py-10 text-center">
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-secondary text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {href && cta ? (
        <Link href={href} className={cn(buttonVariants(), "mt-4 h-9 px-4")}>
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

const STATUS_BAR: Record<SkillStatus, string> = {
  meets: "bg-emerald-500",
  close: "bg-amber-500",
  gap: "bg-rose-500",
  no_evidence: "bg-muted-foreground/30",
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
      className="relative h-2 w-full rounded-full bg-muted"
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700", STATUS_BAR[status])} style={{ width: `${level}%` }} />
      <div className="absolute -top-1 h-4 w-0.5 rounded bg-foreground/70" style={{ left: `${target}%` }} aria-hidden />
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
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", className)}>{children}</span>;
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
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" strokeWidth="14" strokeLinecap="round" className={light ? "stroke-white/25" : "stroke-muted"} />
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
