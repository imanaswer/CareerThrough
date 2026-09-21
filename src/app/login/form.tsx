"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendConfirmation, signIn, signUp, type ActionResult } from "../actions";

type Mode = "in" | "up";

export function LoginForm({ next, initialError, startMode = "in" }: { next?: string; initialError?: string; startMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [inState, inAction, inPending] = useActionState<ActionResult | null, FormData>(signIn, null);
  const [upState, upAction, upPending] = useActionState<ActionResult | null, FormData>(signUp, null);

  const state = mode === "in" ? inState : upState;
  const pending = inPending || upPending;
  const error = state && "error" in state ? state.error : !state ? initialError : undefined;
  const sent = mode === "up" && upState && "ok" in upState ? upState.message : undefined;
  const needsConfirmation = Boolean(state && "error" in state && state.needsConfirmation);

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
    <form id="login-form" action={mode === "in" ? inAction : upAction} className="mt-8 space-y-6">
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground/70 ml-1 text-base">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="h-14 text-base rounded-xl bg-foreground/[0.02] border-foreground/10 focus-visible:ring-primary/20 transition-all px-4" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground/70 ml-1 text-base">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required autoComplete={mode === "in" ? "current-password" : "new-password"} className="h-14 text-base rounded-xl bg-foreground/[0.02] border-foreground/10 focus-visible:ring-primary/20 transition-all px-4" />
      </div>
      {error ? <p role="alert" className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</p> : null}
      {needsConfirmation ? <ResendConfirmation /> : null}
      {state && "ok" in state && state.message ? <p role="status" className="text-sm text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="h-14 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_20px_rgba(var(--foreground),0.1)] transition-all font-medium text-lg mt-4">
        {pending ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
      </Button>

      {/* Visual Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-foreground/10" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-background/80 px-4 text-muted-foreground backdrop-blur-md">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="h-14 text-base rounded-xl bg-background/50 border-foreground/10 hover:bg-foreground/5 transition-colors">
          <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google
        </Button>
        <Button variant="outline" type="button" className="h-14 text-base rounded-xl bg-background/50 border-foreground/10 hover:bg-foreground/5 transition-colors">
          <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
          </svg>
          GitHub
        </Button>
      </div>

      <p className="text-center text-base text-muted-foreground mt-8">
        {mode === "in" ? "New here?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="font-semibold text-primary hover:underline">
          {mode === "in" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </form>
  );
}

/** Offered only when sign-in failed because the account was never confirmed. */
function ResendConfirmation() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(resendConfirmation, null);
  return (
    <div className="rounded-xl border bg-muted/50 p-3 text-sm">
      {state && "ok" in state ? (
        <p role="status" className="text-emerald-700">{state.message}</p>
      ) : (
        <>
          <p className="text-muted-foreground">We can send the confirmation link again.</p>
          {state && "error" in state ? <p role="alert" className="mt-1 text-rose-600">{state.error}</p> : null}
          <Button
            type="submit"
            form="login-form"
            formAction={action}
            variant="outline"
            disabled={pending}
            className="mt-2 h-9"
          >
            {pending ? "Sending…" : "Resend confirmation email"}
          </Button>
        </>
      )}
    </div>
  );
}
