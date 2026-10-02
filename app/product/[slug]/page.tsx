import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { ProductView } from "@/components/product/ProductView";
import { PageTransition } from "@/components/motion/PageTransition";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description.en,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${SITE.name}`,
      description: product.description.en,
      images: [{ url: product.images[0].src, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories] = await Promise.all([getRelatedProducts(product), getCategories()]);
  const category = categories.find((c) => c.slug === product.category);

  // Structured data for rich results in search engines.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.en,
    image: product.images.map((i) => i.src),
    sku: product.id,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/product/${product.slug}${SITE.trailingSlash ? "/" : ""}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageTransition>
        <ProductView product={product} category={category} related={related} />
      </PageTransition>
    </>
  );
}
