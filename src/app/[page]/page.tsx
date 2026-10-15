import { isPreview } from "@/lib/catalogue";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArchitecturePhoto } from "@/components/architecture-photo";
import { ArrowUpRight } from "lucide-react";
import { editorialPages } from "@/lib/pages";
import { fetchCmsPage, fetchCmsGlobal } from "@/sanity/content";
import { Breadcrumb, Eyebrow, EnquiryBanner } from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const cms = await fetchCmsPage(page);
  const p = editorialPages[page];
  return cms
    ? meta(
        cms.seo?.title || cms.title,
        cms.seo?.description || cms.introduction || "",
        `/${page}`,
      )
    : p
      ? meta(p.eyebrow, p.intro, `/${page}`)
      : {};
}
export default async function Editorial({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const cms = await fetchCmsPage(page);
  const local = editorialPages[page];
  if (!cms && (!isPreview || !local)) notFound();
  const title = cms?.title || local.title;
  const intro = cms?.introduction || local?.intro;
  const eyebrow = cms?.eyebrow || local?.eyebrow;
  const sections = cms?.sections || local?.sections;
  const global =
    page === "contact" || page === "about" ? await fetchCmsGlobal() : null;
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: eyebrow || title }]} />
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="intro-row">
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>
      <section className="section editorial-layout">
        <aside className="editorial-aside">
          <Eyebrow>
            Pureline /{" "}
            {page === "manufacturing-quality"
              ? "Materials & evidence"
              : "A closer look"}
          </Eyebrow>
          <h2>{local?.aside || title}</h2>
          {isPreview && page === "manufacturing-quality" && (
            <figure className="editorial-source-detail">
              <div className="engineering-image">
                <Image
                  src="/images/details/grp-construction.webp"
                  alt="Original catalogue cross-section of GRP exterior door construction; a source reference, not verified manufacturing evidence"
                  width={652}
                  height={564}
                  sizes="(max-width:760px) 90vw, 35vw"
                />
              </div>
              <figcaption>
                Original catalogue construction illustration / p.23
                <br />
                Model applicability and publication rights require confirmation.
              </figcaption>
            </figure>
          )}
          {isPreview && ["about", "why-pureline"].includes(page) && (
            <div className="editorial-source-detail">
              <ArchitecturePhoto name="quiet-interior" />
            </div>
          )}
        </aside>
        <div className="editorial-body">
          {sections?.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
              {s.link && (
                <Link href={s.link.href} className="text-link">
                  {s.link.label}
                  <ArrowUpRight size={17} />
                </Link>
              )}
            </section>
          ))}
          {global?.contact && page === "contact" && (
            <section>
              <h2>Contact details</h2>
              {global.contact.email && (
                <p>
                  <a href={`mailto:${global.contact.email}`}>
                    {global.contact.email}
                  </a>
                </p>
              )}
              {global.contact.phone && (
                <p>
                  <a href={`tel:${global.contact.phone}`}>
                    {global.contact.phone}
                  </a>
                </p>
              )}
              {global.contact.address && <p>{global.contact.address}</p>}
              {global.contact.legalName && <p>{global.contact.legalName}</p>}
            </section>
          )}
          {page === "about" &&
            global?.experienceStatements?.map((c) => (
              <section key={c._id}>
                <h2>International experience</h2>
                <p>{c.exactApprovedCopy}</p>
              </section>
            ))}
        </div>
      </section>
      {!["privacy", "cookies", "terms"].includes(page) && <EnquiryBanner catalogueDetail={isPreview} />}
    </>
  );
}
