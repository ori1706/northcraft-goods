import Link from "next/link";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [hero, desk, carry] = await Promise.all([
    prisma.product.findMany({
      where: { archived: false, featured: true },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.product.findMany({
      where: { archived: false, category: "Desk & Tech" },
      include: { variants: true },
      orderBy: { featured: "desc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { archived: false, category: "Carry & Travel" },
      include: { variants: true },
      orderBy: { featured: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),transparent_55%)]" />

        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
          <div className="flex-1 space-y-7">
            <p className="text-[11px] uppercase tracking-[0.38em] text-teal-200/90">Northcraft Goods</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
              Quiet objects for tactile days—desk rituals, carry companions, glowing corners.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-400">
              A production-ready storefront wired to Postgres inventory: optimistic carts, overlays anchored in the app shell, and checkout paths that fail gracefully when stock races ahead of you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-teal-400 px-7 py-3 text-sm font-semibold text-zinc-950 shadow-[0_14px_60px_rgba(45,212,191,0.35)] transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              >
                Shop all
              </Link>
              <Link
                href="/shop?sort=newest"
                className="inline-flex items-center justify-center rounded-full bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
              >
                See newest drops
              </Link>
            </div>

            <div className="flex gap-6 pt-4 text-xs text-zinc-500">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-600">Shipping posture</p>
                <p className="mt-2 text-sm text-zinc-300">Transparent stock counts · graceful checkout collisions</p>
              </div>
              <div className="hidden h-12 w-px bg-white/10 sm:block" />
              <div className="hidden sm:block">
                <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-600">Made for embeds</p>
                <p className="mt-2 text-sm text-zinc-300">No fixed-to-viewport cart · no vh heroes</p>
              </div>
            </div>
          </div>

          <div className="relative flex-1">
            <div
              className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] shadow-[0_28px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
              style={{ minHeight: 600 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero[0]?.images[0] ?? "https://images.unsplash.com/photo-1498049860656-af28884c997d?auto=format&fit=crop&w=1400&q=80"}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/25 to-transparent" />
              <div className="relative flex h-full min-h-[600px] flex-col justify-end p-8">
                <p className="text-[11px] uppercase tracking-[0.34em] text-teal-100">Featured trio</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {hero.map((p) => (
                    <Link
                      key={p.id}
                      href={`/shop/${p.slug}`}
                      className="rounded-2xl border border-white/15 bg-black/35 p-4 text-sm text-white backdrop-blur-xl transition hover:border-teal-400/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">{p.category}</p>
                      <p className="mt-2 font-semibold leading-snug">{p.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-teal-200/90">Featured collections</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Desk rituals · Carry companions</h2>
          </div>
          <Link href="/shop" className="text-sm text-teal-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">
            Browse entire catalog →
          </Link>
        </div>

        <div className="space-y-10">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Desk & Tech</h3>
              <Link className="text-xs text-zinc-400 underline-offset-4 hover:text-teal-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70" href="/shop?category=Desk+%26+Tech">
                Filter category
              </Link>
            </div>
            <ProductGrid products={desk} />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Carry & Travel</h3>
              <Link className="text-xs text-zinc-400 underline-offset-4 hover:text-teal-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70" href="/shop?category=Carry+%26+Travel">
                Filter category
              </Link>
            </div>
            <ProductGrid products={carry} />
          </div>
        </div>
      </section>
    </div>
  );
}
