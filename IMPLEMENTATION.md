# Implementation summary

This document describes what was implemented in this pass and which environment variables the stack expects.

## Backend (NestJS)

### Bookings

- **Responses** now include `price` (total) and optional `serviceName` everywhere booking payloads are returned, matching how the dashboard and booking success screen consume data (fixes `NaN` when the UI expected a top-level `price`).
- **List and detail** queries load the related `service` record so names are always present for customer views.
- **Customer cancel**: `POST /bookings/:id/cancel` — allowed unless the booking is already completed or cancelled; sets status to `cancelled` and marks related invoices as `void`.
- **Customer reschedule**: `POST /bookings/:id/reschedule` — body: `date`, `time`, `lockToken`, `quotedTotal`; validates the Redis slot lock, prevents slot conflicts (excluding the current booking), recalculates pricing, updates the booking and invoice amount, unlocks the slot, and emits `BOOKING_RESCHEDULED`.

### Availability

- **Slot generation** advances by `max(interval, service duration)` so overlapping slot definitions no longer collapse availability to a single time when duration exceeds the interval.

### Pricing

- **Calculate** responses include `serviceName` and `serviceCategory` for breakdown UIs.

### Invoices

- **List/detail** include `booking.service.name` as `booking.serviceName` on API responses.

### Notifications

- **Deduping**: creating a notification with the same `userId`, `type`, and `message` within about two minutes returns the existing row instead of inserting duplicates (reduces stacked duplicate alerts and noisy jobs).

### Domain events

- **`BOOKING_RESCHEDULED`** added with queue + email template support.

## Frontend (Next.js)

### Admin booking detail

- **Stable loading and errors**: resolves dynamic route `id` whether it is a string or array; distinguishes loading, error, and missing booking; surfaces API messages instead of silent failures or infinite loading (fixes unhandled rejections when the API returns 404 or the network fails).

### Booking flow (`/book`)

- **Initial service**: resolves `serviceId` query as either a UUID or a **marketing slug** by matching catalogue service names to API services (`resolveInitialServiceId`).
- **Back navigation**: unlocking the Redis slot when moving back from date/time or details steps so users can change service or slot without stale locks.
- **Success pricing**: displays `result.pricing.total` (aligned with API).
- **Marketing links**: `bookContactHref(service.slug)` passes the slug into `?serviceId=` so the flow auto-selects without re-picking.

### Pricing sidebar

- Shows **service name**, **category**, base, urgency, distance, add-ons, and total.

### Dashboard booking detail

- **Cancel** and **Reschedule** call the new APIs; reschedule uses `useRescheduleFlow` (availability, lock, pricing, confirm).

### Invoices

- **Row selection** updates `?invoiceId=` and **fetches** the selected invoice so every row works (no longer only the first).
- **Copy**: removed marketing placeholder phrasing; invoice detail uses clear hierarchy and a print/PDF action.
- **Suspense** boundary for `useSearchParams` compatibility.

### Notifications bell

- **Display dedupe** by `type + message` (keeps the newest).
- Clearer timestamps, read/unread styling, and labelling.

### Auth

- Login and register buttons show **Signing in…** / **Creating account…** and disable while submitting.

### UI / marketing

- **Global typography**: slightly heavier body weight and improved line height; **primary buttons** use a controlled gradient.
- **Home hero**: gradient section background and image overlay gradients; hero image path `public/hero-electrician.svg` (replace with your photo).
- **MarketingHero** on **Services**, **Contact**, and **About** with gradient stacks and optional background imagery: `public/marketing-services.svg`, `marketing-contact.svg`, `marketing-about.svg` (swap for JPG/PNG under the same names or update paths in the page files).

## Environment variables

### Frontend (`electric_website`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE_URL` | Base URL for the Nest API (no trailing slash). Defaults to `http://localhost:3001` if unset. |
| `NEXT_PUBLIC_APP_URL` | Site URL for metadata (defaults to `http://localhost:3000`). |

### Backend (`electric_website/backend`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma. **Required**; a missing or wrong value causes Prisma `P1001` (cannot reach database). |
| `REDIS_URL` | Redis for BullMQ locks and notification queue. If unset, slot locking and the notification worker may be degraded per existing backend behaviour. |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens (JWT strategy). |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (if used by auth module). |
| `BOOKING_DAY_START` | Optional; default `09:00`. |
| `BOOKING_DAY_END` | Optional; default `18:00`. |
| `BOOKING_SLOT_INTERVAL_MINUTES` | Optional; default `60`. |
| `BOOKING_LOCK_TTL_SECONDS` | Optional; default `300`. |
| `PRICING_DISTANCE_MID_FEE` / `PRICING_DISTANCE_FAR_FEE` | Optional distance pricing tiers. |
| Email transport variables | As required by `EmailService` / SMTP (check `backend` config and `.env.example` if present). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional seed overrides for `prisma/seed.ts`. |

Ensure the API origin you use in the browser matches `NEXT_PUBLIC_API_URL` and that **PostgreSQL is running** and migrated (`npx prisma migrate deploy` / `db push` as appropriate for your workflow).

## Assets

Replace placeholder SVGs in `public/` with final photography or illustrations:

- `hero-electrician.svg` → can become `hero-electrician.jpg` after updating `components/sections/hero-section.tsx`.
- `marketing-*.svg` → swap files or point `imageSrc` in the respective pages to new filenames.
