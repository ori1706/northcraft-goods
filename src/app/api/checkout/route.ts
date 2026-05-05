import { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { GUEST_COOKIE, parseCartItemsJson } from "@/lib/cart-json";
import { prisma } from "@/lib/prisma";
import { lineAvailableStock } from "@/lib/inventory";

type CheckoutBody = {
  email?: string;
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const sid = jar.get(GUEST_COOKIE)?.value;
  if (!sid) {
    return NextResponse.json({ ok: false as const, message: "Missing cart session cookie." }, { status: 400 });
  }

  const body = (await req.json()) as CheckoutBody;
  const email = String(body.email ?? "").trim();
  const name = String(body.name ?? "").trim();
  const addressLine1 = String(body.addressLine1 ?? "").trim();
  const addressLine2 = String(body.addressLine2 ?? "").trim();
  const city = String(body.city ?? "").trim();
  const postalCode = String(body.postalCode ?? "").trim();
  const country = String(body.country ?? "").trim();

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false as const, message: "Enter a valid email." }, { status: 400 });
  }
  if (name.length < 2 || addressLine1.length < 4 || city.length < 2 || postalCode.length < 3 || country.length < 2) {
    return NextResponse.json({ ok: false as const, message: "Complete all shipping fields." }, { status: 400 });
  }

  try {
    const orderId = await prisma.$transaction(
      async (tx) => {
        const session = await tx.cartSession.findUnique({ where: { id: sid } });
        const rawLines = parseCartItemsJson(session?.itemsJson);
        if (rawLines.length === 0) {
          throw new Error("EMPTY_CART");
        }

        const productIds = [...new Set(rawLines.map((l) => l.productId))];
        const products = await tx.product.findMany({
          where: { id: { in: productIds }, archived: false },
          include: { variants: true },
        });
        const pmap = new Map(products.map((p) => [p.id, p]));

        let subtotal = 0;
        const prepared: Array<{
          productId: number;
          variantId: number | null;
          quantity: number;
          unitPrice: number;
        }> = [];

        for (const line of rawLines) {
          const product = pmap.get(line.productId);
          if (!product) throw new Error("INVALID_PRODUCT");
          const avail = lineAvailableStock(product, line.variantId);
          if (avail < line.quantity) throw new Error("INSUFFICIENT_STOCK");
          if (line.quantity <= 0) continue;
          subtotal += product.priceCents * line.quantity;
          prepared.push({
            productId: product.id,
            variantId: line.variantId,
            quantity: line.quantity,
            unitPrice: product.priceCents,
          });
        }

        if (prepared.length === 0) throw new Error("EMPTY_CART");

        const order = await tx.order.create({
          data: {
            email,
            name,
            addressLine1,
            addressLine2: addressLine2 || null,
            city,
            postalCode,
            country,
            subtotalCents: subtotal,
            status: "PLACED",
            items: {
              create: prepared.map((row) => ({
                productId: row.productId,
                variantId: row.variantId,
                quantity: row.quantity,
                priceAtPurchaseCents: row.unitPrice,
              })),
            },
          },
        });

        for (const row of prepared) {
          const product = pmap.get(row.productId);
          if (!product) throw new Error("INVALID_PRODUCT");
          if (product.hasVariants && row.variantId != null) {
            await tx.productVariant.update({
              where: { id: row.variantId },
              data: { stock: { decrement: row.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: row.productId },
              data: { stock: { decrement: row.quantity } },
            });
          }
        }

        await tx.cartSession.upsert({
          where: { id: sid },
          update: { itemsJson: "[]" },
          create: { id: sid, itemsJson: "[]" },
        });

        return order.id;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return NextResponse.json({ ok: true as const, orderId });
  } catch (err) {
    const msg =
      err instanceof Error && err.message === "INSUFFICIENT_STOCK"
        ? "Inventory changed — refresh your cart."
        : err instanceof Error && err.message === "EMPTY_CART"
          ? "Your cart is empty."
          : "Unable to place order right now.";
    return NextResponse.json({ ok: false as const, message: msg }, { status: 409 });
  }
}
