"use client";

import { useId, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { email as validateEmail } from "@/lib/validation";
import { CheckIcon } from "@/components/ui/Icons";

export function Newsletter() {
  const { t } = useLocale();
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const key = validateEmail(value);
    if (key) {
      setError(t.checkout.errors[key]);
      return;
    }
    // UI only: hook up your email provider (Brevo, Mailchimp, …) here.
    setError(undefined);
    setDone(true);
  }

  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl text-center" data-reveal="up">
        <h2 id={`${id}-title`} className="text-5xl sm:text-7xl">
          {t.home.newsletterTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-taupe">{t.home.newsletterText}</p>

        {done ? (
          <p role="status" className="mt-10 inline-flex items-center gap-2 text-sm text-success">
            <CheckIcon width={18} height={18} /> {t.home.newsletterSuccess}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-md text-left">
            <label htmlFor={`${id}-email`} className="sr-only">
              {t.home.newsletterLabel}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={t.home.newsletterPlaceholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : `${id}-hint`}
                className="field sm:border-r-0"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                {t.home.newsletterButton}
              </button>
            </div>
            {error ? (
              <p id={`${id}-error`} className="mt-2 text-sm text-error">
                {error}
              </p>
            ) : (
              <p id={`${id}-hint`} className="mt-3 text-center text-xs text-taupe">
                {t.home.newsletterConsent}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
