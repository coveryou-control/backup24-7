import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, MapPin, ArrowRight } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Breadcrumbs, Panel } from '@/components/primitives';
import SimpleLeadForm from '@/components/forms/SimpleLeadForm';
import { contact, telHref, mailHref, waHref } from '@/content/site';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Contact Us',
    description:
      'Talk to a cyber insurance expert about personal or family cover. Call, WhatsApp, email, or send us a message.',
  },
  '/contact',
);

/** §8.13 — CTA is specified: "Talk to a Cyber Insurance Expert". */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a cyber insurance expert"
        lead="Whether you know exactly what you need or have no idea where to start, a real person will talk it through with you. No scripts, no pressure."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Send us a message"
                title="Tell us what you are trying to work out"
                lead="We will come back to you on whichever channel you prefer."
              />
              <div className="mt-8">
                <SimpleLeadForm variant="contact" />
              </div>
            </div>

            <aside className="space-y-4">
              <Panel hover={false} className="p-6">
                <h2 className="text-[16px] font-semibold text-ink">Reach us directly</h2>
                <ul className="mt-5 space-y-4">
                  <li>
                    <a href={telHref} className="flex items-start gap-3 text-[13.5px] text-muted hover:text-primary">
                      <Phone size={15} strokeWidth={1.9} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        <span className="block font-medium text-ink">{contact.phoneDisplay}</span>
                        <span className="text-[12px] text-subtle">{contact.officeHours}</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-[13.5px] text-muted hover:text-primary"
                    >
                      <MessageCircle size={15} strokeWidth={1.9} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        <span className="block font-medium text-ink">WhatsApp</span>
                        <span className="text-[12px] text-subtle">Often the quickest way to reach us</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href={mailHref} className="flex items-start gap-3 text-[13.5px] text-muted hover:text-primary">
                      <Mail size={15} strokeWidth={1.9} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        <span className="block font-medium text-ink">{contact.email}</span>
                        <span className="text-[12px] text-subtle">General enquiries</span>
                      </span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-[13.5px] text-muted">
                    <MapPin size={15} strokeWidth={1.9} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-ink">Office</span>
                      <span className="text-[12px] text-subtle">{contact.address}</span>
                    </span>
                  </li>
                </ul>
              </Panel>

              <Panel hover={false} className="border-primary/20 bg-primary/[0.04] p-6">
                <h2 className="text-[16px] font-semibold text-ink">Dealing with an incident now?</h2>
                <p className="mt-2 text-[13px] leading-[1.65] text-muted">
                  Do not wait for a form. Call us, and see the claims page for the immediate steps.
                </p>
                <Link
                  href="/claims"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  Claims assistance
                  <ArrowRight size={14} strokeWidth={2.2} />
                </Link>
              </Panel>

              <Panel hover={false} className="p-6">
                <h2 className="text-[16px] font-semibold text-ink">Just want a quote?</h2>
                <p className="mt-2 text-[13px] leading-[1.65] text-muted">
                  The quote form asks four short questions and takes about a minute.
                </p>
                <Link
                  href="/get-a-quote"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  Get a Quote
                  <ArrowRight size={14} strokeWidth={2.2} />
                </Link>
              </Panel>
            </aside>
          </div>
        </Shell>
      </Section>

      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
