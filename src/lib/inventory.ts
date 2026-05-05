import type { Product, ProductVariant } from "@prisma/client";

export function effectiveStock(product: Product & { variants: ProductVariant[] }): number {
  if (product.hasVariants && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  return product.stock;
}

export function lineAvailableStock(
  product: Product & { variants: ProductVariant[] },
  variantId: number | null,
): number {
  if (product.hasVariants && product.variants.length > 0) {
    if (variantId == null) return 0;
    const v = product.variants.find((x) => x.id === variantId);
    return v?.stock ?? 0;
  }
  return product.stock;
}

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
