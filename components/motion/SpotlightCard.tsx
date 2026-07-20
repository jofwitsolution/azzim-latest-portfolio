"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  children: React.ReactNode;
};

/**
 * Card that tracks the pointer to feed the `.spotlight` radial highlight via
 * CSS custom properties (--mx/--my). Pair with `.spotlight` in className.
 */
export function SpotlightCard({
  as: Tag = "div",
  className,
  children,
  ...rest
}: SpotlightCardProps) {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag className={cn("spotlight", className)} onMouseMove={handleMove} {...rest}>
      {children}
    </Tag>
  );
}

export default SpotlightCard;
