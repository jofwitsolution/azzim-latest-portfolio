"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  prefersReducedMotion,
  MOTION,
} from "@/lib/gsap";

type Direction = "up" | "down" | "left" | "right" | "none";

export type ScrollRevealOptions = {
  /** CSS selector (scoped to the container) for the elements to reveal.
   *  Omit to animate the container itself. */
  selector?: string;
  direction?: Direction;
  /** Travel distance in px for the slide-in. */
  distance?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
  /** Only animate once (default true). */
  once?: boolean;
};

function offset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
}

/**
 * Scroll-reveal hook. Attach the returned ref to a container; matching children
 * (or the container itself) fade/slide in on scroll. SSR-safe and cleaned up via
 * useGSAP; respects prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const containerRef = useRef<T>(null);
  const {
    selector,
    direction = "up",
    distance = MOTION.y,
    duration = MOTION.duration,
    stagger = MOTION.stagger,
    delay = 0,
    start = "top 85%",
    once = true,
  } = options;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const targets = selector
        ? gsap.utils.toArray<HTMLElement>(selector, container)
        : [container];
      if (targets.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap.set(targets, { autoAlpha: 0, ...offset(direction, distance) });
      gsap.to(targets, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        stagger,
        ease: MOTION.ease,
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
          once,
        },
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  return containerRef;
}
