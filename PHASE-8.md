# Phase 8 - Notifications, Events, Email, and Real-time Updates

## Overview

Phase 8 introduces a full async event-driven notification pipeline across backend and frontend:

- Domain event emission from booking and admin operations
- BullMQ-based notification queue
- Worker-based delivery pipeline for email + in-app notifications
- WebSocket real-time broadcasts to user and admin dashboards
- Notification storage and read/unread tracking
- Notification bell UI in dashboard and admin layouts

## Event-Driven Architecture

Implemented architecture pattern:

`Action -> Event -> Queue -> Notification -> Delivery`

### Implemented Event Types

- `BOOKING_CREATED`
- `BOOKING_CONFIRMED`
- `TECHNICIAN_ASSIGNED`
- `BOOKING_STARTED`
- `BOOKING_COMPLETED`
- `BOOKING_CANCELLED`

### Event Infrastructure

Added module: `backend/src/modules/events`

- `events.module.ts`
- `events.service.ts` with `emit(eventType, payload)`
- `constants/event-types.ts`

## Notification System

Added module: `backend/src/modules/notifications`

### Data Model

Prisma model added:

- `Notification`
  - `id`
  - `userId`
  - `type`
  - `message`
  - `read`
  - `createdAt`

User model relation added:

- `notifications Notification[]`

### API Endpoints

Implemented user notification APIs:

- `GET /notifications`
  - Returns latest items + unread count
- `PATCH /notifications/:id`
  - Marks read/unread

Both are JWT-protected.

### Queue and Worker

- Queue name: `notifications-queue`
- BullMQ queue producer: `NotificationsQueue`
- Worker processor: `NotificationsProcessor`
- Event listeners: `NotificationsEventsHandler` (`@OnEvent(...)`)

The queue runs asynchronously and never blocks booking/admin API response time.

## Email Delivery

Implemented provider abstraction in `EmailService` with runtime selection:

- SMTP (Google compatible)
- Resend
- SendGrid

Provider is selected using `EMAIL_PROVIDER` env.

### Email Types Delivered

- Booking received/created
- Booking confirmed
- Technician assigned
- Service started
- Service completed
- Booking update/cancel flow

Templates include service/date/time/status and relevant booking details.

## Real-time Updates (WebSockets)

Implemented Socket.IO gateway:

- `NotificationsGateway`

Live channels:

- User rooms: `user:<userId>`
- Role room for admins: `role:admin`

Emitted realtime events:

- `booking_updated`
- `technician_assigned`
- `booking_status_changed`

## Business Logic Integration

### Bookings Module

`BookingsService` now emits:

- `BOOKING_CREATED` on successful booking creation
- Lifecycle events from status updates

### Admin Module

`AdminService` now emits:

- `BOOKING_CONFIRMED`
- `TECHNICIAN_ASSIGNED`
- `BOOKING_STARTED`
- `BOOKING_COMPLETED`
- `BOOKING_CANCELLED`

This keeps notification logic decoupled from business logic and controllers.

## Frontend Integration

### New Frontend Notification Layer

Added:

- `lib/notifications/api.ts`
- `lib/notifications/types.ts`
- `lib/realtime/socket.ts`
- `components/notifications/notification-bell.tsx`

### UI Features

- Notification bell added to dashboard and admin top bars
- Dropdown list with unread counter
- Mark-as-read actions
- Live insertion of incoming notifications

### Real-time Page Refresh Hooks

- Dashboard page listens for status/booking realtime events and refreshes data
- Admin overview listens for activity/assignment realtime events and refreshes metrics/feed

## Files Added / Updated (Key)

### Added

- `backend/src/modules/events/*`
- `backend/src/modules/notifications/*`
- `lib/notifications/*`
- `lib/realtime/socket.ts`
- `components/notifications/notification-bell.tsx`
- `PHASE-8.md`

### Updated

- `backend/prisma/schema.prisma`
- `backend/src/app.module.ts`
- `backend/src/modules/bookings/bookings.module.ts`
- `backend/src/modules/bookings/bookings.service.ts`
- `backend/src/modules/admin/admin.module.ts`
- `backend/src/modules/admin/admin.service.ts`
- `components/layout/dashboard-shell.tsx`
- `components/layout/admin-shell.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(admin)/admin/page.tsx`

## Environment Variables

### Backend `.env`

```env
DATABASE_URL="postgresql://<neon-connection-string>"
REDIS_URL="<upstash-redis-url>"
JWT_ACCESS_SECRET="<strong-random-secret>"
JWT_REFRESH_SECRET="<strong-random-secret>"
FRONTEND_ORIGIN="http://localhost:3000"
PORT=3001

EMAIL_PROVIDER="smtp"
EMAIL_FROM="no-reply@yourdomain.com"

# SMTP (Google-compatible)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="<google-workspace-or-gmail-address>"
SMTP_PASS="<app-password>"

# Optional provider keys when EMAIL_PROVIDER switches
RESEND_API_KEY="<resend-key>"
SENDGRID_API_KEY="<sendgrid-key>"
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
```

## Start and Verify

### 1) Install dependencies

- Root: `npm install`
- Backend: `cd backend && npm install`

### 2) Generate Prisma and migrate

From `backend`:

- `npm run prisma:generate`
- `npx prisma migrate dev`
- `npm run prisma:seed`

### 3) Start services

- Backend: `cd backend && npm run start:dev`
- Frontend: `npm run dev`

### 4) Verify notification flow

1. Log in as user and create a booking.
2. Confirm/assign/update booking from admin.
3. Verify:
   - new notification appears in user bell
   - unread count updates
   - dashboard and admin activity refresh in real-time
   - transactional email is sent asynchronously

## Validation Completed

- Prisma client generation: passed
- Frontend lint: passed
- Frontend build: passed
- Backend build: passed
