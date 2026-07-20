"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site chrome (Navbar/Footer) on the CMS dashboard, which
 * renders its own sidebar + header. Children are passed in from the server
 * layout so they stay server-rendered — this wrapper only gates their display.
 */
export function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <>{children}</>;
}
