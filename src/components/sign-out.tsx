import { LogOut } from "lucide-react";
import { cn } from "cn";
import { SubmitButton } from "./pending";
import { signOut } from "@/app/actions";

/**
 * Sign out. Rendered in the sidebar, the mobile header and the focused
 * onboarding/assessment shell — there must be no screen without a way out.
 */
export function SignOut({ email, variant = "full" }: { email?: string | null; variant?: "full" | "compact" }) {
  const compact = variant === "compact";
  return (
    <form action={signOut} className={compact ? "" : "border-t pt-3"}>
      {!compact && email ? <p className="truncate px-3 text-xs text-muted-foreground">{email}</p> : null}
      <SubmitButton
        variant="ghost"
        pendingLabel="Signing out…"
        className={cn(
          "text-muted-foreground hover:text-foreground",
          compact ? "h-8 gap-1.5 px-2" : "mt-1 h-9 w-full justify-start gap-2.5 px-3",
        )}
      >
        <LogOut className="size-4" aria-hidden />
        <span className={compact ? "sr-only sm:not-sr-only" : ""}>Sign out</span>
      </SubmitButton>
    </form>
  );
}
