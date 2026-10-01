"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import type { OrderTotals } from "@/lib/order";
import type { CartItem } from "@/lib/types";
import { CheckIcon } from "@/components/ui/Icons";
import { OrderSummary } from "./OrderSummary";
import { Stepper } from "./Stepper";

export interface CompletedOrder {
  id: string;
  email: string;
  firstName: string;
  address: string[];
  items: CartItem[];
  totals: OrderTotals;
}

interface ConfirmationProps {
  order: CompletedOrder;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}

export function Confirmation({ order, headingRef }: ConfirmationProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <Stepper current={3} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="animate-fade-up">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-success text-ivory" aria-hidden="true">
            <CheckIcon width={26} height={26} strokeWidth={1.5} />
          </span>
          <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-4xl outline-none sm:text-6xl">
            {interpolate(t.checkout.confirmationTitle, { name: order.firstName })}
          </h1>
          <p className="mt-5 max-w-lg leading-relaxed text-taupe">
            {interpolate(t.checkout.confirmationText, { email: order.email })}
          </p>

          <dl className="mt-10 grid gap-8 border-t border-sand pt-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-taupe">{t.checkout.orderNumber}</dt>
              <dd className="mt-2 font-serif text-2xl">{order.id}</dd>
            </div>
            <div>
              <dt className="eyebrow text-taupe">{t.checkout.deliveryTo}</dt>
              <dd className="mt-2 text-sm leading-relaxed">
                {order.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <Link href="/shop" className="btn btn-primary mt-12">
            {t.cart.continueShopping}
          </Link>
        </div>

        <aside>
          <OrderSummary items={order.items} totals={order.totals} />
        </aside>
      </div>
    </div>
  );
}
