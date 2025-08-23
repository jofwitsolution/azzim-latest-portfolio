This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Blog Setup

This project includes a simple blog built with Next.js App Router and MongoDB (Mongoose), with SSR pages and a rich text editor for creating posts.

Prerequisites:
- Node.js 18+
- A MongoDB connection string

Environment:
- Create a .env.local file in the project root and set:

```
MONGODB_URI=your-mongodb-connection-string
MANAGE_KEY=your-secret-manage-key
```

Install and run:
- npm install
- npm run dev

Routes:
- GET /blog — Server-rendered paginated list of posts (title, date, cover image, excerpt)
- GET /blog/[slug] — Server-rendered blog detail page (full content, extra images, videos)
- GET /blog/manage?key=YOUR_KEY — Client page with tabs to Create, Update, and Delete posts (Quill editor for content). Protected by middleware; the `key` must match `MANAGE_KEY`.
- API: 
  - GET /api/blogs?page=1&limit=9&q=term — Paginated list with optional search
  - GET /api/blogs/[slug] — Single post by slug
  - POST /api/blogs?key=YOUR_KEY — Create post (server generates slug from title; requires `key`)
  - GET /api/blogs/id/[id] — Fetch a single post by id
  - PUT /api/blogs/id/[id]?key=YOUR_KEY — Update a post (changing title regenerates slug; requires `key`)
  - DELETE /api/blogs/id/[id]?key=YOUR_KEY — Delete a post (requires `key`)

Blog schema (Mongoose):
- title: string (required)
- slug: string (required, unique)
- excerpt: string
- contentHtml: string (required)
- coverImage: string (required)
- images: string[] (additional images for detail page)
- videos: string[] (video URLs for detail page)
- tags: string[]
- author: string
- publishedAt: Date

Notes:
- Access manage UI at /blog/manage?key=YOUR_KEY (replace with your MANAGE_KEY). The page is protected by Next.js middleware.
- Creating, updating, and deleting via API requires adding `?key=YOUR_KEY` to the request URL.
- The list page uses the single coverImage.
- Additional images and videos only show on the detail page.
- The create page accepts URLs for images and videos; no binary upload is handled.
- If you plan to accept untrusted content, consider sanitizing HTML before saving or rendering.
