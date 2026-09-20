import { SubmitButton } from "@/components/pending";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Chip, Panel } from "@/components/bits";
import { ROLES, findRoleBySlug } from "@/content/roles";
import { getSkill } from "@/content/skills";
import { jobsForRole } from "@/content/jobs";
import { DIMENSION_LABELS, PRIORITY_LABELS } from "@/content/taxonomy";
import { requiredReadiness } from "@/lib/matching";
import { enroll } from "../../actions";

export function generateStaticParams() {
  return ROLES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const role = findRoleBySlug((await params).slug);
  return { title: role?.title, description: role?.tagline };
}

const PRIORITY_CHIP = { critical: "bg-rose-50 text-rose-700 ring-rose-200", important: "bg-amber-50 text-amber-800 ring-amber-200", nice: "bg-muted text-muted-foreground ring-border" };

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const role = findRoleBySlug((await params).slug);
  if (!role) notFound();
  const jobs = jobsForRole(role.id);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="surface-hero rounded-3xl p-8 sm:p-10">
          <p className="text-sm font-medium text-white/80">Career path</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Become a {role.title}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/90">
            Know what employers expect. Measure where you stand. Build evidence for the gaps.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/80">{role.description}</p>
          <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              [`${role.skills.length}`, "skills measured"],
              ["4", "assessed dimensions"],
              [`${role.skills.length + 2}`, "assessments available"],
              ["1", "practical project"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="text-2xl font-semibold tabular-nums">{n}</dt>
                <dd className="text-xs text-white/80">{label}</dd>
              </div>
            ))}
          </dl>
          <form action={enroll} className="mt-6 flex flex-wrap items-center gap-4">
            <input type="hidden" name="roleId" value={role.id} />
            <SubmitButton pendingLabel="Setting up your path…" className="h-11 bg-white px-6 text-base text-primary hover:bg-white/90">
              Start this path
            </SubmitButton>
              <span className="text-sm text-white/80">Free during early access · {role.journeyEstimate}</span>
          </form>
        </div>

        <section className="mt-8 rounded-2xl border p-5">
          <h2 className="text-sm font-semibold">Your journey</h2>
          <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
            {["Baseline", "Understand", "Build", "Verify", "Career Card", "Opportunities"].map((stage, i) => (
              <li key={stage} className="flex items-center gap-2">
                {i ? <span className="text-muted-foreground" aria-hidden>→</span> : null}
                <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">{stage}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">
            You never study a topic you have already proven. Assessments set your levels, the plan targets only what is below target, and
            opportunities open as the evidence accumulates.
          </p>
        </section>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Panel title="What you'll do">
              <ul className="space-y-2 text-sm">
                {role.whatYouDo.map((w) => (
                  <li key={w} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{w}</li>
                ))}
              </ul>
            </Panel>

            <Panel title="What you\u2019ll prove">
              <ul className="divide-y">
                {role.skills.map((rs) => {
                  const s = getSkill(rs.skillId);
                  return (
                    <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                      <div>
                        <p className="font-medium">{s.name} <span className="text-xs font-normal text-muted-foreground">· {DIMENSION_LABELS[s.dimension]}</span></p>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold tabular-nums">Target {rs.target}%</p>
                        <Chip className={PRIORITY_CHIP[rs.priority]}>{PRIORITY_LABELS[rs.priority]}</Chip>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Sample opportunities and when they unlock">
              <ul className="divide-y">
                {jobs.map((j) => (
                  <li key={j.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <p className="font-medium">{j.title}</p>
                      <p className="text-muted-foreground">{j.company} · {j.location} · {j.employmentType}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Lock className="size-3.5" aria-hidden />Opens at {requiredReadiness(j, role)}% readiness + {j.hardRequirements.length} skill requirement{j.hardRequirements.length > 1 ? "s" : ""}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Sample listings with fictional employers. Thresholds are specific to {role.title}; other roles unlock at different levels.</p>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="How you're assessed">
              <ul className="space-y-2 text-sm">
                {role.dimensions.map((d) => (
                  <li key={d} className="flex justify-between gap-2">
                    <span>{DIMENSION_LABELS[d]}</span>
                    <span className="text-muted-foreground">{d === "interview" ? "Not yet assessed" : "Timed, server-scored"}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Assessments are verified and tamper-resistant: timed, scored on the server, with tab switches recorded.</p>
            </Panel>
            <Panel title="What gets verified">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Every skill level, from an assessment you took</li>
                <li>• Your role project: <span className="text-foreground">{role.project.title}</span></li>
                <li>• A final verification across all role skills</li>
              </ul>
            </Panel>
            <Panel title="What your Career Card contains">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Role readiness and status for {role.title}</li>
                <li>• Each skill with its evidence and confidence</li>
                <li>• Project evidence and last-verified dates</li>
                <li>• Private by default. You decide if it&apos;s public.</li>
              </ul>
            </Panel>
          </div>
        </div>
      </main>
    </>
  );
}
