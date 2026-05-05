import type { Product, ProductVariant } from "@prisma/client";

import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Array<Product & { variants: ProductVariant[] }> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
