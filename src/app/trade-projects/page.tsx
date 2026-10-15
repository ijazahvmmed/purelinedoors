import { Breadcrumb, ButtonLink, Eyebrow, FAQ } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Trade & project enquiries",
  "A quantity-led enquiry pathway for architects, specifiers, developers, contractors and trade buyers.",
  "/trade-projects",
);
export default function Trade() {
  return (
    <>
      <section className="page-intro">
        <Breadcrumb items={[{ label: "Trade & projects" }]} />
        <Eyebrow>For the bigger picture</Eyebrow>
        <div className="intro-row">
          <h1>
            Your project.
            <br />
            <em>Every opening.</em>
          </h1>
          <p>
            For architects, specifiers, contractors and trade buyers. Start with
            the requirements and build a clearer product brief.
          </p>
        </div>
      </section>
      <section className="section quote-layout">
        <QuoteForm
          initialType="trade"
          enabled={process.env.LEADS_ENABLED === "true"}
        />
        <aside className="quote-aside">
          <Eyebrow>From brief to specification</Eyebrow>
          <h2>
            Bring the details.
            <br />
            We’ll start <em>there.</em>
          </h2>
          <p>
            List the models and quantities you are considering, the project
            application, location and programme.
          </p>
          <ol>
            <li>Door and frame requirements</li>
            <li>Dimensions and opening schedule</li>
            <li>Performance evidence needed</li>
            <li>Quantity and project timing</li>
          </ol>
          <ButtonLink href="/resources" outline>
            Specification resources
          </ButtonLink>
        </aside>
      </section>
      <section className="section narrow">
        <FAQ
          items={[
            {
              question: "Can I enquire about multiple designs?",
              answer:
                "Yes. List each design, quantity and intended application in the project details field. Do not send personal or sensitive project documents until an approved transfer method has been agreed.",
            },
            {
              question: "Are trade terms and lead times published?",
              answer:
                "Commercial terms and lead times have not yet been approved for this catalogue preview. Confirm these as part of the project discussion.",
            },
          ]}
        />
      </section>
    </>
  );
}
