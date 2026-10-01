/*
 * "Fly to bag" micro-interaction: a copy of the product image travels along
 * a curve into the bag icon, which then gives a small bounce.
 * The target is re-measured every frame, so it works while the header moves.
 */
export const CART_BUTTON_ID = "cart-button";
export const SHOW_HEADER_EVENT = "maison-lume:show-header";

export function flyToCart(source: Element | null | undefined): Promise<void> {
  const img = source instanceof HTMLImageElement ? source : source?.querySelector("img");
  const target = document.getElementById(CART_BUTTON_ID);
  window.dispatchEvent(new Event(SHOW_HEADER_EVENT));

  const bump = () =>
    target?.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], {
      duration: 450,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });

  if (!img || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bump();
    return Promise.resolve();
  }

  const start = img.getBoundingClientRect();
  const clone = img.cloneNode() as HTMLImageElement;
  clone.removeAttribute("srcset");
  clone.src = img.currentSrc || img.src;
  Object.assign(clone.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: `${start.width}px`,
    height: `${start.height}px`,
    objectFit: "cover",
    zIndex: "90",
    pointerEvents: "none",
    margin: "0",
    boxShadow: "0 20px 40px rgba(38,35,31,.18)",
    willChange: "transform, opacity, border-radius",
  });
  document.body.appendChild(clone);

  const duration = 850;
  const t0 = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  return new Promise((resolve) => {
    function frame(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const e = ease(p);
      const end = target!.getBoundingClientRect();
      const sx = start.left + start.width / 2;
      const sy = start.top + start.height / 2;
      const ex = end.left + end.width / 2;
      const ey = end.top + end.height / 2;
      // Quadratic Bézier with the control point lifted above the path.
      const cx = (sx + ex) / 2;
      const cy = Math.min(sy, ey) - 140;
      const x = (1 - e) ** 2 * sx + 2 * (1 - e) * e * cx + e ** 2 * ex;
      const y = (1 - e) ** 2 * sy + 2 * (1 - e) * e * cy + e ** 2 * ey;
      const scale = 1 - e * (1 - 28 / start.width);
      clone.style.transform = `translate3d(${x - start.width / 2}px, ${y - start.height / 2}px, 0) scale(${scale})`;
      clone.style.borderRadius = `${e * 50}%`;
      clone.style.opacity = String(1 - Math.max(0, e - 0.85) / 0.15);
      if (p < 1) requestAnimationFrame(frame);
      else {
        clone.remove();
        bump();
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}
