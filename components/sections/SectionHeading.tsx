import { cn } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  /** Small kicker/eyebrow label shown above the title. */
  eyebrow?: string;
  align?: "center" | "left";
  className?: string;
};

/**
 * Shared section heading — eyebrow + gradient-accented title + underline + lead
 * paragraph. Reveals on scroll. Used across every public section for a
 * consistent rhythm (see Phase 7.9).
 */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <div
        className={cn(
          "h-[4px] w-24 rounded-full bg-linear-to-r from-primary-100 to-primary-200",
          align === "center" && "mx-auto"
        )}
      />
      {subtitle && (
        <p className="max-w-2xl text-muted-foreground">{subtitle}</p>
      )}
    </Reveal>
  );
}

export default SectionHeading;
