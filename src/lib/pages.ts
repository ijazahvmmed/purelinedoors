export interface EditorialPage {
  title: string;
  eyebrow: string;
  intro: string;
  aside: string;
  sections: {
    heading: string;
    body: string;
    link?: { label: string; href: string };
  }[];
}
export const editorialPages: Record<string, EditorialPage> = {
  "why-pureline": {
    title: "Considered from every angle.",
    eyebrow: "Why Pureline",
    intro:
      "A door belongs to a building, and to the people who use it. Start with the design, then look closely at the details.",
    aside: "Design with a purpose.",
    sections: [
      {
        heading: "Character, without compromise on clarity.",
        body: "Traditional panel shapes, geometric glazing and smooth contemporary faces each bring a different character to a space. The Pureline catalogue brings these families together so you can start with the design that suits your setting.",
        link: { label: "Explore the collections", href: "/doors" },
      },
      {
        heading: "Look beyond the surface.",
        body: "GRP is glass reinforced plastic. Its role within a composite door is part of a wider assembly that can include a core, frame, glazing and hardware. Those details vary by model. A meaningful specification considers the complete doorset.",
        link: {
          label: "Materials and quality",
          href: "/manufacturing-quality",
        },
      },
      {
        heading: "The right questions, early.",
        body: "Where will the door be used? What opening does it need to fit? Which finish, glazing and performance requirements matter? Sharing these details at the start helps identify the information needed before ordering.",
      },
      {
        heading: "Care starts with the correct guidance.",
        body: "Ask for the care and maintenance instructions for your selected door and hardware. Cleaning methods, adjustments and maintenance schedules should follow the product-specific guidance rather than a general promise of maintenance-free use.",
      },
    ],
  },
  "manufacturing-quality": {
    title: "Behind the finished door.",
    eyebrow: "Manufacturing & quality",
    intro:
      "Materials, construction and evidence. Understand the questions that turn a catalogue design into a considered specification.",
    aside: "Know what goes into it.",
    sections: [
      {
        heading: "The material story.",
        body: "The supplied catalogue describes GRP — glass reinforced plastic — construction across several product families. It also references urethane or PIR insulation in some designs. These are family and model references, not a specification shared by every door.",
      },
      {
        heading: "From design to assembly.",
        body: "A finished door is more than its visible face. The leaf, core, frame, glazing, seals and hardware work as an assembly. The exact materials and production sequence need to be confirmed with the relevant manufacturer for the chosen model.",
      },
      {
        heading: "Manufacturing, correctly attributed.",
        body: "The source catalogues contain production machinery and facility photographs. The operator, location, relationship to Pureline and permission to reproduce these images are being confirmed. We do not currently present those facilities as Pureline-owned factories.",
      },
      {
        heading: "Quality means traceable evidence.",
        body: "For a project specification, request the product identity, approved dimensions, assembly details, inspection information and applicable test documents. Any thermal, security or fire performance statement must refer to the exact tested doorset and permitted configuration.",
        link: {
          label: "Request product evidence",
          href: "/request-quote?type=specification",
        },
      },
      {
        heading: "Certificate records.",
        body: "No certificates are currently presented here as verified Pureline credentials. Approved records will identify the certificate holder, relevant products, scope, issue and expiry dates, with authorised documents available to read.",
      },
    ],
  },
  about: {
    title: "Doors. Spaces. Possibilities.",
    eyebrow: "About Pureline",
    intro:
      "A UK-focused catalogue of GRP and composite door designs for homes, interiors and building projects.",
    aside: "A considered way in.",
    sections: [
      {
        heading: "For the spaces people use.",
        body: "Pureline brings together door families with distinct visual and application characteristics: exterior GRP, ENM metal, smooth, glazed interior and balcony designs, specialist doors, frames and ABS interiors. This website helps homeowners and project teams explore the catalogue and ask the right questions.",
      },
      {
        heading: "A UK-first conversation.",
        body: "The enquiry journey starts with your location, intended application and project requirements. Product availability, supply arrangements and any installation scope need to be confirmed before an order is agreed.",
        link: { label: "Discuss your requirements", href: "/request-quote" },
      },
      {
        heading: "A clear view of the product.",
        body: "The product images in this preview are extracted from the supplied Pureline catalogue. They retain the original designs and finishes. Catalogue references are being reviewed for the UK assortment; they do not imply stock, lead times or every pictured option is available.",
      },
    ],
  },
  contact: {
    title: "Let’s talk about your space.",
    eyebrow: "Contact Pureline",
    intro:
      "A question about a door, a wider project, or a particular specification. Choose the conversation that fits.",
    aside: "Start with what matters.",
    sections: [
      {
        heading: "A door for your home.",
        body: "Tell us the design you are considering and your postcode. If you are still exploring, share what you want your entrance to feel like.",
        link: { label: "Homeowner enquiry", href: "/request-quote" },
      },
      {
        heading: "Trade and building projects.",
        body: "Include the project application, company, approximate quantity and programme. You can list several products and their quantities in one enquiry.",
        link: { label: "Project enquiry", href: "/request-quote?type=trade" },
      },
      {
        heading: "Technical and specification questions.",
        body: "Ask for documentation for the exact product and assembly you are considering. Include the intended use and any required performance criteria.",
        link: {
          label: "Technical enquiry",
          href: "/request-quote?type=specification",
        },
      },
      {
        heading: "Business contact details.",
        body: "The approved UK sales email, phone number, legal entity, address and service coverage have not yet been supplied for this preview. Direct contact details will be added after verification.",
      },
    ],
  },
  privacy: {
    title: "Your information, considered.",
    eyebrow: "Privacy information · draft",
    intro:
      "This preview does not accept live enquiries. The production privacy notice must be approved before personal information is collected.",
    aside: "Privacy at every step.",
    sections: [
      {
        heading: "What the enquiry form asks for.",
        body: "The form asks for your name, email, postcode, project requirements and privacy acknowledgement. Phone number and project timing are optional. Trade enquiries also request company and quantity. A selected design is attached to its enquiry.",
      },
      {
        heading: "How an enabled enquiry service works.",
        body: "When the service is configured, a validated enquiry is stored privately and a notification is sent to the approved sales destination. The implementation includes a delivery queue, anti-spam checks and restricted server-side access. Enquiry data is not stored in the public product catalogue.",
      },
      {
        heading: "What needs approval before launch.",
        body: "The data controller, contact details, lawful basis, purposes, processors, international transfer safeguards, retention periods and rights-request process must be specified in the final notice. This draft describes the implemented flow and is not the final legal notice.",
      },
      {
        heading: "Analytics and your choices.",
        body: "Optional analytics is disabled unless configured and accepted through Cookie settings. The preference is stored on your device. You can revisit that choice from the footer.",
        link: { label: "Read the cookie information", href: "/cookies" },
      },
    ],
  },
  cookies: {
    title: "Small files. Clear choices.",
    eyebrow: "Cookie information",
    intro:
      "Essential storage remembers your preferences. Optional analytics is controlled separately.",
    aside: "Your preferences matter.",
    sections: [
      {
        heading: "Essential preferences.",
        body: "The website stores your cookie choice in local storage under pureline-consent. This is used to remember your selection on this browser. You can change it through Cookie settings in the footer or clear it in your browser.",
      },
      {
        heading: "Optional analytics.",
        body: "When an approved analytics identifier is configured, analytics is loaded only after you choose Allow analytics. Without that configuration, no analytics script is loaded. Advertising tracking is not enabled. Rejecting optional analytics does not prevent browsing or using the enquiry form.",
      },
      {
        heading: "Changing your choice.",
        body: "Open Cookie settings in the footer to select Essential only or Allow analytics. Withdrawing analytics consent updates the analytics consent state and removes accessible analytics cookies. Browser settings can also clear site storage.",
      },
      {
        heading: "Before production.",
        body: "The final cookie notice needs the approved provider details and actual cookie names, durations and purposes from the configured deployment. Verify the deployed network requests before enabling analytics.",
      },
    ],
  },
  terms: {
    title: "Before you make a decision.",
    eyebrow: "Website terms · draft",
    intro:
      "This catalogue preview is for design and enquiry review. Final business and sales terms are pending approval.",
    aside: "Clarity before commitment.",
    sections: [
      {
        heading: "Catalogue information.",
        body: "Images and text describe source catalogue references. Availability, dimensions, finishes, glazing, hardware and performance must be confirmed for the selected model and assembly. Colour appearance can vary between the original material, photography and your screen.",
      },
      {
        heading: "Enquiries and orders.",
        body: "An enquiry or quote request is not an order or an offer capable of acceptance. Prices, supply arrangements, lead times, installation responsibilities, warranties and any cancellation or return terms must be agreed through approved commercial documents.",
      },
      {
        heading: "Before the site goes live.",
        body: "The final legal entity, applicable terms, intellectual property permissions and jurisdiction must be confirmed by the business. These draft website notes must be replaced or approved before production publication.",
      },
    ],
  },
};
