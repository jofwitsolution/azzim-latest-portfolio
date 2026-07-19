/**
 * ResumeCard — a downloadable resume card (e.g. "UI/UX Design Resume").
 * Both the icon and the PDF are Cloudinary assets, so each stores a public_id.
 */
import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

const ResumeCardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    // Icon asset (Cloudinary secure_url + public_id).
    icon: { type: String, default: "" },
    iconPublicId: { type: String, default: "" },
    // PDF asset (Cloudinary secure_url + public_id).
    pdfUrl: { type: String, default: "" },
    pdfPublicId: { type: String, default: "" },
    accent: { type: String, default: "" }, // accent color for the card
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

type ResumeCardDoc = InferSchemaType<typeof ResumeCardSchema>;

const ResumeCard =
  (models.ResumeCard as Model<ResumeCardDoc>) ||
  model<ResumeCardDoc>("ResumeCard", ResumeCardSchema);

export type ResumeCard = ResumeCardDoc & { _id: string };
export default ResumeCard;
