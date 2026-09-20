import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/lib/data";
import { Brand } from "./brand";

export async function SiteHeader() {
  const user = await getUser();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Brand />
        <nav aria-label="Site" className="flex items-center gap-2 text-sm">
          <Link href="/#roles" className="hidden px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground sm:block">Roles</Link>
          <Link href="/#how" className="hidden px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground sm:block">How it works</Link>
          <Link href={user ? "/dashboard" : "/login"} className={cn(buttonVariants(), "h-9 px-4")}>{user ? "Dashboard" : "Sign in"}</Link>
        </nav>
      </div>
    </header>
  );
}
