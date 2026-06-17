const STYLES: Record<string, string> = {
  LIVE: "bg-brand-magenta/20 text-brand-magenta ring-brand-magenta/40",
  FINISHED: "bg-brand-green/15 text-brand-green ring-brand-green/30",
  SCHEDULED: "bg-white/10 text-muted ring-white/20",
  POSTPONED: "bg-brand-orange/15 text-brand-orange ring-brand-orange/30",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] ?? STYLES.SCHEDULED;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${cls}`}
    >
      {status === "LIVE" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-magenta" />
      )}
      {status.toLowerCase()}
    </span>
  );
}
