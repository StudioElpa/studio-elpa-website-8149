# Studio Elpa — Design System

Source of truth: the existing hand-built site (`studioelpa-site.zip`) plus the Runnable V1 brief.
This is a **polish-and-wire** job. Copy, imagery, and brand identity are preserved; rhythm,
hierarchy, accessibility, and motion are improved.

## Tokens (use exactly — from brief Section 4)

```
--bg:        #F5F1EA   /* warm cream page background */
--bg-alt:    #EDE6DA   /* alternating band */
--surface:   #FAF7F2   /* cards / inputs */
--ink:       #39291B   /* espresso — headings / primary text */
--ink-soft:  #4A3626   /* warm brown — body copy (the readable body color) */
--accent:    #6D7204   /* chartreuse-olive from the logo — primary CTA + kickers
                          Darkened 11% from the logo's #7B8105 (same hue) so it
                          clears WCAG AA both ways: 4.60:1 as text on cream, and
                          5.17:1 behind white button text. #7B8105 failed both
                          (3.74:1 and 4.21:1). */
--accent-2:  #7C8471   /* muted sage — secondary accents */
--hairline:  #D9D0C1   /* thin rules / borders */
```

Supporting values carried over from the original build (not in the brief, but part of the
existing look and kept for fidelity):

```
--dark-body:  #E8E1D4  /* body copy on dark bands — legible, not pure white */
--dark-head:  #FAF7F2  /* headings on dark bands */
--dark-kick:  #c9a67e  /* warm tan kicker on dark bands */
--dark-rule:  #45413b  /* hairline inside dark bands */
--dark-mute:  #a89f92  /* footer secondary text */
--elpa-grade: saturate(.82) contrast(.96) brightness(1.04) sepia(.14)  /* photo grade */
```

No pure black, no pure white, no drop-shadow-heavy cards.

## Typography

- **Headings:** Cormorant Garamond, weight 500, line-height ~1.15. Sentence case, real
  lowercase. Never an all-caps display face.
- **Body:** Jost, weight 400, line-height ~1.7–1.75, color `--ink-soft`. Minimum 16px.
- **Kickers/labels:** Jost ~11px, uppercase, letter-spacing ~0.3em, color `--accent`.
- Loaded from Google Fonts with `preconnect`, weights limited to what is used.

## Buttons

- **`btn-dark` (primary):** `--accent` fill, white text, weight 600, uppercase, 0.18em
  tracking. Hover `#69700a`.
- **`btn-line` (secondary):** cream fill, 1px `--ink` border, `--ink` text. Hover inverts to `--ink`.
- **`btn-solid` / `btn-ghost`:** used on dark bands and photo heroes only.
- All hover/focus transitions are CSS, never GSAP.

## Layout

- Container max-width 1080px, 40px gutters (24px on mobile).
- Sections alternate `--bg` / `--bg-alt` / `--surface`, with `--ink` dark bands for emphasis.
- Editorial two-column splits (heading left, body right), asymmetric where it earns it.
  Deliberately **not** a grid of identical feature cards.
- Generous vertical rhythm: 82px block padding desktop, 56px mobile.

## Logo handling

Only `logo.png` and `logo-mark.png` exist today (no SVG, no reversed mark).

- Light backgrounds: the existing color logo image.
- Dark footers/bands: the "Studio Elpa" wordmark set in Cormorant Garamond cream, rather
  than force-recoloring the color logo.
- Both go through the `<Logo>` and `<Wordmark>` components, so a real SVG and a reversed
  light logo can be dropped in later by changing those two files only.

## Motion (brief Section 7)

GSAP 3 + ScrollTrigger. Calm and expensive, never flashy.

- Every animation sits behind a `prefers-reduced-motion: reduce` guard. When reduced motion
  is on, everything renders in its final state with no transforms.
- Hero: staggered rise-and-fade, kicker → headline → paragraph → buttons (y 16→0, opacity
  0→1, stagger 0.08s, duration 0.7s, `power2.out`). Illustration fades/scales in after.
- Section reveals at `top 80%`, `toggleActions: "play none none none"` so nothing replays.
- Cards/tiles/steps: 0.06–0.1s stagger within their group.
- Imagery: a few percent of parallax travel, no more.
- Header: background opacity + shadow appear after ~60px of scroll.
- Durations 0.5–0.8s, easing `power2.out` / `power3.out`. Nothing bounces, spins, or slides
  in from off-screen.
- Hero text is readable immediately and never gated behind animation (no opacity:0 on the
  server-rendered LCP text without an instant fallback).

## Accessibility

WCAG 2.1 AA. Visible focus rings on every interactive element, keyboard-operable nav and FAQ
accordions (`button` + `aria-expanded` + `aria-controls`), semantic heading order, descriptive
alt text, 16px minimum body text, contrast checked against the warm palette.

## Anti-patterns (brief Section 5b — hard no)

No purple/blue gradients, no glassmorphism, no neon, no default Bootstrap/Tailwind-looking
components, no stock or AI-generated imagery, no fake logos or trust badges, no invented
testimonials or statistics, no identical evenly-sized feature-card grids.
