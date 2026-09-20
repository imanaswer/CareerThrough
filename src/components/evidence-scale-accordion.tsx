"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIERS = [
  {
    id: "tier-1",
    score: "30%",
    title: "You said you know it",
    desc: "A claim on a resume. Capped here until something backs it up.",
    bgClass: "bg-background/80 border-t border-foreground/5",
    textClass: "text-foreground/40",
    numberClass: "text-foreground/20",
    glowClass: "opacity-0",
  },
  {
    id: "tier-2",
    score: "84%",
    title: "You passed the test",
    desc: "Adaptive and timed. The hard questions are worth more than the easy ones.",
    bgClass: "bg-foreground/[0.03] border-y border-foreground/10",
    textClass: "text-foreground/80",
    numberClass: "text-foreground/50",
    glowClass: "opacity-30 mix-blend-screen",
  },
  {
    id: "tier-3",
    score: "100%",
    title: "You did the work",
    desc: "A project, or an interview on the skill. Nothing else reaches the top band.",
    bgClass: "bg-foreground/[0.08] border-b border-primary/20",
    textClass: "text-foreground",
    numberClass: "text-foreground drop-shadow-[0_0_20px_rgba(var(--primary),0.8)]",
    glowClass: "opacity-100",
  }
];

export function EvidenceScaleAccordion() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-background pt-32 pb-10">
      
      {/* Intro text */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-20">
        <p className="text-sm font-bold tracking-widest text-primary uppercase mb-6">
          Evidence Scale
        </p>
        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-none mb-10">
          A score you <br className="hidden sm:block" /> can argue with.
        </h2>
        <p className="text-xl text-foreground/50 leading-relaxed font-light mx-auto max-w-2xl">
          Saying you know something is worth 30. Proving it on paper is worth 84. The top band is reserved for work you have actually done.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div 
          className="relative flex flex-col w-full h-[60vh] min-h-[600px] overflow-hidden rounded-[2rem] border border-foreground/10"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {TIERS.map((tier, index) => {
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <motion.div
                key={tier.id}
                onMouseEnter={() => setHoveredIndex(index)}
                layout
                initial={{ flex: 1 }}
                animate={{ 
                  flex: isHovered ? 4 : (hoveredIndex === null ? 1 : 0.5),
                  opacity: isDimmed ? 0.4 : 1
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.7 }}
                className={`relative w-full flex items-center justify-center cursor-crosshair overflow-hidden group ${tier.bgClass}`}
              >
                
                {/* 100% Specific Effects */}
                {index === 2 && (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-primary/20 pointer-events-none"
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/40 blur-[100px] pointer-events-none rounded-[100%]"
                      animate={{ 
                        opacity: isHovered ? 0.8 : 0,
                        scale: isHovered ? 1 : 0.5
                      }}
                      transition={{ duration: 0.7 }}
                    />
                  </>
                )}

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
                  
                  {/* Left Side: Score Number */}
                  <motion.div 
                    layout="position"
                    className="flex-shrink-0 origin-left"
                  >
                    <motion.h3 
                      className={`text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tight leading-none ${tier.numberClass}`}
                      style={{ transformOrigin: "left center" }}
                      animate={{ 
                        scale: isHovered ? 1.1 : 1,
                        y: isHovered ? -10 : 0
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    >
                      {tier.score}
                    </motion.h3>
                  </motion.div>

                  {/* Right Side: Text */}
                  <motion.div 
                    layout="position"
                    className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
                    animate={{
                      y: isHovered ? 0 : 20,
                      opacity: isHovered || hoveredIndex === null ? 1 : 0
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <AnimatePresence>
                      {(isHovered || hoveredIndex === null) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className={`text-2xl sm:text-4xl font-black mb-4 ${tier.textClass}`}>
                            {tier.title}
                          </h4>
                          <motion.p 
                            className="text-lg sm:text-xl font-light leading-relaxed max-w-lg text-foreground/60"
                            animate={{ opacity: isHovered ? 1 : (hoveredIndex === null ? 0.6 : 0) }}
                          >
                            {tier.desc}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
