# Our Work page & project showcase

This document summarizes the **Our Work** (`/our-work`) experience, booking integration, and environment variables for the Testimonydot platform.

## Route & navigation

- **URL:** `/our-work` (`routes.ourWork`)
- **Header / footer:** “Our work” link in `lib/constants/site-navigation.ts`
- **Breadcrumbs:** Home → Our work (`lib/navigation/breadcrumbs.ts`)

## Page structure

`app/(marketing)/our-work/page.tsx` renders `OurWorkPageExperience`, which composes:

| Section | Component | Notes |
|---------|-----------|--------|
| Hero | `WorkPageHero` | Minimal intro on `#fafafa`; no homepage-style drama |
| Filter nav | `ServiceFilterNav` (reused) | Sticky below header; same categories as services |
| Featured project | `WorkFeaturedProject` | Large visual + copy; View project + Book similar |
| Project grid | `WorkProjectsGrid` | 3-col desktop / 2 tablet / 1 mobile; image + typography |
| Before & after | `WorkBeforeAfter` | Only projects with `beforeImage` / `afterImage` in data |
| Closing CTA | `WorkPageCta` | Book + contact |
| Details panel | `ProjectDetailsPanel` | Right slide-in (280ms), gallery, structured sections |

**Browse logic:** `hooks/use-projects-browse.ts` — filter fade, `detailSlug`, open/close panel.

## Data & assets

All catalogue content lives in **`lib/data/projects.ts`**. Add, edit, or remove projects there only.

- **Featured slug:** `FEATURED_PROJECT_SLUG` (`luxury-cctv-lekki`)
- **Helpers:** `getProjectBySlug`, `getFeaturedProject`, `getGridProjects`, `getProjectsWithBeforeAfter`
- **Filtering:** `lib/projects/filter.ts` (category ↔ browse filter id)

Images must live under **`public/`** and paths are referenced as `/projects/...` in the data file. Placeholder SVGs ship in `public/projects/`; replace with real photography without code changes.

## Project details panel

- Slide-in from the right (`project-panel-aside` animation in `styles/globals.css`)
- Image gallery with prev/next and thumbnails when multiple `images` exist
- Sections: Overview, Scope, Execution, Outcome, Location, Service (links to `/services/[slug]`)
- **CTAs:** Book similar service · Ask about this project

## Booking integration

`lib/projects/booking-bridge.ts` builds URLs:

- **Book:** `/book?serviceId=<relatedServiceSlug>&project=<slug>&inspired=<title>`
- **Ask:** `/contact?topic=project&project=<slug>&service=<relatedServiceSlug>`

**Booking flow** (`hooks/use-booking-flow.ts`):

- Accepts `BookingFlowInit` (`serviceId`, `projectSlug`, `inspiredBy`)
- Prefills **notes** with: `I'd like a similar setup to the [project title] project.`
- Persists `inspiredBy` + `projectSlug` in booking draft (`localStorage`)
- **Summary panel** and confirm step show **Inspired by:** when set

**Contact flow:** `topic=project` shows contextual help and prefills the message field for the selected project.

## Related prior work

Services catalogue, booking wizard, admin CRUD, and global UX are documented in **`SERVICES_PLATFORM_IMPLEMENTATION.md`**.

---

## Environment variables

Same stack as the rest of the app. No new variables are required specifically for Our Work.

### Frontend (`electric_website`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE_URL` | Nest API base URL (booking, auth). |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL for metadata. |
| `NEXT_PUBLIC_WHATSAPP_E164` **or** `NEXT_PUBLIC_WHATSAPP_PHONE` | WhatsApp float (digits, country code, no `+`). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact mailto / operations. |
| `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY` | Footer display phone. |
| `NEXT_PUBLIC_CONTACT_PHONE_TEL` | `tel:` link digits. |
| `NEXT_PUBLIC_SOCIAL_*` (optional) | Social links when configured in `site-contact`. |

### Backend (`electric_website/backend`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL. |
| `REDIS_URL` | Slot locks, queues. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Auth tokens. |
| `SMTP_*` or email provider vars | Notification queue. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin (dev). |

See **`SERVICES_PLATFORM_IMPLEMENTATION.md`** for the full backend list (pricing, CORS, booking windows, etc.).
