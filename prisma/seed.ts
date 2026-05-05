import { PrismaClient } from "@prisma/client";
import { hydrateSeedProducts } from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartSession.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  const rows = hydrateSeedProducts();

  for (const row of rows) {
    const { variants, ...product } = row;
    await prisma.product.create({
      data: {
        ...product,
        variants:
          variants && variants.length
            ? {
                create: variants.map((v) => ({
                  label: v.label,
                  stock: v.stock,
                })),
              }
            : undefined,
      },
    });
  }

  console.log(`Seeded ${rows.length} Northcraft Goods products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
