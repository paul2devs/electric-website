# Phase 4 — Booking engine, availability, and slot locking

This phase implements the production booking core with service-driven availability, Redis slot locking, transactional booking creation, and a multi-step authenticated booking flow.

## Implemented backend architecture

Backend root: `backend/`

### Prisma schema

Updated `backend/prisma/schema.prisma`:

- `Service`
  - `id`, `name` (unique), `category`, `basePrice`, `duration`, `createdAt`
- `Booking`
  - `id`, `userId`, `serviceId`, `date`, `time`, `status`, `address`, `phone`, `notes`, `price`, `createdAt`
  - `@@unique([serviceId, date, time])` for hard DB-level double-booking prevention
  - relation to `User` and `Service`
- `BookingStatus` enum:
  - `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`

### New modules

Created:

- `src/modules/services`
  - `GET /services`
- `src/modules/availability`
  - `GET /availability?serviceId=...&date=YYYY-MM-DD`
  - `POST /availability/lock`
  - `POST /availability/unlock`
- `src/modules/bookings`
  - `POST /bookings`
  - `GET /bookings/mine`
  - `PATCH /bookings/:id/status` (admin only)

Registered in `src/app.module.ts`.

### Availability logic

`AvailabilityService` now:

- Generates slots from env-configured working window:
  - `BOOKING_DAY_START`
  - `BOOKING_DAY_END`
  - `BOOKING_SLOT_INTERVAL_MINUTES`
- Uses service `duration` to determine valid slot starts
- Excludes slots that are:
  - already booked in PostgreSQL
  - currently locked in Redis

### Redis lock strategy (Upstash-compatible)

Lock key format:

- `lock:<serviceId>:<date>:<time>`

Lock flow:

- `POST /availability/lock` uses Redis `SET key value EX ttl NX`
- lock value stores owner-specific token: `<userId>:<random-uuid>`
- lock ttl from `BOOKING_LOCK_TTL_SECONDS` (default 300)
- `POST /availability/unlock` removes lock only when token matches

`RedisService` uses `ioredis` and supports lazy connect + safe reconnect attempts.

### Booking creation (atomic + race-safe)

`POST /bookings` flow in `BookingsService`:

1. Validate DTO
2. Validate service exists
3. Validate lock ownership (`serviceId/date/time/lockToken/userId`)
4. Create booking inside DB transaction
5. Handle unique conflict (`P2002`) and convert to conflict response
6. Release lock after success (or conflict path)

This gives dual protection:

- DB unique constraint (authoritative)
- Redis lock (short-term reservation during checkout)

### Security and abuse protection

- DTO validation via `class-validator`
- JWT guard on lock/unlock/bookings endpoints
- Throttling applied:
  - lock endpoint limit
  - booking creation limit
- Sensitive internals are not leaked in API responses

## Implemented frontend booking system

Frontend root: `electric_website/`

### Booking route

- New page: `app/(marketing)/book/page.tsx`
- Auth-protected via `RequireAuth`

### Multi-step booking flow

`components/booking/booking-flow.tsx` + `hooks/use-booking-flow.ts`:

- Step 1: select service
- Step 2: select date and lock a time slot
- Step 3: enter phone/address/notes
- Step 4: review booking details and price
- Step 5: success state with booking ID

### Frontend API layer

- `lib/bookings/api.ts` for booking endpoints
- `lib/auth/auth-api.ts` now exposes `fetchWithAuth()` with 401 refresh retry
- `bookContactHref()` now routes to booking flow (`/book`) with optional `serviceId`

### Types

- `lib/bookings/types.ts` defines typed payloads for services, booking draft, and booking result

## Seed data

Added seed support in backend:

- `backend/prisma/seed.ts`
- `backend/package.json` scripts:
  - `prisma:seed`

This seeds core services so booking flow has selectable data.

## Environment variables

### Frontend `.env.local` (root)

From root `.env.example`:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

### Backend `.env.local` (`backend/`)

From `backend/.env.example` (Neon + Upstash-ready):

- `DATABASE_URL` (`postgresql://...sslmode=require` for Neon)
- `REDIS_URL` (`rediss://...` for Upstash)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `PORT`
- `FRONTEND_ORIGIN`
- `COOKIE_SECURE`
- `BOOKING_DAY_START`
- `BOOKING_DAY_END`
- `BOOKING_SLOT_INTERVAL_MINUTES`
- `BOOKING_LOCK_TTL_SECONDS`

## How to run and verify locally

1. Backend setup

```bash
cd /home/paulsmithdev/Desktop/electric_website/backend
cp .env.example .env.local
npm install
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

2. Frontend setup (new terminal)

```bash
cd /home/paulsmithdev/Desktop/electric_website
cp .env.example .env.local
npm install
npm run dev
```

3. Verify full flow

- Register: `/register`
- Login: `/login`
- Open booking: `/book`
- Select service/date/time, confirm booking
- Re-open same slot in another session to confirm lock/availability behavior

## Validation status

- Root lint: `npm run lint` passes
- Root build: `npm run build` passes
- Backend build: `cd backend && npm run build` passes

---

**Phase 4 completed as requested** — booking engine, slot availability, Redis locking, transactional booking creation, and authenticated multi-step booking UI are implemented and production-structured.
