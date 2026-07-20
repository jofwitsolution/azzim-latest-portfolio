import { cn } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  /** Small kicker/eyebrow label shown above the title. */
  eyebrow?: string;
  align?: "center" | "left";
  className?: string;
};

/**
 * Shared section heading — eyebrow + masked word-reveal title + gradient rule +
 * lead paragraph. Used across every public section for a consistent rhythm.
 */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">
            <span className="size-1.5 rounded-full bg-primary-200" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <SplitReveal
        as="h2"
        text={title}
        className="display text-3xl leading-[1.08] text-foreground sm:text-4xl md:text-5xl"
      />
      <Reveal delay={0.1}>
        <div
          className={cn(
            "h-[3px] w-20 rounded-full bg-linear-to-r from-primary-100 via-primary-200 to-primary-600",
            align === "center" && "mx-auto"
          )}
        />
      </Reveal>
      {subtitle && (
        <Reveal delay={0.15}>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export default SectionHeading;
