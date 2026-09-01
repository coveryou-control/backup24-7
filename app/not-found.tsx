import Link from 'next/link';
import { site } from '@/content/site';

/** §8.15 — on-brand, calm; links to Home, Coverage, Plans, Get a Quote. */
export default function NotFound() {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Coverage', href: '/coverage' },
    { label: 'Plans', href: '/plans' },
    { label: 'Get a Quote', href: '/get-a-quote' },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="mx-auto w-full max-w-[560px] text-center">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          404
        </p>
        <h1 className="mt-4 text-[30px] font-extrabold leading-[1.15] tracking-tight text-ink md:text-[40px]">
          We couldn’t find that page.
        </h1>
        <p className="mt-5 text-[15px] leading-[1.75] text-muted">
          The page may have moved, or the link may be out of date. {site.positioning} — here is where
          to pick it back up.
        </p>

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex min-h-[48px] items-center rounded-pill px-6 text-[13px] font-bold uppercase tracking-wide text-ink ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/[0.06] hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
