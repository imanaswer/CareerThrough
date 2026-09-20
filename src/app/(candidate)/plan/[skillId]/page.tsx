import { LinkArrow, SubmitButton } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, SkipForward } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Chip, PageHeader } from "@/components/bits";
import { SkillCard } from "@/components/skill-card";
import { getPlan } from "@/content/plans";
import { getSkill } from "@/content/skills";
import { getCandidateState, requireCandidate } from "@/lib/data";
import { completePlanDay } from "../../../actions";

export const metadata: Metadata = { title: "Skill plan" };

export default async function SkillPlanPage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params;
  const { user, profile, role } = await requireCandidate();
  const plan = getPlan(skillId);
  if (!plan || !role.skills.some((s) => s.skillId === skillId)) notFound();
  const skill = getSkill(skillId);
  const { readiness, evidence, completed, planDone } = await getCandidateState(user.id, profile, role);
  const level = readiness.perSkill.find((p) => p.skillId === skillId)!;

  // Adaptive: a topic you got fully right in your latest attempt is already demonstrated.
  const latest = completed.find((a) => a.score?.bySkill[skillId]);
  const topics = latest?.score?.bySkill[skillId]?.topics ?? {};
  const demonstrated = (topicId: string | null) => Boolean(topicId && topics[topicId] && topics[topicId].correct === topics[topicId].total);
  const needed = plan.days.filter((d) => !demonstrated(d.topicId));
  const minutes = needed.reduce((s, d) => s + d.minutes, 0);

  return (
    <>
      <PageHeader title={`${skill.name} — ${needed.length}-day plan`} subtitle={`Do what you need, not everything. About ${Math.round(minutes / 60)} hours of focused work, then prove it.`}>
        <Link href="/plan" className="text-sm text-muted-foreground hover:text-foreground">← All skills</Link>
      </PageHeader>

      <div className="mb-5"><SkillCard skill={level} evidence={evidence} formulaVersion={readiness.formulaVersion} /></div>

      <ol className="space-y-4">
        {plan.days.map((day, i) => {
          const skip = demonstrated(day.topicId);
          const done = planDone.has(`${skillId}:${i}`);
          const t = day.topicId ? topics[day.topicId] : undefined;
          return (
            <li key={i} className={cn("card-soft p-5", skip && "opacity-70")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Day {i + 1}{day.topicId ? "" : " · Practical challenge"}</p>
                <div className="flex items-center gap-2">
                  {t ? <Chip className="bg-background text-muted-foreground ring-border">Last attempt: {t.correct}/{t.total} on this topic</Chip> : null}
                  {skip ? <Chip className="bg-emerald-50 text-emerald-700 ring-emerald-200"><SkipForward className="size-3" aria-hidden />Already demonstrated — skip</Chip> : done ? <Chip className="bg-secondary text-secondary-foreground ring-transparent"><Check className="size-3" aria-hidden />Practised</Chip> : null}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" aria-hidden />{day.minutes} min</span>
                </div>
              </div>
              <h2 className="mt-2 font-semibold">{day.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{day.summary}</p>
              {!skip ? (
                <>
                  <ul className="mt-3 space-y-1 text-sm">{day.learn.map((l) => <li key={l}>• {l}</li>)}</ul>
                  <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm"><span className="font-medium">Practice: </span>{day.practice}</p>
                  {!done ? (
                    <form action={completePlanDay} className="mt-3">
                      <input type="hidden" name="skillId" value={skillId} /><input type="hidden" name="day" value={i} />
                      <SubmitButton variant="outline" size="sm" pendingLabel="Saving…">Mark as practised</SubmitButton>
                    </form>
                  ) : null}
                </>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="surface-hero mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <p className="font-semibold">Final step: prove it</p>
          <p className="mt-1 max-w-xl text-sm text-white/85">Marking days as practised tracks your effort — it does not change your readiness. Only the {skill.name} assessment does. You need {level.target}%.</p>
        </div>
        <Link href={`/assessment/skill:${skillId}`} className={cn(buttonVariants(), "h-10 bg-white px-5 text-primary hover:bg-white/90")}>Take the assessment <LinkArrow /></Link>
      </div>
    </>
  );
}
