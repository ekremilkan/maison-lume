"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/context/LocaleContext";
import type { ProductImage } from "@/lib/types";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";

interface LightboxProps {
  images: ProductImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  altFor: (image: ProductImage) => string;
}

const ZOOM = 2.4;

/**
 * Full-screen image viewer: the whole photo fits the screen; click/tap to
 * zoom in, then move the pointer (or finger) to pan. Arrow keys switch
 * images, Escape closes. Rendered into <body> via a portal.
 */
export function Lightbox({ images, index, onIndex, onClose, altFor }: LightboxProps) {
  const { t } = useLocale();
  const [zoomed, setZoomed] = useState(false);
  const [visible, setVisible] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const go = (next: number) => {
    setZoomed(false);
    onIndex((next + images.length) % images.length);
  };

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      setVisible(true);
      closeButton.current?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
      previous?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "Tab") {
        // Keep focus inside the viewer.
        const focusable = [...(stage.current?.closest("[role=dialog]")?.querySelectorAll<HTMLElement>("button") ?? [])];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function setOrigin(clientX: number, clientY: number) {
    const rect = stage.current?.getBoundingClientRect();
    if (!rect || !layer.current) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    layer.current.style.transformOrigin = `${x}% ${y}%`;
  }

  const image = images[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.product.gallery}
      className={`fixed inset-0 z-[95] flex flex-col bg-ivory transition-opacity duration-400 ease-soft ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm tabular-nums text-taupe" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
        <p className="hidden text-xs text-taupe sm:block">{t.product.zoomHint}</p>
        <button ref={closeButton} type="button" onClick={onClose} aria-label={t.product.closeZoom} className="-mr-2 grid h-11 w-11 place-items-center">
          <CloseIcon />
        </button>
      </div>

      <div
        ref={stage}
        className={`relative flex-1 touch-none overflow-hidden ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onClick={(e) => {
          setOrigin(e.clientX, e.clientY);
          setZoomed((z) => !z);
        }}
        onPointerMove={(e) => zoomed && setOrigin(e.clientX, e.clientY)}
      >
        <div
          ref={layer}
          className="absolute inset-0 transition-transform duration-500 ease-soft"
          style={{ transform: `scale(${zoomed ? ZOOM : 1})` }}
        >
          <Image key={image.src} src={image.src} alt={altFor(image)} fill sizes="100vw" quality={75} className="animate-fade-up object-contain" />
        </div>

        {images.length > 1 && !zoomed && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(index - 1);
              }}
              aria-label={t.product.previous}
              className="absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 shadow-sm transition-colors hover:bg-charcoal hover:text-ivory sm:left-6"
            >
              <ArrowLeftIcon width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(index + 1);
              }}
              aria-label={t.product.next}
              className="absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 shadow-sm transition-colors hover:bg-charcoal hover:text-ivory sm:right-6"
            >
              <ArrowRightIcon width={18} height={18} />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-2 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`${i + 1} / ${images.length}`}
            aria-current={i === index}
            className={`relative h-16 w-12 overflow-hidden transition-opacity ${i === index ? "opacity-100 ring-1 ring-charcoal ring-offset-2 ring-offset-ivory" : "opacity-50 hover:opacity-100"}`}
          >
            <Image src={img.src} alt="" fill sizes="48px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
