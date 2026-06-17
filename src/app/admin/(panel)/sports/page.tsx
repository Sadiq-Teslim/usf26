import Link from "next/link";
import { db } from "@/lib/db";
import { toggleSportPublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function SportsListPage() {
  const sports = await db.sport.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { divisions: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Sports</h1>
        <Link
          href="/admin/sports/new"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-indigo-deep"
        >
          + New sport
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-brand">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Preset</th>
              <th className="px-4 py-3 font-medium">Divisions</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sports.map((s) => (
              <tr key={s.id} className="border-t border-border-brand">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-muted">{s.displayMode}</td>
                <td className="px-4 py-3 text-muted">{s.tablePreset}</td>
                <td className="px-4 py-3 text-muted">{s._count.divisions}</td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await toggleSportPublished(s.id, !s.isPublished);
                    }}
                  >
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        s.isPublished
                          ? "bg-brand-green/15 text-brand-green"
                          : "bg-white/10 text-muted"
                      }`}
                    >
                      {s.isPublished ? "Published" : "Hidden"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/sports/${s.id}`}
                    className="text-brand-yellow hover:underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
