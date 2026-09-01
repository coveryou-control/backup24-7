# Security policy

## Reporting a vulnerability

Please report security issues privately. Do **not** open a public GitHub issue —
this repository is public, and an issue discloses the problem to everyone before
it can be fixed.

- Email: `PLACEHOLDER — security contact address`
- Include: what you found, the affected URL or file, and the steps to reproduce.
- Please allow a reasonable window for a fix before disclosing publicly.

We will acknowledge receipt and keep you informed of progress.

> `PLACEHOLDER` above must be replaced before launch. Tracked in
> [PLACEHOLDERS.md](./PLACEHOLDERS.md).

## What this application handles

This site collects insurance enquiries from members of the public. A submission
contains **personal data** — name, phone number, email address, city, household
composition and stated concerns. Treat every code path that touches a lead as
handling PII.

## Rules that exist for security reasons

These are enforced in the codebase, not just documented. Breaking one is a
security regression, not a style problem.

**Secrets live only in the environment.** Every credential is read from
`process.env` server-side. No credential may be given a `NEXT_PUBLIC_` prefix —
that prefix inlines the value into the client bundle, where it is readable by
anyone. See [.env.example](./.env.example).

**No PII in analytics.** `lib/analytics.ts` carries a deny-list and refuses to
emit event properties whose names look like personal data. Events carry IDs,
page paths and non-identifying context only.

**No PII in URLs.** Query strings are logged by proxies, CDNs, browser history
and referrer headers. The quote flow passes plan selection and campaign
parameters in the URL — never contact details.

**Consent is validated server-side.** `POST /api/lead` rejects any submission
where `consent !== true`. Client-side validation is a convenience; the route is
the enforcement point.

**The lead endpoint is rate-limited** (5 requests per minute per IP) and carries
a honeypot field. Both are in `app/api/lead/route.ts`.

**Unverified insurer facts cannot be published.** `publishableInsurers()` and
`publishableProducts()` gate on an approval status; unapproved content produces
no route at all rather than rendering a placeholder as fact. This is a
compliance control — an insurance broker publishing an incorrect coverage claim
is a regulatory problem, not a cosmetic one.

## Known gaps

- **No Content-Security-Policy is set.** Adding one requires allowing the hero's
  media origins (`stream.mux.com` for HLS in `video` mode) and Google Fonts.
  Worth doing before launch; a wrong CSP silently breaks the hero background.
- **Security response headers are not configured** in `next.config.ts` —
  `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options` and
  `Permissions-Policy` are all straightforward additions.
- The security contact address above is a placeholder.

## Dependencies

Run `npm audit` before each release. Dependabot is not configured on this
repository yet.
