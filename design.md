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

## Typography — "Warm Editorial" (supersedes the V1 Cormorant/Jost pairing)

**Newsreader** (serif) for editorial voice, **Instrument Sans** for everything
functional. Both self-hosted; there is no third-party font request in production.

### The three files

All in `packages/web/public/fonts/`, referenced from CSS as `/fonts/*.woff2`.
Both families ship upstream as variable fonts, so the honest set is three files
rather than the six static faces the brief listed. Weight ranges are **live**,
which is what keeps the browser from synthesising a bold or an italic.

| file | axes | bytes |
|---|---|---|
| `newsreader-var-latin.woff2` | `wght` 400–500, `opsz` pinned 24 | 37,712 |
| `newsreader-italic-latin.woff2` | `wght` 400, `opsz` pinned 18, static | 22,860 |
| `instrument-sans-var-latin.woff2` | `wght` 400–600, `wdth` pinned 100 | 27,156 |
| **total** | | **87,728 (85.7 kB)** |

Pinning `opsz` is the whole trick: left live, the roman alone was 86.2 kB.

**Payload: 237.2 kB → 85.7 kB, 64% smaller, and zero third-party requests.**
All three declare `font-display: swap`. Only the roman is preloaded.

### Roles

- **Newsreader** — the hero headline, every `h1`–`h4` section heading, the
  footer wordmark, pull quotes, and `em`/`i`/`cite`.
- **Instrument Sans** — body copy, buttons, navigation, form fields and labels,
  eyebrows, FAQ questions, spec labels, footer meta, all utility text.

### Scale and weights

- **Default heading weight is 400.** 500 is restated only where a heading needs
  extra clarity: reversed on a dark ground (`.page-lp .hero h1`, `.callout h2`,
  `.collection h3`), or at the smallest serif sizes (`.svc-item h4` at 19px,
  `.wordmark`, `.project-head h3`, estimate `h1`/`h2`, `.reco h4`).
- **Line-height bands:** hero 0.98–1.04 (1.0 desktop, 1.04 at ≤560px), major
  section headings 1.05–1.12 (1.08), smaller headings 1.15, body 1.75.
- **Tracking:** hero −0.02em, section headings −0.015em. CTAs are 0.10em
  (`.btn`), 0.11em (`.nav-cta`), 0.13em (`.page-estimate .btn`). Eyebrows stay
  wide on purpose: `.kicker` 0.3em.
- **Body copy is 18.5px sitewide**, uniform on every breakpoint, by explicit
  decision. Small uppercase labels run 12.5–13.5px with 0.08em tracking.
- `text-wrap: balance` on `h2.big` and the mobile hero lines, so no heading
  drops a single short word onto its own last line.

### Arrow glyphs

Newsreader ships **no** arrow glyphs anywhere upstream, and the site renders
`←`/`→` in seven places. Instrument Sans carries them: it is listed inside
`--serif` ahead of Georgia, and its declared `unicode-range` was widened to
include `U+2190-2193`. Any future glyph addition needs both the glyph in the
file **and** the codepoint inside the declared range.

## Buttons

- **`btn-dark` (primary):** `--accent` fill, white text, weight 600, uppercase. Hover `#69700a`.
- **`btn-line` (secondary):** cream fill, 1px `--ink` border, `--ink` text. Hover inverts to `--ink`.
- **`btn-solid` / `btn-ghost`:** used on dark bands and photo heroes only.
- **Tracking (revised in the Warm Editorial pass; the earlier 0.18em is superseded):**
  `.btn` **0.10em**, `.nav-cta` **0.11em**, `.page-estimate .btn` **0.13em**. Instrument Sans
  needs far less tracking than Jost did to read as a considered label.
- Padding was deliberately **not** touched, so button height is unchanged by the tracking
  pass; only width narrows. Measured `.btn` height is **47.625px** (it reads 49.625px in the
  V1.2 notes — the 2px came from the new font metrics, not from this edit). Still above the
  44px tap-target floor.
- All hover/focus transitions are CSS, never GSAP.

## Inline links

- **Light grounds:** olive `--accent`, no underline. Measured **4.60:1** on `--bg` and
  **4.84:1** on `--surface`, both clearing WCAG AA for body text.
- **Dark bands:** `--accent` only reaches **2.69:1** on the dark ink band (`#39291B`), so it
  must never be used there. Dark grounds use `--dark-kick` (**6.13:1**) **plus an underline**,
  which also gives the link a non-colour affordance against the cream body copy.
- This is implemented as `.band.dark .partner-link` at the very end of `styles.css` — scoped
  to the named-partner link so buttons and other dark-band links keep their own treatment,
  and placed last so source order cannot be beaten by an equal-specificity rule.
- **Named trade partners always render through `<BalticLink />`** (`components/partner.tsx`),
  never as hand-written anchors, so the href, `target="_blank"` and `rel="noopener"` cannot
  drift between mentions. The phrase is always "our licensed, insured electrical partner,
  Baltic Electrical".

## Layout

- Container max-width 1080px, 40px gutters (24px on mobile).
- Sections alternate `--bg` / `--bg-alt` / `--surface`, with `--ink` dark bands for emphasis.
- Editorial two-column splits (heading left, body right), asymmetric where it earns it.
  Deliberately **not** a grid of identical feature cards.
- Generous vertical rhythm: 82px block padding desktop, 56px mobile.

## Logo handling

- Light backgrounds: `logo-header.png` (898x255, tagline-free crop) through `<Logo>`.
- Dark footers/bands: **`logo-footer-cream.png` (640x240, reversed cream lockup with the
  "window treatments & home textiles" tagline), through `<FooterLogo>`.** This is a V2
  decision and it **supersedes the V1 rule** that dark grounds render the wordmark as live
  Newsreader text — that rule was only ever a stand-in until real reversed artwork existed.
- `<Wordmark>` is kept and still exported as the fallback for a dark ground with no reversed
  artwork, but nothing uses it. It is dead code on purpose, not an oversight.
- Because the tagline is baked into the bitmap, `<FooterLogo>`'s alt text carries "Studio
  Elpa, window treatments and home textiles" so that copy stays crawlable and readable to
  assistive tech. `footerqa.py` asserts this.
- **Never put an inline `height` on the lockup.** `<FooterLogo>`'s `height` prop exists but
  both call sites omit it, because an inline style beats every stylesheet rule including
  media queries and froze the lockup at its desktop size on phones.
- **Never let `max-width: 100%` and a fixed `height` both apply to it inside an auto grid
  track.** `footer.site .f-top` is `auto 1fr`; Chrome sizes that track without feeding the
  height-derived width back in, so the clamp wins and the artwork squashes (measured 2.532
  against its true 2.667). The desktop rules use `max-width: none`; the `≤560px` branch,
  where the width is column-derived instead, restates `max-width: 100%`.

## Team block

- Two people, in a `.team-grid` of two `1fr` columns, each card an editorial split
  (`132px 1fr`) — not a card grid look, not circular avatars, both Section 5b tells.
  Separated from the "who we are" copy above by a `--hairline` rule.
- Both portraits are real supplied photographs, deliberately at **different framings**:
  Elvira's is a close face portrait (900x1200, 3:4), Aviva's a wider seated lifestyle
  portrait (720x900, 4:5). One rule sizes both into an identical **132x176 (3:4)** box and
  `object-fit: cover` absorbs the difference, so they read as one consistent set without
  either being forced into an awkward tight crop.
- Each source is cropped **face-centred at the image level**, so `object-position: 50% 50%`
  is the correct focal point and no per-image override is needed. Measured: Elvira's 3:4
  source trims nothing; Aviva's 4:5 source fits by height and trims **6.25% horizontally**,
  symmetric about her face. A wider-than-box source trims horizontally, never vertically.
- The photo carries `max-width: none` and the track width is stated explicitly, so the
  global `img { max-width: 100% }` cannot re-enter and distort it.
- Grid drops to one column at **980px**; each card stacks photo-above-text at **560px**.
  The box stays 132x176 at every breakpoint, so the crop maths holds throughout.
- Titles are real. **No invented background, tenure, credentials or awards.**

## Motion (brief Section 7, as revised by the V1.2 §1 refactor)

Calm and expensive, never flashy. **GSAP is no longer the default engine.** After the V1.2
motion refactor, GSAP 3 + ScrollTrigger is lazy-loaded — `home-gsap.ts` is the only module
that imports it, never statically, reached through `import()` on `requestIdleCallback` — and
is limited to a small number of scroll-linked experiences. Everything else, including all
section reveals and every hover/focus transition, is plain CSS driven by an
`IntersectionObserver` in `use-motion.ts`.

- Every animation sits behind a `prefers-reduced-motion: reduce` guard. When reduced motion
  is on, everything renders in its final state with no transforms. Reduced motion needs
  **explicit no-ops**: the global block only zeroes duration and iteration count, not
  `animation-delay`, and zeroing the duration of a loop snaps it to its final keyframe.
- **Motion contract:** no reveal class sets `opacity: 0` in CSS by default. The prerender
  step and its two build-time guards depend on this.
- Section reveals fire from `IntersectionObserver` with `rootMargin`
  `0px 0px -18% 0px` (default) or `0px 0px 20% 0px` (early variant). Reveals never replay,
  and any `[data-reveal]` already intersecting the initial viewport is skipped entirely so
  nothing flashes before hydration.
- Cards/tiles/steps: 0.06–0.1s stagger within their group.
- Header: background opacity + shadow appear after ~60px of scroll. A CSS-only 1px `::after`
  underline in `--accent` marks the active section.
- Durations 0.5–0.8s, easing `power2.out` / `power3.out`. Nothing bounces, spins, or slides
  in from off-screen.
- Hero text is readable immediately and never gated behind animation.
- **Hero motion clip (V2).** The hand-drawn hero illustration also exists as a ~10 s silent
  loop (`hero-motion.webm` / `.mp4`, 1.82 MB total). Contract: the still `<img>` stays the
  LCP element and is never replaced; the video mounts only after `requestIdleCallback`, is
  `muted loop playsInline aria-hidden` with no controls and no audio track, and dissolves in
  over 1200 ms carrying the **same sepia grade as the still** so there is no colour jump.
  Under `prefers-reduced-motion: reduce` the `<video>` is **never mounted at all** — CSS
  alone is not enough, because zeroing a loop's duration snaps it to its final keyframe.
- **Removed in the refactor and not coming back:** the hero text stagger (kicker → headline
  → paragraph → buttons) and the photography parallax. Both cost more in bundle weight and
  perceived delay than they returned. The hero illustration keeps its slow breathing zoom and
  light sweep.

## Accessibility

WCAG 2.1 AA. Visible focus rings on every interactive element, keyboard-operable nav and FAQ
accordions (`button` + `aria-expanded` + `aria-controls`), semantic heading order, descriptive
alt text, 16px minimum body text, contrast checked against the warm palette.

## Anti-patterns (brief Section 5b — hard no)

No purple/blue gradients, no glassmorphism, no neon, no default Bootstrap/Tailwind-looking
components, no stock or AI-generated imagery, no fake logos or trust badges, no invented
testimonials or statistics, no identical evenly-sized feature-card grids.

## Guide cards (V2 Journal)

The drapery-headers guide uses a two-column grid of cards, each a fixed 146px photo track
beside its text. The track is fixed, not fractional, and the image carries `max-width: none`:
the supplied header photographs are only ~150px wide, so a flexible track would upscale them.
Nothing in this layout ever renders a photo above its natural size. The one landscape photo
spans the full grid width with an explicit height and `align-self: start`, which is what stops
the card row from stretching it.

If higher-resolution header photography arrives, the grid can be made more generous; until
then the card size is capped by the source images, deliberately.

## Hero motion, resting state

The hero clip plays **once**, never loops, then crossfades out over 600ms to the static
illustration, which is the permanent resting state. Under reduced motion the video is never
mounted and the still is all there is.

## Partner lockups (Blindspace, V2)

Third-party lockups are not ours to design with. They get their own rules, and those rules
beat every other convention in this file.

- **Only the supplied official artwork.** `/assets/blindspace-for-windowmodes-black.png`
  (709x297) and `/assets/blindspace-for-windowmodes-blue.png` (714x305). No redraws, no
  recolours, no crops, no tracing into SVG.
- **Never restyle it.** No CSS `filter`, no `mix-blend-mode`, no reduced opacity, no
  `object-fit: cover`, no forced height. State the width and let `height: auto` hold the
  intrinsic 709:297 ratio.
- **Standalone, with clear space.** Nothing else inside the link: no second logo, no
  Studio Elpa wordmark, no tagline, no caption text. Minimum 20px of padding on all four
  sides; we ship 30px vertical, 34px horizontal (24/26 at phone widths).
- **Light grounds only.** Both supplied files are OPAQUE with a black mark: the "blue" file
  is the same black mark on a sage plate (#adc9c6), not a reversed logo. Since the page ground
  is cream (`--bg` #f5f1ea), the lockup sits on a white (#fff) plate that matches the
  artwork's own baked-in white exactly, so the seam is invisible and the padding reads as
  clear space rather than as a stray white rectangle. A hairline border makes the plate read
  as an intentional card. **Never place either file on `.band.dark`** — that needs a
  transparent or genuinely reversed lockup, which has not been supplied.
- **Always linked**, to the partner's own site, new tab, `rel="noopener"`, with the alt text
  the partner specified verbatim.
- **Render it through the component**, never as loose markup. `BlindspaceLockup` in
  `components/partner.tsx` is the only place the file path, href, rel and alt exist, for the
  same reason `BalticLink` exists: so they cannot drift between mentions.
