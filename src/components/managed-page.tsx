import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { fetchCmsPage } from "@/sanity/content";
import { Breadcrumb, ButtonLink, Eyebrow, FAQ, EnquiryBanner } from "./ui";
export async function ManagedPage({
  slug,
  children,
}: {
  slug: string;
  children?: React.ReactNode;
}) {
  const page = await fetchCmsPage(slug);
  if (!page) notFound();
  if (slug === "home")
    return (
      <div className="homepage-edition">
        <section className="hero cinematic-hero managed-home-hero reference-hero atmospheric-hero">
          {page.image && (
            <div className="hero-visual">
              <div className="hero-parallax" data-parallax>
                <Image
                  src={page.image}
                  alt={page.imageAlt || page.title}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width:760px) 100vw, 96vw"
                />
              </div>
            </div>
          )}
          <div className="hero-brand" aria-hidden="true">
            COMPOSITE DOORS
          </div>
          <div className="hero-heading">
            <Eyebrow>{page.eyebrow || "Pureline"}</Eyebrow>
            <h1>{page.title}</h1>
          </div>
          <div className="hero-copy">
            <p>{page.introduction}</p>
            <div className="hero-actions">
              <ButtonLink href="/request-quote">
                Request a quote
              </ButtonLink>
              <ButtonLink href="/doors" outline>
                Explore our doors
              </ButtonLink>
            </div>
          </div>
        </section>
        <section className="section managed-home-sections">
          {page.sections?.map((s) => (
            <article key={s._key}>
              <h2>{s.heading}</h2>
              <div>
                <p>{s.body}</p>
                {s.link && (
                  <Link className="text-link" href={s.link.href}>
                    {s.link.label}
                    <ArrowUpRight size={17} />
                  </Link>
                )}
              </div>
            </article>
          ))}
          {page.claims?.map((c) => (
            <article key={c._id}>
              <p>{c.exactApprovedCopy}</p>
            </article>
          ))}
        </section>
        {children}
        {page.faqs?.length ? (
          <section className="section narrow">
            <FAQ items={page.faqs} />
          </section>
        ) : null}
        <EnquiryBanner />
      </div>
    );
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: page.eyebrow || page.title }]} />
        <Eyebrow>{page.eyebrow || "Pureline"}</Eyebrow>
        <div className="intro-row">
          <h1>{page.title}</h1>
          <p>{page.introduction}</p>
        </div>
      </section>
      <section className="section editorial-layout">
        <aside className="editorial-aside">
          {page.image && (
            <div className="managed-image">
              <Image
                src={page.image}
                alt={page.imageAlt || page.title}
                width={650}
                height={850}
                sizes="(max-width:760px) 90vw, 40vw"
              />
            </div>
          )}
        </aside>
        <div className="editorial-body">
          {page.sections?.map((s) => (
            <section key={s._key}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
              {s.link && (
                <Link className="text-link" href={s.link.href}>
                  {s.link.label}
                  <ArrowUpRight size={17} />
                </Link>
              )}
            </section>
          ))}
          {page.claims?.map((c) => (
            <section key={c._id}>
              <p>{c.exactApprovedCopy}</p>
            </section>
          ))}
        </div>
      </section>
      {children}
      {page.faqs?.length ? (
        <section className="section narrow">
          <FAQ items={page.faqs} />
        </section>
      ) : null}
      <EnquiryBanner />
    </>
  );
}
