"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import { formatPrice } from "@/lib/format";
import { createPersistedStore } from "@/lib/storage";
import { LOCALES, type Locale, type Localized } from "@/lib/types";

const localeStore = createPersistedStore<Locale>("maison-lume:locale", "en", (v): v is Locale =>
  LOCALES.includes(v as Locale),
);

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  /** Picks the current locale from a localized data field. */
  l: <T>(value: Localized<T>) => T;
  price: (cents: number) => string;
  /** Translates the "One size" sentinel; other sizes are universal. */
  sizeLabel: (size: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(localeStore.subscribe, localeStore.get, localeStore.getServer);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => localeStore.set(next), []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      l: (v) => v[locale],
      price: (cents) => formatPrice(cents, locale),
      sizeLabel: (size) => (size === "One size" ? dictionaries[locale].product.oneSize : size),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
