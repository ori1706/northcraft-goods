"use server";

import { createHash, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { ADMIN_COOKIE } from "@/lib/cart-json";
import { createAdminToken, verifyAdminToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function adminCookieOpts() {
  const prod = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

function hashSecret(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function adminLogin(password: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return { ok: false as const, message: "Server missing ADMIN_PASSWORD." };
  }
  const a = Buffer.from(hashSecret(password), "hex");
  const b = Buffer.from(hashSecret(secret), "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false as const, message: "Invalid password." };
  }
  const token = await createAdminToken(secret);
  (await cookies()).set(ADMIN_COOKIE, token, adminCookieOpts());
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

export async function isAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(secret, token);
}

async function guard() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}

export async function adminBumpStock(productId: number, delta: number) {
  await guard();
  await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: delta } },
  });
  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function adminSetPrice(productId: number, priceCents: number) {
  await guard();
  if (!Number.isFinite(priceCents) || priceCents < 0) throw new Error("Invalid price");
  await prisma.product.update({
    where: { id: productId },
    data: { priceCents: Math.round(priceCents) },
  });
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function adminArchive(productId: number, archived: boolean) {
  await guard();
  await prisma.product.update({ where: { id: productId }, data: { archived } });
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function adminCreateProduct(formData: FormData) {
  await guard();
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const priceUsd = Number(formData.get("priceUsd") ?? "");
  const stock = Number(formData.get("stock") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (name.length < 2 || description.length < 8 || category.length < 2) {
    throw new Error("Fill name, description, and category.");
  }
  if (!Number.isFinite(priceUsd) || priceUsd <= 0 || !Number.isFinite(stock) || stock < 0) {
    throw new Error("Price and stock must be valid numbers.");
  }

  const slug =
    slugRaw ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const images =
    imageUrl.length > 4 ? [imageUrl] : ["https://images.unsplash.com/photo-1498049860656-af28884c997d?auto=format&fit=crop&w=900&q=80"];

  await prisma.product.create({
    data: {
      slug,
      name,
      description,
      category,
      priceCents: Math.round(priceUsd * 100),
      stock: Math.floor(stock),
      images,
      archived: false,
      featured: false,
      hasVariants: false,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function adminSetStatus(orderId: number, status: "PLACED" | "SHIPPED" | "CANCELLED") {
  await guard();
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin");
}
