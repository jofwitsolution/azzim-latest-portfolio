/**
 * Resource registry — one config per managed collection, shared between the
 * collection route (`route.ts`) and the item route (`[id]/route.ts`) so both
 * agree on schema, slug source, asset cleanup, and revalidation.
 *
 * Models are cast to the factory's generic doc shape; each keeps its own precise
 * type at every other call site.
 */
import type { Model } from "mongoose";
import { defineResource } from "@/lib/api/rest";
import ProjectModel from "@/models/Project";
import PortfolioItemModel from "@/models/PortfolioItem";
import ExperienceModel from "@/models/Experience";
import ResumeCardModel from "@/models/ResumeCard";
import CertificationModel from "@/models/Certification";
import ServiceModel from "@/models/Service";
import {
  projectCreateSchema,
  projectUpdateSchema,
  portfolioItemCreateSchema,
  portfolioItemUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  resumeCardCreateSchema,
  resumeCardUpdateSchema,
  certificationCreateSchema,
  certificationUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
} from "@/lib/validation";

/** Cast a typed model to the factory's generic doc shape. */
function asGeneric(model: unknown): Model<Record<string, unknown>> {
  return model as Model<Record<string, unknown>>;
}

/** Every managed collection reflects onto the public home page. */
const PUBLIC_PATHS = ["/"];

export const projectResource = defineResource({
  model: asGeneric(ProjectModel),
  createSchema: projectCreateSchema,
  updateSchema: projectUpdateSchema,
  slugFrom: "title",
  assets: [{ url: "image", publicId: "imagePublicId" }],
  revalidate: PUBLIC_PATHS,
});

export const portfolioItemResource = defineResource({
  model: asGeneric(PortfolioItemModel),
  createSchema: portfolioItemCreateSchema,
  updateSchema: portfolioItemUpdateSchema,
  assets: [{ url: "image", publicId: "imagePublicId" }],
  revalidate: PUBLIC_PATHS,
});

export const experienceResource = defineResource({
  model: asGeneric(ExperienceModel),
  createSchema: experienceCreateSchema,
  updateSchema: experienceUpdateSchema,
  revalidate: PUBLIC_PATHS,
});

export const resumeCardResource = defineResource({
  model: asGeneric(ResumeCardModel),
  createSchema: resumeCardCreateSchema,
  updateSchema: resumeCardUpdateSchema,
  assets: [
    { url: "icon", publicId: "iconPublicId" },
    { url: "pdfUrl", publicId: "pdfPublicId" },
  ],
  revalidate: PUBLIC_PATHS,
});

export const certificationResource = defineResource({
  model: asGeneric(CertificationModel),
  createSchema: certificationCreateSchema,
  updateSchema: certificationUpdateSchema,
  assets: [{ url: "image", publicId: "imagePublicId" }],
  // Certifications render on their own page (plus reflected counts on home).
  revalidate: [...PUBLIC_PATHS, "/certifications"],
});

export const serviceResource = defineResource({
  model: asGeneric(ServiceModel),
  createSchema: serviceCreateSchema,
  updateSchema: serviceUpdateSchema,
  assets: [{ url: "icon", publicId: "iconPublicId" }],
  revalidate: PUBLIC_PATHS,
});
