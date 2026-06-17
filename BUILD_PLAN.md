# Sport Festival System — Build Plan

Companion to `PRD.md`. Phased so a usable version ships fast (the festival is live), then layers on live updates and override polish.

**Stack:** Next.js (App Router, TS) · Tailwind + shadcn/ui · Supabase (Postgres, Auth, Realtime, RLS) · Vercel.

---

## Guiding sequence
Ship a read-only public site backed by admin-entered data first, then make tables auto-calc, then make it live. Each phase is independently deployable.

---

## Phase 0 — Project setup (½ day)
- Init Next.js + TypeScript + Tailwind + shadcn/ui.
- Create Supabase project; wire env vars; add Supabase client (server + browser).
- Set up Vercel deploy from repo; confirm a hello-world public page is live.
- Base layout: public shell (header, sport nav) + admin shell (sidebar, auth guard placeholder).

**Done when:** app deploys; DB reachable.

---

## Phase 1 — Data model & seed (1 day)
- Write SQL migrations for all tables in PRD §9 (`groups`, `sports`, `sport_participants`, `stages`, `fixtures`, `standings`).
- Seed the **9 groups** (names, colors, placeholder logos).
- Enable RLS:
  - `anon` role: SELECT only, and only rows where the relevant `is_published` / `result_published` / `table_published` is true.
  - authenticated super-admin: full access.
- Generate typed DB types for the app.

**Done when:** schema + RLS in place; 9 groups seeded; types generated.

---

## Phase 2 — Admin auth & sport/participant/stage CRUD (2 days)
- Supabase Auth login page; middleware guards `/admin/*`; allowlist the single super-admin email.
- Admin **Sports**: create/edit/delete — name, icon, color, display_mode (STANDARD/RESULTS_ONLY), format, points config (win/draw/loss, allow_draws), tie-breaker order, publish toggle.
- Admin **Divisions**: per sport, add Male / Female / Mixed divisions (each independently publishable).
- Admin **Participants**: per division, multi-select which of the 9 groups are in it.
- Admin **Stages**: per division, create league/knockout stages, order them, publish + table-publish toggles.
- Form validation (FR-A11 basics).

**Done when:** admin can stand up a sport with participants and stages.

---

## Phase 3 — Fixtures & results admin (2 days)
- Admin **Fixtures**: CRUD with home/away (restricted to participants, not identical), stage, date/time, venue, status, score, winner (for no-draw/knockout).
- Publish toggles: `is_published` (schedule) and `result_published` (score) — independent.
- Status workflow: Scheduled → Live → Finished (+ Postponed).
- Validation: non-negative integer scores; no-draw sports require a winner before Finished.

- Admin **RESULTS_ONLY** sports (Table Tennis, Athletics): manage `result_entries` — add placing rows (1st/2nd/3rd by group) or match-style result lines, ordered, individually publishable. No fixtures/standings workflow for these.

**Done when:** admin can schedule matches and record results, and curate results-only sports.

---

## Phase 4 — Public site (read-only) (2 days)
- Sports list / landing (published sports only).
- Sport page with **Fixtures**, **Results**, **Standings** sections.
- Filters: sport, stage/round, result status.
- Knockout = fixtures grouped by round with stage labels + winners.
- Standings table renders from `standings` rows (still manually maintained at this point).
- **RESULTS_ONLY** sports render a results block (placings / match lines) instead of fixtures+standings.
- **Brand styling per Visual Guide**: deep indigo base + retro-rainbow accents, Base Neue (display) + Magnetic (accent) + Inter (body/tables), USF '26 logo, "All or Nothing" tagline.
- Mobile-first styling; respect all publish flags via RLS.

> **Existing data to import:** see `temp/results/parsed-data.md` — Football (M/F MD1), Basketball (M MD1, M/F MD4 fixtures), Volleyball Mixed (MD2 fixtures, MD3 results, MD4 fixtures), Lawn Tennis (M/F MD2 fixtures + MD3 results), plus the overall schedule. Only sports/events the organizer has actually logged are seeded — nothing presumed.

**Done when:** spectators can browse everything the admin has published.

---

## Phase 5 — Standings auto-calculation (2 days)
- Implement **table presets** (FOOTBALL / BASKETBALL / SETS) → each sport's `stat_columns` + points rule.
- Postgres function `recompute_standings(stage_id)`: aggregates Finished + result-published fixtures per the sport's preset; writes the keyed `stats` jsonb; **applies `overrides` map on top**.
- Trigger on `fixtures` insert/update/delete → recompute affected stage.
- Tie-breaker sort implemented in the read query (PRD §6 default order, configurable per preset).
- Render group stages as **Group A/B/C** tables with the sport's column set.
- Admin **per-column override** UI (FR-A8): edit any cell → stored in `overrides`; overridden cells badged; "reset to auto" per cell; "recalculate stage" button (FR-A10); optional manual ordering.

**Done when:** entering results auto-updates tables; admin can override any cell and it sticks.

---

## Phase 6 — Live updates (1–1.5 days)
- Supabase Realtime subscriptions on `fixtures` and `standings` for published rows.
- Public sport page subscribes and updates scores/tables in place (no refresh).
- Lightweight "live" indicator on in-progress fixtures.
- Fallback polling for clients where websockets fail.

**Done when:** a score saved in admin appears on the public page within seconds.

---

## Phase 7 — Polish & launch hardening (1 day)
- Empty states, loading skeletons, error toasts.
- Admin "festival overview" dashboard (counts, what's unpublished).
- Logo upload for groups (Supabase Storage).
- Accessibility pass (semantic tables, contrast, keyboard).
- Final RLS audit (no unpublished data leaks); smoke test full flow on prod.

**Done when:** end-to-end flow verified on production.

---

## Rough timeline
~**12–14 working days** for full scope. A **minimum-viable public + admin** (Phases 0–4) lands in ~**7–8 days**; auto-calc and live (5–6) follow. Given the festival is ongoing, consider shipping Phases 0–4 first and running standings manually for a few days while 5–6 are built.

## Key risks
- **Override vs recompute conflicts** — mitigated by the `overrides` JSONB model (recompute never touches overridden columns).
- **RLS leaks of unpublished data** — explicit audit in Phase 7; default-deny policies.
- **Realtime reliability during peak** — polling fallback in Phase 6.

## First slice to build now
1. Phase 0 setup.
2. Phase 1 migrations + seed 9 groups.
3. Phase 2 sport creation.
Then demo a single sport (e.g. Football) end-to-end through Phase 4 before generalizing.
```
