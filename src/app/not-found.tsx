import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-lg font-semibold">This page isn&apos;t available</h1>
      <p className="mt-1 text-sm text-muted-foreground">It may have been moved, or — if this was a Career Card link — the candidate has not made it public.</p>
      <Link href="/" className="mt-4 text-sm font-medium text-primary hover:underline">Go to Career Through</Link>
    </div>
  );
}
