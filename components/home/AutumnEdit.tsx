"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useLocale } from "@/context/LocaleContext";
import { interpolate } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRightIcon } from "@/components/ui/Icons";

/*
 * The section pins to the viewport and vertical scrolling moves the row
 * sideways — on phones and desktops alike. With reduced motion (and before
 * hydration) it falls back to a native swipeable row with the same markup.
 */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const useScrollPinning = () =>
  useSyncExternalStore(
    subscribeReduced,
    () => !window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
export function AutumnEdit({ products, image }: { products: Product[]; image: string }) {
  const { t } = useLocale();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pinned = useScrollPinning();

  useEffect(() => {
    const el = section.current;
    const row = track.current;
    if (!el || !row || !pinned) return;
    let distance = 0;
    let frame = 0;

    function update() {
      frame = 0;
      if (!distance) return;
      const progress = Math.min(Math.max(-el!.getBoundingClientRect().top / distance, 0), 1);
      row!.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    }
    function measure() {
      distance = Math.max(row!.scrollWidth - window.innerWidth, 0);
      // Use the pinned stage's height (svh), which stays stable while mobile
      // browser toolbars show and hide.
      const stageHeight = stage.current?.offsetHeight ?? window.innerHeight;
      el!.style.height = `${distance + stageHeight}px`;
      update();
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      el.style.height = "";
      row.style.transform = "";
    };
  }, [pinned]);

  return (
    <section ref={section} aria-labelledby="edit-title" className="relative bg-linen">
      <div ref={stage} className={pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : "py-20"}>
        <div
          ref={track}
          className={`flex items-center gap-5 px-5 sm:gap-6 sm:px-6 lg:gap-12 lg:px-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] ${
            pinned ? "will-change-transform" : "no-scrollbar snap-x snap-mandatory overflow-x-auto scroll-px-5"
          }`}
        >
          <div className="w-[82vw] shrink-0 snap-start pr-2 sm:w-[24rem] lg:w-[30rem] lg:pr-8">
            <p className="eyebrow text-taupe" data-reveal="up">
              {t.home.featuredEyebrow} · {interpolate(t.home.editCount, { count: products.length })}
            </p>
            <h2 id="edit-title" className="mt-4 text-[3.25rem] leading-[0.95] sm:text-7xl lg:text-[7.5rem]">
              {t.home.featuredTitle.split(" ").map((word, i) => (
                <span key={word} data-reveal="mask" className="mr-[0.2em] inline-block" style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                  <span className={i === 1 ? "text-clay italic" : ""}>{word}</span>
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-taupe" data-reveal="up" style={{ "--d": "150ms" } as React.CSSProperties}>
              {t.home.featuredText}
            </p>
            <Link href="/shop?collection=autumn-edit" className="btn btn-outline mt-8">
              {t.home.featuredCta}
            </Link>
            <div className={`mt-10 items-center gap-4 lg:mt-12 ${pinned ? "flex" : "hidden"}`} aria-hidden="true">
              <span className="relative h-px w-24 bg-stone sm:w-40">
                <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-charcoal" />
              </span>
              <span className="eyebrow text-taupe">{t.home.editHint}</span>
            </div>
          </div>

          {products.map((p, i) => (
            <div key={p.id} className={`w-[68vw] shrink-0 snap-start sm:w-[20rem] lg:w-[22rem] ${i % 2 ? "lg:translate-y-14" : "lg:-translate-y-8"}`}>
              <p className="mb-3 flex items-baseline justify-between font-serif text-clay italic">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-sans text-[11px] not-italic text-taupe">/ {String(products.length).padStart(2, "0")}</span>
              </p>
              <ProductCard product={p} sizes="(min-width: 1024px) 22rem, 68vw" />
            </div>
          ))}

          <Link
            href="/shop?collection=autumn-edit"
            data-cursor="view"
            className="group relative block aspect-[4/5] w-[82vw] shrink-0 snap-start overflow-hidden bg-charcoal sm:w-[24rem] lg:w-[32rem]"
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 32rem, 82vw"
              className="object-cover opacity-80 transition-transform duration-[1.6s] ease-soft group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-ivory sm:p-8">
              <span className="font-serif text-3xl leading-tight sm:text-4xl">{t.home.editEnd}</span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ivory/60 transition-colors duration-300 group-hover:bg-ivory group-hover:text-charcoal">
                <ArrowRightIcon width={18} height={18} />
              </span>
            </span>
          </Link>
          <span className="w-px shrink-0 lg:w-4" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
