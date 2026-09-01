## What changed

<!-- One or two sentences. Link the brief section (§n) if relevant. -->

## Checks

- [ ] `npm run verify` passes locally (typecheck → lint → build)
- [ ] Checked on mobile width as well as desktop

## Compliance — tick or explain

These are the rules this project cannot break. Delete any line that genuinely
does not apply; do not tick one you have not checked.

- [ ] **No coverage claim is stated as unconditional.** Compliance text still
      goes through `<Disclaimer kind="…" />`; nothing says cover, claims or
      pricing are guaranteed.
- [ ] **No PLACEHOLDER value ships as fact.** Anything unverified is either
      gated out or still listed in `PLACEHOLDERS.md`.
- [ ] **No invented data.** No fabricated statistics, testimonials, insurer
      names or product terms.
- [ ] **No PII in analytics, and none in URLs.**
- [ ] **No secret added to the client bundle** — nothing credential-like gained
      a `NEXT_PUBLIC_` prefix, and no key is hardcoded.
