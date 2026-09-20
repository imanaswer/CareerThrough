"use client";

import { motion } from "framer-motion";

export function CinematicText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
        hidden: {},
      }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.2em]"
          variants={{
            hidden: { opacity: 0, filter: "blur(12px)", y: 25 },
            visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
