"use client";

/**
 * Generic create/edit form dialog, driven by a `ResourceDef`. Renders one input
 * per field descriptor (text, textarea, number, boolean, select, color, string
 * list, image/pdf upload), validates with a zod schema generated from the same
 * descriptors, and POSTs/PUTs to the resource's REST endpoint.
 */
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  UploadField,
  isCloudinaryWidgetTarget,
} from "@/components/dashboard/upload-field";
import {
  buildDefaultValues,
  buildFormSchema,
  formValuesToPayload,
  itemToFormValues,
  type FormValues,
  type ResourceDef,
  type ResourceField,
  type ResourceItem,
} from "@/lib/dashboard/config";

type ResourceFormProps = {
  def: ResourceDef;
  /** The item being edited, or null to create a new one. */
  item: ResourceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function ResourceForm({
  def,
  item,
  open,
  onOpenChange,
  onSuccess,
}: ResourceFormProps) {
  const schema = React.useMemo(() => buildFormSchema(def.fields), [def.fields]);
  const isEdit = Boolean(item);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(def.fields),
  });

  // Reset whenever the dialog opens (or the target item changes).
  React.useEffect(() => {
    if (!open) return;
    form.reset(
      item ? itemToFormValues(def.fields, item) : buildDefaultValues(def.fields)
    );
  }, [open, item, def.fields, form]);

  async function onSubmit(values: FormValues) {
    const payload = formValuesToPayload(def.fields, values);
    const url = isEdit ? `${def.apiPath}/${item!._id}` : def.apiPath;
    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(data?.message ?? "Request failed");
      }
      toast.success(
        isEdit ? `${def.singular} updated` : `${def.singular} created`
      );
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl"
        // The Cloudinary upload widget mounts outside the dialog; don't let
        // clicking/focusing it dismiss the form.
        onInteractOutside={(e) => {
          if (
            isCloudinaryWidgetTarget(e.detail.originalEvent.target) ||
            isCloudinaryWidgetTarget(document.activeElement)
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${def.singular.toLowerCase()}` : `New ${def.singular.toLowerCase()}`}
          </DialogTitle>
          <DialogDescription>{def.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {def.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  form={form}
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type FieldRendererProps = {
  field: ResourceField;
  form: ReturnType<typeof useForm<FormValues>>;
  disabled?: boolean;
};

function FieldRenderer({ field, form, disabled }: FieldRendererProps) {
  const fullWidth =
    field.fullWidth ||
    field.type === "textarea" ||
    field.type === "stringArray" ||
    field.type === "image" ||
    field.type === "pdf";

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: rhf }) => (
        <FormItem className={cn(fullWidth && "sm:col-span-2")}>
          <FormLabel>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <FieldControl field={field} rhf={rhf} form={form} disabled={disabled} />
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type FieldControlProps = {
  field: ResourceField;
  // react-hook-form field render props
  rhf: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLElement>;
  };
  form: ReturnType<typeof useForm<FormValues>>;
  disabled?: boolean;
};

function FieldControl({ field, rhf, form, disabled }: FieldControlProps) {
  switch (field.type) {
    case "textarea":
    case "stringArray":
      return (
        <Textarea
          rows={field.type === "stringArray" ? 4 : 3}
          placeholder={field.placeholder}
          disabled={disabled}
          value={String(rhf.value ?? "")}
          onChange={rhf.onChange}
          onBlur={rhf.onBlur}
        />
      );

    case "boolean":
      return (
        <div className="flex h-10 items-center">
          <Switch
            checked={Boolean(rhf.value)}
            onCheckedChange={rhf.onChange}
            disabled={disabled}
            aria-label={field.label}
          />
        </div>
      );

    case "select":
      return (
        <select
          className="border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          value={String(rhf.value ?? "")}
          onChange={rhf.onChange}
          onBlur={rhf.onBlur}
          disabled={disabled}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "color": {
      const raw = String(rhf.value ?? "");
      const swatch = /^#[0-9a-fA-F]{3,8}$/.test(raw) ? raw : "#4F46E5";
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={swatch}
            disabled={disabled}
            onChange={(e) => rhf.onChange(e.target.value)}
            className="border-input h-10 w-12 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
            aria-label={`${field.label} picker`}
          />
          <Input
            value={raw}
            placeholder="#4F46E5"
            disabled={disabled}
            onChange={rhf.onChange}
            onBlur={rhf.onBlur}
          />
        </div>
      );
    }

    case "number":
      return (
        <Input
          type="number"
          placeholder={field.placeholder}
          disabled={disabled}
          value={rhf.value === undefined || rhf.value === null ? "" : String(rhf.value)}
          onChange={(e) =>
            rhf.onChange(e.target.value === "" ? "" : e.target.valueAsNumber)
          }
          onBlur={rhf.onBlur}
        />
      );

    case "image":
    case "pdf":
      return (
        <UploadField
          type={field.type}
          value={String(rhf.value ?? "")}
          publicId={String(
            field.publicIdField ? form.getValues(field.publicIdField) ?? "" : ""
          )}
          disabled={disabled}
          onChange={(url, publicId) => {
            rhf.onChange(url);
            if (field.publicIdField) {
              form.setValue(field.publicIdField, publicId, { shouldDirty: true });
            }
          }}
        />
      );

    default:
      return (
        <Input
          type={field.type === "url" ? "url" : "text"}
          placeholder={field.placeholder}
          disabled={disabled}
          value={String(rhf.value ?? "")}
          onChange={rhf.onChange}
          onBlur={rhf.onBlur}
        />
      );
  }
}
