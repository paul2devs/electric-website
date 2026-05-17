# Frontend (Vercel) + Backend (Render)

The **API runs on Render only**. Vercel hosts the Next.js frontend. Do not use `/_/backend` or Vercel Services for the API.

## Why login was 404

The client called `https://<vercel-app>/_/backend/auth/login` because:

1. `lib/constants/api.ts` used a **`VERCEL=1` fallback** to `/_/backend`.
2. **`NEXT_PUBLIC_BACKEND_URL`** (relative) was resolved against the Vercel origin.
3. **`vercel.json` rewrites** still pointed at a removed Vercel backend.

Those paths are removed. The app only uses **`NEXT_PUBLIC_API_URL`** → your Render URL.

## Vercel (frontend) — required env

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://electric-site-three.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` |

**Do not set** `NEXT_PUBLIC_BACKEND_URL` or any value containing `/_/backend`.

After changing env vars, **redeploy** (Production) so Next.js inlines new `NEXT_PUBLIC_*` values.

## Render (backend) — required env

| Variable | Example |
|----------|---------|
| `FRONTEND_ORIGIN` | `https://electric-site-three.vercel.app` |
| `DATABASE_URL` | PostgreSQL |
| `REDIS_URL` | Redis |
| `JWT_ACCESS_SECRET` | secret |
| `JWT_REFRESH_SECRET` | secret |
| `COOKIE_SECURE` | `true` |
| `PORT` | `10000` (or Render default) |

Do **not** set `API_ROUTE_PREFIX` unless you intentionally mount under a subpath. Routes are:

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /health`

CORS allows `FRONTEND_ORIGIN` and any `*.vercel.app` origin.

## Verify

1. `GET https://your-api.onrender.com/health`
2. Login in browser → Network → `POST https://your-api.onrender.com/auth/login` (not Vercel, not `/_/backend`)
3. `POST https://your-api.onrender.com/auth/refresh` with cookies

## Local dev

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
cd backend && npm run start:dev
npm run dev
```
