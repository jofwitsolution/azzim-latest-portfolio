"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type SplitRevealProps = {
  text: string;
  as?: React.ElementType;
  className?: string;
  /** Extra classes applied per-word (e.g. gradient on a phrase). */
  wordClassName?: (word: string, index: number) => string | undefined;
  /** "load" animates immediately (hero); "scroll" waits for ScrollTrigger. */
  trigger?: "load" | "scroll";
  delay?: number;
  stagger?: number;
  duration?: number;
};

/**
 * Editorial headline reveal: each word rides up from behind a mask.
 * Animates transforms only, SSR-safe, respects reduced motion. See globals
 * `.split-line` for the mask styling.
 */
export function SplitReveal({
  text,
  as: Tag = "h2",
  className,
  wordClassName,
  trigger = "scroll",
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
}: SplitRevealProps) {
  const root = React.useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const inners = gsap.utils.toArray<HTMLElement>(
        "[data-split-inner]",
        root.current!
      );
      if (inners.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(inners, { yPercent: 0, autoAlpha: 1 });
        return;
      }

      gsap.set(inners, { yPercent: 115 });
      gsap.to(inners, {
        yPercent: 0,
        duration,
        delay,
        ease: "power4.out",
        stagger,
        ...(trigger === "scroll"
          ? { scrollTrigger: { trigger: root.current!, start: "top 82%", once: true } }
          : {}),
      });
    },
    { scope: root }
  );

  return (
    <Tag ref={root} className={cn(className)}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="split-line">
            <span
              data-split-inner
              className={cn(wordClassName?.(word, i))}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

export default SplitReveal;
