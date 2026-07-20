"use client";

import * as React from "react";
import { Loader2, TriangleAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Async delete action; the dialog shows a pending state while it runs. */
  onConfirm: () => Promise<void>;
  title?: string;
  label?: string;
};

/** Reusable destructive-action confirmation. */
export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete item",
  label,
}: DeleteDialogProps) {
  const [pending, setPending] = React.useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !pending && onOpenChange(o)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="bg-destructive/10 text-destructive mb-1 flex size-10 items-center justify-center rounded-full">
            <TriangleAlert className="size-5" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {label ? (
              <>
                This will permanently delete{" "}
                <span className="text-foreground font-medium">{label}</span> and
                any attached files. This action cannot be undone.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
