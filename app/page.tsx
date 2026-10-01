import { editorialImages } from "@/data/products";
import { getCategories, getFeaturedProducts, getNewArrivals, getProducts } from "@/lib/catalog";
import type { CategorySlug } from "@/lib/types";
import { AutumnEdit } from "@/components/home/AutumnEdit";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Newsletter } from "@/components/home/Newsletter";
import { Statement } from "@/components/home/Statement";
import { PageTransition } from "@/components/motion/PageTransition";

export default async function HomePage() {
  const [featured, latest, categories, products] = await Promise.all([
    getFeaturedProducts(4),
    getNewArrivals(12),
    getCategories(),
    getProducts(),
  ]);
  // Don't repeat pieces already shown in the featured edit.
  const newArrivals = latest.filter((p) => !featured.some((f) => f.id === p.id)).slice(0, 4);
  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]),
  ) as Record<CategorySlug, number>;

  return (
    <PageTransition>
      <Hero image={editorialImages.hero} detail={editorialImages.heroDetail} />
      <Marquee />
      <div className="space-y-28 pt-28 sm:space-y-40 sm:pt-40">
        <Statement />
        <AutumnEdit products={featured} image={editorialImages.featured} />
        <NewArrivals products={newArrivals} />
        <CategoryIndex categories={categories} counts={counts} />
        <BrandStory image={editorialImages.story} detail={editorialImages.storyDetail} />
        <Newsletter />
      </div>
    </PageTransition>
  );
}
