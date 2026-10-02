/*
 * next/image loader for Unsplash (imgix). Unsplash's CDN does the resizing:
 * we only swap in the width/quality Next asks for. Crop parameters already in
 * the URL (ar, fit, crop, fp-*) are kept, so aspect ratios stay correct.
 * Swap this out when moving product images to your own CDN.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}
