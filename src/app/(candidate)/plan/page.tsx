import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FolderGit2, MessageSquare, PartyPopper, Target, TrendingUp } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Chip, EmptyState, PageHeader, Panel, LevelBar } from "@/components/bits";
import { PRIORITY_LABELS, SCORED_DIMENSIONS, type Priority } from "@/content/taxonomy";
import { getPlan } from "@/content/plans";
import { getSkill, skillName } from "@/content/skills";
import type { NextAction } from "@/lib/next-action";
import type { SkillReadiness } from "@/lib/readiness";
import { getCandidateState, requireCandidate } from "@/lib/data";
import { ProjectForm } from "./project-form";

export const metadata: Metadata = { title: "My Plan" };

const PROJECT_STATE = { none: "Not started", pending: "Validation pending", recorded: "Evidence recorded" };

const GROUPS: { priority: Priority; title: string; blurb: string }[] = [
  { priority: "critical", title: "Close these first", blurb: "Critical for the role. Every one of these holds back opportunities and your Career Card." },
  { priority: "important", title: "Then these", blurb: "Important to the role. Worth real readiness points once proven." },
  { priority: "nice", title: "When you have time", blurb: "Nice to have. They lift you above the bar rather than over it." },
];

export default async function PlanPage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, evidence, planDone, baselineDone, interview } = await getCandidateState(user.id, profile, role);

  if (!baselineDone) {
    return (
      <>
        <PageHeader title="My Plan" />
        <EmptyState
          icon={CheckCircle2}
          title="Your plan is built from your baseline"
          body="We only plan for gaps you actually have. Take the baseline first so you don't study what you already know."
          href={`/assessment/${encodeURIComponent(`baseline:${role.id}`)}`}
          cta="Start baseline assessment"
        />
      </>
    );
  }

  const bySkill = new Map(readiness.perSkill.map((p) => [p.skillId, p]));
  const actions = readiness.nextActions.filter((a) => a.skillId);
  const project = evidence.find((e) => e.type === "project" && e.refId === role.project.id);
  const projectState = !project ? "none" : project.detail?.status === "recorded" ? "recorded" : "pending";

  // Confidence track: the non-technical skills the role is scored on.
  const soft = readiness.perSkill.filter((p) => p.dimension !== "technical" && SCORED_DIMENSIONS.includes(p.dimension));
  const softIds = new Set(soft.map((p) => p.skillId));
  const technical = actions.filter((a) => !softIds.has(a.skillId!));

  const totalMinutes = technical.reduce((n, a) => n + (getPlan(a.skillId!)?.days.reduce((m, d) => m + d.minutes, 0) ?? 0), 0);
  const potential = technical.reduce((n, a) => n + (a.impact?.deltaScore ?? 0), 0);
  const blocked = new Set(technical.flatMap((a) => (a.blocksJobs ? [a.skillId] : [])));

  return (
    <>
      <PageHeader
        title="My Plan"
        subtitle={`Only what you need for ${role.title}, in priority order. Working through a plan doesn't raise your readiness — passing the assessment at the end does.`}
      />

      <dl className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Skills to close" value={String(actions.length)} hint={`${readiness.gaps.critical.length} critical`} />
        <Stat label="Focused study" value={totalMinutes ? `~${Math.round(totalMinutes / 60)}h` : "—"} hint="across the technical plans" icon={Clock} />
        <Stat label="Readiness available" value={potential ? `+${potential}` : "—"} hint="if you hit every target" icon={TrendingUp} />
        <Stat label="Blocking jobs" value={String(blocked.size)} hint="skills standing in the way" icon={Target} />
      </dl>

      {actions.length === 0 ? (
        <Panel className="mb-5">
          <p className="flex items-center gap-2 text-sm">
            <PartyPopper className="size-4 text-primary" aria-hidden />
            No skill gaps left. Finish your project and take the final verification.
          </p>
        </Panel>
      ) : null}

      <div className="space-y-6">
        {GROUPS.map(({ priority, title, blurb }) => {
          const group = technical.filter((a) => bySkill.get(a.skillId!)?.priority === priority);
          if (!group.length) return null;
          return (
            <section key={priority}>
              <h2 className="text-sm font-semibold">{title} <span className="font-normal text-muted-foreground">· {group.length}</span></h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{blurb}</p>
              <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-2">
                {group.map((a) => (
                  <li key={a.id}>
                    <SkillPlanCard action={a} skill={bySkill.get(a.skillId!)!} daysDone={countDone(planDone, a.skillId!)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section id="confidence" className="scroll-mt-24">
          <h2 className="text-sm font-semibold">Confidence &amp; communication</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            How you explain your work is scored for {role.title}, not treated as a soft extra. Practise it, then prove it like any
            other skill.
          </p>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
            <div className="card-soft flex flex-col p-5">
              <p className="flex items-center gap-2 font-medium">
                <MessageSquare className="size-4 text-primary" aria-hidden />
                Practise interviews
              </p>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">
                Answer real interview questions and get told exactly what is weak: no result to your story, no numbers, &ldquo;we&rdquo;
                instead of &ldquo;I&rdquo;, or hedging that makes a right answer sound unsure. Nothing is recorded as evidence, so you can
                be bad at it first.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {interview.answered ? `${interview.answered} interview answers recorded so far${interview.scored ? `, ${interview.scored} scored` : ", awaiting evaluation"}.` : "You haven't answered an interview question yet."}
              </p>
              <Link href="/practice" className={cn(buttonVariants(), "mt-4 h-10")}>
                Start practising <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="card-soft p-5">
              <p className="font-medium">Your non-technical skills</p>
              <ul className="mt-3 space-y-3">
                {soft.map((p) => (
                  <li key={p.skillId}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <Link href={`/plan/${p.skillId}`} className="font-medium hover:text-primary hover:underline">{p.name}</Link>
                      <span className="tabular-nums text-muted-foreground">{p.level}% / {p.target}%</span>
                    </div>
                    <div className="mt-1.5"><LevelBar level={p.level} target={p.target} status={p.status} label={p.name} /></div>
                  </li>
                ))}
              </ul>
              {soft.some((p) => p.gap < 0) ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  These count toward your readiness like any technical skill — {soft.filter((p) => p.gap < 0).length} of them are below target.
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">All of these meet their target.</p>
              )}
            </div>
          </div>
        </section>

        <section id="project" className="scroll-mt-24">
          <h2 className="text-sm font-semibold">Your role project — practical evidence</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            The only thing that lifts a skill above 84%. Questions show knowledge; a project shows you can do the work.
          </p>
          <div className="card-soft mt-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="flex items-center gap-2 font-medium"><FolderGit2 className="size-4 text-primary" aria-hidden />{role.project.title}</p>
              <Chip
                className={
                  projectState === "recorded"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : projectState === "pending"
                      ? "bg-amber-50 text-amber-800 ring-amber-200"
                      : "bg-muted text-muted-foreground ring-border"
                }
              >
                {PROJECT_STATE[projectState]}
              </Chip>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{role.project.brief}</p>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requirements</p>
                <ul className="mt-2 space-y-1.5 text-sm">{role.project.requirements.map((r) => <li key={r}>• {r}</li>)}</ul>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Skills this evidences</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {role.project.skillIds.map((s) => <Chip key={s} className="bg-background ring-border">{skillName(s)}</Chip>)}
                </div>
              </div>
              <div>
                <ProjectForm
                  repoUrl={project?.url ?? ""}
                  liveUrl={project?.detail?.liveUrl ?? ""}
                  demoUrl={project?.detail?.demoUrl ?? ""}
                  submitted={Boolean(project)}
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  We check the repository link is real and public. Projects are not human-reviewed in this version: they satisfy
                  jobs that ask for project evidence and lift the 84% ceiling on the skills they cover, but they never set a level
                  on their own.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function countDone(planDone: Set<string>, skillId: string) {
  return (getPlan(skillId)?.days ?? []).filter((_, i) => planDone.has(`${skillId}:${i}`)).length;
}

function Stat({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon?: typeof Clock }) {
  return (
    <div className="card-soft p-4">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
      <dd className="text-xs text-muted-foreground">{hint}</dd>
    </div>
  );
}

function SkillPlanCard({ action, skill, daysDone }: { action: NextAction; skill: SkillReadiness; daysDone: number }) {
  const days = getPlan(skill.skillId)?.days ?? [];
  const minutes = days.reduce((n, d) => n + d.minutes, 0);
  const dimension = getSkill(skill.skillId).dimension;

  return (
    <article className="card-soft flex h-full flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold">{skill.name}</h3>
        <Chip className={skill.priority === "critical" ? "bg-rose-50 text-rose-700 ring-rose-200" : skill.priority === "important" ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-muted text-muted-foreground ring-border"}>
          {PRIORITY_LABELS[skill.priority]}
        </Chip>
      </div>

      <p className="mt-2 flex items-baseline gap-1.5 text-sm">
        <span className="text-2xl font-semibold tabular-nums">{skill.level}%</span>
        <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />
        <span className="font-medium tabular-nums">{skill.target}%</span>
        <span className="text-muted-foreground">target</span>
      </p>
      <div className="mt-2"><LevelBar level={skill.level} target={skill.target} status={skill.status} label={skill.name} /></div>

      <ul className="mt-3 flex-1 space-y-1 text-sm text-muted-foreground">
        {action.impact ? (
          <li className="flex gap-2 text-emerald-700">
            <TrendingUp className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Worth +{action.impact.deltaScore} readiness
            {action.impact.unlockedJobIds.length ? `, unlocks ${action.impact.unlockedJobIds.length} ${action.impact.unlockedJobIds.length === 1 ? "opportunity" : "opportunities"}` : ""}
          </li>
        ) : null}
        {action.blocksJobs ? (
          <li className="flex gap-2">
            <Target className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Blocks {action.blocksJobs} {action.blocksJobs === 1 ? "opportunity" : "opportunities"}
          </li>
        ) : null}
        {days.length ? (
          <li className="flex gap-2">
            <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {days.length}-day plan · ~{Math.round(minutes / 60)}h · {daysDone}/{days.length} practised
          </li>
        ) : null}
        {dimension !== "technical" ? (
          <li className="flex gap-2">
            <MessageSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Also rehearsable in <Link href="/practice" className="text-primary hover:underline">interview practice</Link>
          </li>
        ) : null}
      </ul>

      {days.length && daysDone > 0 ? (
        <div className="mt-3 h-1.5 rounded-full bg-muted" role="meter" aria-valuemin={0} aria-valuemax={days.length} aria-valuenow={daysDone} aria-label={`${skill.name} plan progress`}>
          <div className="h-full rounded-full bg-primary/60" style={{ width: `${(daysDone / days.length) * 100}%` }} />
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link href={action.href} className={cn(buttonVariants({ variant: "secondary" }), "h-9 flex-1 min-w-[140px]")}>
          {action.action.replace(/^Start \d+-day /, "Open ").replace(/ plan$/, " plan")}
        </Link>
        <Link href={`/assessment/skill:${skill.skillId}`} className="text-sm font-medium text-primary hover:underline">
          Prove it →
        </Link>
      </div>
    </article>
  );
}
