# Pureline

A UK-first composite door catalogue and enquiry website, built with Next.js App Router, TypeScript, Sanity and a private PostgreSQL enquiry outbox.

**Status: working local design/review build. Not approved or deployed for public launch.** Authentic catalogue images and transcribed model data are marked for review. Live enquiries, approved downloads and optional analytics remain unconfigured. No certification, project, address, commercial approval or successful delivery has been invented.

## Run

Use Node 24 LTS (Sanity dependency supports Node 22/24/26; the current host's Node 25 emits an engine warning). Then:

```powershell
npm ci
npm run dev
```

Open the printed local URL, normally http://127.0.0.1:3000 . The server binds to loopback. Copy `.env.example` to `.env.local` only when configuring actual services. Never commit credentials.

```powershell
npm run typecheck
npm test
npm run build
npm start
npx playwright test
```

Browser tests use installed Microsoft Edge. They default to port 3000; set `PURELINE_PREVIEW_URL` to test another local production URL. Test artifacts are kept under ignored `tmp/qa` and `test-results`. Use `npm run test:browser` as an alias after installation.

## What is implemented

- Editorial homepage, seven family routes, searchable/filterable catalogue, 12 representative door/frame detail pages, image enlargement, contextual enquiry, trade journey, applications, accessories and supporting editorial/legal routes.
- Authentic image crops, original-source labels and exact page mappings. No generated/recoloured products.
- Cinematic photographic homepage, locally hosted authentic Satoshi, performance storytelling and exact catalogue construction/material studies. Architectural photographs are credited and identified as inspiration; sources and licences are retained in docs/creative-assets.json. See docs/CREATIVE-OVERHAUL.md.
- The subsequent focused homepage redesign uses the supplied Sonar and Upmind screenshots and the 25-second website video: woodland photographic hero, translucent catalogue study, seven collection routes, eight interactive benefit rows, a dark quality chapter, mixed architectural application imagery, native enhanced FAQs and a clear final quotation invitation. See docs/HOMEPAGE-REDESIGN.md. Native navigation, benefits and FAQs remain usable without JavaScript.
- Animated native mobile navigation, masked SplitText typography, ScrollTrigger image/grid reveals, desktop parallax, magnetic controls, reduced-motion support, consent preferences, local font serving and optimised responsive images.
- Sanity schema, approval-filtered server adapters, draft-only source importer, editorial page template and Studio configuration. Product/family/page/claim/download/contact records are separate from private leads.
- Validated enquiry API, durable private Postgres storage and notification outbox, origin checks, shared rate limits, idempotent provider delivery and retry job. No false “sent” state when services are absent.
- Canonicals, metadata, sitemap/robots, guarded downloads, draft noindex headers and error/404 states.

## Handover

- [Design, sitemap, benchmark and assumptions](docs/PLAN.md)
- [Source and claim approval register](docs/CLAIMS.md)
- [Exact product/source mapping](docs/source-products.json)
- [Media provenance](docs/assets-provenance.md)
- [CMS editor, import and setup guide](docs/CMS.md)
- [Private enquiry configuration and operations](docs/LEADS.md)
- [Release and rollback](docs/DEPLOYMENT.md)
- [QA evidence and remaining checks](docs/QA.md)
- [Visual redesign and GSAP motion system](docs/DESIGN-AND-MOTION.md)

## Content ownership

Local preview text lives in `src/lib/content.ts`, `src/lib/pages.ts` and the homepage layout. CMS-connected products and families replace local review fixtures; CMS failures do not silently fall back to fixtures. Editorial pages consume approved CMS page records. Navigation, contact information and experience statements use approved global content. The homepage and specialised journey templates include editorial copy requiring owner review; see deployment checklist for approval and integration limits.

Local preview content must never be promoted merely by toggling `SITE_LAUNCH_APPROVED`. The live layout requires approved CMS global content, catalogue queries require per-model approvals, and legal pages require approved CMS replacements. Complete the release checklist first.
