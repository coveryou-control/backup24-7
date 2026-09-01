import type { CoverageItem } from './types';

/**
 * §8.3 — the six coverage items plus the exclusions page.
 *
 * WORDING RULE (§11): every summary and every bullet is conditional — potential,
 * eligible, certain, covered, subject to the policy. Nothing here states that a
 * loss is definitely covered, because the policy wording decides that, not us.
 *
 * `watchOut` is deliberate: the conditions people are most often surprised by.
 * A broker that publishes those before the sale is the whole positioning.
 */
export const coverageItems: CoverageItem[] = [
  {
    id: 'online-financial-fraud',
    slug: 'online-financial-fraud',
    title: 'Online Financial Fraud',
    icon: 'card',
    summary:
      'Potential protection for eligible losses from unauthorised online transactions — net banking, UPI, cards and wallets.',
    detail:
      'Most people now move money several times a day without thinking about it: a UPI scan at a shop, a card saved in an app, a net-banking transfer. Unauthorised transactions are the single most common personal cyber loss, and they usually happen through a compromised credential or a convincing request rather than anything technical.',
    typicallyHelps: [
      'Eligible financial loss from unauthorised transfers on your accounts',
      'Unauthorised use of cards or wallets, where the policy provides it',
      'Costs of investigating and documenting what happened',
    ],
    watchOut: [
      'Cover generally depends on reporting the incident to your bank and the authorities promptly',
      'Losses where credentials were knowingly shared may be treated differently',
      'Sub-limits for this section are often lower than the overall policy limit',
      'A deductible usually applies',
    ],
    relatedPlans: ['individual', 'family'],
    seo: {
      title: 'Online Financial Fraud Cover — UPI, Net Banking & Cards',
      description:
        'How personal cyber insurance may respond to eligible losses from unauthorised online transactions. Subject to policy terms.',
    },
  },
  {
    id: 'identity-theft',
    slug: 'identity-theft',
    title: 'Identity Theft',
    icon: 'id',
    summary:
      'Potential assistance with eligible costs of restoring a stolen identity.',
    detail:
      'Identity theft is rarely a single event. Someone uses your documents or details to open an account, take a loan or transact in your name, and the work of proving it was not you falls to you — often for months, across banks, bureaus and government offices.',
    typicallyHelps: [
      'Eligible legal costs of restoring your identity and disputing fraudulent accounts',
      'Certain administrative expenses incurred while resolving the matter',
      'Support with the process of notifying institutions',
    ],
    watchOut: [
      'This section typically covers the cost of restoration, not every downstream loss',
      'Documentation requirements are substantial — police complaint, correspondence, records',
      'Incidents that began before the policy started are generally excluded',
    ],
    relatedPlans: ['individual', 'family'],
    seo: {
      title: 'Identity Theft Cover — Personal Cyber Insurance',
      description:
        'How cyber insurance may assist with eligible costs of restoring a stolen identity. Subject to policy terms.',
    },
  },
  {
    id: 'phishing-and-spoofing',
    slug: 'phishing-and-spoofing',
    title: 'Phishing & Spoofing',
    icon: 'mail',
    summary:
      'Potential protection for eligible losses arising from phishing or spoofing attacks.',
    detail:
      'A phishing message works because it looks ordinary — a delivery notice, a KYC reminder, a message that appears to come from your bank. Spoofing goes further and makes the sender look genuine. Neither requires you to be careless; they are designed to survive a careful reader on a busy day.',
    typicallyHelps: [
      'Eligible financial loss resulting from a covered phishing or spoofing incident',
      'Certain costs of investigating how the compromise occurred',
      'Support with securing affected accounts',
    ],
    watchOut: [
      'Cover usually requires that the incident is reported promptly',
      'Definitions of what counts as phishing differ between policies — read that clause',
      'Losses arising from sharing an OTP may be handled differently',
    ],
    relatedPlans: ['individual', 'family'],
    seo: {
      title: 'Phishing & Spoofing Cover — Personal Cyber Insurance',
      description:
        'How cyber insurance may respond to eligible losses from phishing and spoofing attacks. Subject to policy terms.',
    },
  },
  {
    id: 'cyberbullying-and-harassment',
    slug: 'cyberbullying-and-harassment',
    title: 'Cyberbullying & Online Harassment',
    icon: 'shield',
    summary:
      'Potential support for eligible legal-defence and related costs.',
    detail:
      'For families this is often the section that matters most. Online harassment, impersonation and targeted abuse — especially affecting children and teenagers — can require legal help, platform escalation and professional support, and none of that is free.',
    typicallyHelps: [
      'Eligible legal costs of pursuing or defending a matter arising from online harassment',
      'Certain related professional costs, where the policy provides them',
      'Support with escalating to platforms and authorities',
    ],
    watchOut: [
      'Scope varies widely between insurers — this is the least standardised section',
      'Cover may require a formal complaint to have been filed',
      'Counselling or medical costs may or may not be included',
    ],
    relatedPlans: ['individual', 'family'],
    seo: {
      title: 'Cyberbullying & Online Harassment Cover',
      description:
        'How cyber insurance may support eligible legal-defence and related costs after online harassment. Subject to policy terms.',
    },
  },
  {
    id: 'cyber-extortion-and-ransomware',
    slug: 'cyber-extortion-and-ransomware',
    title: 'Cyber Extortion & Ransomware',
    icon: 'lock',
    summary:
      'Potential protection for eligible extortion or ransomware losses and expenses.',
    detail:
      'Ransomware is no longer only a business problem. A personal laptop holding years of photos, documents and tax records is a target precisely because it is irreplaceable and rarely backed up. Extortion attempts also arrive via compromised accounts and stolen private material.',
    typicallyHelps: [
      'Eligible expenses of responding to a covered extortion or ransomware incident',
      'Specialist support to assess and contain the incident, where provided',
      'Extortion payments, where the policy permits it and it is lawful',
    ],
    watchOut: [
      'Any payment normally requires the insurer’s prior agreement',
      'Cover for extortion payments is conditional and not available everywhere',
      'Untested backups are the most common reason recovery costs more than expected',
    ],
    relatedPlans: ['individual', 'family'],
    seo: {
      title: 'Cyber Extortion & Ransomware Cover for Personal Devices',
      description:
        'How cyber insurance may respond to eligible ransomware and extortion losses on personal devices. Subject to policy terms.',
    },
  },
  {
    id: 'data-loss-and-restoration',
    slug: 'data-loss-and-restoration',
    title: 'Data Loss & Restoration',
    icon: 'database',
    summary:
      'Potential support for eligible data-restoration costs after a covered incident.',
    detail:
      'The cost of losing personal data is rarely the device. It is the photographs, the documents, the records you cannot reconstruct. Professional recovery is possible more often than people assume, and it is expensive.',
    typicallyHelps: [
      'Eligible costs of restoring or recovering data after a covered incident',
      'Certain costs of reinstalling or reconfiguring affected devices',
      'Professional recovery services, where the policy provides them',
    ],
    watchOut: [
      'Cover applies to restoration after a covered cyber incident, not ordinary hardware failure',
      'Data that was never recoverable cannot be restored at any price',
      'Limits for this section are typically modest',
    ],
    relatedPlans: ['individual', 'family'],
    seo: {
      title: 'Data Loss & Restoration Cover — Personal Cyber Insurance',
      description:
        'How cyber insurance may support eligible data-restoration costs after a covered incident. Subject to policy terms.',
    },
  },
];

export function coverageBySlug(slug: string) {
  return coverageItems.find((c) => c.slug === slug);
}

/**
 * §8.3 — /coverage/what-is-not-covered.
 *
 * Generic categories only. Specific exclusions are
 * PLACEHOLDER (verify vs policy wording) and must not be published as fact.
 */
export const exclusionCategories = [
  {
    title: 'Known or pre-existing incidents',
    body: 'Incidents that had already occurred, or that you were aware of, before the policy started.',
  },
  {
    title: 'Certain intentional acts',
    body: 'Deliberate or dishonest acts, depending on how the policy defines them.',
  },
  {
    title: 'Certain contractual liabilities',
    body: 'Obligations taken on through contracts that the policy does not extend to.',
  },
  {
    title: 'Unapproved activities',
    body: 'Activities outside what was disclosed and agreed when the policy was issued.',
  },
  {
    title: 'Policy-specific exclusions',
    body: 'Each insurer and product carries its own list. We go through the one that applies to you.',
  },
  {
    title: 'Deductibles and waiting periods',
    body: 'An amount you bear yourself, or a period before certain cover applies, where stated.',
  },
  {
    title: 'Coverage limits',
    body: 'The maximum amount payable, overall and for individual sections of the policy.',
  },
];

/** The three things people most often confuse. */
export const limitTypes = [
  {
    title: 'Exclusions',
    body: 'Situations the policy does not respond to at all. If an exclusion applies, the amount does not matter.',
  },
  {
    title: 'Limits and sub-limits',
    body: 'The most the policy will pay — overall, and lower caps for individual sections.',
  },
  {
    title: 'Deductibles and waiting periods',
    body: 'The part you bear yourself: an amount, or a period before cover starts responding.',
  },
];
