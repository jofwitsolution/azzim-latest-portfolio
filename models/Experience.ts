/**
 * Experience — a single entry in the Experience & Education timeline.
 * `kind` discriminates work experience from education (they share the timeline).
 */
import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

export const EXPERIENCE_KINDS = ["experience", "education"] as const;
export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number];

const ExperienceSchema = new Schema(
  {
    kind: {
      type: String,
      enum: EXPERIENCE_KINDS,
      default: "experience",
      index: true,
    },
    job: { type: String, required: true, trim: true }, // job title / qualification
    company: { type: String, default: "" }, // company / institution
    date: { type: String, default: "" }, // free-form range, e.g. "2024 - Present"
    jobType: { type: String, default: "" }, // e.g. "Hybrid", "Part-Time"
    role: { type: String, default: "" }, // description of the role / study
    color: { type: String, default: "#4F46E5" }, // timeline accent color
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

type ExperienceDoc = InferSchemaType<typeof ExperienceSchema>;

const Experience =
  (models.Experience as Model<ExperienceDoc>) ||
  model<ExperienceDoc>("Experience", ExperienceSchema);

export type Experience = ExperienceDoc & { _id: string };
export default Experience;
