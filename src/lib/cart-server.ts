import { prisma } from "./prisma";
import { cartLineKey, type CartLine } from "./cart-types";
import { parseCartItemsJson, serializeCartItems } from "./cart-json";
import { lineAvailableStock } from "./inventory";

export type EnrichedCartItem = {
  key: string;
  productId: number;
  variantId: number | null;
  quantity: number;
  name: string;
  slug: string;
  image: string;
  priceCents: number;
  lineTotalCents: number;
  availableStock: number;
  warning?: string;
};

export async function persistCart(sessionId: string, items: CartLine[]) {
  const cleaned = items
    .filter((i) => i.quantity > 0)
    .map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      quantity: Math.min(Math.floor(i.quantity), 999),
    }));

  await prisma.cartSession.upsert({
    where: { id: sessionId },
    create: { id: sessionId, itemsJson: serializeCartItems(cleaned) },
    update: { itemsJson: serializeCartItems(cleaned) },
  });
}

export async function enrichCartLines(lines: CartLine[]): Promise<{
  items: EnrichedCartItem[];
  subtotalCents: number;
}> {
  const normalized = mergeQuantities(lines);
  if (normalized.length === 0) return { items: [], subtotalCents: 0 };

  const productIds = [...new Set(normalized.map((l) => l.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, archived: false },
    include: { variants: true },
  });
  const map = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const items: EnrichedCartItem[] = [];

  for (const line of normalized) {
    const product = map.get(line.productId);
    if (!product) {
      items.push({
        key: cartLineKey(line),
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity,
        name: "Unavailable item",
        slug: "",
        image: "",
        priceCents: 0,
        lineTotalCents: 0,
        availableStock: 0,
        warning: "This item is no longer available.",
      });
      continue;
    }

    const available = lineAvailableStock(product, line.variantId);
    const qty = line.quantity;
    let warning: string | undefined;

    const payableQty = available <= 0 ? 0 : Math.min(qty, available);
    const contributes = product.priceCents * payableQty;
    subtotal += contributes;

    if (available <= 0) {
      warning = "Out of stock — remove or revisit later.";
    } else if (qty > available) {
      warning = `Only ${available} left — checkout will cap quantity.`;
    }

    const variantLabel =
      line.variantId != null
        ? product.variants.find((v) => v.id === line.variantId)?.label
        : undefined;

    items.push({
      key: cartLineKey(line),
      productId: product.id,
      variantId: line.variantId,
      quantity: line.quantity,
      name: variantLabel ? `${product.name} · ${variantLabel}` : product.name,
      slug: product.slug,
      image: product.images[0] ?? "",
      priceCents: product.priceCents,
      lineTotalCents: contributes,
      availableStock: available,
      warning,
    });
  }

  return { items, subtotalCents: subtotal };
}

function mergeQuantities(lines: CartLine[]): CartLine[] {
  const map = new Map<string, CartLine>();
  for (const line of lines) {
    const key = cartLineKey(line);
    const prev = map.get(key);
    const qty = (prev?.quantity ?? 0) + line.quantity;
    map.set(key, { ...line, quantity: qty });
  }
  return [...map.values()].filter((l) => l.quantity > 0);
}

export async function readCartLines(sessionId: string): Promise<CartLine[]> {
  const session = await prisma.cartSession.findUnique({ where: { id: sessionId } });
  return parseCartItemsJson(session?.itemsJson);
}
