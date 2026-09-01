'use client';

import { useEffect, useRef, useState } from 'react';
import { heroMedia } from '@/content/site';

/**
 * The supplied theme's living hero background: a looping, muted HLS clip behind
 * the copy. This is the motion the theme is built around — in the reference the
 * headline, glass card and nav are static from the first frame and only this
 * plate moves.
 *
 * Client-only by necessity (media element + HLS attachment), and deliberately
 * the ONLY client component in the hero so the headline, CTAs and JSON-LD stay
 * server-rendered. If the clip fails for any reason the gradient atmosphere in
 * Hero.tsx is a complete background on its own — the hero never depends on the
 * network to look finished.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  /** Gates the fade-in so a black rectangle never flashes over the gradient. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // §4 permits fade/slide only, and reduced motion must be honoured. A looping
    // clip is continuous motion, so opt out entirely rather than merely shorten
    // it — the gradients below are the reduced-motion background.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /**
     * Reveal is driven by readyState, not by the `canplay` event alone.
     *
     * The event is racy: hls.js can push enough data to clear canplay before
     * this effect runs, and a listener attached afterwards never fires — which
     * left the element permanently at opacity 0 with readyState 4, a fully
     * loaded video that was simply invisible. Checking the state directly, and
     * on every subsequent readiness event, cannot miss that window.
     */
    const markReady = () => {
      if (video.readyState >= 3) setReady(true);
    };
    const EVENTS = ['loadeddata', 'canplay', 'playing'] as const;
    EVENTS.forEach((e) => video.addEventListener(e, markReady));

    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    // Safari plays HLS natively, and better than hls.js can — only pay for the
    // library where the browser cannot do it itself.
    if (video.canPlayType('application/vnd.apple.mpegurl') === 'probably') {
      video.src = heroMedia.src;
      video.play().catch(() => {});
      markReady();
    } else {
      // Dynamic import keeps hls.js out of the initial bundle; the hero is above
      // the fold but its background is not critical to first paint.
      import('hls.js')
        .then(({ default: Hls }) => {
          if (cancelled || !Hls.isSupported()) return;

          /**
           * enableWorker:false is required, not a preference — the worker build
           * fails under this app's bundling and dies silently, leaving a black
           * hero with nothing in the console. Parsing on the main thread costs
           * little for one short muted loop.
           */
          const instance = new Hls({
            enableWorker: false,
            /**
             * The clip is decorative and heavily veiled, so there is no reason
             * to pull a 1920-wide rendition onto a 375px phone and bill the
             * visitor for it. Caps the level to the element's actual size.
             */
            capLevelToPlayerSize: true,
          });
          hls = instance;
          instance.loadSource(heroMedia.src);
          instance.attachMedia(video);
          instance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
            markReady();
          });
        })
        .catch(() => {
          /* no clip; the gradient atmosphere stands on its own */
        });
    }

    return () => {
      cancelled = true;
      EVENTS.forEach((e) => video.removeEventListener(e, markReady));
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={ref}
      poster={heroMedia.poster ?? undefined}
      // autoPlay as well as the explicit play() call: the attribute covers the
      // case where the element becomes ready outside any handler we own, and
      // play() covers browsers that will not autoplay a src attached late.
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
      /* Inline rather than an opacity-* utility: the settled value is a theme
         token, not one of Tailwind's steps — and a utility would lose to this
         style anyway, which is the kind of dead class that reads as intent. */
      style={{ opacity: ready ? heroMedia.opacity : 0 }}
    />
  );
}
