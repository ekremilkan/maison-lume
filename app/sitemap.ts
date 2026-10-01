import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = ["", "/shop", "/about", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE.url}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
