import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { isPreview } from "@/lib/catalogue";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: ["/api/", "/studio/"] },
    ...(!isPreview ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
