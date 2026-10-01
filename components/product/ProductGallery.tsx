"use client";

import Image from "next/image";
import { useRef, useState, ViewTransition } from "react";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import type { ProductImage } from "@/lib/types";
import { ArrowLeftIcon, ArrowRightIcon, ExpandIcon } from "@/components/ui/Icons";
import { Lightbox } from "./Lightbox";

interface ProductGalleryProps {
  images: ProductImage[];
  altFor: (image: ProductImage) => string;
  /** Shared-element name matching the product card, for the page morph. */
  transitionName: string;
}

/**
 * One swipeable, snap-scrolling carousel for every screen size. On desktop
 * it is sized to the viewport height so the whole photo is always visible,
 * with thumbnails, arrows and a full-screen zoom viewer.
 */
export function ProductGallery({ images, altFor, transitionName }: ProductGalleryProps) {
  const { t } = useLocale();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = scroller.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  function go(index: number) {
    const el = scroller.current;
    const next = Math.min(Math.max(index, 0), images.length - 1);
    el?.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  const counter = `${String(active + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;

  return (
    <section aria-label={t.product.gallery} className="lg:flex lg:justify-center lg:gap-5">
      {/* Thumbnails (desktop) */}
      <ul className="hidden w-[72px] shrink-0 flex-col gap-3 lg:flex">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={interpolate(t.product.showImage, { index: i + 1, total: images.length })}
              aria-current={active === i}
              className={`relative block aspect-[4/5] w-full overflow-hidden bg-linen transition-all duration-300 ${active === i ? "opacity-100 ring-1 ring-charcoal ring-offset-2 ring-offset-ivory" : "opacity-55 hover:opacity-100"}`}
            >
              <Image src={image.src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
        <div className="relative aspect-[4/5] w-full bg-linen lg:h-[min(calc(100svh-12rem),860px)] lg:w-auto lg:max-w-full">
          <div
            ref={scroller}
            onScroll={onScroll}
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          >
            {images.map((image, i) => {
              const img = (
                <Image
                  src={image.src}
                  alt={altFor(image)}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              );
              return (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setLightbox(i)}
                  data-cursor="zoom"
                  aria-label={`${t.product.openZoom} (${i + 1}/${images.length})`}
                  className="relative h-full w-full shrink-0 snap-center"
                  {...(i === 0 ? { "data-product-hero": "" } : {})}
                >
                  {i === 0 ? (
                    <ViewTransition name={transitionName} share="morph" default="none">
                      <div className="absolute inset-0">{img}</div>
                    </ViewTransition>
                  ) : (
                    img
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <p className="pointer-events-none absolute bottom-4 left-4 bg-ivory/85 px-2.5 py-1 text-xs tabular-nums backdrop-blur-sm" aria-hidden="true">
            {counter}
          </p>
          <button
            type="button"
            onClick={() => setLightbox(active)}
            aria-label={t.product.openZoom}
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-ivory/85 backdrop-blur-sm transition-colors hover:bg-charcoal hover:text-ivory"
          >
            <ExpandIcon width={18} height={18} />
          </button>
          <div className="absolute right-4 bottom-4 hidden gap-2 lg:flex">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label={t.product.previous}
              className="grid h-11 w-11 place-items-center rounded-full bg-ivory/85 backdrop-blur-sm transition-colors hover:bg-charcoal hover:text-ivory disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowLeftIcon width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === images.length - 1}
              aria-label={t.product.next}
              className="grid h-11 w-11 place-items-center rounded-full bg-ivory/85 backdrop-blur-sm transition-colors hover:bg-charcoal hover:text-ivory disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowRightIcon width={18} height={18} />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-1 lg:hidden">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => go(i)}
                aria-label={interpolate(t.product.showImage, { index: i + 1, total: images.length })}
                aria-current={active === i}
                className="grid h-6 w-6 place-items-center"
              >
                <span className={`block h-[3px] rounded-full bg-charcoal transition-all duration-300 ${active === i ? "w-5 opacity-90" : "w-1.5 opacity-30"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox images={images} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} altFor={altFor} />
      )}
    </section>
  );
}
