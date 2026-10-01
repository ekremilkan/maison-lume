import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { editorialImages } from "@/data/products";
import { getCategories, getProducts } from "@/lib/catalog";
import type { CategorySlug } from "@/lib/types";
import { SITE } from "@/lib/site";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { Cursor } from "@/components/motion/Cursor";
import { BOOT_SCRIPT, Intro } from "@/components/motion/Intro";
import { MotionController } from "@/components/motion/MotionController";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Maison Lume — Curated women's fashion from Leipzig",
    template: "%s — Maison Lume",
  },
  description:
    "Maison Lume is a small, curated women's fashion boutique from Leipzig: considered dresses, knitwear, coats and accessories made in small runs.",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_GB",
    alternateLocale: ["de_DE"],
  },
  // Demo store: kept out of search indexes unless explicitly enabled.
  robots: SITE.allowIndexing ? undefined : { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ef",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]),
  ) as Record<CategorySlug, number>;

  return (
    // The boot script adds classes to <html> before hydration.
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <Intro />
        <LocaleProvider>
          <ConsentProvider>
            <CartProvider>
              <SkipLink />
              <DemoBanner />
              <Header
                categories={categories}
                counts={counts}
                menuImages={{ edit: editorialImages.featured, latest: editorialImages.menuLatest }}
              />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer categories={categories} />
              <CartDrawer />
              <CookieConsent />
              <Cursor />
              <MotionController />
            </CartProvider>
          </ConsentProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
