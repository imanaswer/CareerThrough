import Link from "next/link";
import { ArrowRight, Check, MapPin, Target } from "lucide-react";
import { getJob } from "@/content/jobs";
import type { NextUnlock as NextUnlockData } from "@/lib/simulate";

/** The closest locked opportunity and exactly what stands in the way. */
export function NextUnlock({ unlock }: { unlock: NextUnlockData }) {
  const { match, met, total, progressPct } = unlock;
  const job = getJob(match.jobId);
  if (!job) return null;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{job.title}</p>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden />
            {job.location} · {job.employmentType}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-semibold tabular-nums">{match.matchPct}%</p>
          <p className="text-xs text-muted-foreground">match</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{met} of {total} requirements met</span>
          <span className="tabular-nums text-muted-foreground">{progressPct}% there</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-muted" role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={met} aria-label={`${job.title} requirements met`}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {match.blockers.length} remaining
      </p>
      <ol className="mt-2 space-y-2">
        {match.blockers.map((b, i) => (
          <li key={b.message} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link href={b.href} className="hover:text-primary hover:underline">{b.message}</Link>
          </li>
        ))}
      </ol>

      {match.meets.length ? (
        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden />
          Already met: {match.meets.map((m) => m.name).join(", ")}
        </p>
      ) : null}

      <Link href="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        <Target className="size-4" aria-hidden />
        View opportunity <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
