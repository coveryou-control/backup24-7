import { Shell, CTAButton, Eyebrow } from './primitives';
import { HeroVideo } from './HeroVideo';
import { HeroScene } from './HeroScene';
import { heroMedia } from '@/content/site';

/**
 * §9.2 homepage hero, and the shared interior page hero below it.
 *
 * THE MOTION LIVES IN THE BACKGROUND, NOT THE COPY.
 * In the supplied theme's reference recording the headline, card and nav are
 * static from the first frame — what moves is the plate behind them. An earlier
 * version of this file dropped that plate for CSS gradients alone, which is why
 * the hero read as "not animating": gradients are still, so there was nothing
 * to see.
 *
 * The plate is the bottom layer and everything below is the treatment over it:
 * a left scrim so the copy sits on near-black, a mobile veil, the centre bloom,
 * the quarter-mark grid lines, and a bottom wash to hand off to the next
 * section. Those layers are also the complete fallback — if the plate never
 * initialises (no WebGL2, blocked stream) the hero still looks deliberate.
 */

function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Swap point is content/site.ts → heroMedia.mode. */}
      {heroMedia.mode === 'video' ? <HeroVideo /> : <HeroScene />}

      {/*
        Readability scrim. The copy column occupies the left ~55% and white body
        text at 14px cannot clear WCAG AA over a moving plate, so that side is
        crushed to the page ground and the plate is only allowed to read to the
        right of the text.

        The falloff sits further right than it first did. With the WebGL plate
        the nine depth rows blend additively and saturate, so a blown-out bar
        can land at the headline's right edge — measured at x≈54% of the stage.
        Protecting the column here, rather than dimming the whole plate, keeps
        the field bright where nothing sits on top of it.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--color-bg) 0%, rgb(var(--bg-rgb) / 0.95) 30%, rgb(var(--bg-rgb) / 0.62) 62%, rgb(var(--bg-rgb) / 0.22) 100%)',
        }}
      />

      {/*
        Mobile veil. The scrim above works by splitting the stage into a dark
        copy column and a lit plate — but below md there is no second column:
        the headline and lead run the full width, straight through the scrim's
        weakest end. Measured, the brightest frame of the clip landed behind
        body copy there. So small screens get an almost-flat veil instead of a
        split, trading most of the plate's presence for legibility.
      */}
      <div className="absolute inset-0 bg-bg/70 md:hidden" />

      {/* centre-top bloom — fades up slowly behind the copy */}
      <svg
        className="absolute left-1/2 top-0 h-[60vh] w-[130vw] -translate-x-1/2 animate-fade md:w-[105vw]"
        viewBox="0 0 1200 620"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="hero-bloom" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="25" />
          </filter>
          {/* Softer than it was pre-video: the plate now supplies the light, so
              a strong bloom on top of it just muddies both. */}
          <radialGradient id="hero-bloom-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.16" />
            <stop offset="48%" stopColor="var(--color-primary)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="600" cy="180" rx="470" ry="120" fill="url(#hero-bloom-fill)" filter="url(#hero-bloom)" />
      </svg>

      {/* three hairlines at the quarter marks, desktop only */}
      <div className="absolute inset-0 hidden md:block">
        {['25%', '50%', '75%'].map((left, i) => (
          <span
            key={left}
            className="absolute top-0 h-full w-px animate-fade bg-white/10"
            style={{ left, animationDelay: `${120 + i * 90}ms` }}
          />
        ))}
      </div>

      {/* bottom-up wash so the hero hands off cleanly to the first section */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(0deg, var(--color-bg) 0%, rgba(7,11,10,0.72) 18%, rgba(7,11,10,0) 58%)',
        }}
      />
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      <Atmosphere />

      <Shell className="relative z-10 flex min-h-[88vh] flex-col justify-center py-16">
        {/*
          Entrance choreography. Pure CSS with staggered `animationDelay` rather
          than JS: the hero is server-rendered and above the fold, so it must
          animate on first paint and must not depend on hydration — an earlier
          version of this page shipped a form whose handlers were dead because
          its subtree never hydrated, and a hero that silently stays invisible
          would be the same failure with worse consequences.

          `both` fill means each element holds its opening frame until its delay
          elapses, so nothing flashes in finished and then re-animates.
        */}

        {/*
          The theme's liquid-glass plate sat above the eyebrow here. Removed on
          request — as a fixed 200×200 square holding three unrelated lines it
          read as a stray tile rather than part of the composition.

          GlassCard and the `pop` keyframe are both left in place: the plate is
          the theme's signature surface and this was its only consumer, so
          deleting them would turn a one-block restore into a rebuild.
        */}

        <Eyebrow className="animate-rise-sm" style={{ animationDelay: '120ms' }}>
          Backup24/7 • Personal Cyber Insurance
        </Eyebrow>

        <h1
          className="mt-4 max-w-[16ch] animate-rise text-[32px] font-extrabold uppercase leading-[1.06] tracking-tight text-ink sm:text-[40px] md:max-w-[20ch] md:text-[48px] lg:text-[56px]"
          style={{ animationDelay: '200ms' }}
        >
          Your life is online.{' '}
          <span className="text-ink/70">
            Your protection should be too<span className="text-primary">.</span>
          </span>
        </h1>

        <p
          className="mt-6 max-w-[62ch] animate-rise text-[14px] leading-[1.7] text-muted md:text-[15px]"
          style={{ animationDelay: '340ms' }}
        >
          You bank, pay, shop and connect online every day. That convenience comes with real cyber
          risks — fraud, identity theft, phishing and more. Backup24/7 helps you understand those
          risks and connect with cyber insurance built for individuals and families.
        </p>

        <div
          className="mt-9 flex animate-rise flex-wrap items-center gap-3"
          style={{ animationDelay: '440ms' }}
        >
          <CTAButton href="/get-a-quote">Get a Quote</CTAButton>
          <CTAButton href="/why-cyber-insurance/why-you-need-cyber-insurance" variant="ghost">
            Why do you need cyber insurance?
          </CTAButton>
        </div>
      </Shell>
    </section>
  );
}

/** Shared hero for every interior page. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-hairline pt-[72px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 22% -10%, rgba(94,210,156,0.13), rgba(7,11,10,0) 58%)',
          }}
        />
      </div>

      <Shell className="relative z-10 py-14 md:py-20">
        {/* Breadcrumbs arrive as children and need their own gap — without it
            they collide with the eyebrow directly beneath. */}
        {children && (
          <div className="mb-8 animate-fade" style={{ animationDelay: '60ms' }}>
            {children}
          </div>
        )}
        {eyebrow && (
          <Eyebrow className="animate-rise-sm" style={{ animationDelay: '80ms' }}>
            {eyebrow}
          </Eyebrow>
        )}
        <h1
          className="mt-4 max-w-[22ch] animate-rise text-[30px] font-extrabold leading-[1.1] tracking-tight text-ink md:text-[44px]"
          style={{ animationDelay: '150ms' }}
        >
          {title}
        </h1>
        {lead && (
          <div
            className="mt-5 max-w-[62ch] animate-rise text-[15px] leading-[1.7] text-muted"
            style={{ animationDelay: '260ms' }}
          >
            {lead}
          </div>
        )}
      </Shell>
    </section>
  );
}
