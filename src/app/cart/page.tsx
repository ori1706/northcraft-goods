"use client";

import Link from "next/link";

import { CartThumb, useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/inventory";

export default function CartPage() {
  const { items, subtotalCents, setQty, removeLine, syncing } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">Cart</p>
        <h1 className="text-4xl font-semibold text-white">Review selections</h1>
        <p className="text-sm text-zinc-400">
          Drawer mirrors this page—everything stays anchored inside the Northcraft shell for iframe compatibility.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-zinc-400">
            Nothing here yet.{" "}
            <Link href="/shop" className="text-teal-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">
              Continue shopping
            </Link>
            .
          </div>
        ) : (
          items.map((item) => (
            <div key={item.key} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <CartThumb src={item.image} alt={item.name} />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-teal-200">{formatMoney(item.priceCents)}</p>
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
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  Qty
                  <input
                    type="number"
                    min={1}
                    className="w-24 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                    value={item.quantity}
                    onChange={(e) => void setQty(item.key, Number(e.target.value))}
                  />
                  <span>{item.availableStock} available</span>
                </label>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>Subtotal</span>
          <span className="text-xl font-semibold text-white">{formatMoney(subtotalCents)}</span>
        </div>
        <p className="mt-3 text-xs text-zinc-500">{syncing ? "Syncing cart…" : "Totals reflect live inventory caps."}</p>
        <Link
          href="/checkout"
          className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${items.length === 0 ? "cursor-not-allowed bg-white/10 text-zinc-500" : "bg-teal-400 text-zinc-950 hover:bg-teal-300"}`}
          aria-disabled={items.length === 0}
          onClick={(e) => {
            if (items.length === 0) e.preventDefault();
          }}
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
