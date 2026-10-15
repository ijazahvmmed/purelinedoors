import type { Product, Family } from "./types";
import { families } from "./content";
import sourceProducts from "../../docs/source-products.json";
// Local catalogue samples are review material, never the live UK assortment.
const samples = [
  [
    "arch",
    "Arch",
    "exterior-grp",
    "Traditional",
    "An arched glazed panel gives this classic entrance design a distinctive focal point.",
    6,
  ],
  [
    "twin-vertical",
    "Twin Vertical",
    "exterior-grp",
    "Traditional",
    "Paired vertical glazing brings a balanced rhythm to a panelled entrance.",
    7,
  ],
  [
    "triple-square",
    "Triple Square",
    "exterior-grp",
    "Contemporary",
    "Three square glazed panels create a measured, contemporary entrance.",
    8,
  ],
  [
    "single-diamond",
    "Single Diamond",
    "exterior-grp",
    "Traditional",
    "A single diamond-shaped glazed feature within a traditional panelled design.",
    8,
  ],
  [
    "rectangle-top",
    "Rectangle Top",
    "exterior-grp",
    "Traditional",
    "Rectangular upper glazing and a warm wood-effect appearance in the catalogue reference.",
    9,
  ],
  [
    "half-glazed",
    "Half Glazed",
    "exterior-grp",
    "Traditional",
    "A generous glazed upper section paired with a panelled lower door.",
    7,
  ],
  [
    "enm-four-panel",
    "ENM 4 Panel",
    "enm-metal",
    "Contemporary",
    "A four-panel composition from the catalogue’s ENM metal family.",
    11,
  ],
  [
    "smooth",
    "Smooth",
    "smooth",
    "Contemporary",
    "A simple, unbroken face for an understated architectural expression.",
    13,
  ],
  [
    "smooth-two-panel",
    "Smooth 2 Panel",
    "smooth",
    "Contemporary",
    "Two clean panel shapes and a restrained contemporary finish.",
    13,
  ],
  [
    "sight-glass",
    "Sight Glass",
    "sight-glass-balcony",
    "Contemporary",
    "An elongated glazed opening for the catalogue’s interior and balcony range.",
    15,
  ],
  [
    "abs-sda-307",
    "SDA-307",
    "abs",
    "Contemporary",
    "An ABS interior design shown in the original product catalogue.",
    22,
  ],
  [
    "grp-hinged-frame",
    "GRP hinged frame",
    "grp-doors-frames",
    "Functional",
    "A hinged frame configuration shown in the GRP doors and frames range.",
    17,
  ],
] as const;
export const previewProducts: Product[] = samples
  .map<Product>(([slug, name, family, style, description, sourcePage]) => ({
    id: slug,
    slug,
    name,
    family,
    style,
    description,
    sourcePage,
    image: `/images/${slug}.webp`,
    sourceFile: "PURELINE DOOR.pdf",
    sourceLabel: name,
    applications:
      family === "grp-doors-frames" || family === "enm-metal"
        ? ["Commercial"]
        : ["Residential"],
    specifications: [],
    status: "needs_review",
    ukAvailabilityStatus: "needs_review",
    isPublished: false,
  }))
  .map((product) => {
    const source = sourceProducts.find((x) => x.slug === product.slug);
    if (!source) throw new Error(`Missing source: ${product.slug}`);
    return {
      ...product,
      sourcePage: source.sourcePage,
      sourceLabel: source.sourceLabel,
      name: source.name,
      specifications: Object.entries(source.specifications).map(
        ([key, value]) => ({
          label:
            (
              {
                thicknessMm: "Door thickness",
                doorFrameWidthMm: "Catalogue frame width",
                doorFrameHeightMm: "Catalogue frame height",
              } as Record<string, string>
            )[key] || key,
          value: `${value} mm`,
          status: "needs_review" as const,
        }),
      ),
    };
  });
export const isPreview = process.env.SITE_LAUNCH_APPROVED !== "true";
export async function getProducts(): Promise<Product[]> {
  // Configured CMS always wins. Network errors must never publish review fixtures.
  const { fetchCmsProducts } = await import("@/sanity/content");
  const products = await fetchCmsProducts();
  if (products !== null) return products;
  return isPreview ? previewProducts : [];
}
export async function getFamilies(): Promise<Family[]> {
  const { fetchCmsFamilies } = await import("@/sanity/content");
  const records = await fetchCmsFamilies();
  if (records === null) return isPreview ? families : [];
  return records.map((f) => ({
    slug: f.slug,
    name: f.name,
    shortName: f.name,
    description: f.shortDescription,
    image: f.image || "",
    category: f.applications?.includes("Commercial")
      ? "Commercial"
      : "Residential",
  }));
}
