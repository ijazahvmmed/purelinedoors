import { isPreview } from "@/lib/catalogue";
import { ManagedPage } from "@/components/managed-page";
import { ArchitecturePhoto } from "@/components/architecture-photo";
import {
  Breadcrumb,
  ButtonLink,
  EnquiryBanner,
  Eyebrow,
} from "@/components/ui";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Doors for homes and building projects",
  "Explore residential, commercial, education and public-building enquiry pathways.",
  "/applications",
);
const settings = [
  [
    "Homes & renovations",
    "Begin with the entrance, interior or balcony opening and the character of your home.",
    "/doors/exterior-grp",
  ],
  [
    "Developments & contractors",
    "Share the opening schedule, quantities and required programme for a coordinated project enquiry.",
    "/trade-projects",
  ],
  [
    "Offices & commercial spaces",
    "Describe the intended use, expected traffic and the specification needed for each opening.",
    "/doors/enm-metal",
  ],
  [
    "Schools & education",
    "Identify use, access and durability requirements. Catalogue references are a starting point for technical review.",
    "/doors/grp-doors-frames",
  ],
  [
    "Healthcare settings",
    "Set out hygiene, accessibility and performance requirements so suitability can be assessed for the intended setting.",
    "/request-quote?type=specification",
  ],
  [
    "Public-sector projects",
    "Request traceable product and assembly documentation against the procurement specification.",
    "/request-quote?type=specification",
  ],
];
export default function Applications() {
  if (!isPreview) return <ManagedPage slug="applications" />;
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: "Applications" }]} />
        <Eyebrow>Different settings. Different questions.</Eyebrow>
        <div className="intro-row">
          <h1>
            Designed into
            <br />
            <em>everyday life.</em>
          </h1>
          <p>
            Explore the right conversation for your setting. Product suitability
            and compliance must be confirmed against each project’s
            requirements.
          </p>
        </div>
      </section>
      <section
        className="section application-page-images"
        aria-label="Architectural settings"
      >
        <ArchitecturePhoto name="woodland-entrance" />
        <ArchitecturePhoto name="public-interior" />
      </section>
      <section className="section">
        <div className="editorial-list">
          {settings.map(([title, body, href], i) => (
            <article key={title}>
              <span>0{i + 1} / APPLICATION</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <ButtonLink href={href} outline className="application-button">
                Explore this pathway
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>
      <EnquiryBanner catalogueDetail={isPreview} />
    </>
  );
}
