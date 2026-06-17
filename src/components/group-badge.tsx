export function GroupBadge({
  code,
  name,
  color,
  className = "",
}: {
  code: string;
  name?: string;
  color: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-white/20"
        style={{ background: color }}
        aria-hidden
      />
      <span className="font-medium">{name ?? code}</span>
    </span>
  );
}
