import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/catalogue";
import { Breadcrumb, Eyebrow } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Request a quote",
  "Tell Pureline about your door or building project. Attach a design and share your requirements.",
  "/request-quote",
);
export default async function RequestQuote({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  const products = await getProducts();
  const product = products.find((p) => p.slug === query.product);
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: "Request a quote" }]} />
        <Eyebrow>Let’s open a conversation</Eyebrow>
        <div className="intro-row">
          <h1>
            Your project.
            <br />
            <em>Our starting point.</em>
          </h1>
          <p>
            A design you love, a particular opening, or a specification to
            discuss. Tell us what you have in mind.
          </p>
        </div>
      </section>
      <section className="section quote-layout">
        <div className="quote-form-column">
          {product ? (
            <div className="quote-selected">
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={190}
              />
              <div>
                <span>Your selected design</span>
                <h3>{product.name}</h3>
                <Link href={`/products/${product.slug}`}>
                  Review this design
                </Link>
              </div>
            </div>
          ) : query.product ? (
            <div className="form-alert">
              That design is not available in this catalogue. You can send a
              general enquiry instead.
            </div>
          ) : null}
          <QuoteForm
            productId={product?.id}
            initialType={query.type}
            enabled={process.env.LEADS_ENABLED === "true"}
          />
        </div>
        <aside className="quote-aside">
          <Eyebrow>The next step</Eyebrow>
          <h2>
            A few details.
            <br />A clearer <em>direction.</em>
          </h2>
          <p>
            Share your requirements so the right product information and
            commercial details can be confirmed.
          </p>
          <ol>
            <li>Choose a design, or tell us your brief.</li>
            <li>Include your location and project details.</li>
            <li>Discuss specification and availability.</li>
          </ol>
          <p className="small">
            Not sure which design to choose?{" "}
            <Link href="/doors" className="text-link">
              Explore the collections
            </Link>
            .
          </p>
        </aside>
      </section>
    </>
  );
}
