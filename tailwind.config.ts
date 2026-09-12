import type { Config } from "tailwindcss";

/**
 * Design tokens mirror the CSS custom properties defined once in
 * app/globals.css (:root) — see PROJECT_BIBLE.md "Design tokens". Colors
 * reference the CSS variables directly (var(--gold) etc.) rather than
 * duplicating hex values, so globals.css stays the single source of truth
 * that all three former HTML files' :root blocks collapsed into.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--black)",
        iron: "var(--iron)",
        charcoal: "var(--charcoal)",
        blu: "var(--blu)",
        "blu-lift": "var(--blu-lift)",
        gold: "var(--gold)",
        "gold-dark": "var(--gold-dark)",
        rosso: "var(--rosso)",
        "rosso-text": "var(--rosso-text)",
        white: "var(--white)",
        smoke: "var(--smoke)",
        steel: "var(--steel)",
        ash: "var(--ash)",
        graphite: "var(--graphite)",
        line: "var(--line)",
        navy: "var(--navy)",
        cyan: "var(--cyan)",
        sage: "var(--sage)",
      },
      spacing: {
        xxs: "var(--xxs)",
        xs: "var(--xs)",
        sm: "var(--sm)",
        md: "var(--md)",
        lg: "var(--lg)",
        xl: "var(--xl)",
        xxl: "var(--xxl)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        script: ["var(--font-beau-rivage)", "cursive"],
        italianno: ["var(--font-italianno)", "cursive"],
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(.16,1,.3,1)",
      },
      // The 12° cut (atan(18/84)) and hex clip-paths stay as the hand-written
      // .cut / .cut-sm / .hex utility classes in globals.css (Tailwind v3 has
      // no core clip-path utilities) — kept there rather than duplicated here.
    },
  },
  plugins: [],
};

export default config;
