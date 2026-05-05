"use client";

import type { Order, OrderItem, OrderStatus, Product, ProductVariant } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";

import {
  adminArchive,
  adminBumpStock,
  adminCreateProduct,
  adminLogout,
  adminSetPrice,
  adminSetStatus,
} from "@/app/actions/admin";
import { formatMoney } from "@/lib/inventory";

type OrderWithItems = Order & {
  items: Array<OrderItem & { product: Product; variant: ProductVariant | null }>;
};

type ProductWithVariants = Product & { variants: ProductVariant[] };

export function AdminConsole({
  products,
  orders,
}: {
  products: ProductWithVariants[];
  orders: OrderWithItems[];
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const busy = pending;

  const totalSkus = useMemo(() => products.length, [products.length]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">Admin</p>
          <h1 className="text-4xl font-semibold text-white">Inventory + orders</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            {totalSkus} live SKUs · restock instantly · create promos · audit every order line.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => startTransition(async () => adminLogout())}
          className="rounded-full bg-white/[0.06] px-5 py-2 text-sm text-white ring-1 ring-white/15 transition hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 disabled:opacity-40"
        >
          Log out
        </button>
      </div>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/5">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">New product</p>
        <form
          className="mt-5 grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              try {
                await adminCreateProduct(fd);
                (e.target as HTMLFormElement).reset();
              } catch (err) {
                alert(err instanceof Error ? err.message : "Unable to create product");
              }
            });
          }}
        >
          <Field name="name" label="Name" required />
          <Field name="slug" label="Slug (optional)" />
          <Field name="category" label="Category" required />
          <Field name="priceUsd" label="Price (USD)" type="number" step="0.01" required />
          <Field name="stock" label="Initial stock" type="number" required />
          <Field name="imageUrl" label="Primary image URL" />
          <div className="md:col-span-2">
            <label className="block space-y-2 text-sm text-zinc-300">
              Description
              <textarea
                name="description"
                required
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
              />
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
            >
              Publish SKU
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Products</p>
        <div className="overflow-hidden rounded-[28px] border border-white/10 ring-1 ring-white/5">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-xs text-zinc-500">#{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.category}</div>
                    {p.archived ? <div className="text-xs text-amber-300">Archived</div> : null}
                  </td>
                  <td className="px-4 py-3">{formatMoney(p.priceCents)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{p.hasVariants ? sumVariantStock(p.variants) : p.stock}</div>
                    {p.hasVariants ? (
                      <div className="text-xs text-zinc-500">{p.variants.map((v) => `${v.label}:${v.stock}`).join(" · ")}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        className="rounded-full bg-white/[0.06] px-3 py-1 text-xs ring-1 ring-white/15 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 disabled:opacity-40"
                        onClick={() => startTransition(async () => adminBumpStock(p.id, 10))}
                      >
                        +10 stock
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className="rounded-full bg-white/[0.06] px-3 py-1 text-xs ring-1 ring-white/15 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 disabled:opacity-40"
                        onClick={() => {
                          const next = window.prompt("New price in USD (e.g. 24.99)", (p.priceCents / 100).toFixed(2));
                          if (!next) return;
                          const value = Number(next);
                          if (!Number.isFinite(value)) return;
                          startTransition(async () => adminSetPrice(p.id, Math.round(value * 100)));
                        }}
                      >
                        Edit price
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className="rounded-full bg-white/[0.06] px-3 py-1 text-xs ring-1 ring-white/15 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 disabled:opacity-40"
                        onClick={() => startTransition(async () => adminArchive(p.id, !p.archived))}
                      >
                        {p.archived ? "Restore" : "Archive"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Orders</p>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] ring-1 ring-white/5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                onClick={() => setExpanded((prev) => (prev === order.id ? null : order.id))}
              >
                <div>
                  <p className="text-sm font-semibold text-white">Order #{order.id}</p>
                  <p className="text-xs text-zinc-500">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-teal-100">{formatMoney(order.subtotalCents)}</p>
                  <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white ring-1 ring-white/15">{order.status}</span>
                  <span className="text-xs text-zinc-500">{expanded === order.id ? "Hide" : "View"}</span>
                </div>
              </button>

              <div className="border-t border-white/10 px-5 py-4">
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  Status
                  <select
                    defaultValue={order.status}
                    disabled={busy}
                    className="rounded-lg border border-white/10 bg-zinc-950 px-2 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                    onChange={(e) =>
                      startTransition(async () => adminSetStatus(order.id, e.target.value as OrderStatus))
                    }
                  >
                    {(["PLACED", "SHIPPED", "CANCELLED"] as const).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {expanded === order.id ? (
                <div className="border-t border-white/10 bg-black/25 px-5 py-4">
                  <ul className="space-y-3 text-sm text-zinc-200">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{item.product.name}</p>
                          {item.variant ? <p className="text-xs text-zinc-500">Variant · {item.variant.label}</p> : null}
                          <p className="text-xs text-zinc-500">Qty {item.quantity}</p>
                        </div>
                        <div className="text-right text-teal-100">{formatMoney(item.priceAtPurchaseCents * item.quantity)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm text-zinc-300">
      {label}
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
      />
    </label>
  );
}

function sumVariantStock(variants: ProductVariant[]) {
  return variants.reduce((sum, v) => sum + v.stock, 0);
}
