import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, CTAButton, Disclaimer, Breadcrumbs, Panel } from '@/components/primitives';
import { ProcessSteps } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { processSteps } from '@/content/audiences';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'How Getting Cyber Insurance Works',
    description:
      'Four steps from enquiry to cover: tell us about you, understand your risk, explore suitable options, get covered. Subject to eligibility and policy terms.',
  },
  '/how-it-works',
);

/** §8.7 — step 04 never implies cover is automatic. */
export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="The process"
        title="How it works"
        lead="Four steps, no automated decisions, and a person you can talk to at every one of them. Here is exactly what happens, and what we need from you."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <ProcessSteps steps={processSteps} />
          <Disclaimer kind="facilitation" className="mt-12" />
        </Shell>
      </Section>

      <Section tone="raised">
        <Shell>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="What we ask for"
                title="What we need from you"
                lead="Less than you might expect at first. Insurers ask for more detail later, and only once you have decided you want to proceed."
              />
              <ul className="mt-8 space-y-3.5">
                {[
                  'Whether you want Individual or Family cover',
                  'Your name, mobile, email and city',
                  'For family cover: how many people, and whether that includes dependents',
                  'Whether this is a new policy or a renewal',
                  'Optionally, what you are most concerned about',
                ].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={15} strokeWidth={2.4} className="mt-1 shrink-0 text-primary" />
                    <span className="text-[14.5px] leading-[1.7] text-muted">{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13.5px] leading-[1.65] text-subtle">
                Ranges are fine throughout. We never need exact financial figures to have a useful
                first conversation.
              </p>
            </div>

            <div>
              <SectionHeading
                eyebrow="What we will not do"
                title="Things we deliberately do not do"
                lead="Some of these are things other sites do. We think they are why insurance has a trust problem."
              />
              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: 'Sell you a policy in three clicks',
                    body: 'Personal cyber cover has conditions that matter. Getting it wrong is only discovered at claim time.',
                  },
                  {
                    title: 'Quote a premium before we understand your situation',
                    body: 'A number without context is meaningless, and any number we gave you would change.',
                  },
                  {
                    title: 'Pass your details around',
                    body: 'Your information is used to respond to your enquiry and to approach insurers on your instruction. That is it.',
                  },
                  {
                    title: 'Hide the exclusions until the paperwork',
                    body: 'We walk you through what is not covered before you commit to anything.',
                  },
                ].map((i) => (
                  <li key={i.title}>
                    <Panel hover={false} className="p-5">
                      <h3 className="flex items-start gap-2.5 text-[14.5px] font-semibold text-ink">
                        <X size={15} strokeWidth={2.4} className="mt-[3px] shrink-0 text-white/35" />
                        {i.title}
                      </h3>
                      <p className="mt-1.5 pl-[26px] text-[13px] leading-[1.6] text-muted">{i.body}</p>
                    </Panel>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Shell>
      </Section>

      <Section>
        <Shell narrow className="text-center">
          <CTAButton href="/get-a-quote">Get started</CTAButton>
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
