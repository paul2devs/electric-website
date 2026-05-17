# Phase 3 — Authentication system + backend foundation

This phase adds a real authentication backend (NestJS + Prisma + JWT) and integrates it into the existing Next.js marketing + dashboard UI.

## Backend (NestJS) overview

Backend lives in `backend/`.

### Modules

- `src/modules/users/`
  - `UsersService` — create users, lookup users, and return a safe user shape (no password exposure).
- `src/modules/auth/`
  - `AuthController` — HTTP endpoints (`/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`)
  - `AuthService` — register, login, refresh access token
  - `JwtStrategy` — validates access tokens from `Authorization: Bearer <token>`
  - `JwtAuthGuard` — protects `/auth/me`
- `src/prisma/`
  - `PrismaService` — Prisma client wiring
- `src/redis/`
  - `RedisService` — Redis client scaffolding for future booking/queue work

### JWT + cookies

- Access token: short-lived JWT in memory (frontend only).
- Refresh token: long-lived JWT stored as an **HTTP-only cookie** named `refreshToken`.
- Access token payload:
  - `sub` (userId), `email`, `role`

### API endpoints

- `POST /auth/register`
  - body: `{ name, email, password }`
  - returns: `{ user }`
- `POST /auth/login`
  - body: `{ email, password }`
  - returns: `{ accessToken, user }`
  - sets: `refreshToken` cookie
- `POST /auth/refresh`
  - reads: `refreshToken` cookie
  - returns: `{ accessToken }`
  - issues new access token; refresh token cookie remains valid until expiry
- `POST /auth/logout`
  - clears: `refreshToken` cookie
- `GET /auth/me`
  - protected by JWT access token
  - returns: safe user object

## Frontend (Next.js) integration

### Auth state

Frontend auth state lives in:

- `lib/auth/auth-context.tsx` (`AuthProvider`)
- `hooks/use-auth.ts` (exported hook)

Behavior:

- On load, the provider attempts `authRefresh()` (uses refresh cookie).
- If refresh succeeds, it calls `authMe()` and stores the safe user.
- Access token is stored in-memory via `lib/auth/access-token.ts`.

### Protected routes

- Dashboard is protected using `components/auth/require-auth.tsx`.
- If the user is not authenticated (after session load), it redirects to `/login?next=<path>`.

### Login/register pages

- `/login` and `/register` submit real API requests to the backend.
- Form validation remains client-side (no dummy placeholders).

## Prisma schema

Prisma schema is in `backend/prisma/schema.prisma` and defines:

- `User` with `id`, `name`, `email` (unique), `password`, `role` (default `user`), `createdAt`.

## Environment variables

### Root `.env.local` (frontend)

Create `.env.local` by copying the root `.env.example`:

- `NEXT_PUBLIC_APP_URL` (default: `http://localhost:3000`)
- `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`)

### Backend `.env.local` (API)

Create `.env.local` inside `backend/` by copying `backend/.env.example` and updating values:

- `DATABASE_URL` (PostgreSQL connection string)
- `REDIS_URL` (Redis connection string)
- `JWT_ACCESS_SECRET` (min recommended length: 32 chars)
- `JWT_REFRESH_SECRET` (min recommended length: 32 chars)
- `PORT` (default: `3001`)
- `FRONTEND_ORIGIN` (must match your Next.js origin, e.g. `http://localhost:3000`)
- `COOKIE_SECURE` (`false` for local dev over http, `true` in production with https)

## How to start locally (so you can sign up and log in)

Prereqs:

- PostgreSQL running
- Redis running (not strictly required for auth to work yet, but the module is wired)

1. Backend setup

```bash
cd backend
cp .env.example .env.local
npm run prisma:migrate
npm run start:dev
```

2. Frontend setup

Open a new terminal:

```bash
cd /home/paulsmithdev/Desktop/electric_website
cp .env.example .env.local
npm run dev
```

3. Test the flow

- Open `/register`, create a user
- Go to `/login`, sign in
- Dashboard should load after auth

## Phase 3 completed as requested

This phase delivers a secure, modular authentication system with NestJS + Prisma + JWT access/refresh tokens, HTTP-only refresh cookies, frontend auth context, and protected dashboard routing.

