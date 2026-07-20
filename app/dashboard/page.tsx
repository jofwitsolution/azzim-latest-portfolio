import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

import { getCollectionCounts } from "@/lib/data/queries";
import { RESOURCES } from "@/lib/dashboard/config";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

type OverviewCard = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const CARDS: OverviewCard[] = [
  ...RESOURCES.map((r) => ({
    key: r.key,
    title: r.title,
    description: r.description,
    href: `/dashboard/${r.key}`,
    icon: r.icon,
  })),
  {
    key: "blog",
    title: "Blog",
    description: "Write and manage blog posts.",
    href: "/blog/manage",
    icon: Newspaper,
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage every section of your portfolio from one place.
        </p>
      </div>

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>
    </div>
  );
}

async function StatsGrid() {
  const counts = await getCollectionCounts();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className="glass-card group hover:border-primary/40 relative flex flex-col gap-3 p-5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <card.icon className="size-5" />
            </div>
            <span className="text-3xl font-semibold tabular-nums">
              {counts[card.key] ?? 0}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{card.title}</h3>
            <p className="text-muted-foreground line-clamp-1 text-sm">
              {card.description}
            </p>
          </div>
          <span className="text-primary mt-auto inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
            Manage <ArrowRight className="size-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: CARDS.length }).map((_, i) => (
        <div key={i} className="glass-card flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-8 w-10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
