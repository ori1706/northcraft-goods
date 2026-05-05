import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product/ProductDetail";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, archived: false },
    include: { variants: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, archived: false, NOT: { id: product.id } },
    include: { variants: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return <ProductDetail product={product} related={related} />;
}
