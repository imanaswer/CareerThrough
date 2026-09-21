import { BadgeCheck, FolderGit2, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import type { Role } from "@/content/taxonomy";
import { CONFIDENCE_LABELS, type EvidenceItem, type Readiness } from "@/lib/readiness";
import { shortDate } from "@/lib/format";
import { Chip, Gauge, LevelBar } from "./bits";

const STATUS_STYLE = { Ready: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20", Developing: "bg-amber-500/10 text-amber-700 ring-amber-500/20", "Not yet ready": "bg-foreground/5 text-foreground/70 ring-foreground/10" };

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
    <article className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-700 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:bg-white/60 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/50">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[60px] transition-transform duration-1000 group-hover:scale-125" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/10 blur-[60px] transition-transform duration-1000 group-hover:scale-125" aria-hidden />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/40 to-white/0 opacity-50 dark:from-white/10" />
      
      <header className="relative z-10 grid gap-6 p-7 sm:grid-cols-[1fr_220px] sm:p-9">
        <div className="relative z-10">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary/80"><ShieldCheck className="size-4" aria-hidden />Career Through · Verified identity</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground/90">{name}</h1>
          {headline ? <p className="mt-1.5 font-medium text-muted-foreground">{headline}</p> : null}
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Target role</p>
          <p className="text-xl font-bold text-foreground/80">{role.title}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip className={STATUS_STYLE[status]}>{status}</Chip>
            <Chip className="bg-primary/10 font-bold text-primary ring-primary/20">{readiness.band.label}</Chip>
          </div>
        </div>
        <Gauge score={readiness.score} label="Career readiness" />
      </header>

      <dl className="relative z-10 grid grid-cols-2 divide-x divide-foreground/5 border-b border-t border-foreground/5 bg-foreground/[0.02] sm:grid-cols-4 sm:divide-y-0">
        <div className="p-4 sm:p-6">
          <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Verified skills</dt>
          <dd className="mt-2 text-2xl font-bold tabular-nums text-foreground/80">{verifiedCount}<span className="text-sm font-medium text-muted-foreground/50"> / {readiness.perSkill.length}</span></dd>
        </div>
        <div className="p-4 sm:p-6">
          <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Assessments</dt>
          <dd className="mt-2 text-2xl font-bold tabular-nums text-foreground/80">{attemptsTaken}</dd>
        </div>
        <div className="p-4 sm:p-6">
          <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Projects</dt>
          <dd className="mt-2 text-2xl font-bold text-foreground/80">{project ? "1" : "—"}</dd>
        </div>
        <div className="p-4 sm:p-6">
          <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Last verified</dt>
          <dd className="mt-2 text-sm font-bold text-foreground/80">{lastVerified ? shortDate(lastVerified) : "Not yet"}</dd>
        </div>
      </dl>

      <div className="relative z-10 grid gap-8 p-7 sm:p-9 lg:grid-cols-2">
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">Role-specific skills</h2>
          <ul className="mt-5 space-y-6">{technical.map((p) => <CardSkill key={p.skillId} p={p} />)}</ul>
        </section>
        <div className="space-y-10">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">Aptitude & workplace</h2>
            <ul className="mt-5 space-y-6">{other.map((p) => <CardSkill key={p.skillId} p={p} />)}</ul>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Interview readiness: not yet assessed.</p>
          </section>
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">Project evidence</h2>
            {project ? (
              <div className="mt-4 flex items-start gap-4 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm backdrop-blur-md">
                <FolderGit2 className="mt-0.5 size-5 shrink-0 text-primary/70" aria-hidden />
                <div>
                  <p className="text-sm font-bold text-foreground/80">{project.detail?.title}</p>
                  <a href={project.url ?? "#"} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 block break-all text-sm font-medium text-primary/80 hover:text-primary hover:underline">{project.url}</a>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Submitted {shortDate(project.createdAt)} · link {project.detail?.status === "recorded" ? "validated" : "pending"} · not reviewed</p>
                </div>
              </div>
            ) : <p className="mt-4 text-sm font-medium text-muted-foreground/60">No project on record.</p>}
          </section>
        </div>
      </div>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/5 bg-foreground/[0.02] px-7 py-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 sm:px-9">
        <span className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary/70" aria-hidden />{verifiedCount} of {readiness.perSkill.length} skills backed by verified assessments</span>
        <span>{stale.length ? `${stale.length} skill${stale.length === 1 ? "" : "s"} due for reassessment · ` : ""}{lastVerified ? `Last verified ${shortDate(lastVerified)}` : "Not yet verified"}{issuedAt ? ` · Issued ${shortDate(issuedAt)}` : ""} · {readiness.formulaVersion}</span>
      </footer>
    </article>
  );
}

function CardSkill({ p }: { p: Readiness["perSkill"][number] }) {
  return (
    <li>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-bold text-foreground/80">{p.name}</span>
        <span className="flex items-center gap-2 tabular-nums">
          <span className="font-bold text-foreground/80">{p.level}%</span>
          <span className={cn("text-xs font-bold", p.assessed && p.gap >= 0 ? "text-emerald-600" : "text-muted-foreground/60")}>{p.assessed ? (p.gap >= 0 ? "✓ Verified" : "Developing") : "Unverified"}</span>
        </span>
      </div>
      <div className="mt-2"><LevelBar level={p.level} target={p.target} status={p.status} label={p.name} /></div>
      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Target {p.target}% · {CONFIDENCE_LABELS[p.confidence]}{p.lastVerifiedAt ? ` · ${shortDate(p.lastVerifiedAt)}` : ""}</p>
    </li>
  );
}
