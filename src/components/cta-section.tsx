"use client";

import { motion } from "framer-motion";

import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative w-full bg-background py-32 sm:py-40 overflow-hidden flex flex-col items-center justify-center">
      
      {/* High-tech dotted background pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,var(--foreground)_1px,transparent_1.5px)] [background-size:24px_24px] opacity-[0.08] sm:opacity-[0.12]" />
      
      {/* Radial fade mask to blend the pattern smoothly into the edges */}
      <div className="absolute inset-0 pointer-events-none bg-background [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)]" />

      {/* CTA Content Container */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6">
        <div className="relative w-full p-8 sm:p-20 flex flex-col items-center text-center">

          {/* Cinematic Typography */}
          <h2 className="relative z-10 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-8">
            Find out where <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              you actually stand.
            </span>
          </h2>
          
          <p className="relative z-10 text-lg sm:text-2xl text-foreground/60 max-w-2xl font-light leading-relaxed mb-12 sm:mb-16">
            Pick a role, take the baseline, and see your readiness with the evidence behind it.
          </p>

          {/* Premium Spinning Border Button */}
          <div className="relative z-10 mb-16 sm:mb-24 group">
            
            {/* Soft background glow that pulses */}
            <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover:bg-primary/40 group-hover:blur-2xl"></div>
            
            <a 
              href="#roles" 
              className="relative inline-flex h-16 sm:h-20 overflow-hidden rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-2xl"
            >
              {/* Spinning conic gradient border effect */}
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#8B5CF6_0%,transparent_30%,transparent_70%,#D8B4FE_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Inner Button Content */}
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background/90 px-10 sm:px-16 text-lg sm:text-xl font-bold text-foreground backdrop-blur-md transition-colors group-hover:bg-background">
                Explore Roles
                <ArrowRight className="ml-3 size-5 sm:size-6 transition-transform duration-300 group-hover:translate-x-2 text-primary" />
              </div>
            </a>
          </div>

          {/* Subtle Metadata Footnotes */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 w-full pt-8 sm:pt-10 border-t border-foreground/10">
            <div className="flex items-center gap-2 text-xs sm:text-base font-medium tracking-wide text-foreground/50">
              <CheckCircle2 className="size-4 text-primary" />
              Evidence before claims
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-base font-medium tracking-wide text-foreground/50">
              <CheckCircle2 className="size-4 text-primary" />
              Rule-based, never AI
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-base font-medium tracking-wide text-foreground/50">
              <CheckCircle2 className="size-4 text-primary" />
              Traces to evidence
            </div>
          </div>

        </div>
      </div>
      
    </section>
  );
}
