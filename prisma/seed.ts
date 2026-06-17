import { PrismaClient } from "@prisma/client";
import {
  computeStandings,
  PRESETS,
  type PresetKey,
  type FixtureInput,
} from "../src/lib/standings";
import { hashPassword } from "../src/lib/password";

const db = new PrismaClient();

// ---- The 9 fixed groups ---------------------------------------------------
const GROUPS = [
  { code: "MECH", name: "Mechanical Engineering", short: "Mechanical", color: "#1b75bc" },
  { code: "CEG", name: "Civil & Environmental Engineering", short: "Civil", color: "#8dc63f" },
  { code: "ASES", name: "Systems Engineering", short: "Systems", color: "#f7941e" },
  { code: "MME", name: "Metallurgical & Materials Engineering", short: "Metallurgical", color: "#ec008c" },
  { code: "CHG", name: "Chemical Engineering", short: "Chemical", color: "#ffd200" },
  { code: "PGG", name: "Petroleum & Gas Engineering", short: "Pet. & Gas", color: "#17a2b8" },
  { code: "BME", name: "Biomedical Engineering", short: "Biomedical", color: "#e63946" },
  { code: "SEES", name: "Electrical/Electronics & Computer (SEES)", short: "SEES", color: "#6a4ca5" },
  { code: "SVY", name: "Surveying & Geoinformatics", short: "Surveying", color: "#2ec4b6" },
];

// ---- Seed data structures -------------------------------------------------
type SeedFixture = {
  home: string;
  away: string;
  hs?: number; // home score (goals/points/sets)
  as?: number; // away score
  hp?: number; // home points (SETS: total points, for Diff)
  ap?: number;
  status?: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";
  md?: number; // matchday
  date?: string; // ISO
  pub?: boolean; // fixture (schedule) published
  rpub?: boolean; // result published
};

type SeedStage = {
  name: string;
  type: "LEAGUE" | "KNOCKOUT";
  table: boolean; // tablePublished + compute standings
  groups?: string[]; // group members (for standings)
  published?: boolean;
  fixtures: SeedFixture[];
};

type SeedDivision = {
  kind: "MALE" | "FEMALE" | "MIXED";
  name: string;
  published?: boolean;
  stages: SeedStage[];
};

type SeedSport = {
  name: string;
  slug: string;
  preset: PresetKey;
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  allowDraws: boolean;
  displayMode?: "STANDARD" | "RESULTS_ONLY";
  published?: boolean;
  sortOrder?: number;
  color?: string;
  divisions: SeedDivision[];
};

const D1 = "2026-06-13"; // Matchday 1
const D2 = "2026-06-15"; // Lawn tennis / volleyball
const D4 = "2026-06-16"; // Matchday 4

const F = (
  home: string,
  away: string,
  hs: number,
  as: number,
  extra: Partial<SeedFixture> = {},
): SeedFixture => ({
  home,
  away,
  hs,
  as,
  status: "FINISHED",
  pub: true,
  rpub: true,
  ...extra,
});

const SCHED = (
  home: string,
  away: string,
  date: string,
  md: number,
): SeedFixture => ({ home, away, status: "SCHEDULED", md, date, pub: true, rpub: false });

const SPORTS: SeedSport[] = [
  // -------------------------------------------------- FOOTBALL
  {
    name: "Football",
    slug: "football",
    preset: "FOOTBALL",
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    allowDraws: true,
    published: true,
    sortOrder: 1,
    color: "#8dc63f",
    divisions: [
      {
        kind: "MALE",
        name: "Male",
        published: true,
        stages: [
          { name: "Group A", type: "LEAGUE", table: true, published: true, groups: ["SEES", "ASES", "PGG"], fixtures: [F("SEES", "PGG", 4, 0, { md: 1, date: D1 }), SCHED("SEES", "ASES", "2026-06-17T16:30:00", 2)] },
          { name: "Group B", type: "LEAGUE", table: true, published: true, groups: ["SVY", "MECH", "CEG"], fixtures: [F("CEG", "SVY", 1, 3, { md: 1, date: D1 }), SCHED("MECH", "CEG", "2026-06-17T14:30:00", 2)] },
          { name: "Group C", type: "LEAGUE", table: true, published: true, groups: ["MME", "BME", "CHG"], fixtures: [F("MME", "CHG", 4, 0, { md: 1, date: D1 }), SCHED("CHG", "BME", "2026-06-17T15:30:00", 2)] },
        ],
      },
      {
        kind: "FEMALE",
        name: "Female",
        published: true,
        stages: [
          { name: "Group A", type: "LEAGUE", table: true, published: true, groups: ["SEES", "CEG", "MME"], fixtures: [F("SEES", "MME", 3, 0, { md: 1, date: D1 }), SCHED("MME", "CEG", "2026-06-17T16:30:00", 2)] },
          { name: "Group B", type: "LEAGUE", table: true, published: true, groups: ["CHG", "MECH", "SVY"], fixtures: [F("CHG", "SVY", 1, 0, { md: 1, date: D1 }), SCHED("MECH", "CHG", "2026-06-17T14:30:00", 2)] },
          { name: "Group C", type: "LEAGUE", table: true, published: true, groups: ["PGG", "ASES", "BME"], fixtures: [F("PGG", "BME", 2, 1, { md: 1, date: D1 }), SCHED("BME", "ASES", "2026-06-17T15:30:00", 2)] },
        ],
      },
    ],
  },
  // -------------------------------------------------- BASKETBALL
  {
    name: "Basketball",
    slug: "basketball",
    preset: "BASKETBALL",
    pointsWin: 2,
    pointsDraw: 0,
    pointsLoss: 1,
    allowDraws: false,
    published: true,
    sortOrder: 2,
    color: "#f7941e",
    divisions: [
      {
        kind: "MALE",
        name: "Male",
        published: true,
        stages: [
          { name: "Group A", type: "LEAGUE", table: true, published: true, groups: ["SEES", "BME", "CEG"], fixtures: [F("SEES", "CEG", 36, 15, { md: 1, date: D1 }), F("SEES", "BME", 28, 8, { md: 4, date: D4 })] },
          { name: "Group B", type: "LEAGUE", table: true, published: true, groups: ["SVY", "PGG", "ASES"], fixtures: [F("SVY", "ASES", 28, 10, { md: 1, date: D1 }), F("SVY", "PGG", 40, 17, { md: 4, date: D4 })] },
          { name: "Group C", type: "LEAGUE", table: true, published: true, groups: ["MECH", "MME", "CHG"], fixtures: [F("MECH", "CHG", 28, 24, { md: 1, date: D1 }), F("MECH", "MME", 23, 25, { md: 4, date: D4 })] },
        ],
      },
      {
        // Female basketball: only MD4 fixtures logged; group structure unknown.
        kind: "FEMALE",
        name: "Female",
        published: true,
        stages: [
          { name: "Matchday 4", type: "LEAGUE", table: false, published: true, fixtures: [F("MME", "MECH", 5, 6, { md: 4, date: D4 }), F("SVY", "CHG", 41, 1, { md: 4, date: D4 }), F("BME", "PGG", 6, 3, { md: 4, date: D4 })] },
        ],
      },
    ],
  },
  // -------------------------------------------------- VOLLEYBALL (Mixed)
  {
    name: "Volleyball",
    slug: "volleyball",
    preset: "SETS",
    pointsWin: 1,
    pointsDraw: 0,
    pointsLoss: 0,
    allowDraws: false,
    published: true,
    sortOrder: 3,
    color: "#ec008c",
    divisions: [
      {
        kind: "MIXED",
        name: "Mixed",
        published: true,
        stages: [
          { name: "Group A", type: "LEAGUE", table: true, published: true, groups: ["MECH", "SVY", "CHG"], fixtures: [F("MECH", "CHG", 2, 0, { hp: 30, ap: 0, md: 2, date: D2 }), F("MECH", "SVY", 0, 2, { md: 4, date: D4 })] },
          { name: "Group B", type: "LEAGUE", table: true, published: true, groups: ["SEES", "BME", "CEG"], fixtures: [F("SEES", "CEG", 2, 0, { hp: 32, ap: 23, md: 2, date: D2 }), F("SEES", "BME", 2, 0, { md: 4, date: D4 })] },
          { name: "Group C", type: "LEAGUE", table: true, published: true, groups: ["MME", "PGG", "ASES"], fixtures: [F("MME", "ASES", 2, 0, { hp: 30, ap: 18, md: 2, date: D2 }), F("ASES", "PGG", 2, 0, { md: 4, date: D4 })] },
        ],
      },
    ],
  },
  // -------------------------------------------------- LAWN TENNIS
  // Grouping not confirmed from source; matches recorded faithfully, table hidden.
  {
    name: "Lawn Tennis",
    slug: "lawn-tennis",
    preset: "SETS",
    pointsWin: 1,
    pointsDraw: 0,
    pointsLoss: 0,
    allowDraws: false,
    published: true,
    sortOrder: 4,
    color: "#1b75bc",
    divisions: [
      {
        kind: "MALE",
        name: "Male",
        published: true,
        stages: [
          {
            name: "Matches",
            type: "LEAGUE",
            table: false,
            published: true,
            fixtures: [
              F("CEG", "PGG", 2, 1, { md: 2, date: D2 }),
              F("SVY", "MECH", 0, 2, { md: 2, date: D2 }),
              F("ASES", "SEES", 0, 2, { md: 2, date: D2 }),
              F("CEG", "MME", 2, 0, { md: 2, date: D2 }),
              F("SVY", "CHG", 1, 2, { md: 2, date: D2 }),
              F("ASES", "BME", 2, 0, { md: 2, date: D2 }),
              F("PGG", "MME", 2, 0, { md: 2, date: D2 }),
              F("MECH", "CHG", 2, 0, { md: 2, date: D2 }),
              F("SEES", "BME", 2, 0, { md: 2, date: D2 }),
            ],
          },
          {
            name: "Doubles (Jun 17)",
            type: "LEAGUE",
            table: false,
            published: true,
            fixtures: [
              SCHED("CEG", "PGG", "2026-06-17T14:30:00", 2),
              SCHED("SVY", "MECH", "2026-06-17T14:30:00", 2),
              SCHED("ASES", "SEES", "2026-06-17T14:30:00", 2),
              SCHED("CEG", "MME", "2026-06-17T14:30:00", 2),
              SCHED("SVY", "CHG", "2026-06-17T14:30:00", 2),
              SCHED("ASES", "BME", "2026-06-17T14:30:00", 2),
              SCHED("PGG", "MME", "2026-06-17T14:30:00", 2),
              SCHED("MECH", "CHG", "2026-06-17T14:30:00", 2),
              SCHED("SEES", "BME", "2026-06-17T14:30:00", 2),
            ],
          },
        ],
      },
      {
        kind: "FEMALE",
        name: "Female",
        published: true,
        stages: [
          {
            name: "Matches",
            type: "LEAGUE",
            table: false,
            published: true,
            fixtures: [
              F("SEES", "MECH", 1, 2, { md: 2, date: D2 }),
              F("CHG", "PGG", 0, 2, { md: 2, date: D2 }),
              F("SVY", "ASES", 0, 2, { md: 2, date: D2 }),
              F("SEES", "CEG", 2, 0, { md: 2, date: D2 }),
              F("CHG", "BME", 2, 0, { md: 2, date: D2 }),
              F("SVY", "MME", 2, 0, { md: 2, date: D2 }),
              F("MECH", "CEG", 0, 2, { md: 2, date: D2 }),
              F("PGG", "BME", 0, 2, { md: 2, date: D2 }),
              F("ASES", "MME", 2, 0, { md: 2, date: D2 }),
            ],
          },
        ],
      },
    ],
  },
  // -------------------------------------------------- BADMINTON (configured, no data)
  {
    name: "Badminton",
    slug: "badminton",
    preset: "SETS",
    pointsWin: 1,
    pointsDraw: 0,
    pointsLoss: 0,
    allowDraws: false,
    published: false,
    sortOrder: 5,
    color: "#ffd200",
    divisions: [
      { kind: "MALE", name: "Male", published: false, stages: [] },
      { kind: "FEMALE", name: "Female", published: false, stages: [] },
    ],
  },
  // -------------------------------------------------- RESULTS_ONLY sports (no data yet)
  {
    name: "Athletics",
    slug: "athletics",
    preset: "FOOTBALL",
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    allowDraws: false,
    displayMode: "RESULTS_ONLY",
    published: false,
    sortOrder: 6,
    color: "#e63946",
    divisions: [],
  },
  {
    name: "Table Tennis",
    slug: "table-tennis",
    preset: "SETS",
    pointsWin: 1,
    pointsDraw: 0,
    pointsLoss: 0,
    allowDraws: false,
    displayMode: "RESULTS_ONLY",
    published: false,
    sortOrder: 7,
    color: "#17a2b8",
    divisions: [],
  },
];

async function main() {
  console.log("Resetting tables…");
  await db.standing.deleteMany();
  await db.fixture.deleteMany();
  await db.sportParticipant.deleteMany();
  await db.stage.deleteMany();
  await db.division.deleteMany();
  await db.resultEntry.deleteMany();
  await db.sport.deleteMany();
  await db.group.deleteMany();
  await db.adminUser.deleteMany();

  console.log("Seeding 9 groups…");
  const groupId: Record<string, string> = {};
  for (let i = 0; i < GROUPS.length; i++) {
    const g = GROUPS[i];
    const row = await db.group.create({
      data: { code: g.code, name: g.name, shortName: g.short, colorHex: g.color, sortOrder: i },
    });
    groupId[g.code] = row.id;
  }

  console.log("Seeding sports…");
  for (const sp of SPORTS) {
    const preset = PRESETS[sp.preset];
    const sport = await db.sport.create({
      data: {
        name: sp.name,
        slug: sp.slug,
        tablePreset: sp.preset,
        statColumns: preset.columns,
        displayMode: sp.displayMode ?? "STANDARD",
        format: "LEAGUE_AND_KNOCKOUT",
        pointsWin: sp.pointsWin,
        pointsDraw: sp.pointsDraw,
        pointsLoss: sp.pointsLoss,
        allowDraws: sp.allowDraws,
        tiebreakers: ["Pts", preset.diffKey, preset.forKey],
        isPublished: sp.published ?? false,
        sortOrder: sp.sortOrder ?? 0,
        colorHex: sp.color ?? "#2e2a8c",
      },
    });

    for (let di = 0; di < sp.divisions.length; di++) {
      const dv = sp.divisions[di];
      const division = await db.division.create({
        data: {
          sportId: sport.id,
          kind: dv.kind,
          name: dv.name,
          sortOrder: di,
          isPublished: dv.published ?? false,
        },
      });

      // Participants = every group appearing in any stage/fixture of the division.
      const codes = new Set<string>();
      dv.stages.forEach((st) => {
        (st.groups ?? []).forEach((c) => codes.add(c));
        st.fixtures.forEach((f) => {
          codes.add(f.home);
          codes.add(f.away);
        });
      });
      for (const code of codes) {
        await db.sportParticipant.create({
          data: { divisionId: division.id, groupId: groupId[code] },
        });
      }

      for (let si = 0; si < dv.stages.length; si++) {
        const st = dv.stages[si];
        const stage = await db.stage.create({
          data: {
            divisionId: division.id,
            name: st.name,
            type: st.type,
            sortOrder: si,
            isPublished: st.published ?? false,
            tablePublished: st.table,
          },
        });

        const inputs: FixtureInput[] = [];
        for (const f of st.fixtures) {
          await db.fixture.create({
            data: {
              divisionId: division.id,
              stageId: stage.id,
              homeGroupId: groupId[f.home],
              awayGroupId: groupId[f.away],
              matchday: f.md ?? null,
              scheduledAt: f.date ? new Date(f.date) : null,
              status: f.status ?? "SCHEDULED",
              homeScore: f.hs ?? null,
              awayScore: f.as ?? null,
              homePoints: f.hp ?? null,
              awayPoints: f.ap ?? null,
              isPublished: f.pub ?? false,
              resultPublished: f.rpub ?? false,
            },
          });
          inputs.push({
            homeGroupId: groupId[f.home],
            awayGroupId: groupId[f.away],
            homeScore: f.hs ?? null,
            awayScore: f.as ?? null,
            homePoints: f.hp ?? null,
            awayPoints: f.ap ?? null,
            status: f.status ?? "SCHEDULED",
            resultPublished: f.rpub ?? false,
          });
        }

        if (st.table && st.groups?.length) {
          const ids = st.groups.map((c) => groupId[c]);
          const table = computeStandings(
            sp.preset,
            { pointsWin: sp.pointsWin, pointsDraw: sp.pointsDraw, pointsLoss: sp.pointsLoss, allowDraws: sp.allowDraws },
            ids,
            inputs,
          );
          for (const code of st.groups) {
            await db.standing.create({
              data: { stageId: stage.id, groupId: groupId[code], stats: table[groupId[code]] },
            });
          }
        }
      }
    }
  }

  console.log("Creating super-admin…");
  await db.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL ?? "admin@usf26.local",
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "changeme-usf26"),
      name: "USF26 Super Admin",
    },
  });

  console.log("Seed complete.");
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
