import { DIMENSION_LABELS } from "@/content/taxonomy";
import type { Role } from "@/content/taxonomy";
import type { Readiness } from "@/lib/readiness";
import { Why } from "./why";

/** "How is this calculated?" — shared by the dashboard and the Career Card. */
export function ReadinessWhy({ role, readiness, contentVersion, label = "How is this calculated?" }: { role: Role; readiness: Readiness; contentVersion: string; label?: string }) {
  return (
    <Why label={label} title={`How your ${readiness.score}/100 is calculated`} description={readiness.explanation}>
      <div>
        <p className="mb-2 font-medium">Points by skill</p>
        <table className="w-full text-xs">
          <thead className="text-left text-muted-foreground">
            <tr><th className="pb-1 font-normal">Skill</th><th className="pb-1 font-normal">Level / target</th><th className="pb-1 text-right font-normal">Points</th></tr>
          </thead>
          <tbody className="divide-y">
            {readiness.perSkill.map((p) => (
              <tr key={p.skillId}>
                <td className="py-1.5 pr-2">{p.name}</td>
                <td className="py-1.5 tabular-nums">{p.level}% / {p.target}%</td>
                <td className="py-1.5 text-right tabular-nums">{p.contribution} <span className="text-muted-foreground">of {p.maxContribution}</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="border-t font-semibold"><td className="pt-2" colSpan={2}>Readiness</td><td className="pt-2 text-right tabular-nums">{readiness.score} of 100</td></tr></tfoot>
        </table>
      </div>
      <div>
        <p className="mb-2 font-medium">By dimension</p>
        <ul className="space-y-1 text-xs">
          {readiness.dimensions.map((d) => (
            <li key={d.dimension} className="flex justify-between"><span>{DIMENSION_LABELS[d.dimension]}</span><span className="tabular-nums text-muted-foreground">{d.pct !== null ? `${d.pct}% of target` : d.note}</span></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 font-medium">Bands for {role.title}</p>
        <ul className="space-y-1 text-xs">
          {role.bands.map((b) => (
            <li key={b.id} className={b.id === readiness.band.id ? "flex justify-between font-semibold text-primary" : "flex justify-between text-muted-foreground"}>
              <span>{b.min}%+ · {b.label}</span><span>{b.access}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">Bands are set per role. The same score can mean something different for another role.</p>
      </div>
      <p className="text-xs text-muted-foreground">Formula {readiness.formulaVersion} · content {contentVersion}. Calculated on the server from your evidence; nothing here is estimated by AI.</p>
    </Why>
  );
}
