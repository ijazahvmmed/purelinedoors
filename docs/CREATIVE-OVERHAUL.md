# Pureline — cinematic architectural refinement

14 October 2026. Implemented in the existing Next.js application; catalogue records, routes, publication gates, Sanity queries, enquiry service and SEO remain intact.

## Direction and supplied references

The three supplied screenshots have now been read and compared with the running site: Soltera (`3aebf415159611f206e0226330c70d3e.png`), the industrial/engineering layout (`bbf359cda7d03f9e262cee9a660f4a44.png`) and Redow (`43bddc8ef8a2d3f2f88e7d90a04aa03f.png`). They remain reference material in the user's Downloads folder and are not republished as website assets.

Soltera informs the oversized photographic brand treatment, navigation over the image, catalogue study in the hero and compact supporting panels paired with a larger image story. The industrial reference informs the ruled specification matrix, expandable evidence rows, technical drawings and precise source-labelled measurements. Redow informs the numbered process rhythm and product-focused closing invitation. Pureline's colours, source products and architectural photography remain its own. Reference statistics, factory renders and unrelated energy products are not transferred into the site.

## Implemented

- Authentic Fontshare Satoshi throughout the interface, locally served with Next.js font optimisation. One original variable WOFF2 covers Regular 400, Medium 500, Bold 700 and the available Black 900 weight. No font file conversion or subsetting. The downloaded ITF Free Font License is retained in `src/app/fonts/FFL.txt`.
- User-supplied interlocking green symbol in the header, mobile menu, footer and favicon. The original transparent PNG is preserved in `public/brand/pureline-symbol.png`. A CSS white inverse over the hero and dark mobile menu retains the exact image geometry and returns to green on the paper navigation surface; the no-JavaScript masthead also uses green.
- Framed, full-width photographic hero, oversized Pureline identity, confident Satoshi headline, two clear CTAs, architectural credit and an authentic Arch catalogue study. Floating navigation changes to a paper surface beyond the hero. Mobile uses a separate crop, compact image-led catalogue study and full-width touch targets.
- Asymmetric typographic introduction; all seven existing collections with original product imagery; an accessible, regular model grid.
- Performance storytelling through a large exterior photograph, compact supporting thermal/acoustic studies with genuine catalogue imagery, a second interior story and a ruled, expandable specification matrix. Weather, thermal, acoustic, durability, maintenance, versatility, security and specialist fire requirements are covered without fabricated performance promises.
- Precise engineering register for the ENM 4 Panel catalogue reference, alongside an authentic ENM family frame diagram. Source dimensions remain explicitly frame dimensions; exact model applicability of the family drawing requires confirmation.
- Real Rectangle Top surface detail, residential/commercial application stories, typography-led manufacturing/quality chapter, clear numbered process and a product-led quotation invitation. Catalogue details in closing invitations are explicitly gated to the preview; approved CMS content remains required in live mode.
- Satoshi and revised hierarchy extend through collections, product detail, editorial pages, resources, navigation and forms. Applications and selected editorial pages receive credited architecture or source diagrams. The CMS homepage now uses its approved hero title, introduction, photograph, sections and claims in the cinematic system.
- GSAP context cleanup, responsive SplitText, image apertures, small desktop parallax, independent grid/hover layers and magnetic labels remain. Performance image reveals are paired with masked heading lines and supporting text; text waits until its own position reaches the viewport. A sequenced desktop collection dropdown supports direct browsing, Escape/focus restoration, outside clicks and responsive closure. Explicit gallery zoom, native mobile menu focus trapping, page entrances and tactile buttons are retained. Reduced-motion preferences settle automatic motion immediately. Without JavaScript, a readable masthead and full navigation remain available, alongside native specification controls and server-rendered content.

## Assets and rights

Four architectural photographs are sourced from individual Pexels pages, downloaded, reviewed and stored locally as WebP. Creators: Max Vakhtbovych (exterior and residential interior), Nici Gottstein (woodland entrance), ready made (public interior). Photography is labelled architectural inspiration, never Pureline installations or facilities. Sources, download URLs, dimensions, licence and intended roles are recorded in `creative-assets.json`.

The mobile hero uses a separate 734 × 1468 portrait crop from the same exterior source, selected through a responsive picture source. It avoids downloading a landscape image for a tall mobile aperture. The hero is eager-loaded with high fetch priority; approved CMS hero photography retains its own responsive source.

Three construction/material details and one bathroom-family photograph are exact crops from the supplied original catalogue. The specialist collection now uses the actual Bathroom / Door photograph on PDF page 16 rather than an exterior glazed model. These are source references, not newly approved products or performance evidence. Reproduction commands are in `scripts/prepare-creative-assets.py`; original PDFs are unchanged.

Font source: https://www.fontshare.com/fonts/satoshi — official download API. Licence source: https://www.fontshare.com/licenses/itf-ffl. Photo licence: https://www.pexels.com/license/.

The original Satoshi WOFF2 is 42,588 bytes; SHA-256 `e739aff9b4d02c264341d6d4872edcda28e79373aeda936f659566a1cd3eb47f`. The official companion font identifies the Satoshi Variable family and weight axis 300–900. Production browser checks verify the locally loaded family.

## Factual limits

Existing launch gates remain closed for unapproved UK availability, source image rights, certification/model scope, factory ownership and UAE/Saudi experience. No factory photo, market achievement, warranty, test value, customer or installation is invented. Live enquiry delivery and CMS publication retain their existing configuration requirements.

Verification evidence is maintained in `QA.md`, browser reports, layout audit, refreshed screenshots and desktop/mobile interaction recordings. Browser checks use Edge with desktop, tablet and mobile viewport emulation; physical-device or field Core Web Vitals results are not implied.
