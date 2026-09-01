import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowRight } from 'lucide-react';

import { Shell, Section, Breadcrumbs, CTAButton, Disclaimer, Panel } from '@/components/primitives';
import { ArticleCard } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { getAllResources, getResource, getResourcesByCategory, resourceCategoryLabels } from '@/lib/resources';
import { coverageItems } from '@/content/coverage';
import { planById } from '@/content/plans';
import { pageMetadata, breadcrumbSchema, articleSchema, JsonLd } from '@/lib/seo';

/** §8.9 / §12 — the article template, with Article JSON-LD. */
export function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getResource(slug);
  if (!found) return {};
  return pageMetadata(found.meta.seo, `/resources/${slug}`);
}

/** Styling for the MDX body. Tailwind's typography plugin is not installed, so the element map is explicit. */
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-12 text-[22px] font-extrabold tracking-tight text-ink md:text-[26px]" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-[17px] font-semibold text-ink" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-5 text-[15px] leading-[1.8] text-muted" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-5 space-y-2.5 pl-1" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[15px] leading-[1.75] text-muted marker:text-primary" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-primary underline" {...props} />
  ),
  hr: () => <hr className="mt-10 border-hairline" />,
};

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getResource(slug);
  if (!found) notFound();

  const { meta, body } = found;
  const related = getResourcesByCategory(meta.category).filter((r) => r.slug !== meta.slug).slice(0, 3);
  const plans = meta.relatedPlans.map(planById).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Resources', href: '/resources' },
    { name: meta.title, href: `/resources/${meta.slug}` },
  ];

  return (
    <>
      <Shell narrow className="pt-[96px]">
        <Breadcrumbs trail={trail} />

        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              {resourceCategoryLabels[meta.category]}
            </span>
            <span className="text-[12px] text-subtle">{meta.readingTime}</span>
            <span aria-hidden="true" className="text-white/25">·</span>
            <span className="text-[12px] text-subtle">Last reviewed {meta.lastReviewed}</span>
          </div>

          <h1 className="mt-5 text-[30px] font-extrabold leading-[1.15] tracking-tight text-ink md:text-[40px]">
            {meta.title}
          </h1>
          <p className="mt-5 text-[16px] leading-[1.7] text-muted">{meta.excerpt}</p>

          <div className="mt-10">
            <MDXRemote source={body} components={mdxComponents} />
          </div>

          <Disclaimer kind="advisory" className="mt-12" />
        </article>

        {/* Related plans + coverage */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {plans.length > 0 && (
            <Panel hover={false} className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Relevant plans</h2>
              <ul className="mt-4 space-y-2.5">
                {plans.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/plans/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-[13.5px] text-primary hover:underline"
                    >
                      {p.name}
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel hover={false} className="p-6">
            <h2 className="text-[15px] font-semibold text-ink">Related coverage</h2>
            <ul className="mt-4 space-y-2.5">
              {coverageItems.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/coverage/${c.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13.5px] text-primary hover:underline"
                  >
                    {c.title}
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <CTAButton href="/get-a-quote" className="mt-10">
          Get a Quote
        </CTAButton>
      </Shell>

      {related.length > 0 && (
        <Section tone="raised" className="mt-16">
          <Shell>
            <h2 className="text-[22px] font-extrabold tracking-tight text-ink">
              More in {resourceCategoryLabels[meta.category]}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <ArticleCard resource={r} categoryLabel={resourceCategoryLabels[r.category]} />
                </li>
              ))}
            </ul>
          </Shell>
        </Section>
      )}

      <FinalCta />

      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd
        data={articleSchema({
          title: meta.title,
          description: meta.excerpt,
          path: `/resources/${meta.slug}`,
          author: meta.author,
          lastReviewed: meta.lastReviewed,
        })}
      />
    </>
  );
}
