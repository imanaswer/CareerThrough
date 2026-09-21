"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, Lock, Sparkles, Briefcase, Award, Compass, GraduationCap, UserCheck, FileBadge, Route, ShieldCheck } from "lucide-react";
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
      <div className="pointer-events-none absolute -inset-32 z-0">
        {/* 1. Top Left - Compass */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[5%] text-primary/30"
        >
          <Compass className="size-14" strokeWidth={1} />
        </motion.div>
        
        {/* 2. Top Center - Sparkles */}
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -25, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[10%] left-[40%] text-amber-500/30"
        >
          <Sparkles className="size-10" strokeWidth={1} />
        </motion.div>

        {/* 3. Top Right - Briefcase */}
        <motion.div
          animate={{ y: [0, 35, 0], x: [0, -25, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[8%] right-[10%] text-blue-500/30"
        >
          <Briefcase className="size-16" strokeWidth={1} />
        </motion.div>

        {/* 4. Middle Left - Target */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, -30, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[35%] left-[2%] text-emerald-500/30"
        >
          <Target className="size-12" strokeWidth={1} />
        </motion.div>
        
        {/* 5. Center - ShieldCheck (drifting out from behind card) */}
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 40, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[45%] left-[50%] text-fuchsia-500/20"
        >
          <ShieldCheck className="size-20" strokeWidth={1} />
        </motion.div>

        {/* 6. Middle Right - Award */}
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-[40%] right-[5%] text-purple-500/30"
        >
          <Award className="size-14" strokeWidth={1} />
        </motion.div>

        {/* 7. Bottom Left - GraduationCap */}
        <motion.div
          animate={{ y: [0, 35, 0], x: [0, 15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[15%] left-[10%] text-cyan-500/30"
        >
          <GraduationCap className="size-16" strokeWidth={1} />
        </motion.div>
        
        {/* 8. Bottom Center - Route */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, -30, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
          className="absolute bottom-[5%] left-[45%] text-rose-500/30"
        >
          <Route className="size-12" strokeWidth={1} />
        </motion.div>

        {/* 9. Bottom Right - FileBadge */}
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, -20, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute bottom-[10%] right-[15%] text-emerald-500/30"
        >
          <FileBadge className="size-14" strokeWidth={1} />
        </motion.div>
        
        {/* 10. Far Right Middle - Sparkles */}
        <motion.div
          animate={{ y: [0, 45, 0], x: [0, -35, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute top-[60%] -right-[5%] text-primary/40"
        >
          <Sparkles className="size-8" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Main Content (Mockup) */}
      <div className="relative z-10 w-full flex justify-center lg:justify-end">
        {children}
      </div>
    </div>
  );
}
