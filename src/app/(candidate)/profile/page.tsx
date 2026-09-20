import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Chip, PageHeader, Panel } from "@/components/bits";
import { requireCandidate } from "@/lib/data";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { profile, role } = await requireCandidate();
  const r = profile.resume;
  return (
    <>
      <PageHeader title="Profile" subtitle={`Confirmed ${shortDate(profile.confirmedAt!)}. This is your self-reported starting point — evidence lives on the Evidence page.`}>
        <Link href="/onboarding" className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}>Edit profile</Link>
      </PageHeader>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="About">
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{r?.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Target role</p>
          <p className="mt-1 flex items-center gap-3 font-medium">{role.title}<Link href="/#roles" className="text-xs font-medium text-primary hover:underline">Change role</Link></p>
          <p className="mt-1 text-xs text-muted-foreground">Changing role keeps your evidence. Shared skills carry over and your readiness is recalculated against the new role.</p>
        </Panel>
        <Panel title="Skills you listed">
          {r?.skills.length ? <div className="flex flex-wrap gap-1.5">{r.skills.map((s) => <Chip key={s} className="bg-background ring-border">{s}</Chip>)}</div> : <p className="text-sm text-muted-foreground">None listed.</p>}
          <p className="mt-3 text-xs text-muted-foreground">Listed skills are claims, capped at 30% until assessed.</p>
        </Panel>
        <Panel title="Education">{r?.education.length ? <ul className="space-y-2 text-sm">{r.education.map((e, i) => <li key={i}><span className="font-medium">{e.institution}</span><span className="text-muted-foreground"> · {e.degree} {e.year}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">Nothing added.</p>}</Panel>
        <Panel title="Experience & projects">
          <ul className="space-y-2 text-sm">
            {r?.experience.map((e, i) => <li key={`e${i}`}><span className="font-medium">{e.title || "Role"}</span><span className="text-muted-foreground"> · {e.company} {e.period}</span></li>)}
            {r?.projects.map((p, i) => <li key={`p${i}`}><span className="font-medium">{p.name}</span><span className="text-muted-foreground"> · project</span></li>)}
            {!r?.experience.length && !r?.projects.length ? <li className="text-muted-foreground">Nothing added.</li> : null}
          </ul>
        </Panel>
      </div>
    </>
  );
}
