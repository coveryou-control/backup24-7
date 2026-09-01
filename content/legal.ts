import { legal, contact, site } from './site';

/**
 * §8.14 — the three required legal pages.
 *
 * ############################################################################
 * #  DRAFT — NOT REVIEWED BY A LEGAL ADVISOR                                  #
 * ############################################################################
 * The brief marks these bodies as PLACEHOLDER pending legal sign-off, while
 * requiring that the pages exist and be linked from the footer and every form.
 *
 * So: the structure is real and the wording is a defensible starting point, but
 * it is not legal advice and must be reviewed and approved before publication.
 * Areas needing specific attention are marked inline.
 *
 * Particular attention required on:
 *   - India's DPDP Act obligations (consent, retention, data-principal rights)
 *   - IRDAI requirements for a broker's website
 *   - the prescribed grievance escalation path
 * ############################################################################
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
  seo: { title: string; description: string };
}

export const legalDocs: Record<string, LegalDoc> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    intro:
      'How we collect, use, store and share the information you give us, how long we keep it, and the rights you have over it.',
    lastUpdated: '2026-09-01',
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [
          `Backup24/7 is a brand of ${legal.entity}, an insurance broker registered with the IRDAI (registration number ${legal.irdaiRegistration}). In this policy, "we" and "us" refer to that entity.`,
          `For any question about this policy, or about information we hold about you, write to ${contact.email}.`,
        ],
      },
      {
        heading: 'What we collect',
        paragraphs: [
          'We collect only what we need to respond to your enquiry and, if you choose to proceed, to arrange insurance on your instruction.',
        ],
        bullets: [
          'Contact details: your name, mobile number, email address and city',
          'Plan details: whether you want Individual or Family cover, and for family cover how many people and whether that includes dependents',
          'Requirement details: whether this is a new policy or a renewal, whether you hold existing cover, and anything you choose to tell us',
          'Journey information: the page you enquired from and the campaign that brought you — used to understand how people find us',
          'Consent record: the exact consent wording shown to you, and the time it was given',
        ],
      },
      {
        heading: 'Why we collect it',
        paragraphs: [
          'To respond to your enquiry, to understand your requirements, to approach insurers on your instruction, to support you during a claim, and to meet our regulatory obligations as an insurance broker.',
          'We do not sell your information. We share it with an insurer only when you have asked us to approach them.',
        ],
      },
      {
        heading: 'Who we share it with',
        paragraphs: [
          'Insurance partners, where you have instructed us to obtain a quote or arrange cover on your behalf.',
          'Service providers who help us operate — for example email and hosting providers — under agreements that restrict what they may do with it.',
          'Authorities, where we are legally required to disclose.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'PLACEHOLDER — RETENTION PERIOD TO BE CONFIRMED AND APPROVED. Enquiry data that does not result in a policy will be retained for a defined period and then deleted. Where a policy is arranged, records are retained for the period required by applicable law and regulation.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You can ask what information we hold about you, ask us to correct it, ask us to delete it, and withdraw consent to being contacted. Withdrawing consent does not affect anything already done on your instruction.',
          `To exercise any of these, write to ${contact.email} with enough detail for us to identify your record — your enquiry reference, if you have it, is the fastest route.`,
          'PLACEHOLDER — the specific rights, timelines and grievance route under India’s DPDP Act must be confirmed by a legal advisor.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'Enquiry data is stored on access-restricted infrastructure, and access is limited to people who need it to do their job. No system is perfectly secure, and we do not claim otherwise.',
        ],
      },
      {
        heading: 'Analytics and cookies',
        paragraphs: [
          'We use analytics to understand how the site is used — which pages people read, and where they leave. We do not send your name, contact details or message content into analytics systems.',
          'PLACEHOLDER — if non-essential cookies or third-party analytics are enabled, a privacy-first cookie-consent banner is required before they load.',
        ],
      },
    ],
    seo: {
      title: 'Privacy Policy',
      description:
        'How Backup24/7 collects, uses, shares and retains your information, and the rights you have over it.',
    },
  },

  terms: {
    slug: 'terms',
    title: 'Terms of Use',
    intro: 'The terms on which this website is made available to you.',
    lastUpdated: '2026-09-01',
    sections: [
      {
        heading: 'About this website',
        paragraphs: [
          `This website is operated by ${legal.entity} under the brand ${site.name}. By using it, you agree to these terms.`,
        ],
      },
      {
        heading: 'Information, not advice',
        paragraphs: [
          'Everything on this website is general information intended to help you understand personal cyber insurance. It is not insurance advice and does not take account of your specific circumstances.',
          'Before making any decision, speak to our insurance expert and read the applicable policy wording.',
        ],
      },
      {
        heading: 'No offer of insurance',
        paragraphs: [
          'Nothing on this website is an offer to provide insurance. Insurance is issued by the insurance company, subject to its eligibility criteria, underwriting and policy terms.',
        ],
      },
      {
        heading: 'Accuracy',
        paragraphs: [
          'We take care to keep this website accurate and current. Insurance products change, and there may be periods where information here is not the latest. The policy wording always prevails over anything stated on this website.',
        ],
      },
      {
        heading: 'Third-party names and links',
        paragraphs: [
          'Insurer names and logos remain the property of their respective owners and are used only to identify our insurance partners. Links to other websites are provided for convenience; we are not responsible for their content.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          'PLACEHOLDER — TO BE CONFIRMED BY LEGAL ADVISOR. These terms are governed by the laws of India, and the courts of the jurisdiction of our registered office have exclusive jurisdiction.',
        ],
      },
    ],
    seo: {
      title: 'Terms of Use',
      description: 'The terms on which the Backup24/7 website is made available.',
    },
  },

  disclaimer: {
    slug: 'disclaimer',
    title: 'Disclaimer',
    intro: 'What this website does and does not represent, and the broker registration details behind it.',
    lastUpdated: '2026-09-01',
    sections: [
      {
        heading: 'Insurance is the subject matter of solicitation',
        paragraphs: [
          'This website describes personal cyber insurance in general terms. It does not constitute an offer, and it does not guarantee that cover will be available to you.',
        ],
      },
      {
        heading: 'Broker registration',
        paragraphs: [
          `${legal.entity} · IRDAI Registration No. ${legal.irdaiRegistration} · ${legal.brokerCategory} · CIN ${legal.cin}`,
          'PLACEHOLDER — the registered entity name, IRDAI registration number, broker category, licence validity and registered office address must be supplied and verified before publication.',
        ],
      },
      {
        heading: 'Coverage is always subject to the policy',
        paragraphs: [
          'Any description of coverage on this website is a summary written for clarity. Actual coverage, limits, deductibles, exclusions and conditions are determined by the policy wording issued by the insurer.',
          'Where this website and a policy wording differ, the policy wording applies.',
        ],
      },
      {
        heading: 'We do not guarantee claim outcomes',
        paragraphs: [
          'Claims are assessed and decided by the insurer under the terms of the policy. We assist with the process. We do not decide claims, and we do not promise any particular outcome or timeframe.',
        ],
      },
      {
        heading: 'We are not a security provider',
        paragraphs: [
          'Backup24/7 distributes insurance. We do not provide security software, monitoring or testing services, and holding a cyber insurance policy does not make your accounts or devices secure.',
        ],
      },
      {
        heading: 'No superlative claims',
        paragraphs: [
          'We do not claim to be the largest, cheapest or best. Where we describe what we do, we describe it factually. If you find anything on this website that overstates a benefit, tell us and we will correct it.',
        ],
      },
      {
        heading: 'Grievance redressal',
        paragraphs: [
          `If something has not gone the way it should, write to ${contact.email} and it will be escalated.`,
          'PLACEHOLDER — the Grievance Officer name, acknowledgement and resolution timelines, and the prescribed escalation route (insurer, IRDAI grievance mechanism, Insurance Ombudsman) must be confirmed by compliance before publication.',
        ],
      },
    ],
    seo: {
      title: 'Disclaimer',
      description:
        'What the Backup24/7 website represents regarding cover and claims, plus broker registration and grievance details.',
    },
  },
};
