import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/inventory";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) notFound();

  const eta = new Date(order.createdAt);
  eta.setDate(eta.getDate() + 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-[32px] border border-teal-400/25 bg-gradient-to-br from-teal-400/15 via-white/[0.04] to-white/[0.02] p-8 ring-1 ring-teal-300/25">
        <p className="text-[11px] uppercase tracking-[0.34em] text-teal-100">Order placed</p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-semibold text-white">Thanks, {order.name.split(" ")[0]} · Order #{order.id}</h1>
          <p className="text-sm text-teal-100/90">
            Confirmation emailed to <span className="font-semibold text-white">{order.email}</span>
          </p>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300">
          Packed in the Northcraft studio with serialized inventory deductions—this page survives refresh because it&apos;s backed by Postgres, not ephemeral state.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Ship to</p>
            <p className="mt-2 text-sm text-zinc-200">
              {order.name}
              <br />
              {order.addressLine1}
              {order.addressLine2 ? (
                <>
                  <br />
                  {order.addressLine2}
                </>
              ) : null}
              <br />
              {order.city}, {order.postalCode}
              <br />
              {order.country}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Status</p>
            <p className="mt-2 text-lg font-semibold text-white">{order.status}</p>
            <p className="mt-2 text-xs text-zinc-400">Fulfillment queues update from the admin console.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Estimated arrival</p>
            <p className="mt-2 text-lg font-semibold text-white">{eta.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
            <p className="mt-2 text-xs text-zinc-400">Carrier assignment lands in your inbox shortly.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/5">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Items</p>
        <ul className="divide-y divide-white/10">
          {order.items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
              <div>
                <p className="font-medium text-white">{item.product.name}</p>
                {item.variant ? <p className="text-xs text-zinc-400">Variant · {item.variant.label}</p> : null}
                <p className="mt-2 text-xs text-zinc-500">Qty {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-100">{formatMoney(item.priceAtPurchaseCents * item.quantity)}</p>
                <p className="text-xs text-zinc-500">{formatMoney(item.priceAtPurchaseCents)} each</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold text-white">
          <span>Total</span>
          <span>{formatMoney(order.subtotalCents)}</span>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/shop"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
        >
          Continue shopping
        </Link>
        <Link
          href="/admin"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
        >
          Ops console
        </Link>
      </div>
    </div>
  );
}
