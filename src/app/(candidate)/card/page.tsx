import { SubmitButton } from "@/components/pending";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Check, Circle, Eye, EyeOff } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/bits";
import { CareerCard } from "@/components/career-card";
import { ReadinessWhy } from "@/components/readiness-why";
import { ReadinessTrend } from "@/components/charts";
import { CONTENT_VERSION } from "@/content/version";
import { cardStatus, getCandidateState, requireCandidate } from "@/lib/data";
import { setCardVisibility } from "../../actions";

export const metadata: Metadata = { title: "Career Card" };

export default async function CardPage() {
  const { user, profile, role } = await requireCandidate();
  const { readiness, evidence, hasFinal, hasProject, snapshots, baselineDone } = await getCandidateState(user.id, profile, role);
  const status = cardStatus(role, readiness, hasFinal);

  if (!profile.cardSlug) {
    const steps = [
      { done: baselineDone, label: "Complete the baseline assessment", href: "/assessments" },
      { done: baselineDone && readiness.gaps.critical.length === 0, label: `Close all critical gaps (${readiness.gaps.critical.length} remaining)`, href: "/plan" },
      { done: readiness.score >= role.readyThreshold, label: `Reach ${role.readyThreshold}% readiness for ${role.title} (now ${readiness.score}%)`, href: "/dashboard" },
      { done: hasProject, label: "Submit your role project (recommended — some jobs require it)", href: "/plan#project" },
      { done: hasFinal, label: "Pass the final verification", href: "/assessments" },
    ];
    return (
      <>
        <PageHeader title="Career Card" subtitle="Your Career Card is proof, so it is only issued once the evidence exists. Here is what's left." />
        <Panel title="Requirements">
          <ul className="space-y-3">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-sm">
                {s.done ? <Check className="size-4 text-emerald-600" aria-label="Done" /> : <Circle className="size-4 text-muted-foreground" aria-label="To do" />}
                {s.done ? <span className="text-muted-foreground line-through">{s.label}</span> : <Link href={s.href} className="font-medium hover:text-primary hover:underline">{s.label}</Link>}
              </li>
            ))}
          </ul>
        </Panel>
        <h2 className="mb-3 mt-8 text-sm font-semibold text-muted-foreground">Preview — private, not shareable yet</h2>
        <div className="pointer-events-none select-none opacity-60" aria-hidden><CareerCard name={profile.name} headline={profile.resume?.headline} role={role} readiness={readiness} evidence={evidence} status={status} /></div>
      </>
    );
  }

  const h = await headers();
  const url = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}/c/${profile.cardSlug}`;

  return (
    <>
      <PageHeader title="Career Card" subtitle="Your verified career identity. It updates as your evidence does.">
        <ReadinessWhy role={role} readiness={readiness} contentVersion={CONTENT_VERSION} label="How is this score verified?" />
      </PageHeader>

      <Panel className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {profile.cardPublic ? <Eye className="mt-0.5 size-5 text-emerald-600" aria-hidden /> : <EyeOff className="mt-0.5 size-5 text-muted-foreground" aria-hidden />}
            <div>
              <p className="font-medium">{profile.cardPublic ? "Public — anyone with the link can view this card" : "Private — only you can see this card"}</p>
              <p className="text-sm text-muted-foreground">{profile.cardPublic ? <a href={url} className="break-all text-primary hover:underline">{url}</a> : "You decide if and when it's shared. You can switch it off again at any time."}</p>
            </div>
          </div>
          <form action={setCardVisibility}>
            <input type="hidden" name="public" value={String(!profile.cardPublic)} />
            <SubmitButton variant={profile.cardPublic ? "outline" : "default"} className="h-9 px-4" pendingLabel="Updating…">{profile.cardPublic ? "Make private" : "Make public and get link"}</SubmitButton>
          </form>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">The public card shows your name, headline, role, readiness, skill levels, evidence confidence and project link. It never shows your email, resume file or assessment answers.</p>
      </Panel>

      <CareerCard name={profile.name} headline={profile.resume?.headline} role={role} readiness={readiness} evidence={evidence} status={status} />

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        <Panel title="Readiness history"><ReadinessTrend data={snapshots.map((s) => ({ date: new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), score: s.score }))} /></Panel>
        <Panel title="Keep it current">
          <p className="text-sm text-muted-foreground">Assessed evidence is valid for 12 months. Re-verify skills to keep your card fresh, and keep closing gaps — recruiters see the date each skill was last verified.</p>
          <Link href="/evidence" className={cn(buttonVariants({ variant: "secondary" }), "mt-4 h-9 px-4")}>View all evidence</Link>
        </Panel>
      </div>
    </>
  );
}
