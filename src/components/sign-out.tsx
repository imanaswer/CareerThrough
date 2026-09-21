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

  if (compact) {
    return (
      <form action={signOut}>
        <SubmitButton
          variant="ghost"
          pendingLabel="Signing out…"
          className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground dark:text-white/80 dark:hover:text-white"
        >
          <LogOut className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Sign out</span>
        </SubmitButton>
      </form>
    );
  }

  // Parse name and email from "Name · email@example.com" string passed from layout
  const parts = email?.split(" · ");
  const name = parts?.length === 2 ? parts[0] : (email?.split("@")[0] || "User");
  const actualEmail = parts?.length === 2 ? parts[1] : email;
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex w-full flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-primary ring-1 ring-primary/20 shadow-inner dark:from-primary/30 dark:to-primary/10">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold tracking-tight text-foreground dark:text-white">{name}</p>
          {actualEmail && <p className="truncate text-xs font-medium text-muted-foreground dark:text-white/60">{actualEmail}</p>}
        </div>
      </div>
      
      <form action={signOut} className="w-full pt-3">
        <SubmitButton
          variant="outline"
          pendingLabel="Signing out…"
          className="h-11 w-full justify-center gap-3 rounded-[0.85rem] text-base font-semibold shadow-sm"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </SubmitButton>
      </form>
    </div>
  );
}
