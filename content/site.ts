/**
 * Brand, contact, legal identity, navigation and the compliance boilerplate.
 *
 * Every value marked PLACEHOLDER is listed in PLACEHOLDERS.md and must be
 * replaced before launch (§11, Appendix A). None of them ship as fact — the
 * footer states openly that they are placeholders while `IS_PREVIEW` is true.
 */

export const IS_PREVIEW = true; // flip to false once §16 is signed off

export const site = {
  name: 'Backup24/7',
  positioning: 'Cyber protection for everyday life.',
  description:
    'Personal cyber insurance for individuals and families in India. Understand online risks in plain language and get connected with cover that fits your life.',
  /** PLACEHOLDER — production domain */
  url: 'https://backup247.in',
  locale: 'en-IN',
};

/**
 * The hero's background plate — the theme's signature motion.
 *
 * Two implementations of the same look, selected by `mode` below. The scene is
 * the default because it resolves a §4 conflict: the supplied theme's footage is
 * abstract green data-bars, close to the "neon-green / matrix" look §4 asks us
 * to avoid for a consumer brand, and in a palette we cannot change. The scene
 * draws the same character from the brand mint in styles/tokens.css, so the
 * theme stays a one-file swap. Both are listed in PLACEHOLDERS.md.
 */
export const heroMedia = {
  /**
   * 'scene' — a procedural WebGL bar field (components/HeroScene.tsx). Brand
   *           mint, no network dependency, no visible loop, resolution
   *           independent. Costs a GPU render loop while the hero is on screen.
   * 'video' — the theme's HLS clip as supplied (components/HeroVideo.tsx).
   *           Hardware-decoded and cheaper on battery, but a fixed 1920×832
   *           plate in a palette we do not control.
   * Both sit under the same scrim, veil and fade-in, so this is a safe A/B.
   */
  mode: 'scene' as 'scene' | 'video',

  src: 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8',
  /** PLACEHOLDER — a first-frame still would remove the fade-in on slow links. */
  poster: null as string | null,
  /** Settled opacity. Dim enough that white body copy clears WCAG AA over it. */
  opacity: 0.6,
};

export const contact = {
  /** PLACEHOLDER — not a real number */
  phone: '+919999900000',
  phoneDisplay: '+91 99999 00000',
  /** PLACEHOLDER */
  whatsapp: '919999900000',
  whatsappMessage: 'Hi Backup24/7, I would like to understand personal cyber insurance.',
  /** PLACEHOLDER */
  email: 'hello@backup247.in',
  /** PLACEHOLDER */
  officeHours: 'Monday to Saturday, 10:00 – 19:00 IST',
  /** PLACEHOLDER — registered office */
  address: 'PLACEHOLDER — registered office address',
};

export const legal = {
  /** PLACEHOLDER — registered legal entity of the broking company */
  entity: 'PLACEHOLDER Insurance Brokers Private Limited',
  /** PLACEHOLDER — IRDAI broker registration number */
  irdaiRegistration: 'PLACEHOLDER',
  /** PLACEHOLDER — broker category, e.g. Direct Broker (General) */
  brokerCategory: 'PLACEHOLDER',
  cin: 'PLACEHOLDER',
  privacyPolicyVersion: '2026-01',
};

/**
 * §11 — the persistent compliance line, plus the variants used on specific
 * surfaces. The Disclaimer component takes a key, never free text, so no page
 * can invent its own wording.
 */
export const disclaimers = {
  coverage:
    'Coverage is subject to the applicable policy terms, conditions, exclusions, limits and underwriting requirements.',
  facilitation:
    'Coverage is subject to the applicable policy terms, conditions, exclusions, limits and underwriting requirements. Backup24/7 facilitates enquiries; the insurance expert advises.',
  claims:
    'Claims outcomes are decided by the insurer in accordance with the policy wording. We assist with the process; we do not decide or guarantee any claim.',
  advisory:
    'The information on this website is general in nature and provided for education. It is not insurance advice.',
  partner:
    'Explore cyber insurance options from our insurance partners, subject to eligibility, underwriting and policy terms.',
} as const;

export type DisclaimerKind = keyof typeof disclaimers;

/**
 * Consent copy. The ConsentField component appends the linked "Privacy Policy."
 * itself, so this is the sentence up to that point.
 */
export const consentText =
  'I agree to be contacted by Backup24/7 about my enquiry by phone, WhatsApp or email, and I have read the';

/** §6 — primary navigation. About and Contact live in the footer, not here. */
export const primaryNav = [
  { label: 'Why Cyber Insurance?', href: '/why-cyber-insurance' },
  { label: 'Coverage', href: '/coverage' },
  { label: 'Plans', href: '/plans' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Insurance Partners', href: '/insurance-partners' },
  { label: 'Claims', href: '/claims' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQs', href: '/faqs' },
];

export const primaryCta = { label: 'Get a Quote', href: '/get-a-quote' };

export const footerNav = [
  {
    heading: 'Why Cyber Insurance',
    links: [
      { label: 'Why you need it', href: '/why-cyber-insurance/why-you-need-cyber-insurance' },
      { label: 'Risks for individuals', href: '/why-cyber-insurance/cyber-risks-for-individuals' },
      { label: 'Risks for families', href: '/why-cyber-insurance/cyber-risks-for-families' },
    ],
  },
  {
    heading: 'Coverage',
    links: [
      { label: 'All coverage', href: '/coverage' },
      { label: 'Online financial fraud', href: '/coverage/online-financial-fraud' },
      { label: 'Identity theft', href: '/coverage/identity-theft' },
      { label: 'What is not covered', href: '/coverage/what-is-not-covered' },
    ],
  },
  {
    heading: 'Plans',
    links: [
      { label: 'Compare plans', href: '/plans' },
      { label: 'Individual Plan', href: '/plans/individual' },
      { label: 'Family Plan', href: '/plans/family' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Claims', href: '/claims' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

export const waHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;
export const telHref = `tel:${contact.phone}`;
export const mailHref = `mailto:${contact.email}`;
