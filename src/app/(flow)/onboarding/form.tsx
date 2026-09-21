"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, Plus, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/pending";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeData } from "@/lib/resume-schema";
import { confirmProfile } from "../../actions";

type Step = "upload" | "parsing" | "review";
type ListKey = "education" | "experience" | "projects";

const BLANK = {
  education: { institution: "", degree: "", year: "" },
  experience: { company: "", title: "", period: "", summary: "" },
  projects: { name: "", description: "", url: "" },
};
const FIELDS: Record<ListKey, { key: string; label: string; long?: boolean }[]> = {
  education: [{ key: "institution", label: "Institution" }, { key: "degree", label: "Degree" }, { key: "year", label: "Year" }],
  experience: [{ key: "company", label: "Company" }, { key: "title", label: "Title" }, { key: "period", label: "Period" }, { key: "summary", label: "What you did", long: true }],
  projects: [{ key: "name", label: "Project name" }, { key: "url", label: "Link" }, { key: "description", label: "Description", long: true }],
};
const lines = (s: string) => s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);

export function OnboardingForm({ initial, hasExisting, baselineHref }: { initial: ResumeData; hasExisting: boolean; baselineHref: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(hasExisting ? "review" : "upload");
  const [resume, setResume] = useState<ResumeData>(initial);
  const [parsed, setParsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  // Local state for textareas to prevent losing trailing delimiters
  const [skillsText, setSkillsText] = useState(initial.skills.join(", "));
  const [certsText, setCertsText] = useState(initial.certifications.join("\n"));
  const [linksText, setLinksText] = useState(initial.links.join("\n"));

  async function upload(file: File) {
    setError(null);
    setStep("parsing");
    const body = new FormData();
    body.set("file", file);
    try {
      const res = await fetch("/api/resume/parse", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResume(json.resume);
      setSkillsText(json.resume.skills.join(", "));
      setCertsText(json.resume.certifications.join("\n"));
      setLinksText(json.resume.links.join("\n"));
      setParsed(true);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "We couldn't reach the server. Check your connection, or fill in your profile manually.");
      setStep("upload");
    }
  }

  function save() {
    setError(null);
    const clean: ResumeData = {
      ...resume,
      skills: lines(skillsText),
      certifications: lines(certsText),
      links: lines(linksText),
      education: resume.education.filter((e) => e.institution.trim()),
      experience: resume.experience.filter((e) => e.company.trim()),
      projects: resume.projects.filter((p) => p.name.trim()),
    };
    startSaving(async () => {
      const result = await confirmProfile(clean);
      if ("error" in result) setError(result.error);
      else router.push(hasExisting ? "/profile" : baselineHref);
    });
  }

  const setList = (key: ListKey, i: number, field: string, value: string) =>
    setResume((r) => ({ ...r, [key]: r[key].map((row, j) => (j === i ? { ...row, [field]: value } : row)) }));

  if (step === "parsing") {
    return (
      <div role="status" className="card-soft relative mt-8 flex flex-col items-center justify-center overflow-hidden p-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT/0.1),transparent_50%)] animate-pulse" />
        <Loader2 className="relative z-10 size-10 animate-spin text-primary" aria-hidden />
        <h3 className="relative z-10 mt-6 text-xl font-medium text-foreground">Analyzing document...</h3>
        <p className="relative z-10 mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          This takes up to 30 seconds. We're extracting your experience and mapping it to skills. You'll review everything before it's saved.
        </p>
      </div>
    );
  }

  if (step === "upload") {
    return (
      <div className="mt-8 space-y-6">
        {error ? (
          <p role="alert" className="flex gap-2 rounded-xl border border-rose-200/50 bg-rose-50/50 p-4 text-sm text-rose-800 backdrop-blur-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />{error}
          </p>
        ) : null}
        <div className="card-soft group relative flex flex-col items-center justify-center p-12 text-center transition-all duration-300 hover:border-primary/20 hover:bg-foreground/[0.03]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-foreground/5 text-primary shadow-sm ring-1 ring-inset ring-foreground/10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:bg-primary/10">
              <FileUp className="size-6" aria-hidden />
            </span>
            <h3 className="mt-6 text-xl font-medium text-foreground">Upload your resume</h3>
            <p className="mt-2 text-sm text-muted-foreground">PDF format, up to 5 MB</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
              AI will extract your experience to pre-fill your profile. It&apos;s just a draft — nothing is saved without your approval.
            </p>
            <input ref={fileRef} type="file" accept="application/pdf" className="sr-only" aria-label="Resume PDF" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <Button className="mt-8 h-12 rounded-xl px-8 shadow-lg shadow-primary/25 transition-transform duration-200 hover:-translate-y-0.5" onClick={() => fileRef.current?.click()}>
              Choose PDF
            </Button>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          No resume handy?{" "}
          <button className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary" onClick={() => { setError(null); setStep("review"); }}>
            Fill in your profile manually
          </button>
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
      {parsed ? (
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          <p className="relative z-10 flex gap-3 text-sm text-foreground/90 leading-relaxed">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
              <Sparkles className="size-3.5" aria-hidden />
            </span>
            <span>
              <strong className="font-medium text-foreground">We pre-filled this from your resume.</strong> AI can misread things — please check and correct it. Only what you confirm is used.
            </span>
          </p>
        </div>
      ) : null}

      <section className="card-soft space-y-5 p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" required value={resume.name} onChange={(e) => setResume({ ...resume, name: e.target.value })} className="h-11 bg-background/50" /></div>
          <div className="space-y-2"><Label htmlFor="headline">Headline</Label><Input id="headline" placeholder="e.g. Final-year B.Tech student" value={resume.headline} onChange={(e) => setResume({ ...resume, headline: e.target.value })} className="h-11 bg-background/50" /></div>
        </div>
        <div className="space-y-2 pt-2">
          <Label htmlFor="skills">Skills (comma or line separated)</Label>
          <Textarea id="skills" rows={3} value={skillsText} onChange={(e) => setSkillsText(e.target.value)} className="bg-background/50 resize-y" />
          <p className="text-xs text-muted-foreground">Listing a skill creates a capped, low-confidence claim. Assessments replace it with verified evidence.</p>
        </div>
      </section>

      {(Object.keys(FIELDS) as ListKey[]).map((key) => (
        <section key={key} className="card-soft space-y-4 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <h2 className="text-lg font-medium capitalize text-foreground">{key}</h2>
            <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg" onClick={() => setResume((r) => ({ ...r, [key]: [...r[key], BLANK[key]] }))}><Plus className="mr-1.5 size-4" aria-hidden /> Add</Button>
          </div>
          {resume[key].length === 0 ? <p className="text-sm text-muted-foreground/70 py-2">Nothing added. That&apos;s fine — add {key} if you have any.</p> : null}
          <div className="space-y-4">
            {resume[key].map((row, i) => (
              <div key={i} className="group relative grid gap-5 rounded-2xl border border-foreground/10 bg-background/30 p-5 transition-colors hover:border-foreground/20 sm:grid-cols-3">
                {FIELDS[key].map((f) => {
                  const id = `${key}-${i}-${f.key}`;
                  const value = (row as Record<string, string>)[f.key] ?? "";
                  return (
                    <div key={f.key} className={f.long ? "space-y-2 sm:col-span-3" : "space-y-2"}>
                      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{f.label}</Label>
                      {f.long ? <Textarea id={id} rows={2} value={value} onChange={(e) => setList(key, i, f.key, e.target.value)} className="bg-background/50 resize-y" /> : <Input id={id} value={value} onChange={(e) => setList(key, i, f.key, e.target.value)} className="h-10 bg-background/50" />}
                    </div>
                  );
                })}
                <div className="flex justify-end sm:col-span-3 pt-2 border-t border-foreground/5">
                  <Button type="button" variant="ghost" size="sm" className="h-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => setResume((r) => ({ ...r, [key]: r[key].filter((_, j) => j !== i) }))}>
                    <Trash2 className="mr-1.5 size-4" aria-hidden /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="card-soft grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <div className="space-y-2"><Label htmlFor="certs">Certifications (one per line)</Label><Textarea id="certs" rows={3} value={certsText} onChange={(e) => setCertsText(e.target.value)} className="bg-background/50 resize-y" /></div>
        <div className="space-y-2"><Label htmlFor="links">Links (GitHub, LinkedIn, portfolio)</Label><Textarea id="links" rows={3} value={linksText} onChange={(e) => setLinksText(e.target.value)} className="bg-background/50 resize-y" /></div>
      </section>

      {error ? <p role="alert" className="text-sm text-rose-600">{error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button type="button" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" onClick={() => setStep("upload")}>← Upload a different resume</button>
        <Button type="submit" disabled={saving} className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25 transition-transform duration-200 hover:-translate-y-0.5">{saving ? <Spinner /> : null}
        {saving ? "Saving…" : hasExisting ? "Confirm changes" : "Confirm profile and continue to baseline"}</Button>
      </div>
    </form>
  );
}
