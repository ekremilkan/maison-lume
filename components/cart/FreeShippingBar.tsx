"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import { SHIPPING } from "@/lib/site";

export function FreeShippingBar() {
  const { subtotal, freeShippingRemaining } = useCart();
  const { t, price } = useLocale();
  const progress = Math.min(subtotal / SHIPPING.freeThreshold, 1);
  const reached = freeShippingRemaining === 0;

  return (
    <div>
      <p className="mb-2.5 text-sm" aria-live="polite">
        {reached
          ? t.cart.freeShippingReached
          : interpolate(t.cart.freeShippingRemaining, { amount: price(freeShippingRemaining) })}
      </p>
      <div className="h-[3px] w-full overflow-hidden bg-sand" aria-hidden="true">
        <div
          className={`h-full origin-left transition-transform duration-700 ease-soft ${reached ? "bg-success" : "bg-clay"}`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
