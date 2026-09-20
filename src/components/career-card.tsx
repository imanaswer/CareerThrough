import { BadgeCheck, FolderGit2, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import type { Role } from "@/content/taxonomy";
import { CONFIDENCE_LABELS, type EvidenceItem, type Readiness } from "@/lib/readiness";
import { shortDate } from "@/lib/format";
import { Chip, Gauge, LevelBar } from "./bits";

const STATUS_STYLE = { Ready: "bg-emerald-400/20 text-white ring-white/40", Developing: "bg-amber-300/20 text-white ring-white/40", "Not yet ready": "bg-white/10 text-white ring-white/30" };

/** The verified career identity. Same component for the private view and the public page. */
export function CareerCard({ name, headline, role, readiness, evidence, status, issuedAt }: { name: string; headline?: string; role: Role; readiness: Readiness; evidence: EvidenceItem[]; status: keyof typeof STATUS_STYLE; issuedAt?: Date | null }) {
  const technical = readiness.perSkill.filter((p) => p.dimension === "technical");
  const stale = readiness.perSkill.filter((p) => p.reassessRecommended);
  const other = readiness.perSkill.filter((p) => p.dimension !== "technical");
  const project = evidence.find((e) => e.type === "project");
  const assessed = evidence.filter((e) => e.type === "assessment");
  const attemptsTaken = new Set(assessed.map((e) => e.refId).filter(Boolean)).size;
  const lastVerified = assessed[0]?.createdAt;
  const verifiedCount = readiness.perSkill.filter((p) => p.assessed).length;

  return (
    <article className="card-soft overflow-hidden">
      <header className="surface-hero grid gap-6 p-7 sm:grid-cols-[1fr_220px] sm:p-9">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80"><ShieldCheck className="size-3.5" aria-hidden />Career Through · Verified career identity</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{name}</h1>
          {headline ? <p className="mt-1 text-white/85">{headline}</p> : null}
          <p className="mt-4 text-sm text-white/80">Target role</p>
          <p className="text-xl font-semibold">{role.title}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip className={STATUS_STYLE[status]}>{status}</Chip>
            <Chip className="bg-white/10 text-white ring-white/30">{readiness.band.label}</Chip>
          </div>
        </div>
        <Gauge score={readiness.score} label="Career readiness" light />
      </header>

      <dl className="grid grid-cols-2 divide-x divide-y border-b sm:grid-cols-4 sm:divide-y-0">
        <div className="p-4">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Verified skills</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{verifiedCount}<span className="text-sm font-normal text-muted-foreground"> / {readiness.perSkill.length}</span></dd>
        </div>
        <div className="p-4">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Assessments taken</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{attemptsTaken}</dd>
        </div>
        <div className="p-4">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Project evidence</dt>
          <dd className="mt-1 text-xl font-semibold">{project ? "1" : "—"}</dd>
        </div>
        <div className="p-4">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Last verified</dt>
          <dd className="mt-1 text-sm font-semibold">{lastVerified ? shortDate(lastVerified) : "Not yet"}</dd>
        </div>
      </dl>

      <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold">Role-specific skills</h2>
          <ul className="mt-3 space-y-4">{technical.map((p) => <CardSkill key={p.skillId} p={p} />)}</ul>
        </section>
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold">Aptitude, communication & workplace</h2>
            <ul className="mt-3 space-y-4">{other.map((p) => <CardSkill key={p.skillId} p={p} />)}</ul>
            <p className="mt-3 text-xs text-muted-foreground">Interview readiness: not yet assessed.</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold">Project evidence</h2>
            {project ? (
              <p className="mt-2 flex items-start gap-2 text-sm"><FolderGit2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /><span>{project.detail?.title}<br /><a href={project.url ?? "#"} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-primary hover:underline">{project.url}</a><span className="block text-xs text-muted-foreground">Submitted {shortDate(project.createdAt)} · link {project.detail?.status === "recorded" ? "validated" : "validation pending"} · not human-reviewed</span></span></p>
            ) : <p className="mt-2 text-sm text-muted-foreground">No project on record.</p>}
          </section>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-7 py-4 text-xs text-muted-foreground sm:px-9">
        <span className="flex items-center gap-1.5"><BadgeCheck className="size-3.5 text-primary" aria-hidden />{verifiedCount} of {readiness.perSkill.length} skills backed by verified, tamper-resistant assessments</span>
        <span>{stale.length ? `${stale.length} skill${stale.length === 1 ? "" : "s"} due for reassessment · ` : ""}{lastVerified ? `Last verified ${shortDate(lastVerified)}` : "Not yet verified"}{issuedAt ? ` · Issued ${shortDate(issuedAt)}` : ""} · {readiness.formulaVersion}</span>
      </footer>
    </article>
  );
}

function CardSkill({ p }: { p: Readiness["perSkill"][number] }) {
  return (
    <li>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">{p.name}</span>
        <span className="flex items-center gap-2 tabular-nums">
          <span className="font-semibold">{p.level}%</span>
          <span className={cn("text-xs", p.assessed && p.gap >= 0 ? "text-emerald-700" : "text-muted-foreground")}>{p.assessed ? (p.gap >= 0 ? "✓ Verified" : "Developing") : "Unverified"}</span>
        </span>
      </div>
      <div className="mt-1.5"><LevelBar level={p.level} target={p.target} status={p.status} label={p.name} /></div>
      <p className="mt-1 text-xs text-muted-foreground">Target {p.target}% · {CONFIDENCE_LABELS[p.confidence]}{p.lastVerifiedAt ? ` · ${shortDate(p.lastVerifiedAt)}` : ""}</p>
    </li>
  );
}
