"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";

export function SiteHeader() {
  const router = useRouter();
  const { setOpen, lines } = useCart();
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="flex flex-col leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
          <span className="text-[11px] uppercase tracking-[0.34em] text-zinc-400">Northcraft Goods</span>
          <span className="text-lg font-semibold text-white">Modern essentials</span>
        </Link>

        <SearchField />

        <nav className="ml-auto hidden items-center gap-5 text-sm text-zinc-300 md:flex">
          <Link className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 rounded-md px-1 py-1" href="/shop">
            Shop all
          </Link>
          <Link className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 rounded-md px-1 py-1" href="/shop?sort=newest">
            New arrivals
          </Link>
          <Link className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 rounded-md px-1 py-1" href="/admin">
            Admin
          </Link>
        </nav>

        <button
          type="button"
          className="relative rounded-full bg-white/[0.06] px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
          onClick={() => setOpen(true)}
        >
          Cart
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-teal-400 px-1 text-[11px] font-bold text-zinc-950">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          className="md:hidden rounded-md p-2 text-sm text-zinc-200 ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
          onClick={() => router.push("/shop")}
          aria-label="Open shop"
        >
          Menu
        </button>
      </div>
    </header>
  );
}

function SearchField() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    const url = trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop";
    router.push(url);
  };

  return (
    <form onSubmit={onSubmit} className="hidden flex-1 items-center md:flex">
      <label className="sr-only" htmlFor="global-search">
        Search products
      </label>
      <input
        id="global-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search objects, rituals, desk heroes…"
        className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
      />
    </form>
  );
}
