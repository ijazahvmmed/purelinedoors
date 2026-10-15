# Pureline homepage — Sonar / Upmind reference pass

Completed 15 October 2026. Reference study and source photography preparation began on 14 October.

14 October 2026. A focused redesign of the existing homepage, with the supplied Pureline logo and original Satoshi font retained. Existing routes, catalogue records, enquiry service, publication gates, metadata and CMS queries remain in place. Homepage-specific presentation is in `src/app/homepage.css`; the approved CMS homepage uses the same atmospheric hero and primary enquiry CTA with its own approved photograph and copy. Approved CMS content is still required in live mode, and catalogue-only visual content stays in the preview branch.

## References actually inspected

- Sonar screenshot: `feb06ba4791a7ac30a90db8768623837.png`. Photographic hero, understated oversized type, three-column imagery, full-width editorial benefit rows and an active visual preview.
- Upmind screenshot: `7c5fbbb814fc986d60801d084ace8ee4.png`. Natural light, deep green, restrained supporting information and a deliberate transition into lighter editorial content.
- `downloaded-file.mp4`: 25.427 seconds, 720 × 540. Inspected in Edge at eight evenly spaced positions. Its photo-led hero, mixed component proportions, split FAQ, thin separators and final invitation informed the composition. Financial dashboards, business metrics, logos and testimonials were not transferred.

## Resulting composition

1. Woodland architecture hero with translucent catalogue study, subtle COMPOSITE DOORS background typography and one clear green enquiry CTA. The image aperture leads the line reveals; supporting copy follows, with actions arriving after the headline. Navigation sits over an image contrast treatment and becomes a paper surface after the hero.
2. An asymmetric brand statement and two compact supporting paragraphs.
3. Three tall source-product plates, followed by a compact four-part collection index. All seven family links and four real model links remain discoverable. Homepage image size hints reflect the actual rendered door widths.
4. Eight Sonar-inspired benefit rows. Desktop hover/focus changes the selected row and crossfades a genuine photographic or technical preview. A reusable GSAP position tween keeps it aligned. Text and notes reserve space around the preview. Native summary controls open the explanations; tablet and mobile show inline source imagery.
5. One architectural performance story, a GRP construction study and an ENM frame register. The ENM 4 Panel's printed thickness and frame dimensions retain source/page and model-scope qualifications.
6. A deep-green quality chapter with the original catalogue drawing and three evidence questions. No factory photograph, ownership claim, partnership or certificate is invented.
7. Domestic and project applications with intentionally different image orientations and offsets.
8. Native, enhanced FAQ disclosures and a centred quotation invitation with the original three-step enquiry journey.

## Photograph and source controls

The new photograph is [Max Vakhtbovych’s woodland residence](https://www.pexels.com/photo/a-house-with-a-modern-design-7598374/), sourced under the [Pexels License](https://www.pexels.com/license/). Desktop WebP and a separate mobile portrait crop are locally stored, with provenance and crop coordinates in `creative-assets.json`. Pre-encoded responsive AVIF sources lead the hero picture; WebP remains the fallback. The eager, high-priority request is discoverable in the server-rendered markup and needs no runtime encoding for AVIF-capable browsers. Preparation is reproducible with `scripts/prepare-homepage-assets.py`. The same script derives a proportion-preserving 64px favicon from the original logo; the original PNG and its white inverse are retained in the interface. No retouching, synthetic product placement or UK-location claim is made. Existing credited architecture and exact catalogue crops are retained for applications, benefits and construction.

Benefit descriptions distinguish useful specification questions from certified performance. No numerical thermal, acoustic, security, durability or fire metric is invented. Specialist fire references require availability, tested assembly, rating and installation confirmation.

## Interaction and verification

New disclosures use native details/summary semantics. GSAP animates an interruptible opening and shorter closing sequence, cleans up on unmount and immediately settles an active transition when reduced motion is requested. The native controls, explanations and inline imagery remain usable without JavaScript on desktop and mobile. Source typography, gallery, grid, menu and hover systems remain in use.

Three dedicated browser scenarios check preview motion/position at 1024, 1280, 1440 and 1920px, keyboard activation before an entrance finishes, inline images at 768/390/320px, rapid accordion interruption, reduced-motion switching, local source qualifications, accessibility and desktop/mobile no-JavaScript controls. Benefit-row entrance tweens are created when their section approaches the viewport; focused controls stay visible. Existing catalogue, quote, navigation, consent, motion and SEO scenarios continue to run. Final results are recorded in `QA.md` and the JSON evidence files.

`scripts/capture-homepage.mjs` saves nine chapter captures and a full homepage at 390, 768, 1440 and 1920px. `scripts/capture-motion.mjs` records the new benefit and FAQ interactions along with navigation, product hover and gallery zoom. Preview and local browser emulation do not establish physical-device testing, field Core Web Vitals, remote CMS publication or live enquiry delivery.
