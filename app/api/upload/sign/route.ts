/**
 * Signed Cloudinary upload endpoint.
 *
 * The dashboard uses next-cloudinary's `CldUploadWidget` with a
 * `signatureEndpoint` pointing here. The widget POSTs the params it wants signed
 * as `{ paramsToSign }`; we sign them with the server-only `CLOUDINARY_API_SECRET`
 * and return `{ signature }`. The secret never reaches the client.
 *
 * Guarded by `requireAuth()` so only the authenticated admin can obtain a
 * signature (uploads are a write action).
 */
import { NextRequest } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import {
  cloudinary,
  isCloudinaryConfigured,
  CLOUDINARY_FOLDER,
} from "@/lib/cloudinary";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await requireAuth();
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  if (!isCloudinaryConfigured()) {
    return Response.json(
      { message: "Cloudinary is not configured on the server" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const paramsToSign =
    body && typeof body === "object" && "paramsToSign" in body
      ? (body as { paramsToSign: Record<string, string> }).paramsToSign
      : undefined;

  if (!paramsToSign || typeof paramsToSign !== "object") {
    return Response.json({ message: "Missing paramsToSign" }, { status: 400 });
  }

  // Always namespace uploads under our folder, even if the client omits it.
  const toSign: Record<string, string> = {
    folder: CLOUDINARY_FOLDER,
    ...paramsToSign,
  };

  const signature = cloudinary.utils.api_sign_request(
    toSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return Response.json({ signature });
}
