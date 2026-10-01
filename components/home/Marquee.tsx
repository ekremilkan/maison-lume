"use client";

import { useLocale } from "@/context/LocaleContext";

/** Endless ribbon of brand promises; pauses on hover. */
export function Marquee() {
  const { t } = useLocale();
  const items = [...t.home.marquee, ...t.home.marquee];

  return (
    <section aria-label={t.home.marquee.join(", ")} className="group overflow-hidden border-y border-sand py-5 sm:py-7">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden="true" className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <li key={`${copy}-${i}`} className="flex items-center font-serif text-2xl whitespace-nowrap italic sm:text-4xl">
                <span className="px-6 sm:px-10">{item}</span>
                <span className="text-sm text-clay not-italic">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
