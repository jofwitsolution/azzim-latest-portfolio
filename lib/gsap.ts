"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins once (guarded — safe to import from multiple modules).
gsap.registerPlugin(ScrollTrigger, useGSAP);

/** True when the user has requested reduced motion (client only). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Shared easing / timing tokens so motion feels consistent across the app. */
export const MOTION = {
  ease: "power3.out",
  duration: 0.7,
  stagger: 0.12,
  y: 24,
} as const;

export { gsap, ScrollTrigger, useGSAP };
