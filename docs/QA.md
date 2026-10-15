# The Art of an Entrance — 15 October 2026

The homepage now includes an interactive, source-faithful Arch door study between collections and benefits. Production build and TypeScript pass. All **24 browser scenarios** and **15 backend/publication tests** pass; the complete browser report is `entrance-browser-results.json`. Five entrance scenarios verify actual opaque-leaf 3D rotation and fixed right hinges, continuous bounded dragging and reversal, touch taps and CDP swipes, preserved vertical page scrolling, keyboard and native slider control, runtime reduced motion (including mid-drag), rapid interrupted intent changes, no-JavaScript fallback, navigation cleanup and section accessibility.

Entrance layouts are checked at 320, 390, 768, 1024, 1440 and 1920px with no document overflow and the original leaf aspect ratio retained. Normal motion keeps the catalogue artwork opaque while it rotates from 0 to −82 degrees; reduced motion keeps rotation at zero and crossfades. Existing catalogue, enquiry, consent, menu, gallery, motion and SEO regressions remain covered. Verification uses Edge desktop and touch/mobile emulation; no physical-device or field-performance claim is made.

Source details, reproducible asset preparation, control behaviour and scope are documented in `entrance-experience.md`. Closed, half-open and open desktop captures, closed/open mobile captures and two actual interaction recordings are in `previews/entrance/`. The full-homepage capture script now includes this tenth chapter. This work adds no animation library, WebGL runtime, invented product engineering detail or change to the existing publication gates.

---

# Sonar / Upmind homepage redesign — 15 October 2026

The latest focused homepage redesign is documented in HOMEPAGE-REDESIGN.md. The supplied Sonar and Upmind screenshots and 25-second website video informed a woodland photographic hero, seven source-product collection routes, eight interactive editorial benefits, genuine construction studies, a deep-green quality chapter, architectural applications, native enhanced FAQs and a clear enquiry invitation. Original Satoshi and the supplied logo are retained. Responsive, pre-encoded AVIF hero sources have WebP fallbacks; the favicon is a small source-faithful derivative while the original logo PNG remains unchanged.

The layout audit covers all 22 routes at 320, 390, 768, 1024 and 1440px: all 110 checks pass without horizontal overflow. Evidence is in layout-audit.json, updated screenshots in previews/, and interaction recordings in previews/motion/. Native scrolling and SSR metadata are preserved. Testing uses Microsoft Edge desktop/mobile viewport emulation, with physical-device and field-CWV checks still outside this local audit.

Production build and TypeScript checks pass. All 15 backend/publication tests and 19 browser scenarios pass. The dedicated homepage scenarios also verify early keyboard focus, crossfading previews and text clearance at desktop/laptop widths, inline source imagery at tablet/mobile widths, interrupted FAQ transitions, runtime reduced-motion switching, no-JavaScript controls and accessibility. Catalogue, enquiry, consent, navigation, gallery, motion cleanup and SEO tests are retained. A further targeted homepage run covers the final intermediate-width preview refinement; results are recorded in homepage-interaction-results.json.

Final Lighthouse 13.5 production-preview lab scores: desktop Performance 99, mobile 89; Accessibility and Best Practices 100 in both. Desktop LCP is 0.93s with 0ms TBT; mobile LCP is 3.55s with 121ms TBT. CLS is 0 and both audits report no console errors. Intentional preview noindex keeps SEO at 69. Mobile LCP remains above the earlier 2.5s target; hosted/field measurement and further production tuning remain necessary. Samples are in redesign-lighthouse-summary.json. During refinement the first richer-hero run scored 77 mobile; pre-encoded AVIF, a 64px browser icon and deferred benefit-row entrance work reduced the critical payload and startup cost. Lab samples vary; no field CWV or physical-device pass is implied.

Forty current review captures cover nine homepage chapters and the full page at 390, 768, 1440 and 1920px in previews/homepage/. Desktop/mobile recordings include the revised benefit previews and native FAQ transitions. The earlier Soltera/industrial/Redow pass remains documented as design history. The original and repository logo source have identical SHA-256 hashes. No invented factory, certification, installation, customer metric or regional-experience evidence was introduced. Existing external publication/configuration prerequisites remain unchanged.

---

# QA report — 14 October 2026

Working local review build. This report distinguishes implementation checks from external launch acceptance.

## Completed

| Check | Result |
|---|---|
| Next.js 16.4 production build | Pass; TypeScript compilation passes |
| Backend and publication tests | 15 passing tests |
| Playwright browser scenarios on production build | 19 passing scenarios, Microsoft Edge headless; real GSAP progress and interaction assertions |
| Required route responses | 22 primary routes return 200; unknown products return 404 |
| Catalogue interactions | Search, empty state, clear filters, product navigation and quote context pass |
| Enquiry behaviour | Contact values retained after disabled-service response; no false receipt; trade requirements captured |
| Responsive layout | 110 checks: all 22 routes at 320, 390, 768, 1024 and 1440px without document horizontal overflow |
| Navigation | Animated desktop collection dropdown and mobile menu; keyboard focus, interruptions, Escape, responsive closure and inverse logo checks pass |
| Consent | Essential/analytics preference transitions pass; unconfigured preview makes no third-party requests |
| Automated accessibility | Axe scan of home, catalogue, PDP, quote and manufacturing pages passes tested WCAG A/AA tags |
| Browser runtime | No page errors on audited key routes |
| SEO preview guard | Noindex header/meta, robots disallow, empty preview sitemap, canonical tags verified |
| Resource guard | Unknown/unapproved download returns 404 |
| CMS implementation | Schema extraction succeeds; five GROQ queries parse; source importer validates 14 records |
| Media | Existing source products retained; four local architectural photos, one mobile derivative and four catalogue detail crops with provenance; no broken images in captured pages |
| Visual review | Forty current homepage captures at 390/768/1440/1920px, twelve interior captures, desktop dropdown/mobile menu captures and two interaction recordings; earlier PDP captures retained |

Test commands: `npm run typecheck`, `npm test`, `npm run build`, `npm run test:browser`. Browser tests default to http://127.0.0.1:3000; set `PURELINE_PREVIEW_URL` for another production preview port. The final build was tested at http://127.0.0.1:3001 using the bundled Node 24 runtime and installed Edge, independently of the existing development server. Raw browser and Lighthouse JSON is in ignored tmp/qa; reproducible browser tests are included source files.

## Earlier Lighthouse lab measurements (historical)

Lighthouse 13.5, local production server, headless Microsoft Edge. Final mobile performance audit: Performance **96**, Accessibility **100**, Best Practices **100**; LCP **2.64s**, total blocking time **70ms**, CLS **0**. Desktop: Performance **100**, Accessibility **100**, Best Practices **100**; LCP **0.6s**, CLS **0**. SEO **69** is expected while intentional indexing blocks remain in place.

The mobile LCP measurement exceeds the PRD's 2.5-second target in that run; do not claim the target is achieved. Local lab scores are not field Core Web Vitals, and INP needs real interaction/field measurement. Re-audit the approved hosted site with its final imagery, consent configuration and network profile. Final audit results, if regenerated, are summarised in lighthouse-summary.json.

The first checks identified low-contrast secondary text, a small-screen headline overflow and a wordmark accessible-name mismatch. These were corrected. Oversized collection/detail images were also assigned more accurate responsive size hints. Browser assertions were corrected where they initially assumed name-only search (search includes descriptions) or an unsupported test matcher; those were test issues, not hidden application failures.

## Not established by these checks

- Remote CMS editor login/save/publish/withdraw/readback; no Pureline CMS project has been connected.
- Live Postgres persistence, rate-limit concurrency, provider inbox delivery, retry scheduler and operational alerts. The code is implemented; deployment integration remains required.
- Approved UK product assortment, complete catalogue/SKU import, supported variants, image rights, factory ownership, certification or commercial/legal approval.
- Actual iOS Safari/Android testing, assistive-technology screen-reader audit or field CWV.
- Live GA event receipt, production consent audit, sales/CRM ownership, retention and privacy operations.
- Public hosting, domain/TLS, approved UK brochure or final release signoff. The supplied logo is implemented as requested.

The application deliberately stays non-indexed, unconnected to live submissions and labelled as a catalogue preview until these gates are resolved.
