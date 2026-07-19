/**
 * Service — a service offering card (e.g. "UI/UX Design", "Security Consulting").
 */
import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    // Icon asset (Cloudinary secure_url + public_id).
    icon: { type: String, default: "" },
    iconPublicId: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

type ServiceDoc = InferSchemaType<typeof ServiceSchema>;

const Service =
  (models.Service as Model<ServiceDoc>) ||
  model<ServiceDoc>("Service", ServiceSchema);

export type Service = ServiceDoc & { _id: string };
export default Service;
