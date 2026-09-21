"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIMENSION_LABELS, PRIORITY_LABELS } from "@/content/taxonomy";
import { Chip } from "@/components/bits";

const PRIORITY_CHIP: Record<string, string> = { 
  critical: "bg-rose-500/20 text-rose-300 ring-rose-500/30", 
  important: "bg-amber-500/20 text-amber-300 ring-amber-500/30", 
  nice: "bg-foreground/10 text-foreground/70 ring-foreground/20" 
};

export function InteractiveSkillList({ skills }: { skills: any[] }) {
  // Fix scroll trap: Always keep one item expanded so total height remains stable
  const [hoveredId, setHoveredId] = useState<string | null>(skills[0]?.s.id || null);

  return (
    <div className="flex flex-col w-full py-10">
      {skills.map(({ rs, s }) => (
        <div
          key={s.id}
          className="relative flex flex-col justify-center border-b border-foreground/5 py-10 transition-colors hover:bg-foreground/[0.02]"
          onMouseEnter={() => setHoveredId(s.id)}
          // Removed onMouseLeave to prevent sudden height collapse that traps scrolling
        >
          <div className="flex items-center justify-between px-10">
            <h3 
              className="text-4xl sm:text-6xl font-semibold tracking-tighter text-foreground transition-opacity duration-300" 
              style={{ opacity: hoveredId && hoveredId !== s.id ? 0.2 : 1 }}
            >
              {s.name}
            </h3>
            <span className="text-2xl sm:text-4xl font-light text-foreground/40">{rs.target}%</span>
          </div>

          <AnimatePresence>
            {hoveredId === s.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden px-10"
              >
                <div className="pt-8 flex flex-wrap items-start justify-between gap-6">
                  <div className="max-w-3xl">
                    <p className="text-xl font-light text-foreground/70 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="text-sm font-medium uppercase tracking-widest text-foreground/40">{DIMENSION_LABELS[s.dimension as keyof typeof DIMENSION_LABELS]}</span>
                    <Chip className={PRIORITY_CHIP[rs.priority]}>{PRIORITY_LABELS[rs.priority as keyof typeof PRIORITY_LABELS]}</Chip>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
