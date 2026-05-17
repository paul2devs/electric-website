# Phase 7 - Admin Panel + Operations System + Technician Management + Analytics

## Implemented Scope

Phase 7 delivers a role-protected admin control layer across backend and frontend.

### Backend Architecture

- Added `AdminModule` with `AdminController` and `AdminService` for all admin operations.
- Added `TechniciansModule` and `TechniciansService` for technician lifecycle and workload tracking.
- Added `AdminGuard` and applied `JwtAuthGuard + AdminGuard` to all `/admin/*` endpoints.
- Hardened authentication checks to reject blocked users during login and JWT validation.

### Prisma Data Model Updates

- Added `Technician` model with:
  - `id`, `name`, `phone`, `skills`, `status`, `createdAt`
- Added `TechnicianStatus` enum:
  - `available`, `busy`, `offline`
- Updated `Booking` model:
  - `technicianId` relation
  - booking lifecycle includes `assigned`
- Added `isBlocked` to `User` for soft blocking users.
- Booking status enum now supports:
  - `pending`, `confirmed`, `assigned`, `in_progress`, `completed`, `cancelled`

### Admin API Endpoints

Implemented and protected all required admin APIs:

- `GET /admin` (overview metrics + live activity)
- `GET /admin/bookings`
- `GET /admin/bookings/:id`
- `PATCH /admin/bookings/:id`
- `POST /admin/assign-technician`
- `GET /admin/services`
- `POST /admin/services`
- `PATCH /admin/services/:id`
- `DELETE /admin/services/:id`
- `GET /admin/users`
- `PATCH /admin/users/:id/block?block=true|false`
- `GET /admin/technicians`
- `POST /admin/technicians`
- `PATCH /admin/technicians/:id`
- `GET /admin/analytics`

### Admin Frontend Route Group

Added complete admin UI under:

- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/bookings/page.tsx`
- `app/(admin)/admin/bookings/[id]/page.tsx`
- `app/(admin)/admin/services/page.tsx`
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/admin/technicians/page.tsx`
- `app/(admin)/admin/analytics/page.tsx`

### Access Control

- Added `RequireAdmin` client gate for admin route group.
- Unauthorized users are redirected away from admin pages.
- Non-authenticated users are redirected to login with `next` support.

### Admin UI Components Built

- `AdminTable`
- `AdminStatusBadge`
- `ActionMenu`
- `DrawerPanel`
- `MetricsCard`
- `AdminSidebarNav`
- `AdminShell`

### Data Layer

Added dedicated admin API and types:

- `lib/admin/api.ts`
- `lib/admin/types.ts`

### Routing Constants

Extended app routing constants with all admin paths in:

- `lib/constants/routes.ts`

## Environment Variables

Use these in your backend `.env`:

```env
DATABASE_URL="postgresql://<neon-connection-string>"
JWT_ACCESS_SECRET="<strong-random-secret>"
JWT_REFRESH_SECRET="<strong-random-secret>"
REDIS_URL="<upstash-redis-url>"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Use these in your frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

## Admin Login

Seeded admin account:

- Email: `testimonydot@gmail.com`
- Password: `Testimony@2026#Admin`

## How To Start and Verify

### 1) Install dependencies

- Frontend: `npm install`
- Backend: `cd backend && npm install`

### 2) Generate Prisma client and sync DB

From `backend` directory:

- `npm run prisma:generate`
- `npx prisma migrate dev`
- `npm run prisma:seed`

### 3) Start services

- Backend: `cd backend && npm run start:dev`
- Frontend: `npm run dev`

### 4) Open admin panel

- Visit: `http://localhost:3000/admin`
- Sign in with seeded admin credentials.

### 5) Verify operations

- Bookings: assign technician, update statuses, inspect details drawer.
- Services: create/update/delete catalog entries.
- Technicians: add/update and toggle availability states.
- Users: soft-disable and re-enable accounts.
- Analytics: confirm monthly revenue, service popularity, and peak time data rendering.

## Validation Completed

- Frontend lint: passed
- Frontend production build: passed
- Backend Prisma client generation: passed
- Backend build: passed
