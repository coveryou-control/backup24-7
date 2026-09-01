# PLACEHOLDERS — everything the owner must supply before launch

Required by §16 of the build brief. Every item below is a `PLACEHOLDER` in the
codebase today. **None of them ship as fact**: while `IS_PREVIEW` is `true` in
`content/site.ts` the whole site is `noindex`, the footer states openly that these
details are placeholders, and unverified insurer content produces no page at all.

Grouped by who can answer it. File paths are where the value lives.

---

## 1. Blocking — the site cannot be published without these

### 1.1 Legal entity & broker registration
`content/site.ts` → `legal`

| Value | Current | Needed |
|---|---|---|
| Registered legal entity name | `PLACEHOLDER Insurance Brokers Private Limited` | Exact name as registered |
| IRDAI registration number | `PLACEHOLDER` | Registration number |
| Broker category | `PLACEHOLDER` | e.g. Direct Broker (General) |
| CIN | `PLACEHOLDER` | Company identification number |
| Licence validity | not present | Add if it must be displayed |

Appears in: footer (every page), `/about`, `/disclaimer`.

### 1.2 Contact details
`content/site.ts` → `contact`

- Public phone number (currently `+91 99999 00000` — not real)
- WhatsApp business number (may differ from the phone number)
- Public email address
- Office hours as displayed
- Registered office address

Appears in: header, footer, sticky mobile bar, `/contact`, `/claims`, `/about`.

### 1.3 Insurer partners — the largest single gap
`content/partners.ts`

Both partners are `approvalStatus: 'pending'`, `active: false`, `logo: null`.
**Nothing about them renders**, and `/insurance-partners/[slug]` and
`/products/[slug]` produce no routes at all.

Per §11, three things must be confirmed for each partner before they appear:

1. The broking relationship is live.
2. **The partner offers a personal or family cyber product** — the brief flags
   this explicitly as unverified, and it is the assumption most likely to be
   wrong.
3. Written permission to use their name and logo.

Then supply: exact registered product names, key coverage, potential benefits,
optional covers, important exclusions, eligibility, and sums insured — all
currently `PLACEHOLDER (verify vs insurer documentation)`.

### 1.4 Legal page copy
`content/legal.ts`

Privacy Policy, Terms of Use and Disclaimer exist and are linked from the footer
and every form, but the bodies are **drafts, not reviewed by a legal advisor**.
Each page says so on itself while `IS_PREVIEW` is true.

Needs a legal advisor's review, with specific attention to:

- **DPDP Act**: data-principal rights, the grievance route, and the
  **retention period** (marked `PLACEHOLDER` in the Privacy Policy — it is a
  decision, not a lookup)
- **IRDAI** requirements for a broker's website
- The **prescribed grievance escalation path** (insurer → IRDAI → Ombudsman),
  including the Grievance Officer's name and the acknowledgement/resolution
  timelines
- Governing law and jurisdiction

---

## 2. Required for the site to function

### 2.1 Lead handling — `/api/lead`
Environment variables only; nothing is hardcoded and nothing reaches the client.

| Env var | Purpose |
|---|---|
| `LEAD_INBOX` | Team inbox that receives each enquiry (§10.4 step 2) |
| `MAIL_API_URL`, `MAIL_API_KEY`, `LEAD_FROM` | Mail transport — SES, Resend, Postmark or an internal relay |
| `SHEET_APPEND_URL`, `SHEET_TOKEN` | Google Sheet append endpoint + credential (§10.4 step 3) |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` | CRM webhook stub (§10.4 step 4) |

**Current behaviour with none configured:** the endpoint still validates, still
returns a lead ID, and writes the full enquiry to the server log rather than
dropping it. Losing an enquiry silently would be the worst failure mode here, so
it does not happen — but this is not a substitute for configuring a destination.

### 2.2 Analytics
`lib/analytics.ts` auto-detects Plausible or a `dataLayer`. Supply either:

- a Plausible/PostHog script in `app/layout.tsx`, or
- a GTM container.

The `track()` wrapper is platform-agnostic and refuses to send PII, so the
platform can change without touching any component.

### 2.3 Hosting & domain
- Production domain (`content/site.ts` → `site.url`, currently `backup247.in`)
- Vercel project + preview deploys per PR (§2)

---

## 3. Brand assets

| Asset | Current | File |
|---|---|---|
| Logo | Text wordmark + inline SVG shield mark | `components/SiteHeader.tsx`, `/public/logo.svg` when supplied |
| Theme tokens | The supplied dark/mint theme, wired as CSS variables | `styles/tokens.css` — **a one-file swap** per §4 |
| OG image | Not set | `lib/seo.tsx` → `pageMetadata`, plus a default in `app/layout.tsx` |
| Imagery | No stills used — atmosphere is the hero clip plus CSS/SVG | See §4 direction: real everyday life, no hacker clichés |
| **Hero background plate** | Procedural WebGL bar field, brand mint (`heroMedia.mode: 'scene'`) | `components/HeroScene.tsx`. No asset to supply — it draws from `--primary-rgb`, so it follows a theme swap automatically. **Nothing outstanding here.** |
| Hero plate — video alternative | The theme's Mux HLS stream, unused while mode is `'scene'` | `content/site.ts` → `heroMedia.mode: 'video'` selects it. **Flagged if adopted:** §4 asks us to avoid a neon-green/matrix look for a consumer brand and this footage is close to it, in a palette we cannot change. Point `heroMedia.src` at calmer HLS footage before shipping this mode. |
| Hero clip poster | `null` — only used in `'video'` mode | `content/site.ts` → `heroMedia.poster`. A first-frame still would remove the fade on slow links. |

The theme is deliberately isolated: every colour, font and radius on the site
resolves through `styles/tokens.css`. Dropping in a different brand theme means
editing that one file.

---

## 4. Content pending review

- **Plan sums insured and limits** — `content/plans.ts`. §8.4 and §16 forbid
  invented figures, so these render as a pending note rather than a number.
  Needed: sum insured options, per-member limits, household limits, and the exact
  definition of a **dependent** (including any age limits) for the Family plan.
- **Article reviewer** — the four seed articles in `content/resources/*.mdx` have
  `reviewer: PLACEHOLDER`. Name the person who signs off educational content.
- **Stats and testimonials** — the components exist and render **nothing**. §7 and
  §16 forbid populating them with invented data. Supply real, permissioned
  content or leave them empty.
- **Response-time promise** — `/thank-you` deliberately does not promise a
  turnaround. Supply one the team can keep and it can be added.

---

## 5. Launch switch

When everything above is done, set `IS_PREVIEW = false` in `content/site.ts`.
That single flag:

- turns on indexing (`robots.ts`, `app/layout.tsx`, `lib/seo.tsx`)
- removes the preview banner from the footer
- removes the "draft, not reviewed by a legal advisor" notice from the legal pages
- removes the placeholder note from `/about`

It is deliberately one switch, and deliberately not flipped yet.
