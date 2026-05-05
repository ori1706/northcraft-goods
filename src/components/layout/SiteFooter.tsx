import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-zinc-950 to-black py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">Brand</p>
          <p className="mt-3 text-lg font-semibold text-white">Northcraft Goods</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            Curated desk rituals, carry companions, and tactile home layers—chosen for longevity, photographed honestly,
            stocked with discipline.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>
              <Link className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 rounded-md px-1 py-1" href="/shop">
                Catalog
              </Link>
            </li>
            <li>
              <Link className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 rounded-md px-1 py-1" href="/shop?sort=newest">
                New arrivals
              </Link>
            </li>
            <li>
              <Link className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 rounded-md px-1 py-1" href="/checkout">
                Checkout demo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">Crafted for iframe embeds</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Cart overlays stay inside the Northcraft shell—no viewport-fixed traps—so career-page frames stay pristine on every host.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 px-4 text-xs text-zinc-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Northcraft Goods · Showcase build</p>
        <p className="text-zinc-500">Images courtesy of Unsplash creators · Inventory synced live via Postgres</p>
      </div>
    </footer>
  );
}
