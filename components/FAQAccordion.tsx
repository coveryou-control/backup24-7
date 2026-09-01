'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/content/types';
import { AnalyticsEvent, track } from '@/lib/analytics';

/**
 * §7 FAQAccordion, on Radix so keyboard and screen-reader behaviour is correct
 * by default (§2, §14).
 *
 * Single-open by design: insurance answers are long, and stacking them open
 * makes the section unreadable.
 */
export default function FAQAccordion({ items }: { items: FAQ[] }) {
  if (!items.length) return null;

  return (
    <Accordion.Root
      type="single"
      collapsible
      onValueChange={(v) => {
        if (!v) return;
        track(AnalyticsEvent.FAQ_INTERACTION, { faq_index: Number(v.replace('faq-', '')) });
      }}
      className="divide-y divide-hairline border-y border-hairline"
    >
      {items.map((item, i) => (
        <Accordion.Item key={item.question} value={`faq-${i}`}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-primary">
              <span className="text-[15px] font-medium text-ink group-hover:text-primary">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="pb-6 pr-10 text-[14px] leading-[1.7] text-muted">{item.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
