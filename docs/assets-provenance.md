# Catalogue asset provenance

All assets were extracted from supplied local PDFs. No product shape, finish, glazing, hardware or colour was generated or changed. WebP export is lossy quality 94; exact crop coordinates and original dimensions are in `source-products.json`. Crops exclude surrounding catalogue claims and logos. Original PDFs remain unchanged.

## Source files inspected

- `PURELINE DOOR.pdf`: 23 raster pages, 3300 x 2550 pixel page images on product pages. Primary source for product crop pixels and original appearance.
- `Pureline_GRP_Door_Catalogue (2).pdf`: 25 pages. Contains the same product sheets at lower resolution, with searchable headings. Used to corroborate product labels and identify families. It contains broad performance and certification claims; those are not treated as verified evidence.
- `Pureline x DFG India Catalog-selection.pdf`: one application/brand narrative page. No usable model catalogue, market approvals or partnership evidence. Do not infer an authorised commercial DFG relationship from this page.

## Product records

`source-products.json` contains 14 visually verified source labels, family, stable local image path, original file/page/crop, and legible catalogue specifications. Every record has `reviewStatus: needs_review`, `ukPublished: false`, `ukAvailabilityConfirmed: false`, `imageRightsConfirmed: false`, and `certificationApproved: false`.

| File | Catalogue product label | Source PDF page |
| --- | --- | --- |
| arch.webp | Arch | 10 |
| twin-vertical.webp | Twin Vertical & W/Transom | 7 |
| triple-square.webp | Triple Square & W/Transom | 9 |
| single-diamond.webp | Single Diamond | 9 |
| rectangle-top.webp | Rectangle Top | 10 |
| half-glazed.webp | Half (4p) Glazed | 7 |
| enm-four-panel.webp | ENM Metal 4 Panel | 11 |
| smooth.webp | Smooth | 13 |
| smooth-two-panel.webp | Smooth 2 Panel Molding | 13 |
| sight-glass.webp | 8 Feet Smooth (within Sight Glass / Inner / Balcony family page) | 15 |
| abs-sda-307.webp | SDA-307 | 22 |
| abs-sda-302.webp | SDA-302 | 22 |
| grp-hinged-frame.webp | Hinged Door Frame | 17 |
| shoe-cabinet.webp | Shoe cabinet with 3 compartments | 19 |

Dimensions explicitly headed width/height of the **door frame** remain labelled that way. They are not leaf dimensions. Values with slashes are transcribed as printed. In particular, smooth products print width `970/824`; do not resolve that ambiguity without manufacturer clarification. Cabinet and frame images represent a design with several listed sizes. The JSON records one clearly legible example source model, not a unique identification of the photographed size.

## Editorial image

`entrance-editorial.webp` is the exact 675 x 880 pixel architectural image embedded on page 1 of `Pureline_GRP_Door_Catalogue (2).pdf`. It is suitable for a local editorial layout preview. Its rights and depicted manufacturer/model are unverified. Do not describe it as a Pureline supplied project, named catalogue door, UK installation, or proof of product performance. Source role: catalogue-cover inspiration. No upscaling applied.

## Visual verification

`assets-contact-sheet.jpg` displays all 14 final product crops. Reviewed visually after extraction: each crop contains the whole pictured product without source marketing text; glazing, handles, grain and proportions are preserved. The Arch, Twin Vertical, Triple Square and smooth product identities were checked against their adjacent source labels. The extraction scripts are in `scripts/inspect_catalogues.py`, `scripts/extract_catalogue.py`, `scripts/extract_original.py`, and `scripts/build_catalogue_assets.py`.

## Outstanding publication evidence

Approval remains required for UK-specific range/availability, image rights, manufacturer attribution and relationships, certificate validity and model/configuration scope, measured performance, warranties, lead times, contact details, and regional project/experience claims. The source catalogues are review materials, not independently verified evidence. No UAE/Saudi experience or DFG relationship was invented.
