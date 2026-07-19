/**
 * Project — a full case-study project (the "My Work" section).
 *
 * Collection decision (plan 1.6): case studies and the lightweight portfolio
 * grid are kept as TWO separate collections rather than one `type`-discriminated
 * collection, because their shapes differ substantially (case studies carry
 * problem/solution/results/categories, portfolio cards are simple image tiles).
 * See {@link ../models/PortfolioItem.ts | PortfolioItem} for the grid cards.
 */
import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: [String], default: [] },
    mainCategory: { type: String, default: "" },
    categoryBg: { type: String, default: "" }, // legacy accent color for the category chip
    categories: { type: [String], default: [] },
    // Asset: store both the Cloudinary secure_url and its public_id for deletion/replacement.
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    behance: { type: String, default: "" },
    source: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

type ProjectDoc = InferSchemaType<typeof ProjectSchema>;

const Project =
  (models.Project as Model<ProjectDoc>) ||
  model<ProjectDoc>("Project", ProjectSchema);

export type Project = ProjectDoc & { _id: string };
export default Project;
