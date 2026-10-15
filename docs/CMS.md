# Pureline content management

The standalone Sanity Studio manages product families, individual products, specifications, evidence, downloads, pages, navigation, footer, contact details, SEO and redirect records. Leads belong to the private application database and are deliberately absent from Sanity.

## Connect an owned project

No Pureline remote project, dataset, deployed Studio or content import has been created by this implementation. Choose an account-owned Pureline project and dataset. Do not point this site at an unrelated project.

Set these in `.env.local` (copy identifiers from your Sanity project):

```dotenv
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
# Server-only, needed when the dataset is private:
SANITY_API_READ_TOKEN=
```

Use a private dataset if approval evidence or unpublished catalogue research is confidential. Sanity file assets have publicly reachable URLs when shared; do not upload private correspondence, personal data or lead details as evidence. Store a redacted approval record or a reference to the private source instead.

Run `npm run studio` and open the local URL printed by Sanity. The Studio uses `SANITY_STUDIO_*` variables; the server uses `SANITY_*`. A project ID alone is not a secret. Never put read/write tokens in variables beginning with `NEXT_PUBLIC_` or `SANITY_STUDIO_`.

After confirming the target project, run `npx sanity schema extract` to validate/extract the schema, `npx sanity schemas deploy` to make it available to Sanity MCP, and `npm run studio:build`. Deploy the Studio to the organisation's chosen hosting and add only the required CORS origins. Sign in as an editor and test creating, editing, publishing and withdrawing a record before launch. The Next.js build does not import the standalone Studio configuration and can run without Studio credentials.

## Editorial workflow

1. Create a product family and set its slug. Fill descriptions and applications. Upload an authorised image and tick its rights approval. Enable **Approved for website** only when this editorial content is approved.
2. Create each real catalogue model as a Product; reference its family. Record the exact original file, one-based page number, printed label and source image reference. Add only source-supported variants. Do not turn catalogue summary dimensions into SKU specifications.
3. Add specifications separately with units, source evidence, reviewer and approval date. Only specifications with `verified` status reach the public site.
4. Add the primary image and gallery assets, authored alt text and rights approvals. A gallery image needs its own approval. The primary image must be a real representation of the model.
5. Have the accountable product owner set verified status, UK availability approval, image-rights approval, reviewer and date. Enable **Approved for website**, then publish the document. All four public-product gates and a published parent family must pass. Merely pressing Publish does not make an unapproved product public.
6. Certificates and other claims have their own evidence record, exact approved wording, product scope, evidence attachment, reviewer, approval date and publication permission. Certificates additionally require the actual certificate holder, source file, valid issue date and an expiry date or explicitly reviewed non-expiring status. Issue and approval dates cannot be in the future, and approval cannot precede issue. Expired, malformed or incomplete claims are excluded at request time, including documents written directly through the API. A certificate does not establish approval for the whole range.
7. Add downloads with version, language, UK market, approval date, approver, rights permission and verified status. Link certificate downloads to their certificate record so expiry is enforced. The Resources page fetches approved records only.
8. Edit pages using semantic sections and FAQs. Use the page slug that matches the route (the homepage is `home`). Each section/FAQ has its own verification status. References to experience, factory ownership or performance belong in claim records. Verify and approve the page before publishing.
9. Use **Site settings** for approved brand, navigation, footer links, official contacts, metadata and experience statements. It is a singleton document named `globalContent`. Changing the public contact email does not change the private lead-delivery destination; update the server environment separately.
10. Withdraw a product or download by clearing **Approved for website** and publishing the change. Mark a disputed claim `withheld` and publish it. Frontend reads bypass CDN and Next fetch caches so withdrawal is not delayed by the application data cache.

Studio validation is a convenience, not an access-control boundary: API mutations bypass Studio validation. Public GROQ queries and server checks independently enforce the publication conditions. Restrict write tokens to responsible editors and keep them off the website runtime.

## Server integration

`src/sanity/content.ts` exports `fetchCmsProducts()`, `fetchCmsFamilies()`, `fetchCmsPage(slug)`, `fetchCmsGlobal()` and `fetchCmsDownloads()`, with `CmsProduct`, `CmsFamily`, `CmsPage`, `CmsGlobal` and `CmsDownload` types. Queries are defined with `defineQuery` in `queries.ts`; the server-only client uses the published perspective and a fixed API version.

When no server project/dataset is configured, list fetchers return `null` so the application can deliberately choose its local review-preview mode. An empty configured dataset returns an empty array; it must not fall back to unapproved local products. A partial configuration throws a helpful error. Network/authentication/query failures propagate instead of silently showing demo data. Page and global fetchers also return `null` for an absent approved document; the application must distinguish missing CMS content from preview defaults in launch mode.

Family and page content, metadata, navigation and approved downloads need to be read through these functions in the corresponding application routes. Redirect records are returned by `fetchCmsGlobal`; applying redirects requires the application's route layer and should reject loops and external destinations.

## Source import and verification

`docs/source-products.json` is a local research source produced from the supplied catalogues. It is not proof of UK availability, rights or technical certification. Import into drafts with `verificationStatus: needs_review`, `ukAvailabilityStatus: needs_review`, `imageRightsApproved: false` and `isPublished: false`. Never convert a request for creative invention into a certificate, image licence, commercial approval or reviewer identity.

Map model names, pages and image files explicitly. Import files as Sanity image assets and store the returned asset references, rather than reusing local `/images` URLs. Let Sanity generate ordinary document IDs, store source identity in `externalId`, and resolve families/references from returned IDs. Do not use names/slugs as fabricated document relationships. Verify imported drafts in Studio before asking an authorised owner to approve publication.

Run the included importer locally with `node --import tsx src/sanity/import-source.ts`. Its default dry run checks the source records and local images without contacting Sanity. To create drafts, set `SANITY_API_WRITE_TOKEN` in a private `.env.local` and run `node --env-file=.env.local --import tsx src/sanity/import-source.ts --write` after verifying the destination project. It creates random draft IDs, uploads the original crops, preserves source metadata, keeps all gates closed and skips existing source identities. It never overwrites existing documents or publishes anything. Family references start weak because their targets are drafts; publish an approved family first, then strengthen the product reference in Studio. Remove the write token after import; the website requires read access only.

Tests in `tests/publication.test.ts` cover missing publication gates, per-specification evidence/reviewer/date approval and certificate expiry/permission/evidence/holder/source/date integrity. Specifications without a source file, reviewer and valid non-future approval date are removed by the server even if an API mutation marks their status verified. Run `npm test` and `npm run typecheck`. Remote Studio save/publish/readback is still a deployment acceptance check until real Pureline credentials and approved content are supplied.

Local implementation checks completed: all five GROQ queries parse; the Sanity CLI successfully extracted the schema; the importer dry run validated 14 catalogue models across seven families; all four publication test groups passed. Schema extraction used a process-local placeholder project identifier and did not create or modify a remote project. These checks do not establish a functioning remote CMS integration.

Launch-mode homepage, applications and accessories use the approved semantic CMS page template; the local editorial layouts are review designs. Header navigation, footer text/links, contact/experience statements and family/product data are wired. Specialised quote/trade/resources templates retain some baseline UI copy. Before release, populate and visually review approved CMS pages and complete any additional template-level editing needs.
