"use client";

/**
 * Cloudinary upload field for the dashboard forms.
 *
 * Uses next-cloudinary's signed `CldUploadWidget` (signature comes from the
 * `requireAuth`-guarded `/api/upload/sign` route — the API secret never reaches
 * the client). On success it lifts both the `secure_url` and the `public_id` up
 * to the form so the model can store the pair and clean the asset up later.
 *
 * Handles images (live thumbnail preview) and PDFs (file chip + open link),
 * with remove/replace, plus a manual URL fallback so the field still works
 * before the browser upload key is configured.
 */
import * as React from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import type {
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { UploadCloud, X, FileText, ExternalLink, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * True when an event target (or the active element) lives inside the Cloudinary
 * upload widget, which mounts at `<body>` level — outside any Radix dialog.
 *
 * A modal `<Dialog>` treats clicks/focus on that widget as "outside" the dialog
 * and would dismiss it the instant you touch the widget. Host dialogs guard
 * their `onInteractOutside` with this so widget interactions don't close them.
 * (The pointer-events half of the fix lives in `app/globals.css`.)
 */
export function isCloudinaryWidgetTarget(target: EventTarget | null): boolean {
  const el = target instanceof Element ? target : null;
  return Boolean(el?.closest(".cloudinary-widget"));
}

type UploadFieldProps = {
  type: "image" | "pdf";
  value: string;
  publicId: string;
  onChange: (url: string, publicId: string) => void;
  disabled?: boolean;
};

export function UploadField({
  type,
  value,
  publicId,
  onChange,
  disabled,
}: UploadFieldProps) {
  const [showManual, setShowManual] = React.useState(false);

  function handleSuccess(results: CloudinaryUploadWidgetResults) {
    const info = results.info;
    if (info && typeof info !== "string") {
      const asset = info as CloudinaryUploadWidgetInfo;
      onChange(asset.secure_url, asset.public_id);
    }
  }

  function clear() {
    onChange("", "");
  }

  const hasValue = Boolean(value);

  return (
    <div className="space-y-3">
      {hasValue && (
        <div className="border-border bg-muted/30 relative flex items-center gap-3 rounded-lg border p-3">
          {type === "image" ? (
            <div className="bg-background relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
              {/* Cloudinary domain allowed in next.config remotePatterns */}
              <Image
                src={value}
                alt="Upload preview"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-md">
              <FileText className="size-7" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">
              {publicId || value}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary mt-1 inline-flex items-center gap-1 text-xs transition-colors"
            >
              <ExternalLink className="size-3" /> Open {type}
            </a>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive shrink-0"
            onClick={clear}
            disabled={disabled}
            aria-label="Remove file"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <CldUploadWidget
          signatureEndpoint="/api/upload/sign"
          options={{
            folder: "azzim-portfolio",
            resourceType: type === "pdf" ? "auto" : "image",
            multiple: false,
            sources: ["local", "url", "camera"],
            clientAllowedFormats:
              type === "pdf" ? ["pdf"] : ["png", "jpg", "jpeg", "webp", "svg", "gif"],
          }}
          onSuccess={handleSuccess}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => open()}
              disabled={disabled}
            >
              <UploadCloud className="size-4" />
              {hasValue ? "Replace" : `Upload ${type}`}
            </Button>
          )}
        </CldUploadWidget>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowManual((v) => !v)}
          disabled={disabled}
        >
          <Link2 className="size-4" />
          Paste URL
        </Button>
      </div>

      {showManual && (
        <Input
          value={value}
          placeholder="https://res.cloudinary.com/..."
          disabled={disabled}
          onChange={(e) => onChange(e.target.value, publicId)}
          className={cn("text-sm")}
        />
      )}
    </div>
  );
}
