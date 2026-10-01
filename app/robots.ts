import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: SITE.allowIndexing
      ? { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
