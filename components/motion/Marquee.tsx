import * as React from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
};

/**
 * Infinite horizontal marquee. Content is duplicated so the -50% translate
 * loops seamlessly; pauses on hover, halts under reduced motion (see globals).
 */
export function Marquee({ items, className, duration = 32 }: MarqueeProps) {
  return (
    <div className={cn("marquee-mask group/mq overflow-hidden", className)}>
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            aria-hidden={dup === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item, i) => (
              <li
                key={`${dup}-${i}`}
                className="flex items-center gap-6 whitespace-nowrap px-6 text-lg font-semibold text-muted-foreground/70 md:text-xl"
              >
                <span className="transition-colors hover:text-foreground">
                  {item}
                </span>
                <span className="text-primary-200/60" aria-hidden>
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
