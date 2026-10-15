# Private enquiries and notification outbox

The API is deliberately unavailable until a real destination, private database, trusted ingress and approved privacy notice are configured. A disabled form receives HTTP 503 and never reports a message as sent. No accounts, databases, mailboxes, scheduled jobs or credentials are created by this repository.

## Activate deliberately

1. Provision an organisation-owned private PostgreSQL database. Apply `scripts/leads.sql` through an authorised database administrator. It creates a dedicated `pureline_private` schema and revokes public access. Give a dedicated server role schema usage and only the necessary select/insert/update/delete permissions on its tables; do not give a browser/anonymous role access or expose this schema through a data API. Enforce encrypted database connections using the provider's certificate configuration. These tables must never be exposed through Sanity or another public data API.
2. Supply a verified Resend sender domain and a real monitored sales inbox. Complete an authorised end-to-end smoke test using synthetic contacts before accepting live enquiries.
3. Review the actual privacy notice, controller identity, processor arrangements, retention period and enquiry handling with the business owner. This code captures acknowledgement of that notice; it does not enrol anyone in marketing.
4. Set the following server environment variables, then enable the feature. Only the site origin is public.

| Variable | Meaning |
| --- | --- |
| `LEADS_ENABLED` | Exactly `true` activates the route when all other requirements are present. |
| `LEADS_PRIVACY_APPROVED` | Exactly `true` after the notice and processing arrangements are approved. |
| `LEADS_PRIVACY_NOTICE_VERSION` | Approved notice version, recorded with each acknowledgement, for example its publication date. |
| `DATABASE_URL` | Private PostgreSQL connection URL; use provider-required TLS and certificate validation. |
| `RESEND_API_KEY` | Server-only sending credential. |
| `LEADS_FROM_EMAIL` | Plain email address on a verified sending domain, without a display name. |
| `LEADS_TO_EMAIL` | Approved, monitored sales inbox. |
| `NEXT_PUBLIC_SITE_URL` | Exact website origin; HTTPS is mandatory in production. |
| `LEADS_RATE_LIMIT_SECRET` | Random secret of at least 32 characters for keyed IP/email hashes. Keep stable while retries are active. |
| `LEADS_TRUSTED_IP_HEADER` | Lowercase header name overwritten by the trusted deployment ingress with the real client IP. |

Do not simply trust a client-provided `x-forwarded-for`. Verify that the deployed ingress removes/overwrites the configured header, blocks direct access to the origin and supplies an actual address. The API refuses requests without a valid value. For local development, provide an IP header yourself and use a localhost site origin. HTTPS, access policies, header integrity and database availability require deployment verification, not just environment strings.

## Request and response contract

`POST /api/enquiries` accepts JSON with a same-site `Origin` header. Maximum body size is 16 KiB even without `Content-Length`. The accepted fields are `leadType` (`homeowner`, `trade`, `specification`), `name`, `email`, optional `phone`, UK `postcode`, optional `productId`, optional `configuration` (at most 20 short string preferences), optional `quantity`, optional `company`, optional `timeline`, `message` (10–3000 characters), `privacyConsent: true`, and `sourcePage` (a local path without query data). Trade enquiries require company and an integer quantity. `website` is an empty honeypot. Optional attribution accepts only `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`, limited to 100 characters each. Do not put personal data into attribution.

Pass a fresh browser-generated UUID in optional `submissionId`. Keep it and the exact payload for retries after a network/503 error. Create a fresh UUID when starting a separate enquiry or changing an uncertain submission's payload. A repeated matching submission ID returns the existing reference without creating another row or notification. Conflicting data under an existing ID returns 409. UUID possession alone does not reveal any stored contact data.

The server resolves the selected product through `getProducts()` and stores its actual ID, name, slug and family. A client-supplied `productTitle` is discarded. Configuration values are requested preferences to be confirmed by staff, never an assertion of product compatibility or availability. Product IDs must belong to the current public catalogue.

| Result | Meaning |
| --- | --- |
| 201, `received: true`, `notification: sent` | Enquiry committed to PostgreSQL and email provider acknowledged the notification. This does not prove inbox delivery. |
| 202, `received: true`, `notification: pending` | Enquiry committed; notification is queued or needs operator review. Show the reference and do not resubmit. |
| 400 / 413 / 415 / 422 | Malformed, oversized, wrong media type, or invalid/spam submission. |
| 403 | The browser origin was not accepted. |
| 409 | A submission ID was reused for different data. |
| 429 | Persistent rate limit reached; `Retry-After` is supplied. |
| 503, `received: false` | Disabled, missing ingress configuration or persistence could not be confirmed. Retry an uncertain request with the same submission ID. |

Rate limiting uses a PostgreSQL upsert inside the storage transaction: five accepted enquiries per IP in a 15-minute window and three per email in an hour. The keys contain HMAC hashes rather than raw addresses. There is no process-local production limiter. Fixed windows can allow a boundary burst; deploy request/concurrency limits at the trusted edge as well. Invalid submissions are rejected before persistence. No user values or provider response bodies are written to application logs.

## Durable delivery and retry

The lead and frozen email payload enter PostgreSQL in one transaction. Notification happens only after commit. Email uses a per-lead Resend idempotency key, an atomic two-minute database lease and an increasing retry interval. Sender, recipient, reply-to, subject and body are frozen with the job so subsequent configuration or code changes do not change a retry payload. Only authenticated database access can read the private queue.

Schedule `npm run leads:retry` every five minutes using the deployment's authorised scheduler, with the same server environment as the website. This is a local administrative script, not a publicly callable cron endpoint. It processes at most 100 eligible jobs, releases expired leases, removes rate buckets older than two days and emits aggregate counts without contact data. Configure a monitor for nonzero exits, an absent scheduler heartbeat, pending jobs older than 15 minutes, and any `manual_review` rows. The repository does not silently create a schedule or a monitoring service.

Resend retains idempotency keys for 24 hours ([official documentation](https://resend.com/changelog/idempotency-keys)). Automatic attempts stop 23 hours after the first attempt and enter `manual_review`; this prevents a later retry from sending a duplicate when an earlier response was lost. A crash before the first attempt leaves a durable pending job; a crash after a provider acknowledgement can be retried under the same key. If notification status cannot be written, the user still receives an honest saved/pending response.

For manual review, inspect the provider dashboard using the reference/provider ID and private database access. Establish whether delivery occurred before taking any action. Mark confirmed accepted notifications as sent; for a demonstrably unsent notification, arrange a deliberate resend and audit that intervention. Do not blindly reset old `first_attempt_at` timestamps or resend after the idempotency window. An API acceptance is not a guarantee of inbox delivery: check provider bounces, suppressions and mailbox routing through the provider dashboard. A signed delivery-event webhook can be added when that operational integration is approved.

## Privacy, operations and verification

Set and document a business-approved retention period before launch. Both `leads.payload` and `lead_outbox.notification` contain contact details. Delete a lead by its UUID to cascade deletion of its outbox; include mailbox copies, provider retention and database backups in the actual retention/access/deletion policy. Use least-privilege staff access, encrypted storage/backups and an audited process for subject requests. The migration does not invent a retention duration or delete leads automatically.

`npm test` covers validation, privacy acknowledgement, trade requirements, postcode shapes, product-title trust, bounded request reading, origin/IP checks and fail-closed configuration. It does not claim a live database, scheduler, mailbox or email service was verified. Before launch, exercise: valid homeowner/trade submissions; invalid/missing consent; unknown product; cross-origin request; simultaneous rate-limit requests from two app instances; same-ID retries; storage failure; provider failure; process interruption after send; stale lease recovery; retry-window expiry; and access denial for public database roles. Record the resulting reference and provider receipt in a private test record without committing secrets or contact details.
