import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { legalDocs } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

const SLUG = 'privacy-policy' as const;

export const metadata: Metadata = pageMetadata(legalDocs[SLUG].seo, `/${SLUG}`);

export default function Page() {
  return <LegalPage slug={SLUG} />;
}
