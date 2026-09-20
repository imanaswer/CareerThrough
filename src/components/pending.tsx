"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { useLinkStatus } from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Submit button for server-action forms: spinner + disabled the moment it's pressed. */
export function SubmitButton({ children, pendingLabel, ...props }: ComponentProps<typeof Button> & { pendingLabel?: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" {...props} disabled={pending || props.disabled} aria-busy={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}

export function Spinner() {
  return <Loader2 className="size-4 animate-spin" aria-hidden />;
}

/** Arrow that turns into a spinner while its parent <Link> is navigating. */
export function LinkArrow() {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className="size-4 animate-spin" aria-label="Loading" /> : <ArrowRight className="size-4" aria-hidden />;
}

/** Spinner only while the parent <Link> is navigating (for links without an arrow). */
export function LinkPending() {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className="size-3.5 animate-spin" aria-label="Loading" /> : null;
}
