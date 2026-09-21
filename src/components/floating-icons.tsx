"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, Lock, Sparkles, Briefcase, Award, Compass, GraduationCap, UserCheck, FileBadge } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingIcons({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="relative w-full">{children}</div>;
  }

  return (
    <div className="relative w-full">
      {/* Background Floating Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* 1. Top Left - Compass (Journey) */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-10 text-primary/30"
        >
          <Compass className="size-14" strokeWidth={1} />
        </motion.div>

        {/* 2. Top Right - Briefcase (Career) */}
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -top-12 right-24 text-blue-500/30"
        >
          <Briefcase className="size-12" strokeWidth={1} />
        </motion.div>

        {/* 3. Middle Left - Award (Achievement) */}
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -left-24 text-amber-500/30"
        >
          <Award className="size-16" strokeWidth={1} />
        </motion.div>

        {/* 4. Middle Right - UserCheck (Verified Profile) */}
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-1/3 -right-16 text-fuchsia-500/30"
        >
          <UserCheck className="size-10" strokeWidth={1} />
        </motion.div>

        {/* 5. Bottom Left - GraduationCap (Learning/Skills) */}
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-24 -left-12 text-cyan-500/30"
        >
          <GraduationCap className="size-12" strokeWidth={1} />
        </motion.div>

        {/* 6. Bottom Right - FileBadge (Career Card/Evidence) */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, -10, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute -right-20 bottom-32 text-emerald-500/30"
        >
          <FileBadge className="size-14" strokeWidth={1} />
        </motion.div>
        
        {/* 7. Extra Decorative - Sparkles */}
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-20 right-0 text-primary/40"
        >
          <Sparkles className="size-6" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Main Content (Mockup) */}
      <div className="relative z-10 w-full flex justify-center lg:justify-end">
        {children}
      </div>
    </div>
  );
}
