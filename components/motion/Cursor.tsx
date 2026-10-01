"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/context/LocaleContext";

/*
 * A small label that follows the pointer over elements marked with
 * data-cursor="view | zoom | drag". Desktop (fine pointer) only; purely
 * decorative, so it is hidden from assistive technology.
 */
export function Cursor() {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const labels = useRef(t.cursor);
  useEffect(() => {
    labels.current = t.cursor;
  }, [t.cursor]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const label = el.querySelector("span")!;
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0,
      active = false;

    function loop() {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el!.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
    }

    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const kind = target?.dataset.cursor as keyof typeof labels.current | undefined;
      if (kind && kind in labels.current) {
        label.textContent = labels.current[kind];
        if (!active) {
          // Jump to the pointer when appearing, then ease from there.
          cx = x;
          cy = y;
        }
        active = true;
        el!.dataset.active = "true";
      } else if (active) {
        active = false;
        el!.dataset.active = "false";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function onLeave() {
      active = false;
      el!.dataset.active = "false";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-active="false"
      className="pointer-events-none fixed top-0 left-0 z-[80] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div className="grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 scale-0 place-items-center rounded-full bg-charcoal/90 text-ivory backdrop-blur-sm transition-transform duration-500 ease-soft [[data-active=true]_&]:scale-100">
        <span className="eyebrow text-[10px]" />
      </div>
    </div>
  );
}
