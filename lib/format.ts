import type { Locale } from "./types";

const formatters: Partial<Record<Locale, Intl.NumberFormat>> = {};

/** Formats integer cents as EUR, e.g. 18900 → "€189.00" / "189,00 €". */
export function formatPrice(cents: number, locale: Locale): string {
  formatters[locale] ??= new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-IE", {
    style: "currency",
    currency: "EUR",
  });
  return formatters[locale].format(cents / 100);
}

/** Replaces {placeholders} in a dictionary string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
