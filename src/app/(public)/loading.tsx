export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-48 animate-pulse rounded-3xl border border-border-brand bg-surface" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-border-brand bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
