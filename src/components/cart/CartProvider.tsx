"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { CartLine } from "@/lib/cart-types";
import { mergeCartLines, normalizeCartLines } from "@/lib/cart-types";
import type { EnrichedCartItem } from "@/lib/cart-server";

type CartResponse = {
  sessionId: string;
  lines: CartLine[];
  items: EnrichedCartItem[];
  subtotalCents: number;
};

type CartContextValue = {
  lines: CartLine[];
  items: EnrichedCartItem[];
  subtotalCents: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  syncing: boolean;
  refreshFromServer: () => Promise<void>;
  replaceLines: (next: CartLine[]) => Promise<void>;
  addLine: (line: CartLine, opts?: { toastMessage?: string }) => Promise<void>;
  setQty: (key: string, qty: number) => Promise<void>;
  removeLine: (key: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "northcraft_cart_lines_v1";

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
  return normalizeCartLines(lines);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [items, setItems] = useState<EnrichedCartItem[]>([]);
  const [subtotalCents, setSubtotalCents] = useState(0);
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const persistLocal = useCallback((next: CartLine[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const applyPayload = useCallback((payload: CartResponse) => {
    setLines(normalizeCartLines(payload.lines));
    setItems(payload.items);
    setSubtotalCents(payload.subtotalCents);
  }, []);

  const postCart = useCallback(
    async (nextLines: CartLine[]) => {
      setSyncing(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: nextLines }),
        });
        const payload = (await res.json()) as CartResponse;
        applyPayload(payload);
      } finally {
        setSyncing(false);
      }
    },
    [applyPayload],
  );

  const flush = useCallback(
    async (nextLines: CartLine[]) => {
      const normalized = normalizeCartLines(nextLines);
      setLines(normalized);
      persistLocal(normalized);
      await postCart(normalized);
    },
    [persistLocal, postCart],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const local = parsePosted(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
        const res = await fetch("/api/cart", { credentials: "include" });
        const payload = (await res.json()) as CartResponse;
        if (cancelled) return;
        const merged = normalizeCartLines(mergeCartLines(payload.lines, local));
        persistLocal(merged);
        await postCart(merged);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [persistLocal, postCart]);

  const refreshFromServer = useCallback(async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    const payload = (await res.json()) as CartResponse;
    applyPayload(payload);
    persistLocal(normalizeCartLines(payload.lines));
  }, [applyPayload, persistLocal]);

  const replaceLines = useCallback(
    async (next: CartLine[]) => {
      await flush(next);
    },
    [flush],
  );

  const addLine = useCallback(
    async (line: CartLine, opts?: { toastMessage?: string }) => {
      const normalized = normalizeCartLines([...lines, line]);
      toast.success(opts?.toastMessage ?? "Added to cart");
      await flush(normalized);
    },
    [flush, lines],
  );

  const setQty = useCallback(
    async (key: string, qty: number) => {
      const map = new Map(lines.map((l) => [`${l.productId}:${l.variantId ?? "none"}`, l]));
      const existing = map.get(key);
      if (!existing) return;
      const nextQty = Math.max(0, Math.floor(qty));
      if (nextQty === 0) map.delete(key);
      else map.set(key, { ...existing, quantity: nextQty });
      const normalized = normalizeCartLines([...map.values()]);
      await flush(normalized);
    },
    [flush, lines],
  );

  const removeLine = useCallback(
    async (key: string) => {
      const normalized = normalizeCartLines(lines.filter((l) => `${l.productId}:${l.variantId ?? "none"}` !== key));
      await flush(normalized);
    },
    [flush, lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      subtotalCents,
      open,
      setOpen,
      syncing: syncing || !hydrated,
      refreshFromServer,
      replaceLines,
      addLine,
      setQty,
      removeLine,
    }),
    [
      addLine,
      hydrated,
      items,
      lines,
      open,
      refreshFromServer,
      removeLine,
      replaceLines,
      setQty,
      subtotalCents,
      syncing,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartThumb({ src, alt }: { src: string; alt: string }) {
  if (!src) return <div className="h-14 w-14 rounded-xl bg-zinc-800" />;
  return (
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/10"
    />
  );
}
