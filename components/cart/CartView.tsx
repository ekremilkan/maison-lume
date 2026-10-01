"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import { calculateTotals } from "@/lib/order";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingBar } from "./FreeShippingBar";

export function CartView() {
  const { items, hydrated, count } = useCart();
  const { t, price } = useLocale();
  const totals = calculateTotals(items);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 sm:pt-16 lg:px-10">
      <h1 className="text-5xl sm:text-6xl">
        {t.cart.title}
        {hydrated && count > 0 && (
          <span className="ml-3 align-middle font-sans text-base text-taupe">
            {count === 1 ? t.cart.itemCountOne : interpolate(t.cart.itemCount, { count })}
          </span>
        )}
      </h1>

      {!hydrated ? (
        <div className="mt-12 h-64 animate-pulse bg-linen" aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl">{t.cart.empty}</p>
          <p className="mt-3 text-taupe">{t.cart.emptyText}</p>
          <Link href="/shop" className="btn btn-primary mt-8">
            {t.cart.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
          <ul className="divide-y divide-sand border-y border-sand">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} size="full" />
            ))}
          </ul>

          <aside aria-label={t.checkout.summary} className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-linen p-6">
              <FreeShippingBar />
              <dl className="mt-6 space-y-2 border-t border-stone/60 pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-taupe">{t.cart.subtotal}</dt>
                  <dd className="tabular-nums">{price(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-taupe">{t.checkout.shipping}</dt>
                  <dd className="tabular-nums">{totals.shipping === 0 ? t.checkout.free : price(totals.shipping)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-stone/60 pt-3">
                  <dt className="eyebrow">{t.checkout.total}</dt>
                  <dd className="text-xl tabular-nums">{price(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-right text-xs text-taupe">
                {interpolate(t.checkout.vatIncluded, { amount: price(totals.vat) })}
              </p>
              <Link href="/checkout" className="btn btn-primary mt-6 w-full">
                {t.cart.checkout}
              </Link>
              <Link href="/shop" className="link-underline mx-auto mt-4 block w-fit text-sm text-taupe">
                {t.cart.continueShopping}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
