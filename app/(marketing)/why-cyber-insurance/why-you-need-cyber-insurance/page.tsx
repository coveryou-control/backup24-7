import type { Metadata } from 'next';
import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, CTAButton, Panel, Breadcrumbs, Disclaimer } from '@/components/primitives';
import { IconTile, CoverageCard } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { digitalFootprint, cascadeSteps } from '@/content/risks';
import { coverageItems } from '@/content/coverage';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Why Cyber Insurance?', href: '/why-cyber-insurance' },
  { name: 'Why you need it', href: '/why-cyber-insurance/why-you-need-cyber-insurance' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Your Life Is Online. So Are the Risks.',
    description:
      'How much of everyday life now runs online, how a single incident cascades, and where personal cyber insurance fits.',
  },
  '/why-cyber-insurance/why-you-need-cyber-insurance',
);

/** §8.2 — H1 is specified: "Your Life Is Online. So Are the Risks." */
export default function WhyYouNeedItPage() {
  return (
    <>
      <PageHero
        eyebrow="Why you need it"
        title={
          <>
            Your life is online.{' '}
            <span className="text-ink/70">
              So are the risks<span className="text-primary">.</span>
            </span>
          </>
        }
        lead="Nobody decided to move their money, identity and memories onto a phone. It happened one convenient app at a time. This is what that adds up to."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      {/* The digital footprint */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Your digital footprint"
            title="Everything that is already online"
            lead="Not a hypothetical list. Almost all of this is true for almost everyone reading it."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {digitalFootprint.map((f) => (
              <li key={f.title}>
                <Panel className="h-full">
                  <IconTile name={f.icon} tone="muted" />
                  <h3 className="mt-5 text-[15px] font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-muted">{f.detail}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* The cascade */}
      <Section tone="raised">
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Why one incident is never one incident"
                title="How a single compromise cascades"
                lead="The reason personal cyber risk is worse than it looks is that these accounts are chained together — deliberately, for your convenience."
              />
              <CTAButton href="/coverage" variant="ghost" className="mt-8">
                See what cover addresses
              </CTAButton>
            </div>

            <ol className="space-y-4">
              {cascadeSteps.map((s, i) => (
                <li key={s} className="flex gap-4 rounded-card border border-hairline bg-white/[0.02] p-5">
                  <span className="text-[18px] font-extrabold leading-none text-primary/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[13.5px] leading-[1.65] text-muted">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </Shell>
      </Section>

      {/* Where cover fits */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Where insurance fits"
            title="What a policy can add"
            lead="Good habits reduce how often something happens. They do not reduce the cost when it does. That gap is what cyber insurance is built for."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverageItems.slice(0, 3).map((c) => (
              <li key={c.id}>
                <CoverageCard item={c} />
              </li>
            ))}
          </ul>
          <Disclaimer kind="coverage" className="mt-10" />
        </Shell>
      </Section>

      <FinalCta title="Want this assessed for your own situation?" />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
