import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { Brand } from "@/components/brand";
import { CareerCard } from "@/components/career-card";
import { db, profile } from "@/db";
import { getRole } from "@/content/roles";
import { cardStatus, liveReadiness } from "@/lib/data";

export const metadata: Metadata = { title: "Career Card", robots: { index: false } };

export default async function PublicCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9]{6,32}$/.test(slug)) notFound();
  // Consent is enforced in the query itself: a private card is indistinguishable from a missing one.
  const [p] = await db.select().from(profile).where(and(eq(profile.cardSlug, slug), eq(profile.cardPublic, true))).limit(1);
  if (!p?.targetRoleId) notFound();

  const role = getRole(p.targetRoleId);
  const { readiness, evidence, hasFinal } = await liveReadiness(p.userId, role);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3"><Brand /><span className="text-xs text-muted-foreground">Shared by the candidate</span></div></header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <CareerCard name={p.name} headline={p.resume?.headline} role={role} readiness={readiness} evidence={evidence} status={cardStatus(role, readiness, hasFinal)} />
        <section className="mt-6 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          <h2 className="font-semibold text-foreground">How is this score verified?</h2>
          <p className="mt-2">{readiness.explanation}</p>
          <ul className="mt-3 space-y-1">
            <li>• Skill levels come from timed, server-scored assessments with tab switches recorded — verified and tamper-resistant, not proctored.</li>
            <li>• A level is always the candidate&apos;s most recent assessed result, not their best. Self-reported skills are capped at 30% and labelled unverified.</li>
            <li>• Projects are link-validated but not human-reviewed. AI is not used to score or rank candidates.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
