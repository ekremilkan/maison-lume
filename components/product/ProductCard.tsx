"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, ViewTransition } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { flyToCart } from "@/lib/fly-to-cart";
import { interpolate } from "@/lib/format";
import type { Product } from "@/lib/types";
import { CheckIcon } from "@/components/ui/Icons";

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  priority?: boolean;
  sizes?: string;
}

/** Shared-element name so the card image morphs into the product page. */
export const productTransitionName = (slug: string) => `product-${slug}`;

export function ProductCard({
  product,
  isNew = false,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: ProductCardProps) {
  const { t, l, price, sizeLabel } = useLocale();
  const { addItem } = useCart();
  const media = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const [primary, hover] = product.images;
  const onSale = product.compareAtPrice !== undefined && product.compareAtPrice > product.price;

  function quickAdd(size: string) {
    addItem(product, product.colors[0], size, 1);
    flyToCart(media.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="group relative has-[a:focus-visible]:outline has-[a:focus-visible]:outline-1 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-charcoal">
      <div ref={media} className="relative aspect-[4/5] overflow-hidden bg-linen" data-cursor="view">
        <ViewTransition name={productTransitionName(product.slug)} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={primary.src}
              alt={interpolate(t.product.imageAlt, { name: product.name, color: l(product.colors[0].name), view: l(primary.view) })}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover transition-transform duration-[1.4s] ease-soft group-hover:scale-[1.06]"
            />
            {hover && (
              <Image
                src={hover.src}
                alt=""
                fill
                sizes={sizes}
                className="scale-[1.06] object-cover opacity-0 transition-[opacity,scale] duration-[900ms] ease-soft group-hover:scale-100 group-hover:opacity-100"
              />
            )}
          </div>
        </ViewTransition>

        {(onSale || isNew) && (
          <span className="eyebrow absolute top-3 left-3 bg-ivory/90 px-2 py-1 text-[10px]">
            {onSale ? t.product.sale : t.product.new}
          </span>
        )}

        {/* Quick add — devices with hover only; phones use the product page. */}
        <div
          data-cursor="none"
          className="absolute inset-x-2 bottom-2 z-10 hidden translate-y-[calc(100%+0.75rem)] bg-ivory/95 p-3 backdrop-blur-md transition-transform duration-500 ease-soft group-focus-within:translate-y-0 group-hover:translate-y-0 [@media(hover:hover)]:block"
        >
          {added ? (
            <p role="status" className="flex h-[3.25rem] items-center justify-center gap-2 text-sm">
              <CheckIcon width={16} height={16} className="text-success" /> {t.product.addedShort}
            </p>
          ) : (
            <>
              <p className="eyebrow mb-2 text-center text-[10px] text-taupe">{t.product.quickAdd}</p>
              <div className="flex flex-wrap justify-center gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => quickAdd(size)}
                    aria-label={`${t.product.quickAdd}: ${product.name}, ${sizeLabel(size)}`}
                    className="h-8 min-w-8 border border-transparent px-2 text-xs transition-colors hover:border-charcoal"
                  >
                    {sizeLabel(size)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <h3 className="font-serif text-[1.05rem] leading-snug sm:text-xl">
          {/* Stretched link: the whole card is clickable, with one tab stop. */}
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-sm">
        <p className="tabular-nums">
          {onSale && (
            <>
              <span className="sr-only">{t.product.sale}: </span>
              <s className="mr-2 text-taupe">{price(product.compareAtPrice!)}</s>
            </>
          )}
          <span className={onSale ? "text-clay" : ""}>{price(product.price)}</span>
        </p>
        {product.colors.length > 1 && (
          <ul className="flex gap-1" aria-label={interpolate(t.product.colorsAvailable, { count: product.colors.length })}>
            {product.colors.map((c) => (
              <li key={c.id} title={l(c.name)} className="h-2.5 w-2.5 rounded-full ring-1 ring-charcoal/15" style={{ backgroundColor: c.hex }}>
                <span className="sr-only">{l(c.name)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
