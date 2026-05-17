# Premium platform upgrade

Production upgrade covering typography, hero gradients, SEO/PWA, service images, booking slug resolution, navigation, and Vercel deployment notes.

## 1. Hero gradients (Services, Our Work, About, Contact)

- **`PageHero`** — dark / light / soft shells with premium blue gradients, optional background image, readable overlays
- **`hero-shell-dark`** — deep navy → blue cinematic gradient + radial light
- **`hero-shell-light` / `hero-shell-soft`** — white → indigo tint for catalogue pages
- **Buttons** — primary uses light blue gradient (`components/ui/button.tsx`)
- **Cards** — `card-gradient-surface`, `card-gradient-dark` for contact options and booking picker

## 2. Typography (Clash Display + Satoshi + Inter)

- **Inter** — `next/font` base UI (`--font-inter`)
- **Clash Display + Satoshi** — Fontshare CDN in root layout
- **CSS** — `--font-display` (Clash), body uses Satoshi stack; headings use display font
- **`HeroTitle`** — sans lead + gradient/display accent

## 3. Header

- **Home** link added to primary nav (desktop + mobile)
- Active state for `/` home route

## 4. SEO + PWA

- **`lib/seo/site-metadata.ts`** — `buildPageMetadata`, OG + Twitter large image, canonical URLs
- **Root layout** — default metadata, `viewport.themeColor`, Organization JSON-LD
- **`app/manifest.ts`** — installable PWA manifest
- **Assets** — `/og-preview.svg`, `/icons/icon-192.svg`, `/icons/icon-512.svg`
- Set per-page metadata via `buildPageMetadata` on marketing routes

## 5. Service images (everywhere)

### Backend

- Prisma `Service.slug` (unique) + `Service.imageUrl`
- Migration: `backend/prisma/migrations/20260516120000_service_slug_image/`
- Admin create/update accepts `slug` + `imageUrl`
- Seed maps all catalogue slugs + `/services/{slug}.svg` paths

### Frontend

- **`lib/services/service-media.ts`** — `enrichBackendServices`, `resolveServiceImage`, `getCatalogImagePath`
- **`ServiceImage`** component
- **Displayed in:** services grid, featured spotlight, booking picker, booking summary, home featured block (via image paths)
- **Admin** — slug + image path fields in service drawer

### Public assets

Place real photos in `public/services/` using filenames from seed (e.g. `smart-home-automation.svg` → your `.jpg`).

## 6. Booking `serviceId` fix

**Issue:** Draft in `localStorage` overrode URL `?serviceId=smart-home-automation`.

**Fix:**

- URL query resolves **before** draft when `serviceId` is present
- **`resolveInitialServiceId`** matches UUID, API `slug`, static catalogue slug, and name
- Clear error if slug in URL cannot be matched (no silent fallback to CCTV)

## 7. Vercel deployment

### Frontend project

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://your-api.vercel.app` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Operations inbox |
| `NEXT_PUBLIC_WHATSAPP_E164` | WhatsApp digits |
| `NEXT_PUBLIC_CONTACT_PHONE_*` | Display + tel |

`getApiBaseUrl()` throws in production if `NEXT_PUBLIC_API_URL` is missing (no localhost fallback).

### Backend project (separate Vercel project)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL (Neon/Supabase) |
| `REDIS_URL` | Slot locks / queues |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Auth |
| `CORS_ORIGIN` | Frontend URL |
| SMTP / email vars | Notifications |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin |

After deploy: run migrations + `npx prisma db seed` against production DB.

### CORS

Ensure Nest `CORS_ORIGIN` includes your frontend Vercel URL.

---

## Post-deploy checklist

1. Replace `public/services/*` and `public/og-preview.svg` with brand photography  
2. Set all `NEXT_PUBLIC_*` vars on Vercel frontend  
3. Set backend env + run Prisma migrate/seed  
4. Test `/book?serviceId=smart-home-automation` — must select Smart Home Automation  
5. Share a link and confirm OG preview (title, description, image)  
6. Install PWA from browser “Add to Home Screen”
