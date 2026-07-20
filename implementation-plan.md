# Implementation Plan — Modern Dark Portfolio + CMS Dashboard

Transform the portfolio into a modern, aesthetic, **dark-by-default** website and make
**Projects, Experience & Education, Resume cards, and Certifications & Services** fully
database-managed (CRUD) from a secured `/dashboard`, alongside the existing Blog CMS.

## Decisions (confirmed)
- **Auth:** Password login → httpOnly cookie session, protecting `/dashboard/*` and all write APIs.
- **File storage:** **Cloudinary** for all uploads (project/portfolio images, resume PDFs,
  certification images). Dashboard forms upload to Cloudinary; models store the returned secure
  URL (+ `public_id` for later deletion) instead of `/public` paths.
- **CRUD scope:** Projects (case studies + portfolio grid), Experience & Education, Resume cards,
  Certifications, Services. Blog already exists.
- **Design:** Sleek dark default with indigo→cyan glow, glassmorphism, subtle gradients, scroll
  animations, and a working light/dark toggle.

## Tech notes
- Next.js 15 App Router, React 19, Tailwind v4, Mongoose, shadcn/ui, react-hook-form + zod,
  sonner, next-themes (already installed — currently unused).
- **File storage:** Cloudinary via `next-cloudinary` (`CldUploadWidget`/`CldImage`) on the client
  and the `cloudinary` Node SDK on the server. Uploads use a **signed** flow — a server route
  signs the request with `CLOUDINARY_API_SECRET`; the secret never reaches the client. Delete an
  asset by `public_id` (server-side) when its record is removed or its file is replaced.
- **Animation:** GSAP (with `ScrollTrigger`) for all motion — hero entrance, scroll-reveals,
  staggered card/grid reveals, hover/parallax accents. Wrapped in React-safe hooks
  (`useGSAP` / `gsap.context` cleanup).
- **Loading UX:** shadcn `Skeleton` (already present) used wherever data is fetched async —
  public sections during SSR fallback/streaming and every dashboard list/form while loading.

---

## Phase 0 — Foundations & Theming
- [x] 0.1 Wire up `next-themes`: create a `ThemeProvider`, add it in `app/layout.tsx`, set
  `defaultTheme="dark"` + `attribute="class"` + `suppressHydrationWarning` on `<html>`.
- [x] 0.2 Rework `globals.css`: refine the `.dark` palette (indigo/cyan accents, glass surfaces,
  glow shadows), make `:root` the light variant, replace body `text-grey-100` with token-based
  `text-foreground` / `bg-background`.
- [x] 0.3 Add reusable design utilities: glass card, gradient text, glow border, section container.
- [x] 0.3b Install GSAP (`gsap` + `@gsap/react`), register `ScrollTrigger`, and build reusable
  animation primitives: a `<Reveal>` wrapper (fade/slide on scroll), a `useScrollReveal` hook,
  and a stagger helper — all using `useGSAP`/`gsap.context` for proper cleanup and SSR safety.
- [x] 0.3c Add reusable skeleton components (card skeleton, list-row skeleton, timeline skeleton,
  form skeleton) built on the existing shadcn `Skeleton`.
- [x] 0.4 Build a `ThemeToggle` button and place it in the Navbar (desktop + mobile).
- [x] 0.5 Audit hardcoded light-only colors (`text-black`, `bg-light-*`, `bg-white`) across
  components and convert to theme tokens so both themes render correctly.

## Phase 1 — Data Layer (Mongoose Models)
- [x] 1.1 `models/Project.ts` — case-study project (title, slug, description, problem, solution,
  results[], mainCategory, categories[], image, behance, source, featured, order).
- [x] 1.2 `models/PortfolioItem.ts` — lightweight portfolio grid card (title, category, description,
  source, image, order). *(Or fold into Project with a `type` field — decide in 1.6.)*
- [x] 1.3 `models/Experience.ts` — timeline entry (kind: "experience" | "education", job/title,
  company, date, jobType, role, color, order).
- [x] 1.4 `models/ResumeCard.ts` — resume download card (title, description, icon, pdfUrl, accent, order).
- [x] 1.5 `models/Certification.ts` and `models/Service.ts`.
- [x] 1.6 Finalize whether Projects + Portfolio share one collection (`type` discriminator) or two;
  document the choice at the top of the models. **→ Two separate collections** (`Project` for case
  studies, `PortfolioItem` for grid cards); their shapes differ too much to share cleanly. Documented
  in the header of each model.
- [x] 1.7 Shared TypeScript types in `types/` and a small `lib/data/queries.ts` for server reads.
  (`types/models.ts` re-exports each model's inferred type; `lib/data/queries.ts` holds `.lean()`
  serialized read helpers; slug generation lives in `lib/slugify.ts`.)
- [x] 1.8 For every asset field (`image`, `pdfUrl`, certification image, …) store both the Cloudinary
  `secure_url` and its `public_id` (e.g. `image` + `imagePublicId`) so assets can be deleted/replaced.

## Phase 2 — Authentication
- [x] 2.1 `lib/auth.ts` — session helpers: sign/verify a signed httpOnly cookie (using `ADMIN_PASSWORD`
  + a secret from env); `getSession()` and `requireAuth()`.
- [x] 2.2 `app/login/page.tsx` — styled login form (password), posts to `/api/auth/login`.
- [x] 2.3 `app/api/auth/login` + `app/api/auth/logout` route handlers (set/clear cookie).
- [x] 2.4 Update `middleware.ts` to protect `/dashboard/:path*` (redirect to `/login`) and keep/retire
  the old `?key=` blog guard.
- [x] 2.5 Add `ADMIN_PASSWORD` + `AUTH_SECRET` to `.env` and document in README.

## Phase 3 — CRUD APIs
- [x] 3.1 `app/api/projects` (GET list, POST) + `app/api/projects/[id]` (GET, PUT, DELETE).
- [x] 3.2 `app/api/experiences` + `[id]`.
- [x] 3.3 `app/api/resume-cards` + `[id]`.
- [x] 3.4 `app/api/certifications` + `[id]`.
- [x] 3.5 `app/api/services` + `[id]`.
  *(Also added `app/api/portfolio-items` + `[id]` — same CRUD scope, needed for the portfolio grid.)*
  *(Handlers are generated from a shared factory `lib/api/rest.ts` + config registry `lib/api/resources.ts`;
  zod schemas in `lib/validation.ts`.)*
- [x] 3.6 Guard all write methods (POST/PUT/DELETE) with `requireAuth()`; return proper status codes.
- [x] 3.7 (Optional) Migrate Blog write auth from `?key=` to the new session guard for consistency.
  **→ Done in 4.9** — blog write routes (`POST /api/blogs`, `PUT`/`DELETE /api/blogs/id/[id]`) now use
  `requireAuth()`; `middleware.ts` guards `/blog/manage` by session; `ManageBlog.tsx` no longer threads
  `?key=` through its fetches. Legacy `MANAGE_KEY` retired from the request path.
- [x] 3.8 **Cloudinary integration:**
  - `lib/cloudinary.ts` — configured server-side `cloudinary` SDK instance (cloud name, key, secret) +
    a best-effort `destroyAsset(public_id)` helper.
  - `app/api/upload/sign` (POST, `requireAuth`) — returns a signature for the signed
    `CldUploadWidget` flow (uploads namespaced under the `azzim-portfolio` folder).
  - On resource DELETE (or when an asset is replaced on PUT), call `cloudinary.uploader.destroy(public_id)`
    to remove the old asset so storage doesn't leak orphans.

## Phase 4 — Dashboard UI (`/dashboard`)
- [x] 4.1 Dashboard layout with a sidebar (shadcn `sidebar` already present) + header + logout.
  (`app/dashboard/layout.tsx` + `components/dashboard/dashboard-shell.tsx` — collapsible sidebar nav,
  sticky header with theme toggle + view-site, `LogoutButton`; public Navbar/Footer hidden on `/dashboard`.)
- [x] 4.2 Overview page: counts per collection + quick links.
  (`app/dashboard/page.tsx` — `getCollectionCounts()` stat cards linking to each manager, Suspense skeleton.)
- [x] 4.3 Reusable admin building blocks: data table/list, resource form dialog, delete confirm,
  a **Cloudinary upload field** (`CldUploadWidget`) with live image/PDF preview and remove/replace,
  drag-to-reorder (or order number input).
  (Driven by a declarative `lib/dashboard/config.ts` registry: `ResourceManager` list, `ResourceForm`
  dialog, `DeleteDialog`, `UploadField` signed upload with preview + replace/remove, order-number input.)
- [x] 4.3b Loading states: skeleton rows while lists load, skeleton form while an item loads for
  edit, and submit/pending states on every mutation.
  (`loading.tsx` → `ResourceManagerSkeleton`, overview stat-card skeleton, pending states on submit/delete
  and a fade while the list refreshes.)
- [x] 4.4 Projects manager (list, create, edit, delete). *(+ Portfolio manager, same building blocks.)*
- [x] 4.5 Experience & Education manager (with kind toggle via a `kind` select).
- [x] 4.6 Resume cards manager.
- [x] 4.7 Certifications manager.
- [x] 4.8 Services manager.
  *(All six managers are generated from the shared config at `app/dashboard/[resource]/page.tsx`.)*
- [x] 4.9 Link the existing Blog manager into the dashboard nav (and secure via session).
  (Sidebar links to `/blog/manage`; auth migrated to the shared session — see 3.7.)

## Phase 5 — Seed Script
- [x] 5.1 `scripts/seed.ts` — connect via existing `dbConnect()`, read arrays from `lib/data/mock.ts`
  (projects, myWork, experiences, certifications, services) + the two resume cards from `Resume.tsx`.
- [x] 5.2 Map static shapes → model shapes; split `experiences` array into experience vs education by
  content; assign `order` from array index. For asset fields, **upload the existing `/public` images
  and PDFs to Cloudinary** (`cloudinary.uploader.upload`) and persist the returned `secure_url` +
  `public_id` (skip re-upload on idempotent runs).
- [x] 5.3 Make it idempotent (upsert by slug/title, or `--fresh` flag to wipe+reseed).
- [x] 5.4 Add `"seed": "tsx scripts/seed.ts"` script; install `tsx` + `dotenv` if needed.
- [x] 5.5 **Run the seed** against the configured `MONGODB_URI` and verify documents exist.

## Phase 6 — Wire Frontend to the Database
- [ ] 6.1 Convert home page + section components to Server Components that fetch from the DB
  (Projects/MyWork, Portfolio, Experience timeline, Resume cards, Certifications, Services).
- [ ] 6.2 Remove dependency on `lib/data/mock.ts` (keep as reference/backup only).
- [ ] 6.3 Ensure empty-state handling when a collection has no rows.
- [ ] 6.4 Add `revalidatePath`/`revalidate` so edits in the dashboard reflect on the public site.
- [ ] 6.5 Add `loading.tsx` / `<Suspense>` skeleton fallbacks for streamed sections so async data
  shows skeletons (not blank space) before content resolves.

## Phase 7 — Modern Redesign of Public Site
*(All motion via GSAP + ScrollTrigger; async data shows skeletons first.)*
- [ ] 7.1 Hero: gradient/glow background, refined typography, GSAP timeline entrance
  (staggered headline/CTA, subtle parallax), dark-first.
- [ ] 7.2 About & Services: glass cards, icon treatment, hover glow, scroll-reveal stagger.
- [ ] 7.3 MyWork / Projects: modern case-study cards, category filter chips, GSAP hover motion +
  staggered reveal on scroll.
- [ ] 7.4 Portfolio grid: masonry/creative grid with overlay + links, staggered GSAP reveal.
- [ ] 7.5 Experience & Education: restyle Timeline for dark theme with scroll-driven line/entry animation.
- [ ] 7.6 Resume + Certifications sections restyle; improve PDF preview modal.
- [ ] 7.7 Contact: modern form styling, better states.
- [ ] 7.8 Navbar + Footer polish (sticky/blur nav, theme toggle, active states).
- [ ] 7.9 Apply the `<Reveal>`/scroll-reveal primitives consistently across sections + consistent
  spacing rhythm; respect `prefers-reduced-motion`.

## Phase 8 — Polish, QA & Docs
- [ ] 8.1 Responsive pass (mobile → desktop) on public site and dashboard.
- [ ] 8.2 Accessibility: focus states, contrast in both themes, alt text, aria labels.
- [ ] 8.3 `next build` / lint clean; fix type errors.
- [ ] 8.4 Update `README.md` (auth, dashboard routes, seed command, env vars — including
  `CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`, and the upload preset).
- [ ] 8.5 Manual QA checklist: login, each CRUD create/edit/delete, public site reflects changes,
  theme toggle persists.

---

### Suggested execution order
Phase 0 → 1 → 2 → 3 → 5 (seed early to have real data) → 4 → 6 → 7 → 8.
Tell me **"do Phase X"** (or a specific task like **"do 4.4"**) and I'll implement it.
