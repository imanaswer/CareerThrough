"use client";

import Link from "next/link";
import { Brand } from "./brand";
import { buttonVariants } from "./ui/button";
import { cn } from "cn";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { SignOut } from "./sign-out";
import type { User } from "@supabase/supabase-js";

export function ClientHeader({ user }: { user: User | null }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (pathname === "/") {
      e.preventDefault();
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-5xl px-4"
    >
      <div className="flex h-14 items-center justify-between rounded-full border border-border/40 bg-background/50 px-6 shadow-xl backdrop-blur-md">
        <Brand />
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/#roles" onClick={(e) => handleScroll(e, "#roles")} className="text-muted-foreground transition-colors hover:text-foreground hidden sm:block">Roles</Link>
          <Link href="/#how" onClick={(e) => handleScroll(e, "#how")} className="text-muted-foreground transition-colors hover:text-foreground hidden sm:block">How it works</Link>
          <div className="h-4 w-px bg-foreground/20 hidden sm:block mx-2" />
          <ThemeToggle />
          <Link href={user ? "/dashboard" : "/login"} className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-foreground text-background hover:bg-foreground/90")}>
            {user ? "Dashboard" : "Sign in"}
          </Link>
          {user && <SignOut variant="compact" />}
        </nav>
      </div>
    </motion.header>
  );
}
