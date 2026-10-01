import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getNewArrivalIds, getProducts } from "@/lib/catalog";
import { ShopView } from "@/components/shop/ShopView";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Shop the collection",
  description: "Dresses, knitwear, coats and accessories from Maison Lume — filter by size, colour and price.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories, newIds] = await Promise.all([getProducts(), getCategories(), getNewArrivalIds()]);

  return (
    // useSearchParams needs a Suspense boundary so the shell can be prerendered.
    <PageTransition>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopView products={products} categories={categories} newIds={newIds} />
      </Suspense>
    </PageTransition>
  );
}

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 sm:pt-16 lg:px-10" aria-hidden="true">
      <div className="h-14 w-2/3 max-w-md bg-linen sm:h-20" />
      <div className="mt-24 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-linen" />
        ))}
      </div>
    </div>
  );
}
