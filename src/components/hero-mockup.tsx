"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import { useState } from "react";

const TABS = ["Data", "Frontend", "Backend", "QA", "DevOps"] as const;
type Tab = typeof TABS[number];

const MOCKUP_DATA: Record<Tab, any> = {
  Data: {
    score: 62,
    label: "Entry-ready",
    skills: [
      { name: "SQL", current: 17, target: 75, status: "low" },
      { name: "Excel & Spreadsheets", current: 33, target: 70, status: "low" },
      { name: "Statistics", current: 17, target: 65, status: "low" },
      { name: "Data Cleaning", current: 67, target: 65, status: "pass" },
      { name: "Data Visualization", current: 67, target: 65, status: "pass" },
    ],
    role: "Reporting Analyst",
    company: "at KiteKart Commerce",
    missing: "Missing: SQL. Reach 65% to satisfy this requirement, from 17% today.",
    unlocked: "0 of 5 unlocked",
    gaps: "3 critical gaps"
  },
  Frontend: {
    score: 45,
    label: "Developing",
    skills: [
      { name: "React / Next.js", current: 80, target: 75, status: "pass" },
      { name: "CSS / Tailwind", current: 90, target: 70, status: "pass" },
      { name: "TypeScript", current: 20, target: 80, status: "low" },
      { name: "State Management", current: 15, target: 65, status: "low" },
      { name: "Web Performance", current: 10, target: 50, status: "low" },
    ],
    role: "Frontend Developer",
    company: "at PixelForge Studio",
    missing: "Missing: TypeScript. Reach 80% to satisfy this requirement, from 20% today.",
    unlocked: "0 of 8 unlocked",
    gaps: "3 critical gaps"
  },
  Backend: {
    score: 85,
    label: "Job-ready",
    skills: [
      { name: "Node.js", current: 90, target: 80, status: "pass" },
      { name: "REST API Design", current: 85, target: 70, status: "pass" },
      { name: "PostgreSQL", current: 80, target: 70, status: "pass" },
      { name: "Authentication", current: 88, target: 65, status: "pass" },
      { name: "System Design", current: 75, target: 75, status: "pass" },
    ],
    role: "Backend Engineer",
    company: "at Paylane Systems",
    missing: "Requirements met! Click to apply.",
    unlocked: "5 of 5 unlocked",
    gaps: "0 critical gaps",
    ready: true
  },
  QA: {
    score: 55,
    label: "Developing",
    skills: [
      { name: "Manual Testing", current: 100, target: 60, status: "pass" },
      { name: "Test Planning", current: 80, target: 60, status: "pass" },
      { name: "Cypress / Playwright", current: 10, target: 70, status: "low" },
      { name: "API Testing", current: 20, target: 65, status: "low" },
      { name: "CI/CD Basics", current: 15, target: 50, status: "low" },
    ],
    role: "QA Automation Engineer",
    company: "at DataFlow Inc.",
    missing: "Missing: Cypress / Playwright. Reach 70% to satisfy this requirement.",
    unlocked: "0 of 3 unlocked",
    gaps: "3 critical gaps"
  },
  DevOps: {
    score: 30,
    label: "Baseline",
    skills: [
      { name: "Linux / Bash", current: 40, target: 75, status: "low" },
      { name: "Docker", current: 50, target: 80, status: "low" },
      { name: "AWS / Cloud", current: 15, target: 70, status: "low" },
      { name: "Kubernetes", current: 5, target: 65, status: "low" },
      { name: "Terraform", current: 0, target: 60, status: "low" },
    ],
    role: "Cloud Engineer",
    company: "at Nimbus Tech",
    missing: "Missing: Docker. Reach 80% to satisfy this requirement, from 50% today.",
    unlocked: "0 of 12 unlocked",
    gaps: "5 critical gaps"
  }
};

export function HeroMockup() {
  const [activeTab, setActiveTab] = useState<Tab>("Data");
  const data = MOCKUP_DATA[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-xl rounded-[32px] border border-foreground/10 bg-background/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 overflow-hidden"
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Tabs */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative z-10 grid gap-8 sm:grid-cols-[160px_1fr] items-center">
        {/* Left Side: Gauge */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative flex size-32 items-center justify-center rounded-full">
            <svg className="absolute inset-0 size-full -rotate-180 transform" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-foreground/5"
                strokeDasharray="138 276"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Foreground Arc (Progress) */}
              <motion.circle
                key={activeTab}
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-primary"
                strokeDasharray="138 276"
                initial={{ strokeDashoffset: 138 }}
                animate={{ strokeDashoffset: 138 - (138 * (data.score / 100)) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center mt-2">
              <span className="text-4xl font-bold tracking-tight text-foreground leading-none flex items-baseline">
                {/* Number Counter Animation */}
                <motion.span
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {data.score}
                </motion.span>
                <span className="text-xl text-muted-foreground font-medium">/100</span>
              </span>
            </div>
          </div>
          <motion.p key={activeTab + "-label"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-xs font-medium text-foreground">
            {data.label}
          </motion.p>
          <p className="mt-1 text-[10px] text-muted-foreground max-w-[120px]">
            Sample profile, scored by the live engine.
          </p>
        </div>

        {/* Right Side: Skill Bars */}
        <div className="flex flex-col justify-center space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {data.skills.map((skill: any, i: number) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{skill.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {skill.current}% / {skill.target}%
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/5">
                    <div
                      className="absolute bottom-0 top-0 z-10 w-0.5 bg-foreground/40"
                      style={{ left: `${skill.target}%` }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.current}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className={cn(
                        "absolute bottom-0 left-0 top-0 rounded-full",
                        skill.status === "low" ? "bg-rose-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Opportunity Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative z-10 mt-8 rounded-2xl border bg-foreground/[0.02] p-5 hover:bg-foreground/[0.04] transition-colors",
            data.ready ? "border-emerald-500/30 bg-emerald-500/5" : "border-foreground/10"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {data.ready ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Lock className="size-4 text-muted-foreground" />}
            {data.role} <span className="text-muted-foreground font-normal">{data.company}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {data.missing}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs font-medium">
            <span className={cn("flex items-center gap-1.5", data.ready ? "text-emerald-500" : "text-emerald-600 dark:text-emerald-500")}>
              <Check className="size-3.5" /> {data.unlocked}
            </span>
            <span className="text-muted-foreground">{data.gaps}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
