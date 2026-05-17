# Testimonydot — Implementation Summary

## What was implemented

### Homepage — Services overview

- Restructured `ServicesList` into a full **section header → featured visual block → text grid → “View all services”** flow.
- Added `FeaturedServiceBlock`: single large visual (public image), **~50% dark overlay** (flat, readable), left-aligned copy, primary **Book service** and secondary detail link, **subtle image zoom on hover** (`group-hover` scale).
- **Services grid** uses the same catalogue as `lib/data/services.ts`: featured service is **`cctv-installation`** (aligned with your services page data); the grid lists the remaining **landing preview** services as **full-row links** with dividers (clickable, hover emphasis — no card chrome).
- **Public assets**: `LANDING_FEATURED_SERVICE_IMAGE` → `/services-cctv-feature.jpg` (placeholder bytes committed so builds succeed; replace with your final asset). Existing hero path `/hero-electrician.jpg` remains.

### Homepage — Why Choose Us

- New `WhyChooseUs` section: **split layout** (label, heading, subtext + vertical accent line on desktop), **four value rows** with dividers, **hover** emphasis and **underline** transition on titles, **zinc-100** background for contrast.

### Homepage — How it works

- Rebuilt `HowItWorks`: **centered header**, **01 / 02 / 03** large muted numerals, **horizontal baseline rule** behind steps on desktop, **vertical stack** on mobile, minimal hover on titles.

### Homepage — Feature highlight (system / product)

- **`FeatureHighlightSection`** + **`FeatureHighlightVisual`**: split layout; copy from **`lib/content/home-marketing.ts`**; right side is a **built UI mockup** (booking/scheduling panel — no stock icons).
- **Motion**: `feature-highlight-animate` in `globals.css` — **fade-in + 12px upward** ease-out; **`prefers-reduced-motion`** disables animation.
- **Elevation**: inner wrapper uses **negative translate** + **soft shadow** and slightly stronger shadow on hover.

### Homepage — Social proof

- **`SocialProofSection`**: minimal header, **four metrics** in a **2×2 layout on small screens** and **four columns on large** (typography only — no card chrome), **client context** line, **single** blockquote with **role-only** attribution.

### Homepage — Emergency support

- **`EmergencySection`**: **charcoal** background (`#161616`), **amber / warning** accents (no red alarm UI), **split layout** with **vertical rule** on desktop, **priority panel** with lift on hover; CTAs: **book** + **call** (`getSupportCallHref()`).

### Homepage — About preview

- **`AboutPreviewSection`**: split copy + **`/about-workspace.jpg`** (overlay **~45%** flat dark), credibility list, **CTA** to **`/about`**, image frame **hover lift**.

### Homepage — Final CTA

- **`FinalCTASection`** replaces the old footer CTA on the homepage: **centered** copy on **`#0E0E0E`**, **white / outline** buttons via **`onDark`** / **`onDarkOutline`** variants.

### Marketing content module

- **`lib/content/home-marketing.ts`**: all static strings and lists for the sections above (keeps section components free of long inline copy).

### Support contact helper

- **`lib/constants/support-contact.ts`**: **`NEXT_PUBLIC_SUPPORT_PHONE`** → `tel:` link; if unset, **Call support** routes to **`/contact`**.

### Trust strip

- Mobile layout uses **`grid-cols-2`** so metrics read as a **2×2 grid**; **`lg:grid-cols-4`** on large screens.

### Design system (global)

- Extended `styles/globals.css` with **luxury black/white base**, **light blue accent** (`--color-accent` and variants), and **semantic** tokens: **success** (muted green), **warning** (amber), **error** (red), **info** (blue aligned to accent).
- **Focus rings** use accent; **`.link-accent`** utility for consistent link hover/underline behaviour.

### UI components

- **Buttons**: primary uses **accent** background; **hover** brightness/shadow; **`active:scale-95`**; secondary uses accent-tinted hover/border; **`onDark` / `onDarkOutline`** for light-on-dark final CTA.
- **Inputs**: **`invalid`** prop → **error border + ring**; focus ring uses **accent**.

### Auth (backend)

- **`RegisterDto`** now requires **`confirmPassword`** with **`ValidateBy`** so mismatch returns **400** with message **“Passwords must match”** (no raw stack traces to clients — existing filter keeps **500** messages generic).
- **Login** returns **`UnauthorizedException("Invalid email or password")`** instead of “Invalid credentials”.
- **`ApiExceptionFilter`** maps **Prisma** errors: **P2002** → **409** with safe copy; **P1000/P1001/P1017** and **`PrismaClientInitializationError`** → **503** with safe copy; other known Prisma errors → **500** generic message.

### Auth (frontend)

- **`auth-api`**: **try/catch** on network failures → **`ApiError(0, fallback)`**; **`readErrorMessage`** ignores HTML error pages; **register** sends **`confirmPassword`**.
- **`getFriendlyAuthError`**: **401** and “invalid credentials” → **“Invalid email or password”**; **503** treated like **500** for user copy.
- **`AuthProvider.register`** signature updated to pass **confirmPassword**.
- **Login / register** forms: **error alert panels**, **invalid** field styling, **`.link-accent`** on links.

### Status & booking feedback

- **Dashboard** and **admin** badges use **semantic** border/text colours where appropriate; **booking flow** errors use **error** panel styling.

---

## Files touched (high level)

- `styles/globals.css`
- `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/password-input.tsx`
- `components/sections/services-list.tsx`, `components/sections/featured-service-block.tsx`
- `components/sections/why-choose-us.tsx`, `components/sections/how-it-works.tsx`
- `components/sections/hero-section.tsx`, `components/sections/trust-strip.tsx`, `components/sections/cta-section.tsx`
- `components/layout/navbar.tsx`, `components/layout/auth-shell.tsx`
- `components/sections/login-form.tsx`, `components/sections/register-form.tsx`
- `components/booking/booking-flow.tsx`
- `components/dashboard/status-badge.tsx`, `components/admin/admin-status-badge.tsx`
- `app/(marketing)/page.tsx`
- `lib/data/services.ts`
- `lib/auth/auth-api.ts`, `lib/auth/auth-context.tsx`, `lib/auth/error-message.ts`
- `backend/src/modules/auth/dto/register.dto.ts`, `backend/src/modules/auth/auth.service.ts`
- `backend/src/common/filters/api-exception.filter.ts`
- `components/sections/feature-highlight-section.tsx`, `feature-highlight-visual.tsx`
- `components/sections/social-proof-section.tsx`, `emergency-section.tsx`, `about-preview-section.tsx`, `final-cta-section.tsx`
- `lib/content/home-marketing.ts`, `lib/constants/support-contact.ts`
- `public/hero-electrician.jpg`, `public/services-cctv-feature.jpg`, `public/about-workspace.jpg` (minimal JPEG placeholders — replace with finals)

---

## Environment variables

### Frontend — repo root `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_PHONE=+234XXXXXXXXXX
```

If **`NEXT_PUBLIC_SUPPORT_PHONE`** is omitted, **Emergency → Call support** uses **`/contact`** instead of `tel:`.

### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
REDIS_URL=rediss://default:PASSWORD@HOST:6379
JWT_ACCESS_SECRET=<strong-random-secret-min-32-chars>
JWT_REFRESH_SECRET=<strong-random-secret-min-32-chars>
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
COOKIE_SECURE=false

BOOKING_DAY_START=09:00
BOOKING_DAY_END=18:00
BOOKING_SLOT_INTERVAL_MINUTES=60
BOOKING_LOCK_TTL_SECONDS=300
PRICING_DISTANCE_MID_FEE=10
PRICING_DISTANCE_FAR_FEE=20

EMAIL_PROVIDER=smtp
EMAIL_FROM=no-reply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<address>
SMTP_PASS=<app-password>

RESEND_API_KEY=
SENDGRID_API_KEY=
```

**Operational note:** ensure the database schema is applied (`cd backend && npm run db:deploy` or your migration process) and that **`DATABASE_URL`** is reachable; otherwise auth and other modules will return **503** with a safe message instead of leaking internals.

---

## Verification

- `npm run build` (frontend) — **success**
- `npm run build` (backend) — **success**
