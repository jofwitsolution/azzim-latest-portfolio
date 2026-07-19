/**
 * Server-side read helpers for the public site and dashboard.
 *
 * Per the data-fetching convention, Server Components read from the DB directly
 * through these helpers (not via the app's own API routes). All results are
 * `.lean()` and serialized to plain JSON so they can cross the Server → Client
 * component boundary (ObjectId / Date → string).
 *
 * Server-only: importing Mongoose models + `dbConnect` keeps this module out of
 * client bundles. Do not import it from a Client Component.
 */
import { dbConnect } from "@/lib/db/mongoose";
import ProjectModel from "@/models/Project";
import PortfolioItemModel from "@/models/PortfolioItem";
import ExperienceModel from "@/models/Experience";
import ResumeCardModel from "@/models/ResumeCard";
import CertificationModel from "@/models/Certification";
import ServiceModel from "@/models/Service";
import type {
  Project,
  PortfolioItem,
  Experience,
  ResumeCard,
  Certification,
  Service,
} from "@/types/models";

/** Deep-clone a Mongoose lean result into plain, client-safe JSON. */
function serialize<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function getProjects(): Promise<Project[]> {
  await dbConnect();
  const docs = await ProjectModel.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return serialize<Project[]>(docs);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  await dbConnect();
  const docs = await ProjectModel.find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return serialize<Project[]>(docs);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await dbConnect();
  const doc = await ProjectModel.findOne({ slug }).lean();
  return doc ? serialize<Project>(doc) : null;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  await dbConnect();
  const docs = await PortfolioItemModel.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return serialize<PortfolioItem[]>(docs);
}

export async function getExperiences(): Promise<Experience[]> {
  await dbConnect();
  const docs = await ExperienceModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return serialize<Experience[]>(docs);
}

export async function getResumeCards(): Promise<ResumeCard[]> {
  await dbConnect();
  const docs = await ResumeCardModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return serialize<ResumeCard[]>(docs);
}

export async function getCertifications(): Promise<Certification[]> {
  await dbConnect();
  const docs = await CertificationModel.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return serialize<Certification[]>(docs);
}

export async function getServices(): Promise<Service[]> {
  await dbConnect();
  const docs = await ServiceModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return serialize<Service[]>(docs);
}
