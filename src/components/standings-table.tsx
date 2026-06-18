import { Crest } from "@/components/crest";
import { resolveTable } from "@/lib/queries";
import type { PresetKey, StatColumn } from "@/lib/standings";

type Row = {
  group: {
    id: string;
    code: string;
    shortName: string;
    colorHex: string;
    logoUrl?: string | null;
  };
  stats: Record<string, number>;
  manualPosition: number | null;
};

const SURFACE = "var(--usf-indigo-surface)";

export function StandingsTable({
  title,
  preset,
  rows,
}: {
  title: string;
  preset: PresetKey;
  rows: Parameters<typeof resolveTable>[1];
}) {
  const { columns, rows: ranked } = resolveTable(preset, rows) as {
    columns: StatColumn[];
    rows: Row[];
  };
  const maxPts = Math.max(1, ...ranked.map((r) => r.stats.Pts ?? 0));

  return (
    <div className="overflow-hidden rounded-2xl border border-border-brand bg-surface/60 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border-brand px-4 py-3">
        <h4 className="display-wide text-sm">{title}</h4>
        <span className="text-[10px] uppercase tracking-widest text-muted">
          {preset.toLowerCase()}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase text-muted">
              <th className="sticky left-0 z-20 border-b border-r border-border-brand bg-surface px-3 py-2 font-medium">
                Team
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="border-b border-border-brand px-2.5 py-2 text-center font-medium"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => {
              const leader = i === 0 && (r.stats.P ?? 0) > 0;
              const stickyBg = leader
                ? `linear-gradient(90deg, ${r.group.colorHex}38, ${r.group.colorHex}10 90%), ${SURFACE}`
                : SURFACE;
              return (
                <tr key={r.group.id} className="group">
                  <td
                    className="sticky left-0 z-10 border-b border-r border-border-brand/60 px-3 py-2.5"
                    style={{ background: stickyBg }}
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                          leader
                            ? "bg-brand-yellow text-indigo-deep"
                            : "bg-white/5 text-muted"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <Crest
                        code={r.group.code}
                        color={r.group.colorHex}
                        logoUrl={r.group.logoUrl}
                        size={26}
                      />
                      <span className="font-semibold">{r.group.shortName}</span>
                    </span>
                  </td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`relative border-b border-border-brand/60 px-2.5 py-2.5 text-center tabular-nums ${
                        c.key === "Pts"
                          ? "font-display text-base text-foreground"
                          : "text-muted"
                      }`}
                    >
                      {c.key === "Pts" && (
                        <span
                          className="absolute inset-x-1.5 bottom-1 h-1 rounded-full"
                          style={{
                            width: `calc(${((r.stats.Pts ?? 0) / maxPts) * 100}% - 0.75rem)`,
                            background: r.group.colorHex,
                            opacity: 0.55,
                          }}
                          aria-hidden
                        />
                      )}
                      {r.stats[c.key] ?? 0}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
