import type { Model } from "mongoose";

/** Turn an arbitrary title into a URL-safe slug. */
export function slugify(title: string): string {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // spaces to dashes
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}

/**
 * Generate a slug for `baseTitle` that is unique within the given model's
 * collection. Pass `excludeId` when updating so the document doesn't collide
 * with itself.
 */
export async function generateUniqueSlug(
  ModelRef: Model<{ slug: string }>,
  baseTitle: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(baseTitle) || "item";
  let slug = base;
  let i = 0;
  while (i < 1000) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await ModelRef.exists(query);
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`; // fallback
}
