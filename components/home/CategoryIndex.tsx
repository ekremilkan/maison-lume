"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import type { Category, CategorySlug } from "@/lib/types";
import { ArrowRightIcon } from "@/components/ui/Icons";

/** Editorial index: big category names, with a live image preview on desktop. */
export function CategoryIndex({ categories, counts }: { categories: Category[]; counts: Record<CategorySlug, number> }) {
  const { t, l } = useLocale();
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="categories-title" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 id="categories-title" className="text-5xl sm:text-6xl" data-reveal="up">
            {t.home.categoriesTitle}
          </h2>
          <p className="mt-4 max-w-md text-taupe" data-reveal="up" style={{ "--d": "100ms" } as React.CSSProperties}>
            {t.home.categoriesText}
          </p>

          <ul className="mt-12 border-t border-sand">
            {categories.map((c, i) => (
              <li key={c.slug} className="border-b border-sand" data-reveal="up" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-4 py-5 sm:gap-6 sm:py-7"
                >
                  <span className="w-7 shrink-0 font-sans text-xs text-taupe">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-linen lg:hidden">
                    <Image src={c.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span
                    className={`font-serif text-4xl leading-none transition-[translate,color] duration-500 ease-soft group-hover:translate-x-3 sm:text-6xl lg:text-7xl ${active === i ? "lg:text-charcoal lg:italic" : "lg:text-taupe"}`}
                  >
                    {l(c.name)}
                    <sup className="ml-2 align-super font-sans text-xs not-italic text-taupe">({counts[c.slug]})</sup>
                  </span>
                  <ArrowRightIcon
                    width={22}
                    height={22}
                    className="ml-auto shrink-0 -translate-x-3 opacity-0 transition-all duration-500 ease-soft group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:col-span-5 lg:block lg:self-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-linen" data-reveal="clip">
            {categories.map((c, i) => (
              <Image
                key={c.slug}
                src={c.image}
                alt=""
                fill
                sizes="40vw"
                className={`object-cover transition-[opacity,scale] duration-[900ms] ease-soft ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
              />
            ))}
            <p className="absolute bottom-5 left-5 bg-ivory/90 px-3 py-1.5 font-serif text-lg italic" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} — {l(categories[active].name)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
