/**
 * PortfolioItem — a lightweight card in the portfolio grid ("My Portfolio").
 *
 * Kept separate from {@link ../models/Project.ts | Project} (see plan 1.6): this
 * is a simple image/title/link tile, whereas Project holds full case studies.
 */
import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

const PortfolioItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    categoryBg: { type: String, default: "" }, // legacy accent color for the category chip
    description: { type: String, default: "" },
    source: { type: String, default: "" },
    // Asset: store both the Cloudinary secure_url and its public_id.
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

type PortfolioItemDoc = InferSchemaType<typeof PortfolioItemSchema>;

const PortfolioItem =
  (models.PortfolioItem as Model<PortfolioItemDoc>) ||
  model<PortfolioItemDoc>("PortfolioItem", PortfolioItemSchema);

export type PortfolioItem = PortfolioItemDoc & { _id: string };
export default PortfolioItem;
