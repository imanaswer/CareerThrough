import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { getUser } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

import { FloatingIcons } from "@/components/floating-icons";
import { LoginForm } from "./form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; mode?: string }> }) {
  const { next, error, mode } = await searchParams;
  if (await getUser()) redirect("/dashboard");
  
  return (
    <main className="relative flex min-h-screen w-full bg-background overflow-hidden">
      
      {/* Premium Coded Background Effects (No Watermarks) */}
      <div className="absolute inset-0 z-0 bg-background overflow-hidden">
        {/* Deep ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-primary/20 blur-[120px] rounded-full opacity-60" />
        
        {/* Animated Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Left Side: Cinematic Branding & Atmosphere */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-16 z-10">
        
        <div className="relative z-10">
          <Brand />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-semibold tracking-tighter text-foreground leading-[1.1]">
            Prove you're ready. <br />
            <span className="text-foreground/40">Not just on paper.</span>
          </h1>
          <p className="mt-6 text-lg text-foreground/60 leading-relaxed font-light">
            Your readiness, evidence, and Career Card are securely tied to your account. Join the modern standard for career transitions.
          </p>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <FloatingIcons>
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-16 relative z-10 min-h-screen">
          {/* Mobile Brand (Hidden on desktop) */}
          <div className="absolute top-8 left-8 lg:hidden">
            <Brand />
          </div>

        <div className="w-full max-w-[500px] rounded-[32px] border border-foreground/10 bg-background/50 p-10 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              {mode === "signup" ? "Create an account" : "Welcome back"}
            </h2>
            <p className="mt-3 text-base text-foreground/50">
              {mode === "signup" ? "Enter your details to get started." : "Sign in to continue your journey."}
            </p>
          </div>

          {!supabaseConfigured() ? (
            <p role="alert" className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200/90 backdrop-blur-md">
              Authentication isn&apos;t configured yet. Install the Supabase integration and run <code>vercel env pull</code>.
            </p>
          ) : (
            <LoginForm 
              next={next} 
              startMode={mode === "signup" ? "up" : "in"}
              initialError={error === "confirm" ? "That confirmation link was invalid or expired. Sign in or request a new one." : undefined} 
            />
          )}
        </div>
      </div>
      </FloatingIcons>
    </main>
  );
}
