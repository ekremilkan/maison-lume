"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { SHIPPING } from "@/lib/site";
import { createPersistedStore, hydratedStore } from "@/lib/storage";
import type { CartItem, Product, ProductColor } from "@/lib/types";

export const MAX_QUANTITY = 10;

const EMPTY: CartItem[] = [];

const cartStore = createPersistedStore<CartItem[]>("maison-lume:cart", EMPTY, (v): v is CartItem[] =>
  Array.isArray(v) && v.every((i) => typeof i?.key === "string" && typeof i?.quantity === "number"),
);

interface CartContextValue {
  items: CartItem[];
  /** False until the cart has been read from localStorage on the client. */
  hydrated: boolean;
  count: number;
  subtotal: number;
  /** Cents still needed to reach free shipping (0 once reached). */
  freeShippingRemaining: number;
  addItem: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServer);
  const hydrated = useSyncExternalStore(...hydratedStore);
  const [isOpen, setIsOpen] = useState(false);

  // Close the drawer when the route changes (e.g. browser back).
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setIsOpen(false);
  }

  const addItem = useCallback<CartContextValue["addItem"]>((product, color, size, quantity) => {
    const key = `${product.id}:${color.id}:${size}`;
    const current = cartStore.get();
    const existing = current.find((i) => i.key === key);
    if (existing) {
      cartStore.set(
        current.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) } : i)),
      );
    } else {
      // Snapshot the display data so the cart survives catalogue changes.
      const line: CartItem = {
        key,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0].src,
        color,
        size,
        quantity: Math.min(quantity, MAX_QUANTITY),
      };
      cartStore.set([...current, line]);
    }
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    const current = cartStore.get();
    if (quantity < 1) {
      cartStore.set(current.filter((i) => i.key !== key));
      return;
    }
    cartStore.set(current.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) } : i)));
  }, []);

  const removeItem = useCallback((key: string) => {
    cartStore.set(cartStore.get().filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => cartStore.set(EMPTY), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      hydrated,
      count,
      subtotal,
      freeShippingRemaining: Math.max(SHIPPING.freeThreshold - subtotal, 0),
      addItem,
      updateQuantity,
      removeItem,
      clear,
      isOpen,
      openCart,
      closeCart,
    };
  }, [items, hydrated, isOpen, addItem, updateQuantity, removeItem, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
