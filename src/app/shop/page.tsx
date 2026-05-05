import Link from "next/link";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { fetchProducts } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const priceMinRaw = typeof sp.priceMin === "string" ? Number(sp.priceMin) : NaN;
  const priceMaxRaw = typeof sp.priceMax === "string" ? Number(sp.priceMax) : NaN;
  const priceMin = Number.isFinite(priceMinRaw) ? Math.round(priceMinRaw * 100) : undefined;
  const priceMax = Number.isFinite(priceMaxRaw) ? Math.round(priceMaxRaw * 100) : undefined;
  const inStockOnly = sp.inStock === "1" || sp.inStock === "true";

  const products = await fetchProducts({ q, category, sort, priceMin, priceMax, inStockOnly });

  const categories = (
    await prisma.product.groupBy({
      by: ["category"],
      where: { archived: false },
      orderBy: { category: "asc" },
    })
  ).map((c) => c.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">Catalog</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Objects for intentional days</h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            Filters and sort are URL-driven—perfect for sharing a moodboard link. Low-stock signals update from live Postgres
            counts, even while the shop is embedded elsewhere.
          </p>
          <Link
            href="/api/products"
            className="inline-flex w-fit text-xs text-zinc-500 underline-offset-4 hover:text-teal-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            prefetch={false}
          >
            Tip: open <span className="px-1 font-mono text-zinc-300">/api/products</span> for raw JSON search.
          </Link>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <ShopToolbar categories={categories} />
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-sm text-zinc-400">
            No products match those filters yet.{" "}
            <Link className="text-teal-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70" href="/shop">
              Reset
            </Link>
            .
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
