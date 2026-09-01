# Backup24/7

Marketing site for **Backup24/7** — personal cyber insurance for individuals and
families in India. Built to `BACKUP24-7_BUILD_BRIEF.md`.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS 3

> **This site is not launch-ready.** It carries placeholder legal, contact and
> insurer information by design. Read [PLACEHOLDERS.md](./PLACEHOLDERS.md)
> before deploying anywhere public — there is a single `IS_PREVIEW` switch in
> `content/site.ts` that governs the preview state.

---

## Getting started

Requires Node 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

The site runs at http://localhost:3000. No environment variables are needed for
local development — the lead endpoint logs submissions to the server console
when nothing is configured.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | typecheck → lint → build, the same order CI runs |

## Environment

Copy [.env.example](./.env.example) to `.env.local` and fill in what you need.
Everything is optional and everything is server-side.

**No credential may be prefixed `NEXT_PUBLIC_`** — that prefix inlines the value
into the client bundle. See [SECURITY.md](./SECURITY.md).

---

## Structure

```
app/
  (marketing)/        route group for every public page
  api/lead/           POST endpoint for enquiries
components/
  Hero.tsx            homepage + interior page heroes
  HeroScene.tsx       WebGL hero background (default)
  HeroVideo.tsx       HLS hero background (alternative)
  primitives.tsx      Shell, Section, CTAButton, GlassCard, Disclaimer…
  forms/QuoteForm.tsx 4-step quote flow
content/
  site.ts             brand, contact, legal, nav, disclaimers
  partners.ts         insurers and products, behind approval gates
lib/                  analytics, SEO helpers, validation schemas
styles/tokens.css     the theme — see below
```

### The theme is a one-file swap

Every colour, font and radius used anywhere resolves through a CSS variable in
[styles/tokens.css](./styles/tokens.css). No component contains a hex value or a
font name.

Colours are stored as **channel triplets** (`--primary-rgb: 94 210 156`), not as
`rgb()` strings, and `tailwind.config.ts` composes them with `<alpha-value>`.
This is load-bearing: given a full `var(--color-x)` value, Tailwind generates
**no CSS at all** for opacity modifiers like `bg-primary/10` — silently, with no
warning. Keep the triplet form.

### Hero background

`heroMedia.mode` in `content/site.ts` selects between two implementations of the
same look:

- **`'scene'`** (default) — `HeroScene.tsx`, a procedural WebGL bar field in the
  brand mint. No dependencies, no network, no visible loop. Falls back silently
  to the CSS gradients where WebGL2 is unavailable.
- **`'video'`** — `HeroVideo.tsx`, the supplied theme's HLS clip via `hls.js`.
  Cheaper on battery, but a fixed-resolution plate in a palette we do not
  control. See PLACEHOLDERS.md before shipping this mode.

Both sit under the same readability scrim, mobile veil and fade-in. Contrast over
both has been measured against WCAG AA at the brightest frame of each.

### Compliance constraints in the code

Not conventions — enforced.

- **Coverage language is always conditional.** Compliance text reaches the page
  only through `<Disclaimer kind="…" />`, which takes a key from a fixed set. No
  page can write its own wording, and nothing states that cover is guaranteed.
- **Unapproved insurer content produces no route.** `publishableInsurers()` and
  `publishableProducts()` gate on approval status, so an unverified product 404s
  rather than publishing a placeholder as fact.
- **`Stats` and `Testimonial` render nothing without real data.** Fabricating
  either is forbidden by the brief.
- **Analytics refuses PII.** `lib/analytics.ts` deny-lists personal-data-looking
  property names.

---

## Deploying

`npm run build` produces a standard Next.js build; 38 pages prerender. Any Node
host works — the brief targets AWS or a self-managed VPS.

Before a public deploy:

1. Work through [PLACEHOLDERS.md](./PLACEHOLDERS.md).
2. Set `IS_PREVIEW = false` in `content/site.ts`.
3. Configure lead delivery (`.env.example`) and send a test enquiry end to end.
4. Add security response headers and a CSP — see the known gaps in
   [SECURITY.md](./SECURITY.md).

## Security

See [SECURITY.md](./SECURITY.md). This site collects personal data; report
vulnerabilities privately rather than opening a public issue.

## Licence

Proprietary. Copyright © 2026 CoverYou. All rights reserved. See
[LICENSE](./LICENSE) — the registered entity name is a placeholder pending
confirmation.
