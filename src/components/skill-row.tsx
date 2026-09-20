import { FileCheck2, FolderGit2, FileText } from "lucide-react";
import type { EvidenceItem } from "@/lib/readiness";
import { shortDate } from "@/lib/format";
import { Verified } from "./bits";

const SOURCE: Record<string, string> = { baseline: "Baseline assessment", skill: "Skill assessment", final: "Final verification", resume: "Resume claim", project: "Project" };

export function EvidenceLine({ e }: { e: EvidenceItem }) {
  const Icon = e.type === "assessment" ? FileCheck2 : e.type === "project" ? FolderGit2 : FileText;
  return (
    <li className="flex gap-3 rounded-xl border p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="font-medium">
          {SOURCE[e.source] ?? e.source}
          {e.score !== null && e.type === "assessment" ? ` — ${Math.round(e.score)}%` : ""}
          {e.detail?.correct != null ? ` (${e.detail.correct}/${e.detail.total} correct)` : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          {shortDate(e.createdAt)} · confidence {e.confidence.replace("_", " ")}
          {e.expiresAt ? ` · valid until ${shortDate(e.expiresAt)}` : ""}
        </p>
        {e.type === "assessment" ? <Verified verified={e.verified} /> : null}
        {e.type === "resume_claim" ? <p className="text-xs text-muted-foreground">Self-reported. Capped at 30% until assessed.</p> : null}
        {e.type === "project" ? (
          <p className="truncate text-xs">
            <a href={e.url ?? "#"} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">{e.url}</a>
            <span className="text-muted-foreground"> · {e.detail?.status === "recorded" ? "link validated" : "validation pending"} · not human-reviewed</span>
          </p>
        ) : null}
      </div>
    </li>
  );
}
