# Pureline visual and motion refinement

14 October 2026. A visual overhaul of the existing site. Product data, source mappings, publication conditions, SEO metadata, quote handling and CMS integration are retained.

## Art direction
An architectural journal and materials library: warm paper, ink and restrained forest green; an unadorned masthead; authentic Satoshi throughout, with bold architectural headlines and measured supporting copy; thin structural rules; asymmetric collection plates and quiet photographic captions. The cinematic hero, collection index, performance stories, material study, model library, manufacturing chapter and enquiry journeys use different compositions. Promotional card backgrounds, arbitrary oversized decorations, faux slide numbers and decorative feature icons have been removed. Product pictures remain authentic source references. The subsequent comprehensive creative refinement is documented in CREATIVE-OVERHAUL.md.

The redesigned system extends to product details, collections, trade/contact forms, resources, FAQs, editorial/legal pages, mobile navigation and the footer. Mobile enquiries put the selected door and form before supporting guidance, with source order matching the visual priority. Main body copy is more readable; mobile titles are smaller, door proportions are preserved, and the image viewer remains available.

## Implemented choreography
| Element | Behaviour |
|---|---|
| Hero | Masked lines resolve in sequence; photographic aperture and small scale correction; supporting copy and actions enter later |
| Page navigation | New route's heading and supporting content enter without delaying the link or replacing native history/scroll behaviour |
| Section headings | SplitText masked lines; manufacturing/enquiry statements use individually staggered words |
| Material/editorial images | Directional clip reveal; large images have isolated parallax layers on desktop |
| Product library | A restrained grid stagger with independent hover layers; filtering reinitialises the grid without replaying the entire page |
| Cards | Fine-pointer desktop lift/scale and directional arrow; keyboard focus remains usable |
| Buttons | Bounded 4px/2px magnetic label movement, arrow response, background sweep and tactile press state |
| Navigation | Animated native modal, sequenced links, shorter exit, Escape/focus restoration and background scroll containment |
| Collection dropdown | Compact desktop catalogue navigation with a masked entrance, staggered links, keyboard focus restoration, outside-click closure and reduced-motion support |
| Specification matrix | Native disclosure rows; scrolling cues refresh after a row opens or closes so later chapters remain correctly positioned |
| Product viewer | Smooth, reversible detail zoom; explicit controls and native enlarged-image dialog |
| Editorial rows | Small directional entrances distinct from the heading and photographic treatments |

The shared easing vocabulary lives in `src/lib/motion.ts`; individual sequences have their own durations and stagger. Primary ease is power3.out; apertures use power2.inOut/power3.inOut; scrubbing is limited to small desktop photographic translation. Native scrolling remains in control. CSS handles simple underlines and press feedback; button entrances animate their surrounding composition so inline transforms cannot override the pressed state. No extra scrolling or animation library is installed.

## Lifecycle, access and performance
GSAP/useGSAP contexts collect timelines, tweens and ScrollTriggers. MatchMedia changes revert desktop-only effects and reduced-motion preferences. SplitText autoSplit responds to font/width changes; all splits are reverted during cleanup. The route container is keyed to its pathname so external text-splitting markup never becomes part of React's next route reconciliation. Filtered grids use their product IDs as animation dependencies. Event listeners are removed, and focus promptly resolves interactive reveal states.

Reduced motion bypasses automatic text/image/grid entrances and parallax. Menu changes and explicit viewer zoom settle immediately. Text stays server-rendered and visible when JavaScript is unavailable; a readable masthead and complete navigation are provided without JavaScript. Native specification disclosures work in that state as well. Splitting adds screen-reader text labels, and the mobile dialog provides focus containment. Transforms are isolated across container entrance, inner hover and photographic parallax layers; layout dimensions are never tweened. Images/fonts are served through the existing optimised pipeline.

## Verification
Run `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:browser` against the running production server. Use Node 24 LTS. Browser scenarios cover actual style progress, scroll-triggered apertures, line/word splitting, parallax, hover/magnetic recovery, reversible viewer zoom, modal animation/focus, repeated navigation/filtering, runtime reduced-motion changes, responsive resizing, no-JavaScript content, accessibility and the existing enquiry/SEO paths.

`scripts/capture-preview.mjs` saves desktop/mobile home and product captures after visiting each section. `scripts/capture-motion.mjs` records the actual desktop/mobile interaction sequence. Evidence is in `docs/previews/` and `docs/previews/motion/`. The tests use installed Edge with a desktop viewport and mobile viewport emulation; they do not claim a physical iOS/Safari device audit or field Core Web Vitals.
