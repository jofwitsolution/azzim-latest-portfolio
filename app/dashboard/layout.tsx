import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard | Azzim Aina",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already guards /dashboard; re-check here as defense in depth.
  const session = await getSession();
  if (!session) redirect("/login?from=/dashboard");

  return <DashboardShell>{children}</DashboardShell>;
}
