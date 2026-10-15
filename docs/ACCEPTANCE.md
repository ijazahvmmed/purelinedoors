# Acceptance and remaining release work

| PRD area | Implemented / checked locally | Remaining release requirement |
|---|---|---|
| UK brand and visual design | Responsive editorial design, source imagery, homeowner and professional journeys | Approved identity/logo and final high-resolution hero rights |
| Product catalogue | Seven family routes, 12 representative models, 14 source records, source/spec mapping and filtering | Complete approved UK assortment; full variant/SKU signoff |
| CMS maintenance | Sanity schemas, server adapters, draft importer, editorial templates, navigation/contact/footer integration | Create/connect Pureline project; import; real editor save/publish/withdraw tests; finish any additional template copy controls |
| Quote and trade capture | Forms, product context, validation, private Postgres/outbox/rate limits, notification retry | Actual database, verified sender/inbox, ingress and scheduler; receipt/failure/retry integration tests |
| Manufacturing and evidence | Neutral page; no factory ownership, certifications or numbers asserted; claim/expiry gates | Approved operator attribution, imagery, product evidence and certificate records |
| UAE/Saudi experience | Verified-claim slot in CMS/about template | Corroboration and approved statement; currently omitted |
| Downloads | Versioned UK-only approval-filtered library and guarded delivery route | Approved UK brochure/specification/care/certificate files |
| SEO | Unique baseline metadata/canonicals, OG image, sitemap/robots, verified-product structured data | Verified identity/organisation data, final domain and approved route inventory; enable indexing after release signoff |
| Consent/analytics | Essential preference and opt-in script loading; event hooks; no third-party preview requests | Approved provider/property, live event/withdrawal tests, final cookie notice |
| Accessibility/mobile | Automated axe, keyboard/menu/gallery and 320/390/1440px layout checks | Actual devices, Safari and screen-reader review |
| Performance | Desktop/mobile lab audits, optimised images/local fonts, zero measured CLS | Mobile LCP target refinement (2.64s measured vs 2.5s target), hosted audits and field monitoring |
| Legal/commercial | Clearly labelled legal drafts, no invented contacts/prices/terms | Actual controller/legal entity, privacy/terms review, sales responsibilities and coverage |
| Operations | Deployment/rollback, CMS/editor and lead monitoring guides; local Git repository | Production hosting/TLS, backups/recovery, monitoring owners and client release approval |

This is a reviewable implementation with explicitly incomplete external release gates, not a declaration that the PRD's production definition of done has been met. No public deployment, fabricated certification or real email delivery occurred.
