# Analytics contract

No analytics provider is configured in this preview. `NEXT_PUBLIC_GA_ID` is optional; script loading requires the analytics preference. No advertising tracking is enabled.

Implemented client hooks: `page_view` on route changes; `select_item`, `brochure_download` and `contact_click` through delegated link tracking; `view_product` once per mounted product route; `start_quote` once on first form focus; `quote_submit_success` only after durable receipt. Properties are product IDs and enquiry type, never contact data or message content. Cookie choices are stored in `pureline-consent` local storage.

Remaining production acceptance: configure the approved GA property, exercise consent grant/reject/revoke, verify the event stream and duplicate suppression across SPA navigations, and validate page-view, select-item, download and contact-click events before relying on those metrics. Browser-level tests verify that the unconfigured preview makes no third-party tracking requests, not a live GA integration. Numeric business conversion targets require a baseline.
