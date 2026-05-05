"use client";

import Link from "next/link";

import { formatMoney } from "@/lib/inventory";

import { CartThumb, useCart } from "./CartProvider";

export function CartDrawer() {
  const { open, setOpen, items, subtotalCents, setQty, removeLine, syncing } = useCart();

  return (
    <div className={`absolute inset-0 z-40 overflow-hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <button
        type="button"
        aria-label="Close cart"
        className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />

      <aside
        aria-hidden={!open}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md transform flex-col bg-zinc-950/95 shadow-[0_12px_80px_rgba(0,0,0,0.65)] ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Cart</p>
            <p className="text-lg font-semibold text-white">Northcraft Goods</p>
          </div>
          <button
            type="button"
            className="rounded-full px-3 py-1 text-sm text-zinc-300 ring-1 ring-white/15 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
              Your cart is empty. Explore{" "}
              <Link href="/shop" className="text-teal-300 underline-offset-4 hover:underline" onClick={() => setOpen(false)}>
                the catalog
              </Link>
              .
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex gap-3">
                    <CartThumb src={item.image} alt={item.name} />
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-zinc-400">{formatMoney(item.priceCents)}</p>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-zinc-400 underline-offset-4 hover:text-rose-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                          onClick={() => void removeLine(item.key)}
                        >
                          Remove
                        </button>
                      </div>

                      {item.warning ? <p className="text-xs text-amber-300">{item.warning}</p> : null}

                      <div className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`qty-${item.key}`}>
                          Quantity for {item.name}
                        </label>
                        <input
                          id={`qty-${item.key}`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          className="w-20 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                          value={item.quantity}
                          onChange={(e) => void setQty(item.key, Number(e.target.value))}
                        />
                        <span className="text-xs text-zinc-500">{item.availableStock} available</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>Subtotal</span>
            <span className="text-base font-semibold text-white">{formatMoney(subtotalCents)}</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">{syncing ? "Syncing cart…" : "Inventory re-checks on every update."}</p>
          <Link
            href="/checkout"
            onClick={(e) => {
              if (items.length === 0) {
                e.preventDefault();
                return;
              }
              setOpen(false);
            }}
            className={`mt-4 flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
              items.length === 0 ? "pointer-events-none cursor-not-allowed bg-white/10 text-zinc-500" : "bg-teal-400 text-zinc-950 hover:bg-teal-300"
            }`}
            aria-disabled={items.length === 0}
          >
            Checkout
          </Link>
          <Link
            href="/cart"
            className="mt-3 block text-center text-sm text-teal-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            onClick={() => setOpen(false)}
          >
            View full cart page
          </Link>
        </div>
      </aside>
    </div>
  );
}
