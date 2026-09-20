import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { getUser } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";
import { LoginForm } from "./form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  if (await getUser()) redirect("/dashboard");
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10">
      <Brand />
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">Sign in to continue</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your readiness, evidence and Career Card are tied to your account.</p>
      {!supabaseConfigured ? (
        <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Authentication isn&apos;t configured yet. Install the Supabase integration and run <code>vercel env pull</code>.
        </p>
      ) : (
        <LoginForm next={next} initialError={error === "confirm" ? "That confirmation link was invalid or expired. Sign in or request a new one." : undefined} />
      )}
    </main>
  );
}
