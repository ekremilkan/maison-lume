import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  newIds?: string[];
  /** Number of leading images to load eagerly (above the fold). */
  priorityCount?: number;
  columns?: 2 | 3 | 4;
  /** Overrides the responsive column classes. */
  gridClassName?: string;
}

export function ProductGrid({ products, newIds = [], priorityCount = 0, columns = 4, gridClassName }: ProductGridProps) {
  const sizes = columns === 4 ? undefined : "(min-width: 1024px) 28vw, 50vw";
  return (
    <ul
      className={`grid gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-14 ${gridClassName ?? (columns === 4 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3")}`}
    >
      {products.map((product, i) => (
        <li key={product.id} data-reveal="up" style={{ "--d": `${(i % columns) * 90}ms` } as React.CSSProperties}>
          <ProductCard product={product} isNew={newIds.includes(product.id)} priority={i < priorityCount} sizes={sizes} />
        </li>
      ))}
    </ul>
  );
}
