"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { SITE } from "@/lib/site";
import { email as validateEmail, required } from "@/lib/validation";
import { Field } from "@/components/checkout/Field";
import { CheckIcon } from "@/components/ui/Icons";

type Topic = "general" | "order" | "styling" | "press";

export function ContactView({ image }: { image: string }) {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", topic: "general" as Topic, message: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nameError = required(form.name);
    const emailError = validateEmail(form.email);
    const next = {
      name: nameError && t.checkout.errors[nameError],
      email: emailError && t.checkout.errors[emailError],
      message: form.message.trim().length < 10 ? t.contact.messageTooShort : undefined,
    };
    const invalid = Object.entries(next).filter(([, e]) => e);
    setErrors(next);
    if (invalid.length > 0) {
      document.getElementById(`field-${invalid[0][0]}`)?.focus();
      return;
    }
    // UI only: send to an API route / form service here.
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 sm:pt-16 lg:px-10">
      <header className="stagger max-w-3xl">
        <p className="eyebrow text-taupe">{t.contact.eyebrow}</p>
        <h1 className="mt-4 text-6xl leading-[0.98] tracking-[-0.02em] sm:text-8xl">{t.contact.title}</h1>
        <p className="mt-6 leading-relaxed text-taupe">{t.contact.intro}</p>
      </header>

      <div className="mt-14 grid gap-16 lg:grid-cols-[3fr_2fr] lg:gap-24">
        <section aria-labelledby="contact-form-title" data-reveal="up">
          <h2 id="contact-form-title" className="text-3xl">
            {t.contact.reach}
          </h2>
          {sent ? (
            <p role="status" className="mt-8 flex items-start gap-3 bg-linen p-6 text-sm leading-relaxed">
              <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-success" />
              {t.contact.sent}
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="name" autoComplete="name" label={t.contact.name} value={form.name} onChange={(v) => update("name", v)} error={errors.name} />
                <Field name="email" type="email" autoComplete="email" label={t.contact.email} value={form.email} onChange={(v) => update("email", v)} error={errors.email} />
              </div>
              <div>
                <label htmlFor="field-topic" className="mb-1.5 block text-[13px]">
                  {t.contact.topic}
                </label>
                <select id="field-topic" value={form.topic} onChange={(e) => update("topic", e.target.value as Topic)} className="field cursor-pointer">
                  {(Object.keys(t.contact.topics) as Topic[]).map((key) => (
                    <option key={key} value={key}>
                      {t.contact.topics[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="field-message" className="mb-1.5 block text-[13px]">
                  {t.contact.message}
                </label>
                <textarea
                  id="field-message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "field-message-error" : undefined}
                  required
                  className="field resize-y"
                />
                {errors.message && (
                  <p id="field-message-error" className="mt-1.5 text-[13px] text-error">
                    {errors.message}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                {t.contact.send}
              </button>
            </form>
          )}
        </section>

        <aside className="space-y-10">
          <div className="relative hidden aspect-[4/5] overflow-hidden lg:block" data-reveal="clip">
            <Image src={image} alt="" fill sizes="35vw" className="object-cover" />
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <section>
              <h2 className="eyebrow font-sans">{t.contact.visit}</h2>
              <address className="mt-4 text-sm leading-relaxed text-taupe not-italic">
                Maison Lume
                <br />
                {SITE.address.street}
                <br />
                {SITE.address.city}
                <br />
                <a href={`mailto:${SITE.email}`} className="link-underline mt-3 inline-block text-charcoal">
                  {SITE.email}
                </a>
                <br />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="link-underline text-charcoal">
                  {SITE.phone}
                </a>
              </address>
            </section>
            <section>
              <h2 className="eyebrow font-sans">{t.contact.hours}</h2>
              <ul className="mt-4 space-y-1 text-sm text-taupe">
                {t.contact.hoursText.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
