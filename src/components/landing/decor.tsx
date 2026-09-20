/**
 * Decorative vector furniture for the landing page. Purely visual: aria-hidden,
 * never interactive, and still under prefers-reduced-motion.
 */

/** Soft colour fields behind the hero. */
export function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="blob left-[-10%] top-[-12%] size-[420px] bg-primary/35" style={{ animationDelay: "0s" }} />
      <span className="blob right-[-8%] top-[6%] size-[340px] bg-fuchsia-400/30" style={{ animationDelay: "-4s" }} />
      <span className="blob bottom-[-18%] left-[38%] size-[380px] bg-sky-300/30" style={{ animationDelay: "-8s" }} />
    </div>
  );
}

/** Small floating glyphs that echo the product: a target, a tick, a spark, a lock. */
export function FloatingGlyphs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <svg className="float absolute left-[3%] top-[22%] size-10 text-primary/35" style={{ ["--i" as string]: 0 }} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
      <svg className="float absolute right-[4%] top-[62%] size-9 text-emerald-500/40" style={{ ["--i" as string]: 1 }} viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="32" height="32" rx="10" stroke="currentColor" strokeWidth="2" />
        <path d="M13 21l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className="float absolute left-[46%] top-[6%] size-7 text-fuchsia-500/35" style={{ ["--i" as string]: 2 }} viewBox="0 0 40 40" fill="none">
        <path d="M20 4l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg className="float absolute bottom-[10%] left-[12%] size-8 text-sky-500/35" style={{ ["--i" as string]: 3 }} viewBox="0 0 40 40" fill="none">
        <rect x="9" y="18" width="22" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M14 18v-4a6 6 0 1112 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** The loop, drawn once, as a continuous path the eye can follow. */
export function LoopPath() {
  return (
    <svg aria-hidden viewBox="0 0 1200 120" className="pointer-events-none absolute inset-x-0 top-5 hidden h-24 w-full lg:block" fill="none">
      <path
        d="M60 60 C 260 -10, 340 130, 520 60 S 820 -10, 980 60 1140 60 1140 60"
        stroke="url(#loopGradient)"
        strokeWidth="2"
        strokeDasharray="7 9"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="loopGradient" x1="0" x2="1200" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0" className="text-primary" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.55" className="text-primary" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" className="text-primary" />
        </linearGradient>
      </defs>
    </svg>
  );
}
