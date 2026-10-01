"use client";

import { useLocale } from "@/context/LocaleContext";
import { PRICE_RANGES } from "@/lib/catalog";
import type { PriceRangeId, ProductColor } from "@/lib/types";
import { CheckIcon } from "@/components/ui/Icons";

export interface FilterState {
  sizes: string[];
  colors: string[];
  price?: PriceRangeId;
}

interface FilterPanelProps {
  facets: { sizes: string[]; colors: ProductColor[] };
  value: FilterState;
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onPrice: (price?: PriceRangeId) => void;
  idPrefix: string;
}

export function FilterPanel({ facets, value, onToggleSize, onToggleColor, onPrice, idPrefix }: FilterPanelProps) {
  const { t, l, sizeLabel } = useLocale();

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="eyebrow mb-4">{t.shop.size}</legend>
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => {
            const active = value.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleSize(size)}
                className={`h-10 min-w-11 border px-3 text-sm transition-colors ${active ? "border-charcoal bg-charcoal text-ivory" : "border-stone hover:border-charcoal"}`}
              >
                {sizeLabel(size)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4">{t.shop.color}</legend>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
          {facets.colors.map((color) => {
            const active = value.colors.includes(color.id);
            const id = `${idPrefix}-color-${color.id}`;
            return (
              <li key={color.id}>
                <input id={id} type="checkbox" checked={active} onChange={() => onToggleColor(color.id)} className="peer sr-only" />
                <label
                  htmlFor={id}
                  className="flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-taupe peer-checked:text-charcoal peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-charcoal hover:text-charcoal"
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full ring-1 ring-offset-2 ring-offset-ivory transition-shadow ${active ? "ring-charcoal" : "ring-charcoal/15"}`}
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  >
                    {active && <CheckIcon width={12} height={12} className={isDark(color.hex) ? "text-ivory" : "text-charcoal"} strokeWidth={2} />}
                  </span>
                  {l(color.name)}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4">{t.shop.price}</legend>
        <ul className="space-y-1">
          {([undefined, ...Object.keys(PRICE_RANGES)] as (PriceRangeId | undefined)[]).map((range) => {
            const id = `${idPrefix}-price-${range ?? "any"}`;
            return (
              <li key={id}>
                <input
                  id={id}
                  type="radio"
                  name={`${idPrefix}-price`}
                  checked={value.price === range}
                  onChange={() => onPrice(range)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-taupe peer-checked:text-charcoal peer-checked:[&>span]:border-[5px] peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-charcoal hover:text-charcoal"
                >
                  <span className="h-4 w-4 rounded-full border border-charcoal transition-all" aria-hidden="true" />
                  {range ? t.shop.priceRanges[range] : t.shop.anyPrice}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return r * 0.299 + g * 0.587 + b * 0.114 < 140;
}
