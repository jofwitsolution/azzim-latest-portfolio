# CLAUDE.md

Guidance for working in this repository. Follow these conventions when generating or editing code.

## Project overview
Personal portfolio for Azzim Aina, being transformed into a modern **dark-by-default** site with a
secured CMS **dashboard** (CRUD for projects, experience/education, resume cards, certifications,
services) backed by MongoDB. See `implementation-plan.md` for the task breakdown.

## Stack
- **Next.js 15** (App Router, Turbopack) · **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (`@theme` in `app/globals.css`, no `tailwind.config.js`)
- **MongoDB** via **Mongoose**
- **shadcn/ui** (Radix primitives in `components/ui`) · **lucide-react** icons
- **react-hook-form** + **zod** (`@hookform/resolvers`)
- **next-themes** (dark default + toggle) · **sonner** (toasts)
- **GSAP** + `@gsap/react` (`ScrollTrigger`) for animation
- **Quill** rich-text editor (blog)
- **Cloudinary** for file storage — `next-cloudinary` (client) + `cloudinary` Node SDK (server)

## Commands
```bash
npm run dev      # dev server (turbopack)
npm run build    # production build — must pass clean before done
npm run lint     # eslint
npm run seed     # seed DB from static data (once added)
```
Windows/PowerShell environment. Prefer running `npm run build` to catch type errors.

## Directory layout
- `app/` — routes (App Router). `(home)/` is the public landing; `api/` route handlers;
  `dashboard/` is the CMS (to be built); `blog/` existing blog + manager.
- `components/` — shared UI. `components/ui/` is shadcn (don't hand-edit generated primitives
  unless intentional). `components/navigations/`, `components/editor/`.
- `models/` — Mongoose schemas.
- `lib/` — `db/mongoose.ts` (cached connection), `data/` (static seed source), `utils.ts` (`cn`).
- `types/` — shared TS types.
- `public/` — images/docs served statically.

## Path aliases
Use `@/` for imports from the project root, e.g. `import { Button } from "@/components/ui/button"`.
No deep relative `../../..` chains.

---

## Next.js conventions
- **Server Components by default.** Only add `"use client"` when the file needs state, effects,
  browser APIs, event handlers, or client libs (GSAP, Quill, next-themes). Keep the boundary as
  low in the tree as possible — fetch data in a Server Component, pass to a small client child.
- **Data fetching:** read from the DB directly in Server Components (via Mongoose queries), not by
  fetching your own API routes. API routes exist for client-side mutations (dashboard CRUD).
- **Route handlers** (`app/api/**/route.ts`): always `await dbConnect()` first; validate input with
  zod; guard writes (POST/PUT/DELETE) with the session auth helper; return `Response.json(...)` with
  correct status codes (400 validation, 401 unauthorized, 404 missing, 201 created).
- **Mutations reflect on the site:** call `revalidatePath()` / set `revalidate` after writes so the
  public pages update.
- **Loading UX:** use `loading.tsx` and `<Suspense>` with **skeleton** fallbacks for async/streamed
  sections — never leave blank space while data resolves.
- **Metadata:** use the `metadata` export (or `generateMetadata`) — no manual `<head>` tags.
- **Images:** use `next/image` with explicit `width`/`height` (or `fill` + sized parent) and `alt`.
- **Params:** in Next 15, `params`/`searchParams` are async — `await` them in server components/handlers.
- **Env:** server secrets are plain `process.env.X`; only `NEXT_PUBLIC_*` is exposed to the client.
  Never leak `MONGODB_URI`, `ADMIN_PASSWORD`, `AUTH_SECRET`, or `CLOUDINARY_API_SECRET` to client code
  (only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` may be public).

## TypeScript conventions
- **No `any`.** Prefer precise types; use `unknown` + narrowing at boundaries. Avoid `@ts-ignore`
  (the existing one in `models/Blog.ts` is legacy, don't copy the pattern).
- Derive model types with Mongoose `InferSchemaType`; export a shared type per model.
- Validate all external input (request bodies, form values) with **zod**; infer form types with
  `z.infer<typeof schema>` so the schema is the single source of truth.
- Prefer `type` aliases for props/data shapes; name component props `XxxProps`.
- Use discriminated unions for variant data (e.g. Experience `kind: "experience" | "education"`).
- Explicit return types on exported functions/route handlers; let inference handle locals.
- Use `const` assertions / enums-as-unions instead of loose strings for fixed sets.

## Styling conventions
- **Tailwind v4** — theme tokens live in `@theme` in `app/globals.css`. Add colors/vars there,
  not in a JS config.
- Use **semantic theme tokens** (`bg-background`, `text-foreground`, `text-muted-foreground`,
  `border-border`) so light/dark both work. **Do not hardcode** `text-black`, `bg-white`,
  `bg-light-*` — that breaks dark mode.
- Compose conditional classes with `cn()` from `@/lib/utils` (clsx + tailwind-merge).
- Reuse shared utilities/classes (glass card, gradient text, glow) rather than repeating long
  class strings.
- Support both themes; verify contrast and focus states in each.

## Data / Mongoose conventions
- Reuse the cached `dbConnect()` from `lib/db/mongoose.ts` — don't call `mongoose.connect` elsewhere.
- Guard model registration against hot-reload: `models.X || model("X", schema)`.
- Enable `{ timestamps: true }`; add an `order` field for user-sortable collections.
- Use `.lean()` for read-only queries returned to the client; `select()` only needed fields.
- Keep validation in the schema **and** at the API boundary (zod).
- **Assets:** store both the Cloudinary `secure_url` and its `public_id` per asset field (e.g. `image`
  + `imagePublicId`) so files can be deleted/replaced.

## File storage (Cloudinary) conventions
- **All uploads go to Cloudinary** — images, resume PDFs, certification files. Do **not** add new
  files under `public/` for user-managed content; store the returned URL + `public_id` in the model.
- Configure the server SDK once in `lib/cloudinary.ts` (cloud name, key, secret). Never import the
  `cloudinary` Node SDK (or use the secret) in client code.
- Use a **signed** upload flow: a `requireAuth`-guarded route (`app/api/upload/sign`) signs the
  request; the client uses `next-cloudinary`'s `CldUploadWidget` with that signature. Don't rely on
  unsigned presets for dashboard uploads.
- Render Cloudinary images with `next-cloudinary`'s `CldImage` (or `next/image` with the remote
  domain allowed) — keep explicit `width`/`height` + `alt` per the Images convention.
- **Clean up on delete/replace:** when a record is deleted or its file swapped, call
  `cloudinary.uploader.destroy(public_id)` server-side so storage doesn't accumulate orphans.

---

## GSAP conventions
- **Client only.** Any component using GSAP must be `"use client"`.
- **Always use `@gsap/react`'s `useGSAP`** (or `gsap.context`) so animations are scoped and cleaned
  up on unmount — never leave raw `gsap.to` in a bare `useEffect` without cleanup.
- Register plugins once, guarded:
  ```tsx
  "use client";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { useGSAP } from "@gsap/react";
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ```
- Scope selectors to a ref container; prefer `useGSAP(() => {...}, { scope: containerRef })` and
  select with `gsap.utils.toArray` inside the scope rather than global selectors.
- Prefer **timelines** for sequenced/staggered motion; use `stagger` for lists/grids.
- Animate **transforms and opacity** (`x`, `y`, `scale`, `autoAlpha`) for performance — avoid
  animating layout properties (width/height/top/left).
- Use `ScrollTrigger` for scroll-reveals; set sensible `start`/`once`/`toggleActions`. Call
  `ScrollTrigger.refresh()` after dynamic content/layout changes if needed.
- **Respect `prefers-reduced-motion`** — skip or reduce animations when the user opts out.
- Centralize reusable motion in shared primitives (`<Reveal>`, `useScrollReveal`, stagger helper)
  instead of re-writing tweens per component.
- Guard against SSR/hydration flashes: initial hidden state should be applied so content doesn't
  flash before GSAP runs (e.g. `autoAlpha: 0` set, then animate in).

## Forms & UX
- Build forms with react-hook-form + `zodResolver`; render field errors via shadcn `Form`/`FormMessage`.
- Show pending/submitting states on buttons; use **skeletons** for loading lists/forms.
- Use **sonner** `toast` for success/error feedback on mutations.
- Confirm destructive actions (delete) before firing.

## Security
- Dashboard and all write APIs are protected by a password session (httpOnly cookie) — never trust
  client-only checks; enforce in route handlers + middleware.
- Sanitize/escape any user-supplied HTML (blog content) before rendering.
- Keep secrets in `.env`; document required keys in `README.md`.

## Definition of done
- `npm run build` and `npm run lint` pass with no new errors.
- Works in **both** light and dark themes; responsive on mobile → desktop.
- Async data has skeleton loading states; animations respect reduced-motion.
- New env vars documented in `README.md`.
