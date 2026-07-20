/**
 * Server-side Cloudinary SDK.
 *
 * Configured once here and reused by the signed-upload route and the CRUD
 * handlers (to delete/replace assets). SERVER-ONLY — never import this from a
 * Client Component: it carries `CLOUDINARY_API_SECRET`.
 *
 * The cloud name may be provided as either `CLOUDINARY_CLOUD_NAME` or the
 * public `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (the widget needs the public one on
 * the client, so we accept it here too to avoid duplicating config).
 */
import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/** True when all three credentials are present; otherwise uploads/signing fail. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

/** The folder all dashboard uploads are namespaced under. */
export const CLOUDINARY_FOLDER = "azzim-portfolio";

/**
 * Delete an asset by its `public_id`. Best-effort and never throws — a failed
 * cleanup should not fail the surrounding request; we log and move on so a stale
 * asset (not a broken API call) is the worst case.
 *
 * The model only stores the `public_id`, not the resource type, so we try the
 * plausible types (images, then raw PDFs, then video) until one succeeds.
 */
export async function destroyAsset(publicId: string | undefined | null): Promise<void> {
  if (!publicId || !isCloudinaryConfigured()) return;
  const resourceTypes = ["image", "raw", "video"] as const;
  for (const resourceType of resourceTypes) {
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });
      if (res.result === "ok") return;
    } catch (err) {
      console.error(`[cloudinary] destroy failed for ${publicId} (${resourceType})`, err);
    }
  }
}

export { cloudinary };
