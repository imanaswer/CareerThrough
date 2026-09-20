"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "./ui/button";
import { MagneticButton } from "./magnetic-button";

export function HeroButtons() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <MagneticButton>
        <a
          href="#roles"
          onClick={(e) => handleScroll(e, "#roles")}
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-12 rounded-full px-8 text-base shadow-[0_0_20px_oklch(0.65_0.25_290/0.4)] transition-all hover:shadow-[0_0_30px_oklch(0.65_0.25_290/0.6)]"
          )}
        >
          Explore Roles
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </a>
      </MagneticButton>
      <MagneticButton>
        <a
          href="#how"
          onClick={(e) => handleScroll(e, "#how")}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 rounded-full border-white/10 bg-white/5 px-8 text-base backdrop-blur-md hover:bg-white/10 hover:text-white"
          )}
        >
          How it works
        </a>
      </MagneticButton>
    </div>
  );
}
