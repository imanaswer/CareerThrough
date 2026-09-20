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
      <div role="status" className="card-soft mt-8 flex flex-col items-center p-12 text-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
        <p className="mt-4 font-medium">Reading your resume…</p>
        <p className="mt-1 text-sm text-muted-foreground">This takes up to 30 seconds. You&apos;ll review everything before it&apos;s saved.</p>
      </div>
    );
  }

  if (step === "upload") {
    return (
      <div className="mt-8 space-y-4">
        {error ? (
          <p role="alert" className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />{error}
          </p>
        ) : null}
        <div className="card-soft flex flex-col items-center p-10 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary"><FileUp className="size-5" aria-hidden /></span>
          <p className="mt-4 font-medium">Upload your resume (PDF, up to 5 MB)</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">AI reads it to pre-fill your profile. It&apos;s a draft — nothing is saved until you confirm it.</p>
          <input ref={fileRef} type="file" accept="application/pdf" className="sr-only" aria-label="Resume PDF" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <Button className="mt-5 h-10 px-5" onClick={() => fileRef.current?.click()}>Choose PDF</Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          No resume handy?{" "}
          <button className="font-medium text-primary hover:underline" onClick={() => { setError(null); setStep("review"); }}>Fill in your profile manually</button>
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
      {parsed ? (
        <p className="flex gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
          <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
          We pre-filled this from your resume. AI can misread things — please check and correct it. Only what you confirm is used.
        </p>
      ) : null}

      <section className="card-soft space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" required value={resume.name} onChange={(e) => setResume({ ...resume, name: e.target.value })} className="h-10" /></div>
          <div className="space-y-1.5"><Label htmlFor="headline">Headline</Label><Input id="headline" placeholder="e.g. Final-year B.Tech student" value={resume.headline} onChange={(e) => setResume({ ...resume, headline: e.target.value })} className="h-10" /></div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="skills">Skills (comma or line separated)</Label>
          <Textarea id="skills" rows={3} value={resume.skills.join(", ")} onChange={(e) => setResume({ ...resume, skills: lines(e.target.value) })} />
          <p className="text-xs text-muted-foreground">Listing a skill creates a capped, low-confidence claim. Assessments replace it with verified evidence.</p>
        </div>
      </section>

      {(Object.keys(FIELDS) as ListKey[]).map((key) => (
        <section key={key} className="card-soft space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold capitalize">{key}</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setResume((r) => ({ ...r, [key]: [...r[key], BLANK[key]] }))}><Plus aria-hidden /> Add</Button>
          </div>
          {resume[key].length === 0 ? <p className="text-sm text-muted-foreground">Nothing added. That&apos;s fine — add {key} if you have any.</p> : null}
          {resume[key].map((row, i) => (
            <div key={i} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-3">
              {FIELDS[key].map((f) => {
                const id = `${key}-${i}-${f.key}`;
                const value = (row as Record<string, string>)[f.key] ?? "";
                return (
                  <div key={f.key} className={f.long ? "space-y-1.5 sm:col-span-3" : "space-y-1.5"}>
                    <Label htmlFor={id} className="text-xs">{f.label}</Label>
                    {f.long ? <Textarea id={id} rows={2} value={value} onChange={(e) => setList(key, i, f.key, e.target.value)} /> : <Input id={id} value={value} onChange={(e) => setList(key, i, f.key, e.target.value)} />}
                  </div>
                );
              })}
              <Button type="button" variant="ghost" size="sm" className="justify-self-start text-muted-foreground" onClick={() => setResume((r) => ({ ...r, [key]: r[key].filter((_, j) => j !== i) }))}>
                <Trash2 aria-hidden /> Remove
              </Button>
            </div>
          ))}
        </section>
      ))}

      <section className="card-soft grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-1.5"><Label htmlFor="certs">Certifications (one per line)</Label><Textarea id="certs" rows={3} value={resume.certifications.join("\n")} onChange={(e) => setResume({ ...resume, certifications: lines(e.target.value) })} /></div>
        <div className="space-y-1.5"><Label htmlFor="links">Links (GitHub, LinkedIn, portfolio)</Label><Textarea id="links" rows={3} value={resume.links.join("\n")} onChange={(e) => setResume({ ...resume, links: lines(e.target.value) })} /></div>
      </section>

      {error ? <p role="alert" className="text-sm text-rose-600">{error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setStep("upload")}>← Upload a different resume</button>
        <Button type="submit" disabled={saving} className="h-10 px-5">{saving ? <Spinner /> : null}
        {saving ? "Saving…" : hasExisting ? "Confirm changes" : "Confirm profile and continue to baseline"}</Button>
      </div>
    </form>
  );
}
