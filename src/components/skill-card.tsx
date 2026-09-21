import Link from "next/link";
import { AlertTriangle, ArrowRight, Ban, Check, Clock } from "lucide-react";
import { cn } from "cn";
import { PRIORITY_LABELS } from "@/content/taxonomy";
import { CONFIDENCE_LABELS, type EvidenceItem, type SkillReadiness } from "@/lib/readiness";
import { timeAgo } from "@/lib/format";
import { Chip, LevelBar, StatusChip } from "./bits";
import { EvidenceLine } from "./skill-row";
import { Why } from "./why";

const PRIORITY_CHIP = {
  critical: "bg-primary text-primary-foreground font-bold shadow-[0_2px_10px_rgba(0,0,0,0.1)] ring-0",
  important: "bg-foreground text-background font-bold shadow-sm ring-0",
  nice: "bg-white dark:bg-white/10 text-muted-foreground font-bold ring-1 ring-foreground/10 dark:ring-white/10",
};

const DOTS = { none: 0, low: 1, medium: 2, strong: 3 } as const;

function ConfidenceDots({ level }: { level: SkillReadiness["confidence"] }) {
  const n = DOTS[level];
  return (
    <span className="inline-flex items-center gap-1.5" title={CONFIDENCE_LABELS[level]}>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("size-2 rounded-full shadow-sm", i < n ? "bg-primary" : "bg-muted-foreground/20 dark:bg-white/20")} />
        ))}
      </span>
      <span className="text-xs font-semibold">{CONFIDENCE_LABELS[level].split(" —")[0]}</span>
    </span>
  );
}

/**
 * A skill is the product's core unit: level, target, distance, evidence, confidence,
 * freshness and opportunity impact — all visible without a click.
 */
export function SkillCard({ skill, evidence, formulaVersion }: { skill: SkillReadiness; evidence: EvidenceItem[]; formulaVersion: string }) {
  const used = evidence.filter((e) => skill.evidenceIds.includes(e.id));
  const distance = Math.max(-skill.gap, 0);

  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-white/80 bg-white/60 p-5 sm:p-6 xl:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 font-bold text-[15px] lg:text-[17px] text-foreground dark:text-white">
            {skill.name}
            <Chip className={PRIORITY_CHIP[skill.priority]}>{PRIORITY_LABELS[skill.priority].toUpperCase()}</Chip>
          </h3>
        </div>
        <StatusChip status={skill.status} />
      </div>

      <div className="mt-5 bg-white/50 dark:bg-black/20 rounded-2xl p-5 border border-foreground/5 dark:border-white/5">
        <p className="flex items-baseline gap-1.5 mb-4">
          <span className="text-3xl lg:text-4xl font-bold tabular-nums tracking-tight text-foreground dark:text-white">{skill.level}<span className="text-xl">%</span></span>
          <span className="text-sm font-medium text-muted-foreground dark:text-white/60">/ {skill.target}% target</span>
        </p>
        <LevelBar level={skill.level} target={skill.target} status={skill.status} label={skill.name} />
        <p className="mt-4 text-xs font-medium text-muted-foreground dark:text-white/70">
          {distance > 0 ? (
            <><span className="font-bold text-foreground dark:text-white">{distance} points</span> to the role requirement</>
          ) : (
            <>Meets the role requirement with <span className="font-bold text-emerald-600 dark:text-emerald-400">{skill.gap} points</span> to spare</>
          )}
          {" · worth up to "}{skill.maxContribution} points
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-xs sm:grid-cols-4 px-2">
        <div>
          <dt className="text-muted-foreground/80 dark:text-white/60 font-medium">Evidence</dt>
          <dd className="mt-1 font-bold text-foreground dark:text-white">
            {skill.assessed ? "Assessment" : used.length ? "Claim only" : "None"}
            {skill.hasProject ? " + project" : ""}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground/80 dark:text-white/60 font-medium">Confidence</dt>
          <dd className="mt-1 font-bold text-foreground dark:text-white"><ConfidenceDots level={skill.confidence} /></dd>
        </div>
        <div>
          <dt className="text-muted-foreground/80 dark:text-white/60 font-medium">Verified</dt>
          <dd className={cn("mt-1 font-bold", skill.reassessRecommended ? "text-amber-600 dark:text-amber-400" : "text-foreground dark:text-white")}>
            {skill.lastVerifiedAt ? timeAgo(skill.lastVerifiedAt) : "Never"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground/80 dark:text-white/60 font-medium">Blocks</dt>
          <dd className={cn("mt-1 font-bold", skill.blocksJobs > 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground dark:text-white")}>
            {skill.blocksJobs ? `${skill.blocksJobs} ${skill.blocksJobs === 1 ? "opportunity" : "opportunities"}` : "Nothing"}
          </dd>
        </div>
      </dl>

      {skill.reassessRecommended ? (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm font-medium text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50">
          <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          Verified {timeAgo(skill.lastVerifiedAt!)} — reassessment recommended before it expires.
        </p>
      ) : null}
      {skill.hasExpiredEvidence && !skill.assessed ? (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm font-medium text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/50">
          <Ban className="size-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
          Previous evidence expired and no longer counts. Re-assess to restore this skill.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 dark:border-white/10 pt-5">
        <Why label="View evidence" title={skill.name} description={skill.explanation}>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 p-5 text-sm">
            <div><dt className="text-muted-foreground font-medium">Current level</dt><dd className="text-lg font-bold text-foreground dark:text-white">{skill.level}%</dd></div>
            <div><dt className="text-muted-foreground font-medium">Role target</dt><dd className="text-lg font-bold text-foreground dark:text-white">{skill.target}%</dd></div>
            <div><dt className="text-muted-foreground font-medium">Adds to readiness</dt><dd className="font-semibold text-foreground/90 dark:text-white/90">{skill.contribution} of {skill.maxContribution} points</dd></div>
            <div><dt className="text-muted-foreground font-medium">Role priority</dt><dd className="font-semibold text-foreground/90 dark:text-white/90">{PRIORITY_LABELS[skill.priority]} · weight {skill.weight}</dd></div>
          </dl>
          <div className="mt-5">
            <p className="mb-3 font-bold text-foreground dark:text-white">Evidence used</p>
            {used.length ? (
              <ul className="space-y-3">{used.map((e) => <EvidenceLine key={e.id} e={e} />)}</ul>
            ) : (
              <p className="text-sm text-muted-foreground">No evidence yet. Missing evidence is never assumed to be mastery — or to be failure. It is simply unproven.</p>
            )}
          </div>
          <p className="mt-5 text-xs font-medium text-muted-foreground bg-muted/50 p-3 rounded-xl border">
            Formula {formulaVersion}. Your level is your most recent assessed score, not your best. Levels above the target do not add extra points.
          </p>
        </Why>

        {skill.gap < 0 || skill.reassessRecommended ? (
          <Link
            href={skill.assessed && skill.gap < 0 ? `/plan/${skill.skillId}` : `/assessment/skill:${skill.skillId}`}
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            {!skill.assessed ? "Verify skill" : skill.gap < 0 ? "Improve skill" : "Re-verify"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            <Check className="size-4" aria-hidden /> Proven
          </span>
        )}
      </div>
    </article>
  );
}

/** Compact one-line variant for dense lists. */
export function SkillLine({ skill }: { skill: SkillReadiness }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-40 shrink-0 truncate text-sm font-medium">{skill.name}</span>
      <div className="min-w-0 flex-1">
        <LevelBar level={skill.level} target={skill.target} status={skill.status} label={skill.name} />
      </div>
      <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {skill.level}% / {skill.target}%
      </span>
      {skill.blocksJobs ? (
        <span className="hidden w-16 shrink-0 items-center gap-1 text-xs text-rose-600 sm:flex" title={`Blocks ${skill.blocksJobs} opportunities`}>
          <AlertTriangle className="size-3" aria-hidden />{skill.blocksJobs}
        </span>
      ) : (
        <span className="hidden w-16 shrink-0 sm:block" />
      )}
    </div>
  );
}
