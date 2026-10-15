import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { MotionLink, MotionCard } from "./motion-elements";
export function ButtonLink({
  href,
  children,
  light = false,
  outline = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  outline?: boolean;
  className?: string;
}) {
  return (
    <MotionLink
      href={href}
      className={`button ${light ? "button-light" : ""} ${outline ? "button-outline" : ""} ${className}`}
    >
      {children}
    </MotionLink>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link href="/">Home</Link>
      {items.map((x, i) => (
        <span key={i}>
          <span aria-hidden="true">/</span>
          {x.href ? (
            <Link href={x.href}>{x.label}</Link>
          ) : (
            <span aria-current="page">{x.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function ProductCard({ product, imageSizes }: { product: Product; imageSizes?: string }) {
  return (
    <MotionCard>
      <Link
        className="product-image"
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <div className="product-hover-media">
          <Image
            src={product.image}
            alt={`${product.name} — original catalogue design`}
            width={400}
            height={650}
            sizes={imageSizes || "(max-width: 600px) 85vw, (max-width: 1000px) 42vw, 23vw"}
          />
        </div>
        <span className="image-link">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="product-card-info">
        <span>{product.style}</span>
        <h3>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <Link
          href={`/request-quote?product=${product.slug}`}
          className="text-link"
        >
          Enquire about this design <ArrowRight size={14} />
        </Link>
      </div>
    </MotionCard>
  );
}
export function EnquiryBanner({
  catalogueDetail = false,
}: { catalogueDetail?: boolean } = {}) {
  return (
    <section
      className={`enquiry-banner closing-invitation reference-closing ${catalogueDetail ? "with-door-detail" : ""}`}
    >
      <div>
        <Eyebrow>Your next chapter</Eyebrow>
        <h2>
          Let’s make
          <br />
          an entrance.
        </h2>
      </div>
      <div>
        <p>
          A single entrance or a wider specification.
          <br />
          Tell us what you have in mind.
        </p>
        <ButtonLink href="/request-quote" light>
          Request a quote
        </ButtonLink>
      </div>
      {catalogueDetail && (
        <figure className="closing-door">
          <div className="closing-door-image">
            <Image
              src="/images/rectangle-top.webp"
              alt="Rectangle Top — original catalogue design with a wood-effect surface"
              width={642}
              height={1270}
              sizes="(max-width:760px) 200px, 270px"
            />
          </div>
          <figcaption>Rectangle Top / Catalogue detail</figcaption>
        </figure>
      )}
    </section>
  );
}
export function FAQ({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="faq-list">
      {items.map((x, i) => (
        <details key={x.question}>
          <summary>
            <span className="faq-number">0{i + 1}</span>
            {x.question}
            <span className="faq-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  );
}
