import { Crest } from "@/components/crest";

const MEDAL = ["🥇", "🥈", "🥉"];

type StatRow = {
  id: string;
  name: string;
  goals: number;
  assists: number;
  group: { code: string; colorHex: string; logoUrl?: string | null };
};

export function StatLeaderboard({
  title,
  stat,
  rows,
  accent,
}: {
  title: string;
  stat: "goals" | "assists";
  rows: StatRow[];
  accent: string;
}) {
  const ranked = rows
    .map((r) => ({ ...r, value: stat === "goals" ? r.goals : r.assists }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  if (ranked.length === 0) return null;
  const label = stat === "goals" ? "Goals" : "Assists";

  return (
    <div className="overflow-hidden rounded-2xl border border-border-brand bg-surface/60 backdrop-blur">
      <div
        className="flex items-center gap-2 border-b border-border-brand px-4 py-3"
        style={{ background: `linear-gradient(90deg, ${accent}22, transparent)` }}
      >
        <span className="text-base">{stat === "goals" ? "⚽" : "🅰️"}</span>
        <h4 className="display-wide text-sm">{title}</h4>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase text-muted">
            <th className="px-3 py-2 font-medium">Rank</th>
            <th className="px-2 py-2 font-medium">Player</th>
            <th className="px-2 py-2 font-medium">Team</th>
            <th className="px-3 py-2 text-right font-medium">{label}</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((r, i) => (
            <tr
              key={r.id}
              className="border-t border-border-brand/60"
              style={
                i === 0
                  ? { background: `linear-gradient(90deg, ${accent}1f, transparent 70%)` }
                  : undefined
              }
            >
              <td className="whitespace-nowrap px-3 py-2.5">
                <span className="mr-1">{i < 3 ? MEDAL[i] : ""}</span>
                <span className={i < 3 ? "font-bold" : "text-muted"}>{i + 1}</span>
              </td>
              <td className="px-2 py-2.5 font-semibold">{r.name}</td>
              <td className="px-2 py-2.5">
                <span className="flex items-center gap-1.5 whitespace-nowrap text-muted">
                  <Crest
                    code={r.group.code}
                    color={r.group.colorHex}
                    logoUrl={r.group.logoUrl}
                    size={20}
                  />
                  {r.group.code}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span className="font-display text-base">{r.value}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
