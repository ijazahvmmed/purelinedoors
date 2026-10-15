# Pureline implementation specification

Prepared 14 October 2026. Local review build; publication requires the owner's approval.

## Scope and source policy
UK-first catalogue and quote platform for homeowners, architects, contractors and commercial buyers. UAE/Saudi experience is secondary and held pending evidence. Water-solutions social accounts excluded. The three supplied PDFs are available; DFG_composite_Door_Brochure.pptx is missing.

Source precedence: approved specs/certificates > approved commercial records > original image/model labels > reformatted copy > creative copy. No model is approved for UK sale merely by appearing in a catalogue. No synthetic recolouring, invented installations, reviews, price, certificate or address.

## Sitemap
MVP: /; /doors; /doors/{exterior-grp,enm-metal,smooth,sight-glass-balcony,bathroom-specialist,grp-doors-frames,abs}; /products/[slug]; /accessories; /why-pureline; /manufacturing-quality; /applications; /trade-projects; /about; /resources; /request-quote; /contact; /privacy; /cookies; /terms.
Later: approved case studies, comparison, interactive designer, dealer finder, trade portal, multilingual content. These must not appear as dummy features.

## Page hierarchy and journeys
Home: photographic/product-led hero > factual catalogue attributes > collections > materials/details > selected designs > manufacturing > applications > homeowner/trade next steps > enquiry.
Collection: breadcrumb > family introduction > real-data search/filter > result count > image cards > application guidance > enquiry.
PDP: breadcrumb > whole-door image alongside name/family/description > genuine documented finish context > quote > source-labelled details > related models. Mobile preserves reading order, whole-door visibility, and accessible enquiry action.
Homeowners: browse > inspect model > contextual enquiry. Professionals: application/family > evidence request > quantity-led enquiry. No account needed.

## Art directions
A, selected: Architectural Editorial. Forest #214B34, warm white #F6F5F1, ink #161A17, stone #E8E8E2, restrained leaf accent. Editorial serif headlines, readable sans body, crisp fine rules, square architectural panels and generous breathing room. Portrait catalogue cover is inspiration only if no high-resolution installation photo exists.
B: Technical Precision. White/charcoal with catalogue green, sans headlines, compact technical grids and measured diagrams. Useful for a future trade-only portal; less appropriate for homeowner discovery.
Images: crop authentic source assets only, preserve proportions and colours, record dimensions/source pages, avoid enlarged low-resolution images. Factory attribution and rights require approval. Text wordmark is provisional until official vector logo arrives.

## CMS and publication
ProductFamily, Product, TechnicalClaim, Certificate, Download, GlobalContent and Page documents. Verification status on every spec/claim; independent UK availability, isPublished and image rights gates. Public queries enforce all gates even if a document is mutated outside Studio. Unapproved local fixtures only appear in preview. Private leads live in Postgres, never the content API.

## Stack and QA
Next.js App Router + TypeScript, native CSS design tokens, Sanity Studio, server-rendered catalogue, optimised local WebP assets, Postgres transactional lead outbox and Resend notifications. CMS is configurable without repurposing unrelated existing projects. Nonessential analytics loads only after consent and configuration. Default non-indexed local preview, no fabricated successful enquiry state.
Milestones: source audit/extraction; product-to-quote vertical slice; supporting routes/CMS; meaningful form/publication tests; production build, browser checks, link/claim audit; handover. Production contact delivery, legal review, rights, real-device/screen-reader and field CWV checks remain explicit release gates.

## Benchmarks (reviewed 14 October 2026)
| Dimension | Rockdoor | Solidor | Endurance | Pureline decision |
|---|---|---|---|---|
| Home narrative | Style, colour, protection | Door/finish discovery | Collection and style selection | Product-led editorial introduction |
| Discovery/filters | Type, style, colour | Door styles and finish variants | Classic/Urban/Country | Actual family/style facets only |
| Product clarity | Details and designer | Style, glass, hardware | Glazing/handle/colour context | Source-mapped image/spec/quote |
| Quote | Installer handoff | Designer and installer | Selected-door enquiry | Direct homeowner/trade form |
| Mobile | Not interactively audited | Not interactively audited | Not interactively audited | Test local 320/390px navigation |
| Trust | Own manufacturing/install base claims | Own material/origin claims | Own network and construction claims | Never borrow competitor evidence |
| Image treatment | Architectural and product images | Whole-door merchandising | Whole-door styles | Authentic catalogue crops |

Sources: https://www.rockdoor.com/ ; https://www.solidor.co.uk/composite-doors/door-designer/ ; https://endurancedoors.co.uk/ . Desk review of public page content; no claim of completed competitor checkout/mobile testing.

## Approvals still needed
Final legal/brand identity and logo; domain/contacts/coverage; sales model and manufacturing relationship; approved UK assortment/variants; product-specific evidence and imagery rights; UAE/Saudi wording; approved UK brochure; privacy/controller/legal text; inbox/sender/CRM; monitored hosting and delivery. The user's request to make creative decisions is not evidence for these facts.
