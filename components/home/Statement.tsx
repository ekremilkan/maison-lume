"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/context/LocaleContext";

/** A large statement whose words "ink in" one by one as you scroll past. */
export function Statement() {
  const { t } = useLocale();
  const ref = useRef<HTMLParagraphElement>(null);
  const words = t.home.statement.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLElement>("[data-word]")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    let frame = 0;
    function update() {
      frame = 0;
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.85 - rect.top) / (rect.height + vh * 0.3), 0), 1);
      const n = spans.length;
      spans.forEach((s, i) => {
        const local = Math.min(Math.max(progress * (n + 4) - i, 0), 1);
        s.style.opacity = String(0.14 + local * 0.86);
      });
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [t.home.statement]);

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-8 flex items-center gap-3 text-taupe" data-reveal="up">
          <span className="h-px w-8 bg-taupe" aria-hidden="true" />
          {t.home.statementEyebrow}
        </p>
        <p ref={ref} className="font-serif text-[clamp(2.1rem,5.4vw,4.75rem)] leading-[1.08] tracking-[-0.015em]">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} data-word className="transition-opacity duration-300">
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
