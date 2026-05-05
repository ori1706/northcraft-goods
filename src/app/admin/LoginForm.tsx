"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { adminLogin } from "@/app/actions/admin";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto mt-16 max-w-md space-y-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 ring-1 ring-white/5"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        startTransition(async () => {
          const res = await adminLogin(password);
          if (!res.ok) setMessage(res.message);
          else {
            setPassword("");
            router.refresh();
          }
        });
      }}
    >
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">Admin access</p>
        <h1 className="text-3xl font-semibold text-white">Northcraft console</h1>
        <p className="text-sm text-zinc-400">
          Password gates everything — tuned for iframe demos without heavyweight auth plumbing.
        </p>
      </div>

      <label className="block space-y-2 text-sm text-zinc-300">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
          autoComplete="current-password"
          required
        />
      </label>

      {message ? <p className="text-sm text-amber-300">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-teal-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
      >
        {pending ? "Signing in…" : "Unlock"}
      </button>
    </form>
  );
}
