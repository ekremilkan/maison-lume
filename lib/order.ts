import { SHIPPING } from "./site";
import type { CartItem } from "./types";

export type ShippingMethod = "standard" | "express";

export const VAT_RATE = 0.19;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  total: number;
  /** VAT contained in the gross total (German prices include VAT). */
  vat: number;
}

export function shippingCost(subtotal: number, method: ShippingMethod): number {
  if (method === "express") return SHIPPING.express;
  return subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.standard;
}

export function calculateTotals(items: CartItem[], method: ShippingMethod = "standard"): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = shippingCost(subtotal, method);
  const total = subtotal + shipping;
  return { subtotal, shipping, total, vat: Math.round(total - total / (1 + VAT_RATE)) };
}
