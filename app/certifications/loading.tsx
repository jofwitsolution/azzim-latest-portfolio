import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="top-padding">
      <div className="bg-linear-to-r from-primary-120 to-primary-100 py-14">
        <div className="max-width flex flex-col gap-4">
          <Skeleton className="h-9 w-80 max-w-full bg-white/25" />
          <Skeleton className="h-4 w-full max-w-2xl bg-white/20" />
        </div>
      </div>
      <div className="max-width py-12">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Skeleton className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
