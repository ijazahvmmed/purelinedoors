# PURELINE — UK Composite Doors Website
## Product Requirements Document + Self-Contained AI Build Prompt

**Version:** 1.0  
**Prepared:** 14 October 2026  
**Project:** Corporate, catalogue and lead-generation website  
**Primary market:** United Kingdom  
**Business name in supplied catalogue:** Pureline Composites Limited (final legal name/brand styling to confirm)  
**Status:** Implementation specification; commercial and compliance claims require client approval before publication.

---

# 0. MASTER INSTRUCTION — PASTE THIS ENTIRE DOCUMENT INTO THE BUILD AGENT

Act as a coordinated senior team: UK building-products market strategist, digital brand director, premium architectural website art director, UX researcher, B2B/B2C conversion specialist, technical product-catalogue architect, Next.js engineer, CMS engineer, technical SEO lead, accessibility specialist, QA engineer and evidence-conscious copywriter.

**Your assignment is to research, plan, design, develop, test and hand over a production-quality website for Pureline using every requirement and fact below.** This entire document is the PRD and the master prompt. Do not ignore later sections or treat them as optional background. The three supplied catalogues are the product/visual references; this PRD contains their most important known facts. Request access to the PDFs if they are not available in your environment before attempting precise asset extraction or populating every SKU.

Do not start by generating a generic landing page. First output a source/claim audit, sitemap, page hierarchy, design direction, product taxonomy, data model and implementation plan; then build. Keep questions to material launch blockers, and make clearly labelled reversible assumptions for non-blockers. Preserve the distinction between documented facts, client instructions, recommendations and unverified promotional claims.

**Non-negotiable:** The result must feel like a credible, established architectural/building-products brand serving the UK market — not an AI template, an India launch campaign, a consumer fashion storefront or a generic agency landing page. Prioritise exceptional mobile UX, authentic product representation, specification accuracy, enquiry conversion, fast loading and maintainability. Do not use fake reviews, invented addresses, awards, projects, years of experience, manufacturing ownership, certificates or product performance values.

---

# 1. PROJECT ORIGIN AND CONFIRMED CLIENT INSTRUCTIONS

The following is the intended meaning of the supplied WhatsApp discussion (14 October 2026):

1. Use the supplied **PURELINE DOOR.pdf** and **DFG_composite_Door_Brochure.pptx** as initial source material for a website. The PPTX was mentioned in WhatsApp but **was not uploaded with this brief**; do not invent its contents.
2. Pureline is **currently active in the UK market**. The website must be UK-first in language, styling, product explanation and lead generation.
3. The client sent a **Pureline × DFG India catalogue selection** as additional material. It was prepared for catalogue purposes; it is not an instruction to reposition the website for India.
4. The client specifically asks that the website **include manufacturing details** based on the supplied materials.
5. They also want **Pureline's UAE and Saudi Arabian market experience** mentioned as supporting international credibility. No client names, dates, project counts or case studies were provided, so those must not be fabricated.
6. A separate request was mentioned to create social media accounts for a **water-solutions business** (spelled approximately “cliston water solutions” in the chat). The client explicitly agreed that this would be handled **separately**. Do not integrate it into Pureline's site scope, assume it is the same as Clipston Elevators, or create social accounts in this project. Confirm the exact brand spelling when that separate project begins.

**Interpretive decision for this PRD:** Build a premium product catalogue and quote/enquiry platform, not an online store with checkout. This is a **recommended MVP assumption** because no approved retail prices, online-payment flow, UK delivery/installation terms or configurator rules were provided. Confirm before launch if direct ecommerce is required.

# 2. SOURCE REGISTER AND AUTHORITY

| Source | What is available | How to use it | Important caution |
|---|---|---|---|
| WhatsApp messages, 14 Oct 2026 | UK activity, website request, manufacturing detail, UAE/Saudi experience, separate social task | Primary source for project scope/market | No approved sales model, geographic address or final contact details |
| `PURELINE DOOR.pdf` | Original 23-page visual GRP catalogue: intro, benefits, factory/certification imagery, product models, door frames, cabinets and diagrams | Primary **visual and model-reference catalogue** | Scanned/image-heavy pages, small printed specifications; verify exact SKUs against original at full resolution |
| `Pureline_GRP_Door_Catalogue (2).pdf` | Reformatted 25-page product catalogue with searchable copy and a technical summary | Working **product taxonomy and initial data reference** | May contain rewritten/promotional text; verify numbers, claims and availability before publishing |
| `Pureline x DFG India Catalog-selection.pdf` | One-page extract: applications and DFG “Doors for Good” philosophy | Supporting audience/application inspiration only | India-market context and DFG philosophy do not establish a UK partnership, factory ownership or certified sustainability |
| `DFG_composite_Door_Brochure.pptx` | Referred to in WhatsApp, but not provided here | Add only after client uploads it | Its specifications and terms are unknown |

**Source precedence:** client-approved product specification sheets and current certification records > approved commercial information > original catalogue image/model labels > reformatted catalogue text > preliminary creative copy. Resolve conflicting model specifications with the client rather than silently choosing one.

# 3. BUSINESS POSITIONING AND PRODUCT THESIS

## 3.1 Positioning

**Pureline:** A specialist provider of GRP/composite door solutions for UK residential and commercial applications, presenting a broad catalogue of exterior doors, interior doors, speciality doors and ancillary GRP products. Its documented product materials emphasise strength, visual versatility, insulation, security, weather resistance and low maintenance.

**Brand voice:** British English, polished, technically literate, restrained, warm but not salesy. Explain performance in practical terms; favour meaningful proof over adjectives. Not “luxury at unbeatable prices”, “best in the UK” or other unsupported superlatives.

**Positioning headline candidates (proposals, not approved copy):**
- “Doors designed to make an entrance.”
- “Strength in every detail.”
- “Designed for the way buildings live.”
- Existing catalogue line: “Strong. Stylish. Secure.” (usable if approved).

**Market geography:** The UK is the primary active-market focus. Add a short “Experience across the UAE and Saudi Arabia” mention on About/Experience after collecting corroborating company background. Do not state that products are made in Britain, that Pureline has UK factories, or that it operates nationwide UK installation unless validated.

## 3.2 Users and buying journeys

| Persona | Need | Conversion |
|---|---|---|
| UK homeowner / renovator | Find a reliable, attractive front or back door; understand finishes, glazing and thermal/security implications | Request a quote for selected door |
| Architect / designer / specifier | Compare ranges and exact technical parameters; download documents | Request specification pack / technical enquiry |
| Contractor / builder / developer | Source products for multiple units; confirm dimensions, availability and lead times | Bulk/project enquiry |
| Installer / trade partner / distributor | Understand catalogue, trading arrangements and support | Trade/distribution enquiry |
| School, hospital or public-sector buyer | Check durable, serviceable, appropriately specified products | Commercial specification enquiry |

A homebuyer should never be forced through technical procurement jargon; a trade visitor should never be forced through purely lifestyle imagery.

## 3.3 Business goals

1. Communicate an established, credible UK-facing brand.
2. Make the product families and options easy to understand and find.
3. Turn visitors into qualified sales enquiries with selected products already attached.
4. Give architects and contractors credible technical and manufacturing information.
5. Build scalable organic visibility for relevant UK GRP/composite door searches.
6. Let staff maintain content, products and downloadable documents without developer intervention.

## 3.4 Success measures

Track qualified enquiry volume, lead source, quote-start/quote-submit rates, product-to-enquiry rate, catalogue downloads, mobile funnel drop-off, organic landing-page engagement and Core Web Vitals. Set numeric business conversion targets **after establishing baseline**; do not invent business forecasts.

# 4. PROVEN PRODUCT INVENTORY AND TAXONOMY

The catalogues describe the following families. Treat the sizes below as **catalogue summary ranges, not guaranteed dimensions for every SKU**.

| Family | Source-supported overview | Initial technical data / caveat |
|---|---|---|
| **Exterior GRP Doors** | Traditional and contemporary entrance doors; arch, oval, twin-vertical, triple-square, diamond glazing; side lites and transoms | Typically 44 mm. Summary gives door-frame width approx. 840–1400 mm including side lite and height 2040–2450 mm. Page 6–10 in reformatted catalogue |
| **ENM Metal Doors** | ENM 4-panel and 5-panel models combining ENM, GRP and SUS according to brochure | Typically 46 mm; summary widths 1000 mm or 1200–1300 mm; heights 2100–2400 mm. Pages 11–12 |
| **Smooth Doors** | Minimal flat/single/two/three panel doors; colours including muted contemporary finishes and 8-foot options | 44 mm standard or 60 mm for relevant 8-foot models; summary standard frame widths ~970–1000 mm and height ~2070 mm; tall variants around 1000 × 2400 mm. Pages 13–14 |
| **Sight-Glass / Inner / Balcony Doors** | Glazed interior / balcony designs and wood-textured options | 60 mm and approx. 1000 × 2400 mm in family summary; verify by SKU. Page 15 |
| **Bathroom and Fire-Resistant / Security-Oriented Doors** | Bathroom 6-panel and specially described fireproof/anti-crime models in catalogue | Bathroom example 44 mm, approx. 740 × 2000 mm; brochure references PIR urethane. Page 16. **Do not call every product fire-rated or crime-resistant.** |
| **Synthetic-Resin GRP Doors and Frames** | Hinged, sliding, transom and door-frame configurations; school/public-building applications | Korean KS references shown in catalogue; verify exact models, holders and suitability. Pages 17–18 |
| **GRP Cabinets / Shoe Cabinets** | Decorative, shoe and school-office storage configurations | Ancillary range, not the homepage hero product family. Pages 19–21 |
| **ABS Doors** | Light-duty / economical interior door designs | Catalogue summary 35 mm; frame width 600–1000 mm; height 1800–2100 mm. Page 22 |
| **Door Sections, Hardware and Frame Details** | Door-frame cross sections, electronic lock illustration, hidden closer, ENM/PVC frames | Support technical resources rather than imply every option is standard. Page 23 |

**Product design vocabulary documented in the catalogues:** Arch; Arch with side lite; Twin Vertical with transom; Half Glazed; ¾ Oval; Triple Square; Single Diamond; Triple Diamond; Centre Middle; Rectangle Top; Side Long Vertical; ENM 4 Panel; ENM 5 Panel; Smooth; Smooth 1/2/3 Panel; 8-foot door variations; Sight Glass; GRP door sets and frames. Verify exact naming, model codes and region availability before treating each as a live UK SKU.

**Existing colour vocabulary:** Dark Blue, White, Medium Oak, Rosewood, Light Oak, Ivory, Light Pink, Light Blue, Light Green, Light Grey, Black. **Colours vary by product family.** Do not show all 11 swatches as available on every product, and do not synthesise inaccurate colour variations from unrelated door designs. See colour/specification summary on page 24 of the 25-page catalogue.

## 4.1 Catalogue migration rules

- Import each **distinct model only once**; the 23-page original and 25-page rework represent overlapping catalogues, not separate inventories.
- Extract exact model names, measurements and variants from full-resolution pages; preserve original labels in a raw-source field.
- Add `verificationStatus` = `verified | needs_review | withheld` on every technical spec and claim.
- Do not infer stock, pricing, fire rating, exact glazing, hardware inclusion, custom dimensions, delivery lead times or warranty from photos.
- If a photograph is low-resolution, use it as a model-identification reference or thumbnail only; request original image or CAD/marketing export for hero use.
- A future UK-selected assortment may be a **subset** of the full catalogue; product publication requires client sign-off.

# 5. MANUFACTURING, STANDARDS AND CLAIM-CONTROL POLICY

The original/reformatted product catalogues show manufacturing machinery and certification graphics and make claims relating to the following:

- GRP / Glass Reinforced Plastic product construction, urethane/PIR insulation in some product families.
- Thermal efficiency: **U-value as low as 1.0 W/m²K** (catalogue claim; model-specific basis and test report not supplied).
- Security references: **PAS 24**, and the certification imagery mentions **UK Q-Mark / PAS 23, 24** (current applicability and certificate holder unverified).
- Fire-performance options described with **BS 476 Part 22** (identify actual tested assemblies/products, certificates and permissible wording).
- Certifications pictured/listed: **KS F 3109**, **ISO 9001**, **ISO 14001**, **ISO 45001**, certification/patent numbers, including KS No. 07-0380 and Q-Mark No. 058 as transcribed in the reworked catalogue. The certificate **owners, scope, validity and permission to use marks must be verified**.
- A **USD 30M annual GRP building-material exports** figure appears in the reworked catalogue. This must not be attributed to Pureline without explicit evidence and approved context.
- The original brochure includes manufacturing equipment imagery. Factory/operator ownership is **not established** by the supplied source.

### Publication gates

| Content | Initial treatment | Publish when |
|---|---|---|
| “GRP composite door range”, listed product categories and visual styles | Allowed as catalogue-derived | UK assortment is approved |
| Generic practical benefits such as easy cleaning or stylistic choice | Qualify carefully | Product team approves relevance |
| Specific 1.0 W/m²K U-value | **Withhold from public headline by default** | Test report, product applicability and wording verified |
| “PAS 24 compliant / certified” | **Do not display yet as blanket claim** | Relevant current certificate and tested assembly confirmed |
| “BS 476 Part 22 fire-rated” | **Do not display yet as blanket claim** | Tested product, duration, assembly and valid documentation approved |
| ISO/KS/Q-Mark certification badges | **Do not display as Pureline-owned credentials by default** | Named certificate holder, validity and permission verified |
| Factory photo and “our factory” statement | Use “Manufacturing & quality” section with neutral language/placeholders | Factory/operator relationship and usage rights confirmed |
| “UAE and Saudi market experience” | Client requested this content | Company background and approved wording corroborated |
| DFG “Doors for Good”, sustainable/recyclable and carbon claims | Do not inherit automatically | Ownership, evidence and permitted brand language approved |
| Testimonials, installed projects, years trading, UK installers, warranties | Do not invent | Client supplies records and consent |

The DFG one-page document shows use cases (homes, offices, schools, hospitals, government, commercial) and a “Doors for Good” sustainability philosophy. Use the **applications** as inspiration but do not transplant the partner's trademark, logo or environmental guarantee without approval.

**Required manufacturing page:** Introduce product engineering, materials, illustrated press/moulding process (only if correctly attributed), factory quality controls, catalogue-to-application workflow, and **verified** certificates as downloadable evidence. Avoid visually implying the photographed production facility is owned by Pureline unless established. If attribution remains unconfirmed, use a neutral supplier-manufacturing description reviewed by the client.

# 6. INFORMATION ARCHITECTURE AND SITE MAP

**Primary navigation, recommended:** Products · Why Pureline · Manufacturing & Quality · Applications / Trade · About · Resources · Contact. Persistent header CTA: **Request a Quote**. Mobile navigation must remain simple with accessible expanded groups.

### Required routes and content

1. `/` — Home: signature photography, range gateway, verified benefits, manufacturing preview, use cases, international experience (secondary), brochure and enquiry CTAs.
2. `/doors` — All product families index: users can switch between residential, commercial and ancillary categories.
3. `/doors/exterior-grp` — Exterior GRP collection.
4. `/doors/enm-metal` — ENM metal collection.
5. `/doors/smooth` — Smooth collection.
6. `/doors/sight-glass-balcony` — Sight Glass / Inner / Balcony collection.
7. `/doors/bathroom-specialist` — Bathroom and specialist doors, with careful fire/security language.
8. `/doors/grp-doors-frames` — Synthetic resin doors and frames.
9. `/doors/abs` — ABS doors.
10. `/products/[slug]` — Canonical, indexable product detail template for each approved model.
11. `/accessories` — Cabinets, shoe cabinets, door frames and technical accessories as appropriate. Avoid implying all are available in UK before approval.
12. `/why-pureline` — Value propositions, construction, design flexibility and product-care benefits.
13. `/manufacturing-quality` — Manufacturing overview, quality process, standards and verified certificate records.
14. `/applications` — Homeowners, developers, schools, offices, hospitals, commercial and public projects; each connected to relevant doors.
15. `/trade-projects` — Architectural/specifier/bulk enquiry route with technical downloads and quantity-led form.
16. `/about` — Company story, UK-market focus, measured UAE/Saudi experience statement, relationship to manufacturers only as verified.
17. `/resources` — Brochure PDFs, specification documents, care guide and FAQs. Never expose drafts labelled “India launch” as official UK literature without approval.
18. `/request-quote` — Central quote form, prefilling selected model and configuration.
19. `/contact` — Verified business contacts, enquiry type routing, business hours and addresses only when supplied.
20. `/privacy`, `/cookies`, `/terms`, and accessible consent controls — approved legal copy appropriate to actual controller/jurisdiction.

Optional later: `/projects`, interactive door configurator, dealer locator, trade login, project spec downloads, comparison builder, multilingual support.

# 7. PAGE-LEVEL CONTENT AND UX BLUEPRINT

## 7.1 Homepage — exact recommended hierarchy

1. **Hero:** full-bleed architecturally credible UK-compatible doorway photo (actual Pureline model if feasible), restrained headline, one factual supporting line. CTAs “Explore Door Collection” and “Request a Quote”. Avoid implausible architectural CGI.
2. **Credibility micro-band:** 3–4 strictly verified features or certifications, no fabricated awards.
3. **Collection gateway:** Exterior GRP, Smooth, Metal, Specialist, Frames; premium image-led cards, comfortable mobile tap targets.
4. **Design + performance story:** two-column product detail and selected practical benefits such as insulation / weather resistance / low care, qualified per range.
5. **Popular door designs:** editorial model strip with links, not dummy featured cards.
6. **Manufacturing & Quality:** factory/process image with accurate caption and link to detail page.
7. **Made for different settings:** residential, commercial, public and institutional applications; no unsubstantiated customer stories.
8. **For professionals:** trade/specification download and project enquiries.
9. **International experience:** compact About-linked line mentioning UAE/Saudi after approval; keep UK relevance dominant.
10. **Practical next steps:** Choose a design → Send requirements → Receive an assessment/quote (do not promise response SLA).
11. **Final conversion:** concise quote CTA with telephone/email if known and complete footer.

## 7.2 Collection pages

- Intro = category name, meaningful 1–2 sentence description, appropriate image.
- Filter, where actual data exists: application, style, glazing, side lite/transom, compatible colour, thickness, frame/height/width, perhaps door type. Never show empty or fabricated facets.
- Product cards = actual model image, human-readable title, important variants, “View Details” and secondary “Enquire”. No invented price, inventory or star rating.
- Responsive grid: purposeful cropping and consistent door silhouette proportions; no forced wide crops cutting off the design.
- Include comparison/FAQ and relevant quote CTA after listings. All filters keyboard operable, accessible and reflected in URL state if appropriate.

## 7.3 Product detail page

Above the fold: product hero with true proportional representation, image gallery, model identifier if verified, family, succinct description, available documented finishes/colours, main CTA **Request Quote for this Door**, and technical download where available.

Following sections: selectable verified colour/glazing configuration (only if variations genuinely exist), size/specification table with units `mm`, illustrated framing notes, relevant performance disclosures, installation/ordering info **only if approved**, care/maintenance, related models and sticky mobile enquiry CTA.

**Enquiry prefill object:** `productId`, `productTitle`, `modelCode`, selected confirmed colour, glazing, side-lite, dimensions and link to source page; preserve query context through submission and email notification.

## 7.4 Manufacturing & Quality

Editorial hero of actual production image if rights/attribution permit; process narrative (raw material, GRP moulding/assembly, finish, QA, shipment) only where product owner confirms process; material and sectional diagrams; source-labelled technical document downloads; *verified certificates* only. Provide a visible distinction between manufacturing partner/facility and Pureline's market role if relevant.

## 7.5 About / Experience

Lead with who Pureline serves in the UK and how enquiries are fulfilled. Use one restrained, factual section titled “Regional Experience” or “International Experience” for UAE and Saudi Arabia once the client supplies proof points. No unverified project gallery, client logos, dates, staff photos or facility locations.

## 7.6 Quote forms

**Homeowner quick form:** name, email, phone optional, postcode/location, interested product (autofilled), brief project requirement, optional preferred contact method, privacy checkbox/acknowledgement. Keep friction low.

**Trade enquiry:** company, contact, country/postcode, category/model, estimated quantity, approximate sizes, deadline, message and optional specification file (virus-scan / server restrictions if supported). Route business leads separately. Make all mandatory fields explicit and show an honest success state with request ID; no guaranteed response times unless approved.

# 8. BRAND, VISUAL DIRECTION AND IMAGE PRODUCTION

## 8.1 Art direction

A refined architectural product brand: carefully gridded editorial layouts, architectural whitespace, restrained motion, authentic material close-ups, deep green inspired by existing Pureline identity, and cool/warm mineral neutrals. Avoid neon gradients, generic 3D blobs, random outline icons, exaggerated glassmorphism, huge rounded boxes, fake trust badges and excessive scroll animation.

**Working palette proposal (approval required):** Forest `#214B34`, warm off-white `#F6F5F1`, ink `#161A17`, soft stone `#E8E8E2`, secondary muted leaf green `#91B872`. Existing brochure already uses a distinct lime/green identity: do not replace approved corporate colours merely to make a trendy design.

**Typography proposal:** clean contemporary sans for UI and readable body, optionally an editorial serif for a tightly controlled architectural headline treatment. Use licensed web-safe families; keep a consistent 2-family maximum. Typography must remain readable at mobile sizes.

**Visual principles:** a real architectural photograph should make the product credible; product photo renders must be accurate and labelled if conceptual; construction diagrams must prioritise legibility; mobile images should not crop out doors/handles; certificate graphics should only be used when verified and licensed.

## 8.2 Asset system / request list

- Official Pureline vector logo, preferred logo version, font or approved brand kit.
- 4–6 UK-appropriate architectural hero scenes **with exact real door-model matching** where feasible.
- Product cutouts for each publishable model and each legitimate colour variant, at least 1600 px on long edge where available; source resolution governs reuse.
- 6–10 credible manufacturing/detail images with supplier approval and captions.
- Clean detail crops: surface texture, glazing, hardware, threshold, frame cross section.
- Verified high-resolution certification documents with owner and validity.
- Official UK-market brochure download, ideally newly compiled from approved assortment.
- Web-optimised AVIF/WebP, responsive sizes, `srcset`, authored alt text; maintain originals separately.

Do not use AI to alter product design, window patterns, side lites or hardware and then represent the result as a real SKU. Photorealistic architecture may be generated only as an **approved lifestyle illustration**; clearly manage the distinction between real model images and conceptual staging. Never claim a rendered building is a completed Pureline project.

# 9. FUNCTIONAL REQUIREMENTS AND PRIORITIES

| ID | Requirement | Priority | Acceptance |
|---|---|---|---|
| FR-01 | Responsive website and mobile menu | P0 | Usable at 320–1440+ px, no horizontal overflow |
| FR-02 | CMS-managed product families and approved SKUs | P0 | Staff can add/edit/archive products without code deployment |
| FR-03 | Product cards/detail gallery and genuine options | P0 | Correct model/source mapping; no unsupported option combinations |
| FR-04 | Quote request from global CTA and product pages | P0 | Product context, contact details, validation and notifications persist |
| FR-05 | Separate homeowner and trade lead paths | P0 | Business requirements captured without burdening homeowners |
| FR-06 | Resources, brochures and attachments | P0 | Downloads are correct, trackable and versioned |
| FR-07 | Manufacturing page with verification status | P0 | No unverified certifications or factory ownership implied |
| FR-08 | UK search-friendly metadata and structured data | P0 | Unique metadata, canonical URLs, correct sitemap and robots |
| FR-09 | Cookie/privacy/analytics controls | P0 | Nonessential tracking respects lawful user preferences |
| FR-10 | Lead spam mitigation and delivery monitoring | P0 | Server validation, rate limits, secure notifications, useful error states |
| FR-11 | Search and product filtering | P1 | Filters accurately reflect approved catalogue |
| FR-12 | Analytics funnel | P1 | Events demonstrably fire once and with consent where needed |
| FR-13 | Saved shortlist or model comparison | P2 | Implement only if volume/UX evidence justifies complexity |
| FR-14 | Interactive door designer / upload property photo | P2 | Deferred pending exact variant constraints and commercial scope |
| FR-15 | Installer/dealer locator | P2 | No placeholder locator; only if an actual verified network exists |

# 10. CONTENT DATA MODEL / CMS SCHEMA

Create relational or document collections for:

**ProductFamily:** `id`, `slug`, `name`, `shortDescription`, `longDescription`, `featuredImage`, `applications`, `sortOrder`, `seo`, `isPublished`.

**Product:** `id`, `slug`, `familyId`, `officialName`, `modelCode?`, `sourceCatalogue`, `sourcePage`, `sourceImageRef`, `description`, `gallery[]`, `applications[]`, `constructionMaterials[]`, `thicknessMm?`, `doorFrameWidthMm?`, `doorFrameHeightMm?`, `availableColours[]`, `compatibleGlazing[]`, `compatibleLayouts[]`, `technicalDocuments[]`, `specifications[]`, `claimReferences[]`, `ukAvailabilityStatus`, `verificationStatus`, `isFeatured`, `isPublished`, `seo`.

**TechnicalClaim / Certificate:** `claimType`, `exactApprovedCopy`, `sourceFile`, `sourcePage`, `certificateHolder?`, `evidenceAsset?`, `relevantProductIds[]`, `issueDate?`, `expiryDate?`, `verifiedBy?`, `approvalDate?`, `publicationPermission`, `status`.

**Download:** `name`, `url`, `language`, `market`, `version`, `approvedBy`, `date`, `relatedProducts[]`.

**Lead:** `leadType`, `productId?`, `configuration?`, `contact`, `location`, `projectQuantity?`, `timeline?`, `message`, `privacyConsent`, `consentTimestamp`, `sourcePage`, `campaignAttribution`, `createdAt`, `deliveryStatus`. **Never expose leads through public CMS endpoints.**

**Global content:** menus, footer, official contact methods, FAQ, proof items, experience statements, legal pages, SEO and redirect rules.

Use controlled vocabularies for product categories and colours. Prevent publishing a certificate with `status != verified`. Handle partial product data gracefully (omit unknown fields, not invented filler values).

# 11. TECHNICAL ARCHITECTURE

**Preferred implementation starting point:** Next.js App Router, TypeScript, server-rendered or statically generated catalogue routes, Tailwind CSS with a disciplined component system, accessible interactions, image optimisation, CMS (Sanity, Directus or equivalent selected for maintenance needs), server-side form validation and transactional email. A lean Astro implementation is also acceptable if the product filtering/CMS requirements remain simple. Choose based on long-term ownership and hosting rather than fashion.

- Build reusable components: Header, MobileNav, Hero, FamilyCard, ProductCard, FilterPanel, ProductGallery, SpecTable, EvidenceBadge, QuoteDrawer/Form, DownloadCard, Footer.
- Strong typing for product/claim data. No content hardcoded in scattered JSX.
- Pre-render indexable product and catalogue routes where feasible; implement canonical tags, XML sitemap, robots, 301 redirect support, open graph images.
- Image loading: responsive `<picture>`/framework image optimisation, below-fold lazy loading, priority hero resource, no cumulative layout shift.
- Forms: validation client+server; escape user input; secure file-upload processing; rate limits/honeypot; email delivery logs/retry; CAPTCHA only if necessary; no secrets in frontend.
- Enquiry submissions: route securely to approved sales inbox and optional CRM; provide a safe backup queue/failure alert. No fake “Message sent” state when delivery fails.
- Tracking: GA4 via approved tag manager/consent approach; possible CRM integration as required. Avoid duplicating conversion events with multiple pixels.
- Environment-specific configuration, error boundaries, monitored build and asset pipeline, documented deployment/rollback.
- Accessibility: aim WCAG 2.2 AA, including keyboard navigation, focus states, colour contrast, accessible filter and gallery controls, reduced-motion support and form error association.
- UK privacy: ensure privacy information, consent mechanism and any analytics/marketing cookies are reviewed for UK GDPR/PECR applicability with relevant counsel/owner.

**Performance targets:** Mobile field Core Web Vitals at good thresholds where measurable: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Lighthouse desktop and mobile audits, tested on representative midrange mobile devices, with performance budgeting for image-heavy pages. These are engineering targets, not claims of measured current performance.

# 12. SEARCH AND CONVERSION STRATEGY

## 12.1 Search architecture

Use topical clusters and descriptive routes: `grp-composite-doors`, `composite-front-doors`, `glazed-grp-doors`, `smooth-composite-doors`, `grp-door-frames`, `doors-for-commercial-projects` as relevant. Avoid targeting “UK manufacturer”, “fire rated”, “PAS 24 certified”, “made in Britain” or “nationwide installation” without verified support. Write unique titles/H1s/meta descriptions, image alt text and useful content for each category; avoid keyword-stuffed location doorway pages.

Structured data: `Organization` (verified identity), `Product` (accurate specs with no invented price/reviews/availability), `BreadcrumbList`, `FAQPage` only where eligible/useful, and `LocalBusiness` only if a real UK location/contact is verified. Implement sitemap, image SEO and internal links between applications, families and model pages.

## 12.2 Lead experience

- Global **Request a Quote** CTA visible across desktop and mobile.
- Product forms embed the exact selected model and configuration.
- Trade form supports multiple-product/quantity enquiries without mandatory account creation.
- Brochure download CTA paired with optional, not coercive, contact capture.
- Track `view_item`, `select_item`, `view_product`, `start_quote`, `quote_submit_success`, `brochure_download`, `contact_click` or consistent customised event taxonomy. Validate against duplicate firing.

# 13. UK COMPETITIVE BENCHMARKS — RESEARCH INSTRUCTIONS

Review contemporary UK door-brand user journeys before design, especially:

- **Rockdoor** — https://www.rockdoor.com/ (category/style navigation, product exploration, home visualisation, quote handoff).
- **Solidor** — https://www.solidor.co.uk/composite-doors/door-designer/ (design discovery, finish selection, installer/quote pathway).
- **Endurance Doors** — https://endurancedoors.co.uk/ (collection-led merchandising, door configuration, partner quote journey).

These are **UX and content benchmarks only**, not sources for Pureline specs, performance claims, product photos or licence-free artwork. Create a documented comparative matrix: homepage narrative, category discovery, filters, product page clarity, quote flow, mobile interactions, trust/proof and image treatment. Use a leaner MVP than a full 3D configurator unless approved.

# 14. EXPLICIT IN-SCOPE / OUT-OF-SCOPE

**MVP in scope:** identity-aligned UK-first corporate site, page templates, real product taxonomy and approved assortment, CMS ingestion, lightweight product options, manufacturing/evidence page, quote flows, mobile UX, technical SEO, analytics, privacy foundation, accessibility, QA, documentation and basic post-launch support instructions.

**Not in scope without additional approval:** online payment/checkout, live shipping prices, actual inventory/stock, automatic fitting/installer booking, full 3D/AR visualiser, trade portal, unsupported case studies, social account creation, ads campaigns, proprietary production photography, dealer finder with imaginary dealers, design of a DFG India site, or the separate water-solutions business social-media request.

# 15. EXECUTION PHASES AND DELIVERABLES

**Phase 0 — Intake, catalogue/claims audit:** Catalogue inventory with model/source-page mapping, duplicate detection, market availability fields, brand assets list, claim/evidence register, list of critical client approvals. Explicitly flag missing DFG PPTX.

**Phase 1 — Discovery and UX:** UK competitor benchmark matrix, refined persona journeys, final sitemap, desktop/mobile content hierarchy, product taxonomy, quote-form design and measurable success events. Provide assumptions register.

**Phase 2 — Visual direction:** Two differentiated, brand-consistent art directions with palette/type/image rules; select one based on readability and product emphasis. Generate homepage and product detail high-fidelity designs, then responsive variants. No superficial trend effects.

**Phase 3 — Implementation:** Design system, CMS schemas, page templates, navigation, product content, search/filter, lead forms, performance/image handling, SEO, analytics and privacy controls. Implement one end-to-end product/quote path before populating all models.

**Phase 4 — Content and verification:** Import only approved products, attach original photos/document source mappings, add manufacturing copy with correct attribution, client-approved UAE/Saudi experience, verified certificates and authorised PDF resources.

**Phase 5 — QA & launch:** Conduct content/claim proofing, device/browser matrix, form delivery tests, keyboard and screen-reader testing, SEO crawl, link/media audits, analytics consent validation, Core Web Vitals checks, 404/error handling, legal review and production release checklist.

**Handover:** Production repository, environment/deployment guide, CMS editor instructions, file/media inventory, source-to-product mapping CSV/JSON, claim approval register, test report, analytics events specification, rollback instructions, outstanding approval list.

# 16. ACCEPTANCE CRITERIA / DEFINITION OF DONE

Launch only when all of these are satisfied:

1. UK-market positioning is clear in homepage narrative and conversion paths; India catalogue context does not leak into market positioning.
2. The site is recognisably Pureline, with approved logo/brand assets and non-generic responsive design.
3. Every displayed product maps to a real catalogue source and approved UK range; specifications carry correct units and model relationships.
4. Every public certification, factory/ownership, performance, sustainability and UAE/Saudi experience claim has documented approval.
5. Contact and quote submissions work end to end, retain selected product context, validate consent and reliably reach a monitored business destination.
6. Desktop/mobile navigation and enquiry flows meet accessibility and usability criteria; no broken search/filter states.
7. No generic filler, fake testimonials, stock counts, review stars, prices, client logos, installers or projects.
8. Production content can be maintained through the agreed CMS without code edits.
9. Search indexing, canonicals, structured data, robots/sitemap, cookie handling and event tracking are configured and tested.
10. Asset quality is appropriate at expected display sizes; no pixelated catalogue screenshots blown up into full-screen hero images.
11. Mobile-first performance is validated using repeatable lab and, after release, field monitoring.
12. Final review signoff from client for commercial details, product data, manufacturer attribution, logos and legal pages.

# 17. MISSING INFORMATION — ASK ONCE, IN A CONSOLIDATED CLIENT INTAKE

**Launch blockers**

- Official public-facing brand spelling/logo and legal entity behind UK sales.
- Website domain, UK contact number, email, registered address (if any) and geographic service/delivery coverage.
- Whether UK operations are manufacturer, exporter, importer, distributor, sales office, installation provider or some combination.
- Relationship between Pureline, any factory/operator and DFG; rights to show their factory and certification images.
- Verified currently sellable UK model list, product codes, availability/lead times and actual supported variants.
- Product-level security, fire, thermal and quality certificates (owner, scope, dates and permitted claims).
- End-to-end enquiry ownership: receiving sales inbox, CRM (if used), confirmation sender and data controller/privacy copy.
- Approval for UAE/Saudi experience wording and supporting projects/markets (without inventing projects).
- Brand and image asset copyright/usage approvals, plus the referenced DFG composite-door PPTX.

**Nice-to-have; do not block first design draft:** warranty/maintenance handbook, installation FAQs, product lead times, approved testimonials/projects, downloadable technical CAD files, approved colour samples, partner network, sustainability evidence.

# 18. INSTRUCTIONS FOR FIRST RESPONSE FROM THE BUILD AGENT

Before coding, provide these in order:

1. **One-paragraph understanding** of the scope, explicitly UK-first, catalogue/quote-led, UAE/Saudi credibility secondary, separate water-solutions task excluded.
2. **Confirmed vs unverified facts table**, tracing any numerical/certification claim to catalogue/file/page; do not silently publish claims.
3. **Detailed site map and navigation**, with pages grouped MVP vs phase 2.
4. **Homepage, collection and PDP wireframe hierarchy**, desktop and mobile.
5. **Visual identity and photography rules** with reference mood direction, not generic UI moodboards.
6. **Product family matrix and CMS schema**, including source mappings and missing fields.
7. **Technical plan** (stack choice, CMS, leads, image pipeline, SEO, consent and QA).
8. **Milestones and acceptance checklist**, then begin working through the first vertical slice when repository/assets are available.

**Do not ask for information already available above.** Ask only the consolidated blockers you genuinely need; use labelled placeholders for the rest. Do not claim the website, research, certifications, or deliverables are complete until demonstrably produced and checked.

---

## APPENDIX A — AT-A-GLANCE PRODUCT SOURCES

- `PURELINE DOOR.pdf`, pages 1–5: cover, UK-market introduction, benefits, original factory/certification content.
- `PURELINE DOOR.pdf`, pages 6–10: exterior GRP designs and finish choices.
- `PURELINE DOOR.pdf`, pages 11–12: ENM metal doors.
- `PURELINE DOOR.pdf`, pages 13–15: smooth / inner / balcony doors.
- `PURELINE DOOR.pdf`, pages 16–18: bathroom/specialist, GRP doors/frames.
- `PURELINE DOOR.pdf`, pages 19–23: cabinets, ABS doors, cross-section/hardware diagrams.
- `Pureline_GRP_Door_Catalogue (2).pdf`, pages 2–5: positioning, features, manufacturing credentials and overview.
- `Pureline_GRP_Door_Catalogue (2).pdf`, pages 6–23: product-family pages.
- `Pureline_GRP_Door_Catalogue (2).pdf`, page 24: specification summary and colour vocabulary.
- `Pureline_GRP_Door_Catalogue (2).pdf`, page 25: CTA with **placeholder phone, email and address**, not launch-ready contact info.
- `Pureline x DFG India Catalog-selection.pdf`, page 1: six application groups and DFG sustainability philosophy; limited reference, not independent UK claims proof.

## APPENDIX B — FINAL GUARDRAIL

A beautifully designed site that incorrectly claims certified fire resistance, a UK-owned factory, verified PAS 24 compliance or real UK installations is a failed delivery. A credible, conversion-focused product presentation with clearly documented pending claims is the right initial outcome.