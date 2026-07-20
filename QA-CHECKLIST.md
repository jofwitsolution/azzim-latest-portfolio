# Manual QA Checklist

Run through this before shipping. Covers auth, every CRUD flow, the public site reflecting
changes, and theming/responsiveness. Check both **light and dark** themes and at least one
**mobile** and one **desktop** width for each visual item.

## Setup
- [ ] `.env` is populated from `.env.example` (Mongo, auth, Cloudinary, EmailJS).
- [ ] `npm run seed` populates the collections (or `npm run seed -- --fresh` to reset).
- [ ] `npm run build` passes clean; `npm run lint` reports no errors.

## Authentication
- [ ] Visiting `/dashboard` while logged out redirects to `/login`.
- [ ] Wrong password on `/login` shows an error and does not sign in.
- [ ] Correct password signs in and lands on `/dashboard`.
- [ ] Visiting `/login` while already signed in redirects to `/dashboard`.
- [ ] Logout clears the session and re-guards `/dashboard`.
- [ ] Write API calls (`POST`/`PUT`/`DELETE`) return `401` without the session cookie.
- [ ] `/blog/manage` redirects to `/login` when logged out.

## Dashboard CRUD — for EACH resource
Resources: **Projects, Portfolio items, Experience & Education, Resume cards, Certifications,
Services, Blog.**
- [ ] Overview counts match the number of rows in each manager.
- [ ] **Create** a record (fill required fields, upload an image/PDF where applicable) → row appears.
- [ ] **Edit** a record (change a field, replace the asset) → changes persist after refresh.
- [ ] **Delete** a record (confirm the dialog) → row disappears; Cloudinary asset is removed.
- [ ] Reordering via the `order` field changes the public display order.
- [ ] Validation errors surface inline (e.g. empty required field, invalid URL).
- [ ] Submit/delete buttons show pending state; success/error toasts fire.
- [ ] Lists show skeletons while loading, not blank space.

## Public site reflects changes
- [ ] Creating/editing/deleting in the dashboard is reflected on the corresponding public
      section after navigation (Projects/MyWork, Portfolio grid, Experience timeline, Resume
      cards, Certifications page, Services, Footer services).
- [ ] Empty collections render the shared empty-state (no broken/blank sections).

## Theming & motion
- [ ] Theme toggle switches light/dark on desktop and mobile nav.
- [ ] Chosen theme persists across reloads and route changes.
- [ ] No hardcoded light-only colors leak in dark mode (text/background/borders readable).
- [ ] Scroll-reveal / hero animations play; with OS "reduce motion" enabled they are skipped/reduced.

## Responsive & accessibility
- [ ] Public site: no horizontal scroll from 320px → desktop; nav collapses to mobile menu.
- [ ] Dashboard: sidebar collapses/toggles on mobile; tables/forms usable on small screens.
- [ ] Keyboard: all interactive elements are focusable with a visible focus ring; dialogs trap focus.
- [ ] Images have meaningful `alt` text; icon-only buttons have `aria-label`.
- [ ] Contrast passes in both themes for body text, muted text, and buttons.

## Contact form
- [ ] Validation blocks empty/invalid submissions.
- [ ] A valid submission sends via EmailJS and shows a success toast; failure shows an error.
