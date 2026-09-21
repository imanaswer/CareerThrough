import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Mic, Users } from "lucide-react";
import { cn } from "cn";
import { PageHeader } from "@/components/bits";
import { promptsForRole, promptsForSkill } from "@/content/interview";
import { getSkill } from "@/content/skills";
import type { InterviewPrompt } from "@/content/taxonomy";
import { getCandidateState, requireCandidate } from "@/lib/data";
import { interviewScoringAvailable } from "@/lib/interview/provider";
import { PracticeClient, type PracticePrompt } from "./practice-client";
import { PracticeCall } from "./call";

export const metadata: Metadata = { title: "Interview practice" };

const KIND_LABEL = { behavioural: "Behavioural", technical: "Technical", situational: "Situational" };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ set?: string; mode?: string }> }) {
  const { set, mode } = await searchParams;
  const { user, profile, role } = await requireCandidate();
  const { readiness } = await getCandidateState(user.id, profile, role);

  // Sets: the role's own interview, plus one per role skill so you can rehearse a weak area.
  const weakest = [...readiness.perSkill].filter((p) => p.gap < 0).sort((a, b) => a.level / a.target - b.level / b.target);
  const sets = [
    { id: "role", label: `${role.title} interview`, hint: "Behavioural and situational — the questions every interview opens with." },
    ...role.skills.map((s) => ({ id: s.skillId, label: getSkill(s.skillId).name, hint: `Technical questions on ${getSkill(s.skillId).name}.` })),
  ];
  const active = sets.find((s) => s.id === set) ?? sets[0];
  const source: InterviewPrompt[] = active.id === "role" ? promptsForRole(role.id) : promptsForSkill(active.id);

  const prompts: PracticePrompt[] = source.map((p) => ({
    id: p.id,
    kind: p.kind,
    depth: p.depth,
    prompt: p.prompt,
    context: p.context,
    lookFor: p.lookFor,
    minWords: p.minWords,
    label: `${KIND_LABEL[p.kind]} · ${p.depth === 1 ? "warm-up" : p.depth === 2 ? "core" : "probing"}`,
  }));

  return (
    <>
      <PageHeader
        title="Interview practice"
        subtitle="A real conversation: the interviewer greets you, asks about your background, and digs into whatever you gloss over. Answer out loud or type. Nothing here counts as evidence, so you can be bad at it first."
      />

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
        <div className="card-soft p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Users className="size-4 text-primary" aria-hidden />Soft skills</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Communication and workplace judgement are scored skills for {role.title}. Practise them here, then prove them in an assessment.
          </p>
          <Link href="/plan#confidence" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Open the confidence track →</Link>
        </div>
        <div className="card-soft p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4 text-primary" aria-hidden />Weakest first</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {weakest.length ? `Your thinnest skill right now is ${weakest[0].name} (${weakest[0].level}% of ${weakest[0].target}%).` : "Every skill meets its target — rehearse the role interview."}
          </p>
          {weakest.length ? (
            <Link href={`/practice?set=${weakest[0].skillId}`} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Practise {weakest[0].name} questions →
            </Link>
          ) : null}
        </div>
        <div className="card-soft p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Mic className="size-4 text-primary" aria-hidden />The scored one</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {interviewScoringAvailable()
              ? "Every assessment ends with a scored interview against a fixed rubric."
              : "Every assessment ends with interview questions. They are recorded now and scored once evaluation is connected."}
          </p>
          <Link href="/assessments" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Go to assessments →</Link>
        </div>
      </div>

      <nav aria-label="Question sets" className="mb-5 flex flex-wrap gap-2">
        {sets.map((s) => (
          <Link
            key={s.id}
            href={s.id === "role" ? "/practice" : `/practice?set=${s.id}`}
            aria-current={s.id === active.id ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              s.id === active.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted",
            )}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {mode === "written" ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Written practice — one question at a time, with feedback after each.{" "}
            <Link href={active.id === "role" ? "/practice" : `/practice?set=${active.id}`} className="font-medium text-primary hover:underline">
              Switch to the spoken interview →
            </Link>
          </p>
          {prompts.length ? <PracticeClient key={active.id} prompts={prompts} /> : null}
        </>
      ) : prompts.length ? (
        <>
          <PracticeCall
            key={active.id}
            setId={active.id}
            title="Interviewer"
            subtitle={`Career Through · ${active.label} · practice, not recorded`}
            durationMin={12}
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Answer out loud, or{" "}
            <Link href={`/practice?${active.id === "role" ? "" : `set=${active.id}&`}mode=written`} className="font-medium text-primary hover:underline">
              practise in writing instead
            </Link>
            .
          </p>
        </>
      ) : (
        <p className="rounded-2xl border bg-muted/40 p-6 text-sm text-muted-foreground">No practice questions for this set yet.</p>
      )}
    </>
  );
}
