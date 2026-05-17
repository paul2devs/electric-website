# Testimonydot — Header, Footer, and Auth operations

## Header and footer (what shipped)

### Header (`SiteHeader`)

- **Layout:** text logo (Testimonydot) · **centered** primary links on large screens · **Login** + **Book a service** on the right.
- **Links:** Services (`/services`), How it works (`/#how-it-works`), About (`/about`), Contact (`/contact`).
- **Scroll:** sticky bar with **transparent/blurred** state at top; **more solid white**, thin **border**, and **light shadow** after a few pixels of scroll.
- **Hover:** links use **opacity/underline** transition (no loud styling).
- **Mobile:** hamburger opens a **full-height panel** from the right with backdrop; **body scroll locked** while open; closes on route change.

### Footer

- **Background:** `#F7F7F7`, **top border** separating from page content.
- **Grid:** Brand · Services · Company · Contact (stacked on small screens).
- **Services column:** links to **`/services/[slug]`** for CCTV Installation, Electrical Wiring, Smart Home Automation, Solar Installation (from `lib/data/footer-services.ts`).
- **Company column:** About, Contact, How it works (`/#how-it-works`), Book a service (`/book`).
- **Contact column:** email, phone, optional **social icons** (X, Instagram, TikTok, Facebook) when URLs are set, service hours line.
- **Bottom row:** copyright + “All rights reserved”.

### Anchor

- **How it works** section uses **`id="how-it-works"`** and **`scroll-margin-top`** so in-header links land correctly under the sticky header.

### Files (primary)

- `components/layout/site-header.tsx`
- `components/layout/footer.tsx`
- `components/layout/app-shell.tsx`
- `lib/constants/site-navigation.ts`
- `lib/constants/site-contact.ts`
- `lib/data/footer-services.ts`
- `lib/content/site-footer.ts`
- `components/ui/social-icons.tsx`
- `components/sections/how-it-works.tsx` (anchor id)

---

## Auth 500 — root causes (what was actually going wrong)

A **500** on `/auth/login` or `/auth/register` with the generic *“Something went wrong…”* almost always means the **NestJS global exception filter** mapped an **unhandled server error** to HTTP 500. In this stack, the **most common real causes** are:

1. **PostgreSQL not reachable** or wrong `DATABASE_URL`  
   - Often surfaces as **`PrismaClientInitializationError`** (now returned as **503** with a clearer message).

2. **Database exists but tables/columns do not match the Prisma schema** (migrations never applied or applied to a different DB).  
   - Surfaces as **`PrismaClientKnownRequestError`** with codes such as **P2022 / P2010 / P2021** (now mapped to **503** with an explicit **“run migrations”** message instead of a blind 500).

3. **Unique conflict, validation, etc.**  
   - Already mapped to **409** / **400** with specific messages where applicable.

4. **Any other thrown `Error` in auth code**  
   - Still **500**, but the server now **logs the full stack** and, in **non-production**, may include a **`debug`** object on the JSON response for inspection.

**Important:** The frontend will still show a short user-facing line for true 500s; operators should use **server logs** and **`GET /health`** (below) to see the real failure.

---

## What you must do locally / on the server (checklist)

1. **Backend env** (`backend/.env`): set a valid **`DATABASE_URL`**, **`JWT_ACCESS_SECRET`**, **`JWT_REFRESH_SECRET`**, **`REDIS_URL`** (if the app connects to Redis on boot), **`FRONTEND_ORIGIN`**, etc. (see `IMPLEMENTATION_SUMMARY.md`).

2. **Apply Prisma schema to the database** (same DB as `DATABASE_URL`):

   ```bash
   cd backend && npm run db:deploy
   ```

   If you are only developing and accept a push instead of migration history:

   ```bash
   cd backend && npm run db:push
   ```

3. **Regenerate Prisma Client after schema changes:**

   ```bash
   cd backend && npm run prisma:generate
   ```

4. **Verify DB connectivity from the API process:**

   - Start the API, then call **`GET http://localhost:3001/health`**  
   - Response includes **`database: true`** only when `SELECT 1` succeeds against the configured database.

5. **If login still fails:** read the **NestJS console** for the stack trace; in **development**, inspect the JSON body for optional **`debug.message`**.

---

## Frontend `.env` (header / footer / contact)

Add or adjust in the **repo root** `.env`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=operations@yourdomain.com
NEXT_PUBLIC_CONTACT_PHONE_TEL=+234XXXXXXXXXX
NEXT_PUBLIC_CONTACT_PHONE_DISPLAY=+234 XXX XXX XXXX
NEXT_PUBLIC_SUPPORT_PHONE=+234XXXXXXXXXX
NEXT_PUBLIC_SERVICE_HOURS=Your hours copy
NEXT_PUBLIC_CONTACT_HOURS_WEEKDAY=Monday–Saturday · 08:00–18:00 WAT
NEXT_PUBLIC_CONTACT_COVERAGE_LINE=Emergency line monitored outside standard hours.
NEXT_PUBLIC_SOCIAL_X_URL=https://x.com/yourhandle
NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL=https://instagram.com/yourhandle
NEXT_PUBLIC_SOCIAL_TIKTOK_URL=https://www.tiktok.com/@yourhandle
NEXT_PUBLIC_SOCIAL_FACEBOOK_URL=https://facebook.com/yourpage
```

Phone **`tel:`** links use **`NEXT_PUBLIC_CONTACT_PHONE_TEL`** first, then **`NEXT_PUBLIC_SUPPORT_PHONE`**. If both are empty, phone links fall back to **`/contact`**.

---

## Verification

- `npm run build` (frontend) — success  
- `npm run build` (backend) — success  

---

## Completed as requested

Premium **header** (scroll state, mobile drawer), **footer** (four columns, service deep links, social icons, contact block), **how-it-works anchor**, **`GET /health`**, **clearer Prisma-related HTTP responses**, **structured logging**, optional **`debug`** payload in development for unknown errors, **`siteContact` compatibility** restored for contact page + form, and this runbook for what you must configure and run yourself.
