import type { PlanId, SEO } from './types';

/**
 * §8.2 — long-form content for the "Why Cyber Insurance?" children.
 *
 * This is general education about how personal cyber risk works. It makes no
 * product claims, so it needs editorial review rather than insurer validation.
 *
 * TONE (§0): calm and specific. Where a statistic would normally go, we describe
 * a situation instead — situations are true, and statistics we cannot source are
 * not.
 */

export interface RiskProfile {
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  context: string[];
  exposures: { icon: string; title: string; detail: string }[];
  practicalSteps: string[];
  relevantCoverage: string[];
  plan: PlanId;
  seo: SEO;
}

export const riskProfiles: RiskProfile[] = [
  {
    slug: 'cyber-risks-for-individuals',
    eyebrow: 'For individuals',
    title: 'Cyber risks for individuals',
    lead: 'One person, one phone, and almost everything that matters reachable from it. That concentration is the exposure.',
    context: [
      'A single device now holds your bank, your identity documents, your email, your photos and your saved cards. None of that was a decision — it happened one convenient app at a time.',
      'The consequence is that compromising one thing tends to compromise several. Email is the reset path for the bank. The phone number is the second factor for the email. The photos include a picture of a document you needed to send someone once.',
      'This is not carelessness. It is what using ordinary services looks like in 2026. But it does mean the risk sits directly with you, and there is nobody else to escalate to.',
    ],
    exposures: [
      {
        icon: 'card',
        title: 'Money moves in seconds',
        detail:
          'UPI and saved cards are designed for speed, which also means an unauthorised transaction completes before you could plausibly notice it.',
      },
      {
        icon: 'mail',
        title: 'Email is the master key',
        detail:
          'Almost every account you own can be reset through your inbox. Securing it protects services you have forgotten you signed up for.',
      },
      {
        icon: 'id',
        title: 'Documents you have already shared',
        detail:
          'Scans of ID sent over chat for a booking or a rental do not come back. You no longer control where those copies live.',
      },
      {
        icon: 'user',
        title: 'One number, one identity',
        detail:
          'Your mobile number is the second factor for nearly everything. A SIM swap or a ported number is disproportionately damaging.',
      },
      {
        icon: 'lock',
        title: 'No backup for the irreplaceable',
        detail:
          'Photos and documents on a single laptop or phone are one incident away from gone, and there is no IT department to call.',
      },
    ],
    practicalSteps: [
      'Turn on two-factor authentication for your email first — it protects everything downstream',
      'Use a different password for your email and your bank than for anything else',
      'Keep one backup of photos and documents that is not connected to your main device',
      'Never approve a payment request you did not initiate; in UPI, money is sent, not collected',
      'Verify any request about money on a number you already had, not one from the message',
    ],
    relevantCoverage: ['online-financial-fraud', 'identity-theft', 'phishing-and-spoofing'],
    plan: 'individual',
    seo: {
      title: 'Cyber Risks for Individuals in India',
      description:
        'How personal cyber risk actually works for one person: money, email, documents and devices. Practical steps, and where cyber insurance fits.',
    },
  },
  {
    slug: 'cyber-risks-for-families',
    eyebrow: 'For families',
    title: 'Cyber risks for families',
    lead: 'A household is not one exposure multiplied. It is several exposures that share devices, logins and a single Wi-Fi network.',
    context: [
      'The moment more than one person in a home transacts online, the risk changes shape. A shared tablet means one compromise reaches everyone’s sessions. A family email means one reset path covers several people’s accounts.',
      'Households also reuse credentials across each other far more than individuals do, usually for entirely practical reasons — a shared streaming login, a parent’s card on a child’s device, one password everyone can remember.',
      'And then there is the exposure that has no individual-plan equivalent: children and teenagers online. Cyberbullying, impersonation, harassment and in-app spending are household problems, and they are the reason family cover typically includes a section an individual policy may not.',
    ],
    exposures: [
      {
        icon: 'users',
        title: 'Shared devices',
        detail:
          'A tablet or laptop used by everyone means a single compromise reaches every logged-in account on it.',
      },
      {
        icon: 'user',
        title: 'Children and teenagers online',
        detail:
          'Harassment, impersonation and oversharing are real risks, and they rarely get reported at home until they are serious.',
      },
      {
        icon: 'card',
        title: 'Cards on other people’s devices',
        detail:
          'A parent’s card saved on a child’s phone for one purchase tends to stay there, and in-app spending follows.',
      },
      {
        icon: 'mail',
        title: 'Reused and shared logins',
        detail:
          'One password across several family members means one breach exposes all of them at once.',
      },
      {
        icon: 'id',
        title: 'Documents for the whole household',
        detail:
          'School forms, medical records, ID for several people — usually in one folder, on one device.',
      },
    ],
    practicalSteps: [
      'Give each person their own login — shared accounts make it impossible to know what happened',
      'Turn on two-factor authentication for the adults’ email accounts first',
      'Agree a household rule: nobody approves a payment request without telling someone else',
      'Talk to children about harassment and impersonation before it happens, not after',
      'Keep one backup of the family photos that is not on any device in daily use',
    ],
    relevantCoverage: [
      'cyberbullying-and-harassment',
      'online-financial-fraud',
      'identity-theft',
      'data-loss-and-restoration',
    ],
    plan: 'family',
    seo: {
      title: 'Cyber Risks for Families in India',
      description:
        'How cyber risk changes for a household: shared devices, children online, reused logins. Practical steps, and where family cyber cover fits.',
    },
  },
];

export function riskProfileBySlug(slug: string) {
  return riskProfiles.find((r) => r.slug === slug);
}

/** §8.2 — /why-cyber-insurance/why-you-need-cyber-insurance */
export const digitalFootprint = [
  { icon: 'card', title: 'Bank & UPI apps', detail: 'Money that moves in seconds, from a device in your pocket.' },
  { icon: 'card', title: 'Saved cards & wallets', detail: 'Card details stored across dozens of apps you no longer open.' },
  { icon: 'bag', title: 'Online shopping', detail: 'Addresses, payment details and order history, everywhere you have bought.' },
  { icon: 'mail', title: 'Email', detail: 'The reset path for every other account you own.' },
  { icon: 'user', title: 'Social media', detail: 'Your identity, your contacts, and the trust people place in your account.' },
  { icon: 'database', title: 'Cloud photos & documents', detail: 'Years of things you cannot reconstruct if they are gone.' },
  { icon: 'id', title: 'Identity documents', detail: 'Scans you have shared once and cannot un-share.' },
  { icon: 'lock', title: 'Smart devices', detail: 'Anything on your home network is a route to everything else on it.' },
];

export const cascadeSteps = [
  'One credential is compromised — often through a message that looked entirely ordinary.',
  'That credential unlocks the email account, because it was reused or because email was the target.',
  'Email is the reset path, so other accounts follow: bank, shopping, social, cloud storage.',
  'Money moves, or private material becomes leverage, or documents are used to open something in your name.',
  'You discover it, and the work of proving what happened begins — with banks, platforms and police.',
];
