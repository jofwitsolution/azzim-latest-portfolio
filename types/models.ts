/**
 * Shared, serialized model types for use across the app (Server Components,
 * dashboard, API clients). These are type-only re-exports of each Mongoose
 * model's `InferSchemaType`-derived shape — importing from here never pulls the
 * Mongoose runtime into client bundles.
 */
export type { Project } from "@/models/Project";
export type { PortfolioItem } from "@/models/PortfolioItem";
export type { Experience, ExperienceKind } from "@/models/Experience";
export type { ResumeCard } from "@/models/ResumeCard";
export type { Certification } from "@/models/Certification";
export type { Service } from "@/models/Service";
export type { Blog } from "@/models/Blog";
