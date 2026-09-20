import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="surface-hero grid size-8 place-items-center rounded-xl text-sm font-bold">CT</span>
      Career Through
    </Link>
  );
}
