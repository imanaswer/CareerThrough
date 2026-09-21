import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { SmoothScrolling } from "@/components/lenis-provider";
import { Preloader } from "@/components/preloader";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-heading", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Career Through — Choose the role. Prove you're ready.", template: "%s · Career Through" },
  description: "A role-first career-readiness system. Choose the role. Prove you're ready. Get access to opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}
