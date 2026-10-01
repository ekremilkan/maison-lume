"use client";

import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import { SITE } from "@/lib/site";

export function DemoBanner() {
  const { t } = useLocale();
  return (
    <p className="bg-charcoal px-4 py-2 text-center text-[11px] tracking-wide text-sand">
      {interpolate(t.common.demoNotice, { studio: SITE.studioName })}
    </p>
  );
}
