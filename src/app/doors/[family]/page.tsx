import { Suspense } from "react";
import { notFound } from "next/navigation";
import { families } from "@/lib/content";
import { getProducts, getFamilies, isPreview } from "@/lib/catalogue";
import { Breadcrumb, Eyebrow, EnquiryBanner, FAQ } from "@/components/ui";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { metadata as meta } from "@/lib/seo";
import { fetchCmsFamilies } from "@/sanity/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string }>;
}) {
  const { family } = await params;
  const item = (await getFamilies()).find((f) => f.slug === family);
  return item ? meta(item.name, item.description, `/doors/${family}`) : {};
}
export default async function Collection({
  params,
}: {
  params: Promise<{ family: string }>;
}) {
  const { family } = await params;
  const local = families.find((f) => f.slug === family);
  const cms = await fetchCmsFamilies();
  const remote = cms?.find((f) => f.slug === family);
  if (!remote && (!isPreview || !local)) notFound();
  const title = remote?.name || local?.name;
  const description = remote?.shortDescription || local?.description;
  const products = await getProducts();
  return (
    <>
      <section className="page-intro">
        <Breadcrumb
          items={[{ label: "Our doors", href: "/doors" }, { label: title! }]}
        />
        <Eyebrow>The collection</Eyebrow>
        <div className="intro-row">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <section className="section catalogue-section">
        {isPreview && (
          <p className="review-label">
            CATALOGUE PREVIEW{" "}
            <span>
              Images show catalogue references, not confirmed UK configurations.
            </span>
          </p>
        )}
        <Suspense>
          <CatalogueBrowser products={products} lockFamily={family} />
        </Suspense>
      </section>
      <section className="section narrow">
        <Eyebrow>Before you choose</Eyebrow>
        <h2>
          The details <em>matter.</em>
        </h2>
        <FAQ
          items={[
            {
              question: "Which sizes and finishes can I request?",
              answer:
                "Tell us the opening dimensions and finish you have in mind. The product team needs to confirm the exact model, configuration and UK availability before you order.",
            },
            {
              question: "How do I check performance for this range?",
              answer:
                "Request model-specific evidence for the complete doorset, including frame, glazing and hardware. Performance cannot be inferred from the design image or family name.",
            },
          ]}
        />
      </section>
      <EnquiryBanner catalogueDetail={isPreview} />
    </>
  );
}
