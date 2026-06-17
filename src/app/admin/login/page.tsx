"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute left-1/2 top-[-10%] h-160 w-160 -translate-x-1/2 rounded-full bg-indigo-brand/30 blur-3xl" aria-hidden />
      <form
        action={formAction}
        className="glass relative w-full max-w-sm rounded-3xl p-7"
      >
        <div className="mb-4 flex gap-1">
          {["var(--usf-blue)", "var(--usf-orange)", "var(--usf-magenta)", "var(--usf-yellow)", "var(--usf-green)"].map(
            (c) => (
              <span key={c} className="h-1.5 w-6 rounded-full" style={{ background: c }} />
            ),
          )}
        </div>
        <h1 className="font-display text-3xl">
          USF<span className="text-brand-yellow">&rsquo;26</span> Admin
        </h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage the festival.</p>

        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1 w-full rounded-lg border border-border-brand bg-indigo-deep px-3 py-2 text-sm outline-none focus:border-white/40"
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-border-brand bg-indigo-deep px-3 py-2 text-sm outline-none focus:border-white/40"
        />

        {state.error && (
          <p className="mt-3 text-sm text-brand-magenta">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-foreground py-2 text-sm font-semibold text-indigo-deep disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
