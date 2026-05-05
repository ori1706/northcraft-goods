export type CartLine = {
  productId: number;
  variantId: number | null;
  quantity: number;
};

export function cartLineKey(line: Pick<CartLine, "productId" | "variantId">): string {
  return `${line.productId}:${line.variantId ?? "none"}`;
}

export function mergeCartLines(a: CartLine[], b: CartLine[]): CartLine[] {
  const map = new Map<string, CartLine>();
  for (const src of [...a, ...b]) {
    const key = cartLineKey(src);
    const prev = map.get(key);
    const qty = Math.max(prev?.quantity ?? 0, src.quantity);
    map.set(key, { productId: src.productId, variantId: src.variantId, quantity: qty });
  }
  return [...map.values()].filter((l) => l.quantity > 0);
}

export function normalizeCartLines(lines: CartLine[]): CartLine[] {
  const map = new Map<string, CartLine>();
  for (const src of lines) {
    const key = cartLineKey(src);
    const prev = map.get(key);
    const qty = (prev?.quantity ?? 0) + src.quantity;
    map.set(key, { productId: src.productId, variantId: src.variantId, quantity: qty });
  }
  return [...map.values()].filter((l) => l.quantity > 0);
}
