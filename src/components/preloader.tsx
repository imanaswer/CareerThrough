"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    let current = 0;
    const updateProgress = () => {
      // Random increment for a more organic feel
      current += Math.random() * 15;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 400); // short pause at 100%
      } else {
        setProgress(Math.floor(current));
        setTimeout(updateProgress, Math.random() * 100 + 30);
      }
    };
    updateProgress();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background"
      initial={{ y: 0 }}
      animate={{ y: isLoading ? 0 : "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="text-7xl font-light tracking-tighter text-foreground font-mono">
          {progress}%
        </div>
        <div className="h-[1px] w-64 overflow-hidden bg-foreground/10 rounded-full">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
