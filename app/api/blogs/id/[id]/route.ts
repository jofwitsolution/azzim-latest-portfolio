import {NextRequest} from "next/server";
import {dbConnect} from "@/lib/db/mongoose";
import BlogModel, {generateUniqueSlug} from "@/models/Blog";

export async function GET(_req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const {id} = await params;
    const doc = await BlogModel.findById(id).lean();
    if (!doc) return new Response(JSON.stringify({message: "Not found"}), {status: 404});
    return Response.json(doc);
}

export async function PUT(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    await dbConnect();
    // Verify manage key from query param
    const { searchParams } = new URL(req.url);
    const provided = searchParams.get("key") || "";
    const expected = process.env.MANAGE_KEY || "";
    if (!expected || provided !== expected) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const {id} = await params;
    const body = await req.json();

    const allowed: any = {};
    const fields = ["title", "excerpt", "contentHtml", "coverImage", "images", "videos", "tags", "author", "publishedAt"];
    for (const key of fields) if (key in body) allowed[key] = body[key];
    if (allowed.publishedAt) allowed.publishedAt = new Date(allowed.publishedAt);

    const slug = await generateUniqueSlug(BlogModel, allowed.title)
    const updated = await BlogModel.findByIdAndUpdate(id, {$set: {...allowed, slug}}, {new: true, runValidators: true});
    if (!updated) return new Response(JSON.stringify({message: "Not found"}), {status: 404});
    return Response.json(updated);
}

export async function DELETE(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    await dbConnect();
    // Verify manage key from query param
    const { searchParams } = new URL(req.url);
    const provided = searchParams.get("key") || "";
    const expected = process.env.MANAGE_KEY || "";
    if (!expected || provided !== expected) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const {id} = await params;
    const deleted = await BlogModel.findByIdAndDelete(id);
    if (!deleted) return new Response(JSON.stringify({message: "Not found"}), {status: 404});
    return new Response(null, {status: 204});
}
