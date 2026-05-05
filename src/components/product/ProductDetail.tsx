"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Product, ProductVariant } from "@prisma/client";

import { useCart } from "@/components/cart/CartProvider";
import { formatMoney, lineAvailableStock } from "@/lib/inventory";

export function ProductDetail({
  product,
  related,
}: {
  product: Product & { variants: ProductVariant[] };
  related: Array<Product & { variants: ProductVariant[] }>;
}) {
  const { addLine } = useCart();
  const [idx, setIdx] = useState(0);
  const images = product.images.length ? product.images : ["/file.svg"];

  const initialVariantId = product.hasVariants && product.variants[0] ? product.variants[0].id : null;
  const [variantId, setVariantId] = useState<number | null>(initialVariantId);

  const selectedVariant = useMemo(
    () => (variantId == null ? null : product.variants.find((v) => v.id === variantId) ?? null),
    [product.variants, variantId],
  );

  const available = lineAvailableStock(product, product.hasVariants ? variantId : null);
  const disabled = available <= 0 || (product.hasVariants && variantId == null);

  const primaryImage = images[Math.min(idx, images.length - 1)];

  const handleAdd = async () => {
    if (disabled) return;
    await addLine(
      {
        productId: product.id,
        variantId: product.hasVariants ? variantId : null,
        quantity: 1,
      },
      { toastMessage: `${product.name} added to cart` },
    );
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-5">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-[0_24px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={primaryImage} alt="" className="aspect-square w-full object-cover" />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.slice(0, 6).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${idx === i ? "ring-teal-300" : "ring-transparent hover:ring-white/25"}`}
              aria-label={`Show image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">{product.category}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">{product.name}</h1>
          <p className="text-2xl font-medium text-teal-100">{formatMoney(product.priceCents)}</p>
          <p className="text-sm leading-relaxed text-zinc-400">{product.description}</p>
        </div>

        {product.hasVariants ? (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Choose finish</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${variantId === v.id ? "bg-teal-400 text-zinc-950 ring-teal-200" : "bg-white/[0.04] text-zinc-200 ring-white/15 hover:bg-white/[0.08]"}`}
                >
                  {v.label}
                  <span className="ml-2 text-[11px] font-normal text-zinc-500">{v.stock <= 0 ? "· Out" : `· ${v.stock} left`}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Live stock</span>
            <span className={available > 0 ? "font-semibold text-teal-200" : "font-semibold text-amber-300"}>
              {available > 0 ? `${available} ready to ship` : "Currently unavailable"}
            </span>
          </div>
          {selectedVariant ? (
            <p className="mt-3 text-xs text-zinc-500">
              Tracking variant <span className="text-zinc-300">{selectedVariant.label}</span> independently in inventory.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={() => void handleAdd()}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
          >
            Add to cart
          </button>
        </div>

        {related.length ? (
          <div className="space-y-4 pt-6">
            <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Related objects</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 ring-1 ring-white/5 transition hover:border-teal-400/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-teal-200">{formatMoney(p.priceCents)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
