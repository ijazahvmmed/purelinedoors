import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts, getFamilies, isPreview } from "@/lib/catalogue";
import { Breadcrumb, Eyebrow, EnquiryBanner } from "@/components/ui";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Explore the door collections",
  "Explore GRP exterior, smooth, ENM metal, sight glass and interior door designs. Find a starting point for your enquiry.",
  "/doors",
);
export default async function Doors() {
  const products = await getProducts();
  const families = await getFamilies();
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: "Our doors" }]} />
        <Eyebrow>The Pureline collections</Eyebrow>
        <div className="intro-row">
          <h1>
            Find your
            <br />
            <em>kind of entrance.</em>
          </h1>
          <p>
            From the character of a classic panel to the simplicity of a smooth
            finish. Explore the designs, then let’s talk about your space.
          </p>
        </div>
        <div className="family-links">
          {families.map((f) => (
            <Link key={f.slug} href={`/doors/${f.slug}`}>
              {f.shortName}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section catalogue-section">
        {isPreview && (
          <p className="review-label">
            CATALOGUE PREVIEW{" "}
            <span>
              Design references · UK assortment and options to be confirmed
            </span>
          </p>
        )}
        <Suspense>
          <CatalogueBrowser products={products} familyOptions={families} />
        </Suspense>
      </section>
      <EnquiryBanner catalogueDetail={isPreview} />
    </>
  );
}
