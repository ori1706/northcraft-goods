import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { GUEST_COOKIE } from "@/lib/cart-json";
import { normalizeCartLines, type CartLine } from "@/lib/cart-types";
import { enrichCartLines, persistCart, readCartLines } from "@/lib/cart-server";
import { guestCookieOptions } from "@/lib/guest-session";

export async function GET() {
  const jar = await cookies();
  let sid = jar.get(GUEST_COOKIE)?.value;
  const created = !sid;
  if (!sid) sid = uuidv4();

  const serverLines = await readCartLines(sid);
  const enriched = await enrichCartLines(serverLines);

  const res = NextResponse.json({
    sessionId: sid,
    lines: serverLines,
    ...enriched,
  });

  if (created) {
    res.cookies.set(GUEST_COOKIE, sid, guestCookieOptions());
  }
  return res;
}

export async function POST(req: NextRequest) {
  const jar = await cookies();
  let sid = jar.get(GUEST_COOKIE)?.value;
  const created = !sid;
  if (!sid) sid = uuidv4();

  const body = (await req.json()) as { items?: unknown };
  const posted = normalizeCartLines(parsePosted(body.items));
  await persistCart(sid, posted);
  const enriched = await enrichCartLines(posted);

  const res = NextResponse.json({ sessionId: sid, lines: posted, ...enriched });
  if (created) res.cookies.set(GUEST_COOKIE, sid, guestCookieOptions());
  return res;
}

export async function PATCH(req: NextRequest) {
  const jar = await cookies();
  let sid = jar.get(GUEST_COOKIE)?.value;
  const created = !sid;
  if (!sid) sid = uuidv4();

  const body = (await req.json()) as { items?: unknown };
  const posted = normalizeCartLines(parsePosted(body.items));
  const existing = await readCartLines(sid);
  const merged = normalizeCartLines([...existing, ...posted]);
  await persistCart(sid, merged);
  const enriched = await enrichCartLines(merged);

  const res = NextResponse.json({ sessionId: sid, lines: merged, ...enriched });
  if (created) res.cookies.set(GUEST_COOKIE, sid, guestCookieOptions());
  return res;
}

function parsePosted(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const lines: CartLine[] = [];
  for (const row of raw) {
    if (
      row &&
      typeof row === "object" &&
      typeof (row as CartLine).productId === "number" &&
      typeof (row as CartLine).quantity === "number"
    ) {
      const variantId =
        "variantId" in row && typeof (row as CartLine).variantId === "number"
          ? (row as CartLine).variantId
          : null;
      lines.push({
        productId: (row as CartLine).productId,
        variantId,
        quantity: Math.floor((row as CartLine).quantity),
      });
    }
  }
  return lines.filter((l) => l.quantity > 0);
}
