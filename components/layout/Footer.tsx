"use client";

import Link from "next/link";
import { useConsent } from "@/context/ConsentContext";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import { SITE } from "@/lib/site";
import type { Category } from "@/lib/types";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { LanguageToggle } from "./LanguageToggle";

const WORDMARK = "Maison Lume";

export function Footer({ categories }: { categories: Category[] }) {
  const { t, l } = useLocale();
  const { openSettings } = useConsent();

  return (
    <footer className="relative mt-28 overflow-hidden bg-charcoal text-sand sm:mt-40">
      <div className="mx-auto max-w-[1440px] px-4 pt-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div data-reveal="up">
            <p className="max-w-xs font-serif text-3xl leading-tight text-ivory">{t.footer.tagline}</p>
            <address className="mt-8 text-sm leading-relaxed text-stone not-italic">
              {SITE.address.street}
              <br />
              {SITE.address.city}
              <br />
              <a href={`mailto:${SITE.email}`} className="link-underline text-sand">
                {SITE.email}
              </a>
            </address>
          </div>

          <FooterColumn title={t.footer.shop} delay={80}>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="link-underline">
                  {l(c.name)}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t.footer.house} delay={160}>
            <li>
              <Link href="/about" className="link-underline">{t.nav.about}</Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline">{t.nav.contact}</Link>
            </li>
          </FooterColumn>

          <FooterColumn title={t.footer.help} delay={240}>
            <li>
              <Link href="/contact" className="link-underline">{t.footer.shippingReturns}</Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline">{t.footer.sizeAdvice}</Link>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/15 pt-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>
            {interpolate(t.footer.rights, { year: new Date().getFullYear() })} · {t.footer.payment}
          </p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={openSettings} className="link-underline min-h-11 text-sand">
              {t.cookies.settings}
            </button>
            <LanguageToggle tone="dark" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="eyebrow group flex min-h-11 items-center gap-2 text-sand"
            >
              {t.footer.backToTop}
              <ArrowRightIcon width={14} height={14} className="-rotate-90 transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-stone">{interpolate(t.common.demoNotice, { studio: SITE.studioName })}</p>
      </div>

      {/* Oversized wordmark, rising letter by letter */}
      <p
        aria-hidden="true"
        className="mt-10 flex justify-center font-serif text-[16.5vw] leading-[0.78] tracking-[-0.03em] whitespace-nowrap text-ivory/90 select-none"
      >
        {[...WORDMARK].map((ch, i) => (
          <span key={i} data-reveal="mask" className="inline-block pb-[0.06em]" style={{ "--d": `${i * 45}ms` } as React.CSSProperties}>
            <span>{ch === " " ? " " : ch}</span>
          </span>
        ))}
      </p>
    </footer>
  );
}

function FooterColumn({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <div data-reveal="up" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <h2 className="eyebrow font-sans text-stone">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
