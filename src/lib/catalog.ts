import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { effectiveStock } from "@/lib/inventory";

export type CatalogFilters = {
  q?: string;
  category?: string;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
};

const sortModes = ["featured", "price-asc", "price-desc", "newest"] as const;

export async function fetchProducts(filters: CatalogFilters) {
  const sortParam = filters.sort ?? "featured";
  const sort = (sortModes.includes(sortParam as (typeof sortModes)[number])
    ? sortParam
    : "featured") as (typeof sortModes)[number];

  const clauses: Prisma.ProductWhereInput[] = [{ archived: false }];
  if (filters.category) clauses.push({ category: filters.category });
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    clauses.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (typeof filters.priceMin === "number" && filters.priceMin > 0) {
    clauses.push({ priceCents: { gte: filters.priceMin } });
  }
  if (typeof filters.priceMax === "number" && filters.priceMax > 0) {
    clauses.push({ priceCents: { lte: filters.priceMax } });
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ featured: "desc" }, { createdAt: "desc" }];
  if (sort === "price-asc") orderBy = [{ priceCents: "asc" }];
  else if (sort === "price-desc") orderBy = [{ priceCents: "desc" }];
  else if (sort === "newest") orderBy = [{ createdAt: "desc" }];

  let products = await prisma.product.findMany({
    where: { AND: clauses },
    include: { variants: true },
    orderBy,
  });

  if (filters.inStockOnly) {
    products = products.filter((p) => effectiveStock(p) > 0);
  }

  return products;
}
