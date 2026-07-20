"use client";

/**
 * Generic list-manager for a single collection. Renders the rows, an "add"
 * button, and wires the create/edit form dialog + delete confirmation. After
 * any mutation it calls `router.refresh()` so the server-rendered list (and the
 * public site, via revalidatePath) reflect the change.
 */
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, ImageOff, GripVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListSkeleton } from "@/components/skeletons";
import { ResourceForm } from "@/components/dashboard/resource-form";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import {
  getResource,
  type ResourceDef,
  type ResourceItem,
} from "@/lib/dashboard/config";
import { cn } from "@/lib/utils";

type ResourceManagerProps = {
  resourceKey: string;
  initialItems: ResourceItem[];
};

export function ResourceManager({
  resourceKey,
  initialItems,
}: ResourceManagerProps) {
  const def = getResource(resourceKey);
  const router = useRouter();

  const [items, setItems] = React.useState<ResourceItem[]>(initialItems);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ResourceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ResourceItem | null>(null);
  const [isPending, startTransition] = React.useTransition();

  // Keep in sync with fresh server data after a refresh.
  React.useEffect(() => setItems(initialItems), [initialItems]);

  if (!def) {
    return (
      <p className="text-muted-foreground">Unknown resource: {resourceKey}</p>
    );
  }

  const Icon = def.icon;

  function refresh() {
    startTransition(() => router.refresh());
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ResourceItem) {
    setEditing(item);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget || !def) return;
    const res = await fetch(`${def.apiPath}/${deleteTarget._id}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 204) {
      const data = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      toast.error(data?.message ?? "Delete failed");
      throw new Error("delete failed");
    }
    toast.success(`${def.singular} deleted`);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Icon className="text-primary size-6" />
            {def.title}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{def.description}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add {def.singular.toLowerCase()}
        </Button>
      </div>

      <div
        className={cn(
          "transition-opacity",
          isPending && "pointer-events-none opacity-60"
        )}
      >
        {items.length === 0 ? (
          <EmptyState def={def} onCreate={openCreate} />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <ResourceRow
                key={item._id}
                item={item}
                def={def}
                onEdit={() => openEdit(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </ul>
        )}
      </div>

      <ResourceForm
        def={def}
        item={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={refresh}
      />

      <DeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${def.singular.toLowerCase()}`}
        label={
          deleteTarget ? String(deleteTarget[def.listPrimary] ?? "") : undefined
        }
      />
    </div>
  );
}

/** Skeleton shown while the manager's server page streams. */
export function ResourceManagerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-7 w-40 animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded-md" />
        </div>
        <div className="bg-muted h-9 w-28 animate-pulse rounded-md" />
      </div>
      <ListSkeleton count={5} />
    </div>
  );
}

function ResourceRow({
  item,
  def,
  onEdit,
  onDelete,
}: {
  item: ResourceItem;
  def: ResourceDef;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = def.icon;
  const primary = String(item[def.listPrimary] ?? "Untitled");
  const secondary = def.listSecondary
    ? String(item[def.listSecondary] ?? "")
    : "";
  const image = def.listImage ? String(item[def.listImage] ?? "") : "";
  const badge = def.listBadge ? String(item[def.listBadge] ?? "") : "";
  const order = typeof item.order === "number" ? item.order : undefined;
  const featured = item.featured === true;

  return (
    <li className="border-border bg-card hover:border-primary/40 flex items-center gap-4 rounded-xl border p-3 transition-colors sm:p-4">
      <span className="text-muted-foreground hidden shrink-0 sm:block">
        <GripVertical className="size-4" />
      </span>

      <div className="bg-muted relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <Icon className="text-muted-foreground size-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-foreground truncate font-medium">{primary}</p>
          {badge && (
            <Badge variant="secondary" className="capitalize">
              {badge}
            </Badge>
          )}
          {featured && <Badge>Featured</Badge>}
        </div>
        {secondary && (
          <p className="text-muted-foreground mt-0.5 truncate text-sm">
            {secondary}
          </p>
        )}
      </div>

      {order !== undefined && (
        <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">
          #{order}
        </span>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label={`Edit ${primary}`}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          aria-label={`Delete ${primary}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}

function EmptyState({
  def,
  onCreate,
}: {
  def: ResourceDef;
  onCreate: () => void;
}) {
  const Icon = def.icon;
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </div>
      <p className="text-foreground font-medium">No {def.title.toLowerCase()} yet</p>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        {def.description}
      </p>
      <Button className="mt-5" onClick={onCreate}>
        <Plus className="size-4" />
        Add your first {def.singular.toLowerCase()}
      </Button>
    </div>
  );
}
