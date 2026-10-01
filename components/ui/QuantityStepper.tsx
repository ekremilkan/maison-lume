"use client";

import { useLocale } from "@/context/LocaleContext";
import { MAX_QUANTITY } from "@/context/CartContext";
import { MinusIcon, PlusIcon } from "./Icons";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Allow going to 0 (used in the cart to remove a line). */
  min?: number;
  size?: "sm" | "md";
  label?: string;
}

export function QuantityStepper({ value, onChange, min = 1, size = "md", label }: QuantityStepperProps) {
  const { t } = useLocale();
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";

  return (
    <div role="group" aria-label={label ?? t.product.quantity} className="inline-flex items-center border border-stone">
      <button
        type="button"
        className={`${box} grid place-items-center text-charcoal transition-colors hover:bg-linen disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t.product.decrease}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <output aria-live="polite" className={`${size === "sm" ? "w-7 text-sm" : "w-10"} text-center tabular-nums`}>
        {value}
      </output>
      <button
        type="button"
        className={`${box} grid place-items-center text-charcoal transition-colors hover:bg-linen disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={t.product.increase}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
