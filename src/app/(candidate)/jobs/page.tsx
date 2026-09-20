import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Briefcase, Check, Lock, LockOpen, MapPin } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Chip, EmptyState, PageHeader } from "@/components/bits";
import { Why } from "@/components/why";
import { getJob } from "@/content/jobs";
import { getCandidateState, requireCandidate } from "@/lib/data";

export const metadata: Metadata = { title: "Jobs" };

export default async function JobsPage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, matches, baselineDone } = await getCandidateState(user.id, profile, role);
  if (!baselineDone) {
    return (<><PageHeader title="Jobs" /><EmptyState icon={Briefcase} title="Jobs unlock from evidence" body="Opportunities open based on demonstrated readiness, not resume keywords. Take the baseline to see which ones you already qualify for." href={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`} cta="Start baseline assessment" /></>);
  }
  const sorted = [...matches].sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || a.blockers.length - b.blockers.length || b.matchPct - a.matchPct);
  const unlocked = sorted.filter((m) => m.unlocked).length;

  return (
    <>
      <PageHeader title="Jobs" subtitle={`${unlocked} of ${matches.length} ${role.title} opportunities unlocked at ${readiness.score}% readiness. Matching is deterministic: the same evidence always gives the same result.`} />
      {unlocked === 0 ? (
        <p className="mb-5 rounded-2xl border bg-muted/50 p-4 text-sm">No jobs unlocked yet — that&apos;s normal at this stage. Each card below shows exactly what stands between you and that role.</p>
      ) : null}
      <ul className="grid gap-5 lg:grid-cols-2">
        {sorted.map((m) => {
          const job = getJob(m.jobId)!;
          return (
            <li key={job.id} className={cn("card-soft flex flex-col p-5", !m.unlocked && "bg-card/70")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" aria-hidden />{job.location} · {job.employmentType}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold tabular-nums">{m.matchPct}%</p>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{job.summary}</p>

              <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Eligibility</dt>
                  <dd className={cn("mt-0.5 text-sm font-semibold", m.unlocked ? "text-emerald-700" : "text-muted-foreground")}>
                    {m.unlocked ? "UNLOCKED" : "LOCKED"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{m.unlocked ? "Requirements" : "Blockers"}</dt>
                  <dd className="mt-0.5 text-sm font-semibold">{m.unlocked ? `${m.meets.length} met` : `${m.blockers.length} remaining`}</dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.meets.map((c) => <Chip key={c.skillId} className="bg-emerald-50 text-emerald-700 ring-emerald-200"><Check className="size-3" aria-hidden />{c.name} {c.current}%</Chip>)}
                {m.missing.map((c) => <Chip key={c.skillId} className="bg-amber-50 text-amber-800 ring-amber-200"><AlertTriangle className="size-3" aria-hidden />{c.name} {c.current}% / {c.required}%</Chip>)}
              </div>

              <div className="mt-4 flex-1 rounded-xl border p-3.5">
                {m.unlocked ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-700"><LockOpen className="size-4" aria-hidden />Unlocked — {m.summary.toLowerCase()}</p>
                ) : (
                  <>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Lock className="size-3.5" aria-hidden />Why this job is locked · {m.summary}</p>
                    <ul className="mt-2 space-y-2 text-sm">
                      {m.blockers.map((b) => (
                        <li key={b.message} className="flex items-start justify-between gap-3">
                          <span>{b.message}</span>
                          <Link href={b.href} className="flex shrink-0 items-center gap-0.5 font-medium text-primary hover:underline">{b.kind === "skill" ? "Improve" : b.kind === "project" ? "Submit" : "View"}<ArrowRight className="size-3.5" aria-hidden /></Link>
                        </li>
                      ))}
                    </ul>
                    {m.meets.length ? <p className="mt-2 text-xs text-muted-foreground">Everything else: ✓ meets requirement.</p> : null}
                  </>
                )}
              </div>

              {!m.unlocked && m.blockers[0] ? (
                <Link href={m.blockers[0].href} className={cn(buttonVariants({ variant: "secondary" }), "mt-3 h-9 w-full")}>
                  Fix {m.blockers.length === 1 ? "this blocker" : "blockers"} <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : null}

              <div className="mt-3 flex items-center justify-between">
                <Why label={m.unlocked ? "Why is this unlocked?" : "Why is this job locked?"} title={`${job.title} — eligibility`} description="Eligibility is rule-based. No AI is involved in deciding which jobs you can access.">
                  <div>
                    <p className="mb-2 font-medium">Hard requirements (pass / fail)</p>
                    <ul className="space-y-2">
                      {[...m.meets, ...m.missing].map((c) => (
                        <li key={c.skillId} className="rounded-xl border p-3">
                          <p className="flex justify-between font-medium"><span>{c.name}</span><span className={c.met ? "text-emerald-700" : "text-rose-600"}>{c.met ? "Pass" : "Fail"}</span></p>
                          <p className="text-xs text-muted-foreground">Current {c.current}% · required {c.required}%{c.reason === "not_assessed" ? " · needs assessed evidence, a resume claim does not count" : ""}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-3 text-xs">
                    <div><dt className="text-muted-foreground">Your readiness</dt><dd className="text-base font-semibold">{readiness.score}%</dd></div>
                    <div><dt className="text-muted-foreground">Opens at (for {role.title})</dt><dd className="text-base font-semibold">{m.requiredReadiness}%</dd></div>
                    <div><dt className="text-muted-foreground">Project evidence</dt><dd className="font-medium">{job.requiresProject ? "Required" : "Not required"}</dd></div>
                    <div><dt className="text-muted-foreground">Match</dt><dd className="font-medium">{m.matchPct}% weighted skill coverage</dd></div>
                  </dl>
                  <p className="text-xs text-muted-foreground">Match % is how much of the job&apos;s weighted skill needs your current levels cover. It informs ranking only; unlocking depends on the rules above. Formula {readiness.formulaVersion}.</p>
                </Why>
                {m.unlocked ? <span className={cn(buttonVariants({ variant: "secondary" }), "h-8 px-3 cursor-default")}>Sample listing</span> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-xs text-muted-foreground">Listings in this version are samples with fictional employers, used to show how readiness-based unlocking works. Live employer postings arrive with the recruiter portal.</p>
    </>
  );
}
