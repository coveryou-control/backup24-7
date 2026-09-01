import type { Metadata } from 'next';
import { Phone, MessageCircle } from 'lucide-react';

import { Shell } from '@/components/primitives';
import { Breadcrumbs, Eyebrow, Panel } from '@/components/primitives';
import QuoteForm from '@/components/forms/QuoteForm';
import { processSteps } from '@/content/audiences';
import { contact, telHref, waHref } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Get a Quote', href: '/get-a-quote' },
];

export const metadata: Metadata = {
  ...pageMetadata(
    {
      title: 'Get a Personal Cyber Insurance Quote',
      description:
        'Four short questions. We will explain suitable Individual or Family cyber insurance options. No obligation.',
    },
    '/get-a-quote',
  ),
  // A form page competes with the education pages for the same terms, and there
  // is nothing here worth ranking.
  robots: { index: false, follow: true },
};

/**
 * §10.1 — the quote page.
 *
 * The form reads `?plan=` from window.location after mount, so it needs no
 * Suspense boundary — see the note in QuoteForm for why that matters here.
 */
export default function GetAQuotePage() {
  return (
    <>
      <Shell className="pt-[96px]">
        <Breadcrumbs trail={TRAIL} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <div>
            <Eyebrow>Get a quote</Eyebrow>
            <h1 className="mt-4 max-w-[20ch] text-[30px] font-extrabold leading-[1.1] tracking-tight text-ink md:text-[42px]">
              Let’s find the cover that fits.
            </h1>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-muted">
              Four short steps. We will review what you share and come back with options that
              actually suit how you live online — not a generic quote.
            </p>

            <div className="mt-8">
              <QuoteForm />
            </div>
          </div>

          <aside className="space-y-4 lg:pt-[7.5rem]">
            <Panel hover={false} className="p-6">
              <h2 className="text-[16px] font-semibold text-ink">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {processSteps.map((s) => (
                  <li key={s.n} className="flex gap-3.5">
                    <span className="text-[13px] font-semibold text-primary">{s.n}</span>
                    <div>
                      <p className="text-[13.5px] font-medium text-ink">{s.title}</p>
                      <p className="mt-1 text-[12.5px] leading-[1.6] text-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel hover={false} className="p-6">
              <h2 className="text-[16px] font-semibold text-ink">Prefer to talk?</h2>
              <p className="mt-2 text-[13px] leading-[1.6] text-muted">
                Some questions are faster on a call. {contact.officeHours}.
              </p>
              <div className="mt-4 space-y-2.5">
                <a
                  href={telHref}
                  className="flex items-center gap-2.5 text-[13.5px] font-medium text-primary hover:underline"
                >
                  <Phone size={15} strokeWidth={1.9} />
                  {contact.phoneDisplay}
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13.5px] font-medium text-primary hover:underline"
                >
                  <MessageCircle size={15} strokeWidth={1.9} />
                  Message us on WhatsApp
                </a>
              </div>
            </Panel>

            <p className="text-[12px] leading-[1.6] text-subtle">
              Your details are used to respond to this enquiry and are handled in line with our
              Privacy Policy. We do not sell your information.
            </p>
          </aside>
        </div>
      </Shell>

      <div className="h-20" />
    </>
  );
}
