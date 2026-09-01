import { Check, Minus } from 'lucide-react';
import { Shell, Eyebrow, PendingNote, CTAButton } from './primitives';
import { PartnerCard } from './cards';
import { publishableInsurers } from '@/content/partners';
import { disclaimers } from '@/content/site';
import { planComparison } from '@/content/plans';

/**
 * §9.3 TrustStrip.
 *
 * Renders only approved insurers. While both partners are `pending` (§11
 * requires confirmation that each offers a personal/family cyber product, plus
 * logo usage rights), this shows the honest state rather than two greyed-out
 * names — a trust strip advertising unverified partners is worse than none.
 */
export function TrustStrip() {
  const insurers = publishableInsurers();

  return (
    <section className="border-b border-hairline bg-white/[0.015] py-10 md:py-12">
      <Shell>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div>
            <Eyebrow>Cyber Insurance Solutions</Eyebrow>
            <p className="mt-2 max-w-[46ch] text-[13.5px] leading-[1.65] text-muted">
              {disclaimers.partner}
            </p>
          </div>

          {insurers.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {insurers.map((i) => (
                <li key={i.id} className="text-[19px] font-semibold tracking-tight text-ink/50">
                  {i.name}
                </li>
              ))}
            </ul>
          ) : (
            <PendingNote>
              Insurance partners are being confirmed. We publish a partner only once the
              relationship, the personal/family product and logo usage are verified.
            </PendingNote>
          )}
        </div>
      </Shell>
    </section>
  );
}

/** §8.5 partner grid, with the same honest empty state. */
export function PartnerGrid() {
  const insurers = publishableInsurers();

  if (!insurers.length) {
    return (
      <PendingNote>
        Partner details are being confirmed. Before we publish an insurer we verify the
        relationship, that a personal or family cyber product is offered, and that we have written
        permission to use their name and logo.
      </PendingNote>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {insurers.map((i) => (
        <li key={i.id}>
          <PartnerCard insurer={i} />
        </li>
      ))}
    </ul>
  );
}

/**
 * §8.4 PlanComparison.
 *
 * Rows are qualitative on purpose. Turning "sum insured" into a number would
 * mean inventing a limit, which §16 forbids outright.
 */
export function PlanComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">Individual and Family plan comparison</caption>
        <thead>
          <tr className="border-b border-hairline">
            <th scope="col" className="py-4 pr-4 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">
              &nbsp;
            </th>
            <th scope="col" className="py-4 pr-4 text-[15px] font-extrabold tracking-tight text-ink">
              Individual
            </th>
            <th scope="col" className="py-4 text-[15px] font-extrabold tracking-tight text-ink">
              Family
            </th>
          </tr>
        </thead>
        <tbody>
          {planComparison.map((row) => (
            <tr key={row.label} className="border-b border-hairline align-top">
              <th scope="row" className="w-[30%] py-4 pr-4 text-[13.5px] font-medium text-muted">
                {row.label}
              </th>
              <td className="py-4 pr-4 text-[13.5px] text-muted">
                <Cell value={row.individual} />
              </td>
              <td className="py-4 text-[13.5px] text-muted">
                <Cell value={row.family} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value }: { value: string }) {
  const included = value.startsWith('Included');
  const notFocus = value.startsWith('Not the focus');

  return (
    <span className="flex items-start gap-2">
      {included && <Check size={14} strokeWidth={2.4} className="mt-[3px] shrink-0 text-primary" />}
      {notFocus && <Minus size={14} strokeWidth={2.4} className="mt-[3px] shrink-0 text-white/25" />}
      <span>{value}</span>
    </span>
  );
}

/**
 * §9.16 — the closing CTA band. Shared by the homepage and every interior page,
 * so there is exactly one conversion moment and one wording for it.
 */
export function FinalCta({
  title = 'Ready to protect what matters?',
  body = 'Tell us how you live online. We will explain your options in plain language and connect you with an insurance expert. No obligation.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-hairline">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(94,210,156,0.13), rgba(7,11,10,0) 62%)',
        }}
      />
      <Shell className="relative py-24 text-center md:py-32">
        <Eyebrow className="mx-auto">Get started</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-[24ch] text-[30px] font-extrabold leading-[1.1] tracking-tight text-ink md:text-[44px]">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-[1.7] text-muted">{body}</p>
        <div className="mt-9 flex justify-center">
          <CTAButton href="/get-a-quote">Get a Quote</CTAButton>
        </div>
      </Shell>
    </section>
  );
}
