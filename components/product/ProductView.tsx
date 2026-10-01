"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { flyToCart } from "@/lib/fly-to-cart";
import { interpolate } from "@/lib/format";
import type { Category, Product, ProductImage } from "@/lib/types";
import { AccordionItem } from "@/components/ui/Accordion";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { productTransitionName } from "./ProductCard";
import { ProductGrid } from "./ProductGrid";
import { ProductGallery } from "./ProductGallery";

interface ProductViewProps {
  product: Product;
  category?: Category;
  related: Product[];
}

export function ProductView({ product, category, related }: ProductViewProps) {
  const { t, l, price, sizeLabel } = useLocale();
  const { addItem, openCart } = useCart();
  const id = useId();
  const sizeGroup = useRef<HTMLFieldSetElement>(null);
  const addButton = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  const [adding, setAdding] = useState(false);

  // Mobile: show a sticky "Add to bag" bar once the main button scrolls away.
  useEffect(() => {
    const el = addButton.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [colorId, setColorId] = useState(product.colors[0].id);
  const [size, setSize] = useState<string | undefined>(product.sizes.length === 1 ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const onSale = product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
  const altFor = (image: ProductImage) =>
    interpolate(t.product.imageAlt, { name: product.name, color: l(color.name), view: l(image.view) });

  async function onAddToCart() {
    if (!size) {
      setSizeError(true);
      sizeGroup.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      sizeGroup.current?.querySelector("input")?.focus({ preventScroll: true });
      return;
    }
    if (adding) return;
    setAdding(true);
    addItem(product, color, size, quantity);
    setQuantity(1);
    await flyToCart(document.querySelector("[data-product-hero]"));
    setAdding(false);
    openCart();
  }

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <nav aria-label={t.common.breadcrumb} className="hidden py-6 text-[13px] text-taupe lg:block">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="link-underline">{t.common.home}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="link-underline">{t.nav.shop}</Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/shop?category=${category.slug}`} className="link-underline">{l(category.name)}</Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-16 xl:gap-24">
          <ProductGallery images={product.images} altFor={altFor} transitionName={productTransitionName(product.slug)} />

          <div className="lg:sticky lg:top-[calc(var(--header-offset,5rem)+1.5rem)] lg:self-start lg:transition-[top] lg:duration-500 stagger">
            {category && <p className="eyebrow text-taupe">{l(category.name)}</p>}
            <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg tabular-nums">
              {onSale && (
                <>
                  <span className="sr-only">{t.product.sale}: </span>
                  <s className="mr-3 text-taupe">{price(product.compareAtPrice!)}</s>
                </>
              )}
              <span className={onSale ? "text-clay" : ""}>{price(product.price)}</span>
            </p>
            <p className="mt-1 text-xs text-taupe">{t.product.taxNote}</p>

            <p className="mt-6 leading-relaxed text-taupe">{l(product.description)}</p>

            {/* Colour */}
            <fieldset className="mt-8">
              <legend className="text-sm">
                <span className="eyebrow">{t.product.color}</span>
                <span className="ml-2 text-taupe">{l(color.name)}</span>
              </legend>
              <div className="mt-3 flex gap-3">
                {product.colors.map((c) => (
                  <div key={c.id}>
                    <input
                      id={`${id}-color-${c.id}`}
                      type="radio"
                      name={`${id}-color`}
                      value={c.id}
                      checked={c.id === colorId}
                      onChange={() => setColorId(c.id)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`${id}-color-${c.id}`}
                      title={l(c.name)}
                      className="block h-9 w-9 cursor-pointer rounded-full ring-1 ring-charcoal/15 ring-offset-[3px] ring-offset-ivory transition-shadow peer-checked:ring-charcoal peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-charcoal hover:ring-charcoal/50"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="sr-only">{l(c.name)}</span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Size */}
            <fieldset
              ref={sizeGroup}
              className="mt-8"
              aria-invalid={sizeError || undefined}
              aria-describedby={sizeError ? `${id}-size-error` : undefined}
            >
              <legend className="eyebrow">{t.product.size}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <div key={s}>
                    <input
                      id={`${id}-size-${s}`}
                      type="radio"
                      name={`${id}-size`}
                      value={s}
                      checked={s === size}
                      onChange={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`${id}-size-${s}`}
                      className={`grid h-12 min-w-12 cursor-pointer place-items-center border px-4 text-sm transition-colors peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-charcoal hover:border-charcoal ${sizeError ? "border-error" : "border-stone"}`}
                    >
                      {sizeLabel(s)}
                    </label>
                  </div>
                ))}
              </div>
              {sizeError && (
                <p id={`${id}-size-error`} role="alert" className="mt-3 text-sm text-error">
                  {t.product.selectSizeError}
                </p>
              )}
            </fieldset>

            {/* Quantity + add to bag */}
            <div ref={addButton} className="mt-8 flex gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <button type="button" onClick={onAddToCart} className="btn btn-primary flex-1" aria-busy={adding}>
                {size ? t.product.addToCart : t.product.selectSize}
              </button>
            </div>

            <div className="mt-10 border-t border-sand">
              <AccordionItem title={t.product.details} defaultOpen>
                <ul className="list-disc space-y-1.5 pl-5 marker:text-stone">
                  {l(product.details).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title={`${t.product.material} & ${t.product.care}`}>
                <p className="text-charcoal">{l(product.material)}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-stone">
                  {l(product.care).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title={t.product.shipping}>
                <p>{t.product.shippingText}</p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto mt-24 max-w-[1440px] px-4 sm:mt-36 sm:px-6 lg:px-10">
          <SectionHeading id="related-title" title={t.product.youMayAlsoLike} />
          <ProductGrid products={related} />
        </section>
      )}

      {/* Sticky add-to-bag bar for phones */}
      <div
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 ease-soft lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-linen">
            <Image src={product.images[0].src} alt="" fill sizes="44px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg leading-tight">{product.name}</p>
            <p className="text-sm tabular-nums text-taupe">
              {price(product.price)}
              {size && ` · ${sizeLabel(size)}`}
            </p>
          </div>
          <button type="button" onClick={onAddToCart} className="btn btn-primary min-h-11 shrink-0 px-5">
            {size ? t.product.addToCart : t.product.selectSize}
          </button>
        </div>
      </div>
    </>
  );
}
