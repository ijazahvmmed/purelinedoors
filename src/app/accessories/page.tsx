import { isPreview } from "@/lib/catalogue";
import { ManagedPage } from "@/components/managed-page";
import Image from "next/image";
import {
  Breadcrumb,
  ButtonLink,
  Eyebrow,
  EnquiryBanner,
} from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Frames, cabinets & accessories",
  "Ancillary GRP catalogue references and a pathway to confirm compatibility and UK availability.",
  "/accessories",
);
export default function Accessories() {
  if (!isPreview) return <ManagedPage slug="accessories" />;
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: "Frames & accessories" }]} />
        <Eyebrow>Beyond the door</Eyebrow>
        <div className="intro-row">
          <h1>
            A more complete
            <br />
            <em>picture.</em>
          </h1>
          <p>
            The source catalogue also includes GRP frames, cabinets and hardware
            details. Confirm UK availability and compatibility before
            specification.
          </p>
        </div>
      </section>
      <section className="section journey-grid">
        <article className="journey-card">
          <Eyebrow>Frames & assemblies</Eyebrow>
          <h3>Consider the whole opening.</h3>
          <p>
            A door, its frame and its hardware should be specified together.
            Explore the GRP frame references and request the details for your
            project.
          </p>
          <ButtonLink href="/doors/grp-doors-frames" outline>
            Explore doors & frames
          </ButtonLink>
        </article>
        <article className="journey-card">
          <Image
            src="/images/shoe-cabinet.webp"
            alt="Shoe cabinet configuration from the original catalogue, page 19"
            width={350}
            height={230}
          />
          <h3>GRP storage references.</h3>
          <p>
            Ancillary cabinet configurations appear in the original catalogue.
            UK availability has not been confirmed.
          </p>
          <ButtonLink href="/request-quote?type=specification" outline>
            Ask about the ancillary range
          </ButtonLink>
        </article>
      </section>
      <EnquiryBanner catalogueDetail={isPreview} />
    </>
  );
}
