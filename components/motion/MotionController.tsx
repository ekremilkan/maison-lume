"use client";

import { useEffect } from "react";

/*
 * One global controller for scroll-driven motion, so server components can
 * opt in with plain data attributes:
 *
 *   data-reveal="up | fade | clip | mask"   animate in when scrolled into view
 *   style={{ "--d": "120ms" }}              optional stagger delay
 *   data-parallax="0.12"                    drift vertically while scrolling
 *
 * New elements (route changes, filtered grids) are picked up automatically.
 */
export function MotionController() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Reveals ---------------------------------------------------------
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    function inViewTransition() {
      try {
        return document.documentElement.matches(":active-view-transition");
      } catch {
        return false;
      }
    }

    function track(root: ParentNode) {
      const nodes = root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
      // During a page transition, show on-screen content immediately so the
      // browser snapshots it fully visible (otherwise morphs fade to nothing).
      const instant = reduced || inViewTransition();
      nodes.forEach((el) => {
        if (instant && el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
        else reveal.observe(el);
      });
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => parallaxItems.add(el));
    }

    // --- Parallax --------------------------------------------------------
    const parallaxItems = new Set<HTMLElement>();
    let frame = 0;
    function updateParallax() {
      frame = 0;
      const vh = window.innerHeight;
      parallaxItems.forEach((el) => {
        if (!el.isConnected) {
          parallaxItems.delete(el);
          return;
        }
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = Number(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    }

    track(document);
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]:not(.is-in), [data-parallax]")) track(node.parentElement ?? document);
          else track(node);
        });
      }
      onScroll();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }

    return () => {
      reveal.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
