"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal, type ScrollRevealOptions } from "@/lib/hooks/useScrollReveal";

type RevealProps = React.HTMLAttributes<HTMLDivElement> &
  Omit<ScrollRevealOptions, "selector" | "stagger"> & {
    /** Render as a different element (keeps semantics like <section>). */
    as?: React.ElementType;
    /** When true, stagger the reveal of direct children instead of the box. */
    stagger?: number | boolean;
    children: React.ReactNode;
  };

/**
 * Fade/slide-in-on-scroll wrapper. By default reveals itself; pass `stagger`
 * to reveal its direct children in sequence. Cleanup + reduced-motion handled
 * by useScrollReveal.
 */
export function Reveal({
  as: Tag = "div",
  className,
  direction = "up",
  distance,
  duration,
  delay,
  start,
  once,
  stagger,
  children,
  ...rest
}: RevealProps) {
  const staggerEnabled = stagger === true || typeof stagger === "number";
  const ref = useScrollReveal<HTMLDivElement>({
    selector: staggerEnabled ? ":scope > *" : undefined,
    direction,
    distance,
    duration,
    delay,
    start,
    once,
    stagger: typeof stagger === "number" ? stagger : undefined,
  });

  return (
    <Tag ref={ref} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
