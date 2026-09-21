import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import { BriefcaseBusiness, Code2, FolderGit2, GraduationCap, Mail, Target, User } from "lucide-react";
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
        <Link href="/onboarding" className={cn(buttonVariants({ variant: "outline" }), "h-9 px-5 rounded-full font-bold shadow-sm hover:shadow-md transition-all")}>Edit profile</Link>
      </PageHeader>
      
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <Panel title="Identity & Target">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.1)] ring-1 ring-primary/20">
              <User className="size-6" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground/90">{profile.name}</p>
              <p className="mt-1 font-medium text-muted-foreground">{r?.headline || "Add a headline in edit profile"}</p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-4 shadow-sm">
            <Mail className="size-5 shrink-0 text-muted-foreground/70" aria-hidden />
            <p className="text-sm font-medium text-foreground/80">{profile.email}</p>
          </div>
          
          <div className="mt-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-5 shadow-[inset_0_1px_2px_rgb(255,255,255,0.4)] relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-xl transition-transform duration-700 group-hover:scale-150" aria-hidden />
            <div className="relative z-10">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary/80">
                <Target className="size-3.5" aria-hidden /> Target Role
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xl font-bold text-primary">{role.title}</p>
                <Link href="/#roles" className="rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/30">
                  Change role
                </Link>
              </div>
              <p className="mt-3 text-xs font-medium text-primary/70">
                Changing role keeps your evidence. Shared skills carry over and readiness is recalculated automatically.
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Skills you listed">
          <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <Code2 className="size-4" aria-hidden /> Self-reported claims
          </div>
          {r?.skills.length ? (
            <div className="flex flex-wrap gap-2">
              {r.skills.map((s) => (
                <Chip key={s} className="bg-white/60 px-3 py-1.5 text-sm font-bold text-foreground/80 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:text-white dark:ring-white/20 transition-transform hover:-translate-y-0.5">
                  {s}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">None listed.</p>
          )}
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Listed skills are claims, capped at 30% readiness until verified by assessments.
            </p>
          </div>
        </Panel>

        <Panel title="Education">
          {r?.education.length ? (
            <div className="space-y-4">
              {r.education.map((e, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl border border-foreground/5 bg-white/40 p-5 shadow-sm transition-colors hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10">
                  <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <GraduationCap className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground/90">{e.institution}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground/80">
                      <span>{e.degree}</span>
                      <span className="size-1.5 rounded-full bg-foreground/20" />
                      <span>{e.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">Nothing added.</p>
          )}
        </Panel>

        <Panel title="Experience & Projects">
          <div className="space-y-4">
            {r?.experience.map((e, i) => (
              <div key={`e${i}`} className="flex items-start gap-4 rounded-2xl border border-foreground/5 bg-white/40 p-5 shadow-sm transition-colors hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <BriefcaseBusiness className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground/90">{e.title || "Role"}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground/80">
                    <span>{e.company}</span>
                    <span className="size-1.5 rounded-full bg-foreground/20" />
                    <span>{e.period}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {r?.projects.map((p, i) => (
              <div key={`p${i}`} className="flex items-start gap-4 rounded-2xl border border-foreground/5 bg-white/40 p-5 shadow-sm transition-colors hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <FolderGit2 className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground/90">{p.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    <span>Project</span>
                  </div>
                </div>
              </div>
            ))}

            {!r?.experience.length && !r?.projects.length ? (
              <p className="text-sm font-medium text-muted-foreground">Nothing added.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
