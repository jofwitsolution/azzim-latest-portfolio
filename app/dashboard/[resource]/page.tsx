import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getResource, type ResourceItem } from "@/lib/dashboard/config";
import { getResourceItems } from "@/lib/data/queries";
import { ResourceManager } from "@/components/dashboard/resource-manager";

// Reads live DB data behind the session cookie — never prerender.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ resource: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resource } = await params;
  const def = getResource(resource);
  return {
    title: def ? `${def.title} | Dashboard` : "Dashboard",
    robots: { index: false, follow: false },
  };
}

export default async function ResourcePage({ params }: PageProps) {
  const { resource } = await params;
  const def = getResource(resource);
  if (!def) notFound();

  const items = (await getResourceItems(resource)) as ResourceItem[];

  return <ResourceManager resourceKey={resource} initialItems={items} />;
}
