import type { Metadata } from 'next';
import { Check, Phone } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, Panel } from '@/components/primitives';
import { ClaimsSteps, IconTile } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import SimpleLeadForm from '@/components/forms/SimpleLeadForm';
import FAQAccordion from '@/components/FAQAccordion';
import { claimsSteps, faqsByCategory } from '@/content/audiences';
import { contact, telHref } from '@/content/site';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Claims', href: '/claims' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Something Happened Online? Know What To Do Next.',
    description:
      'The first steps after an online incident, what to preserve, and how we help you work with the insurer. We never promise a claim outcome.',
  },
  '/claims',
);

/**
 * §8.8 — H1 is specified. The governing rule: never promise claim approval,
 * settlement or turnaround. This page explains the PROCESS and our role in it,
 * and is explicit that the insurer decides.
 *
 * Someone reading this may be mid-incident, so the phone number is above the
 * fold and the immediate actions come before anything about insurance.
 */
export default function ClaimsPage() {
  return (
    <>
      <PageHero
        eyebrow="Claims assistance"
        title={
          <>
            Something happened online?{' '}
            <span className="text-ink/70">
              Know what to do next<span className="text-primary">.</span>
            </span>
          </>
        }
        lead="Take a breath. The first hours matter, but panic does not help. Here is the order to do things in, and where we come in."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <div className="flex flex-wrap items-center gap-4 rounded-panel border border-primary/20 bg-primary/[0.05] p-6">
            <Phone size={20} strokeWidth={1.9} className="shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[14.5px] font-semibold text-ink">If it is urgent, call us.</p>
              <p className="mt-1 text-[13px] text-muted">{contact.officeHours}</p>
            </div>
            <a
              href={telHref}
              className="ml-auto inline-flex min-h-[48px] items-center justify-center rounded-pill bg-primary px-6 text-[13px] font-bold uppercase tracking-wide text-on-primary transition-colors hover:bg-primary-hover"
            >
              {contact.phoneDisplay}
            </a>
          </div>
        </Shell>
      </Section>

      {/* Immediate actions */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="In the next hour"
            title="Three things worth doing straight away"
            lead="None of these require a decision about insurance. They protect your position either way."
          />
          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              {
                icon: 'card',
                title: 'Tell the bank or platform',
                detail:
                  'Report the transaction or the compromised account immediately. Reporting time affects both recovery and, later, any claim.',
              },
              {
                icon: 'lock',
                title: 'Secure, do not erase',
                detail:
                  'Change passwords from a different device, and check your email for forwarding rules or new recovery addresses. Do not factory-reset anything yet.',
              },
              {
                icon: 'database',
                title: 'Write down what you know',
                detail:
                  'What arrived, when, what you did, what you saw, reference numbers. Screenshots are useful. Memory fades fast under pressure.',
              },
            ].map((i) => (
              <li key={i.title}>
                <Panel hover={false} className="h-full">
                  <IconTile name={i.icon} />
                  <h3 className="mt-5 text-[16px] font-semibold text-ink">{i.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{i.detail}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* The process */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="The claims process"
            title="What happens next"
            lead="The same five steps whichever insurer issued your policy. Our team works alongside you through all of them."
          />
          <div className="mt-12">
            <ClaimsSteps steps={claimsSteps} />
          </div>
        </Shell>
      </Section>

      {/* What we do / do not do */}
      <Section tone="raised">
        <Shell>
          <div className="grid gap-8 lg:grid-cols-2">
            <Panel hover={false} className="border-primary/20 bg-primary/[0.04] p-7">
              <h2 className="text-[18px] font-semibold text-ink">What we do</h2>
              <ul className="mt-5 space-y-3">
                {[
                  'Help you notify the insurer correctly and on time',
                  'Explain what the policy actually says about your situation',
                  'Help you assemble and present the documentation required',
                  'Coordinate with the insurer and follow up through the assessment',
                  'Stay with you until the claim reaches a decision',
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                    <Check size={14} strokeWidth={2.4} className="mt-[3px] shrink-0 text-primary" />
                    {i}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel hover={false} className="p-7">
              <h2 className="text-[18px] font-semibold text-ink">What we cannot do</h2>
              <p className="mt-4 text-[13.5px] leading-[1.7] text-muted">
                We are your broker, not your insurer. We do not assess claims, and we cannot approve
                one or promise how long it will take. Those decisions belong to the insurance company
                and are made under the policy wording.
              </p>
              <p className="mt-4 text-[13.5px] leading-[1.7] text-muted">
                Anyone who tells you otherwise is telling you what you want to hear. What we can
                promise is that you will not be working through it alone.
              </p>
              <Disclaimer kind="claims" className="mt-6" />
            </Panel>
          </div>
        </Shell>
      </Section>

      {/* Claims form */}
      <Section id="claims-form">
        <Shell narrow>
          <SectionHeading
            eyebrow="Get claims assistance"
            title="Tell us what has happened"
            lead="If it is urgent, call instead — this form is for when you would rather write it down."
          />
          <div className="panel mt-8 p-6 sm:p-8">
            <SimpleLeadForm variant="claims" />
          </div>
        </Shell>
      </Section>

      <Section tone="raised">
        <Shell>
          <SectionHeading eyebrow="Claims questions" title="What people ask us about claims" />
          <div className="mt-10">
            <FAQAccordion items={faqsByCategory('claims')} />
          </div>
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
