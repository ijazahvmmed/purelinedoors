import { FileText, BookOpen, ArrowDownToLine } from "lucide-react";
import { Breadcrumb, Eyebrow, FAQ, ButtonLink } from "@/components/ui";
import { faqs } from "@/lib/content";
import { fetchCmsDownloads } from "@/sanity/content";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Resources & practical guidance",
  "Find approved catalogue and technical resources, with answers to common product and enquiry questions.",
  "/resources",
);
export default async function Resources() {
  const downloads = await fetchCmsDownloads();
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: "Resources" }]} />
        <Eyebrow>Useful information. Clear decisions.</Eyebrow>
        <div className="intro-row">
          <h1>
            The details
            <br />
            <em>behind the design.</em>
          </h1>
          <p>
            Product documents, specification guidance and answers to help you
            take the next step.
          </p>
        </div>
      </section>
      <section className="section editorial-layout">
        <div>
          <Eyebrow>The resource library</Eyebrow>
          <h2>
            Take a<br />
            <em>closer look.</em>
          </h2>
        </div>
        <div>
          {downloads?.length ? (
            downloads.map((d) => (
              <article className="resource-card" key={d.id}>
                <FileText />
                <div>
                  <h3>{d.name}</h3>
                  <p>
                    {d.market} · {d.language} · Version {d.version} · {d.date}
                  </p>
                  <a
                    className="text-link"
                    href={`/api/downloads/${encodeURIComponent(d.id)}`}
                  >
                    Download document <ArrowDownToLine size={17} />
                  </a>
                </div>
              </article>
            ))
          ) : (
            <article className="resource-card">
              <BookOpen />
              <div>
                <h3>The UK catalogue</h3>
                <p>
                  The approved UK edition is being prepared. Source catalogues
                  are being checked for model availability, technical evidence
                  and current contact details.
                </p>
                <span className="resource-status">
                  Awaiting publication approval
                </span>
              </div>
            </article>
          )}
          <article className="resource-card">
            <FileText />
            <div>
              <h3>Product & specification documents</h3>
              <p>
                Need a particular dimension, assembly detail or performance
                report? Request documentation for your chosen design and
                intended use.
              </p>
              <ButtonLink href="/request-quote?type=specification" outline>
                Request product information
              </ButtonLink>
            </div>
          </article>
        </div>
      </section>
      <section className="section narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2>
          A little more <em>clarity.</em>
        </h2>
        <FAQ items={faqs} />
      </section>
    </>
  );
}
