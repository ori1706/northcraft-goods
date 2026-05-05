import type { CartLine } from "./cart-types";

export const GUEST_COOKIE = "nc_guest";
export const ADMIN_COOKIE = "nc_admin_token";

export function parseCartItemsJson(raw: string | null | undefined): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const items: CartLine[] = [];
    for (const row of parsed) {
      if (
        row &&
        typeof row === "object" &&
        "productId" in row &&
        "quantity" in row &&
        typeof (row as CartLine).productId === "number" &&
        typeof (row as CartLine).quantity === "number"
      ) {
        const variantId =
          "variantId" in row && typeof (row as CartLine).variantId === "number"
            ? (row as CartLine).variantId
            : null;
        items.push({
          productId: (row as CartLine).productId,
          variantId,
          quantity: Math.floor((row as CartLine).quantity),
        });
      }
    }
    return items.filter((i) => i.quantity > 0);
  } catch {
    return [];
  }
}

export function serializeCartItems(items: CartLine[]): string {
  return JSON.stringify(items);
}
