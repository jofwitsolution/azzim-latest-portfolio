import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/mongoose";
import BlogModel from "@/models/Blog";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  await dbConnect();
  const { slug } = params;
  const doc = await BlogModel.findOne({ slug }).lean();
  if (!doc) {
    return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  }
  return Response.json(doc);
}
