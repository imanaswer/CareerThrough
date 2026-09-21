import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md">
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 shrink-0 transition-transform duration-500 group-hover:scale-110">
        {/* Broken Outer Target Ring */}
        <path d="M12 3a9 9 0 1 0 9 9" className="stroke-primary/40" />
        
        {/* Bullseye */}
        <circle cx="12" cy="12" r="3" className="stroke-primary" />
        
        {/* Arrow shaft (entering) */}
        <path d="M3 21 L9.5 14.5" className="stroke-foreground transition-colors duration-500 group-hover:stroke-primary" />
        
        {/* Arrow shaft (bursting out) */}
        <path d="M14.5 9.5 L21 3" className="stroke-foreground transition-colors duration-500 group-hover:stroke-primary" />
        
        {/* Arrowhead */}
        <path d="M15 3 H21 V9" className="stroke-foreground transition-colors duration-500 group-hover:stroke-primary" />
      </svg>
      <span className="text-foreground/90 text-xl tracking-tight font-bold transition-colors group-hover:text-foreground">Career Through</span>
    </Link>
  );
}
