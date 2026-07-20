/**
 * Dashboard resource registry (client-safe).
 *
 * One declarative config per managed collection drives the generic admin
 * building blocks (form dialog + list/table). Field descriptors generate the
 * zod form schema, default values, edit values, and the API payload, so the
 * shape lives in exactly one place.
 *
 * IMPORTANT: this module is imported by Client Components, so it must NOT import
 * anything that pulls in Mongoose / server-only code (that's why the
 * experience-kind values are inlined rather than imported from the model, and
 * the API zod schemas in `lib/validation.ts` are not reused here).
 */
import { z, type ZodTypeAny } from "zod";
import {
  FolderKanban,
  LayoutGrid,
  Briefcase,
  FileText,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type FieldType =
  | "text"
  | "url"
  | "textarea"
  | "number"
  | "boolean"
  | "stringArray"
  | "select"
  | "color"
  | "image"
  | "pdf";

export type ResourceField = {
  /** Model field name (also the form field name). */
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  description?: string;
  /** Options for `select` fields. */
  options?: { label: string; value: string }[];
  /** For `image`/`pdf`: the paired field storing the Cloudinary public_id. */
  publicIdField?: string;
  /** Explicit default (else derived from type). */
  defaultValue?: string | number | boolean;
  /** Span the full width of the two-column form grid. */
  fullWidth?: boolean;
};

export type ResourceDef = {
  key: string;
  /** REST base path, e.g. "/api/projects". */
  apiPath: string;
  /** Plural label, e.g. "Projects". */
  title: string;
  /** Singular label, e.g. "Project". */
  singular: string;
  description: string;
  icon: LucideIcon;
  fields: ResourceField[];
  /** Field used as the list row's primary label. */
  listPrimary: string;
  /** Field used as the secondary/subtitle text. */
  listSecondary?: string;
  /** Field holding a thumbnail image url. */
  listImage?: string;
  /** Field whose value renders as a badge (e.g. an enum). */
  listBadge?: string;
};

/** A record with unknown-typed fields — a serialized model document. */
export type ResourceItem = Record<string, unknown> & { _id: string };

// ---------------------------------------------------------------------------
// Resource definitions
// ---------------------------------------------------------------------------

export const RESOURCES: ResourceDef[] = [
  {
    key: "projects",
    apiPath: "/api/projects",
    title: "Projects",
    singular: "Project",
    description: "Case-study projects shown in the My Work section.",
    icon: FolderKanban,
    listPrimary: "title",
    listSecondary: "mainCategory",
    listImage: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Project title" },
      { name: "mainCategory", label: "Main category", type: "text", placeholder: "e.g. UI/UX Design" },
      { name: "description", label: "Description", type: "textarea", fullWidth: true, placeholder: "Short summary of the project" },
      { name: "categories", label: "Categories", type: "stringArray", description: "One per line.", placeholder: "Web App\nBranding" },
      { name: "problem", label: "Problem", type: "textarea", fullWidth: true },
      { name: "solution", label: "Solution", type: "textarea", fullWidth: true },
      { name: "results", label: "Results", type: "stringArray", fullWidth: true, description: "One outcome per line.", placeholder: "Increased conversions by 30%" },
      { name: "image", label: "Cover image", type: "image", publicIdField: "imagePublicId", fullWidth: true },
      { name: "behance", label: "Behance URL", type: "url", placeholder: "https://behance.net/..." },
      { name: "source", label: "Source / live URL", type: "url", placeholder: "https://..." },
      { name: "featured", label: "Featured", type: "boolean", description: "Highlight this project on the home page." },
      { name: "order", label: "Order", type: "number", description: "Lower numbers appear first." },
    ],
  },
  {
    key: "portfolio-items",
    apiPath: "/api/portfolio-items",
    title: "Portfolio",
    singular: "Portfolio item",
    description: "Lightweight image tiles in the portfolio grid.",
    icon: LayoutGrid,
    listPrimary: "title",
    listSecondary: "category",
    listImage: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Item title" },
      { name: "category", label: "Category", type: "text", placeholder: "e.g. Branding" },
      { name: "description", label: "Description", type: "textarea", fullWidth: true },
      { name: "image", label: "Image", type: "image", publicIdField: "imagePublicId", fullWidth: true },
      { name: "source", label: "Source / live URL", type: "url", placeholder: "https://..." },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "experiences",
    apiPath: "/api/experiences",
    title: "Experience",
    singular: "Entry",
    description: "Work experience & education timeline entries.",
    icon: Briefcase,
    listPrimary: "job",
    listSecondary: "company",
    listBadge: "kind",
    fields: [
      {
        name: "kind",
        label: "Kind",
        type: "select",
        defaultValue: "experience",
        options: [
          { label: "Experience", value: "experience" },
          { label: "Education", value: "education" },
        ],
      },
      { name: "job", label: "Title / Qualification", type: "text", required: true, placeholder: "e.g. Product Designer" },
      { name: "company", label: "Company / Institution", type: "text", placeholder: "e.g. Acme Inc." },
      { name: "date", label: "Date range", type: "text", placeholder: "e.g. 2024 - Present" },
      { name: "jobType", label: "Type", type: "text", placeholder: "e.g. Hybrid, Full-Time" },
      { name: "role", label: "Description", type: "textarea", fullWidth: true, placeholder: "What you did / studied" },
      { name: "color", label: "Accent color", type: "color", defaultValue: "#4F46E5" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "resume-cards",
    apiPath: "/api/resume-cards",
    title: "Resume cards",
    singular: "Resume card",
    description: "Downloadable resume cards with a PDF.",
    icon: FileText,
    listPrimary: "title",
    listSecondary: "description",
    listImage: "icon",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. UI/UX Design Resume" },
      { name: "description", label: "Description", type: "textarea", fullWidth: true },
      { name: "icon", label: "Icon image", type: "image", publicIdField: "iconPublicId", fullWidth: true },
      { name: "pdfUrl", label: "Resume PDF", type: "pdf", publicIdField: "pdfPublicId", fullWidth: true },
      { name: "accent", label: "Accent", type: "text", placeholder: "e.g. indigo or a gradient class" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "certifications",
    apiPath: "/api/certifications",
    title: "Certifications",
    singular: "Certification",
    description: "Certificates and badges.",
    icon: Award,
    listPrimary: "title",
    listSecondary: "issuer",
    listImage: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Certificate name" },
      { name: "issuer", label: "Issuer", type: "text", placeholder: "e.g. Google" },
      { name: "date", label: "Issued", type: "text", placeholder: "e.g. February 2025" },
      { name: "validUntil", label: "Valid until", type: "text", placeholder: "e.g. Present, 2027" },
      { name: "type", label: "Type", type: "text", defaultValue: "Certificate", placeholder: "e.g. Certificate" },
      { name: "image", label: "Certificate image", type: "image", publicIdField: "imagePublicId", fullWidth: true },
      { name: "source", label: "Verification URL", type: "url", placeholder: "https://..." },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  {
    key: "services",
    apiPath: "/api/services",
    title: "Services",
    singular: "Service",
    description: "Service offering cards.",
    icon: Sparkles,
    listPrimary: "title",
    listSecondary: "description",
    listImage: "icon",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. UI/UX Design" },
      { name: "description", label: "Description", type: "textarea", fullWidth: true },
      { name: "icon", label: "Icon image", type: "image", publicIdField: "iconPublicId", fullWidth: true },
      { name: "order", label: "Order", type: "number" },
    ],
  },
];

export function getResource(key: string): ResourceDef | undefined {
  return RESOURCES.find((r) => r.key === key);
}

// ---------------------------------------------------------------------------
// Field ↔ form helpers
// ---------------------------------------------------------------------------

/** Build a zod object schema from a resource's field descriptors. */
export function buildFormSchema(fields: ResourceField[]): ZodTypeAny {
  const shape: Record<string, ZodTypeAny> = {};
  for (const f of fields) {
    switch (f.type) {
      case "number":
        shape[f.name] = z.coerce.number();
        break;
      case "boolean":
        shape[f.name] = z.boolean();
        break;
      default:
        shape[f.name] = f.required
          ? z.string().min(1, `${f.label} is required`)
          : z.string();
    }
    if (f.publicIdField) shape[f.publicIdField] = z.string();
  }
  return z.object(shape);
}

export type FormValues = Record<string, string | number | boolean>;

/** Default form values for a fresh "create" form. */
export function buildDefaultValues(fields: ResourceField[]): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) values[f.name] = f.defaultValue;
    else if (f.type === "number") values[f.name] = 0;
    else if (f.type === "boolean") values[f.name] = false;
    else values[f.name] = "";
    if (f.publicIdField) values[f.publicIdField] = "";
  }
  return values;
}

/** Map an existing item onto form values (for the edit form). */
export function itemToFormValues(
  fields: ResourceField[],
  item: ResourceItem
): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    const raw = item[f.name];
    if (f.type === "stringArray") {
      values[f.name] = Array.isArray(raw) ? raw.join("\n") : String(raw ?? "");
    } else if (f.type === "number") {
      values[f.name] = typeof raw === "number" ? raw : Number(raw ?? 0) || 0;
    } else if (f.type === "boolean") {
      values[f.name] = Boolean(raw);
    } else {
      values[f.name] = raw == null ? "" : String(raw);
    }
    if (f.publicIdField) {
      const pid = item[f.publicIdField];
      values[f.publicIdField] = pid == null ? "" : String(pid);
    }
  }
  return values;
}

/** Convert validated form values into the JSON payload the API expects. */
export function formValuesToPayload(
  fields: ResourceField[],
  values: FormValues
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === "stringArray") {
      payload[f.name] = String(v ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === "number") {
      payload[f.name] = Number(v ?? 0);
    } else if (f.type === "boolean") {
      payload[f.name] = Boolean(v);
    } else {
      payload[f.name] = v ?? "";
    }
    if (f.publicIdField) payload[f.publicIdField] = values[f.publicIdField] ?? "";
  }
  return payload;
}
