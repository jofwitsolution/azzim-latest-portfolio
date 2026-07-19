/**
 * Certification — a certificate/badge shown in the certifications section.
 */
import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

const CertificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" }, // free-form, e.g. "February 2025"
    validUntil: { type: String, default: "" }, // e.g. "Present", "2027"
    type: { type: String, default: "Certificate" },
    source: { type: String, default: "" }, // verification / credential URL
    // Asset: store both the Cloudinary secure_url and its public_id.
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

type CertificationDoc = InferSchemaType<typeof CertificationSchema>;

const Certification =
  (models.Certification as Model<CertificationDoc>) ||
  model<CertificationDoc>("Certification", CertificationSchema);

export type Certification = CertificationDoc & { _id: string };
export default Certification;
