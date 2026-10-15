import type { MetadataRoute } from "next";
import { isPreview, getProducts, getFamilies } from "@/lib/catalogue";
import { families } from "@/lib/content";
import { editorialPages } from "@/lib/pages";
import { siteUrl } from "@/lib/seo";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreview) return [];
  const routes = [
    "",
    "/doors",
    "/accessories",
    "/applications",
    "/trade-projects",
    "/resources",
    "/request-quote",
    ...Object.keys(editorialPages).map((p) => `/${p}`),
    ...(await getFamilies()).map((f) => `/doors/${f.slug}`),
    ...(await getProducts()).map((p) => `/products/${p.slug}`),
  ];
  return routes.map((path) => ({ url: `${siteUrl}${path}` }));
}
