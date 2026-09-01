import type { Audience, ScenarioCardData, FAQ } from './types';

/** §9.10 — "who it's for" segments. People, not industries. */
export const audiences: Audience[] = [
  {
    id: 'individuals',
    type: 'Individuals',
    description: 'One person, managing their own accounts, cards and devices.',
    riskAreas: ['Unauthorised transactions', 'Account takeover', 'Identity theft'],
    relevantPlans: ['individual'],
    href: '/plans/individual',
  },
  {
    id: 'families',
    type: 'Families',
    description: 'A household where more than one person is online every day.',
    riskAreas: ['Shared devices', 'Children online', 'Multiple accounts'],
    relevantPlans: ['family'],
    href: '/plans/family',
  },
  {
    id: 'online-shoppers',
    type: 'Online Shoppers',
    description: 'Frequent buyers with saved cards and addresses across many apps.',
    riskAreas: ['Fake stores', 'Card details stored widely', 'Delivery scams'],
    relevantPlans: ['individual', 'family'],
    href: '/coverage/online-financial-fraud',
  },
  {
    id: 'online-bankers',
    type: 'Frequent Online Bankers',
    description: 'People who move money daily through UPI, net banking and wallets.',
    riskAreas: ['UPI fraud', 'Credential theft', 'Payment redirection'],
    relevantPlans: ['individual', 'family'],
    href: '/coverage/online-financial-fraud',
  },
  {
    id: 'parents',
    type: 'Parents',
    description: 'Children and teenagers online, often on devices you also use.',
    riskAreas: ['Cyberbullying', 'In-app purchases', 'Oversharing'],
    relevantPlans: ['family'],
    href: '/why-cyber-insurance/cyber-risks-for-families',
  },
  {
    id: 'seniors',
    type: 'Seniors',
    description: 'Newer to digital payments, and the most heavily targeted group.',
    riskAreas: ['Impersonation calls', 'Phishing messages', 'KYC scams'],
    relevantPlans: ['individual', 'family'],
    href: '/coverage/phishing-and-spoofing',
  },
];

export function audienceById(id: string) {
  return audiences.find((a) => a.id === id);
}

/**
 * §9.6 — six scenario cards.
 *
 * TONE RULE (§0): calm and factual. No fear-based framing, no dramatised
 * consequences. Each describes a situation and stops there — the reader supplies
 * the alarm on their own, which is more persuasive and more honest.
 */
export const scenarios: ScenarioCardData[] = [
  {
    id: 'upi-fraud',
    title: 'Online payment / UPI fraud',
    body: 'A transaction leaves your account that you did not authorise. The money is usually gone within minutes, and the work of proving it starts immediately.',
    icon: 'card',
  },
  {
    id: 'phishing-message',
    title: 'A phishing message',
    body: 'A message arrives that looks entirely ordinary — a KYC reminder, a delivery notice, a refund. One tap later, credentials have been handed over.',
    icon: 'mail',
  },
  {
    id: 'social-hacked',
    title: 'Social media account hacked',
    body: 'You lose access to your own account, and whoever has it starts messaging the people who trust you.',
    icon: 'user',
  },
  {
    id: 'identity-theft',
    title: 'Identity theft',
    body: 'Someone uses your documents to open an account or take a loan in your name. You find out weeks later, from a stranger.',
    icon: 'id',
  },
  {
    id: 'shopping-scam',
    title: 'Online shopping scam',
    body: 'A store that looked real takes the payment and never ships. Your card details are now somewhere you cannot see.',
    icon: 'bag',
  },
  {
    id: 'personal-ransomware',
    title: 'Ransomware on a personal device',
    body: 'Your laptop stops opening its own files. Years of photos, documents and records are behind a demand for payment.',
    icon: 'lock',
  },
];

/** §9.7 — the "Imagine This" timeline. Ends on recovery, deliberately. */
export const incidentTimeline = [
  { step: 1, label: 'Incident', detail: 'Something happens — a message, a transaction, a login you did not make.' },
  { step: 2, label: 'Accounts & devices affected', detail: 'Access spreads through whatever was connected or reused.' },
  { step: 3, label: 'Money or data at risk', detail: 'Funds move, or files and documents become inaccessible.' },
  { step: 4, label: 'Reporting & investigation', detail: 'Bank, platform and police reports. Statements, screenshots, timelines.' },
  { step: 5, label: 'Potential costs', detail: 'Recovery, legal advice, professional help — and the loss itself.' },
  { step: 6, label: 'Recovery', detail: 'Accounts secured, systems restored, and life returns to normal.' },
];

/** §9.11 — how it works. Step 04 never implies cover is automatic. */
export const processSteps = [
  { n: '01', title: 'Understand', body: 'We explain what personal cyber insurance does, and what it does not do.' },
  { n: '02', title: 'Assess', body: 'A few light questions about how you and your household live online.' },
  { n: '03', title: 'Explore', body: 'Review relevant options from our insurance partners.' },
  { n: '04', title: 'Protect', body: 'Proceed based on eligibility, underwriting and policy terms.' },
];

/** §8.8 — claims steps. Never promises approval, settlement or turnaround. */
export const claimsSteps = [
  { n: '01', title: 'Notify', body: 'Tell the relevant team or insurer as soon as reasonably possible. Late notification can affect a claim.' },
  { n: '02', title: 'Secure', body: 'Secure affected accounts and devices where it is appropriate and safe to do so.' },
  { n: '03', title: 'Preserve', body: 'Keep the evidence: screenshots, messages, transaction records, reference numbers.' },
  { n: '04', title: 'Document', body: 'Provide the documentation required to support the claim.' },
  { n: '05', title: 'Assessment', body: 'Work with the insurer and claims team through the assessment process.' },
];

/** §9.12 — why Backup24/7. Process and focus, never superlatives (§11). */
export const trustPoints = [
  { title: 'Built for everyday people', body: 'Not a business product with the word "personal" added. The examples are your bank app, your family, your devices.' },
  { title: 'Insurance expertise', body: 'Cyber policies are dense and conditional. We read the wordings so you can decide without having to.' },
  { title: 'Partner network', body: 'We help you compare relevant options rather than pushing a single product.' },
  { title: 'Human assistance', body: 'No instant-buy funnel. You speak to a person who understands both the product and your situation.' },
  { title: 'Claims support', body: 'If something happens, we help you notify, document and work through the process with the insurer.' },
  { title: 'Transparency', body: 'We show exclusions and limits openly. You should know what is not covered before you buy, not after.' },
];

/** §8.10 — FAQs, grouped. Simple, conditional language throughout. */
export const faqs: FAQ[] = [
  {
    category: 'general',
    question: 'What is personal cyber insurance?',
    answer:
      'A policy that can help you manage certain financial consequences of cyber incidents in your personal life — unauthorised online transactions, identity theft, phishing, extortion and data loss. What is actually covered depends on the insurer and the specific policy wording.',
  },
  {
    category: 'general',
    question: 'Who should buy it?',
    answer:
      'Anyone whose everyday life runs online: if you bank, pay, shop or keep important documents on your devices, the exposure applies to you. It is not tied to any profession or industry.',
  },
  {
    category: 'general',
    question: 'Is cyber insurance the same as antivirus or a password manager?',
    answer:
      'No, and you want both. Security tools reduce the chance of an incident. Insurance deals with the financial consequences if one happens anyway. We do not sell security software.',
  },
  {
    category: 'individuals-families',
    question: 'What is the difference between the Individual and Family plans?',
    answer:
      'The Individual plan covers one named person. The Family plan extends cover across your household, typically including your spouse and dependents, and is designed around shared devices, multiple accounts and children being online. The exact definition of a dependent is set by the insurer.',
  },
  {
    category: 'individuals-families',
    question: 'Does the Family plan cover my children?',
    answer:
      'Family cover is generally designed to include dependents. Age limits and the precise definition vary by insurer, so we confirm it against the specific policy before you proceed.',
  },
  {
    category: 'individuals-families',
    question: 'Can I switch from Individual to Family later?',
    answer:
      'Usually at renewal, or by arranging a new policy. We will walk you through what changes and what it means for cover.',
  },
  {
    category: 'coverage',
    question: 'Does it cover UPI or online-banking fraud?',
    answer:
      'Unauthorised online transactions are a common element of personal cyber cover, but the scope, conditions and limits differ between insurers and products. Cover typically depends on reporting the incident promptly. The applicable policy wording decides.',
  },
  {
    category: 'coverage',
    question: 'Does it cover identity theft?',
    answer:
      'Many policies include assistance with eligible costs of restoring a stolen identity. That usually means the cost of putting things right rather than every downstream loss.',
  },
  {
    category: 'coverage',
    question: 'What are common exclusions?',
    answer:
      'Exclusions commonly relate to known or pre-existing incidents, certain intentional acts, activities outside what was disclosed, and amounts below the deductible or above the policy limit. Each policy has its own list, and we go through the one that applies to you.',
  },
  {
    category: 'purchase',
    question: 'How do I get a quote?',
    answer:
      'Share a few details through the Get a Quote form — whether you want Individual or Family cover, and how to reach you. Our team reviews it and gets in touch to discuss suitable options.',
  },
  {
    category: 'purchase',
    question: 'How is the premium determined?',
    answer:
      'The insurer sets the premium based on the cover and limits selected, the plan type, and its own underwriting assessment.',
  },
  {
    category: 'purchase',
    question: 'Which insurer will provide my policy?',
    answer:
      'The policy is issued by the insurance company, not by Backup24/7. We help you understand and compare the options available from our insurance partners.',
  },
  {
    category: 'claims',
    question: 'What do I do after an incident?',
    answer:
      'Notify the relevant team or insurer as soon as reasonably possible, secure the affected accounts and devices, and preserve the evidence — screenshots, messages, transaction records. Then contact us and we will help you through the process.',
  },
  {
    category: 'claims',
    question: 'Who decides my claim?',
    answer:
      'The insurer decides, in accordance with the policy wording. We assist with notification, documentation and follow-up. We do not decide claims and cannot guarantee an outcome or a timeframe.',
  },
];

export const faqCategoryLabels: Record<FAQ['category'], string> = {
  general: 'General',
  'individuals-families': 'Individuals & Families',
  coverage: 'Coverage',
  purchase: 'Purchase',
  claims: 'Claims',
};

export function faqsByCategory(category: FAQ['category']) {
  return faqs.filter((f) => f.category === category);
}
