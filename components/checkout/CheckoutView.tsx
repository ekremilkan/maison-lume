"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import { calculateTotals, shippingCost, type ShippingMethod } from "@/lib/order";
import { processPayment } from "@/lib/payment";
import * as v from "@/lib/validation";
import { LockIcon } from "@/components/ui/Icons";
import { Confirmation, type CompletedOrder } from "./Confirmation";
import { Field } from "./Field";
import { OrderSummary } from "./OrderSummary";
import { Stepper } from "./Stepper";

export const COUNTRIES = ["DE", "AT", "CH", "NL", "FR"] as const;
type Country = (typeof COUNTRIES)[number];

interface FormData {
  email: string;
  newsletter: boolean;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  postalCode: string;
  city: string;
  country: Country;
  phone: string;
  method: ShippingMethod;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

type FieldName = Exclude<keyof FormData, "newsletter" | "method" | "country">;
type Errors = Partial<Record<FieldName, v.ErrorKey>>;

const INITIAL: FormData = {
  email: "",
  newsletter: false,
  firstName: "",
  lastName: "",
  address: "",
  address2: "",
  postalCode: "",
  city: "",
  country: "DE",
  phone: "",
  method: "standard",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function validateStep(step: number, d: FormData): Errors {
  const errors: Errors =
    step === 0
      ? { email: v.email(d.email) }
      : step === 1
        ? {
            firstName: v.required(d.firstName),
            lastName: v.required(d.lastName),
            address: v.required(d.address),
            postalCode: v.postalCode(d.postalCode, d.country),
            city: v.required(d.city),
          }
        : {
            cardName: v.required(d.cardName),
            cardNumber: v.cardNumber(d.cardNumber),
            expiry: v.expiry(d.expiry),
            cvc: v.cvc(d.cvc),
          };
  return Object.fromEntries(Object.entries(errors).filter(([, e]) => e)) as Errors;
}

export function CheckoutView() {
  const { t, price } = useLocale();
  const { items, hydrated, clear } = useCart();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>();
  const [order, setOrder] = useState<CompletedOrder>();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const totals = calculateTotals(items, data.method);

  function goTo(next: number) {
    setErrors({});
    setPaymentError(undefined);
    setStep(next);
  }

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const err = (name: FieldName) => (errors[name] ? t.checkout.errors[errors[name]!] : undefined);

  function validate(): boolean {
    const next = validateStep(step, data);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return false;
    }
    return true;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    if (step < 2) {
      goTo(step + 1);
      return;
    }

    setProcessing(true);
    setPaymentError(undefined);
    const result = await processPayment({
      amount: totals.total,
      currency: "EUR",
      email: data.email,
      cardLast4: data.cardNumber.replace(/\s/g, "").slice(-4),
    });
    setProcessing(false);

    if (result.status === "declined") {
      setPaymentError(t.checkout.errors.declined);
      return;
    }

    setOrder({
      id: result.orderId,
      email: data.email,
      firstName: data.firstName,
      address: [
        `${data.firstName} ${data.lastName}`,
        data.address,
        data.address2,
        `${data.postalCode} ${data.city}`,
        t.checkout.countries[data.country],
      ].filter(Boolean),
      items,
      totals,
    });
    // Never keep card details around once the payment step is done.
    setData((d) => ({ ...d, cardName: "", cardNumber: "", expiry: "", cvc: "" }));
    clear();
    setStep(3);
  }

  if (!hydrated) {
    return <div className="mx-auto min-h-[60vh] max-w-6xl px-4" aria-busy="true" />;
  }

  if (order) {
    return <Confirmation order={order} headingRef={headingRef} />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">{t.checkout.title}</h1>
        <p className="mt-4 text-taupe">{t.checkout.emptyCart}</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  const stepTitle = [t.checkout.contactTitle, t.checkout.shippingTitle, t.checkout.paymentTitle][step];
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl">{t.checkout.title}</h1>
        <p className="flex items-center gap-1.5 text-xs text-taupe">
          <LockIcon width={14} height={14} /> {t.checkout.secure}
        </p>
      </div>

      <Stepper current={step} onSelect={goTo} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="lg:hidden">
          <OrderSummary items={items} totals={totals} collapsible />
        </div>

        <form onSubmit={onSubmit} noValidate className="min-w-0">
          {step > 0 && (
            <dl className="mb-8 divide-y divide-sand border border-sand text-sm">
              <ReviewRow label={t.checkout.email} value={data.email} onEdit={() => goTo(0)} />
              {step > 1 && (
                <ReviewRow
                  label={t.checkout.deliveryTo}
                  value={`${data.address}, ${data.postalCode} ${data.city}, ${t.checkout.countries[data.country]}`}
                  onEdit={() => goTo(1)}
                />
              )}
            </dl>
          )}

          <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
            {stepTitle}
          </h2>
          <p className="sr-only" aria-live="polite">
            {interpolate(t.checkout.stepOf, { current: step + 1, total: 4 })}
          </p>

          {hasErrors && (
            <p role="alert" className="mt-4 border-l-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
              {t.checkout.errors.summary}
            </p>
          )}

          <div className="mt-6 space-y-5">
            {step === 0 && (
              <>
                <Field
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  label={t.checkout.email}
                  value={data.email}
                  onChange={(val) => set("email", val)}
                  error={err("email")}
                />
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={data.newsletter}
                    onChange={(e) => set("newsletter", e.target.checked)}
                    className="h-4 w-4 accent-charcoal"
                  />
                  {t.checkout.newsletterOptIn}
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field name="firstName" autoComplete="given-name" label={t.checkout.firstName} value={data.firstName} onChange={(val) => set("firstName", val)} error={err("firstName")} />
                  <Field name="lastName" autoComplete="family-name" label={t.checkout.lastName} value={data.lastName} onChange={(val) => set("lastName", val)} error={err("lastName")} />
                </div>
                <Field name="address" autoComplete="address-line1" label={t.checkout.address} value={data.address} onChange={(val) => set("address", val)} error={err("address")} />
                <Field name="address2" autoComplete="address-line2" label={t.checkout.address2} value={data.address2} onChange={(val) => set("address2", val)} optional />
                <div className="grid grid-cols-[2fr_3fr] gap-5">
                  <Field name="postalCode" autoComplete="postal-code" label={t.checkout.postalCode} value={data.postalCode} onChange={(val) => set("postalCode", val)} error={err("postalCode")} />
                  <Field name="city" autoComplete="address-level2" label={t.checkout.city} value={data.city} onChange={(val) => set("city", val)} error={err("city")} />
                </div>
                <div>
                  <label htmlFor="field-country" className="mb-1.5 block text-[13px]">
                    {t.checkout.country}
                  </label>
                  <select
                    id="field-country"
                    autoComplete="country"
                    value={data.country}
                    onChange={(e) => set("country", e.target.value as Country)}
                    className="field cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {t.checkout.countries[c]}
                      </option>
                    ))}
                  </select>
                </div>
                <Field name="phone" type="tel" autoComplete="tel" label={t.checkout.phone} value={data.phone} onChange={(val) => set("phone", val)} optional />

                <fieldset className="pt-4">
                  <legend className="eyebrow mb-3">{t.checkout.methodTitle}</legend>
                  <div className="divide-y divide-sand border border-sand">
                    {(["standard", "express"] as const).map((method) => {
                      const cost = shippingCost(totals.subtotal, method);
                      return (
                        <label key={method} className="flex cursor-pointer items-center gap-4 p-4 has-[:checked]:bg-linen">
                          <input
                            type="radio"
                            name="method"
                            value={method}
                            checked={data.method === method}
                            onChange={() => set("method", method)}
                            className="h-4 w-4 accent-charcoal"
                          />
                          <span className="flex-1">
                            <span className="block text-sm">{t.checkout[method]}</span>
                            <span className="block text-[13px] text-taupe">{t.checkout[`${method}Time`]}</span>
                          </span>
                          <span className="text-sm tabular-nums">{cost === 0 ? t.checkout.free : price(cost)}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </>
            )}

            {step === 2 && (
              <>
                <div className="bg-linen p-4 text-[13px] leading-relaxed">
                  <p>{t.checkout.demoPaymentNote}</p>
                  <p className="mt-2 font-medium">{t.checkout.testCard}</p>
                </div>
                {/* Demo fields: replace with Stripe's <PaymentElement /> (see lib/payment.ts).
                    autoComplete is off so browsers don't offer to fill in a real card. */}
                <Field name="cardName" autoComplete="off" label={t.checkout.cardName} value={data.cardName} onChange={(val) => set("cardName", val)} error={err("cardName")} />
                <Field
                  name="cardNumber"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  label={t.checkout.cardNumber}
                  value={data.cardNumber}
                  onChange={(val) => set("cardNumber", v.formatCardNumber(val))}
                  error={err("cardNumber")}
                />
                <div className="grid grid-cols-2 gap-5">
                  <Field
                    name="expiry"
                    autoComplete="off"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    label={t.checkout.expiry}
                    value={data.expiry}
                    onChange={(val) => set("expiry", v.formatExpiry(val))}
                    error={err("expiry")}
                  />
                  <Field
                    name="cvc"
                    autoComplete="off"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="123"
                    label={t.checkout.cvc}
                    value={data.cvc}
                    onChange={(val) => set("cvc", val.replace(/\D/g, ""))}
                    error={err("cvc")}
                  />
                </div>
                {paymentError && (
                  <p role="alert" className="border-l-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
                    {paymentError}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => goTo(step - 1)} className="link-underline self-center text-sm text-taupe sm:self-auto">
                ← {t.checkout.back}
              </button>
            ) : (
              <Link href="/cart" className="link-underline self-center text-sm text-taupe sm:self-auto">
                ← {t.cart.viewCart}
              </Link>
            )}
            <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-56" disabled={processing} aria-busy={processing}>
              {processing ? t.checkout.processing : step === 2 ? interpolate(t.checkout.placeOrder, { amount: price(totals.total) }) : t.checkout.continue}
            </button>
          </div>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <OrderSummary items={items} totals={totals} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  const { t } = useLocale();
  return (
    <div className="flex items-baseline gap-4 px-4 py-3">
      <dt className="w-24 shrink-0 text-taupe">{label}</dt>
      <dd className="min-w-0 flex-1 truncate">{value}</dd>
      <dd>
        <button type="button" onClick={onEdit} className="link-underline text-[13px]">
          {t.checkout.edit}
        </button>
      </dd>
    </div>
  );
}
