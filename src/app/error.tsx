"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-rose-50 text-rose-600">
        <WifiOff className="size-5" aria-hidden />
      </span>
      <h1 className="text-lg font-semibold">Something didn&apos;t load</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This is usually a network hiccup. Your progress and evidence are saved. Try again, and if it keeps happening, check your connection.
      </p>
      <Button onClick={reset} className="mt-4 h-9 px-4">Try again</Button>
    </div>
  );
}
