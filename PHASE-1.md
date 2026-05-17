# Phase 1 — Frontend foundation

This document records what Phase 1 delivered for the electrician operations platform and how environment variables should be configured.

**See also:** [PHASE-2.md](./PHASE-2.md) documents the marketing UI, full services catalogue (`lib/data/services.ts`), accordion explorer, and contact flow added after this foundation.

## Implemented

### Project structure

- **`app/`** — Next.js App Router with route groups:
  - **`(marketing)/`** — Public site shell (navbar + footer): home, services index, service detail (`[slug]`), about, contact.
  - **`(auth)/`** — Login and register (minimal shell, no marketing chrome).
  - **`(dashboard)/`** — Dashboard shell (workspace header, sidebar, content region).
- **`components/layout/`** — `AppShell`, `AuthShell`, `DashboardShell`, `Container`, `Navbar`, `Footer`.
- **`components/ui/`** — Primitives: `Button`, `Input`, `Heading`, `Section`, plus `buttonClassName` for link-styled CTAs.
- **`components/sections/`** — `LoginForm`, `RegisterForm`, landing region placeholders (`hero`, services preview, how it works).
- **`hooks/`** — `useLoginForm`, `useRegisterForm` (client validation only; no API).
- **`lib/constants/`** — `routes`, `navigation`, `service-directory` (static catalog for routing and lists).
- **`lib/validation/`** — Pure auth field validators (email, password, name, confirm match).
- **`lib/utils/`** — `cn`, `formatSlugLabel`.
- **`styles/globals.css`** — Design tokens (Tailwind v4 `@theme`), base resets, focus styles.

### Layout system

- **Root layout** — Inter via `next/font`, global CSS, metadata with `metadataBase` from `NEXT_PUBLIC_APP_URL` (fallback `http://localhost:3000`).
- **Marketing** — `AppShell`: minimal navbar (brand + Services / About / Contact), centered `Container` (max width 1200px, horizontal padding 24px), footer with legal line and links.
- **Auth** — `AuthShell`: brand link home, single-column form column.
- **Dashboard** — `DashboardShell`: top bar, sidebar nav, main content.

### Design system (enforced)

- **Colors only:** `#0A0A0A` (ink), `#FFFFFF` (surface), `#6B6B6B` (muted), `#EAEAEA` (border), `#F5F5F5` (hover).
- **Typography:** Inter; scale via tokens — display 36px, title 28px, subtitle 20px, body 16px, small 14px; weights aligned to headings vs body.
- **Spacing:** Section vertical rhythm uses Tailwind spacing steps that map to the 4px grid (e.g. `py-8`, `py-12`, `py-16` → 32px, 48px, 64px). Horizontal padding uses `px-6` (24px). Arbitrary layout gaps use the same allowed scale (`gap-4`, `gap-6`, `gap-8`, etc.).

### Pages (structure-first)

- **Landing** — Three dashed-outline regions: hero, services preview, how it works (no marketing copy blocks).
- **Services** — Sidebar placeholder + linked list from `serviceDirectory`.
- **Service detail** — Title from directory, description placeholder, primary/secondary CTAs to contact and services index; unknown slugs → `notFound()`.
- **About / Contact** — Titled pages with dashed content regions.
- **Login / Register** — Accessible forms with labels, validation messages, cross-links; submit runs validation only (no network).
- **Dashboard** — Titled workspace with dashed main region.

### Tooling

- **TypeScript** — Strict project references; path alias `@/*` → repository root.
- **Tailwind CSS v4** — Tokens in `styles/globals.css`; PostCSS pipeline unchanged.
- **Utilities** — `clsx` + `tailwind-merge` for `cn()`.

### Quality checks run

- `npm run build` — succeeds; static routes generated for all service slugs.
- `npm run lint` — succeeds.

## Environment variables

| Variable | Required (Phase 1) | Purpose |
|----------|--------------------|---------|
| `NEXT_PUBLIC_APP_URL` | Optional (defaults to `http://localhost:3000` in code) | Canonical origin for `metadataBase` in `app/layout.tsx`; use your production URL when deployed. |
| `NEXT_PUBLIC_API_URL` | Optional (defaults to `http://localhost:3001` in code) | Backend origin used by the auth client (`/auth/login`, `/auth/refresh`, etc.). |

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_APP_URL` to your real origin in staging/production.

### Later phases (not in `.env` yet)

When NestJS, PostgreSQL, Redis, BullMQ, and JWT auth are added, you will typically introduce server-only variables (never prefixed with `NEXT_PUBLIC_`), for example:

- Database URL, Redis URL, JWT secrets, refresh token settings, SMTP/API keys for notifications, queue connection strings.

Those are intentionally omitted from Phase 1 until the backend exists.

## Phase 1 completed as requested

The repository is a production-grade **frontend-only** foundation: modular structure, strict monochrome design tokens, reusable primitives, grouped routes, and validated auth forms without backend calls. No booking engine, pricing, queues, or API integration yet.

## How to start locally (foundation + marketing + auth)

1. Create `.env.local` for the frontend:

```bash
cd /home/paulsmithdev/Desktop/electric_website
cp .env.example .env.local
```

2. Create `.env.local` for the backend:

```bash
cd /home/paulsmithdev/Desktop/electric_website/backend
cp .env.example .env.local
```

3. Run database migrations:

```bash
npm run prisma:migrate
```

4. Start the backend:

```bash
npm run start:dev
```

5. Start the frontend (in a separate terminal):

```bash
cd /home/paulsmithdev/Desktop/electric_website
npm run dev
```

6. Sign up and log in:

- `http://localhost:3000/register`
- `http://localhost:3000/login`
- After login, go to `http://localhost:3000/dashboard`
