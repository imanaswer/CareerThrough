import { FileCheck2, FolderGit2, FileText, CheckCircle2 } from "lucide-react";
import type { EvidenceItem } from "@/lib/readiness";
import { shortDate } from "@/lib/format";
import { Verified } from "./bits";

const SOURCE: Record<string, string> = { baseline: "Baseline assessment", skill: "Skill assessment", final: "Final verification", resume: "Resume claim", project: "Project" };

export function EvidenceLine({ e }: { e: EvidenceItem }) {
  const Icon = e.type === "assessment" ? FileCheck2 : e.type === "project" ? FolderGit2 : FileText;
  return (
    <li className="group flex gap-4 rounded-[1.25rem] border border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:hover:bg-white/10 backdrop-blur-sm">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 ring-1 ring-primary/20 shadow-inner">
        <Icon className="size-5 text-primary" aria-hidden />
      </div>
      <div className="min-w-0 space-y-2 flex-1 pt-0.5">
        <p className="font-bold text-[15px] sm:text-base text-foreground dark:text-white">
          {SOURCE[e.source] ?? e.source}
          {e.score !== null && e.type === "assessment" ? <span className="ml-2 font-bold text-primary tabular-nums">{Math.round(e.score)}%</span> : ""}
          {e.detail?.correct != null ? <span className="ml-2 text-sm font-medium text-muted-foreground">({e.detail.correct}/{e.detail.total} correct)</span> : ""}
        </p>
        <p className="text-xs font-medium text-muted-foreground/80 dark:text-white/60">
          {shortDate(e.createdAt)} · confidence {e.confidence.replace("_", " ")}
          {e.expiresAt ? ` · valid until ${shortDate(e.expiresAt)}` : ""}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-1">
          {e.type === "assessment" ? <Verified verified={e.verified} /> : null}
          {e.type === "resume_claim" ? <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">Self-reported. Capped at 30%</span> : null}
        </div>
        
        {e.type === "project" ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-background/50 border p-2.5 text-xs">
            <a href={e.url ?? "#"} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-primary hover:underline truncate max-w-[200px]">{e.url}</a>
            <span className="text-muted-foreground/50">|</span>
            <span className="flex items-center gap-1 font-medium text-muted-foreground">
              {e.detail?.status === "recorded" ? <><CheckCircle2 className="size-3.5 text-emerald-500" /> link validated</> : "validation pending"}
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="font-medium text-muted-foreground">not human-reviewed</span>
          </div>
        ) : null}
      </div>
    </li>
  );
}
