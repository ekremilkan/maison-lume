"use client";

import { useLocale } from "@/context/LocaleContext";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function NewArrivals({ products }: { products: Product[] }) {
  const { t } = useLocale();

  return (
    <section aria-labelledby="new-title" className="mx-auto max-w-[1440px] sm:px-6 lg:px-10">
      <div className="px-4 sm:px-0">
        <SectionHeading id="new-title" title={t.home.newArrivalsTitle} link={{ href: "/shop", label: t.home.viewAll }} />
      </div>
      {/* Swipeable row on phones, regular grid from tablet up */}
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map((p, i) => (
          <li
            key={p.id}
            className="w-[68%] shrink-0 snap-start sm:w-auto"
            data-reveal="up"
            style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
          >
            <ProductCard product={p} isNew sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 68vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
