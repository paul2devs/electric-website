# Vercel production deployment

Monorepo: Next.js (`/`) + NestJS (`/_/backend`) via **Vercel Services**.

## Required: project framework = Services

In **Vercel → Project → Settings → General → Framework Preset**, choose **Services** (not plain Next.js).

`vercel.json` must contain `experimentalServices` (see repo root). If the preset is only Next.js, deploy can fail with a generic CLI error.

## Configuration (`vercel.json`)

- **frontend** — repo root, Next.js, `/`
- **backend** — `backend/`, NestJS, `/_/backend`
- Do **not** add `backend/vercel.json` with `outputDirectory: dist` (breaks serverless detection).

## Environment variables (Production)

### Frontend

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://your-domain.vercel.app/_/backend` |
| `NEXT_PUBLIC_REALTIME_ENABLED` | `false` |

If `NEXT_PUBLIC_API_URL` is unset, Vercel Services injects `NEXT_PUBLIC_BACKEND_URL=/_/backend` and the app resolves it at runtime.

### Backend (same project)

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL |
| `REDIS_URL` | Upstash Redis |
| `JWT_ACCESS_SECRET` | 32+ chars |
| `JWT_REFRESH_SECRET` | 32+ chars |
| `FRONTEND_ORIGIN` | `https://your-domain.vercel.app` |
| `COOKIE_SECURE` | `true` |

**Never** use `localhost` in Production env vars.

## Do not deploy local `.env`

Use Vercel dashboard env only. `.vercelignore` excludes `.env` files from uploads.

## Deploy

```bash
vercel pull --yes --environment=production   # first time / after dashboard changes
vercel --prod
```

If you see `Unexpected error. Please try again later`:

1. Confirm Framework Preset is **Services**.
2. Update Vercel CLI: `npm i -g vercel@latest`
3. Retry: `vercel --prod --debug` and check the last error line.
4. In dashboard → Deployments → open failed deploy for build logs (CLI errors are often upload/config, not build).

## Migrations

```bash
cd backend && npx prisma migrate deploy
```

## Verify

| Check | Expected |
|-------|----------|
| Health | `GET /_/backend/health` → `{ "ok": true, "database": true }` |
| Login | `POST /_/backend/auth/login` (not localhost) |
| Refresh | `POST /_/backend/auth/refresh` with cookies |

## Local dev

```bash
cd backend && npm run start:dev
npm run dev
```

`.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Or: `vercel dev -L`
