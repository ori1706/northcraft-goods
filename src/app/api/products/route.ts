import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { fetchProducts } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const priceMinRaw = Number(searchParams.get("priceMin") ?? "");
  const priceMaxRaw = Number(searchParams.get("priceMax") ?? "");

  const priceMin =
    Number.isFinite(priceMinRaw) && priceMinRaw > 0 ? Math.round(priceMinRaw * 100) : undefined;
  const priceMax =
    Number.isFinite(priceMaxRaw) && priceMaxRaw > 0 ? Math.round(priceMaxRaw * 100) : undefined;

  const products = await fetchProducts({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    priceMin,
    priceMax,
    inStockOnly: searchParams.get("inStock") === "1" || searchParams.get("inStock") === "true",
  });

  return NextResponse.json({ products });
}
