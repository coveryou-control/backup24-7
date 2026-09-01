import type { Plan } from './types';

/**
 * §8.4 — Individual and Family. Central to this positioning.
 *
 * Both plans are quote-driven. §8.4 and §16 are explicit: no invented sums
 * insured, limits or prices. `sumInsuredNote` is a PLACEHOLDER and the UI renders
 * it as a pending note rather than a number.
 */
export const plans: Plan[] = [
  {
    id: 'individual',
    name: 'Individual Plan',
    tagline: 'For one person who banks, shops and lives online.',
    whoItsFor: [
      'You manage your own accounts, cards and UPI',
      'You shop and pay online regularly',
      'You keep documents, photos and records on your devices',
      'You use email and social media daily',
    ],
    whatsIncluded: [
      'online-financial-fraud',
      'identity-theft',
      'phishing-and-spoofing',
      'cyber-extortion-and-ransomware',
      'data-loss-and-restoration',
    ],
    sumInsuredNote:
      'PLACEHOLDER — sum insured options and limits are set by the insurer and confirmed on your quote.',
    cta: 'Get a Quote',
    seo: {
      title: 'Individual Cyber Insurance Plan',
      description:
        'Personal cyber insurance for one person. Understand what it can help with and get a quote. Subject to eligibility, underwriting and policy terms.',
    },
  },
  {
    id: 'family',
    name: 'Family Plan',
    tagline: 'For the whole household — including the people you are responsible for.',
    whoItsFor: [
      'More than one person in the home transacts online',
      'Children or teenagers are online, on shared or personal devices',
      'Devices, logins and subscriptions are shared across the family',
      'You want one arrangement covering the household rather than several',
    ],
    whatsIncluded: [
      'online-financial-fraud',
      'identity-theft',
      'phishing-and-spoofing',
      'cyberbullying-and-harassment',
      'cyber-extortion-and-ransomware',
      'data-loss-and-restoration',
    ],
    familyNote:
      'Typically extends to your spouse and dependents. PLACEHOLDER (verify — the exact definition of a dependent, and any age limits, are set by each insurer).',
    sumInsuredNote:
      'PLACEHOLDER — sum insured options, per-member limits and household limits are set by the insurer and confirmed on your quote.',
    cta: 'Get a Quote',
    seo: {
      title: 'Family Cyber Insurance Plan',
      description:
        'Personal cyber insurance for your household, including dependents. Understand what it can help with and get a quote. Subject to policy terms.',
    },
  },
];

export function planById(id: string) {
  return plans.find((p) => p.id === id);
}

/**
 * §8.4 — the comparison block. Rows are deliberately qualitative: turning these
 * into numbers would mean inventing limits, which §16 forbids.
 */
export const planComparison: {
  label: string;
  individual: string;
  family: string;
}[] = [
  {
    label: 'Who is covered',
    individual: 'One named person',
    family: 'You, your spouse and dependents (PLACEHOLDER — verify per insurer)',
  },
  {
    label: 'Online financial fraud',
    individual: 'Included, subject to policy terms',
    family: 'Included, subject to policy terms',
  },
  {
    label: 'Identity theft',
    individual: 'Included, subject to policy terms',
    family: 'Included, subject to policy terms',
  },
  {
    label: 'Phishing & spoofing',
    individual: 'Included, subject to policy terms',
    family: 'Included, subject to policy terms',
  },
  {
    label: 'Cyberbullying & harassment',
    individual: 'Varies by product',
    family: 'Typically emphasised, subject to policy terms',
  },
  {
    label: 'Extortion & ransomware',
    individual: 'Included, subject to policy terms',
    family: 'Included, subject to policy terms',
  },
  {
    label: 'Data loss & restoration',
    individual: 'Included, subject to policy terms',
    family: 'Included, subject to policy terms',
  },
  {
    label: 'Shared devices and accounts',
    individual: 'Not the focus',
    family: 'A core reason to choose this plan',
  },
  {
    label: 'Sum insured',
    individual: 'PLACEHOLDER — confirmed on quote',
    family: 'PLACEHOLDER — confirmed on quote',
  },
  {
    label: 'How to buy',
    individual: 'Quote-driven, human-assisted',
    family: 'Quote-driven, human-assisted',
  },
];
