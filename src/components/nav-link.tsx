"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "cn";
import { LinkPending } from "./pending";

export function NavLink({ href, label, icon, compact }: { href: string; label?: ReactNode; icon: ReactNode; compact?: boolean }) {
  const path = usePathname();
  const active = path === href || path.startsWith(href + "/") || (href === "/assessments" && path.startsWith("/assessment"));
  
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-4 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary/50 relative overflow-hidden",
        compact ? "p-2" : "px-4 py-3.5",
        active 
          ? "bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.08)] text-primary font-semibold ring-1 ring-black/5 dark:bg-white/15 dark:text-white dark:ring-white/10" 
          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground font-medium dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
      )}
    >
      <div className={cn("flex shrink-0 items-center justify-center transition-colors", active ? "text-primary dark:text-white" : "text-foreground/60 group-hover:text-foreground dark:text-white/70 dark:group-hover:text-white")}>
        {icon}
      </div>
      {!compact && label && <span className="text-base tracking-tight">{label}</span>}
      {!compact && <span className="ml-auto"><LinkPending /></span>}
    </Link>
  );
}
