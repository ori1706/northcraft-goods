import { CartDrawer } from "@/components/cart/CartDrawer";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-50">
      <SiteHeader />
      <main className="relative flex-1">{children}</main>
      <SiteFooter />

      {/* Drawer mounts inside shell (avoid viewport-fixed overflow) */}
      <CartDrawer />
    </div>
  );
}
