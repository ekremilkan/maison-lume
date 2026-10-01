import { categories, products, SIZE_ORDER } from "@/data/products";
import type { Category, CategorySlug, Product, ProductColor, PriceRangeId, ProductFilters, SortOption } from "./types";

/*
 * Data-access layer. Every page reads products through these functions,
 * which are async on purpose: swap the bodies for `fetch()` calls or SQL
 * queries (e.g. Prisma / Drizzle on PostgreSQL) without touching the UI.
 */

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return sortProducts(products, "newest").slice(0, limit);
}

/** IDs of the most recently added products, used for "New" badges. */
export async function getNewArrivalIds(limit = 5): Promise<string[]> {
  return (await getNewArrivals(limit)).map((p) => p.id);
}

/** Same category first, then other products, excluding the current one. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const others = products.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category && p.featured);
  return [...sameCategory, ...rest].slice(0, limit);
}

// ---------------------------------------------------------------------------
// Pure helpers (shared by server pages and client filtering)
// ---------------------------------------------------------------------------

export const PRICE_RANGES: Record<PriceRangeId, [min: number, max: number]> = {
  "under-100": [0, 9999],
  "100-200": [10000, 19999],
  "200-300": [20000, 29999],
  "over-300": [30000, Infinity],
};

export function isCategorySlug(value: string | null | undefined): value is CategorySlug {
  return categories.some((c) => c.slug === value);
}

export function filterProducts(list: Product[], filters: ProductFilters): Product[] {
  return list.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.sizes?.length && !p.sizes.some((s) => filters.sizes!.includes(s))) return false;
    if (filters.colors?.length && !p.colors.some((c) => filters.colors!.includes(c.id))) return false;
    if (filters.price) {
      const [min, max] = PRICE_RANGES[filters.price];
      if (p.price < min || p.price > max) return false;
    }
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/** Sizes and colours that actually occur in a product list, for filter UIs. */
export function getFacets(list: Product[]): { sizes: string[]; colors: ProductColor[] } {
  const sizes = new Set(list.flatMap((p) => p.sizes));
  const colors = new Map(list.flatMap((p) => p.colors).map((c) => [c.id, c]));
  return {
    sizes: SIZE_ORDER.filter((s) => sizes.has(s)),
    colors: [...colors.values()],
  };
}
