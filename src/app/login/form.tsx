"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, type ActionResult } from "../actions";

type Mode = "in" | "up";

export function LoginForm({ next, initialError, startMode = "in" }: { next?: string; initialError?: string; startMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [inState, inAction, inPending] = useActionState<ActionResult | null, FormData>(signIn, null);
  const [upState, upAction, upPending] = useActionState<ActionResult | null, FormData>(signUp, null);

  const state = mode === "in" ? inState : upState;
  const pending = inPending || upPending;
  const error = state && "error" in state ? state.error : !state ? initialError : undefined;
  const sent = mode === "up" && upState && "ok" in upState ? upState.message : undefined;

  if (sent) {
    return (
      <div className="mt-8 rounded-2xl border bg-card p-6 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-5" aria-hidden />
        </span>
        <p className="mt-3 font-medium">Check your inbox</p>
        <p className="mt-1 text-sm text-muted-foreground">{sent}</p>
        <button onClick={() => setMode("in")} className="mt-4 text-sm font-medium text-primary hover:underline">
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <div role="tablist" aria-label="Sign in or create an account" className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {(["in", "up"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
              mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form action={mode === "in" ? inAction : upAction} className="mt-5 space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className="h-10"
          />
          {mode === "up" ? <p className="text-xs text-muted-foreground">At least 8 characters.</p> : null}
        </div>

        {error ? <p role="alert" className="text-sm text-rose-600">{error}</p> : null}

        <Button type="submit" disabled={pending} className="h-11 w-full text-base">
          {pending ? "Please wait…" : mode === "in" ? "Sign in" : "Create my account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {mode === "in" ? (
          <>
            First time here?{" "}
            <button onClick={() => setMode("up")} className="font-medium text-primary hover:underline">
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have one?{" "}
            <button onClick={() => setMode("in")} className="font-medium text-primary hover:underline">
              Sign in
            </button>
          </>
        )}
      </p>
    </>
  );
}
