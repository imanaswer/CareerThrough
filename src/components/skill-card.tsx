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
  critical: "bg-rose-50 text-rose-700 ring-rose-200",
  important: "bg-amber-50 text-amber-800 ring-amber-200",
  nice: "bg-muted text-muted-foreground ring-border",
};

const DOTS = { none: 0, low: 1, medium: 2, strong: 3 } as const;

function ConfidenceDots({ level }: { level: SkillReadiness["confidence"] }) {
  const n = DOTS[level];
  return (
    <span className="inline-flex items-center gap-1" title={CONFIDENCE_LABELS[level]}>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("size-1.5 rounded-full", i < n ? "bg-primary" : "bg-muted-foreground/25")} />
        ))}
      </span>
      <span className="text-xs">{CONFIDENCE_LABELS[level].split(" —")[0]}</span>
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
    <article className="rounded-2xl border p-4 transition-colors hover:border-primary/30 hover:bg-muted/30">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 font-medium">
            {skill.name}
            <Chip className={PRIORITY_CHIP[skill.priority]}>{PRIORITY_LABELS[skill.priority].toUpperCase()}</Chip>
          </h3>
          <p className="mt-1 flex items-baseline gap-1.5 text-sm">
            <span className="text-xl font-semibold tabular-nums">{skill.level}%</span>
            <span className="text-muted-foreground">/ {skill.target}% target</span>
          </p>
        </div>
        <StatusChip status={skill.status} />
      </div>

      <div className="mt-3">
        <LevelBar level={skill.level} target={skill.target} status={skill.status} label={skill.name} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {distance > 0 ? (
            <><span className="font-medium text-foreground">{distance} points</span> to the role requirement</>
          ) : (
            <>Meets the role requirement with {skill.gap} points to spare</>
          )}
          {" · worth up to "}{skill.maxContribution} readiness points
        </p>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Evidence</dt>
          <dd className="mt-0.5 font-medium">
            {skill.assessed ? "Assessment" : used.length ? "Claim only" : "None"}
            {skill.hasProject ? " + project" : ""}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Confidence</dt>
          <dd className="mt-0.5 font-medium"><ConfidenceDots level={skill.confidence} /></dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Verified</dt>
          <dd className={cn("mt-0.5 font-medium", skill.reassessRecommended && "text-amber-700")}>
            {skill.lastVerifiedAt ? timeAgo(skill.lastVerifiedAt) : "Never"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Blocks</dt>
          <dd className={cn("mt-0.5 font-medium", skill.blocksJobs > 0 && "text-rose-600")}>
            {skill.blocksJobs ? `${skill.blocksJobs} ${skill.blocksJobs === 1 ? "opportunity" : "opportunities"}` : "Nothing"}
          </dd>
        </div>
      </dl>

      {skill.reassessRecommended ? (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          Verified {timeAgo(skill.lastVerifiedAt!)} — reassessment recommended before it expires.
        </p>
      ) : null}
      {skill.hasExpiredEvidence && !skill.assessed ? (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-800">
          <Ban className="size-3.5 shrink-0" aria-hidden />
          Previous evidence expired and no longer counts. Re-assess to restore this skill.
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
        <Why label="View evidence" title={skill.name} description={skill.explanation}>
          <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-3 text-xs">
            <div><dt className="text-muted-foreground">Current level</dt><dd className="text-base font-semibold text-foreground">{skill.level}%</dd></div>
            <div><dt className="text-muted-foreground">Role target</dt><dd className="text-base font-semibold text-foreground">{skill.target}%</dd></div>
            <div><dt className="text-muted-foreground">Adds to readiness</dt><dd className="font-medium text-foreground">{skill.contribution} of {skill.maxContribution} points</dd></div>
            <div><dt className="text-muted-foreground">Role priority</dt><dd className="font-medium text-foreground">{PRIORITY_LABELS[skill.priority]} · weight {skill.weight}</dd></div>
          </dl>
          <div>
            <p className="mb-2 font-medium">Evidence used</p>
            {used.length ? (
              <ul className="space-y-2">{used.map((e) => <EvidenceLine key={e.id} e={e} />)}</ul>
            ) : (
              <p className="text-muted-foreground">No evidence yet. Missing evidence is never assumed to be mastery — or to be failure. It is simply unproven.</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Formula {formulaVersion}. Your level is your most recent assessed score, not your best. Levels above the target do not add extra points.
          </p>
        </Why>

        {skill.gap < 0 || skill.reassessRecommended ? (
          <Link
            href={skill.assessed && skill.gap < 0 ? `/plan/${skill.skillId}` : `/assessment/skill:${skill.skillId}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {!skill.assessed ? "Verify skill" : skill.gap < 0 ? "Improve skill" : "Re-verify"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-sm text-emerald-700">
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
