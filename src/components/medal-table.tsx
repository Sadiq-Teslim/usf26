import { Crest } from "@/components/crest";

type Row = {
  id: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  group: { code: string; shortName: string; colorHex: string; logoUrl?: string | null };
};

const SURFACE = "var(--usf-indigo-surface)";
const STAR = ["#ffd200", "#cdd3e0", "#e08a3c"]; // gold / silver / bronze

export function MedalTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-3xl border border-border-brand bg-surface/60 backdrop-blur">
      <div className="flex items-center justify-between gap-3 border-b border-border-brand px-5 py-4">
        <h2 className="font-display text-2xl sm:text-3xl">Medal Table</h2>
        <span className="text-[11px] uppercase tracking-widest text-muted">
          Gold ×5 · Silver ×3 · Bronze ×1
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted">
              <th className="sticky left-0 z-20 border-b border-r border-border-brand bg-surface px-4 py-2 text-left font-medium">
                Team
              </th>
              <th className="border-b border-border-brand px-3 py-2 text-center font-medium">🥇</th>
              <th className="border-b border-border-brand px-3 py-2 text-center font-medium">🥈</th>
              <th className="border-b border-border-brand px-3 py-2 text-center font-medium">🥉</th>
              <th className="border-b border-border-brand px-4 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const champ = i === 0;
              const stickyBg = champ
                ? `linear-gradient(90deg, ${STAR[0]}33, ${STAR[0]}10 90%), ${SURFACE}`
                : SURFACE;
              return (
                <tr key={r.id}>
                  <td
                    className="sticky left-0 z-10 border-b border-r border-border-brand/60 px-4 py-3"
                    style={{ background: stickyBg }}
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                          champ ? "bg-brand-yellow text-indigo-deep" : "bg-white/5 text-muted"
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
                      {i < 3 && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={STAR[i]} aria-hidden>
                          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td className="border-b border-border-brand/60 px-3 py-3 text-center font-bold tabular-nums" style={{ color: STAR[0] }}>
                    {r.gold}
                  </td>
                  <td className="border-b border-border-brand/60 px-3 py-3 text-center font-bold tabular-nums" style={{ color: STAR[1] }}>
                    {r.silver}
                  </td>
                  <td className="border-b border-border-brand/60 px-3 py-3 text-center font-bold tabular-nums" style={{ color: STAR[2] }}>
                    {r.bronze}
                  </td>
                  <td className="border-b border-border-brand/60 px-4 py-3 text-right">
                    <span className="font-display text-lg">{r.total}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
