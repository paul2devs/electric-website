# Phase 5 — Smart pricing engine + real-time booking price

Phase 5 adds a backend-centered pricing engine and integrates live pricing into the booking flow.

## Architecture implemented

## Backend pricing architecture

New module: `backend/src/modules/pricing`

- `PricingService` centralizes all pricing logic.
- `PricingController` exposes `POST /pricing/calculate`.
- `PricingModule` is imported into `AppModule` and injected into `BookingsModule`.

Pricing breakdown formula:

- `base` from `Service.basePrice`
- `urgency` from service date/time proximity
- `distance` from mock distance km (configurable fee tiers)
- `addons` sum of selected AddOn prices
- `total` as exact backend-calculated final amount

## Booking validation flow

On booking confirmation (`POST /bookings`):

1. Backend recalculates price using submitted service/date/time/address/distance/add-ons.
2. Backend compares `quotedTotal` from frontend with recalculated total.
3. If mismatch, request is rejected with a price-changed error.
4. If valid, booking proceeds inside transaction with existing lock and uniqueness protections.

This guarantees final price integrity on server side.

## Prisma updates

Updated `backend/prisma/schema.prisma`:

- `Service`
  - added `pricingType String @default("fixed")`
  - relation `addOns AddOn[]`
- new `AddOn` model
  - `id`, `name`, `price`, `serviceId`
- `Booking`
  - added `addOnIds String[] @default([])` to persist selected add-ons
  - keeps unique slot constraint for double-booking prevention

## API endpoints

- `POST /pricing/calculate`
  - input: `serviceId`, `date`, `time`, `address`, `mockDistanceKm`, `addOnIds`
  - output: `{ serviceId, addOnIds, distanceKm, breakdown: { base, urgency, distance, addons, total } }`

Existing booking endpoint enhanced:

- `POST /bookings`
  - now expects `mockDistanceKm`, `addOnIds`, `quotedTotal`
  - recalculates price backend-side before insert

## Real-time frontend pricing integration

Updated booking flow (`/book`):

- Service list now includes backend add-ons.
- User can select add-ons in step 1.
- User sets distance km in step 3 (mock distance input).
- Pricing panel updates dynamically from backend API when:
  - service changes
  - add-ons change
  - date/time changes
  - address changes
  - distance changes

UI components:

- `components/booking/pricing-panel.tsx`
- right-side panel on desktop, stacked naturally on mobile
- clean divider-based breakdown and right-aligned totals

## Files added/updated (core)

Backend:

- `backend/src/modules/pricing/*`
- `backend/src/modules/bookings/dto/create-booking.dto.ts`
- `backend/src/modules/bookings/bookings.service.ts`
- `backend/src/modules/bookings/bookings.module.ts`
- `backend/src/modules/services/services.service.ts`
- `backend/src/modules/services/services.controller.ts`
- `backend/src/app.module.ts`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/.env.example`

Frontend:

- `lib/bookings/types.ts`
- `lib/bookings/api.ts`
- `hooks/use-booking-flow.ts`
- `components/booking/pricing-panel.tsx`
- `components/booking/booking-flow.tsx`

## Environment variables

Root `.env.local` (frontend):

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

Backend `backend/.env.local` (Neon + Upstash compatible):

- `DATABASE_URL="postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require"`
- `REDIS_URL="rediss://default:<password>@<upstash-host>:6379"`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `PORT`
- `FRONTEND_ORIGIN`
- `COOKIE_SECURE`
- `BOOKING_DAY_START`
- `BOOKING_DAY_END`
- `BOOKING_SLOT_INTERVAL_MINUTES`
- `BOOKING_LOCK_TTL_SECONDS`
- `PRICING_DISTANCE_MID_FEE`
- `PRICING_DISTANCE_FAR_FEE`

## How to start and test

1. Backend

```bash
cd /home/paulsmithdev/Desktop/electric_website/backend
cp .env.example .env.local
npm install
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

2. Frontend

```bash
cd /home/paulsmithdev/Desktop/electric_website
cp .env.example .env.local
npm install
npm run dev
```

3. Verify flow

- Register/login
- Open `/book`
- Change service/date/time/add-ons/address/distance and confirm pricing updates
- Confirm booking
- Verify booking persists with backend total and selected add-ons

## Validation status

- `npm run lint` (root): passed
- `npm run build` (root): passed
- `cd backend && npm run build`: passed

---

**Phase 5 completed as requested** — dynamic backend-calculated pricing and real-time frontend pricing display are fully integrated with booking confirmation price validation.
