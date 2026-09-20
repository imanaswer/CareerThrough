"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/pending";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, type ActionResult } from "../actions";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [inState, inAction, inPending] = useActionState<ActionResult | null, FormData>(signIn, null);
  const [upState, upAction, upPending] = useActionState<ActionResult | null, FormData>(signUp, null);
  const state = mode === "in" ? inState : upState;
  const pending = inPending || upPending;
  const error = state && "error" in state ? state.error : !state ? initialError : undefined;

  return (
    <form action={mode === "in" ? inAction : upAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required autoComplete={mode === "in" ? "current-password" : "new-password"} className="h-10" />
      </div>
      {error ? <p role="alert" className="text-sm text-rose-600">{error}</p> : null}
      {state && "ok" in state && state.message ? <p role="status" className="text-sm text-emerald-700">{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending ? <Spinner /> : null}
        {pending ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "in" ? "New here?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="font-medium text-primary hover:underline">
          {mode === "in" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </form>
  );
}
