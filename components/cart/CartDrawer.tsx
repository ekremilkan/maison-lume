"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import { Drawer } from "@/components/ui/Drawer";
import { CloseIcon } from "@/components/ui/Icons";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingBar } from "./FreeShippingBar";

export function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart } = useCart();
  const { t, price } = useLocale();

  return (
    <Drawer open={isOpen} onClose={closeCart} label={t.cart.title}>
      <header className="flex items-center justify-between border-b border-sand px-5 py-4 sm:px-8">
        <h2 className="text-2xl">
          {t.cart.title}
          {count > 0 && (
            <span className="ml-2 align-middle font-sans text-sm text-taupe">
              ({count === 1 ? t.cart.itemCountOne : interpolate(t.cart.itemCount, { count })})
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={closeCart}
          className="-mr-2 grid h-11 w-11 place-items-center"
          aria-label={t.common.close}
         
        >
          <CloseIcon />
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="font-serif text-2xl">{t.cart.empty}</p>
          <p className="mt-3 max-w-xs text-sm text-taupe">{t.cart.emptyText}</p>
          <Link href="/shop" onClick={closeCart} className="btn btn-outline mt-8">
            {t.cart.continueShopping}
          </Link>
        </div>
      ) : (
        <>
          <div className="border-b border-sand px-5 py-4 sm:px-8">
            <FreeShippingBar />
          </div>
          <ul className="flex-1 divide-y divide-sand overflow-y-auto overscroll-contain px-5 sm:px-8">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} onNavigate={closeCart} />
            ))}
          </ul>
          <footer className="border-t border-sand bg-ivory px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">{t.cart.subtotal}</span>
              <span className="text-lg tabular-nums">{price(subtotal)}</span>
            </div>
            <p className="mt-1 text-[13px] text-taupe">{t.cart.shippingNote}</p>
            <div className="mt-5 grid gap-2.5">
              <Link href="/checkout" onClick={closeCart} className="btn btn-primary w-full">
                {t.cart.checkout}
              </Link>
              <Link href="/cart" onClick={closeCart} className="btn btn-outline w-full">
                {t.cart.viewCart}
              </Link>
            </div>
          </footer>
        </>
      )}
    </Drawer>
  );
}
