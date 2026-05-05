"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useTransition } from "react";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · Low to high" },
  { value: "price-desc", label: "Price · High to low" },
  { value: "newest", label: "Newest" },
];

export function ShopToolbar({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const activeCategory = params.get("category") ?? "";
  const activeSort = params.get("sort") ?? "featured";
  const inStockOnly = params.get("inStock") === "1";
  const priceMin = params.get("priceMin") ?? "";
  const priceMax = params.get("priceMax") ?? "";

  const base = useMemo(() => new URLSearchParams(params.toString()), [params]);

  const pushParams = (next: URLSearchParams) => {
    startTransition(() => {
      router.replace(`/shop?${next.toString()}`, { scroll: false });
    });
  };

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(base.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (!v || v.length === 0) next.delete(k);
      else next.set(k, v);
    });
    pushParams(next);
  };

  const onSubmitPrices = (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const min = String(fd.get("priceMin") ?? "").trim();
    const max = String(fd.get("priceMax") ?? "").trim();
    update({ priceMin: min || undefined, priceMax: max || undefined });
  };

  return (
    <div className={`space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 ${pending ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${activeCategory === "" ? "bg-teal-400 text-zinc-950 ring-teal-300" : "bg-transparent text-zinc-300 ring-white/15 hover:bg-white/5"}`}
            onClick={() => update({ category: undefined })}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`rounded-full px-3 py-1 text-xs ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${activeCategory === c ? "bg-teal-400 text-zinc-950 ring-teal-300" : "bg-transparent text-zinc-300 ring-white/15 hover:bg-white/5"}`}
              onClick={() => update({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <form onSubmit={onSubmitPrices} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-[0.26em] text-zinc-500" htmlFor="priceMin">
              Min ($)
            </label>
            <input
              id="priceMin"
              name="priceMin"
              defaultValue={priceMin}
              inputMode="decimal"
              className="mt-2 w-28 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.26em] text-zinc-500" htmlFor="priceMax">
              Max ($)
            </label>
            <input
              id="priceMax"
              name="priceMax"
              defaultValue={priceMax}
              inputMode="decimal"
              className="mt-2 w-28 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
          >
            Apply
          </button>
        </form>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-zinc-950 text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            checked={inStockOnly}
            onChange={(e) => update({ inStock: e.target.checked ? "1" : undefined })}
          />
          In stock only
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          <span className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Sort</span>
          <select
            value={activeSort}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
