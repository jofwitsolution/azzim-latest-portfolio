import { cn } from "@/lib/utils";

type EmptyStateProps = {
  message: string;
  className?: string;
};

/**
 * Neutral empty-state placeholder rendered when a collection has no rows
 * (Phase 6.3). Keeps sections from collapsing to blank space.
 */
export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-card mx-auto flex max-w-md flex-col items-center gap-2 px-6 py-12 text-center text-muted-foreground",
        className
      )}
    >
      <span className="text-2xl">✦</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default EmptyState;
