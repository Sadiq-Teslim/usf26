import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl text-brand-yellow">404</p>
      <h1 className="font-display text-2xl">Not found</h1>
      <p className="text-muted">That page isn&rsquo;t part of USF&rsquo;26.</p>
      <Link
        href="/"
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-indigo-deep"
      >
        Back to sports
      </Link>
    </main>
  );
}
