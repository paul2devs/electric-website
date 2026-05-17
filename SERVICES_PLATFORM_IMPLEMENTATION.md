# Services platform & operations update

This document summarizes the work delivered in this pass and the environment variables involved.

## Services page (Testimonydot)

Replaced the old marketing hero + accordion layout with a structured catalogue experience:

- **ServicePageHero** — 60/40 split (text + abstract UI preview mock), subtle `#fafafa` section background, fade-in on load, CTAs to `#services-catalogue` and `/book`.
- **ServiceFilterNav** — Horizontal, scrollable (scrollbar hidden on WebKit), text-first tabs with animated sliding underline, sticky below the site header.
- **ServiceFeaturedSpotlight** — Split spotlight for CCTV (copy per brief), image from `LANDING_FEATURED_SERVICE_IMAGE` in `lib/data/services.ts` (currently **`/marketing-services.svg`** so the build ships with a real asset; swap the constant to **`/services-cctv-feature.jpg`** after you add that file under `public/`).
- **ServicesMinimalGrid** — Two-column desktop, one column mobile; typography-first rows, hover accent line, “View details →” shift; opens the slide panel (not a dead link).
- **ServiceDetailsPanel** — Right slide-in panel (280ms), dimmed backdrop, scrollable body, sticky footer with Book + Ask a question (contact with `topic` query).
- **ServicePricingSection** — Light gray background, factors list, estimate callout, illustrative ₦ ranges (not fixed quotes).
- **ServicePageFinalCta** — Centered closing block with Book + help choosing (contact link).

**Logic:** `hooks/use-services-browse.ts` owns filter transitions (opacity), detail slug, and filtered catalogue. Categories map to catalogue data: **General** = maintenance + inspection.

## Global UX

- **Breadcrumbs** — `components/layout/page-breadcrumbs.tsx` wired into marketing `AppShell`, `DashboardShell`, and `AdminShell` with route-aware trails (`lib/navigation/breadcrumbs.ts`).
- **Header active state** — Primary nav and mobile drawer highlight the current route; services sub-routes stay “Services” active; accent color from the design system.
- **WhatsApp float** — Fixed bottom-right launcher with official-style glyph, prefilled message, and **+99** badge. Renders only when WhatsApp env is configured (see below).

## Auth & profile (phone)

- **Registration** — Mandatory phone (validated client + server). Backend: `RegisterDto`, `AuthService.register`, `UsersService.create` persist `phone`.
- **Settings** — Phone required on save; validated before PATCH `/user/profile`.
- **Update profile DTO** — Optional phone with transform for empty strings; when present, min length 10 and allowed character set.

## Admin

- **Services CRUD** — Full create/edit drawer, category `<select>`, numeric validation, loading states, success banner, surfaced API errors. Create/Update call real `POST/PATCH /admin/services`. Delete confirms then `DELETE`; **blocked** when bookings still reference the service (`400` with clear message from Nest).
- **Users list** — Shows **Phone** column; API returns `phone` from `listUsers`.
- **Booking detail** — Shows client email, account phone, booking phone, and site address labels for operations.

## Contact page

- Supports `?topic=service`, `choose-service`, or `question` with contextual guidance (aligned with service panel / CTA links).

## Booking page (`/book`)

Four-step guided flow (Stripe-style):

1. **Service** — visual grid picker (no dropdown), optional add-ons, “Selected: …” label  
2. **Schedule** — month calendar + live slot buttons, Redis lock feedback, empty-state copy  
3. **Details** — full name, phone, email, address, notes (floating labels); prefilled from account  
4. **Confirm** — review + “Confirm booking” + email confirmation note  

- Progress bar: Service → Schedule → Details → Confirm  
- Sticky **summary panel** (desktop right, mobile above content) with live pricing  
- **Auto-save** draft in `localStorage` (`testimonydot.booking.draft.v1`)  
- Mobile **sticky bottom** Back / Continue  
- `canProceed` disables CTA until each step is valid  

## Catalogue ↔ API alignment

- **`backend/prisma/seed.ts`** now upserts **15** services whose **names** match `lib/data/services.ts`, so booking `?serviceId=<slug>` resolution by name stays reliable. Re-run seed when refreshing dev data: `cd backend && npx prisma db seed` (or your usual migrate/seed workflow).

## Assets

- Featured image path is centralized in `LANDING_FEATURED_SERVICE_IMAGE`. Place your real CCTV (or other) image in `public/` and point the constant at it.

---

## Environment variables

### Frontend (`electric_website`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE_URL` | Nest API base URL (no trailing slash). |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL for metadata. |
| `NEXT_PUBLIC_WHATSAPP_E164` **or** `NEXT_PUBLIC_WHATSAPP_PHONE` | Digits only, country code, no `+` (e.g. `2348012345678`). Powers the floating WhatsApp button. Falls back to contact phone / `2348000000000` in `lib/constants/site-contact.ts` if unset. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Operations inbox (footer, admin hint, mailto). |
| `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY` | Human-readable phone in footer. |
| `NEXT_PUBLIC_CONTACT_PHONE_TEL` | `tel:` link digits for phone. |

### Backend (`electric_website/backend`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma. |
| `REDIS_URL` | Redis for slot locks / BullMQ (per existing deployment). |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Auth signing. |
| `FRONTEND_ORIGIN` or `FRONTEND_URL` | CORS for the Next app. |
| `PORT` | API port (default `3001`). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional seed overrides. |
| Email/SMTP variables | As required by `EmailService`. |

---

## Verification

- `npm run build` (Next.js) — success.
- `npm run build` (Nest `backend/`) — success.

Completed as requested — no compile errors on the checked builds.
