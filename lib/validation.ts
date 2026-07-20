/**
 * Zod schemas for the CRUD API boundary. The schema is the single source of
 * truth for request validation; dashboard forms infer their types from these
 * via `z.infer`. Asset fields accept the Cloudinary `secure_url` + `public_id`
 * pair the client sends after a signed upload.
 *
 * `slug` is never accepted from the client — it's generated server-side from the
 * title (see `slugFrom` in the resource registry).
 *
 * Each resource exposes a `create` schema (required fields enforced) and an
 * `update` schema (all fields optional, for partial PUTs).
 */
import { z } from "zod";
import { EXPERIENCE_KINDS } from "@/models/Experience";

const str = z.string();
const optStr = z.string().optional();
const optBool = z.boolean().optional();
const optNum = z.number().optional();
const optStrArr = z.array(z.string()).optional();

// --- Project (case study) ---
export const projectCreateSchema = z.object({
  title: str.min(1, "Title is required"),
  description: optStr,
  problem: optStr,
  solution: optStr,
  results: optStrArr,
  mainCategory: optStr,
  categoryBg: optStr,
  categories: optStrArr,
  image: optStr,
  imagePublicId: optStr,
  behance: optStr,
  source: optStr,
  featured: optBool,
  order: optNum,
});
export const projectUpdateSchema = projectCreateSchema.partial();

// --- PortfolioItem (grid card) ---
export const portfolioItemCreateSchema = z.object({
  title: str.min(1, "Title is required"),
  category: optStr,
  categoryBg: optStr,
  description: optStr,
  source: optStr,
  image: optStr,
  imagePublicId: optStr,
  order: optNum,
});
export const portfolioItemUpdateSchema = portfolioItemCreateSchema.partial();

// --- Experience / Education ---
export const experienceCreateSchema = z.object({
  kind: z.enum(EXPERIENCE_KINDS).optional(),
  job: str.min(1, "Job title is required"),
  company: optStr,
  date: optStr,
  jobType: optStr,
  role: optStr,
  color: optStr,
  order: optNum,
});
export const experienceUpdateSchema = experienceCreateSchema.partial();

// --- ResumeCard ---
export const resumeCardCreateSchema = z.object({
  title: str.min(1, "Title is required"),
  description: optStr,
  icon: optStr,
  iconPublicId: optStr,
  pdfUrl: optStr,
  pdfPublicId: optStr,
  accent: optStr,
  order: optNum,
});
export const resumeCardUpdateSchema = resumeCardCreateSchema.partial();

// --- Certification ---
export const certificationCreateSchema = z.object({
  title: str.min(1, "Title is required"),
  issuer: optStr,
  date: optStr,
  validUntil: optStr,
  type: optStr,
  source: optStr,
  image: optStr,
  imagePublicId: optStr,
  order: optNum,
});
export const certificationUpdateSchema = certificationCreateSchema.partial();

// --- Service ---
export const serviceCreateSchema = z.object({
  title: str.min(1, "Title is required"),
  description: optStr,
  icon: optStr,
  iconPublicId: optStr,
  order: optNum,
});
export const serviceUpdateSchema = serviceCreateSchema.partial();
