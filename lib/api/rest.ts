/**
 * Reusable CRUD route factory.
 *
 * The five managed collections (Projects, Portfolio, Experience, Resume cards,
 * Certifications, Services) share identical REST semantics, so instead of
 * copy-pasting handlers we build them from one config. Per project conventions:
 *   - `await dbConnect()` first, validate bodies with zod (400 on failure),
 *   - guard writes (POST/PUT/DELETE) with `requireAuth()` (401 on failure),
 *   - `revalidatePath()` public routes after a successful write,
 *   - clean up replaced/deleted Cloudinary assets by `public_id`,
 *   - return correct status codes (200/201/204/400/401/404).
 *
 * GET handlers are public (the same data the site renders); only mutations are
 * guarded.
 */
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError, type ZodTypeAny } from "zod";
import type { Model } from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { requireAuth, AuthError } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slugify";
import { destroyAsset } from "@/lib/cloudinary";

/** A Cloudinary asset field pair on the model, for delete/replace cleanup. */
export type AssetFieldPair = {
  /** Field holding the secure_url (e.g. "image"). */
  url: string;
  /** Field holding the public_id (e.g. "imagePublicId"). */
  publicId: string;
};

export type ResourceConfig = {
  /** The Mongoose model to operate on. */
  model: Model<Record<string, unknown>>;
  /** Zod schema for POST bodies (required fields enforced). */
  createSchema: ZodTypeAny;
  /** Zod schema for PUT bodies (all optional / partial). */
  updateSchema: ZodTypeAny;
  /** When set, generate a unique slug from this field on create and when it changes. */
  slugFrom?: string;
  /** Asset pairs to destroy on delete and when replaced on update. */
  assets?: AssetFieldPair[];
  /** Public paths to revalidate after a successful write. */
  revalidate?: string[];
};

type PlainDoc = Record<string, unknown>;

/** Narrowing helper so callers can pass their typed models without variance friction. */
export function defineResource(config: ResourceConfig): ResourceConfig {
  return config;
}

function badRequest(message: string): Response {
  return Response.json({ message }, { status: 400 });
}

/** Map a thrown error to the right response; re-return unknown errors as 500. */
function handleError(err: unknown): Response {
  if (err instanceof AuthError) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (err instanceof ZodError) {
    return badRequest(err.issues[0]?.message ?? "Invalid input");
  }
  console.error("[api] unexpected error", err);
  return Response.json({ message: "Internal server error" }, { status: 500 });
}

async function parseJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ZodError([
      { code: "custom", message: "Invalid JSON body", path: [] },
    ]);
  }
}

function revalidate(paths: string[] | undefined): void {
  for (const path of paths ?? []) revalidatePath(path);
}

/** Build `GET` (list) + `POST` (create) handlers for a collection route. */
export function collectionHandlers(config: ResourceConfig) {
  const { model, createSchema, slugFrom, revalidate: paths } = config;

  async function GET(): Promise<Response> {
    try {
      await dbConnect();
      const docs = await model.find().sort({ order: 1, createdAt: -1 }).lean();
      return Response.json(docs);
    } catch (err) {
      return handleError(err);
    }
  }

  async function POST(req: NextRequest): Promise<Response> {
    try {
      await requireAuth();
      await dbConnect();
      const body = await parseJson(req);
      const data = createSchema.parse(body) as PlainDoc;

      if (slugFrom) {
        const base = String(data[slugFrom] ?? "");
        data.slug = await generateUniqueSlug(
          model as unknown as Model<{ slug: string }>,
          base
        );
      }

      const created = await model.create(data);
      revalidate(paths);
      return Response.json(created, { status: 201 });
    } catch (err) {
      return handleError(err);
    }
  }

  return { GET, POST };
}

/** Build `GET` (read) + `PUT` (update) + `DELETE` handlers for an item route. */
export function itemHandlers(config: ResourceConfig) {
  const { model, updateSchema, slugFrom, assets, revalidate: paths } = config;

  async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<Response> {
    try {
      await dbConnect();
      const { id } = await params;
      const doc = await model.findById(id).lean();
      if (!doc) return Response.json({ message: "Not found" }, { status: 404 });
      return Response.json(doc);
    } catch (err) {
      return handleError(err);
    }
  }

  async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<Response> {
    try {
      await requireAuth();
      await dbConnect();
      const { id } = await params;
      const body = await parseJson(req);
      const data = updateSchema.parse(body) as PlainDoc;

      const existing = (await model.findById(id).lean()) as PlainDoc | null;
      if (!existing) return Response.json({ message: "Not found" }, { status: 404 });

      // Regenerate the slug only when the source field is actually changing.
      if (slugFrom && slugFrom in data) {
        data.slug = await generateUniqueSlug(
          model as unknown as Model<{ slug: string }>,
          String(data[slugFrom] ?? ""),
          id
        );
      }

      const updated = await model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).lean();
      if (!updated) return Response.json({ message: "Not found" }, { status: 404 });

      // Destroy any asset that was replaced by this update.
      for (const asset of assets ?? []) {
        if (!(asset.publicId in data)) continue;
        const oldId = existing[asset.publicId];
        const newId = data[asset.publicId];
        if (typeof oldId === "string" && oldId && oldId !== newId) {
          await destroyAsset(oldId);
        }
      }

      revalidate(paths);
      return Response.json(updated);
    } catch (err) {
      return handleError(err);
    }
  }

  async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<Response> {
    try {
      await requireAuth();
      await dbConnect();
      const { id } = await params;
      const deleted = (await model.findByIdAndDelete(id).lean()) as PlainDoc | null;
      if (!deleted) return Response.json({ message: "Not found" }, { status: 404 });

      for (const asset of assets ?? []) {
        const publicId = deleted[asset.publicId];
        if (typeof publicId === "string") await destroyAsset(publicId);
      }

      revalidate(paths);
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  }

  return { GET, PUT, DELETE };
}
