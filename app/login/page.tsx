import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign in | Azzim Aina",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      {/* Ambient glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--glow-from), transparent 70%), radial-gradient(50% 40% at 80% 100%, var(--glow-to), transparent 70%)",
        }}
      />

      <div className="glass-card glow-shadow w-full max-w-md rounded-2xl p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="glow-border mb-4 flex size-12 items-center justify-center rounded-xl">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <h1 className="gradient-text text-2xl font-semibold tracking-tight">
            Dashboard access
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter the admin password to manage the portfolio content.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-28 w-full" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
