# Azzim Aina — Portfolio + CMS

A modern, **dark-by-default** personal portfolio with a secured CMS dashboard. Projects,
Experience & Education, Resume cards, Certifications, Services and the Blog are all managed
from `/dashboard` and stored in MongoDB, with file uploads on Cloudinary.

**Stack:** Next.js 15 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
MongoDB/Mongoose · shadcn/ui · react-hook-form + zod · next-themes · GSAP · Cloudinary.

## Getting Started

Prerequisites: Node.js 18+ and a MongoDB connection string.

```bash
# Install (React 19 + react-quill peer ranges require legacy-peer-deps)
npm install --legacy-peer-deps

# Copy env template and fill in values
cp .env.example .env      # then edit .env

# Seed the database from the static content (idempotent; --fresh wipes + reseeds)
npm run seed

# Run the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and
[http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the CMS (redirects to
`/login`).

## Scripts

| Command         | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| `npm run dev`   | Dev server (Turbopack).                                             |
| `npm run build` | Production build — type-checks the whole project; must pass clean.  |
| `npm run start` | Serve the production build.                                         |
| `npm run lint`  | ESLint (`next/core-web-vitals`).                                    |
| `npm run seed`  | Seed the DB from `lib/data/mock.ts`; uploads seed assets to Cloudinary. Pass `--fresh` to wipe + reseed. |

## Environment variables

All required keys are listed in [`.env.example`](.env.example). Copy it to `.env` and fill in
values. Summary:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | server | MongoDB connection string. |
| `ADMIN_PASSWORD` | server | Password entered on `/login`. |
| `AUTH_SECRET` | server | Signs/verifies the session cookie. |
| `CLOUDINARY_CLOUD_NAME` | server | Cloudinary cloud name. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | client | Same value, exposed to the upload widget. |
| `CLOUDINARY_API_KEY` | server | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | server | Cloudinary API secret — never expose to the client. |
| `RESEND_API_KEY` | server | Resend API key for the contact form — never expose to the client. |
| `RESEND_FROM` | server | Verified sender address emails are sent from (optional; defaults to `onboarding@resend.dev`). |
| `CONTACT_TO` | server | Inbox that contact-form submissions are delivered to (optional; defaults to `azzimaina@gmail.com`). |

## Dashboard

The CMS lives under `/dashboard` (a collapsible sidebar shell with theme toggle and logout):

- `/dashboard` — overview with a count per collection and quick links.
- `/dashboard/projects`, `/dashboard/portfolio-items`, `/dashboard/experiences`,
  `/dashboard/resume-cards`, `/dashboard/certifications`, `/dashboard/services` — each is a
  list + create/edit/delete manager generated from a shared config
  (`lib/dashboard/config.ts`), with a signed Cloudinary upload field and an order input.
- `/blog/manage` — the existing Blog manager, linked from the sidebar and secured by the same
  session.

## Dashboard Authentication

The CMS dashboard (`/dashboard/*`) and all content write APIs are protected by a
password-based session. Logging in sets a signed, httpOnly cookie
(`azzim_session`, HMAC-SHA256, 7-day expiry). The middleware guards
`/dashboard/:path*` and redirects unauthenticated visitors to `/login`.

Environment variables:

```
ADMIN_PASSWORD=your-strong-admin-password   # the password entered on /login
AUTH_SECRET=a-long-random-secret            # signs/verifies the session cookie
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Routes:

- `GET /login` — styled password form (redirects to `/dashboard` if already signed in).
- `POST /api/auth/login` — validates the password, sets the session cookie.
- `POST /api/auth/logout` — clears the session cookie.

In route handlers / server components, use the helpers in `lib/auth.ts`:
`getSession()` (returns the session or `null`) and `requireAuth()` (returns the
session or throws `AuthError` — guard write methods with it and return `401`).

## Content CRUD APIs

REST endpoints back the dashboard's create/update/delete. `GET` is public (same
data the site renders); `POST`/`PUT`/`DELETE` require the admin session
(`requireAuth()` → `401`). Bodies are validated with zod (`400` on failure) and
successful writes `revalidatePath("/")` so the public site reflects changes.

| Collection             | List / create          | Item (read / update / delete) |
| ---------------------- | ---------------------- | ----------------------------- |
| Projects               | `/api/projects`        | `/api/projects/[id]`          |
| Portfolio items        | `/api/portfolio-items` | `/api/portfolio-items/[id]`   |
| Experience & Education | `/api/experiences`     | `/api/experiences/[id]`       |
| Resume cards           | `/api/resume-cards`    | `/api/resume-cards/[id]`      |
| Certifications         | `/api/certifications`  | `/api/certifications/[id]`    |
| Services               | `/api/services`        | `/api/services/[id]`          |

Handlers are generated from a shared factory (`lib/api/rest.ts`) and a per-model
config registry (`lib/api/resources.ts`).

## File uploads (Cloudinary)

All dashboard uploads (images, resume PDFs, certification files) go to
Cloudinary via a **signed** flow — the secret never reaches the client. The
`CldUploadWidget` requests a signature from `POST /api/upload/sign`
(`requireAuth`-guarded), which signs the params server-side. Uploads are
namespaced under the `azzim-portfolio` folder. Each asset field stores both the
`secure_url` and its `public_id`; deleting a record or replacing an asset calls
`cloudinary.uploader.destroy(public_id)` (`destroyAsset` in `lib/cloudinary.ts`)
so storage doesn't accumulate orphans.

Environment variables:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name              # server-side cloud name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name  # same value, exposed to the upload widget
CLOUDINARY_API_KEY=your-api-key                    # server only
CLOUDINARY_API_SECRET=your-api-secret              # server only — never expose
```

## Blog

A blog built with the App Router and MongoDB (Mongoose): SSR list/detail pages and a Quill
rich-text editor for authoring. Write access uses the **same admin session** as the rest of the
dashboard — the old `?key=`/`MANAGE_KEY` guard has been retired from the request path.

Routes:

- `GET /blog` — Server-rendered paginated list of posts (title, date, cover image, excerpt).
- `GET /blog/[slug]` — Server-rendered detail page (full content, extra images, videos).
- `GET /blog/manage` — Create / Update / Delete tabs (Quill editor). Guarded by the middleware
  session; unauthenticated visitors are redirected to `/login`.
- API:
  - `GET /api/blogs?page=1&limit=9&q=term` — Paginated list with optional search.
  - `GET /api/blogs/[slug]` — Single post by slug.
  - `POST /api/blogs` — Create (server generates the slug; `requireAuth()`).
  - `GET /api/blogs/id/[id]` — Fetch a single post by id.
  - `PUT /api/blogs/id/[id]` — Update (changing the title regenerates the slug; `requireAuth()`).
  - `DELETE /api/blogs/id/[id]` — Delete (`requireAuth()`).

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

- Access the manage UI at `/blog/manage` after logging in — it is protected by the same session
  middleware as the rest of the dashboard.
- Create/update/delete via the API require the admin session cookie (`requireAuth()`).
- The list page uses the single coverImage.
- Additional images and videos only show on the detail page.
- The create page accepts URLs for images and videos; no binary upload is handled.
- If you plan to accept untrusted content, consider sanitizing HTML before saving or rendering.
