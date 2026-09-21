"use client";

import { motion } from "framer-motion";

export function AnimatedStepper({ stages }: { stages: string[] }) {
  return (
    <div className="relative mt-5 w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="relative flex min-w-max items-center py-2">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -z-10 h-[2px] w-full -translate-y-1/2 bg-white/5" />
        
        {/* Animated glowing progress line */}
        <motion.div
          className="absolute left-0 top-1/2 -z-10 h-[2px] -translate-y-1/2 bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)]"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {stages.map((stage, i) => (
          <motion.div
            key={stage}
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-md">
              {stage}
            </span>
            {i < stages.length - 1 && (
              <span className="w-10 shrink-0 sm:w-16" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
