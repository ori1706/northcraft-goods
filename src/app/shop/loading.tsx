export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
      <div className="mt-6 h-14 w-2/3 max-w-xl animate-pulse rounded-2xl bg-white/10" />
      <div className="mt-8 h-48 w-full animate-pulse rounded-3xl bg-white/10" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-white/10">
            <div className="aspect-[4/5] animate-pulse bg-white/10" />
            <div className="space-y-3 px-5 py-5">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
