"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** How far the element follows the pointer (0–1). */
  strength?: number;
};

/**
 * Wraps a child so it gently follows the pointer on hover and springs back on
 * leave. Pure transform; disabled under reduced-motion / touch.
 */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const moveTo = React.useRef<gsap.QuickToFunc | null>(null);
  const moveToY = React.useRef<gsap.QuickToFunc | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    moveTo.current = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    moveToY.current = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !moveTo.current || !moveToY.current) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    moveTo.current(x);
    moveToY.current(y);
  };

  const handleLeave = () => {
    moveTo.current?.(0);
    moveToY.current?.(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </div>
  );
}

export default Magnetic;
