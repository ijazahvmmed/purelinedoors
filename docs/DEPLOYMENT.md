# Deployment and rollback

## Intended host
Node 24 LTS with a Next.js-compatible host (for example a managed Node runtime), a Pureline-owned Sanity project, managed PostgreSQL and a verified transactional sender. Hosting has not been provisioned. Keep previews private using hosting access protection; robots/noindex is not access control.

## Launch gates
1. Approve final wordmark/logo, brand/legal entity, domain, UK contacts, service and supply/installation scope.
2. Approve all public copy and imagery rights. Replace the catalogue-cover inspiration with approved high-resolution imagery for a full-width production hero; current 675×880 original is intentionally limited to a portrait panel in the local preview. Do not imply an installed Pureline project.
3. Connect Pureline's Sanity project. Import source records as drafts, inspect them, approve actual UK assortment, and test an editor's publish/edit/withdraw workflow. Do not use an unrelated existing project. Confirm family slugs and image sources. Complete any remaining full-SKU migration; twelve models in the site are a representative slice.
4. Publish approved global content and editorial pages, especially privacy/terms/contact/manufacturing. Replace draft legal text with the actual controller, processors, retention and rights-request details. Approve the homepage and specialised journey copy, or complete additional CMS template wiring if editors require every layout sentence editable.
5. Configure lead environment and private SQL schema exactly as LEADS.md. Verify sender/inbox/CRM destination with owner. Exercise accepted/sent, saved/pending, provider failure/retry, database failure, rate-limit, duplicate retry, invalid payload and cross-origin requests in staging with a test inbox. Set delivery monitoring, queue scheduler and escalation ownership.
6. Verify approved brochure and technical files, certificate owner/scope/expiry/permission, download URLs and claims. No source PDFs are copied to public hosting.
7. Set HTTPS NEXT_PUBLIC_SITE_URL and reviewed analytics ID only if wanted. Test no analytics before consent, revocation, event uniqueness and final cookie notice. Enquiry acknowledgement is not marketing consent.
8. Run `npm ci`, typecheck, unit tests, production build and browser tests on the chosen host/runtime. Repeat on actual iOS Safari and Android, perform keyboard/screen-reader review, and measure mobile/desktop Lighthouse and post-launch field CWV. Current lab checks do not prove field performance.
9. Configure domain/TLS, host access control, uptime/log alerts, managed backups, recovery tests and database retention cleanup. Retain original assets in an owner-controlled archive.
10. Record accountable signoff, then set SITE_LAUNCH_APPROVED=true and rebuild. Check live robots, sitemap, canonicals, all routes and delivery. The approved CMS identity is mandatory in launch mode; no local products are substituted in launch mode. A flip of this variable is not approval by itself.

## Release
Create a versioned Git release after approved review. Store secrets in the host's secret manager; use minimal read-only Sanity access on the website. Build with `npm run build`, start using the host's Next adapter or `npm start`. The repository start command intentionally binds to loopback; production reverse proxy/container configuration must expose only the intended ingress and sanitise the configured client-IP header. Schedule `npm run leads:retry` with non-overlapping monitoring. See provider acceptance vs inbox delivery distinction in LEADS.md.

## Rollback
Retain the previous immutable app build and environment revision. Roll back application code to that known-good release, then smoke-test catalogue and enquiry paths. Do not delete the private database or outbox: previously accepted leads must remain deliverable. The initial SQL migration is additive; keep its schema intact. For content errors, withdraw the offending CMS record and publish the withdrawal; server reads bypass the CDN cache. Revert content from Sanity history under owner control. If enquiry handling is unsafe/unavailable, set LEADS_ENABLED=false and redeploy; the UI/API will disclose unavailability rather than claim receipt.

## Monitoring and support
Monitor response status/latency, origin/rate-limit errors, durable queue age, provider failed/manual_review states, sender bounces and actual sales-inbox delivery. Log references and operational states rather than personal message bodies. Review expiring evidence and content approvals before renewal. Document the person responsible for responding to enquiries and handling privacy requests before enabling intake.
