"use client";

import { useLocale } from "@/context/LocaleContext";
import { LOCALES } from "@/lib/types";

export function LanguageToggle({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div role="group" aria-label={t.common.language} className={`flex items-center text-xs tracking-[0.15em] ${className}`}>
      {LOCALES.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span className="px-1 text-stone" aria-hidden="true">/</span>}
          <button
            type="button"
            lang={code}
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            aria-label={code === "en" ? "English" : "Deutsch"}
            className={`min-h-11 px-1 uppercase transition-colors ${
              tone === "dark"
                ? locale === code
                  ? "text-ivory underline underline-offset-4"
                  : "text-stone hover:text-ivory"
                : locale === code
                  ? "text-charcoal underline underline-offset-4"
                  : "text-taupe hover:text-charcoal"
            }`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
