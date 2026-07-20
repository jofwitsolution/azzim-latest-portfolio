/**
 * Database seed script (Phase 5).
 *
 * Populates the CMS collections from the existing static data so the site has
 * real content before the dashboard/public wiring lands:
 *   - `projects`      (lib/data/mock.ts) → PortfolioItem (grid cards)
 *   - `myWork`        (lib/data/mock.ts) → Project       (case studies)
 *   - `experiences`   (lib/data/mock.ts) → Experience    (split into experience/education)
 *   - `certifications`(lib/data/mock.ts) → Certification
 *   - `services`      (lib/data/mock.ts) → Service
 *   - the two resume cards (app/(home)/components/Resume.tsx, replicated below) → ResumeCard
 *
 * Asset handling: every `/public` image, icon and PDF referenced by the static
 * data is uploaded to Cloudinary (deterministic `public_id`, `overwrite:false`)
 * and the returned `secure_url` + `public_id` are persisted on the model. Because
 * the `public_id` is deterministic, re-runs reuse the same Cloudinary asset (no
 * re-upload, no orphans). The DB write is an upsert keyed on a natural field, and
 * an asset that a document already stores is reused rather than re-uploaded.
 *
 * Usage:
 *   npm run seed            # idempotent upsert
 *   npm run seed -- --fresh # wipe the seeded collections first, then reseed
 *
 * Env is loaded from `.env` via `dotenv/config` (imported first so `dbConnect`
 * and the Cloudinary SDK read their config at module-eval time).
 */
import "dotenv/config";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

import { dbConnect } from "../lib/db/mongoose";
import { cloudinary, isCloudinaryConfigured, CLOUDINARY_FOLDER } from "../lib/cloudinary";
import { slugify } from "../lib/slugify";
import ProjectModel from "../models/Project";
import PortfolioItemModel from "../models/PortfolioItem";
import ExperienceModel from "../models/Experience";
import ResumeCardModel from "../models/ResumeCard";
import CertificationModel from "../models/Certification";
import ServiceModel from "../models/Service";
import {
  projects as portfolioData,
  myWork as caseStudyData,
  experiences as experienceData,
  certifications as certificationData,
  services as serviceData,
} from "../lib/data/mock";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

const FRESH = process.argv.includes("--fresh");

type ResourceType = "image" | "raw" | "auto";
type Asset = { url: string; publicId: string };
const EMPTY_ASSET: Asset = { url: "", publicId: "" };

/** Deterministic Cloudinary public_id (without folder) for a `/public` path. */
function assetIdFor(publicPath: string): string {
  return publicPath
    .replace(/^\/+/, "")
    .replace(/\.[^.]+$/, "") // drop extension
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Upload a `/public`-relative asset to Cloudinary and return its secure_url +
 * public_id. Missing local files yield an empty asset (logged, not fatal); an
 * upload error falls back to the original `/public` path so the site still
 * renders something.
 */
async function uploadAsset(publicPath: string, resourceType: ResourceType): Promise<Asset> {
  if (!publicPath) return EMPTY_ASSET;
  if (!isCloudinaryConfigured()) {
    // No Cloudinary creds — keep the local path so the site still renders.
    return { url: publicPath, publicId: "" };
  }
  const fullPath = path.join(PUBLIC_DIR, publicPath.replace(/^\/+/, ""));
  if (!existsSync(fullPath)) {
    console.warn(`  ! missing local asset, skipping upload: ${publicPath}`);
    return EMPTY_ASSET;
  }
  try {
    const res = await cloudinary.uploader.upload(fullPath, {
      public_id: `${CLOUDINARY_FOLDER}/seed/${assetIdFor(publicPath)}`,
      resource_type: resourceType,
      overwrite: false,
      unique_filename: false,
      use_filename: false,
      invalidate: true,
    });
    return { url: res.secure_url, publicId: res.public_id };
  } catch (err) {
    console.warn(`  ! upload failed for ${publicPath}, falling back to local path`, err);
    return { url: publicPath, publicId: "" };
  }
}

/**
 * Return the asset a document already stores (skip re-upload) or upload afresh.
 */
async function ensureAsset(
  existingUrl: string | undefined | null,
  existingPublicId: string | undefined | null,
  publicPath: string,
  resourceType: ResourceType
): Promise<Asset> {
  if (existingUrl && existingPublicId) {
    return { url: existingUrl, publicId: existingPublicId };
  }
  return uploadAsset(publicPath, resourceType);
}

/** Heuristic: does a timeline entry describe education rather than work? */
function isEducation(job: string, company: string, role: string): boolean {
  const text = `${job} ${company} ${role}`.toLowerCase();
  return /\b(bachelor|master|b\.?sc|m\.?sc|phd|degree|diploma|university|institute|college|school|studied)\b/.test(
    text
  );
}

async function seedPortfolioItems(): Promise<number> {
  console.log("• Portfolio items");
  for (const [i, item] of portfolioData.entries()) {
    const existing = await PortfolioItemModel.findOne({ title: item.title });
    const image = await ensureAsset(existing?.image, existing?.imagePublicId, item.image, "image");
    await PortfolioItemModel.updateOne(
      { title: item.title },
      {
        $set: {
          title: item.title,
          category: item.category,
          categoryBg: item.category_bg,
          description: item.description,
          source: item.source,
          image: image.url,
          imagePublicId: image.publicId,
          order: i,
        },
      },
      { upsert: true }
    );
  }
  return portfolioData.length;
}

async function seedProjects(): Promise<number> {
  console.log("• Projects (case studies)");
  for (const [i, item] of caseStudyData.entries()) {
    const slug = slugify(item.title);
    const existing = await ProjectModel.findOne({ slug });
    const image = await ensureAsset(existing?.image, existing?.imagePublicId, item.image, "image");
    await ProjectModel.updateOne(
      { slug },
      {
        $set: {
          title: item.title,
          slug,
          description: item.description,
          problem: item.problem,
          solution: item.solution,
          results: item.results,
          mainCategory: item.mainCategory,
          categoryBg: item.category_bg,
          categories: item.categories,
          image: image.url,
          imagePublicId: image.publicId,
          behance: item.behance,
          source: item.source,
          featured: i < 3,
          order: i,
        },
      },
      { upsert: true }
    );
  }
  return caseStudyData.length;
}

async function seedExperiences(): Promise<number> {
  console.log("• Experience & education");
  for (const [i, item] of experienceData.entries()) {
    const kind = isEducation(item.job, item.company, item.role) ? "education" : "experience";
    await ExperienceModel.updateOne(
      { job: item.job, company: item.company },
      {
        $set: {
          kind,
          job: item.job,
          company: item.company,
          date: item.date,
          jobType: item.jobType,
          role: item.role,
          color: item.color,
          order: i,
        },
      },
      { upsert: true }
    );
  }
  return experienceData.length;
}

async function seedCertifications(): Promise<number> {
  console.log("• Certifications");
  for (const [i, item] of certificationData.entries()) {
    const existing = await CertificationModel.findOne({ title: item.title });
    const image = await ensureAsset(existing?.image, existing?.imagePublicId, item.image, "image");
    await CertificationModel.updateOne(
      { title: item.title },
      {
        $set: {
          title: item.title,
          issuer: item.issuer,
          date: item.date,
          validUntil: item.validUntil,
          type: item.type,
          source: item.source,
          image: image.url,
          imagePublicId: image.publicId,
          order: i,
        },
      },
      { upsert: true }
    );
  }
  return certificationData.length;
}

async function seedServices(): Promise<number> {
  console.log("• Services");
  for (const [i, item] of serviceData.entries()) {
    const existing = await ServiceModel.findOne({ title: item.title });
    const icon = await ensureAsset(existing?.icon, existing?.iconPublicId, item.icon, "image");
    await ServiceModel.updateOne(
      { title: item.title },
      {
        $set: {
          title: item.title,
          description: item.description,
          icon: icon.url,
          iconPublicId: icon.publicId,
          order: i,
        },
      },
      { upsert: true }
    );
  }
  return serviceData.length;
}

/** The two resume cards are UI-hardcoded in Resume.tsx; replicated here. */
const resumeCardData = [
  {
    title: "UI/UX Design Resume",
    description:
      "A comprehensive overview of my design experience, process, and skills. Includes case studies and measurable results from previous projects.",
    icon: "/icons/bag.svg",
    pdfUrl: "/docs/azzim-aina-uiux-cv.pdf",
    accent: "#4F46E5",
  },
  {
    title: "Cybersecurity Resume",
    description:
      "Detailing my technical expertise in cybersecurity, including certifications, security assessments, and threat mitigation strategies.",
    icon: "/icons/security.svg",
    pdfUrl: "/docs/azzim-aina-cyber-cv.pdf",
    accent: "#0891B2",
  },
];

async function seedResumeCards(): Promise<number> {
  console.log("• Resume cards");
  for (const [i, item] of resumeCardData.entries()) {
    const existing = await ResumeCardModel.findOne({ title: item.title });
    const icon = await ensureAsset(existing?.icon, existing?.iconPublicId, item.icon, "image");
    const pdf = await ensureAsset(existing?.pdfUrl, existing?.pdfPublicId, item.pdfUrl, "auto");
    await ResumeCardModel.updateOne(
      { title: item.title },
      {
        $set: {
          title: item.title,
          description: item.description,
          icon: icon.url,
          iconPublicId: icon.publicId,
          pdfUrl: pdf.url,
          pdfPublicId: pdf.publicId,
          accent: item.accent,
          order: i,
        },
      },
      { upsert: true }
    );
  }
  return resumeCardData.length;
}

async function main(): Promise<void> {
  console.log(`\n🌱 Seeding database${FRESH ? " (--fresh: wiping first)" : ""}…`);
  if (!isCloudinaryConfigured()) {
    console.warn(
      "⚠  Cloudinary is not fully configured — assets will keep their /public paths instead of uploading."
    );
  }

  await dbConnect();

  if (FRESH) {
    await Promise.all([
      PortfolioItemModel.deleteMany({}),
      ProjectModel.deleteMany({}),
      ExperienceModel.deleteMany({}),
      CertificationModel.deleteMany({}),
      ServiceModel.deleteMany({}),
      ResumeCardModel.deleteMany({}),
    ]);
    console.log("• Cleared existing seeded collections");
  }

  const counts = {
    portfolioItems: await seedPortfolioItems(),
    projects: await seedProjects(),
    experiences: await seedExperiences(),
    certifications: await seedCertifications(),
    services: await seedServices(),
    resumeCards: await seedResumeCards(),
  };

  console.log("\n✅ Seed complete:");
  for (const [name, count] of Object.entries(counts)) {
    console.log(`   ${name.padEnd(16)} ${count}`);
  }
}

main()
  .then(async () => {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("\n❌ Seed failed:", err);
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
