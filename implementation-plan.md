# Implementation Plan — Modern Dark Portfolio + CMS Dashboard

Transform the portfolio into a modern, aesthetic, **dark-by-default** website and make
**Projects, Experience & Education, Resume cards, and Certifications & Services** fully
database-managed (CRUD) from a secured `/dashboard`, alongside the existing Blog CMS.

## Decisions (confirmed)
- **Auth:** Password login → httpOnly cookie session, protecting `/dashboard/*` and all write APIs.
- **Images:** URL / `/public` path text inputs (no cloud upload).
- **CRUD scope:** Projects (case studies + portfolio grid), Experience & Education, Resume cards,
  Certifications, Services. Blog already exists.
- **Design:** Sleek dark default with indigo→cyan glow, glassmorphism, subtle gradients, scroll
  animations, and a working light/dark toggle.

## Tech notes
- Next.js 15 App Router, React 19, Tailwind v4, Mongoose, shadcn/ui, react-hook-form + zod,
  sonner, next-themes (already installed — currently unused).
- **Animation:** GSAP (with `ScrollTrigger`) for all motion — hero entrance, scroll-reveals,
  staggered card/grid reveals, hover/parallax accents. Wrapped in React-safe hooks
  (`useGSAP` / `gsap.context` cleanup).
- **Loading UX:** shadcn `Skeleton` (already present) used wherever data is fetched async —
  public sections during SSR fallback/streaming and every dashboard list/form while loading.

---

## Phase 0 — Foundations & Theming
- [ ] 0.1 Wire up `next-themes`: create a `ThemeProvider`, add it in `app/layout.tsx`, set
  `defaultTheme="dark"` + `attribute="class"` + `suppressHydrationWarning` on `<html>`.
- [ ] 0.2 Rework `globals.css`: refine the `.dark` palette (indigo/cyan accents, glass surfaces,
  glow shadows), make `:root` the light variant, replace body `text-grey-100` with token-based
  `text-foreground` / `bg-background`.
- [ ] 0.3 Add reusable design utilities: glass card, gradient text, glow border, section container.
- [ ] 0.3b Install GSAP (`gsap` + `@gsap/react`), register `ScrollTrigger`, and build reusable
  animation primitives: a `<Reveal>` wrapper (fade/slide on scroll), a `useScrollReveal` hook,
  and a stagger helper — all using `useGSAP`/`gsap.context` for proper cleanup and SSR safety.
- [ ] 0.3c Add reusable skeleton components (card skeleton, list-row skeleton, timeline skeleton,
  form skeleton) built on the existing shadcn `Skeleton`.
- [ ] 0.4 Build a `ThemeToggle` button and place it in the Navbar (desktop + mobile).
- [ ] 0.5 Audit hardcoded light-only colors (`text-black`, `bg-light-*`, `bg-white`) across
  components and convert to theme tokens so both themes render correctly.

## Phase 1 — Data Layer (Mongoose Models)
- [ ] 1.1 `models/Project.ts` — case-study project (title, slug, description, problem, solution,
  results[], mainCategory, categories[], image, behance, source, featured, order).
- [ ] 1.2 `models/PortfolioItem.ts` — lightweight portfolio grid card (title, category, description,
  source, image, order). *(Or fold into Project with a `type` field — decide in 1.6.)*
- [ ] 1.3 `models/Experience.ts` — timeline entry (kind: "experience" | "education", job/title,
  company, date, jobType, role, color, order).
- [ ] 1.4 `models/ResumeCard.ts` — resume download card (title, description, icon, pdfUrl, accent, order).
- [ ] 1.5 `models/Certification.ts` and `models/Service.ts`.
- [ ] 1.6 Finalize whether Projects + Portfolio share one collection (`type` discriminator) or two;
  document the choice at the top of the models.
- [ ] 1.7 Shared TypeScript types in `types/` and a small `lib/data/queries.ts` for server reads.

## Phase 2 — Authentication
- [ ] 2.1 `lib/auth.ts` — session helpers: sign/verify a signed httpOnly cookie (using `ADMIN_PASSWORD`
  + a secret from env); `getSession()` and `requireAuth()`.
- [ ] 2.2 `app/login/page.tsx` — styled login form (password), posts to `/api/auth/login`.
- [ ] 2.3 `app/api/auth/login` + `app/api/auth/logout` route handlers (set/clear cookie).
- [ ] 2.4 Update `middleware.ts` to protect `/dashboard/:path*` (redirect to `/login`) and keep/retire
  the old `?key=` blog guard.
- [ ] 2.5 Add `ADMIN_PASSWORD` + `AUTH_SECRET` to `.env` and document in README.

## Phase 3 — CRUD APIs
- [ ] 3.1 `app/api/projects` (GET list, POST) + `app/api/projects/[id]` (GET, PUT, DELETE).
- [ ] 3.2 `app/api/experiences` + `[id]`.
- [ ] 3.3 `app/api/resume-cards` + `[id]`.
- [ ] 3.4 `app/api/certifications` + `[id]`.
- [ ] 3.5 `app/api/services` + `[id]`.
- [ ] 3.6 Guard all write methods (POST/PUT/DELETE) with `requireAuth()`; return proper status codes.
- [ ] 3.7 (Optional) Migrate Blog write auth from `?key=` to the new session guard for consistency.

## Phase 4 — Dashboard UI (`/dashboard`)
- [ ] 4.1 Dashboard layout with a sidebar (shadcn `sidebar` already present) + header + logout.
- [ ] 4.2 Overview page: counts per collection + quick links.
- [ ] 4.3 Reusable admin building blocks: data table/list, resource form dialog, delete confirm,
  image-URL field with live preview, drag-to-reorder (or order number input).
- [ ] 4.3b Loading states: skeleton rows while lists load, skeleton form while an item loads for
  edit, and submit/pending states on every mutation.
- [ ] 4.4 Projects manager (list, create, edit, delete).
- [ ] 4.5 Experience & Education manager (with kind toggle).
- [ ] 4.6 Resume cards manager.
- [ ] 4.7 Certifications manager.
- [ ] 4.8 Services manager.
- [ ] 4.9 Link the existing Blog manager into the dashboard nav (and secure via session).

## Phase 5 — Seed Script
- [ ] 5.1 `scripts/seed.ts` — connect via existing `dbConnect()`, read arrays from `lib/data/mock.ts`
  (projects, myWork, experiences, certifications, services) + the two resume cards from `Resume.tsx`.
- [ ] 5.2 Map static shapes → model shapes; split `experiences` array into experience vs education by
  content; assign `order` from array index.
- [ ] 5.3 Make it idempotent (upsert by slug/title, or `--fresh` flag to wipe+reseed).
- [ ] 5.4 Add `"seed": "tsx scripts/seed.ts"` script; install `tsx` + `dotenv` if needed.
- [ ] 5.5 **Run the seed** against the configured `MONGODB_URI` and verify documents exist.

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
- [ ] 8.4 Update `README.md` (auth, dashboard routes, seed command, env vars).
- [ ] 8.5 Manual QA checklist: login, each CRUD create/edit/delete, public site reflects changes,
  theme toggle persists.

---

### Suggested execution order
Phase 0 → 1 → 2 → 3 → 5 (seed early to have real data) → 4 → 6 → 7 → 8.
Tell me **"do Phase X"** (or a specific task like **"do 4.4"**) and I'll implement it.
