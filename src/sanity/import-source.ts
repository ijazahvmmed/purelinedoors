/** CLI: node --env-file=.env.local --import tsx src/sanity/import-source.ts [--write]
 * Dry run is local only. Writes create new drafts and never overwrite existing documents.
 */
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient, defineQuery } from "next-sanity";

interface SourceProduct {
  name: string;
  family: string;
  slug: string;
  image: string;
  sourcePage: number;
  sourceFile: string;
  sourceLabel: string;
  specifications: Record<string, number | string>;
}
const familySlugs: Record<string, string> = {
  Exterior: "exterior-grp",
  "ENM Metal": "enm-metal",
  Smooth: "smooth",
  "Sight Glass / Balcony": "sight-glass-balcony",
  ABS: "abs",
  "GRP Frames": "grp-doors-frames",
  "GRP Cabinets": "grp-cabinets",
};
const specLabels: Record<string, string> = {
  thicknessMm: "Door thickness",
  doorFrameWidthMm: "Catalogue frame width",
  doorFrameHeightMm: "Catalogue frame height",
};
const LOOKUP_QUERY = defineQuery(
  "*[_type == $type && externalId == $externalId][0]{_id}",
);
const FAMILY_QUERY = defineQuery(
  '*[_type == "productFamily" && slug.current == $slug][0]{_id}',
);

async function main() {
  const root = process.cwd();
  const publicRoot = path.resolve(root, "public");
  const source = JSON.parse(
    await readFile(path.join(root, "docs/source-products.json"), "utf8"),
  ) as SourceProduct[];
  if (!Array.isArray(source))
    throw new Error("Expected source-products.json to contain an array.");
  const imagePaths = new Map<string, string>();
  const slugs = new Set<string>();
  for (const item of source) {
    if (
      !item.slug ||
      !item.name ||
      !item.sourceLabel ||
      !item.sourceFile ||
      !Number.isInteger(item.sourcePage) ||
      item.sourcePage < 1 ||
      !familySlugs[item.family]
    )
      throw new Error(`Incomplete source record: ${item.slug}`);
    if (slugs.has(item.slug))
      throw new Error(`Duplicate source slug: ${item.slug}`);
    slugs.add(item.slug);
    const image = path.resolve(publicRoot, item.image.replace(/^[/\\]+/, ""));
    if (!image.startsWith(publicRoot + path.sep))
      throw new Error(`Image escapes public folder: ${item.slug}`);
    if (!(await stat(image)).isFile())
      throw new Error(`Missing product image: ${item.slug}`);
    imagePaths.set(item.slug, image);
  }
  console.log(
    `Validated ${source.length} source models in ${new Set(source.map((item) => item.family)).size} families. All remain unverified and unpublished.`,
  );
  if (!process.argv.includes("--write")) {
    console.log(
      "Dry run complete. No remote reads or writes. Add --write only after configuring the intended Pureline project and an editor token.",
    );
    return;
  }
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !token)
    throw new Error(
      "Set SANITY_PROJECT_ID, SANITY_DATASET and server-only SANITY_API_WRITE_TOKEN before importing.",
    );
  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2026-10-01",
    useCdn: false,
    perspective: "raw",
  });
  const familyIds = new Map<string, string>();
  for (const familyName of new Set(source.map((item) => item.family))) {
    const slug = familySlugs[familyName];
    const existing = await client.fetch<{ _id: string } | null>(FAMILY_QUERY, {
      slug,
    });
    const record =
      existing ??
      (await client.create({
        _id: `drafts.${randomUUID()}`,
        _type: "productFamily",
        name: familyName,
        slug: { _type: "slug", current: slug },
        shortDescription: `${familyName} catalogue references for editorial review.`,
        isPublished: false,
        imageRightsApproved: false,
      }));
    familyIds.set(familyName, record._id.replace(/^drafts\./, ""));
  }
  let created = 0;
  let skipped = 0;
  for (const item of source) {
    const externalId = `catalogue:${item.slug}`;
    if (await client.fetch(LOOKUP_QUERY, { type: "product", externalId })) {
      skipped++;
      continue;
    }
    const asset = await client.assets.upload(
      "image",
      createReadStream(imagePaths.get(item.slug)!),
      { filename: path.basename(item.image) },
    );
    await client.create({
      _id: `drafts.${randomUUID()}`,
      _type: "product",
      externalId,
      officialName: item.name,
      slug: { _type: "slug", current: item.slug },
      family: {
        _type: "reference",
        _ref: familyIds.get(item.family),
        _weak: true,
      },
      sourceCatalogue: item.sourceFile,
      sourcePage: item.sourcePage,
      sourceLabel: item.sourceLabel,
      sourceImageRef: item.image,
      description: `${item.name} as depicted in the supplied catalogue. Model details and UK availability require review.`,
      image: {
        _type: "image",
        alt: `${item.name}, supplied catalogue reference`,
        asset: { _type: "reference", _ref: asset._id },
      },
      specifications: Object.entries(item.specifications).map(
        ([key, value]) => ({
          _type: "specification",
          _key: randomUUID(),
          label: specLabels[key] ?? key,
          value: `${value} mm`,
          status: "needs_review",
          sourceFile: item.sourceFile,
          sourcePage: item.sourcePage,
        }),
      ),
      verificationStatus: "needs_review",
      ukAvailabilityStatus: "needs_review",
      imageRightsApproved: false,
      isPublished: false,
    });
    created++;
  }
  console.log(
    `Created ${created} product drafts; skipped ${skipped} existing source records. No documents published. Review and strengthen family references after publishing approved families.`,
  );
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Import failed.");
  process.exitCode = 1;
});
