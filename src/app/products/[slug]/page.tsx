import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, Check } from "lucide-react";
import { getProducts, isPreview } from "@/lib/catalogue";
import { families, faqs } from "@/lib/content";
import { metadata as meta, safeJson } from "@/lib/seo";
import {
  Breadcrumb,
  ButtonLink,
  Eyebrow,
  ProductCard,
  FAQ,
} from "@/components/ui";
import { ProductGallery } from "@/components/product-gallery";
import { ProductEvents } from "@/components/product-events";
import { MotionGrid } from "@/components/motion-elements";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await getProducts()).find((p) => p.slug === slug);
  return p ? meta(p.name, p.description, `/products/${p.slug}`) : {};
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const family = families.find((f) => f.slug === p.family);
  const specs = p.specifications.filter(
    (s) => isPreview || s.status === "verified",
  );
  return (
    <>
      <section className="product-page section">
        <Breadcrumb
          items={[
            { label: "Our doors", href: "/doors" },
            {
              label: family?.shortName || p.family,
              href: `/doors/${p.family}`,
            },
            { label: p.name },
          ]}
        />
        <div className="pdp-grid">
          <ProductGallery image={p.image} name={p.name} />
          <div className="pdp-copy">
            <Eyebrow>{family?.shortName || p.family}</Eyebrow>
            <h1>{p.name}</h1>
            <p className="pdp-description">{p.description}</p>
            <div className="product-tags">
              <span>{p.style}</span>
              {p.applications.map((a) => (
                <span key={a}>{a}</span>
              ))}
            </div>
            <div className="pdp-context">
              <h2>The design, as shown.</h2>
              <p>
                The image preserves the finish, glazing and hardware shown in
                the source catalogue. Confirm your preferred configuration and
                its availability with the product team.
              </p>
              {p.finishes?.length ? (
                <p>Verified finishes: {p.finishes.join(", ")}</p>
              ) : null}
            </div>
            <ButtonLink
              href={`/request-quote?product=${p.slug}`}
              className="pdp-quote"
            >
              Request a quote for this door
            </ButtonLink>
            <Link
              href={`/request-quote?product=${p.slug}&type=specification`}
              className="text-link"
            >
              <FileText size={16} /> Request specification information{" "}
              <ArrowRight size={16} />
            </Link>
            <p className="availability-note">
              <Check size={15} />{" "}
              {p.status === "verified"
                ? "Product details approved for publication"
                : "Catalogue reference · UK availability to be confirmed"}
            </p>
          </div>
        </div>
      </section>
      <section className="section specifications">
        <div>
          <Eyebrow>A closer look</Eyebrow>
          <h2>
            In the <em>detail.</em>
          </h2>
          <p>
            Dimensions and performance must be confirmed for the exact product
            assembly and application.
          </p>
          <div className="source-note">
            <FileText size={20} />
            <p>
              Source: {p.sourceFile}
              <br />
              Page {p.sourcePage} · “{p.sourceLabel}”
            </p>
          </div>
        </div>
        <div>
          <dl className="spec-table">
            <div>
              <dt>Product family</dt>
              <dd>{family?.name || p.family}</dd>
            </div>
            <div>
              <dt>Design reference</dt>
              <dd>{p.sourceLabel}</dd>
            </div>
            {specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  {s.value}
                  {s.status !== "verified" && (
                    <small>
                      Catalogue transcription — pending verification
                    </small>
                  )}
                </dd>
              </div>
            ))}
            <div>
              <dt>Performance documentation</dt>
              <dd>Request evidence for the specific doorset</dd>
            </div>
          </dl>
          {isPreview && (
            <p className="small muted">
              Catalogue measurements are reference information, not an order
              specification. Do not use them for manufacturing, installation or
              compliance decisions.
            </p>
          )}
        </div>
      </section>
      <section className="section narrow">
        <h2>
          Your questions, <em>considered.</em>
        </h2>
        <FAQ items={faqs.slice(1, 4)} />
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>
            Another way <em>to arrive.</em>
          </h2>
          <Link className="text-link" href={`/doors/${p.family}`}>
            Explore the collection <ArrowRight size={17} />
          </Link>
        </div>
        <MotionGrid
          itemsKey={products
            .filter((x) => x.family === p.family && x.id !== p.id)
            .slice(0, 4)
            .map((x) => x.id)
            .join(",")}
        >
          {products
            .filter((x) => x.family === p.family && x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard product={x} key={x.id} />
            ))}
        </MotionGrid>
      </section>
      <ProductEvents id={p.id} />
      {p.status === "verified" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJson({
              "@context": "https://schema.org",
              "@type": "Product",
              name: p.name,
              description: p.description,
              image: p.image,
              brand: { "@type": "Brand", name: "Pureline" },
            }),
          }}
        />
      )}
      <div className="mobile-product-cta">
        <span>{p.name}</span>
        <ButtonLink href={`/request-quote?product=${p.slug}`}>
          Enquire
        </ButtonLink>
      </div>
    </>
  );
}
