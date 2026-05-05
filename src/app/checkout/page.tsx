"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, replaceLines, refreshFromServer, syncing } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          name: fd.get("name"),
          addressLine1: fd.get("addressLine1"),
          addressLine2: fd.get("addressLine2"),
          city: fd.get("city"),
          postalCode: fd.get("postalCode"),
          country: fd.get("country"),
        }),
      });
      const payload = (await res.json()) as { ok: boolean; orderId?: number; message?: string };
      if (!res.ok || !payload.ok || !payload.orderId) {
        setError(payload.message ?? "Checkout failed.");
        return;
      }
      await replaceLines([]);
      await refreshFromServer();
      router.push(`/orders/${payload.orderId}`);
    } catch {
      setError("Network error — try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div>
        <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Ship it thoughtfully</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
          Orders deduct inventory inside a serialized Postgres transaction—if stock slips between cart and checkout, you&apos;ll see a friendly retry prompt instead of silent drift.
        </p>

        <form className="mt-10 space-y-5" onSubmit={(e) => void submit(e)}>
          <Field label="Full name" name="name" autoComplete="name" />
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field label="Address line 1" name="addressLine1" autoComplete="address-line1" />
          <Field label="Address line 2 (optional)" name="addressLine2" autoComplete="address-line2" optional />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="City" name="city" autoComplete="address-level2" />
            <Field label="Postal code" name="postalCode" autoComplete="postal-code" />
          </div>
          <Field label="Country" name="country" autoComplete="country-name" />

          {error ? <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">{error}</p> : null}

          <button
            type="submit"
            disabled={pending || items.length === 0 || syncing}
            className="w-full rounded-full bg-teal-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
          >
            {pending ? "Placing order…" : "Place order"}
          </button>
        </form>
      </div>

      <aside className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/5">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Order summary</p>
        <div className="space-y-3 text-sm text-zinc-300">
          {syncing && items.length === 0 ? (
            <p className="text-zinc-500">Loading cart…</p>
          ) : items.length === 0 ? (
            <p className="text-zinc-500">Your cart is empty — add something luminous first.</p>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-zinc-500">Qty {item.quantity}</p>
                  {item.warning ? <p className="mt-2 text-xs text-amber-300">{item.warning}</p> : null}
                </div>
                <p className="text-sm text-teal-100">
                  ${(item.priceCents / 100).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-4 text-base font-semibold text-white">
          <span>Total</span>
          <span>${(subtotalCents / 100).toFixed(2)}</span>
        </div>

        <p className="text-xs leading-relaxed text-zinc-500">
          Estimated workshop handling: <span className="text-zinc-300">2–4 business days</span> · You&apos;ll land on a confirmation with a resilient order id (safe to refresh).
        </p>

        <Link href="/cart" className="block text-center text-sm text-teal-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">
          ← Back to cart
        </Link>
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  optional,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm text-zinc-300">
      <span>
        {label}
        {optional ? <span className="text-zinc-600"> · optional</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={!optional}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
      />
    </label>
  );
}
