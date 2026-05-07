import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { AppShell } from "@/components/layout/AppShell";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Northcraft Goods — curated desk & home essentials",
    template: "%s · Northcraft Goods",
  },
  description:
    "Northcraft Goods — Postgres-backed ecommerce showcase with optimistic carts and graceful checkout collisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
