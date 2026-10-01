"use client";

import { useLocale } from "@/context/LocaleContext";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-charcoal focus:px-4 focus:py-3 focus:text-sm focus:text-ivory"
    >
      {t.common.skipToContent}
    </a>
  );
}
