import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton, TimelineSkeleton } from "@/components/skeletons";

/** Centered heading placeholder shared by public section fallbacks. */
function HeadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-6 w-28 rounded-full" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-1 w-24" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}

/** Fallback for the async Services section. */
export function ServicesSectionSkeleton() {
  return (
    <section className="padding-y">
      <div className="max-width">
        <HeadingSkeleton />
        <div className="mx-auto mt-14 grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card space-y-4 p-6">
              <Skeleton className="size-12 rounded-xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fallback for the async MyWork (case studies) section. */
export function WorkSectionSkeleton() {
  return (
    <section className="bg-muted/30 padding-y">
      <div className="max-width">
        <HeadingSkeleton />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <CardGridSkeleton className="mx-auto mt-12 max-w-[1100px]" />
      </div>
    </section>
  );
}

/** Fallback for the async Portfolio gallery section. */
export function GallerySectionSkeleton() {
  return (
    <section className="padding-y">
      <div className="max-width">
        <HeadingSkeleton />
        <div className="mx-auto mt-14 grid max-w-[1100px] auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-full w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fallback for the async Resume section (cards + timeline). */
export function ResumeSectionSkeleton() {
  return (
    <section className="padding-y">
      <div className="max-width">
        <HeadingSkeleton />
        <div className="mx-auto mt-14 grid max-w-[1100px] gap-6 md:mt-20 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="glass-card flex flex-col items-center gap-5 p-8"
            >
              <Skeleton className="size-20 rounded-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-11 w-40 rounded-md" />
            </div>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-[1150px]">
          <Skeleton className="mx-auto h-6 w-56" />
          <TimelineSkeleton className="mt-12" />
        </div>
      </div>
    </section>
  );
}
