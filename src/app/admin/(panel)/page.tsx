import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [sports, published, fixtures, liveOrUpcoming] = await Promise.all([
    db.sport.count(),
    db.sport.count({ where: { isPublished: true } }),
    db.fixture.count(),
    db.fixture.count({ where: { status: { in: ["SCHEDULED", "LIVE"] } } }),
  ]);

  const stats = [
    { label: "Sports", value: sports, sub: `${published} published` },
    { label: "Fixtures", value: fixtures, sub: `${liveOrUpcoming} upcoming/live` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border-brand bg-surface p-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted">
              {s.label}
            </p>
            <p className="font-display text-3xl">{s.value}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>
      <Link
        href="/admin/sports"
        className="inline-block w-fit rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-indigo-deep"
      >
        Manage sports &rarr;
      </Link>
    </div>
  );
}
