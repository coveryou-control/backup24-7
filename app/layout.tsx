import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { site, IS_PREVIEW } from '@/content/site';
import { organizationSchema, JsonLd } from '@/lib/seo';
import './globals.css';

/**
 * Fonts are self-hosted by next/font, so there is no third-party request and no
 * layout shift (§14). They expose CSS variables that styles/tokens.css consumes,
 * keeping §4's "theme is a one-file swap" property intact.
 */
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta' });
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
  variable: '--font-instrument',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Personal Cyber Insurance for Individuals & Families`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: site.name,
    url: site.url,
  },
  /**
   * §11/§12 — indexing stays off while the legal entity, IRDAI registration and
   * insurer product details are PLACEHOLDERs. It is switched on by the launch
   * checklist, not before.
   */
  robots: IS_PREVIEW ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#070b0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jakarta.variable} ${instrument.variable}`}>
      <body>
        {children}
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
