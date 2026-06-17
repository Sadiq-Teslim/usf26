# USF'26 — ULES Sport Festival 2026

Public + admin web app for the University of Lagos Engineering Society Sport
Festival 2026. *All or Nothing.*

See [PRD.md](PRD.md) and [BUILD_PLAN.md](BUILD_PLAN.md) for the full spec.

## Stack
- **Next.js 16** (App Router, TypeScript) + **Tailwind v4**
- **Prisma + SQLite** for local dev (production target: Postgres / Supabase)
- Server Actions for all admin mutations; HMAC cookie session for the super-admin

## Run locally
```bash
npm install
npx prisma migrate dev      # create the SQLite DB
npm run db:seed             # seed the 9 groups + logged festival data
npm run dev                 # http://localhost:3000
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

### Admin login
Credentials come from `.env` (used by the seed):
- email: `ADMIN_EMAIL` (default `sadiqadetola08@gmail.com`)
- password: `ADMIN_PASSWORD` (default `changeme-usf26`)

Change these in `.env` and re-run `npm run db:seed` to apply.

## Useful scripts
- `npm run db:seed` — reset + reseed all data from the parsed festival data
- `npm run db:reset` — drop and recreate the database
- `npx prisma studio` — browse/edit the database in a GUI

## What's built
- Public: sports list, sport pages with Male/Female/Mixed division tabs,
  group-stage standings (Football/Basketball/Sets presets), fixtures & results,
  schedule. Only published items show.
- Admin: login, dashboard, full Sports CRUD, divisions, participants, stages,
  fixtures & results entry, publish toggles at every level, auto-calculated
  standings with **per-column override** + recalculate.

## Remaining (see BUILD_PLAN.md)
- Results-only editor (Athletics / Table Tennis entries)
- Live auto-updating scores (polling now → Supabase Realtime on deploy)
- Polish, logo/SVG assets, brand fonts (Base Neue / Magnetic), deploy to
  Vercel + Postgres.
