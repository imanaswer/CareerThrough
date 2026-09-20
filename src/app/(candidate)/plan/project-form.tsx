"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/pending";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitProject, type ActionResult } from "../../actions";

export function ProjectForm({ repoUrl, liveUrl, demoUrl, submitted }: { repoUrl: string; liveUrl: string; demoUrl: string; submitted: boolean }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(submitProject, null);
  const typed = state && "error" in state ? state.values : undefined;
  return (
    <form action={action} className="space-y-3" key={typed ? JSON.stringify(typed) : "saved"}>
      <div className="space-y-1.5"><Label htmlFor="repoUrl">Repository URL (required)</Label><Input id="repoUrl" name="repoUrl" type="url" required placeholder="https://github.com/you/project" defaultValue={typed?.repoUrl ?? repoUrl} /></div>
      <div className="space-y-1.5"><Label htmlFor="liveUrl">Live URL</Label><Input id="liveUrl" name="liveUrl" type="url" placeholder="https://" defaultValue={typed?.liveUrl ?? liveUrl} /></div>
      <div className="space-y-1.5"><Label htmlFor="demoUrl">Demo / video URL</Label><Input id="demoUrl" name="demoUrl" type="url" placeholder="https://" defaultValue={typed?.demoUrl ?? demoUrl} /></div>
      {state && "error" in state ? <p role="alert" className="text-sm text-rose-600">{state.error}</p> : null}
      {state && "ok" in state ? <p role="status" className="text-sm text-emerald-700">{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="h-9 px-4">{pending ? <Spinner /> : null}
        {pending ? "Checking link…" : submitted ? "Update submission" : "Submit project"}</Button>
    </form>
  );
}
