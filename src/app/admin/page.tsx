import { AdminConsole } from "./AdminConsole";
import { LoginForm } from "./LoginForm";
import { isAdmin } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const authorized = await isAdmin();

  if (!authorized) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <LoginForm />
      </div>
    );
  }

  const [products, orders] = await Promise.all([
    prisma.product.findMany({
      orderBy: { id: "asc" },
      include: { variants: true },
    }),
    prisma.order.findMany({
      orderBy: { id: "desc" },
      take: 40,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    }),
  ]);

  return (
    <AdminConsole
      products={JSON.parse(JSON.stringify(products))}
      orders={JSON.parse(JSON.stringify(orders))}
    />
  );
}
