# Phase 2 — Marketing UI and services system

This document records Phase 2 delivery: the public marketing experience and structured services catalogue. Phase 1 foundation (`PHASE-1.md`) remains the reference for global layout, tokens, and auth/dashboard shells.

## Implemented

### Data and utilities

- **`lib/data/services.ts`** — Full service catalogue: categories, slugs, short and long copy, duration, NGN starting prices, what’s included, related services, and add-ons. Helpers: `getServiceBySlug`, `getServicesByCategory`, `getRelatedServices`, `resolveServicesCategoryParam`, `getLandingPreviewServices`, `generateStaticParams` source list via `SERVICES`.
- **`lib/constants/site-contact.ts`** — Canonical email, phone (`tel:`), hours, and coverage line for Nigeria-facing operations copy.
- **`lib/utils/book-contact-href.ts`** — Builds `/contact?intent=book` and optional `service` query for booking CTAs.
- **`lib/utils/format-currency.ts`** — `formatNgn` using `Intl` (`en-NG`, `NGN`).
- **`lib/utils/format-count.ts`** — `formatCount` for stat display.
- **`lib/validation/contact-fields.ts`** — Contact form field validation (mirrors auth validation style).

Removed: `lib/constants/service-directory.ts`, `lib/utils/format-slug.ts` (replaced by the services module).

### Design system compliance

- **No Tailwind arbitrary values** in components: spacing uses the theme scale; content width uses `max-w-content` via `@theme` (`--max-width-content`) and `.container-content` in `styles/globals.css`.
- **Accordion motion** — `grid-template-rows` transition defined in CSS (`.accordion-panel` / `.accordion-panel-inner`) to avoid bracket utilities.
- **Minimal chrome** — Lists, borders, and hover backgrounds only; no cards, gradients, or heavy shadows.

### New or updated UI primitives

- **`components/ui/divider.tsx`** — Thin horizontal rule.
- **`components/ui/textarea.tsx`** — Matches input focus and border treatment.

### Section components (marketing)

- **`HeroSection`** — Spec headline, subtext, primary/secondary CTAs (`bookContactHref()`, `/services`).
- **`ServicesList`** — Landing preview: five named services as full-width rows with hover, linking to detail routes.
- **`HowItWorks`** — Three steps; horizontal on large screens, stacked on small; numbered markers (list semantics with `list-none`).
- **`StatsSection`** — Years, jobs completed (formatted count), certifications copy.
- **`CTASection`** — Closing strip with “Book now”.
- **`ServiceDetail`** — Detail template: narrative, what’s included, duration, pricing preview, add-ons, booking CTAs, related services list.
- **`ContactChannels`**, **`ContactBookingBanner`**, **`ContactForm`** — Contact page composition; form opens a real `mailto:` draft after validation (`useContactForm`).

### Services explorer

- **`ServiceSidebar`** — Desktop category links (`/services`, `/services?category=…`); **mobile** category `<select>` via **`CategoryMobileSelect`** (`useRouter`).
- **`ServiceRow`** + **`ServicesAccordion`** — Single-open accordion (`useAccordionGroup`); expanded body shows full description, duration, starting price, and Book link.
- **`app/(marketing)/services/page.tsx`** — Server-filtered list from `searchParams` (dynamic route); **`app/(marketing)/services/[slug]/page.tsx`** — SSG for all catalogue slugs.

### Pages

- **`/`** — Hero, services list, how it works, divider, trust stats, CTA.
- **`/services`** — Two-column explorer; sidebar + accordion; mobile category control at top of sidebar column.
- **`/services/[slug]`** — Full detail with add-ons and related services.
- **`/about`** — Operations narrative and expectations list (no filler lorem).
- **`/contact`** — Channels, booking banner when `?intent=book&service=…` is valid, mailto-driven message form.

### Other adjustments

- **`components/layout/dashboard-shell.tsx`** — Flex layout replacing grid bracket columns; `min-h-80` instead of arbitrary min-height.
- **`app/(dashboard)/dashboard/page.tsx`** — Same min-height token.

## Verification

- `npm run build` — succeeds (contact and services are dynamic where `searchParams` is used).
- `npm run lint` — succeeds.

## Environment variables

Phase 2 does not add new required variables. Use the same as Phase 1:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Optional locally; set in production | Canonical origin for `metadataBase` in `app/layout.tsx`. |

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_APP_URL` to your deployed origin (e.g. `https://your-domain.ng`).

### Later (backend phases)

When NestJS, PostgreSQL, Redis, BullMQ, and JWT are introduced, add **server-only** secrets (never `NEXT_PUBLIC_*`): API URLs, database URLs, JWT secrets, Redis/BullMQ connection strings, SMTP keys, etc. Phase 2 does not consume them.

---

**Phase 2 completed as requested** — marketing UI and services system are production-complete on the frontend, with no backend API or booking engine yet.
