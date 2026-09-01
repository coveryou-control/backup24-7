import type { Metadata } from 'next';
import { Check } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs } from '@/components/primitives';
import { PartnerGrid, FinalCta } from '@/components/blocks';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Insurance Partners', href: '/insurance-partners' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Our Insurance Partners',
    description:
      'Backup24/7 is offered through an insurance broker. The policy is issued by the insurance company. Subject to eligibility, underwriting and policy terms.',
  },
  '/insurance-partners',
);

/** §8.5 — partners index. Renders only approved insurers. */
export default function InsurancePartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Insurance partners"
        title="Who actually provides the insurance"
        lead="Backup24/7 is a brand offered through an insurance broker. We do not issue policies — insurance companies do. This page exists so that distinction is never unclear."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <PartnerGrid />
        </Shell>
      </Section>

      <Section tone="raised">
        <Shell>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="How this works"
                title="What a broker actually does"
                lead="The distinction matters, particularly at claim time."
              />
              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: 'We represent you, not the insurer',
                    body: 'Our job is to understand your situation, find cover that fits it, and support you if you need to use it.',
                  },
                  {
                    title: 'The insurer underwrites and decides',
                    body: 'Pricing, acceptance and claim decisions belong to the insurance company, under the policy wording.',
                  },
                  {
                    title: 'We are paid by commission',
                    body: 'Brokers are typically remunerated by the insurer as a percentage of premium. You should be able to ask about that, so: you can.',
                  },
                ].map((i) => (
                  <li key={i.title} className="flex gap-3.5">
                    <Check size={15} strokeWidth={2.4} className="mt-1 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-[14.5px] font-semibold text-ink">{i.title}</h3>
                      <p className="mt-1 text-[13.5px] leading-[1.65] text-muted">{i.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                eyebrow="Adding partners"
                title="This list is not fixed"
                lead="We add an insurance partner where doing so genuinely widens the options available for personal and family cover."
              />
              <p className="mt-6 text-[14.5px] leading-[1.75] text-muted">
                Before we publish a partner we confirm three things: that the relationship is live,
                that they offer a personal or family cyber product, and that we have written
                permission to use their name and logo. Until all three are true, the partner does
                not appear here — which is why this page may be shorter than you expect.
              </p>
              <p className="mt-4 text-[14.5px] leading-[1.75] text-muted">
                If you already hold personal cyber cover with an insurer not listed here, that is not
                a problem. Bring us the policy and we will still review it with you.
              </p>
              <Disclaimer kind="partner" className="mt-8" />
            </div>
          </div>
        </Shell>
      </Section>

      <FinalCta title="Not sure which option suits you?" />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
