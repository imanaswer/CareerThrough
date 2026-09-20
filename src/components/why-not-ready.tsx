import { PRIORITY_LABELS } from "@/content/taxonomy";
import type { Role } from "@/content/taxonomy";
import type { Readiness } from "@/lib/readiness";
import { Why } from "./why";

/**
 * "Why am I at 49%?" — ranks the skills giving up the most readiness points.
 * Every number comes from the server-side engine's own per-skill contributions.
 */
export function WhyNotReady({ role, readiness, contentVersion }: { role: Role; readiness: Readiness; contentVersion: string }) {
  const losing = [...readiness.perSkill].filter((p) => p.lostPoints > 0).sort((a, b) => b.lostPoints - a.lostPoints);
  const top = losing.slice(0, 5);
  const { assessed, total } = readiness.evidenceCoverage;
  const first = readiness.nextActions.find((a) => a.skillId);

  return (
    <Why
      label={`Why am I at ${readiness.score}%?`}
      title={`Why you are at ${readiness.score} out of 100`}
      description={`You are giving up ${Math.round(100 - readiness.score)} points. Here is exactly where they are going.`}
    >
      {top.length ? (
        <div>
          <p className="mb-2 font-medium">Largest contributors to the gap</p>
          <ol className="space-y-2">
            {top.map((p, i) => (
              <li key={p.skillId} className="rounded-xl border p-3">
                <p className="flex items-start justify-between gap-2 text-sm font-medium">
                  <span>{i + 1}. {p.name}</span>
                  <span className="shrink-0 tabular-nums text-rose-600">−{p.lostPoints} pts</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.level}% of a {p.target}% target · {PRIORITY_LABELS[p.priority]} · worth up to {p.maxContribution} points
                  {p.blocksJobs ? ` · blocks ${p.blocksJobs} ${p.blocksJobs === 1 ? "opportunity" : "opportunities"}` : ""}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((p.level / p.target) * 100, 100)}%` }} />
                </div>
              </li>
            ))}
          </ol>
          {losing.length > top.length ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Plus {losing.length - top.length} smaller {losing.length - top.length === 1 ? "gap" : "gaps"}.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground">Every role skill is at or above its target. Nothing is holding your score back.</p>
      )}

      <div className="rounded-xl bg-muted/60 p-3 text-xs">
        <p className="font-medium text-foreground">Evidence coverage</p>
        <p className="mt-1 text-muted-foreground">
          {assessed} of {total} skills assessed. Unassessed skills are not assumed to be zero ability — they are simply unproven, and
          unproven skills cannot count toward a score employers are meant to trust.
        </p>
      </div>

      {first ? (
        <div>
          <p className="mb-1 font-medium">Biggest opportunity</p>
          <p className="text-sm text-muted-foreground">
            {first.title} first
            {first.impact ? ` — worth +${first.impact.deltaScore} points if you reach ${first.impact.to}%.` : "."}
          </p>
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Formula {readiness.formulaVersion} · content {contentVersion}. Bands are specific to {role.title}; the same score means something
        different for another role.
      </p>
    </Why>
  );
}
