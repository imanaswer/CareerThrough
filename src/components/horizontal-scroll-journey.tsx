"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const STAGE_DESCRIPTIONS = [
  "Establish your starting point. No assumptions, just data.",
  "See exactly where the gaps in your knowledge lie.",
  "Learn and build only what you actually need.",
  "Prove your skills with tamper-resistant assessments.",
  "Unlock your verified, shareable Career Card.",
  "Gain access to exclusive employer opportunities."
];

export function HorizontalScrollJourney({ stages }: { stages: string[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Translate horizontally as we scroll vertically
  // -80% of w-max means we stop when the last few items are in view.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]); 

  return (
    <div ref={targetRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-t border-foreground/5 bg-background/50 backdrop-blur-xl">
        
        <div className="absolute top-24 lg:top-36 left-[5vw] text-sm font-bold tracking-widest text-foreground/40 uppercase z-20">
          Your Journey
        </div>

        <motion.div style={{ x }} className="flex w-max gap-32 pl-[5vw] pr-[20vw] relative z-10">
          {stages.map((stage, i) => (
            <div key={stage} className="relative flex shrink-0 flex-col justify-center h-[500px] w-[350px] sm:w-[450px]">
              <div 
                className="text-[10rem] sm:text-[12rem] font-black absolute -top-10 -left-10 tracking-tighter leading-none pointer-events-none opacity-50"
                style={{ WebkitTextStroke: "4px var(--foreground)", color: "transparent" }}
              >
                0{i + 1}
              </div>
              <h3 className="text-5xl sm:text-6xl font-semibold text-foreground tracking-tight z-10">{stage}</h3>
              <p className="mt-6 text-xl sm:text-2xl text-foreground/60 z-10 font-light leading-relaxed">
                {STAGE_DESCRIPTIONS[i]}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
