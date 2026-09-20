"use client";

import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** The one explainability drawer. Server components pass pre-rendered evidence as children. */
export function Why({ label, title, description, children }: { label: string; title: string; description?: string; children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">
        <HelpCircle className="size-3.5" aria-hidden />
        {label}
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6 text-sm">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
