"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { filterProducts, getFacets, isCategorySlug, PRICE_RANGES, sortProducts } from "@/lib/catalog";
import { interpolate } from "@/lib/format";
import type { Category, PriceRangeId, Product, SortOption } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Drawer } from "@/components/ui/Drawer";
import { CloseIcon, FilterIcon } from "@/components/ui/Icons";
import { FilterPanel } from "./FilterPanel";

const SORTS: SortOption[] = ["newest", "price-asc", "price-desc"];

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  newIds: string[];
}

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);

export function ShopView({ products, categories, newIds }: ShopViewProps) {
  const { t, l, sizeLabel } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dense, setDense] = useState(false);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);

  // All filter state lives in the URL, so filtered views are shareable.
  const categoryParam = searchParams.get("category");
  const category = isCategorySlug(categoryParam) ? categoryParam : undefined;
  const isEdit = searchParams.get("collection") === "autumn-edit";
  const sizes = list(searchParams.get("size"));
  const colors = list(searchParams.get("color"));
  const priceParam = searchParams.get("price");
  const price = priceParam && priceParam in PRICE_RANGES ? (priceParam as PriceRangeId) : undefined;
  const sortParam = searchParams.get("sort") as SortOption | null;
  const sort: SortOption = sortParam && SORTS.includes(sortParam) ? sortParam : "newest";

  const update = useCallback(
    (changes: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        const str = Array.isArray(value) ? value.join(",") : value;
        if (str) params.set(key, str);
        else params.delete(key);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toggle = (values: string[], value: string) =>
    values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

  // The catalogue is small, so filtering on every render is cheap.
  // With a real backend, move this into the API query instead.
  const scoped = filterProducts(isEdit ? products.filter((p) => p.featured) : products, { category });
  const facets = getFacets(scoped);
  const results = sortProducts(filterProducts(scoped, { sizes, colors, price }), sort);

  const activeCategory = categories.find((c) => c.slug === category);
  const title = isEdit ? t.home.featuredTitle : activeCategory ? l(activeCategory.name) : t.shop.title;
  const activeChips = [
    ...sizes.map((s) => ({ key: `size-${s}`, label: sizeLabel(s), remove: () => update({ size: sizes.filter((x) => x !== s) }) })),
    ...colors.map((c) => ({
      key: `color-${c}`,
      label: l(facets.colors.find((f) => f.id === c)?.name ?? { en: c, de: c }),
      remove: () => update({ color: colors.filter((x) => x !== c) }),
    })),
    ...(price ? [{ key: "price", label: t.shop.priceRanges[price], remove: () => update({ price: undefined }) }] : []),
  ];
  const clearAll = () => update({ size: undefined, color: undefined, price: undefined });
  const countLabel = results.length === 1 ? t.shop.resultsOne : interpolate(t.shop.results, { count: results.length });

  const panelProps = {
    facets,
    value: { sizes, colors, price },
    onToggleSize: (s: string) => update({ size: toggle(sizes, s) }),
    onToggleColor: (c: string) => update({ color: toggle(colors, c) }),
    onPrice: (p?: PriceRangeId) => update({ price: p }),
  };

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (sort !== "newest") params.set("sort", sort);
    const q = params.toString();
    return q ? `/shop?${q}` : "/shop";
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 sm:pt-16 lg:px-10">
      <header className="stagger max-w-3xl">
        <p className="eyebrow flex items-center gap-3 text-taupe">
          <span className="h-px w-8 bg-taupe" aria-hidden="true" />
          Maison Lume · {t.home.heroEyebrow}
        </p>
        <h1 className="mt-5 text-6xl leading-[0.95] tracking-[-0.02em] sm:text-8xl">
          {title}
          <sup className="ml-3 align-super font-sans text-sm tracking-normal text-taupe">({scoped.length})</sup>
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-taupe">{isEdit ? t.home.featuredText : t.shop.intro}</p>
      </header>

      <nav aria-label={t.shop.category} className="-mx-4 mt-8 sm:mx-0 sm:mt-10">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 sm:flex-wrap sm:px-0">
          {[undefined, ...categories].map((c) => {
            const active = !isEdit && (c ? c.slug === category : !category);
            return (
              <li key={c?.slug ?? "all"} className="shrink-0">
                <Link
                  href={categoryHref(c?.slug)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-10 items-center border px-4 text-sm transition-colors ${active ? "border-charcoal bg-charcoal text-ivory" : "border-stone hover:border-charcoal"}`}
                >
                  {c ? l(c.name) : t.shop.allCategories}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sticky top-[var(--header-offset,4rem)] z-20 transition-[top] duration-500 ease-soft -mx-4 mt-6 flex items-center justify-between gap-4 border-y border-sand bg-ivory/95 px-4 py-2 backdrop-blur-md sm:mx-0 sm:px-0 lg:static lg:top-auto lg:mt-10 lg:border-t-0 lg:bg-transparent lg:py-4 lg:backdrop-blur-none">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="eyebrow flex h-11 items-center gap-2 lg:hidden"
          aria-haspopup="dialog"
        >
          <FilterIcon width={18} height={18} />
          {t.shop.filter}
          {activeChips.length > 0 && <span className="text-clay">({activeChips.length})</span>}
        </button>
        <p className="hidden text-sm text-taupe lg:block" aria-live="polite">
          {countLabel}
        </p>
        <div className="flex items-center gap-4">
        <div role="group" aria-label={t.shop.density} className="hidden items-center gap-1 sm:flex">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={dense === value}
              aria-label={interpolate(t.shop.columns, { count: value ? 4 : 3 })}
              onClick={() => setDense(value)}
              className={`grid h-9 w-9 place-items-center transition-opacity ${dense === value ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
            >
              <span className={`grid gap-[3px] ${value ? "grid-cols-4" : "grid-cols-3"}`} aria-hidden="true">
                {Array.from({ length: value ? 8 : 6 }, (_, i) => (
                  <span key={i} className="h-[5px] w-[5px] bg-charcoal" />
                ))}
              </span>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only sm:not-sr-only sm:text-taupe">{t.shop.sortBy}</span>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value === "newest" ? undefined : e.target.value })}
            className="h-11 cursor-pointer bg-transparent pr-1 text-sm focus-visible:outline-1"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t.shop.sort[s]}
              </option>
            ))}
          </select>
        </label>
        </div>
      </div>

      <div className="mt-6 grid gap-12 lg:mt-2 lg:grid-cols-[220px_1fr] lg:gap-14">
        <aside className="hidden lg:block" aria-label={t.shop.filters}>
          <div className="sticky top-[calc(var(--header-offset,5rem)+5rem)] transition-[top] duration-500 ease-soft">
            <FilterPanel {...panelProps} idPrefix="desktop" />
            {activeChips.length > 0 && (
              <button type="button" onClick={clearAll} className="link-underline mt-10 text-sm text-taupe">
                {t.shop.clearAll}
              </button>
            )}
          </div>
        </aside>

        <div>
          {activeChips.length > 0 && (
            <ul aria-label={t.shop.activeFilters} className="mb-6 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={interpolate(t.shop.removeFilter, { name: chip.label })}
                    className="inline-flex h-8 items-center gap-1.5 bg-linen px-3 text-[13px] transition-colors hover:bg-sand"
                  >
                    {chip.label}
                    <CloseIcon width={12} height={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mb-4 text-sm text-taupe lg:hidden" aria-live="polite">
            {countLabel}
          </p>

          {results.length > 0 ? (
            <ProductGrid
              products={results}
              newIds={newIds}
              priorityCount={2}
              columns={dense ? 4 : 3}
              gridClassName={dense ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}
            />
          ) : (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl">{t.shop.noResults}</p>
              <p className="mt-3 text-taupe">{t.shop.noResultsHint}</p>
              <button type="button" onClick={clearAll} className="btn btn-outline mt-8">
                {t.shop.clearAll}
              </button>
            </div>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={closeFilters} label={t.shop.filters} side="bottom" className="rounded-t-xl">
        <div className="flex items-center justify-between border-b border-sand px-5 py-3">
          <h2 className="text-2xl">{t.shop.filters}</h2>
          <button type="button" onClick={closeFilters} className="-mr-2 grid h-11 w-11 place-items-center" aria-label={t.common.close}>
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 py-6">
          <FilterPanel {...panelProps} idPrefix="mobile" />
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-sand px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={clearAll} className="btn btn-outline px-5" disabled={activeChips.length === 0}>
            {t.shop.clearAll}
          </button>
          <button type="button" onClick={closeFilters} className="btn btn-primary">
            {interpolate(t.shop.showResults, { count: results.length })}
          </button>
        </div>
      </Drawer>
    </div>
  );
}
