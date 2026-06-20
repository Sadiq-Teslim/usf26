import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { getAdmin } from "@/lib/auth";
import { logout } from "./actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

const RAINBOW = [
  "var(--usf-blue)",
  "var(--usf-orange)",
  "var(--usf-magenta)",
  "var(--usf-yellow)",
  "var(--usf-green)",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Toaster
        position="top-center"
        richColors
        theme="dark"
        toastOptions={{ style: { fontFamily: "var(--font-inter)" } }}
      />
      {/* Sidebar (desktop) */}
      <aside
        className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border-brand p-4 sm:flex"
        style={{ backgroundColor: "#171340" }}
      >
        <div className="mb-1 flex h-1 overflow-hidden rounded-full">
          {RAINBOW.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <Link href="/admin" className="mt-3 flex items-center gap-2">
          <span className="font-display text-xl">
            USF<span className="text-brand-yellow">&rsquo;26</span>
          </span>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">
            Admin
          </span>
        </Link>

        <AdminNav />

        <div className="mt-auto border-t border-border-brand pt-4 text-xs text-muted">
          <p className="mb-2 truncate font-medium text-foreground/70">
            {admin.email}
          </p>
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-1 py-1 hover:text-foreground"
          >
            View public site &rarr;
          </Link>
          <form action={logout}>
            <button className="mt-1 px-1 text-brand-magenta hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border-brand px-4 py-3 sm:hidden"
        style={{ backgroundColor: "#171340" }}
      >
        <AdminMobileNav email={admin.email} logout={logout} />
        <Link href="/admin" className="font-display text-lg">
          USF<span className="text-brand-yellow">&rsquo;26</span> Admin
        </Link>
        <span className="w-9" aria-hidden />
      </header>

      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
