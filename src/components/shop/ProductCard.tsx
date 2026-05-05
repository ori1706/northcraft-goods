import Link from "next/link";

import type { Product, ProductVariant } from "@prisma/client";

import { effectiveStock } from "@/lib/inventory";
import { formatMoney } from "@/lib/inventory";

export function ProductCard({ product }: { product: Product & { variants: ProductVariant[] } }) {
  const stock = effectiveStock(product);
  const low = stock > 0 && stock <= 3;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_14px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-teal-400/35 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {stock <= 0 ? (
          <span className="absolute left-4 top-4 rounded-full bg-zinc-950/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300 ring-1 ring-white/15 backdrop-blur-md">
            Sold out
          </span>
        ) : low ? (
          <span className="absolute left-4 top-4 rounded-full bg-amber-400/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-950">
            Only {stock} left
          </span>
        ) : product.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-teal-400/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-950">
            Featured
          </span>
        ) : null}
      </div>

      <div className="space-y-2 px-5 pb-6 pt-5">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">{product.category}</p>
        <p className="text-lg font-semibold leading-snug text-white">{product.name}</p>
        <p className="text-sm text-teal-200">{formatMoney(product.priceCents)}</p>
      </div>
    </Link>
  );
}
