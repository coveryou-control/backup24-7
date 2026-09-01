import type { Config } from 'tailwindcss';

/**
 * Tailwind reads the brand through the CSS variables in styles/tokens.css.
 * No hex values or font names live here — §4 requires the theme to be a
 * one-file swap.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,mdx}'],
  theme: {
    extend: {
      /**
       * Composed from the channel variables in styles/tokens.css with
       * `<alpha-value>`, which is what makes `bg-primary/10`, `bg-bg/95`,
       * `border-primary/20` and friends generate real CSS. A bare
       * `var(--color-x)` here silently produces nothing for those utilities.
       */
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        primary: 'rgb(var(--primary-rgb) / <alpha-value>)',
        'primary-hover': 'rgb(var(--primary-hover-rgb) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        danger: 'rgb(var(--danger-rgb) / <alpha-value>)',

        // Already carry their own alpha and are never opacity-modified.
        muted: 'var(--color-muted)',
        subtle: 'var(--color-subtle)',
        hairline: 'var(--color-hairline)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        display: 'var(--font-display)',
        accent: 'var(--font-accent)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
        pill: 'var(--radius-pill)',
      },
      maxWidth: {
        shell: 'var(--shell-max)',
        measure: '70ch',
      },
      /**
       * §4 permits fade, slide and scroll reveals only — no scroll-hijacking,
       * no heavy 3D. `both` fill on every entrance is deliberate: the element
       * starts from the keyframe's opening frame, so there is no flash of
       * finished content before the animation begins, and it needs no JS.
       */
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'rise-sm': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
        pop: {
          from: { opacity: '0', transform: 'translateY(12px) scale(.97)' },
          to: { opacity: '1', transform: 'none' },
        },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        rise: 'rise .65s cubic-bezier(.16,1,.3,1) both',
        'rise-sm': 'rise-sm .55s cubic-bezier(.16,1,.3,1) both',
        pop: 'pop .7s cubic-bezier(.16,1,.3,1) both',
        fade: 'fade 1.1s ease-out both',
        'accordion-down': 'accordion-down .3s cubic-bezier(.16,1,.3,1)',
        'accordion-up': 'accordion-up .3s cubic-bezier(.16,1,.3,1)',
      },
    },
  },
  plugins: [],
};

export default config;
