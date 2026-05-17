# Phase 6 — User dashboard, booking management, and invoicing

Phase 6 adds a complete authenticated user dashboard with production-grade data isolation, booking management views, invoice endpoints/UI, and profile/security settings.

## Implemented architecture

## Dashboard frontend architecture

New dashboard pages under `app/(dashboard)`:

- `dashboard/page.tsx` (overview)
- `bookings/page.tsx` (booking history list)
- `bookings/[id]/page.tsx` (booking detail)
- `invoices/page.tsx` (invoice list + PDF-ready invoice detail structure)
- `settings/page.tsx` (profile, address, password)

Persistent dashboard layout:

- sidebar + content shell
- active nav state via `SidebarNav`
- minimal, structured, table-driven interface

Dashboard components added:

- `StatCard`
- `BookingRow`
- `StatusBadge`
- `SidebarNav`
- `SectionHeader`

## Dashboard backend architecture

### User profile and security

- `GET /user/profile`
- `PATCH /user/profile`
- `PATCH /user/password`

### Booking management

- `GET /bookings` (current user only)
- `GET /bookings/:id` (current user only)
- existing `POST /bookings` remains and now stores pricing breakdown fields
- `PATCH /bookings/:id/status` remains admin-only

### Invoice management

- `GET /invoices` (current user only)
- `GET /invoices/:id` (current user only)

All dashboard endpoints are JWT-guarded.

## Data model updates

Updated Prisma schema (`backend/prisma/schema.prisma`):

### User

Added:

- `phone String?`
- `address String?`

### Booking

Added fields for detailed billing history:

- `baseAmount`
- `urgencyFee`
- `distanceFee`
- `addonsFee`
- `distanceKm`

(These are persisted at booking time and reused for dashboard/invoices.)

### Invoice

New model:

- `Invoice`
  - `id`, `bookingId` (unique), `userId`, `amount`, `status`, `issuedAt`

Booking creation now creates invoice records transactionally.

## Data flow and safety

- Booking creation performs pricing validation and then writes booking + invoice in a transaction.
- Dashboard queries are user-scoped (`where: { userId }`), preventing cross-user data access.
- Invoice detail uses persisted booking pricing fields for consistent financial display.

## Frontend data layer

Added `lib/dashboard/*`:

- `types.ts` for bookings/invoices/stats models
- `api.ts` for secure fetch calls and profile/password updates

Stats are computed from bookings with clear metrics:

- Total Bookings
- Completed Services
- Upcoming Jobs
- Total Spent

## Environment variables

No new root frontend variables were required beyond existing:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

Backend still uses Neon + Upstash compatible variables:

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

## Seeded admin account

Added in `backend/prisma/seed.ts`:

- Email: `testimonydot@gmail.com`
- Password: `Testimony@2026#Admin`
- Role: `admin`

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

3. Verify dashboard flow

- Register/login as user
- Open `/dashboard`
- Review `/bookings`, `/bookings/[id]`, `/invoices`, `/settings`
- Login as admin with seeded credentials to verify admin role functionality

## Validation status

- `cd backend && npm run build` passed
- `npm run lint` (root) passed
- `npm run build` (root) passed

---

**Phase 6 completed as requested** — premium user dashboard, booking management, invoice retrieval, and profile/security settings are fully implemented with user-scoped backend access controls.
