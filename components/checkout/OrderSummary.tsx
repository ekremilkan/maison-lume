"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import type { OrderTotals } from "@/lib/order";
import type { CartItem } from "@/lib/types";
import { ChevronDownIcon } from "@/components/ui/Icons";

interface OrderSummaryProps {
  items: CartItem[];
  totals: OrderTotals;
  /** Mobile: hide the details behind a toggle that shows the total. */
  collapsible?: boolean;
}

export function OrderSummary({ items, totals, collapsible = false }: OrderSummaryProps) {
  const { t, l, price, sizeLabel } = useLocale();
  const [open, setOpen] = useState(!collapsible);
  const id = useId();

  const details = (
    <>
      <ul className="divide-y divide-sand">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 bg-linen">
              <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-taupe px-1 text-[10px] text-ivory">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-lg leading-tight">{item.name}</p>
              <p className="text-[13px] text-taupe">
                {l(item.color.name)} · {sizeLabel(item.size)}
                <span className="sr-only">, {t.product.quantity}: {item.quantity}</span>
              </p>
            </div>
            <p className="text-sm tabular-nums">{price(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-2 border-t border-sand pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-taupe">{t.checkout.subtotal}</dt>
          <dd className="tabular-nums">{price(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-taupe">{t.checkout.shipping}</dt>
          <dd className="tabular-nums">{totals.shipping === 0 ? t.checkout.free : price(totals.shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-sand pt-3">
          <dt className="eyebrow">{t.checkout.total}</dt>
          <dd className="text-xl tabular-nums">{price(totals.total)}</dd>
        </div>
        <p className="text-right text-xs text-taupe">{interpolate(t.checkout.vatIncluded, { amount: price(totals.vat) })}</p>
      </dl>
    </>
  );

  if (!collapsible) {
    return (
      <section aria-labelledby={`${id}-title`} className="bg-linen p-6">
        <h2 id={`${id}-title`} className="text-2xl">
          {t.checkout.summary}
        </h2>
        <div className="mt-2">{details}</div>
      </section>
    );
  }

  return (
    <section className="-mx-4 border-y border-sand bg-linen px-4 sm:-mx-6 sm:px-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-details`}
        className="flex w-full items-center justify-between py-4 text-sm"
      >
        <span className="flex items-center gap-2">
          {open ? t.checkout.hideSummary : t.checkout.showSummary}
          <ChevronDownIcon width={16} height={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="text-base tabular-nums">{price(totals.total)}</span>
      </button>
      <div id={`${id}-details`} hidden={!open} className="pb-5">
        {details}
      </div>
    </section>
  );
}
