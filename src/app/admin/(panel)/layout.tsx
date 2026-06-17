import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { logout } from "./actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sports", label: "Sports" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="glass hidden w-56 shrink-0 flex-col p-4 sm:flex">
        <Link href="/admin" className="font-display text-xl">
          USF<span className="text-brand-yellow">&rsquo;26</span> Admin
        </Link>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-muted hover:bg-white/5 hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 text-xs text-muted">
          <p className="truncate">{admin.email}</p>
          <form action={logout}>
            <button className="mt-2 text-brand-magenta hover:underline">
              Sign out
            </button>
          </form>
          <Link href="/" className="mt-2 block hover:underline">
            View public site &rarr;
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
