# USF26 — University of Lagos Engineering Society Sport Festival '26
## Product Requirements Document

**Event:** University of Lagos Engineering Society Sport Festival 2026 (**USF26**)
**Theme:** *All or Nothing*
**Status:** Draft v1
**Date:** 2026-06-16
**Owner:** Super-admin (festival organizer)

### Branding & Visual Identity
**Source of truth:** `USF 26 Visual Guide.pdf` — the app must adhere to it.

- **Wordmark/logo:** USF '26 / "ULES Sport Festival 2026". Use the official logo lockup; the retro starburst/rainbow motif is the signature graphic.
- **Tagline:** *"…All or Nothing…"* (with ™).
- **Typography:**
  - Primary / display: **Base Neue** (headings, scoreboards, big numbers).
  - Secondary / accent: **Magnetic** (callouts, hero accents).
  - Both are display faces — pair with a clean, highly legible sans (e.g. Inter) for tables, body, and data-dense UI. License/host the brand fonts as web fonts.
- **Logo assets (in repo):** `photo_1_2026-06-16_12-38-24.jpg` (full-color logo for light backgrounds) and `photo_2_2026-06-16_12-38-24.jpg` (ghost/white version for dark/indigo backgrounds). Request vector (SVG/PDF) versions for production.
- **Color palette** (sampled from logo — verify against brand source):
  - Deep indigo/purple (primary base & wordmark): ~`#2E2A8C`
  - Blue: ~`#1B75BC` · Orange: ~`#F7941E` · Magenta/Pink: ~`#EC008C` · Yellow: ~`#FFD200` · Green: ~`#8DC63F`
  - Base/background = deep indigo; rainbow accents map to per-group colors and sport/division chips.
- **Tone:** bold, energetic, retro-sport. Large type, high contrast, vibrant blocks.
- The 9 groups are the participating departments/associations of the UNILAG Faculty of Engineering.

### Sports model — data-driven, not hardcoded
**Principle (per organizer):** the app only handles what is actually logged in (as images/text). Do **not** pre-build sports/events for which no data is provided. Sports are created by the admin on demand. New sports/divisions/results are added only when data exists.

Every sport runs in one of **two modes** (`display_mode` on the sport):
- **STANDARD** — full fixtures → results → auto-calc editable standings (core flow, §5–§6).
- **RESULTS_ONLY** — a curated, publishable results block (placings / match lines); no standings, no live fixture workflow.

#### Gender divisions
Many sports run **separate Male and Female competitions**; some are **Mixed**. The model adds a **division** layer under each sport (`MALE | FEMALE | MIXED`). Each division has its own participants, stages, fixtures, and standings.

#### Sports configured so far (only those with logged data, + confirmed config)
| Sport | Mode | Divisions |
|-------|------|-----------|
| Football | STANDARD | Male, Female |
| Basketball | STANDARD | Male, Female |
| Volleyball | STANDARD | Mixed |
| Lawn Tennis | STANDARD | Male, Female |
| Badminton | STANDARD | Male, Female *(configured; awaiting data)* |
| Athletics / Track events | RESULTS_ONLY | placings by group |
| Table Tennis | RESULTS_ONLY | (concluded; results only) |

> Swimming, Indoor Games, and other events are **not modeled** until the organizer logs their data.

### The 9 Groups (seed data)
Suggested short codes; colors are placeholders to confirm.

| # | Group | Code |
|---|-------|------|
| 1 | Mechanical Engineering | MECH |
| 2 | Civil & Environmental Engineering | CEG |
| 3 | Systems Engineering | ASES |
| 4 | Metallurgical & Materials Engineering | MME |
| 5 | Chemical Engineering | CHG |
| 6 | Petroleum & Gas Engineering | PGG |
| 7 | Biomedical Engineering | BME |
| 8 | Society of Electrical & Electronics Students (SEES) — covers Electrical/Electronics **and** Computer | SEES |
| 9 | Surveying & Geoinformatics | SVY |

> Note: SEES is a single competing entity representing both Electrical/Electronics and Computer Engineering students.
> Alias: **CESS** appears in some graphics as a label for **CEG** (Civil) — treat as the same group.

---

## 1. Summary

A web application to run an ongoing multi-sport festival. It has two faces:

- **Public site** — anyone can browse sports, fixtures, results, and league/knockout standings, with filters by sport and stage.
- **Admin (super-admin only)** — registers sports, selects participating groups (from a fixed list of 9), schedules fixtures, enters results, and manages standings tables that **auto-calculate** from results but remain **fully editable per column**. Every public-facing item has a **publish/unpublish** control.

---

## 2. Goals & Non-Goals

### Goals
- Single source of truth for fixtures, results, and standings across all festival sports.
- Auto-calculated league tables using configurable football-style points, with manual override on any cell.
- Near-real-time public updates of live scores and standings.
- Granular publish control so the admin reveals data only when ready.

### Non-Goals (v1)
- No named-player rosters or per-player statistics (group-level only). *(Assumption — see §11; easy to add later.)*
- No individual-event sports (athletics, chess as a person, etc.). Only **team** sports in **league** and/or **knockout** format.
- No visual bracket graphic for knockouts (fixtures/results lists with stage labels instead).
- No multi-user roles or per-sport editor accounts (single super-admin).
- No payments, ticketing, or registration of spectators.

---

## 3. Key Decisions (locked)

| Area | Decision |
|------|----------|
| Platform | Standalone **Next.js (App Router) + Postgres** web app |
| Sport formats | **League** and/or **Knockout** team sports only |
| Participants | The **9 fixed groups** are the competing entities (individuals represent them in real life but are not tracked) |
| Admin access | **Single super-admin** account |
| Points system | **Configurable per sport** (default 3 win / 1 draw / 0 loss) |
| Player detail | **Group-level only** (no rosters, no scorers) |
| Knockout display | **Fixtures & results list** with stage labels (no bracket graphic) |
| Timeliness | **Live auto-updating** scores & standings (near-real-time) |

---

## 4. Core Concepts / Domain Model

- **Group** — one of the **9 fixed constants** (houses/departments/teams). Seeded once. Has name, short name, logo, color.
- **Sport** — e.g. Football, Basketball, Volleyball. Has a format (League, Knockout, or both) and its own points config.
- **Sport Participants** — the subset of the 9 groups taking part in a given sport.
- **Stage** — a phase within a sport. League stages produce a table (e.g. "League", or "Group A"/"Group B"). Knockout stages are rounds (e.g. "Quarter-final", "Semi-final", "Final").
- **Fixture** — a scheduled match between two participating groups, within a stage. Holds schedule, venue, status, and score.
- **Standing** — one row per group in a league stage: played/won/drawn/lost/GF/GA/GD/points. Auto-computed from finished, published results; per-column overridable.

```
Sport ──< Division (Male/Female/Mixed) ──< Stage ──< Fixture (home_group, away_group)
                 │                            └─────< Standing (per group)
                 └─< Sport_Participant >── Group (9 fixed)
```
- A **Sport** (e.g. Football) has one or more **Divisions** (Male, Female, or Mixed).
- Each **Division** has its participating groups, stages, fixtures, and standings.
- **RESULTS_ONLY** sports skip stages/fixtures/standings and use `result_entries` instead.

---

## 5. Functional Requirements

### 5.1 Public site
- **FR-P1** Home/landing: list of published sports with status summary.
- **FR-P2** Sport page with tabs/sections: **Fixtures**, **Results**, **Standings**.
- **FR-P3** Filters: by **sport** and by **stage/round**; results filter by status (Scheduled/Live/Finished).
- **FR-P4** Standings table per league/group stage showing that **sport's column set** (FOOTBALL/BASKETBALL/SETS preset), sorted by points/wins then tie-breakers. Group stages render as Group A/B/C tables.
- **FR-P5** Knockout shown as fixtures grouped by round with clear stage labels and winners.
- **FR-P6** **Live updates**: scores and standings on the public page update in near-real-time without a manual refresh.
- **FR-P7** Only **published** items are ever visible. Unpublished sports/stages/fixtures/results/tables are completely hidden.
- **FR-P8** Mobile-first responsive layout (spectators are on phones).

### 5.2 Admin
- **FR-A1** Secure login (super-admin only).
- **FR-A2** **Sports CRUD**: name, icon/color, format, points config (win/draw/loss values, draws allowed?), tie-breaker order.
- **FR-A3** **Participants**: pick which of the 9 groups participate in a sport.
- **FR-A4** **Stages CRUD**: create league/knockout stages, order them.
- **FR-A5** **Fixtures CRUD**: home/away group, stage, date/time, venue, status; set/update score; mark Live/Finished.
- **FR-A6** **Results**: entering a final score on a finished fixture feeds standings auto-calc.
- **FR-A7** **Standings auto-calc**: derived from finished + result-published fixtures using the sport's points config.
- **FR-A8** **Per-column override**: admin can edit any standings cell for any sport (keyed by that sport's columns); overridden cells are preserved and not overwritten by recalculation. Clear visual marker on overridden cells + a "reset to auto" action. Optional manual row ordering.
- **FR-A9** **Publish controls** (independent toggles): `Sport`, `Stage`, `Fixture (schedule)`, `Fixture result (score)`, `Stage table`. Result publish is separate from schedule publish so a fixture can be visible before its score is.
- **FR-A10** **Recompute** action: manual "recalculate standings" button per stage as a safety net.
- **FR-A11** Validation: cannot create a fixture between non-participating or identical groups; scores non-negative integers.

---

## 6. Standings Auto-Calculation Rules

### 6.1 Group-stage structure
Each STANDARD division's group stage is **3 groups of 3** (Group A / B / C), modeled as three `LEAGUE`-type stages, each producing its own table. Group compositions are set per sport/division (they differ across sports). Knockout stages (semis, final) follow; qualification entered by admin.

### 6.2 Per-sport table schema (column presets)
Tables are **not** one-size-fits-all. Each sport declares a `table_preset` that defines its columns, the points rule, and how the "score" is interpreted:

| Preset | Columns | Points | Score means |
|--------|---------|--------|-------------|
| **FOOTBALL** | P, W, D, L, GF, GA, GD, Pts | win 3 / draw 1 / loss 0 | goals |
| **BASKETBALL** | P, W, L, PF, PA, PD, Pts | win 2 / loss 1 (no draw) | points scored |
| **SETS** (volleyball, lawn tennis) | P, W, L, SW, SL, Diff, Pts | win 1 / loss 0 (no draw) | sets won; Diff = point differential* |

\* For SETS sports the fixture stores set score (e.g. 2–0) and, where available, point differential; ranking is by W then Diff. Presets are starting points — points values and columns remain editable per sport.

### 6.3 Computation
For each league stage, consider only fixtures that are **Finished** and **result-published**:
- Played +1 per group per such fixture; W/D/L from comparing scores (D only if the preset allows draws).
- Points from the sport's configured win/draw/loss values.
- "For"/"Against"/"Diff" columns (GF/GA/GD, PF/PA/PD, SW/SL/Diff) computed from the fixture scores per the preset.
- If draws are disallowed, equal scores must be resolved by a `winner_group_id` before the fixture is Finished.

**Default tie-breaker order** (configurable per sport): Points → Diff column → For column → Head-to-head → Group name. (Basketball/volleyball rank by Pts/W then their Diff column.)

### 6.4 Flexible, fully-overridable standings
Each standing row stores a **`stats` map** (column key → value) plus an **`overrides` map** (column key → manual value). On read/recompute, overridden columns win; non-overridden columns reflect live computation. Because columns are keyed (not fixed DB columns), the same model serves football, basketball, and sets sports, and the admin can override **any** cell of **any** sport's table while auto-calc continues for the rest.

---

## 7. Non-Functional Requirements

- **Performance:** public pages load < 2s on 3G; live updates within a few seconds of admin save.
- **Availability:** suitable for a multi-day live event; no scheduled downtime during festival hours.
- **Security:** admin routes protected by auth; public is read-only; DB row-level security enforces published-only reads for anon users.
- **Auditability (light):** timestamps on create/update; "last updated" shown on standings.
- **Accessibility:** semantic tables, sufficient contrast, keyboard-navigable admin forms.

---

## 8. Proposed Tech Stack

- **Frontend/Backend:** Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui components.
- **Data + Auth + Realtime:** Supabase (Postgres, Auth, Realtime channels, Row-Level Security).
- **Standings logic:** Postgres function/trigger to recompute on fixture changes; overrides applied; result broadcast via Realtime.
- **Hosting:** Vercel (app) + Supabase (managed Postgres). Cheap-free, fast to deploy.

*(Stack is a recommendation; the data model and rules above are stack-agnostic.)*

---

## 9. Data Model (draft schema)

```
groups            id, name, short_name, logo_url, color_hex            -- seeded with the 9
sports            id, name, slug, icon, color_hex, format,             -- format: LEAGUE | KNOCKOUT | LEAGUE_AND_KNOCKOUT
                  display_mode,                                        -- STANDARD | RESULTS_ONLY
                  table_preset,                                        -- FOOTBALL | BASKETBALL | SETS (defines columns)
                  stat_columns (jsonb),                                -- ordered [{key,label,auto}] derived from preset, editable
                  points_win, points_draw, points_loss, allow_draws,
                  tiebreakers (jsonb array), is_published, timestamps

-- RESULTS_ONLY sports (Table Tennis, Athletics): curated display rows, no standings.
result_entries    id, sport_id, title,                                -- e.g. event/round: "Men's 100m", "Final"
                  first_group_id, second_group_id, third_group_id,    -- placings (nullable; for athletics)
                  home_group_id, away_group_id, score_text,           -- OR match-style line (nullable; for table tennis)
                  detail_text, sort_order, is_published, timestamps
divisions         id, sport_id, kind, name, sort_order, is_published   -- kind: MALE | FEMALE | MIXED
sport_participants id, division_id, group_id                           -- unique(division_id, group_id); which groups are in this division
stages            id, division_id, name, type, sort_order,             -- type: LEAGUE | KNOCKOUT
                  is_published, table_published
fixtures          id, division_id, stage_id, home_group_id, away_group_id,
                  matchday, scheduled_at, venue, status,               -- status: SCHEDULED | LIVE | FINISHED | POSTPONED
                  home_score, away_score, winner_group_id (nullable),  -- winner for no-draw/knockout
                  is_published, result_published, timestamps
standings         id, stage_id, group_id,
                  stats (jsonb),                                       -- computed, keyed by sport's stat columns e.g. {P,W,D,L,GF,GA,GD,Pts}
                  overrides (jsonb),                                   -- manual per-column overrides applied on top of stats
                  manual_position (nullable), updated_at               -- optional forced ordering
```

---

## 10. Out-of-Scope / Future Enhancements
- Player rosters, scorers, MVP, cards.
- Visual knockout bracket graphic.
- Multi-user roles / per-sport editors with audit log.
- Medal table aggregating across sports; overall festival champion group.
- Photo galleries / news posts.
- Public notifications (push/email) on results.

---

## 11. Open Assumptions (confirm or flip later)
1. The 9 groups are pre-known and seeded once; their names/logos can be edited but the count stays 9.
2. "Group-level only" overrides the "individuals represent groups" detail — no named individuals are stored in v1.
3. A sport in `LEAGUE_AND_KNOCKOUT` format has league stage(s) feeding qualifiers into knockout stage(s); qualification is entered manually by the admin (no auto-promotion in v1).
4. Single super-admin credential is acceptable (no delegation).
```
