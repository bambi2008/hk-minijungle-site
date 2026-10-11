# Contact intake — deployment proposal

This patch repairs the existing contact form and prepares Vercel API functions. It is disabled until the owner approves and configures a durable private inbox. It does not send email, write a CRM, or activate n8n.

## Review the change

- `/api/contact`: strict JSON, origin, consent, bounded fields/body, Vercel client IP rate limit, UUID idempotency.
- `/api/contact-inbox`: authenticated read by ID or paginated HSCAN. The token exposes visitor contact details and must remain server-side.
- The browser keeps the form and request identity on uncertain results. Session storage retains only a SHA-256 digest, UUID and timestamp for up to 24 hours. The server stores the original receipt by UUID until operator cleanup.
- Home enquiries preserve the existing product field. Missing budget, location, quantity and timeline are not invented; roles and business categories remain unverified.
- SPA rewrites exclude `/api`. Sites worker and packaging files remain intact; the new backend is Vercel-specific, not included in a Sites worker handoff.

## Storage / activation

Proposed provider: Upstash Redis through Vercel Marketplace. Its account, data destination and terms require owner confirmation. The pilot sales CRM remains Google Sheets. Use durable storage with eviction disabled. Do not share a production inbox with fixture previews.

Server-only variables: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CONTACT_REVIEW_TOKEN`, `CONTACT_RATE_SECRET`, `CONTACT_RETENTION_POLICY=manual-review-required`. Both application secrets must be at least 32 random characters. Only after storage, operator access, retention/cleanup arrangements and acceptance are verified set `CONTACT_INTAKE_ENABLED=true`. Never put any secret into a `VITE_` variable.

The inbox is capped at 5,000 records. It retains records until human cleanup under the approved policy; automatic deletion and notifications are not configured. Rate limit: five new submissions per trusted IP every five minutes. This does not replace bot protection and can affect shared office networks. Network uncertainty never returns success. Retry the same UUID or use authenticated lookup, without issuing a new submission ID.

No real sender or visitor identity is assumed. HSCAN may repeat rows as the inbox changes; downstream consumers must deduplicate by UUID and distinguish read, review, CRM commit and sending. A received result means inbox storage confirmed, not that JOSE saw it or an email arrived. An oversized provider page fails closed and needs operator inspection.

## Local checks

`node tests/contact-inbox.test.mjs` — 24 protocol/model and browser identity checks; no real Redis service is used.

`npm run build` and `npm run test:sites` — preserve the existing Sites artifacts and four packaging tests.

`node scripts/contact-preview.mjs --fixture` — loopback-only fictional preview. It only accepts `@example.org` and a message containing `SYNTHETIC TEST ONLY`; data stays in memory. Without the flag, the API returns not configured. No cloud storage, mail or CRM call is made. `CONTACT_PREVIEW_PORT` chooses a free port (default 5710).

Real isolated Redis EVAL, eviction/durability, Vercel API routing/headers, authenticated operator read and n8n source integration still require end-to-end acceptance after provisioning. Do not promote the production domain until these checks are complete. Revert the patch or disable intake to stop accepting new data without deleting old receipts.

Existing contact labels and product copy are preserved. This patch does not certify product availability, change the authoritative business catalog, or validate legacy phone/WhatsApp details.

Isolated preview activation additionally requires `CONTACT_TEST_ONLY=true`. The server rejects addresses outside `example.org` and messages lacking `SYNTHETIC TEST ONLY` before any storage request. This is an enforced fictional-data boundary; it does not authorize production activation.
