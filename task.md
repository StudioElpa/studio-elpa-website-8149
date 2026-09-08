# Studio Elpa — build scratchpad

Brief: /home/user/Attachments/Runnable_V1_E3bPeM.md (the contract)
Attio names: /home/user/Attachments/Attio_Setup_Checklist_AdXU1-.md
Env table: /home/user/Attachments/Runnable_ENV_Variables__rvKy0.md
Original site (canonical copy + imagery): /home/user/src/*.html

App: /home/user/studioelpa — web port **4200** (fixed in __ports.cjs, never change)

## Locked decisions
- Managed stack, user explicitly accepted the brief's "static, no build step" conflict.
- Routes keep `.html` suffixes: /index.html, /drapery.html, /motorized.html,
  /blackout.html, /estimate.html, /founder.html, /journal-blackout.html, /privacy.html
- Google Workspace email: SKIPPED (Attio + Formspree already email Aviva).
  Document Gmail/SMTP in README as the future path only.
- Both fallbacks stay wired: Formspree mrpgqbnk + Apps Script sheet.
- Attio not set up yet: no API key, no stage ids. Function must be config-driven,
  degrade gracefully (skip Attio, still hit fallbacks, still return success).
- Dark grounds: cream Cormorant wordmark, never a recolored logo bitmap.
- estimate.html fully in scope, incl. its own lead capture.

## Copy fixes to apply during the port (only real defects found)
- [ ] motorized: "Battery or hardwired — we help you choose" → drop em dash
- [ ] estimate: 4 em-dash placeholders (orig lines 187, 408, 410, 412)
- [ ] journal-blackout: "transform the room's mood"
- [ ] drapery: "quietly transformative"

## Progress
- [x] assets → packages/web/public/assets (23 files)
- [x] design.md
- [x] packages/web/index.html (title, meta, favicon, fonts)
- [x] styles.css (~2100 lines, page-namespaced)
- [x] gsap 3.15 installed
- [x] hooks/use-motion.ts (usePageMotion, useCondensedHeader, useScrollSpy)
- [x] components/brand.tsx (Logo, Wordmark, CONTACT)
- [x] components/faq.tsx (real keyboard accordion)
- [x] components/site-chrome.tsx (SiteHeader/SiteFooter/Landing*/BackHeader/ThinFooter)
- [x] api/routes/leads.ts (Attio + Formspree + Sheet, config-driven)
- [x] api/index.ts router wired
- [x] web/queries/leads.ts (useSubmitLead, readUtm)
- [x] components/contact-form.tsx
- [x] pages: index, drapery, motorized, blackout, founder, journal-blackout, privacy, estimate
- [x] app.tsx routes (all 8 .html paths + / + catch-all)
- [x] lint clean (0 errors, 0 warnings)
- [x] bun run build (791 kB / 237 kB gz client, 37 kB / 8.4 kB gz css, 23 imgs optimized)
- [x] QA all 9 routes: 200, correct h1, 0 page/console errors; home 14 imgs 0 broken
- [x] form success branch: no sink configured → ok:true all skipped, thank-you renders
- [x] form failure branch: dead sink → ok:false, alert + mailto, values kept, btn re-enabled
- [x] .env restored byte-identical after tests (diff vs /tmp/.env.studioelpa.bak clean)
- [x] wizard e2e (6 steps, validation, narrowing case, results math, auto-submit)
- [x] keyboard nav (drawer Enter/Space/Esc, 6 FAQs, skip link first tab stop)
- [x] prefers-reduced-motion: 8 routes, 0 faded elements, no errors
- [x] .env RESTORED (verified byte-identical twice)
- [x] rendered-DOM copy audit: 0 em dashes, 0 banned words, 0 missing alt, 0 emoji
      facts present; no Somfy/Lutron/Blindspace/"made in Europe"/"As seen in"
- [x] og-image: 6.5MB unreferenced stock PNG → 124KB branded 1200x630 JPEG
      + og:/twitter: meta tags (were entirely absent); favicon.ico from logo-mark
- [x] bundle 4.4MB << 40MB cap

### Lighthouse mobile (production build, served from dist on :4300)
Run 1 (baseline): Perf 42 | A11y 91 | BP 100 | SEO 100
  FCP 7.1s, LCP 12.6s, TBT 750ms, CLS 0
Fix A: route-level code splitting (7 pages lazy, homepage eager)
Fix B: hero preload + fetchPriority=high (LCP element undiscoverable pre-JS)
Run 2: Perf 48 | A11y 91 | BP 100 | SEO 100
  FCP 7.4s, LCP 8.2s (-4.4s), TBT 500ms (-250ms), CLS 0
  main chunk 772KB → 681KB, 284KB still unused

**Blocker: FCP is the wall.** Client-rendered React = nothing paints until the
main chunk parses. 665KB over simulated slow 4G + 4x CPU ≈ 7s FCP by arithmetic.
90+ perf needs FCP <1.8s, i.e. ~100KB initial JS. Not reachable by tuning this
stack's client-render model; would need SSR/prerender. A11y/BP/SEO all pass.
→ Report honestly with real numbers. Do NOT claim 90+.
- [x] A11y 91 → 100. Three WCAG AA failures found and fixed:
      1. color-contrast: footer #8a8177 (3.64:1) → var(--dark-mute) #a89f92 (5.33:1),
         a bug — the token existed at styles.css:35 but was never used.
         --accent #7B8105 failed both ways (3.74:1 kicker on cream, 4.21:1 behind
         white btn-dark text) → darkened 11% same hue to #6D7204 (4.60:1 / 5.17:1),
         also in the 2 inline SVG chevron data-URIs + design.md.
      2. heading-order: footer <h4> headings skipped a level → promoted to <h3>,
         CSS selector footer.site h4 → h3 so the 11px visual size is unchanged.
      3. target-size: footer tel/mailto were 94x23.8px (an inline display:inline
         killed the block padding) → removed it + the <br>, so the existing
         footer.site a block+4px padding gives ~32px. Also footer.site .base a
         and footer.lp a → inline-block + vertical padding.
- [x] re-run qa_copy.py + qa_a11y.py → both clean, no regression
- [x] screenshot home: #6d7204 reads correctly as brand olive on kicker + solid btn
- [x] CAUGHT A REGRESSION the score missed: my two h4→h3 edits were fired in the
      SAME parallel block against the same file and one write was silently lost.
      "Explore" became h3 but "Begin" stayed h4, rendering serif 16px instead of
      11px caps Jost. Lighthouse still scored 100 (h3→h4 is a legal increment), so
      only the screenshot caught it. Fixed sequentially; verified via computed
      styles that both are now Jost 11px uppercase ls1.98 rgb(201,166,126).
      LESSON: never parallelise multiple edits to one file. (Hit this twice —
      the task.md update below was lost the same way.)
- [x] booking CTAs: 10 sitewide, all target=_blank rel=noopener, 0 bad.
      estimate.html reports 0 at load because its CTA is on step 6 (verified e2e).
- [x] FINAL Lighthouse mobile (prod build on :4300):
      Perf 54 | A11y 100 | BP 100 | SEO 100
      FCP 5.3s, LCP 8.2s, TBT 360ms, CLS 0.015, SI 5.3s
- [x] scratch `prev` server on 4300 killed; dev on 4200 serving final code,
      all 9 routes 200, 0 page errors, 0 console errors, 0 broken images
- [x] .env verified byte-identical to /tmp/.env.studioelpa.bak (diff clean)
- [x] README.md already accurate — bundle still 4.4 MB, QA-NOTE.md already in the
      file-map. No changes needed.
- [x] QA-NOTE.md written vs brief Section 10. 15/18 pass, 1 fail (perf 54),
      2 UNVERIFIABLE (Attio asserts need a key; notification email deliberately
      untested to keep junk out of the client's live inbox + sheet).
- [ ] deliver (type website, /home/user/studioelpa, port 4200, dev server MUST be up)

### Deviations to record in the QA note
- managed-stack rebuild (user-accepted)
- .btn-dark normalized to brief; dark-band body text normalized to #E8E1D4
- privacy.html: internal "Note for Studio Elpa:" block removed (draft tell)
- privacy.html: "last updated" pinned to a constant, was recomputed every load
- estimate: auto-submits on "See my estimate" (was a 2nd click that lost leads)
- estimate: privacy link repointed from absolute studioelpa.com/privacy to local
- Attio deal name "Website inquiry - {name}" (hyphen, not the checklist em dash)
- --accent darkened #7B8105 → #6D7204 for WCAG AA (brand-token deviation)
- footer #8a8177 → var(--dark-mute) (bug fix, restores the documented token)
- footer column headings <h4> → <h3> (sequential outline, same visual size)
- footer contact/base links given real >=24px tap targets
- route-level code splitting + hero preload + fetchPriority=high (perf)
- 6.5MB unreferenced stock og-image.png → 124KB branded og-image.jpg,
  og:/twitter: meta added (were absent), favicon.ico rebuilt from logo-mark

## Raise with user before go-live
1. estimate.html ships UNCONFIRMED pricing (PRICE_ADJUST 0.70, placeholder drapery
   book, assumed INSTALL/PROJECT_MIN). Ported faithfully — needs Aviva's sign-off.
2. estimate.html linked to absolute https://studioelpa.com/privacy → repointed local.
3. Attio deal name convention uses an em dash; site copy must have zero em dashes.
   Using "Website inquiry - {name}" (hyphen). Flag in QA note.

## V1.1 refinements (8 items) — progress
- [x] 6. Type scale +1.13x sitewide (105 font-size lines + 10 vw middles).
      Backup of V1 stylesheet: /tmp/styles.v1.bak.css. NOT yet visually reviewed.
- [x] 1. Hero 4-edge feather: .hero-art overflow visible; .hero-art img
      --feather:140px, two intersected gradient masks (to bottom + to right),
      -webkit- duplicates, mobile override --feather:56px at 860px.
- [x] 3. Header phone: PhoneIcon + HeaderPhone in site-chrome.tsx, rendered in
      .bar (logo -> phone -> menu-btn -> nav), margin-left:auto, tel: link,
      7px vertical padding for >=24px target. Visible at all widths.
- [x] 4. Header CTA filled. NOTE: used var(--accent) #6D7204, NOT #7B8105.
      #7B8105 behind white text = 4.21:1, fails WCAG AA 4.5:1 (small uppercase
      text does not qualify for the 3:1 large-text threshold). #6D7204 = 5.17:1,
      same hue 11% darker. MUST be surfaced to the user with a 1-line revert.
- [x] 5. Nav 14px->14.5px, gap 24->19px, white-space:nowrap on every label,
      CSS scaleX underline on hover/active, collapse breakpoint 860 -> 1024px
      (nav rules moved into a new @media max-width:1024px block).
      Still to do: GSAP staggered load fade-in; verify no wrap at 1024/768/390.
- [x] 7. Footer rewritten: .f-top (wordmark + one voice line), .f-mid (signed
      note + real contact block), .base. Removed the Explore/Begin columns,
      which supersedes 2 V1 a11y fixes -> re-run the a11y pass.
- [ ] 2. Hero GSAP parallax + reveal (use-motion.ts). Measure LCP before/after.
- [ ] 8. Prerender plugin (packages/web/vite/prerender-plugin.ts, scratch port
      4310, prefers-reduced-motion emulated so GSAP never bakes opacity:0).
- lint clean after items 1,3,4,5,6,7. Build not yet re-run.

### V1.1 items 2 and 8 (in progress)
- [x] 2. Hero motion in use-motion.ts:
      - hero text stagger now excludes [data-hero-art] (LCP element).
      - heroImg: fromTo opacity 0.55 -> 1 + scale 1.035 -> 1, 1.1s power2.out.
        Starts at 0.55, not 0, so the LCP element is painted on frame one.
      - heroArt wrapper: yPercent 0 -> 7, scrub 0.6, transform only (cannot
        affect paint). Two separate targets so the transforms never collide.
      - nav stagger: [data-nav] > * opacity 0 y -6, 0.5s, stagger 0.06.
      - reduced-motion QA re-run: 8 routes, 0 faded elements, no errors. PASS
- [x] 8. Prerender: packages/web/vite/prerender-plugin.ts (closeBundle, build
      only) + vite/prerender.py. Scratch port 4311 (4310 kept free for the
      measurement server). reduced_motion="reduce" context so GSAP never bakes
      opacity:0. Snapshots all captured before any write (dist/index.html is
      the fallback). Guard fails the build if any #root element has inline
      opacity:0 AND text; a decorative opacity:0 layer inside the Runable
      badge is excluded (it is not copy).
      unblock_paint(): inlines the built CSS as <style> and de-blocks the
      Google Fonts link (preload + media=print onload swap + noscript).
      All 8 routes written, verified h1 text present in the static HTML.

### Lighthouse mobile, prerendered build (measurement notes)
Measurement server matters: plain python http.server sends NOTHING gzipped,
which charges ~3x real transfer time. /tmp/gzserve.py gzips text like a real
host and 404s missing files with extensions (a blind index.html fallback made
/robots.txt return HTML and dropped SEO to 92).
  V1 (client-rendered, uncompressed server): Perf 54  FCP 5.3s  LCP 8.2s TBT 360
  prerender, uncompressed server:            Perf 55  FCP 5.5s  LCP 10.5s
  prerender, gzip server:                    Perf 63  FCP 3.5s  LCP 7.3s
  + inline CSS, async fonts:                 Perf 63  FCP 2.4s  LCP 7.4s
                                             A11y 100 BP 96 SEO 100 CLS 0.014
FCP target (<1.8s) is close. LCP is now the whole drag.
- [x] hero srcset: the 1800px hero.jpg was the LCP element on a 390px phone.
      Added hero-780.jpg (68 kB) and hero-1120.jpg (132 kB), srcset+sizes on
      the img and imagesrcset/imagesizes on the preload in index.html.
- [ ] rebuild + re-measure LCP after srcset
- [ ] dist has no robots.txt or sitemap.xml -> add to packages/web/public
- [ ] BP 96: check what dropped from 100
- [ ] re-run full QA suite, screenshots, docs, deliver

### LOGO FIX (user-reported: header logo shrunk, squished, illegible)
Root cause was two separate bugs, not one:
1. WRONG ASSET. <Logo> pointed at /assets/logo-mark.png (760x203), which is not
   a mark at all: it is the same lockup with the tagline cropped off AND the
   STUDIO ELPA letterforms clipped at the baseline. That is the "illegible".
   -> now /assets/logo.png (900x337), the complete uncropped lockup.
2. FLEX SHRINK. header.site .bar is a flex row and .page-home .wrap caps the
   inner width at 1000px, but the bar content needs 1101px (logo 150 + phone
   134 + nav 774 + 44 gaps). The 101px deficit was absorbed by the image
   shrinking: the logo rendered 48.5x56 instead of 149.5x56, a 67% horizontal
   squish. That is the "shrunk and squished".
   -> .logo gets flex:0 0 auto + .logo-img flex-shrink:0, so the logo can
      never be the thing that gives.
   -> header.site .bar gets max-width:1240px (beats .page-home .wrap on
      specificity) so header chrome runs wider than the 1080px reading measure.
   -> nav collapse breakpoint 1024px -> 1180px, since 1101px of bar + 80px of
      padding needs a 1181px viewport. Below that the drawer takes over rather
      than wrapping or squashing.
   -> drawer top: 74px -> 84px to match the new bar height.
Sizing: bar height 74 -> 84px. .logo-img 56px desktop / 46px at 860px
(both inside the requested 48-56 band at desktop). Landing + back headers 48px.
Aspect ratio is now structurally protected: the img carries width=900
height=337 attributes (intrinsic ratio + no CLS) and CSS only ever sets height
with width:auto. Logo takes no inline height in the site header so the media
query can still shrink it.
Verified 1440/1280/1100/1025/1024/768/390: distortion <=0.01%, clear space
14px desktop / 19px mobile, 0 doc overflow, no nav label wrapped, nav on one
row >=1200 and drawer <=1180. qa.py: 9 routes 200, 0 page/console errors,
0 broken images.
HONEST CAVEAT for the user: logo.png includes the "WINDOW TREATMENTS & HOME
TEXTILES" tagline, whose cap height is ~13px of the 337px artwork. At a 56px
lockup that is ~2px tall, i.e. present but not readable. Reading it needs
either a taller logo (breaks the 48-56 band) or a tagline-free crop (user said
do not crop). Flagged, not silently resolved.

### V1.2 — tagline-free header logo (RESOLVED, user approved the crop)
User approved a non-destructive tagline-free crop. Neither original file was
modified or overwritten.
Band analysis of logo.png (900x337) by per-row alpha ink counts:
  y=21..162  sheer-wave mark
  y=172..227 "STUDIO ELPA" wordmark
  y=242..244 3px decorative rule (x 416..483)
  y=264..278 "WINDOW TREATMENTS"
  y=294..308 "& HOME TEXTILES"
Ink extents: mark+wordmark x=25..874, tagline x=256..662.
Built losslessly (pure crop + transparent border, no resampling/recolor/
redraw/stretch):
  convert logo.png -crop 850x207+25+21 +repage \
    -bordercolor none -border 24 PNG32:logo-header.png
-> packages/web/public/assets/logo-header.png, 898x255, ratio 3.522.
INTEGRITY VERIFIED: `convert logo-header.png -trim info:` returns exactly
850x207 at +24+24, proving nothing was clipped and 24px clear space survives
on all four sides.
DECIDED WITH EYES, not assumed: a second variant keeping the 3px decorative
rule was built and compared side by side on the #F5F1EA ground. Rejected -
with the tagline gone the rule reads as a stray dash orphaned under "IO", an
artifact rather than a design mark. Variant deleted.
Sizing consequence: dropping the tagline raises the wordmark's share of the
asset, so the SAME rendered height yields larger letterforms. That let the
header get SMALLER while reading BIGGER (also serves V1.2 s2, tighter mobile
header):
  old full lockup 56px -> wordmark cap ~9.3px, width 149.5px
  crop at 46px          -> cap ~10.1px,        width 162px
  crop at 40px (mobile) -> cap ~8.8px  (vs 7.6px for the old 46px full lockup)
No @2x needed: 898px native shown at ~162px is >5x density.
Wiring: Logo gained a `variant` prop ("full" | "header") with a per-variant
intrinsic width/height pair, so the no-CLS/no-stretch protection applies to
both. All four chrome instances use variant="header" (site header, and
LandingHeader / BackHeader / est-logo at height 44) because at any height that
fits the chrome the full tagline renders ~2px tall. logo.png is retained
on disk per the user's instruction, for placements where the tagline can be
read; it is currently referenced by no component.
header.lp .logo img 48 -> 44px to match its inline height (inline wins, so a
mismatched rule would be a silent lie).

### V1.2 s1 — motion refactor (DONE, committed beb5a9d + fa22534)

GSAP is now lazy and homepage-only. packages/web/src/web/motion/home-gsap.ts
is the ONLY module that imports gsap/ScrollTrigger, and it is never imported
statically: useHomeMotion reaches it through import() on requestIdleCallback
(200ms setTimeout fallback for Safari). registerPlugin runs inside the
function, so ScrollTrigger is never registered on routes that do not use it.
Three approved experiences only: hero reveal+drift, discovery-process progress
line (written, inert until s9 adds [data-process-progress] markup), project
before/after (not built yet).

use-motion.ts now imports NO animation library. usePageMotion drives
[data-reveal] with an IntersectionObserver plus CSS transitions
(rootMargin 0 0 -18% 0, threshold 0.01, play-once, 70ms per-group stagger
capped at 6 steps), then strips reveal-init/reveal-in and the inline delay on
transitionend so the element returns to plain markup.

REMOVED deliberately (report these): GSAP hero text stagger (brief forbids
delaying the hero heading/copy - it is the LCP element), GSAP nav stagger
(s2 says use CSS for navigation), GSAP [data-parallax] photography drift on
drapery/motorized/blackout (not one of the three approved experiences).
data-hero and data-nav remain in markup but are now unused by JS.

Bundle: main chunk 681.78 kB / 219.05 kB gzip -> 566.28 kB / 173.32 kB gzip.
Initial JS down 45.7 kB gzip (-21%). New lazy chunks: gsap core 70.43 kB /
27.68 gzip, ScrollTrigger 43.55 / 18.11, home-gsap 1.00 / 0.56.
Lighthouse mobile (prerendered + gzip server): perf 64 -> 71, FCP 2.3 -> 2.2s,
LCP 6.7 -> 6.0s, TBT 390 -> 250ms, SI 3.1 -> 2.4s, CLS 0.014, A11y 100,
Best Practices 96 -> 100, SEO 100.

### The reveal flash — found by measurement, fixed (fa22534)

/tmp/flashprobe.py installs a rAF sampler via add_init_script (so it runs
BEFORE hydration) and records opacity over the first 4s. It caught a real
regression the prerender introduced: at 390x844 the static HTML painted final
copy at ~150ms, hydration added reveal-init at ~575-606ms, and the copy faded
back in ~632ms later. A visible blink on above-the-fold content on six routes.
useLayoutEffect CANNOT fix this - it is early relative to React, not relative
to the prerendered paint.

Fix: usePageMotion skips every [data-reveal] intersecting the initial viewport
(top < innerHeight && bottom > 0). Those render final immediately and are
never observed. Stagger indices count within the animated subset only, so a
group straddling the fold still starts at zero. Re-measured: hiddenAt null,
finalOp 1 on privacy/founder/journal/drapery. Below-fold reveals unchanged.
This is also the calmer reading of the brief - motion belongs to scrolling.

### QA scripts added this session

/tmp/motionqa.py  - 5 motion checks. NOTE: it MUST scroll; the first version
                    reported 55/55 reveals "stuck" purely because it never
                    scrolled and the first [data-reveal] on index sits at
                    y=1345. All 5 checks now pass: GSAP absent on the 7
                    non-home routes, present on index, 0 stuck reveals and 0
                    leftover reveal-init on all 8 routes, reduced motion shows
                    everything with zero GSAP requested, and force-aborting
                    the GSAP chunks still leaves h1 + hero img at opacity 1.
/tmp/flashprobe.py - pre-hydration rAF opacity sampler described above.
/tmp/revealflash.py - lists [data-reveal] intersecting the first viewport per
                    route at 1440x900 and 390x844.
Caveat: motionqa's GSAP_HINT does not match the gsap core chunk's filename
(index-*.js), so only ScrollTrigger + home-gsap show in its chunk list. The
core chunk still loads; the split is proven by the build output sizes.

### V1.2 s2 — mobile drawer accessibility (DONE)

Escape was already wired in V1. Added a focus trap and focus return in
SiteHeader (packages/web/src/web/components/site-chrome.tsx):
- btnRef / navRef, plus restoreRef tracking WHY the drawer closed.
- Tab and Shift+Tab cycle through [menu button, ...nav links]. The button is
  part of the cycle because it is the drawer's own close affordance. If focus
  is found outside that set (logo, phone, page body behind the overlay), Tab
  pulls it back to the first item.
- Escape and the button close with restore=true, so focus lands back on the
  menu button. Nav links / logo close with restore=false, because yanking
  focus back to the hamburger after the reader picked a section would undo
  the choice they just made.

Overlay-not-push needed no change: nav.main is position:absolute inside the
sticky header. Verified rather than assumed.

/tmp/menuqa.py, all 5 checks PASS at 390x844 against the production build:
1. nav flex/absolute, top=72 (tracks the 72px mobile bar), 7 links,
   aria-expanded=true; h1 top 169 -> 169 and scrollHeight 19051 -> 19051, so
   the page does not move.
2. Forward Tab: button -> 7 nav links -> wraps to button. Zero escapes.
3. Shift+Tab from the button wraps to "Begin a conversation".
4. Escape: closes, aria-expanded=false, focus back on the menu button.
5. Nav link: closes, hash=#process, focus NOT yanked to the button.

Still to confirm for s2: the thin active-section indicator after the motion
refactor (useScrollSpy is untouched plain IntersectionObserver, but verify).

================================================================================
V1.1 GAP CLOSURE (after the user re-pasted the V1.1 brief)
================================================================================

The user re-pasted the original V1.1 brief verbatim. Checked each of the ten
items against the code rather than assuming. Result:

  items 2, 4, 7, 9   genuinely done (hero four-edge feather, header phone,
                     type scale, editorial footer)
  item 10            done but target missed: pages prerender, but mobile
                     Performance is 71 and FCP 2.2s vs the 90+/1.8s goal
  items 1 and 5      conflict with decisions the user approved LATER, during
                     V1.2 (header logo crop, accent #6D7204)
  items 3, 6, 8      real gaps

The user ruled: keep the V1.2 tagline-free crop, keep #6D7204, and "just close
the real gaps (breathing zoom, light sweep, tile scale + feather, nav stagger)
and carry on with V1.2 sections 3-16". Both conflicts are now doubly settled.
DO NOT RELITIGATE EITHER.

--- Provenance, established by evidence not memory ---

Breathing zoom and light sweep were NEVER BUILT in V1.1. `rg "@keyframes"` and
`rg "^\s*animation:"` returned zero matches in styles.css, and git grep against
baseline 1c292be confirms they never existed. They were NOT removed by the V1.2
motion refactor. They are being ADDED now, not restored. Say so honestly.

Tiles: the class is .pillar (not .svc-tile/.tile). Hover did translateY(-3px) +
background:var(--surface) + heading tint, at 0.2s. No scale. .pillar .pimg had
a colour filter but NO mask: the four-edge feather existed only on the hero.

Nav stagger was removed by the V1.2 motion refactor because V1.2 s2 says to use
CSS, not GSAP, in the navigation. Restored as pure CSS.

--- Hero: three motions, three elements ---

Markup in pages/index.tsx now nests: .hero-art > .hero-frame > (img +
.hero-sweep). This separation is LOAD-BEARING, one transform owner each:
  .hero-art    GSAP parallax drift (yPercent), inline transform
  .hero-frame  CSS breathing scale + the four-edge feather mask
  img          GSAP one-time reveal (opacity + scale)
A CSS animation outranks inline style, so putting the breathing loop on the
<img> would silently eat GSAP's reveal. Verified: img opacity 1 / transform
none after load, .hero-art carries inline translate(0px,0px). No fight.

The feather mask MOVED from .hero-art img to .hero-frame, verbatim, so the
sweep inside is feathered by the identical falloff and cannot show a hard
rectangle.

--- The light sweep blend mode was chosen by measurement ---

soft-light (the first attempt) is INVISIBLE on this ground. Diffed against a
no-sweep baseline: at opacity .55 it moved 99% of pixels by <=4/255. overlay
and normal blending measured p99 9-10 and were indistinguishable from no sweep
by eye in a 4-up montage. plus-lighter is the only mode that reads on a
near-white cream ground.
  soft-light .55  p99  4   invisible
  overlay .70     p99  9   indistinguishable
  normal .60      p99 10   indistinguishable
  plus-lighter    p99 14-24 reads
Opacity then held at 0.20: from .30 up the band washes the mullions out of the
right-hand window. Final: mix-blend-mode: plus-lighter, opacity .20, 34s.

The sweep crosses the WHOLE illustration, not one pane, because the artwork has
glass down both flanks with a corridor between. Report that honestly.

--- Reduced motion needed explicit no-ops, three times ---

The global reduced-motion block only zeroes animation-DURATION and
iteration-count and transition-duration. That is not enough three times over:
  .hero-frame / .hero-sweep  duration 0.01ms + iteration 1 SNAPS a loop to its
                             final keyframe, parking the hero at scale(1.04)
                             with the sweep frozen mid-frame. A transform under
                             reduced motion, which the brief forbids.
  .pillar:hover              only transition-duration is zeroed, so the hover
                             transform would still apply INSTANTLY.
  nav.main a                 animation-DELAY is not zeroed, so with fill-mode
                             both the links would sit invisible up to 420ms.
All three now switch the animation off outright. Verified under
reduced_motion="reduce": frame animation none + transform none, sweep display
none, nav animation none + opacity 1, .pillar:hover transform none.

--- .pillar hover background fill deliberately removed ---

A panel appearing behind a feathered image reinstates exactly the box the
feather exists to dissolve. Hover is now scale(1.04) translateY(-4px) at 0.3s,
plus the existing heading tint. Report as an intentional removal.

--- Measurement traps hit this session (both cost real calls) ---

1. locator.screenshot() TIMES OUT on .hero-frame: the breathing loop means
   Playwright never sees the element "stable". Use page.screenshot(clip=box)
   from bounding_box(), which has no stability wait.
2. A pixel scan of the tiles read EXACTLY page-background for every column.
   Cause: the tile still had .reveal-init (opacity 0) because the script never
   scrolled. Same trap as the old false "55/55 reveals stuck". ALWAYS scroll,
   then assert revealStripped before sampling pixels.
3. A viewport screenshot after page.hover(".pillar") is a shot of the PILLARS,
   not the hero: hover scrolled the page. Use a fresh context per shot and
   assert window.scrollY === 0.

--- Verified after the gap closure ---

lint 21 files 0 errors. build clean, 8 routes prerendered.
Tile feather measured: delta from page bg is 0-2 at both side edges and 0-1 at
top and bottom, 5 in the core. All four edges dissolve. The "hard panel" I
first thought I saw was a 5/255 difference (the JPEG's paper ground being ~2%
warmer than the page) misjudged from a downscaled screenshot. Confirmed by eye
at 2x on the magnified crop.
.pillar transition reads "transform / 0.3s" once revealed. The earlier "0.7s"
reading was an un-revealed tile inheriting .reveal-init's transition, not a
specificity bug.
/tmp/flashprobe.py: hiddenAt null, finalOp 1, no flash on any route.
/tmp/motionqa.py: GSAP on index only; reveals 0 stuck and initLeft 0 on all 8
routes; reduced motion zero GSAP chunks; chunk-blocked content still visible.

New QA scripts: /tmp/heroqa.py (hero+pillar computed state, normal and reduced
motion), /tmp/feather.py (scroll, assert revealStripped, pixel-scan the mask),
/tmp/heroshot.py (fresh-context hero shots at 4 sweep phases),
/tmp/sweepab.py + /tmp/sweepab2.py (blend-mode A/B against a no-sweep baseline),
/tmp/pillarprobe.py (background chain above .pimg).

NEXT: V1.2 sections 3-16, starting with s3 hero height reduction. Note s9 needs
[data-process]/[data-process-progress] markup added; the GSAP side is written
and inert. s11 before/after is the third approved GSAP experience, not built.

================================================================================
V1.2 SECTION 3 - HERO (DONE, verified)
================================================================================

GOAL (brief s3): keep headline/copy/centered composition/pencil illustration/two
CTAs/four-edge feather. Cut desktop hero height 15-20%. Bring part of the
illustration into the mobile first viewport. Slightly reduce primary CTA height
and letter-spacing. One restrained GSAP sequence: never delay/conceal the h1;
headline may settle by line with very small upward movement once already
rendered; illustration resolves from a soft wash into final linework; scroll
drift 5-7% max; no dramatic zoom, rotation, bounce or elastic easing.

--- height reduction: measured, not estimated (/tmp/herogeo.py) ---
Desktop hero 1217px -> 1013px = -204px = -16.8%, inside the 15-20% band.
Next section now starts at y=1098 (was y=1302).

  .page-home .hero padding   46px 0 8px -> 30px 0 4px      -20
  .hero .kicker margin-bot   20px -> 14px                   -6
  .hero h1 margin-bot        16px -> 12px                   -4
  .hero p margin-bot         26px -> 20px                   -6
  .hero-art margin-top       36px -> 20px                  -16
  .hero-frame max-width      1120px -> 860px (630->484 tall) -146

Mobile 390: hero 851 -> 807px, illustration in first viewport 60% -> 83%. The
s3 mobile requirement was already met at baseline and is now comfortably met.
Laptop 1280: 39% of the illustration in the first viewport.

REJECTED ON PURPOSE: shrinking the h1 (250px for two lines) would have been the
fastest saving but the V1.1 type scale is user-approved and the preamble says
preserve typography direction. Also rejected: object-fit:cover to shorten the
illustration, which would crop the boy and the dog out of the artwork.

UNPLANNED WIN: at 860px the illustration now nearly matches the h1's 840px
measure, so it echoes the headline column instead of being wider than
everything above it as the 1120px version was. Checked by eye, it does not
float. NOTE: .wrap is 1240px wide, not the 1080px an earlier note claimed.

--- CTA tightened (.btn, GLOBAL not hero-scoped) ---
letter-spacing 0.18em -> 0.13em, padding 15px 34px -> 12px 32px.
Measured: height 55.625px -> 49.625px, letter-spacing 2.43px -> 1.755px.
Still above the 44px minimum tap target (47.6px at mobile font size).
Applied globally so the contact submit and estimate wizard do not end up
visibly chunkier than the hero pair. Inherited by .btn-line and .btn-ghost.

--- BUG FOUND AND FIXED: the mobile feather override was dead ---
The V1.1 gap closure moved the feather mask from .hero-art img to .hero-frame,
but the mobile override still set `--feather: 56px` on `.hero-art img`, a CHILD
of the frame. Custom properties only inherit DOWNWARD, so the override never
reached the mask and mobile had been rendering the full desktop falloff.
Fixed: override moved to `.hero-frame`.
Also scaled the desktop feather 140px -> 108px alongside 1120px -> 860px
(860/1120 = 0.768) to preserve the V1.1-approved ratios. Left at 140px it would
have eaten 29% of the shorter image's height.
Verified live (/tmp/featherlive.py), one mask owner only:
  desktop frame 861x484, --feather 108px = 12.5% w / 22.3% h
  mobile  frame 342x193, --feather  44px = 12.9% w / 22.8% h
  maskOnFrame=True, maskOnImg=False at both breakpoints.

--- the GSAP hero sequence (motion/home-gsap.ts) ---
Reconciling s1 (never delay the h1/LCP) with s3 (headline may settle once
already rendered): animate TRANSFORM ONLY, from opacity 1, after paint. Never
an opacity hide. The standing motion contract is intact.

1. Headline settles by line. h1's <br /> replaced with two block
   <span className="hline">. Authored in JSX, NOT split from the DOM at
   runtime, so the prerendered HTML already contains the spans and hydration
   sees identical markup. `gsap.from(lines, {y: 8, duration: .65,
   stagger: .08, clearProps: "transform"})`. Opacity is never touched.
   .page-home .hero h1 .hline { display: block } reproduces the old line break
   and declares NO opacity/transform, so no-JS/failed-chunk/reduced-motion all
   paint the headline final.
   HONEST LIMIT: the two spans are SENTENCES, not visual lines. At desktop the
   h1 renders as three visual lines, so line 1's span covers two of them. True
   per-visual-line splitting needs runtime measurement and breaks responsively
   (four visual lines at 390px). Report as settle-by-sentence.
   ACCESSIBILITY: {" "} between the spans, otherwise h1.textContent read
   "beautiful.Now" with no separator. Zero layout effect (blocks ignore
   inter-element whitespace); hero height still 1013px after adding it.

2. Illustration resolves from a soft wash into final linework. Replaced the
   old opacity .55 + scale 1.035 reveal with a BLUR + DESATURATION resolve, so
   what resolves is the drawing's FOCUS rather than a zoom:
     from blur(5px) sepia(.42) saturate(.6) brightness(1.08) contrast(.72), op .6
     to   sepia(.3) saturate(.86) brightness(1.03) contrast(.93), op 1
     1.2s power2.out, clearProps "opacity,filter"
   Scale is deliberately no longer animated, so nothing reads as a zoom and the
   only scale on the hero is the CSS breathing loop on .hero-frame.
   CRITICAL: GSAP animating `filter` REPLACES the whole property, so the end
   state repeats .hero-art img's CSS filter verbatim. Omit it and the
   illustration snaps to full saturation on the last frame.

3. Scroll drift yPercent 7 -> 6, inside the brief's 5-7% cap rather than
   exactly on the ceiling. Measured 29.0px on a 484px element = 6.0%.

REDUCED MOTION needs no new guard: useHomeMotion() bails on prefersReduced()
BEFORE the dynamic import (use-motion.ts:145), so reduced motion loads zero
GSAP and nothing in home-gsap.ts can run. Verified, not assumed.

--- also fixed ---
img `sizes` was "(max-width: 860px) 100vw, 1000px" while the frame now caps at
860px. An overstated sizes lets the browser pick a larger candidate than it can
ever render. Now "...100vw, 860px".

--- verification ---
bun run lint: 21 files, 0 warnings, 0 errors. bun run build clean, 8 routes
prerendered. Main chunk 567.38 kB / 173.55 kB gzip (was 567.19/173.55, so s3
cost ~0.2 kB raw and nothing measurable gzipped).

/tmp/heroseq.py - 18/18 PASS: 2 animatable lines; min line opacity ever
observed = 1 (sampled every frame from before hydration); both lines end op 1
transform none, no inline transform; illustration ends op 1, not blurred, no
inline filter, resolved to the stylesheet base filter not full saturation;
drift 6.0%; reduced motion = lines visible with NO transform, no GSAP filter,
not blurred, breathing loop off, no transform parked on the frame.

/tmp/h1flash.py (NEW, against the PRERENDERED build on 4310) - 10/10 PASS.
Written because flashprobe.py only samples [data-reveal] elements and the hero
is not one, so it reports "no above-fold reveals sampled" for index.html and
could say NOTHING about the h1. Samples the h1 and its spans every frame from
an init script injected before hydration:
  desktop: h1 first painted 19ms, min opacity ever 1, max |translateY| 8px
  mobile:  h1 first painted 37ms, min opacity ever 1, max |translateY| 8px
  both end op 1 / transform none, accessible text keeps the separator.

/tmp/flashprobe.py widened from 4 routes to all 8. 0 routes with a flash or
hidden content. index.html and estimate.html report "no above-fold reveals
sampled" by design (their above-fold content is not in the reveal system).

/tmp/motionqa.py - GSAP on index only; reveals 0 stuck / 0 initLeft on all 8
routes; reduced motion gsapChunks=[]; GSAP chunk blocked -> h1 opacity 1,
heroImg 1, 0 stuck.

Screenshots viewed: /tmp/v12-hero-desktop.png, /tmp/v12-hero-mobile.png.

NEXT: V1.2 sections 4-16. s9 needs [data-process]/[data-process-progress]
markup added; the GSAP side is written and inert. s11 before/after is the third
approved GSAP experience, not built. Outstanding from s2: confirm the thin
active-section indicator still works.

## V1.2 SECTIONS 4, 5, 6 (DONE, verified)

### §4 "At your service" — commit 4bc22c2
Same four items, same destinations (#process, #services, /estimate.html, #contact),
same illustrations. Added `kind: "promise" | "action"` to PILLARS and a
`pillar-promise` / `pillar-action` class.
- `.pillars` columns `repeat(4, 1fr)` -> `1.18fr 1.18fr 0.82fr 0.82fr`
  (measured 295/295/205/205 at 1440).
- Promise h3 22.5 -> 26px; action h3 16.5px, ink-soft, plus a CSS-drawn chevron
  (`.pillar-go`, aria-hidden) that nudges 0.5em -> 0.8em on hover.
- Action artwork 74% width and 26px top padding, so the actions read as a
  quieter rail beside the two promises.
- `align-items: stretch` (not `start`): with `start` the hairline between the
  two action cells ran visibly short while the other two ran full height.
- Mobile 860: 2x2, promises row then actions row, hierarchy by type only
  (21px / 15px), action art back up to 88%, top padding reset to 14px.
- Divider language and the four-edge tile feather untouched. No GSAP.
- TRAP HIT: first draft used `var(--muted)`, which does not exist in :root
  (the token is `--ink-soft`). It would have silently inherited --ink and lost
  the hierarchy. Always grep :root before using a token.

### §5 "The promise" — commit 8ad5cf5
Copy untouched. The closing line stopped being a second soft paragraph in the
centred column and became a pull quote beside the explanatory paragraph.
- New `.promise-grid`: `1.12fr 0.88fr`, gap 64, max-width 1000 centred
  (measured 524/412 at 1440, body 220-740, quote 808-1220). Mobile: one column.
- TRAP HIT: I wrote a NEW `.pull` rule and collided with the site's existing
  `.pull` component (line ~329, used by journal-blackout.tsx and blackout.tsx).
  Both rules applied, so the quote got my top hairline AND the base olive left
  rule. Fixed by deleting my block and reusing the existing component, with
  `.promise-grid .pull { max-width: none; margin: 0 }` for layout only.
  Grep for the class name before inventing one.

### §6 "Who we are" — commit d18109a
Two-column layout, heading, all copy, founder link all preserved
(`sentenceIntact: true` in /tmp/whoweareqa.py, which reassembles the section's
innerText and checks the original sentence survives verbatim).
- Third paragraph split: lead sentence stays a paragraph (`.cq-lead`), the
  quotation becomes `.client-quote` > `.cq-said` (Cormorant 27px / 23px mobile,
  ink) + `.cq-not` (16px, ink-soft).
- Deliberately NOT the `.pull` treatment: §5's pull quote is the studio
  speaking and owns the olive rule; this is a client speaking, so it is set
  apart by scale and space instead. Reusing `.pull` would make the two adjacent
  sections look identical.
- `.body-text .cq-said` is scoped through `.body-text` because `.body-text p`
  sets ink-soft at (0,1,1) and would beat a bare `.cq-said`.
- One entrance only: `data-reveal` on `.client-quote`. `paragraphsWithReveal: 0`.
- IMAGERY DELIBERATELY SKIPPED. `about.jpg` is unused and was inspected: it is a
  wide marketing plate with its own baked-in headline ("ELEVATE YOUR VIEW.
  LAYERED SOPHISTICATION.") and a Studio elpa signature. Dropping it beside
  "We start with the room, not the catalog." would put a second competing
  headline in untranslatable baked-in type next to the real one. The brief's
  condition is "if a visual asset already exists that fits naturally" - this one
  does not. Report as a deliberate non-completion.

### Verification after each of §4, §5, §6
lint 21 files 0/0; build clean, 8 routes prerendered; flashprobe all 8 routes
zero hiddenAt and zero flashMs; motionqa GSAP on index only, 0 stuck / 0
initLeft on all 8, reduced motion gsapChunks=[], GSAP blocked -> h1 opacity 1.
Main chunk 567.38 -> 567.83 kB raw, 173.55 -> 173.65 kB gzip across all three
sections (about 0.1 kB gzip total).

### The stale-Vite trap bit twice more this session
`.promise-grid` came back null from querySelector, and later a CSS probe showed
my DELETED `.pull` block still matching. Both were the dev server serving stale
modules, not real bugs. `/tmp/pullprobe.py` (new) dumps every CSS rule that
matches an element plus its computed values - use it whenever a style looks
wrong, before editing anything.

---

## V1.2 SECTION 7 - WHAT WE DO (DONE, verified, commit 2bdc920)

Direction supplied by the user and used verbatim: primary three = Custom
Drapery, Motorized Drapery & Shades, Roller / Solar Shades; secondary three =
Roman Shades, Natural Woven Shades, Decorative Hardware; signature emphasis on
"motorized custom drapery".

### Data
The single `SERVICES` array in `pages/index.tsx` became three exports:
- `SERVICE_SIGNATURE` - Motorized Shading (`art-motor.jpg`), plus a new `sig`.
- `SERVICES_PRIMARY` - Custom Drapery (`art-drapery.jpg`), Roller Shades
  (`art-roller.jpg`).
- `SERVICES_MORE` - Roman Shades, Natural Woven Shades, Decorative Hardware.

All titles and descriptions are the client's existing copy. The ONLY new copy
is the sanctioned signature line: "Our signature is motorized custom drapery:
European fabric that moves on a schedule, on quiet, reliable motors, ready for
smart-home integration." It deliberately does not repeat the wiring /
licensed-partner clause, because the Motorized Shading body already carries it
once. Generic motor language only, no brand.

### Three visual weights instead of six identical boxes
1. `.svc-feature` - two-column editorial row, measured 485.5 / 466.5 at 1440.
   Unframed photo (no surface panel, no border) at `aspect-ratio: 5/4`; text
   side has an "Our signature" kicker, `h3` 38px, `.svc-sig` in Cormorant 22px
   ink, then the existing body at 16px ink-soft, then the tags.
2. `.svc` - the two primary cards, `repeat(2, 1fr)` (was 3), measured 487/487.
   Card `h3` raised 26 -> 30px since only two sit across now. Panel + hairline
   retained.
3. `.svc-more-head` (13px letter-spaced "Explore all treatments" + a
   `.svc-more-rule` hairline filling the row) and `.svc-more` - three compact
   entries, measured 316/316/316, no panel, no border, `aspect-ratio: 16/9`,
   `h4` 19px, body 15px.

### Two traps worth remembering
- The `.tags` rule had to be widened to `.svc .card .tags, .svc-feature-text
  .tags, .svc-item .tags`. Scoped as it was, the olive uppercase use-case
  labels would have silently reverted to body text in the two new tiers. All
  six verified at `rgb(109, 114, 4)`, uppercase, 12.5px.
- `.svc-feature-text p` (0,1,1) beats a bare `.svc-sig` (0,1,0), which is why
  the rule is written `.svc-feature-text .svc-sig`.

### CTA
The oversized full-width olive CTA is gone (`oldBtn: 0`). Replaced by
`.svc-close`: a centred 17px line, "Not sure what you need? Let's talk it
through", link in accent with a soft underline and a small CSS `.svc-go`
chevron (`aria-hidden`) that nudges on hover, with an explicit reduced-motion
no-op. Still points at `#contact`.

Mobile (860px): `.svc-feature`, `.svc-more`, `.svc` all collapse to one column;
feature `h3` 31px, `.svc-sig` 20px, card `h3` 26px.

Motion: no per-card GSAP. `data-reveal` / `data-reveal-group` only - 8 reveals,
2 groups in the section.

Verified with `/tmp/svcqa.py` (new): all six titles present exactly once, all
six photographs load at 1600x1000 with the `--elpa-grade` filter, 0 stuck, 0
`reveal-init` left, no em dash, no brand leak. Screenshots viewed:
`/tmp/v12-s7-desktop.png`, `/tmp/v12-s7-mobile.png`.

HONEST NON-COMPLETION: §7 keeps the existing service titles ("Motorized
Shading", "Roller Shades") rather than the user's descriptive phrasings
("Motorized Drapery & Shades", "Roller / Solar Shades"), because the brief says
keep the six services' descriptions and labels. Judged the user was describing
WHICH three to feature, not renaming client copy. Flagged for overrule.

---

## A REAL SITEWIDE BUG: FAST SCROLL LEFT COPY PERMANENTLY INVISIBLE
(DONE, verified, commit ba5ffbc)

Not a §7 regression. Found while QA-ing §7 when a section heading was stuck at
`opacity: 0`. A new probe, `/tmp/fastscroll.py`, showed a defect across the
whole homepage in every build shipped up to this session.

CAUSE: an IntersectionObserver only calls back when the intersection ratio
CROSSES a threshold. On a hard wheel flick an element can go from below the
viewport to above it between two animation frames, never once measured as
intersecting, so no callback is ever delivered and the element stays at
`opacity: 0` forever.

MEASURED BEFORE: desktop fast flick left 15 blocks of copy permanently
invisible, mobile 17 - including whole section headings ("At your service",
"Who we are", "One roof, no runaround", "For designers, architects &", "The
Journal", "Let's begin"). Anchor navigation and instant jump-to-bottom were
already fine (0 broken). TOTAL BROKEN: 32.

FIX in `hooks/use-motion.ts` inside `usePageMotion`: a `pending` Set of
not-yet-revealed elements, a `finalize(el)` that drops the transition delay and
strips `reveal-init` / `reveal-in` with no animation, and a passive,
rAF-throttled `scroll` listener that sweeps anything still pending whose
`getBoundingClientRect().bottom < 0` and finalizes it instantly. The listener
REMOVES ITSELF once `pending` is empty, so it costs nothing for the rest of the
session. The IO callback also deletes from `pending`; cleanup removes the
listener. Elements scrolled past are finalized WITHOUT a transition on purpose:
animating something nobody is looking at is pointless, and leaving it hidden
means the copy never appears at all.

VERIFIED AFTER: 32 -> 0 across all six scenarios (desktop and mobile x anchor
jump / instant jump / fast flick). Run `/tmp/fastscroll.py` after any
`use-motion.ts` change. This also serves §8's demand to test normal scrolling,
fast scrolling, anchor navigation and reduced motion, and that important text
be visible by default.

---

## "AT YOUR SERVICE" MADE UNIFORM - THIS DELIBERATELY REVERTS BRIEF §4
(DONE, verified, commit 2bdc920)

The user's explicit instruction overrides V1.2 brief §4 (lines 75-87), which
asked to rank the two promises above the two actions. The client asked for all
four tiles to read as one consistent set: same image size and aspect ratio,
same vertical alignment, same label treatment centred below, same four-edge
feather, same hover lift, and "either all four show a chevron or none do".

DECISION: no chevron on any of the four. All four PILLARS entries are links, so
a chevron on all four would also have been defensible, but "centred below"
matches the promise style and no chevron is the calmer choice. Flagged so the
user can overrule.

### What changed
- `pages/index.tsx`: the `kind: "promise" | "action"` field is gone from
  `PILLARS`; the render map no longer emits `pillar pillar-${kind}` and no
  longer emits the `.pillar-go` span. Every tile is `className="pillar"` with
  `<img className="pimg">` + `<h3>`. Destinations unchanged (`#process`,
  `#services`, `/estimate.html`, `#contact`). The stale ranking comment above
  `PILLARS` was rewritten to record the reversal.
- `styles.css`: deleted `.pillar-promise h3`, `.pillar-action`,
  `.pillar-action .pimg`, `.pillar-action h3`, `.pillar-action:hover h3`,
  `.pillar-go`, `.pillar-action:hover .pillar-go` and the `.pillar-go`
  reduced-motion block. `.pillar h3` is one rule at 22.5px again (the original
  uniform V1/V1.1 value). `.pillars` is back to `repeat(4, 1fr)`.
- `align-items: stretch` KEPT, not `start`: it keeps every hairline divider the
  same length when a label wraps to a second line.
- `.pillar .pimg` gained `aspect-ratio: 4 / 3` and `object-fit: cover`. All four
  source files are already 1000x750, so equal heights followed from width
  alone; pinning the ratio makes the uniformity guaranteed rather than
  incidental if an asset is ever swapped for a different crop. The four-edge
  feather mask was not touched.
- The 860px block lost its per-variant overrides (`.pillar-action`,
  `.pillar-action .pimg`, `.pillar-promise h3`, `.pillar-action h3`). Mobile is
  now a plain uniform 2x2 with one label size (19px).
- The `.svc-close` reduced-motion comment no longer refers to the deleted
  `.pillar-go`.

`rg -n "pillar-go|pillar-promise|pillar-action" packages/web/src` returns
nothing.

### Verification
`/tmp/pillarqa.py` was REWRITTEN: it used to dump the ranked design, it now
ASSERTS uniformity - four equal grid columns, one label size / colour /
alignment, equal cell widths, equal image widths AND heights, equal image top
offsets within the tile, equal label gap below the image, tile tops level per
row (1px subpixel tolerance), chevron count 0, feather mask present on all
four, and no surviving `pillar-` variant class. Desktop 1440x900 PASS, mobile
390x844 PASS, OVERALL PASS. Both screenshots viewed
(`/tmp/v12-s4-desktop.png`, `/tmp/v12-s4-mobile.png`) - they do read as one set.

lint 21 files 0/0; build clean, 8 routes prerendered; flashprobe zero numeric
`hiddenAt` across all 8 routes; motionqa GSAP on index only, 0 stuck / 0
initLeft on all 8, reduced motion `gsapChunks=[]`, GSAP blocked -> h1 opacity 1.

### Commit split
The fast-scroll fix is its own commit (`ba5ffbc`) because it is genuinely
independent. §7 and the tile-uniformity change landed together in `2bdc920`:
their hunks are interleaved in the same `styles.css` region (deleting the
`.pillar-action` / `.pillar-go` rules sits inside the same hunk as the §7
additions), so hunk-splitting them risked a broken intermediate commit for no
real gain.

---

## "AT YOUR SERVICE" ILLUSTRATION MATCHING — BUILT, THEN REVERTED AT THE CLIENT'S REQUEST

The client's second round of feedback on these tiles said the four illustrations
were mismatched: the two on the left dense and full-frame, the two on the right
"shrunken and faint". The ask was to crop/zoom each to equalize apparent size and
to bring the lighter two up to the same weight.

### What measurement actually showed (worth keeping: the stated cause was wrong)

Measured on the four 1000x750 sources with PIL/numpy. The subject extents ALREADY
matched within a few percent; nothing was floating in whitespace.

| source            | extent        | ink cov | stroke | inkMass/px |
|-------------------|---------------|---------|--------|------------|
| tile-glove.jpg    | 68.4 x 76.9   | 26.7%   | 109.3  | 30.9       |
| tile-custom.jpg   | 75.4 x 81.9   | 28.6%   | 100.3  | 30.4       |
| tile-estimate.jpg | 69.9 x 78.3   | 15.0%   | 104.4  | 16.8       |
| tile-appt.jpg     | 75.5 x 80.0   | 24.7%   |  86.3  | 24.7       |

Two DIFFERENT causes, not one:
- Quick Estimate reads shrunken because it is SPARSE (~45% less ink). Its strokes
  are already at reference darkness. A composition problem, not a framing one.
- Schedule a Private Appointment reads faint because its STROKES are thin (86 vs
  ~105). It is actually a busy drawing (a whole room interior).

### The generator and why gamma was the wrong tool

tools/match-tile-set.py went through three revisions:
- v1: solved a global gamma so "mean ink where ink>30" hit 100. SELF-REFERENTIAL:
  darkening pushes faint pixels ACROSS the ink>30 threshold and inflates the very
  mean being solved. Drove appt's coverage 24.7% -> 42.2%, denser than either
  reference.
- v2: added a coverage guard, which walked the gamma back so strokes stayed light
  while coverage still climbed. Muddy, milder. Root cause: a gamma below 1 boosts
  the FAINTEST values fastest, so a background wash muddies before linework darkens.
- v3: per-tile policy instead of one blanket rule. glove and custom passed through
  untouched as references; appt got a threshold-gated stroke boost solved on a
  FROZEN mask (so darkening cannot recruit new pixels); estimate got crop only,
  because its strokes were already at reference and darkening would have put hard
  black on empty paper.

Rendered-space measurement (/tmp/tiledensity.py, which crops each <img> out of a
real screenshot so the CSS grade and the feather are included) showed the appt fix
worked and, more importantly, that the goal itself was wrong: the two REFERENCE
tiles differ from each other by 34% on innerMass, and custom has the lightest
strokes of all four yet the client reads it as fine. Exact numerical equality
across four hand-drawn illustrations is neither achievable nor desirable.

### Reverted

Before the estimate crop level was settled, the client said to stop: revert all
four to the ORIGINAL images, do not match ink weight or size, just keep the boxes
uniform with the shared four-edge feather and hover lift. Done:
- index.tsx reverted to tile-glove/custom/estimate/appt.jpg (git checkout).
- The four tile-*-set.jpg derivatives and tools/ removed.
- No CSS touched. The uniform-box work from commit 2bdc920 stands untouched:
  aspect-ratio 4/3, object-fit cover, --feather-x 14% / --feather-y 20% dual-mask
  with mask-composite intersect, one 22.5px centred label, scale+lift hover.
- /tmp/pillarqa.py PASS on desktop and mobile; screenshot checked by eye.

LESSON WORTH KEEPING: beware self-referential image metrics. Freeze the mask
before solving, and always sanity-check a second independent metric for runaway.

---

## ONE BODY SIZE FOR RUNNING PROSE, SITEWIDE

Client: the "What we do" intro ("These are solutions, not a menu...") rendered
SMALLER than the "Who we are" paragraph directly above it. All body/lede
paragraphs must be one size; pull the smaller ones UP, never shrink the larger.

Cause: .soft only ever set a colour, never a size, so those paragraphs fell back
to the browser default 16px while .body-text sets 18.5px.

Surveyed every paragraph and list item on all 8 routes with /tmp/parasize.py
(computed font-size, family, colour, ancestor trail) rather than reading CSS.

Raised to 18.5px:
- .narrow > p            (section intro/lede columns, incl. the cited case)
- .callout p
- .faq-a p               17.5 -> 18.5
- .step-row p            17.5 -> 18.5
- .page-estimate .est-head p   17.5 -> 18.5
- .page-privacy p, li    18   -> 18.5
- .page-article .cta p   18   -> 18.5
- blackout.tsx had an inline style={{fontSize: 17}} on running prose. Replaced
  with the shared .body-text class on its container. An inline value is exactly
  how a paragraph gets out of step, so it is gone rather than retuned.

Deliberately NOT raised, and reported as such: component copy that is its own
tier by design (service cards 16px, the compact third services row 15px,
collection and journal tiles 16px), captions (.ba-cap), form helper text
(.reassure 14.5, .contact-side .soft 14), footers (12.5), .cq-not (16, the
deliberate counterpart in the client quotation), .svc-close (17, a closing line
not body copy), and the estimate wizard's .sub (17, UI helper). Nothing was
scaled DOWN: .lede 20.5, journal article prose 20, .serif-lede 26 left alone.

No mobile overrides existed for any of these selectors, so one set of desktop
rules covers both breakpoints. Verified: 0 horizontal overflow at 360px on all
8 routes.

### A QA script that cried wolf

/tmp/fastscroll.py reported TOTAL BROKEN: 1 after these edits, deterministically.
Investigated instead of accepting it: the flagged .svc-feature carried .reveal-in
and sat at opacity 0.9866 at the probe's fixed 1200ms sample, settling to exactly
1 with the reveal classes stripped by ~1500ms. The mobile anchor-jump scenario
runs a smooth scroll AND THEN a 0.7s fade, which does not fit in 1200ms. Widened
the settle to 2000ms with a comment; the 0.99 test itself is unchanged, since a
genuinely stuck reveal reads exactly 0 and never gains .reveal-in. Back to 0.

Verification: lint 21 files 0/0 · build clean, 8 routes prerendered · flashprobe
no flash on any route · motionqa GSAP on index only, 0 stuck / 0 initLeft,
reduced motion clean, GSAP blocked leaves h1 visible · fastscroll 0 · overflow360
0 on all 8.
