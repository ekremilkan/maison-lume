# Maison Lume — boutique demo store

A concept e-commerce site for a fictional women's fashion boutique in Leipzig.
Built as a portfolio piece: everything looks and behaves like a real store, but
products are mock data and no orders, payments or emails are processed.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Context + localStorage.
No other runtime dependencies.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Checkout test card: `4242 4242 4242 4242`, any future expiry, any CVC.
`4000 0000 0000 0002` simulates a declined payment.

## Deploying to GitHub Pages

Every push to `main` runs `.github/workflows/deploy.yml`, which builds a static
export and publishes it to **https://ekremilkan.github.io/maison-lume/**.

- One-time setup: repository **Settings → Pages → Source: GitHub Actions**.
- The Pages build sets `GITHUB_PAGES=true` (static export to `out/`, trailing
  slashes), `NEXT_PUBLIC_BASE_PATH` (the repo sub-path) and `NEXT_PUBLIC_SITE_URL`.
  Local `npm run dev` / `npm start` are unaffected and still run at `/`.
- Images use a custom `next/image` loader (`lib/image-loader.ts`) that lets
  Unsplash's CDN do the resizing, since static hosting has no image server.

To preview the Pages build locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/maison-lume npm run build
mkdir -p /tmp/site && ln -sfn "$PWD/out" /tmp/site/maison-lume
python3 -m http.server 8080 -d /tmp/site   # → http://localhost:8080/maison-lume/
```

## Configuration

| What | Where |
| --- | --- |
| Studio name in the demo banner/footer | `lib/site.ts` → `studioName`, `studioUrl` |
| Shop address, email, phone | `lib/site.ts` |
| Free-shipping threshold and rates | `lib/site.ts` → `SHIPPING` |
| Public URL (sitemap, canonical URLs, OG) | `NEXT_PUBLIC_SITE_URL` env var |
| Allow search engines to index the demo | `NEXT_PUBLIC_ALLOW_INDEXING=true` (off by default) |

## Project structure

```
app/                     Routes (each page exports its own metadata)
  page.tsx               Home
  shop/                  Collection grid with URL-driven filters & sorting
  product/[slug]/        Product detail (statically generated, JSON-LD)
  cart/  checkout/       Cart page, multi-step checkout
  about/  contact/
  sitemap.ts  robots.ts
components/
  layout/                Header, mobile menu, footer, language toggle, demo banner
  cart/                  Cart drawer, line items, free-shipping bar
  product/               Product card/grid, gallery, product view
  shop/                  Filter panel, shop view
  checkout/              Stepper, form fields, order summary, confirmation
  home/  pages/          Page sections
  ui/                    Drawer, accordion, quantity stepper, icons
context/                 CartContext, LocaleContext
data/products.ts         Mock catalogue (19 products, 4 categories)
i18n/dictionaries.ts     EN/DE UI copy (DE is type-checked against EN)
lib/
  catalog.ts             Data-access layer — the only module that reads data/
  order.ts               Totals, shipping, VAT
  payment.ts             Mock payment service (Stripe-ready interface)
  validation.ts          Form validators (email, postcodes, Luhn, expiry)
  storage.ts             localStorage store for useSyncExternalStore
```

## Swapping in a real backend

All product reads go through the async functions in `lib/catalog.ts`
(`getProducts`, `getProductBySlug`, `getRelatedProducts`, …). Replace their bodies
with `fetch()` calls or database queries (e.g. Prisma/Drizzle on PostgreSQL) that
return the `Product` type from `lib/types.ts`. Pages and components stay the same.

Prices are stored as integer cents (EUR); product copy is stored per locale
(`{ en, de }`).

## Adding Stripe (test mode)

`lib/payment.ts` documents the steps. In short: create a PaymentIntent in a Route
Handler using `STRIPE_SECRET_KEY`, recalculating the amount on the server; replace
the demo card fields in `components/checkout/CheckoutView.tsx` with Stripe's
`<PaymentElement />`; and return the same `PaymentResult` shape so the rest of
the checkout keeps working.

## Notes

- Language choice and the cart are stored in `localStorage`. The server always
  renders English, and the page switches to German after hydration if that was
  chosen. For server-rendered German (better for SEO), move to locale-prefixed
  routes (`/de/...`).
- Photography is from [Unsplash](https://unsplash.com), loaded through `next/image`.
  Gallery detail shots are focal-point crops of the same photo.
- Animations respect `prefers-reduced-motion`.
