"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, ChevronDown, FileUp, Loader2, Plus, Sparkles, Trash2, TriangleAlert } from "lucide-react";
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
const FIELDS: Record<ListKey, { key: string; label: string; long?: boolean; type?: string }[]> = {
  education: [{ key: "institution", label: "Institution" }, { key: "degree", label: "Degree" }, { key: "year", label: "Year", type: "year" }],
  experience: [{ key: "company", label: "Company" }, { key: "title", label: "Title" }, { key: "period", label: "Period", type: "period" }, { key: "summary", label: "Description", long: true }],
  projects: [{ key: "name", label: "Project name" }, { key: "url", label: "Link" }, { key: "description", label: "Description", long: true }],
};
const lines = (s: string) => s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);

function YearSelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + 10 - i);
  return (
    <div className="relative w-full">
      <button type="button" onClick={() => setOpen(!open)} className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        {value || <span className="text-muted-foreground">Select year</span>}
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-auto rounded-md border border-border bg-card shadow-xl animate-in fade-in-0 zoom-in-95">
            {years.map((y) => (
              <button key={y} type="button" onClick={() => { onChange(y.toString()); setOpen(false); }} className="relative flex w-full cursor-pointer select-none items-center py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted text-card-foreground">
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-primary">
                  {value === y.toString() && <Check className="h-4 w-4" />}
                </span>
                {y}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const parseMonthYear = (str: string) => {
  const months: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
  const dMatch = str.match(/(\d{4})-(\d{2})/);
  if (dMatch) return dMatch[0];
  const mMatch = str.toLowerCase().match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})/);
  if (mMatch) return `${mMatch[2]}-${months[mMatch[1]]}`;
  return "";
};

function CustomMonthPicker({ value, max, disabled, onChange }: { value: string, max?: string, disabled?: boolean, onChange: (v: string) => void }) {
  let formatted = "Select";
  if (value) {
    const [year, month] = value.split("-");
    if (year && month) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      formatted = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
    }
  }

  return (
    <div className={`relative flex h-11 flex-1 min-w-0 items-center justify-between rounded-lg border border-input bg-background/50 px-2.5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <span className={`text-sm tracking-tight truncate ${value ? "text-foreground" : "text-muted-foreground"}`}>{formatted}</span>
      <Calendar className="size-4 shrink-0 opacity-50 ml-1" />
      <input
        type="month"
        value={value}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            if ("showPicker" in e.target) {
              (e.target as HTMLInputElement).showPicker();
            }
          } catch (err) {}
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function PeriodSelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const parts = value.split(/ to | - | – /);
  const start = parseMonthYear(parts[0] || value);
  const end = parts.length > 1 ? parseMonthYear(parts[1]) : "";
  const isPresent = value.toLowerCase().includes("present") || value.toLowerCase().includes("current");

  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CustomMonthPicker
          value={start}
          max={currentMonthYear}
          onChange={(newStart) => onChange(newStart + (isPresent ? " to Present" : (end ? ` to ${end}` : "")))}
        />
        <span className="text-muted-foreground text-xs font-medium">to</span>
        <CustomMonthPicker
          value={isPresent ? currentMonthYear : end}
          max={currentMonthYear}
          disabled={isPresent}
          onChange={(newEnd) => onChange((start ? `${start} to ` : "") + newEnd)}
        />
      </div>
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
        <input type="checkbox" checked={isPresent} onChange={(e) => {
          if (e.target.checked) {
            onChange(`${start} to Present`);
          } else {
            onChange(`${start} to ${end}`);
          }
        }} className="h-4 w-4 rounded border-foreground/20 text-primary focus:ring-primary bg-background/50" />
        I currently work here
      </label>
    </div>
  );
}

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

      {(Object.keys(FIELDS) as ListKey[]).map((key, sectionIndex) => (
        <section key={key} className="card-soft relative space-y-4 p-6 sm:p-8" style={{ zIndex: 30 - sectionIndex }}>
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <h2 className="text-lg font-medium capitalize text-foreground">{key}</h2>
            <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg" onClick={() => setResume((r) => ({ ...r, [key]: [...r[key], BLANK[key]] }))}><Plus className="mr-1.5 size-4" aria-hidden /> Add</Button>
          </div>
          {resume[key].length === 0 ? <p className="text-sm text-muted-foreground/70 py-2">Nothing added. That&apos;s fine — add {key} if you have any.</p> : null}
          <div className="space-y-4">
            {resume[key].map((row, i) => {
              const colsClass = key === "experience" ? "sm:grid-cols-4" : key === "projects" ? "sm:grid-cols-2" : "sm:grid-cols-3";
              return (
                <div key={i} className={`group relative grid gap-5 rounded-2xl border border-foreground/10 bg-background/30 p-5 transition-colors hover:border-foreground/20 ${colsClass}`}>
                  {FIELDS[key].map((f) => {
                    const id = `${key}-${i}-${f.key}`;
                    const value = (row as Record<string, string>)[f.key] ?? "";
                    
                    const spanClass = f.long ? (key === "experience" ? "sm:col-span-4" : key === "projects" ? "sm:col-span-2" : "sm:col-span-3") : f.key === "period" ? "sm:col-span-2" : "sm:col-span-1";
                    
                    return (
                      <div key={f.key} className={`space-y-2 ${spanClass}`}>
                        <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{f.label}</Label>
                        {f.long ? (
                          <Textarea id={id} rows={4} value={value} onChange={(e) => setList(key, i, f.key, e.target.value)} className="bg-background/50 resize-y" />
                        ) : f.type === "year" ? (
                          <YearSelect value={value} onChange={(v) => setList(key, i, f.key, v)} />
                        ) : f.type === "period" ? (
                          <PeriodSelect value={value} onChange={(v) => setList(key, i, f.key, v)} />
                        ) : (
                          <Input id={id} value={value} onChange={(e) => setList(key, i, f.key, e.target.value)} className="h-11 bg-background/50" />
                        )}
                      </div>
                    );
                  })}
                  <div className={`flex justify-end pt-2 border-t border-foreground/5 ${key === "experience" ? "sm:col-span-4" : key === "projects" ? "sm:col-span-2" : "sm:col-span-3"}`}>
                    <Button type="button" variant="ghost" size="sm" className="h-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => setResume((r) => ({ ...r, [key]: r[key].filter((_, j) => j !== i) }))}>
                      <Trash2 className="mr-1.5 size-4" aria-hidden /> Remove
                    </Button>
                  </div>
                </div>
              );
            })}
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
