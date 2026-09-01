import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Breadcrumbs, Panel, Disclaimer, PendingNote } from '@/components/primitives';
import { IconTile } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { trustPoints } from '@/content/audiences';
import { legal, contact, site, IS_PREVIEW } from '@/content/site';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'About Backup24/7',
    description:
      'Backup24/7 is a personal cyber insurance brand for everyday people in India, offered through an insurance broker. Cyber protection for everyday life.',
  },
  '/about',
);

/** §8.12 — no unverified superlatives (§11). Trust is earned on process, not claims. */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Cyber protection for everyday life"
        lead="Backup24/7 exists because personal cyber insurance is usually sold as a business product with the word “personal” added — and everyday life does not look like a business."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading eyebrow="What it is" title="What is Backup24/7?" />
              <div className="mt-6 space-y-4 text-[14.5px] leading-[1.75] text-muted">
                <p>
                  Backup24/7 is a brand under which personal cyber insurance is distributed to
                  individuals and families across India. Two plans: Individual, for one person, and
                  Family, for the household.
                </p>
                <p>
                  We are an insurance broker. That means we do not issue policies — the insurance
                  company does. Our job is to understand how you live online, explain the options
                  honestly, and help you place cover with an insurer that suits you.
                </p>
                <p>
                  We are not a security company. We do not sell antivirus, password managers or
                  monitoring, and we will not pretend that buying a policy makes your accounts safe.
                  Insurance deals with consequences. Security practices reduce the chance of needing
                  it.
                </p>
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Why it exists" title="Why Backup24/7 exists" />
              <div className="mt-6 space-y-4 text-[14.5px] leading-[1.75] text-muted">
                <p>
                  Almost everyone now keeps their money, their identity and their memories behind a
                  handful of logins on a single device. Nobody chose that; it happened one convenient
                  app at a time.
                </p>
                <p>
                  When something goes wrong, people are handed a policy document written for a
                  different kind of customer and asked to work out whether they are covered. That is
                  a bad moment to be reading insurance language for the first time.
                </p>
                <p>So we do the reading in advance, in plain English, before anything happens.</p>
              </div>
            </div>
          </div>
        </Shell>
      </Section>

      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="How we work"
            title="What you can expect from us"
            lead="Process and focus, not superlatives. Everything here is something you can hold us to."
          />
          <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {trustPoints.map((t) => (
              <li key={t.title} className="flex gap-4">
                <IconTile name="check" />
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{t.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-muted">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* Regulatory identity */}
      <Section>
        <Shell narrow>
          <SectionHeading
            eyebrow="Who we are, formally"
            title="Our regulatory identity"
            lead="Backup24/7 is a brand. The entity behind it is a licensed insurance broker, and these are its details."
          />

          {IS_PREVIEW && (
            <div className="mt-6">
              <PendingNote>
                Preview build — the details below are placeholders. The registered entity name, IRDAI
                registration number, broker category and registered office must be supplied and
                verified before this site is published.
              </PendingNote>
            </div>
          )}

          <dl className="mt-8 divide-y divide-hairline border-y border-hairline">
            {[
              { term: 'Legal entity', value: legal.entity },
              { term: 'IRDAI registration number', value: legal.irdaiRegistration },
              { term: 'Broker category', value: legal.brokerCategory },
              { term: 'CIN', value: legal.cin },
              { term: 'Registered office', value: contact.address },
            ].map((row) => (
              <div key={row.term} className="grid gap-1 py-4 sm:grid-cols-[0.4fr_0.6fr] sm:gap-6">
                <dt className="text-[13.5px] font-medium text-subtle">{row.term}</dt>
                <dd className="text-[13.5px] text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <Panel hover={false} className="mt-8 p-6">
            <h2 className="text-[16px] font-semibold text-ink">Contact and complaints</h2>
            <p className="mt-3 text-[13.5px] leading-[1.7] text-muted">
              For anything about your enquiry or your policy, reach us at{' '}
              <a href={`mailto:${contact.email}`} className="font-medium text-primary hover:underline">
                {contact.email}
              </a>
              . Our{' '}
              <Link href="/disclaimer" className="font-medium text-primary hover:underline">
                disclaimer page
              </Link>{' '}
              sets out the broker registration details and the grievance route.
            </p>
          </Panel>

          <Disclaimer kind="advisory" className="mt-8" />
        </Shell>
      </Section>

      <FinalCta title={`Want to talk to someone about ${site.name}?`} />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
