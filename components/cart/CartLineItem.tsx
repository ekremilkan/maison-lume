"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import type { CartItem } from "@/lib/types";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

interface CartLineItemProps {
  item: CartItem;
  onNavigate?: () => void;
  size?: "compact" | "full";
}

export function CartLineItem({ item, onNavigate, size = "compact" }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { t, l, price, sizeLabel } = useLocale();
  const full = size === "full";

  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      <Link
        href={`/product/${item.slug}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden bg-linen ${full ? "h-36 w-28 sm:h-44 sm:w-36" : "h-28 w-[5.5rem]"}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image src={item.image} alt="" fill sizes={full ? "144px" : "88px"} className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              onClick={onNavigate}
              className={`link-underline font-serif leading-snug ${full ? "text-xl" : "text-lg"}`}
            >
              {item.name}
            </Link>
            <p className="mt-1 text-[13px] text-taupe">
              {l(item.color.name)} · {sizeLabel(item.size)}
            </p>
          </div>
          <p className="shrink-0 text-sm tabular-nums">{price(item.price * item.quantity)}</p>
        </div>

        {full && item.quantity > 1 && (
          <p className="mt-1 text-[13px] text-taupe">
            {price(item.price)} {t.cart.each}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onChange={(q) => updateQuantity(item.key, q)}
            label={`${t.product.quantity}: ${item.name}`}
          />
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            className="link-underline text-[13px] text-taupe hover:text-charcoal"
            aria-label={interpolate(t.cart.removeItem, { name: item.name })}
          >
            {t.cart.remove}
          </button>
        </div>
      </div>
    </li>
  );
}
