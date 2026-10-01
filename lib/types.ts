export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

/** A value translated into every supported locale. */
export type Localized<T = string> = Record<Locale, T>;

export type CategorySlug = "dresses" | "knitwear" | "outerwear" | "accessories";

export interface Category {
  slug: CategorySlug;
  name: Localized;
  image: string;
}

export interface ProductColor {
  id: string;
  name: Localized;
  hex: string;
}

export interface ProductImage {
  src: string;
  /** Short description of what the shot shows, e.g. "fabric detail". */
  view: Localized;
}

/**
 * Product shape shared by the mock data and (later) the API/database layer.
 * Prices are integer cents in EUR to avoid floating point rounding.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  description: Localized;
  material: Localized;
  details: Localized<string[]>;
  care: Localized<string[]>;
  colors: ProductColor[];
  sizes: string[];
  images: ProductImage[];
  createdAt: string;
  featured?: boolean;
}

export interface CartItem {
  /** productId + color + size; identifies one cart line. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: ProductColor;
  size: string;
  quantity: number;
}

export type SortOption = "newest" | "price-asc" | "price-desc";

export interface ProductFilters {
  category?: CategorySlug;
  sizes?: string[];
  colors?: string[];
  price?: PriceRangeId;
}

export type PriceRangeId = "under-100" | "100-200" | "200-300" | "over-300";
