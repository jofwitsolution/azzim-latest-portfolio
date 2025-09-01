import Link from "next/link";
import { dbConnect } from "@/lib/db/mongoose";
import BlogModel from "@/models/Blog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Azzim Aina",
  description:
    "Read the latest articles on UX design, cybersecurity, research, and more.",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(parseInt(sp?.page || "1", 10), 1);
  const limit = 9;
  await dbConnect();
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    BlogModel.find({})
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt coverImage publishedAt author tags")
      .lean(),
    BlogModel.countDocuments({}),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <main className="container mx-auto min-h-screen px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 md:mb-8">The latest articles</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No blog posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((post: any) => (
            <Card key={post._id} className="overflow-hidden !pt-0">
              <div className="aspect-[16/9] w-full bg-muted/50">
                {/* Use native img to avoid Next/Image domain config issues */}
                <a href={`/blog/${post.slug}`}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>
              <CardHeader className="gap-2">
                <CardTitle>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:underline text-lg"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {formatDate(post.publishedAt)}{" "}
                  {post.author ? `• ${post.author}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <PaginationButton page={page - 1} disabled={page <= 1}>
            Previous
          </PaginationButton>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <PaginationButton page={page + 1} disabled={page >= totalPages}>
            Next
          </PaginationButton>
        </div>
      )}
    </main>
  );
}

function PaginationButton({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const href = page <= 1 ? "/blog" : `/blog?page=${page}`;
  return (
    <Button asChild variant="outline" size="sm" disabled={disabled}>
      <Link href={href} aria-disabled={disabled}>
        {children}
      </Link>
    </Button>
  );
}
