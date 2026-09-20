"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "cn";
import { LinkPending } from "./pending";

export function NavLink({ href, children, compact }: { href: string; children: ReactNode; compact?: boolean }) {
  const path = usePathname();
  const active = path === href || path.startsWith(href + "/") || (href === "/assessments" && path.startsWith("/assessment"));
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
        compact ? "shrink-0 px-3 py-1.5" : "px-3 py-2",
        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
      <span className="ml-auto"><LinkPending /></span>
    </Link>
  );
}
