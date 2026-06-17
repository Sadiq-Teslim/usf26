# Deploying USF'26 to production (Vercel + Postgres/Supabase)

Local dev uses SQLite; production uses Postgres. The app code is unchanged —
only the Prisma datasource and env vars differ.

## 1. Create a Postgres database
Use **Supabase** (recommended — gives Realtime + Storage later) or Neon/Vercel Postgres.
- Supabase → New project → copy the **connection string** (use the pooled
  `...pooler.supabase.com:6543/...?pgbouncer=true` URL for the app, and the
  direct `5432` URL for migrations).

## 2. Point Prisma at Postgres
In `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // directUrl = env("DIRECT_URL")   // if using a pooled URL
}
```
Then create fresh migrations for Postgres:
```bash
rm -rf prisma/migrations          # SQLite migrations don't apply to Postgres
npx prisma migrate dev --name init
npm run db:seed
```

## 3. Environment variables (Vercel project settings)
```
DATABASE_URL   = <postgres connection string>
DIRECT_URL     = <direct 5432 string>   # if pooling
AUTH_SECRET    = <long random string>   # openssl rand -hex 32
ADMIN_EMAIL    = <super-admin email>
ADMIN_PASSWORD = <strong password>      # only used by the seed
NODE_ENV       = production
```

## 4. Deploy
- Push the repo to GitHub, import into Vercel.
- Build command is `npm run build` (runs `prisma generate && next build`).
- After first deploy, run migrations against prod (Vercel build can run
  `prisma migrate deploy`, or run locally pointed at the prod `DATABASE_URL`).
- Seed once: `DATABASE_URL=<prod> npm run db:seed` (this RESETS data — only do
  it on first setup).

## 5. Live updates → Supabase Realtime (optional upgrade)
The public site already polls every 20s (`AutoRefresh`). To go truly real-time:
- Enable Realtime on the `Fixture` and `Standing` tables in Supabase.
- Subscribe on the client and call `router.refresh()` on change (replace/augment
  the polling interval).

## 6. Production hardening checklist
- [ ] Change `ADMIN_PASSWORD` and `AUTH_SECRET` from the dev defaults.
- [ ] Confirm only published rows are exposed (queries already filter; add
      Postgres RLS if you expose the DB directly).
- [ ] Replace placeholder brand fonts (Archivo/Inter) with licensed
      **Base Neue** + **Magnetic** web fonts in `src/app/layout.tsx`.
- [ ] Add a vector (SVG) logo to `public/brand/` for crisp rendering.
