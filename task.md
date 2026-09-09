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

---

## ONE ROOF HEADING — "LAST SCREW" COPY SWAP (commit 6426575)

Client instruction, verbatim:

> Replace the line "One team, from the first question to the last screw." with:
> "One team, from the first question to the last shade raised on your schedule."
> Update it everywhere that phrase appears (the One Roof / One Team section
> heading and anywhere else it's used).

### What changed

`packages/web/src/web/pages/index.tsx`, the ONE ROOF section's `h2.big`
(now lines 429-432), reformatted to multi-line JSX and reading:

    One team, from the first question to the last shade raised on your schedule.

Nothing else. The client's exact phrase appears exactly once in the codebase.

### Geometry — measured, not assumed

The new line is ~46% longer than the old one, so it was checked at four widths
with a new script `/tmp/oneroof.py` (takes a viewport width; reports the
heading's computed font-size, line count, box size, self-clipping and document
overflow, and writes `/tmp/oneroof-<width>.png`).

| width | font-size | lines | heading w x h | heading clip | doc overflow |
|-------|-----------|-------|---------------|--------------|--------------|
| 1440  | 47.5px    | 3     | 472 x 164     | 0            | 0            |
| 1024  | 41.68px   | 3     | 444 x 144     | 0            | 0            |
| 390   | 31.5px    | 3     | 342 x 109     | 0            | 0            |
| 360   | 31.5px    | 3     | 312 x 109     | 0            | 0            |

No clipping, no overflow, three lines everywhere. `/tmp/oneroof-1440.png` and
`/tmp/oneroof-390.png` both viewed and read correctly (olive kicker, three-line
Cormorant heading left, body right).

### FLAGGED, DELIBERATELY NOT CHANGED

`packages/web/src/web/pages/index.tsx` line ~446, the closing sentence of the
ONE ROOF body paragraph, still reads:

    One point of contact, from the first conversation to the last screw.

This is a *variant* of the client's phrase ("first conversation", not "first
question"), so it is not covered by "everywhere that phrase appears". Rewriting
it would mean inventing client copy that was not approved. But the original copy
relied on the heading and this sentence echoing each other, and that echo is now
broken: the paragraph closes on an image the heading above it no longer uses.
Raised with the client for a decision; not touched pending their word.

### Consequence for V1.2 SS8

The ONE ROOF heading is now three lines at every breakpoint where it was
previously shorter, making that dark section taller. SS8 asks for *reduced*
dark-section height. Note the tension when SS8 is executed; the height budget
there has to absorb this.

Verification: lint 21 files 0/0 · build clean, 8 routes prerendered, main chunk
571.91 kB raw / 174.07 kB gzip · flashprobe no flash on any route · motionqa
GSAP on index only, 0 stuck / 0 initLeft, reduced motion clean, GSAP blocked
leaves h1 visible · fastscroll TOTAL BROKEN 0 · overflow360 0 on all 8.

### RESOLVED — the body-paragraph variant (same day)

Client answered the flag: match it to the heading. Line 446 now reads

    One point of contact, from the first conversation to the last shade raised on your schedule.

`rg -n "last screw" packages/web/src` returns nothing. Both occurrences now end
on the same image, so the heading/paragraph echo is restored. Verified: lint 21
files 0/0 · build clean, 8 routes prerendered · oneroof at 360 and 1440 still
3 lines, 0 clip, 0 doc overflow · overflow360 0 on all 8 · /tmp/oneroof-1440.png
viewed, both lines read correctly.

Client also ruled on the attached "Warm Editorial" typography brief
(`/home/user/Attachments/pasted-1_9CR68p.txt`): **finish V1.2 SS8-SS16 first,
then do the typography overhaul.** It is queued, not cancelled.

---

## V1.2 SECTION 8 — "ONE TEAM, NO RUNAROUND" DARK BAND

Brief asks: shorten excessive vertical height; never let the band read as an
empty dark slab during scrolling or anchor navigation; trigger any reveal
BEFORE the content enters the viewport; important text visible by default; at
most one quiet grouped reveal; faint textile/architectural detail only if a
suitable existing asset exists.

### 1. One reveal instead of two (index.tsx)

The band had `data-reveal-group` on `.wrap.two` with `data-reveal` on BOTH
children, so the heading and the body arrived as two staggered halves. Replaced
with a single `data-reveal="early"` on `.wrap.two` and no group. One quiet
grouped reveal, as the brief asks. Sitewide reveal count 57 -> 56.

### 2. Reveal now fires before the band reaches the fold (use-motion.ts)

The shared observer used `rootMargin: "0px 0px -18% 0px"`, i.e. it fires AFTER
the element's top edge is already 18% inside the viewport. For a full-bleed dark
section that is exactly the empty-slab failure the brief describes.

Added a second observer, opted into per element with `data-reveal="early"`:

    const io      = makeObserver("0px 0px -18% 0px");   // default, unchanged
    const ioEarly = makeObserver("0px 0px 20% 0px");    // fires ahead of the fold

Both feed the same `reveal()` / `pending` / `finalize()` machinery, so the
fast-scroll safety net still covers them. The sweep and the cleanup now iterate
an `observers` array rather than the single `io`, because an element sits in one
observer and the sweep cannot know which.

Default behaviour for every other reveal on the site is byte-for-byte unchanged.

Verified with a new script `/tmp/earlyreveal.py`, which scrolls in 60px steps and
samples the band at the first moment its top edge crosses the fold:

| viewport | at first on-screen | classes | verdict |
|---|---|---|---|
| 1440x900 | opacity 0.983 | reveal-init reveal-in | PASS |
| 390x780  | opacity 0.960 | reveal-init reveal-in | PASS |
| 1440x900 reduced | opacity 1 | (none) | PASS |

The copy is already arriving as the band appears, instead of sitting at 0.
Reduced motion carries no reveal classes at all.

### 3. Height reduction (styles.css) — measured

Two levers, both scoped to a new `.oneroof` class so the rest of the site keeps
its 82px rhythm. Copy untouched, per the brief.

- Less vertical padding: 82 -> 64px desktop, 56 -> 44px mobile. Padding on a
  full-bleed dark band reads as far more emptiness than the same padding on a
  cream section.
- Asymmetric split: `.oneroof .two` is `0.86fr 1.14fr` instead of `1fr 1fr`.
  The heading is a few short lines, the body is one long paragraph, so giving
  the body the wider column removes body lines. The heading grew 3 -> 4 lines
  (164 -> 219px) but the body shrank far more.

| viewport | before | after | delta |
|---|---|---|---|
| 1440 | 622px (0.69vh) | 521px (0.58vh) | -101px, -16.2% |
| 390  | 902px (1.16vh) | 870px (1.12vh) | -32px, -3.5% |

`/tmp/oneroof-1440.png` viewed: tighter band, heading and body balanced, no
clipping.

### TWO SPECIFICITY TRAPS HIT AND FIXED (both caught by measurement)

1. `.oneroof .two` is (0,2,0) and beat the mobile `.two { grid-template-columns:
   1fr }` at (0,1,0), leaving the dark band in TWO 133px columns on a phone.
   Measured secH 1347px before the fix. Added an explicit mobile reset.
2. `.oneroof { padding: 44px 0 }` sat at line 2806, BEFORE `.block { padding:
   56px 0 }` at ~2830. Equal specificity, so the later rule won and the mobile
   padding never applied. Both rules are now written `.block.oneroof` (0,2,0) so
   source order cannot matter. Comment records why.

Also re-learned lesson 1: the dev server served stale CSS through the first
round of this, which is what made trap 2 look like trap 1. Restarted clean
before trusting any number.

### HONEST NON-COMPLETIONS FOR SECTION 8

- **Mobile is still 1.12 viewports of dark (870px).** The band's height at 390px
  is copy-bound: the body paragraph is long, the brief says keep the message,
  and locked decision 8 forbids shrinking body text. Padding and gap are already
  cut. The only remaining levers are cutting copy or shrinking type, both of
  which are out of bounds. Flagged for the client.
- **No textile or architectural detail added.** The brief allows one "only if an
  existing suitable asset is available". There is none in
  `packages/web/public/assets/` and stock/invented imagery is forbidden. Same
  deliberate skip as sections 6, 10 and 12.
- The heading is now 4 lines on desktop (was 3), a direct consequence of the
  narrower heading column. It reads well and does not clip, but it is a visual
  change the client has not seen; screenshot delivered.

Verification: lint 21 files 0/0 · build clean, 8 routes prerendered · fastscroll
TOTAL BROKEN 0 (the observer refactor is shared by every route, so this was the
critical regression test) · motionqa 0 stuck / 0 initLeft on all 8, reduced
motion clean, GSAP blocked leaves h1 visible · flashprobe no flash on any route
(11 samples null) · overflow360 0 on all 8 · earlyreveal 3/3 PASS.

---

## V1.2 SECTION 9 — "HOW WE WORK" PROCESS PROGRESS LINE

All six steps and their copy kept verbatim. No copy touched.

### 1. Markup (index.tsx)

`.steps` gained `data-process`; each `.step-row` gained `data-step`; a new
track was added as the first child:

    <div className="process-line" aria-hidden="true">
      <span className="process-line-fill" data-process-progress />
    </div>

This is the markup the GSAP written back in section 1 had been waiting for. It
had been inert since then because `[data-process]` did not exist anywhere.

### 2. Line placement — the gutter, not through the numerals

`.step-row` is `grid-template-columns: 64px 1fr; gap: 24px`, so the gutter runs
x=64..88. The line sits at x=76, its centre. Asserted, not eyeballed:
`maxNumRight < lineX < minHeadLeft` holds at both widths (desktop 284 < 296 <
308, mobile 88 < 100 < 112), so the line connects all six steps without ever
crossing a digit. No mobile override needed; the column stays 64px there.

### 3. Motion contract preserved

`.process-line-fill` is `scaleY(1)` in CSS, i.e. FULLY DRAWN by default. GSAP
animates it back from `scaleY(0)` at runtime. So reduced motion, a failed GSAP
chunk and no-JS all show the complete static line, which is what the brief asks
for. Confirmed: reduced motion reports `transform: none` and scaleY 1 at every
scroll position, with zero GSAP chunks loaded.

### 4. Active-step emphasis is ADDITIVE ONLY

The brief forbids near-zero opacity on future steps and forbids forthcoming
content looking disabled. So nothing is ever dimmed: the active step GAINS
emphasis rather than the others losing it.

    .step-row.is-active .n  { transform: scale(1.06); }
    .step-row.is-active h3  { color: var(--accent); }

Driven by `ScrollTrigger.create({ toggleClass })` per step. No pinning, no
scrub on text, no scroll hijacking.

**Single cursor, found by measurement.** The first window (`top 60%` /
`bottom 40%`) is a 180px band while a row is ~147px, so it lit TWO adjacent
steps at once (measured `active: [2,3]`, `[4,5]`). Changed to `top 50%` /
`bottom 50%`: a row is active only while it straddles the viewport midline, and
since rows tile contiguously exactly one qualifies. Re-measured: `[1] [3] [4]
[6]` desktop, `[2] [3] [5] [6]` mobile, never two at once.

`allReadable` asserts every h3 and p sits above 0.99 opacity at every sampled
scroll position, in all three modes. It never fails.

### 5. Anchor navigation

`#process` lands clear of the sticky header in every mode: desktop secTop 92 vs
header 84, mobile secTop 80 vs header 72. Uses the existing global
`section { scroll-margin-top }`; nothing new was needed.

### A QA SCRIPT THAT LIED TO ME (lesson 8, again)

`/tmp/processshot.py` parked mid-section to light a step, then called
`scrollTo(0,0)` before a `full_page` clip screenshot, because a full-page clip
needs document-absolute coordinates. Scrolling to 0 reset the scrub to ~0 and
cleared every `is-active`, so the capture showed a bare hairline and no
highlight, and looked exactly like a feature that had not worked. The feature
was fine; the script defeated it. Replaced with `/tmp/processshot2.py`, which
takes a plain viewport screenshot in place with no scroll reset.
`/tmp/process-live-1440.png` viewed: olive line drawn to the reader's position,
step 5 lit in olive, steps 4 and 6 at full normal contrast.

Verification: lint 21 files 0/0 · build clean, 8 routes prerendered · processqa
3/3 modes PASS · fastscroll TOTAL BROKEN 0 · motionqa 0 stuck / 0 initLeft on
all 8, reduced motion 0 GSAP chunks, GSAP blocked leaves h1 visible ·
flashprobe no flash (11 samples null) · overflow360 0 on all 8.

## V1.2 SECTION 10 — "FOR DESIGNERS, ARCHITECTS & BUILDERS" SPEC SHEET

Brief: keep the existing copy and professional tone; give the section a
slightly more technical editorial identity "using existing relevant assets if
available", e.g. a measurement drawing, specification detail, fabric memo or
installation crop; do NOT add generic stock imagery; a subtle horizontal reveal
may be used but avoid a large entrance sequence.

### Imagery deliberately skipped, per the brief's own condition

There is no measurement drawing, specification detail, fabric memo or
installation crop in `packages/web/public/assets`. The inventory is six 1600x1000
service illustrations, the hero illustration, the before/after pair, the four
"at your service" tiles, the logos, and `about.jpg` (a wide marketing plate with
a baked-in headline and signature). The brief conditions imagery on "if
available" and forbids generic stock, so imagery is a deliberate skip here, the
same call already made for section 6 and section 8. Nothing was sourced or
invented.

That leaves the technical register to be carried entirely by layout and type.

### The spec-sheet treatment

Copy untouched, verbatim, asserted by QA. Markup: the section gained a `trade`
class, the two columns gained `trade-col`, and the left list gained `spec-list`.
Every CSS rule is scoped to `.trade` so the shared `.trade-cols` and `ul.clean`
primitives behave exactly as before everywhere else.

- **A drawing-sheet frame.** One hairline across the top of the columns, and a
  vertical hairline BETWEEN them instead of a plain 44px gap. `gap` goes to 0
  because the rule plus its 48px padding now does the separating. Columns went
  from `1fr 1fr` to `1.02fr 0.98fr` (measured 510px / 490px at 1440).
- **Specification line items.** Each `li` became a grid, `34px 1fr`. The `<b>`
  lead-in is now its own label line ABOVE the detail text, the way a spec line
  item reads: Jost 13px, uppercase, tracking 0.12em, ink. Deliberately tighter
  than `.kicker`'s 0.3em so the labels do not compete with the olive kicker
  above them.
- **Row numerals via a CSS counter.** `counter(spec, decimal-leading-zero)`
  renders 01..04 in olive 12.5px tabular in the gutter. Generated content, so
  the numerals never enter the copy and are not in `textContent`.

### The subtle horizontal reveal

New opt-in variant, `data-reveal="x"`, added to the reveal block in styles.css:
`translateX(-16px)`, with `:nth-child(2)` mirrored to `+16px` so the pair opens
outward from the dividing hairline rather than sliding as one slab. Same 0.7s
curve as the default; travel cut from 20px vertical to 16px horizontal. No
entrance sequence, nothing staged.

Motion contract preserved: the sideways offset lives on `.reveal-init`, applied
by JS at runtime, never in CSS by default. `[data-reveal="x"].reveal-init` is
(0,2,0), EQUAL to `[data-reveal].reveal-init`, so it must stay AFTER it in
source order; `.reveal-in` is (0,3,0) and wins over both. The hook only
special-cases `data-reveal="early"` when picking an observer, so "x" uses the
default trigger and needed no JS change at all. Reveal count stays 56.

### The mobile specificity trap, third time now

`.trade .trade-cols` is (0,2,0) and beat the (0,1,0)
`.two, .contact-grid, .trade-cols { grid-template-columns: 1fr }` in the 860px
block, which would have left the spec sheet in two ~150px columns on a phone.
Exactly the trap `.oneroof .two` hit in section 8. Reset explicitly in the
860px block, and the vertical dividing hairline swaps to a horizontal one above
the second column now that they stack. Measured: one 342px column at 390px, one
312px column at 360px, columns genuinely stacked, 0 overflow at both.

### THREE OF MY OWN QA ASSERTIONS WERE WRONG (lesson 9, third time)

The first run of `/tmp/tradeqa.py` reported four failures. Only ZERO were real
CSS defects:

1. **"counters 01..04" FAIL.** `getComputedStyle(el, '::before').content`
   returns the SPECIFIED string, `"counter(spec, decimal-leading-zero)"`.
   Chrome never resolves it, and generated text is absent from `textContent`,
   so the numerals cannot be read from the DOM at all. Proved with a standalone
   minimal repro before touching anything. Assertion replaced with a structural
   one (correct counter function, non-zero rendered box in the gutter) plus
   visual confirmation from the screenshots.
2. **"label on own line" FAIL, labelTop 17 at every width.** 17px is exactly
   the row's `padding: 17px 0`. I had asserted against the row's BORDER box.
   Replaced with a real test: a `Range` over the trailing detail text node,
   asserting `detailTop >= labelBottom` and `detailLeft == labelLeft`.
3. **"revealed at end" FAIL, second column at opacity 0.** The script parked
   once with `scrollIntoView({block:'center'})` and never scrolled on. The
   default trigger needs an element 18% inside the viewport, so a stacked
   second column below the fold legitimately had not fired. Not a defect, but
   NOT something to hand-wave either: the script now scrolls through and past
   the section in 12 steps, and asserts both columns end settled. They do.
4. **"opposite directions" FAIL on desktop only.** A race against the 70ms
   group stagger: the second column read `matrix(1,0,0,1,15.9688,0)` mid
   transition and my literal `"1, 16, 0"` substring match missed. Laptop hit
   exactly 16 by luck. Now parses the matrix and asserts opposite signs,
   magnitude >15, and no vertical component.

Final: `/tmp/tradeqa.py` OVERALL PASS, 15 checks x 5 modes (1440, 1180, 390,
360, 1440 reduced). Section height 941px desktop, 1620px at 390, 1715px at 360.

### Flag for the user

The uppercase spec labels keep the copy's trailing periods, so they render as
"TECHNICAL EXPERTISE." and "PROACTIVE COMMUNICATION." Slightly unusual in caps.
Fixing it would mean editing client copy, which the brief forbids, so it stays.
Raise it; a one-character change per label would resolve it if they want.

Verification: lint 21 files 0/0 · build clean, 8 routes prerendered · tradeqa
5/5 modes PASS · fastscroll TOTAL BROKEN 0 · overflow360 0 on all 8 ·
flashprobe no flash · motionqa reveals 56, 0 stuck / 0 initLeft on all 8,
reduced motion 0 GSAP chunks, GSAP blocked leaves h1 and hero visible · brand
audit clean (dist 0 hits) · screenshots viewed at 1440 and 390.

---

## V1.2 SECTION 11 — THE BEFORE/AFTER COMPARISON (commit 4cd15cb)

New component `packages/web/src/web/components/before-after.tsx`, a `.cmp`
block in styles.css, and a two-line change in `pages/index.tsx` (import, and
`<BeforeAfter />` replacing the 22-line static `.ba` block). The
`.project-head` copy above and the `.ba-cap` caption below were left untouched,
as the brief requires.

### The design, and why

First render is the EXISTING static two-figure pair (`StaticPair()`, reusing
`.ba` / `.ba-tag` / `.ba-img` verbatim). `interactive` flips true only in a
`useEffect` after mount, and only when `prefers-reduced-motion` is not set.
One mechanism therefore satisfies three separate requirements: no-JS, a failed
chunk, and reduced motion all get two fully captioned photographs.

The control is a native `<input type="range">` stretched transparently over the
whole frame (`opacity: 0`, `inset: 0`, `z-index: 4`). That buys pointer drag,
touch drag, keyboard (arrows/Home/End/Page) and screen-reader semantics for
free; a hand-rolled pointer handler would have reimplemented all of it, worse.
Near-zero-width thumb (1px) on purpose: a wide thumb insets the track at both
ends and the seam then visibly lags the cursor. Focus is shown on `.cmp-grip`
via `.cmp-frame:focus-within`, because the real input is invisible and its own
ring would be too. Both labels are permanent and never move. `touch-action:
pan-y` keeps vertical page scrolling working over the frame.

`.ba-img` and `.ba-tag` are scoped UNDER `.ba` in the existing CSS, so their
treatment (the `--elpa-grade` filter, background, border, label styling) had to
be RESTATED in the `.cmp` rules rather than inherited. Commented in place.

No `data-reveal` on `.cmp`: the subtree mounts after `usePageMotion`'s layout
effect has already queried the DOM, so it could never be observed. Leaving the
attribute on would have implied motion that never runs.

### The optional scroll-linked reveal was built WITHOUT GSAP

An IntersectionObserver (threshold 0.35) fires once, waits 260ms for the reveal
to settle, then runs a 900ms ease-out-cubic rAF tween moving the divider from
64 to 48. Runs once, never on scroll up, not scroll-linked, pins nothing,
hijacks no scroll. Section 11 was nominally the third approved GSAP experience,
but the divider position is React state and driving it from GSAP would add a
library round-trip and a conflict with the range input's value for no benefit.
CONSEQUENCE FOR THE FINAL REPORT: only two of the three approved GSAP
experiences actually use GSAP.

### A real bug, found because a QA assertion was wrong (lesson 9, again)

`/tmp/cmpqa.py` reported "ArrowRight does nothing" at 390 and 360 only, while
ArrowLeft moved exactly the expected 6%. Asymmetric and mobile-only, so I
instrumented (`/tmp/cmp390.py`) instead of editing code. The keyboard was fine:
`input.value 48 -> 51` at BOTH widths, `activeElement='cmp-range'`. My script
waited a fixed 2200ms, but the hint tween starts ~1386ms after the frame enters
view on mobile vs ~1248ms on desktop, so the presses raced the tail of the
tween. Fixed by polling for stillness (`settle()`) instead of sleeping.

BUT the false failure exposed a GENUINE defect: a keypress or drag DURING the
900ms tween was overwritten on the next animation frame. `hinted.current = true`
in `onChange` only blocked FUTURE tweens, it never cancelled a RUNNING one.
Fixed with a `stopHint` ref that cancels the timer and the rAF, wired to
`onPointerDown`, `onKeyDown` and `onChange`. The reader always wins. Regression
test added: catch the tween mid-flight at 1500ms, press End, assert >97.

### The height claim I wrote was false, and I measured it instead

My own CSS comment claimed the 3/4 frame meant "swapping presentations does not
change the section's height". Untrue: the static pair is two 3/4 images side by
side, one 3/4 frame is a different box. MEASURED `#projects` height, static vs
interactive: 1202 -> 1295px at 1440 (+7.8%), and 1571 -> 1095px at 390
(-30.3%, because the static pair stacks on mobile).

That reflow is real but free: `#projects` sits 7461px (desktop) / 11013px
(mobile) below the fold at load, so measured CLS is 0.00000 at 390 and 0.00456
at 1440 — and that single desktop entry is `main`/`#text` at t=626ms, i.e.
hydration text reflow, not this swap. Comment rewritten with the real numbers.

### Lesson: `bun run lint` is NOT a parse check

An edit of mine left a JSX comment and a `<div>` as two sibling expressions
inside `return (...)`, an outright syntax error. `bun run lint` reported
"21 files, 0 violations" anyway. Only loading the page caught it (`#root` had
0 children, Vite 500 in the console). Always load the page or run the build
after editing a component; lint alone proves nothing about validity.

### Verification

`/tmp/cmpqa.py` OVERALL PASS, 80/80 across six modes (1440, 1180, 390, 360,
1440-reduced, 390-reduced): static pair under reduced motion with both photos
and both labels; interactive frame mounted otherwise; 3/4 ratio at every width;
arrows, Home/End; focus ring on the grip; clip-path tracks the divider; pointer
drag max lag 0.16%; labels never move; touch drag; page still scrolls over the
frame; reader input beats the tween; copy intact; 0 overflow.

NO-JS GUARANTEE PROVED ON THE BUILT FILES: in `dist/index.html`, `cmp-frame`
appears 0 times OUTSIDE `<style>` (the 2 raw hits are the inlined stylesheet),
while the static markup is present with both `<img>`, both labels and real alt
text. Same for `drapery.html`, whose own static `.ba` pair is untouched.

lint 21 files 0/0 · build clean, 8 routes prerendered · fastscroll TOTAL BROKEN
0 · overflow360 0 on all 8 · flashprobe no flash · motionqa 0 stuck / 0
initLeft on all 8, reduced motion 0 GSAP chunks, GSAP blocked leaves h1 and
hero visible · brand audit dist 0 hits · .env identical to backup ·
screenshot viewed at 1440.

NOTE on the reveal count: index reads 54 under normal motion but 56 under
reduced motion. Expected — the two static `<figure data-reveal>` elements
unmount when the interactive frame (deliberately no `data-reveal`) replaces
them. Not a regression.

---

## V1.2 SECTION 12 — FUTURE COLLECTIONS AS A MANIFESTO (commit 8a6a7cc)

### The brief

Keep all four future collection names and the existing vision copy. Reduce the
generic expansion-grid appearance; treat the section as an editorial manifesto:
one strong overarching statement, four understated collection names, tactile
imagery only where suitable existing assets are available, no generic cards,
no four-item GSAP entrance sequence.

### What was there before

`.collections[data-reveal-group]` mapped `COLLECTIONS` into four `.collection`
divs, each with its own `data-reveal`. CSS: `.collections` was
`repeat(2, 1fr)` with `gap: 20px`; `.collection` was a bordered padded box
(`border: 1px solid var(--dark-rule); padding: 26px 28px`), `h3` 25px. That is
literally a 2x2 card grid with a four-item staggered entrance — the exact two
things the brief names.

### What was built

Two files. `pages/index.tsx`: the list becomes
`className="collections manifesto"` carrying a single `data-reveal`;
`data-reveal-group` and the four per-item `data-reveal`s are removed. Copy and
all four titles untouched. `styles.css`: a `.collections.manifesto` block added
after `.collection p` (the original card rules are left intact, deliberately —
see the height measurement below), plus a mobile reset in the 860px block.

- `.collections.manifesto` — single column, `gap: 0`, `border-top` hairline.
- `.manifesto .collection` — grid `0.82fr 1.18fr`, `gap: 40px`,
  `align-items: baseline`, `border: none` + `border-bottom` hairline,
  `padding: 22px 0`.
- `.manifesto .collection h3` — 21px, down from 25px.
- `.manifesto .collection p` — 16.5px.

### The design decisions and why

The boxes are gone entirely: no border box, no padding shell, no 2x2 tiling.
What remains is one hairline-ruled column, each row setting an understated name
against its line of copy. That answers "no generic cards" and "editorial
manifesto" in one move.

"One strong overarching statement" is satisfied by the EXISTING `h2.big`
"Window treatments are where we begin." — deliberately not new copy, because
the brief also says to keep the existing vision copy. The collection names were
cut 25px -> 21px specifically so that statement stays the loudest thing in the
band. Verified by measurement: h2 47.5px vs h3 21px at 1440, 31.5px vs 21px at
390.

One reveal instead of four is the direct answer to "no four-item entrance
sequence". The existing one was CSS-staggered rather than GSAP, but the spirit
is identical. Same move already made in section 8. Sitewide reveal count on
index falls 54 -> 51 (four removed, one added); reduced motion 56 -> 53.

Deliberately ONE column at every width. `.collections.manifesto` is (0,2,0) and
would beat the (0,1,0) mobile rule `.collections { grid-template-columns: 1fr }`
— the exact specificity trap that bit sections 8 and 10. Keeping the outer list
single-column at all widths means that fight never happens.

### The trap that DID apply, and was nearly shipped

`.manifesto .collection` is (0,2,0) and sets an inner two-column row grid, and
the 860px block had no reset for it. A CSS comment I had already written
claimed one was added "explicitly in that block" — it was not. Without it the
name and its body copy sit in two cramped columns on a phone. Added
`.manifesto .collection { grid-template-columns: 1fr; gap: 6px; padding: 18px 0 }`
next to the existing `.collections` mobile rule, and verified by measurement
that the rows stack at 390 and 360. Sixth instance of lesson 6.

### No imagery — deliberate, per the brief's own condition

The brief conditions imagery on "suitable existing assets are available". There
is no bedding, bath, outdoor or living textile photograph in the inventory, and
the brief forbids stock and invented assets. Skipped and reported, exactly as
already done for sections 6, 8 and 10.

### HEIGHT: the section got TALLER on desktop, and that is the honest number

Measured `#next` height, card grid vs manifesto, by dropping the `manifesto`
class in the live DOM (the original `.collections`/`.collection` rules are
still in the stylesheet, so this restores the true before state):

| width | before (cards) | after (manifesto) | delta |
|-------|---------------:|------------------:|------:|
| 1440  | 798            | 856               | +58 (+7.3%) |
| 1180  | 798            | 856               | +58 (+7.3%) |
| 390   | 1118           | 1130              | +12 (+1.1%) |
| 360   | 1144           | 1156              | +12 (+1.0%) |

Four stacked rows are taller than a 2x2 grid. Section 12 asked for the card
appearance to go, not for height, so this is an accepted trade rather than a
regression — but do NOT claim a reduction for this section. (Contrast section 8,
which did cut height.)

### Verification

`/tmp/collqa.py` OVERALL PASS, 174/174 across six modes (1440, 1180, 390, 360,
1440-reduced, 390-reduced): manifesto class applied; four collections; all four
titles and all four body strings verbatim; exactly one `data-reveal`, on the
container, zero on children; no `data-reveal-group`; list single-column; every
row has zero top/right/left border and a 1px bottom rule; every row fully
opaque after reveal; h3 21px; rows share one left edge and width; name beside
copy on desktop, stacked on mobile with the inner grid reset to 1fr; h2 louder
than h3; zero document overflow; zero page errors.

NO-JS GUARANTEE PROVED ON THE BUILT FILE: in `dist/index.html` with `<style>`
stripped, the container open tag is
`<div class="collections manifesto" data-reveal="true">`, `data-reveal` inside
the list is 0, `data-reveal-group` is 0, four `<h3>` with the titles verbatim,
all four bodies present, and no inline `opacity:0` anywhere in the block.

lint 21 files 0/0 · page loads (`/tmp/probe11.py`, root children 2, all section
ids present) · build clean, 8 routes prerendered · fastscroll TOTAL BROKEN 0 ·
overflow360 0 on all 8 · flashprobe no flash · motionqa 0 stuck / 0 initLeft on
all 8, reduced motion 0 GSAP chunks, GSAP blocked leaves h1 and hero visible ·
brand audit dist 0 hits (source still only the two comments in
`estimate-engine.ts`) · `.env` identical to backup · screenshots viewed at 1440
and 390.

### Lesson repeated: verify the QA script, including its slicing

My first dist check reported "data-reveal inside the list: 2" and looked like a
failure. The script was wrong twice over: it sliced from `class="collections
manifesto"` rather than from the `<div`, so the container tag was never counted
and the depth walk closed after the first item. Fixed by starting at
`rindex('<div', 0, k)`. The real answer was 0. Seventh instance of lesson 9 —
a failing assertion is a claim about the script first, the code second.

---

## V1.2 SECTION 13 — JOURNAL CONTENT STATE (commit e3c2136)

### The brief

Keep the editorial heading, existing story titles, descriptions and the working
article link. Only one article is published, so make the content state
unambiguous: keep the published story clearly actionable, mark unpublished
stories "Coming soon" or reduce their link-like styling, do not let unavailable
articles appear clickable, avoid unnecessary entrance animation.

### The actual defect

The two unpublished stories were already plain `<div className="post">`, not
links, so they were never *functionally* clickable. But `.post` sets the
background fill, the 1px solid hairline and the padding for all three, so all
three rendered as identical cards. The only difference was that the published
one carried an accent "Read the story ->" line and a hover lift. A visitor had
no way to tell two of the three cards were dead until clicking did nothing.
The brief's target was the appearance, and the appearance was wrong.

### What was built

`pages/index.tsx`: the two unpublished posts gain `post-soon` and a real
`<span className="soon">Coming soon</span>`, mirroring the slot where the
published card puts its read line. `data-reveal-group` and the three per-item
`data-reveal`s collapse to a single `data-reveal` on the container.

`styles.css`: a `.post-soon` block placed AFTER the `.post` rules (they are
equal weight, (0,1,0)/(0,2,0), so source order is what decides - lesson 6).

- `.post-soon` - `background: none`, `border-style: dashed`,
  `transition: none`, `cursor: default`.
- `.post-soon h3` - drops to `--ink-soft`.
- `.post-soon .tag` - drops the `--accent` colour to `--ink-soft` at 0.75.
- `.post-soon .soon` - the marker, `--ink-soft` at 0.8, same metrics as `.read`.

### The design decision

The published story is deliberately left completely untouched rather than
emphasised further. It already has the only filled surface, the only solid
border, the only accent text and the only hover response; making the other two
quieter is what creates the contrast, so no new emphasis was needed and no copy
was added to it.

The accent colour is the site's signal for "actionable", so removing it from
the unavailable tags matters more than the border change. `cursor: default` and
`transition: none` were added so a pointer landing on those cards gets no
response at all - verified, not assumed (see below).

### Contrast verified, because muted text at reduced opacity is an AA risk

Composited against the real section background `rgb(245,241,234)`:

| element | colour | opacity | size | ratio | need | verdict |
|---------|--------|--------:|-----:|------:|-----:|---------|
| title        | `rgb(74,54,38)` | 1.0  | 23.5px | 10.10:1 | 4.5 | PASS |
| tag          | `rgb(74,54,38)` | 0.75 | 12.5px | 4.98:1  | 4.5 | PASS |
| "Coming soon"| `rgb(74,54,38)` | 0.8  | 13.5px | 5.73:1  | 4.5 | PASS |
| body         | `rgb(74,54,38)` | 1.0  | 16px   | 10.10:1 | 4.5 | PASS |

The tag at 4.98:1 is the tightest margin on the section. Do not lower that
0.75 opacity without re-running the check.

### Verification

`/tmp/journalqa.py` OVERALL PASS, 258/258 across six modes (1440, 1180, 390,
360, 1440-reduced, 390-reduced): three stories; all titles, tags and
descriptions intact; editorial heading intact; exactly one `data-reveal`, on the
container, zero on children; no `data-reveal-group`; published story still an
`<a>` with `/journal-blackout.html` and the read line, still filled and
solid-bordered; both unpublished are `DIV` with no `href`, `tabIndex -1`,
`post-soon`, a real "Coming soon" marker, no read line, transparent
background, dashed border, `cursor: default`, no transition, muted title and
non-accent tag, fully opaque after reveal; zero overflow; zero page errors.

Hover proved rather than assumed: a dispatched `mouseover` on each unavailable
card leaves `transform: none`, moves it 0px and changes its border colour not
at all, in every mode.

Built file check on `dist/index.html` with `<style>` stripped: the working href
appears once, "Read the story" once, "Coming soon" twice, `post-soon` twice,
`data-reveal` inside the list zero times, all three titles verbatim, no inline
`opacity:0`.

lint 21 files 0/0 · page loads · build clean, 8 routes prerendered · fastscroll
TOTAL BROKEN 0 · overflow360 0 on all 8 · flashprobe no flash · motionqa 0
stuck / 0 initLeft on all 8, reduced motion 0 GSAP chunks, GSAP blocked leaves
h1 and hero visible · brand audit dist 0 hits · `.env` identical to backup ·
screenshot viewed at 1440.

Reveal count moved 51 -> 49 under normal motion and 53 -> 51 under reduced,
exactly as predicted (three per-item removed, one container added).

### Open item to raise with the user

The trailing line "More articles coming soon." still sits below the grid, and
is now duplicative of the two "Coming soon" markers. It is copy, and section 13
does not list it as removable, so it was deliberately LEFT IN rather than
silently deleted. Worth folding into the section 16 de-duplication pass if the
user agrees.

## V1.2 SECTION 14 — CONTACT (commit pending)

Brief: keep the form, fields and submission behaviour, the "Prefer to talk?" block,
phone/email/scheduling link/service area/response expectation, privacy and a11y.
Simplify: keep form + direct contact together, turn "what happens next" into a concise
three-step sequence, remove the later duplicate CTA if it repeats the same conversion
request, reveal the form as ONE unit, never animate individual fields.

Four edits, `pages/index.tsx` + `styles.css`:

1. Contact intro gained one sentence: "You'll leave the first meeting knowing exactly
   what's possible, whether or not you work with us." This is the unique promise rescued
   from the deleted CTA, so the delete cost no information.
2. `.contact-grid` went from `data-reveal-group` + two `data-reveal` children to a single
   `data-reveal` on the container, children bare. `ContactForm` carries no `data-reveal`
   of its own, so no field animates individually.
3. "What happens next" paragraph became `.next-lead` + a real `<ol class="next-steps">`
   with exactly three `<li>` + `.next-note`. The three strings are the original run-on
   sentence split VERBATIM. A real `<ol>` so a screen reader announces "list of 3";
   numerals come from a CSS counter so they are decoration and never announced twice.
4. The final CTA `<section>` (`.callout`, "Tell us about the room.", btn to `#contact`)
   was DELETED. Justified by measurement, not taste: `rg` proved "Tell us about the room."
   was the same heading twice on one page (contact h2 + callout h2) and the callout's
   button only scrolled back up to that very section. Its second sentence ("We'll bring
   the questions, the samples, and the experience.") was dropped deliberately because the
   FAQ already promises samples and measuring tools.

`.callout` CSS was NOT removed: drapery/motorized/blackout still use it. Verified styled
(bg rgb(57,41,27)) on all three after the change.

VERIFICATION
- `/tmp/contactqa.py` OVERALL PASS 171/171 across 1440/1180/390/360 + 2 reduced modes.
- Four initial failures were the SCRIPT, not the markup: a fixed 1400ms sleep read the
  grid mid-tween (0.838 = ~290ms into a 0.7s transition). Replaced with a settle poll:
  opacity reaches 1 at ~1800ms (the reveal starts late), and at 100ms reduced. Lesson 9.
- `/tmp/qa_booking.py`: 10 booking CTAs sitewide, 0 misconfigured, unchanged. The deleted
  CTA used `#contact`, not the booking URL, exactly as predicted.
- Built `dist/index.html` (styles stripped, sliced from `<div`): 0 `callout`, "Tell us
  about the room." x1, one `<ol class="next-steps">` with 3 verbatim `<li>`, next-lead +
  next-note present, rescued promise present, `<div class="contact-grid" data-reveal="true">`
  with 0 `data-reveal` inside and 0 `data-reveal-group`. The single inline `opacity: 0` in
  the file is inside the RunableBadge sprite, has no text, and is why the prerender guard
  correctly ignores it.

SUBMISSION BEHAVIOUR — NOT VERIFIED THIS SECTION, AND WHY
Running `/tmp/qa_form.py` and `/tmp/qa_form_fail.py` TRANSMITTED REAL LEADS: the root
`.env` has live FORMSPREE_ENDPOINT and SHEET_ENDPOINT, the dev server loads `.env`, so
`leads.submit` took its live branches and emailed Aviva + appended to the Sheet. 2
confirmed (qa_form_fail, run twice: the form was replaced by the thank-you state, which
only happens on ok:true), 1 likely (qa_form success branch). ATTIO_API_KEY is empty so
Attio was skipped. Absence of `[leads]` lines in the dev log is NOT evidence against it,
that path only logs on failure. User informed; up to 3 Sheet records to delete.
BOTH SCRIPTS ARE NOW GUARDED, approved by the user:
- `qa_form_fail.py` aborts `**/api/rpc/**` for `leads/submit` in the browser. That IS the
  dead-endpoint condition it was testing, and it never reaches the server.
- `qa_form.py` fills the honeypot `#cf-trap`, so the server's own first branch returns
  {ok:true, sinks:all-skipped}: the thank-you UI runs through real app code, transmitting
  nothing.
Consequence: the sinks are unproven from the sandbox and always were. Confirmed plan is
ONE real submission at go-live, then delete the test record.

## AD-HOC: BALTIC ELECTRICAL NAMED AND LINKED (after V1.2 section 14)

STANDING FACT CHANGED. The old rule was: electrical is a "trusted, licensed and insured
electrical partner" and the partner is NEVER named. The user has now cleared Baltic
Electrical to be named and linked. Supersedes the earlier never-name rule.
The Lutron / Somfy / Blindspace embargo is UNCHANGED and still in force.

New `components/partner.tsx` exports `BALTIC_URL` and `<BalticLink />`. It exists so the
href, target and rel can never drift between mentions: every "Baltic Electrical" on the
site is the same link, `https://balticelectrical.com/`, `target="_blank" rel="noopener"`,
with the business name itself as the link text. The file carries the Lutron/Somfy/
Blindspace guardrail as a comment so nobody adds a component for them later.

`FaqEntry.a` was already typed `React.ReactNode`, so FAQ answers took the link directly.
`faq.tsx` did NOT need changing.

FIVE mentions, all four requested locations:
- index.tsx:159  homepage FAQ "do I need to hire my own electrician?" (string -> JSX)
- index.tsx:455  One Roof / One Team paragraph
- index.tsx:526  For Designers, the "projects don't stall" bullet
- motorized.tsx  FAQ "Do I need to hire my own electrician?" (string -> JSX)
- motorized.tsx  the "Motorized shades need power. We handle that." wiring block

Framing preserved everywhere: we coordinate it, scheduled and managed by us, one point of
contact, the client never has to find or schedule an electrician. Only the attribution is
new. Adopted the user's "licensed, insured" phrasing over the old "trusted, licensed and
insured", so the old string is gone sitewide (asserted).

NOT DONE, FLAGGED: the Motorized hero support copy was requested but has NO electrical
reference to attribute, and neither do its three cards. Naming Baltic there would mean
inventing a new electrical claim in a paragraph about ease and cord-free safety, not
attributing an existing one. Left alone pending the user's call.

ALSO FLAGGED, three further electrical references the user's list did not enumerate:
founder.tsx:69, blackout.tsx:153, and index.tsx:51 (the motorized service-card body).
Left unnamed to avoid naming the partner 8 times unrequested.

VERIFICATION
- `/tmp/balticqa.py` OVERALL PASS 18/18 on /index.html and /motorized.html: every mention
  linked with zero bare names, correct href, `_blank`, `noopener`, the link present inside
  a real FAQ answer (every accordion opened first), the never-schedule framing intact, the
  old unnamed phrasing gone, no page errors.
- First run reported 2 of 3 on index. That was the DEV SERVER SERVING A STALE MODULE
  (lesson 1), not a missing edit: source had all 3 and dist had 3 mentions + 3 anchors.
  Fixed by the documented kill/rm .vite/restart cure, then 18/18.
- Brand guardrail re-audited: dist has ZERO Lutron/Somfy/Blindspace. Source has only
  comments (estimate-engine.ts:9,62 pre-existing, plus the new guardrail comment in
  partner.tsx), all stripped at build.
- Em dashes in RENDERED copy across all 8 dist routes: ZERO (scan strips style+script,
  then tags). The remaining source hits are all code comments.

## V1.2 SECTION 15: FAQ ACCORDION (CSS TRANSITION, NO STAGED ENTRANCE, NO-JS SAFE)

Brief (line 225): keep the accordion structure and all approved answers. Use CSS
for the open/close transition unless GSAP is already loaded nearby. No staged
entrance across every FAQ item. Answers available to AT. Preserve keyboard
operation and correct aria-expanded/panel relationships. Content accessible if
animation is disabled.

### Three defects found, all three fixed

1. **The transition was JS, not CSS.** `FaqItem.toggle()` used the Web Animations
   API: measure `from`, set `height:auto`, measure `to`, restore, then
   `panel.animate([...], 320ms)` with an `onfinish` writing `height:auto`/`0px`.
   GSAP is not loaded anywhere near the FAQ, so the brief's exemption did not
   apply. Replaced with a pure CSS `grid-template-rows: 1fr <-> 0fr` transition
   driven by a `data-open` attribute. No JS measuring survives.

2. **Staged entrance.** The container carried `data-reveal-group` and every
   `.faq-item` carried its own `data-reveal` — literally the banned pattern.
   Collapsed to a single `data-reveal` on a new `.faq-list` container, children
   bare. Same move as sections 12, 13 and 14. Measured: index reveal count
   49 -> 44 (six item reveals plus the group become one).

3. **`style={{ height: 0 }}` was baked into the prerendered HTML**, so with no JS
   or a failed chunk every answer shipped clipped to zero height and invisible.
   The build-time prerender guard never caught it because it only inspects
   inline `opacity: 0`. This broke both the brief's "accessible if animation is
   disabled" bullet and the site's standing motion contract.

### The approach: invert the default

CSS default is now **open** (`grid-template-rows: 1fr`); the collapsed state is
applied at runtime by JS. `FaqItem` holds `ready` (set in a mount `useEffect`)
and `open`; `expanded = ready ? open : true`. So the first render — which is what
the prerenderer and any no-JS visitor see — is fully expanded, and panels only
collapse once the button is genuinely operable. This is the same contract the
reveal system already uses: the hidden state is never authored in CSS.

Removed the JS reduced-motion branch entirely. It is no longer needed: the global
reduced-motion block zeroes `transition-duration`, so the accordion becomes an
instant toggle for free. Collapsing is function, not motion, so reduced-motion
users keep a working accordion.

### THE PRERENDERER DEFEATED THE INVERSION ON THE FIRST TRY

First build after the rewrite shipped `data-open="false"` in `dist/index.html`.
Cause: **the prerenderer is a real browser.** It runs JS, so the mount effect
fired and collapsed every panel *before* the snapshot was taken. Any state JS
applies gets baked. Removing the inline `height: 0` had simply moved the same
no-JS defect from an inline style to an attribute, and the guard still missed it.

Fix in `packages/web/vite/prerender.py` (not a `__` file, editable):

- **`open_disclosures(html)`** rewrites `<section class="faq-a" ... data-open="false">`
  to `"true"` and flips `aria-expanded="false"` to `"true"` on
  `<button class="faq-q">`, so the announced state never contradicts what is on
  screen pre-hydration. Only those two tag types are touched; the inlined
  stylesheet contains no `<section>`/`<button>` tags so it is unaffected. Runs
  **before** `unblock_paint()`.
- **`collapsed_panels(html)`** counts `.faq-a` sections still not `data-open="true"`
  after normalization and appends to `failures`, which **fails the build**. The
  defect cannot silently return.

React re-collapses on hydration, so this only changes the pre-hydration and no-JS
renders. With JS off, all answers show open and the buttons are inert — the same
state V1 shipped, and honest.

### CSS (styles.css, the `.faq-a` block ~line 889)

```
.faq-a { display: grid; grid-template-rows: 1fr; overflow: hidden;
         transition: grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1); }
.faq-a[data-open="false"] { grid-template-rows: 0fr; visibility: hidden;
         transition: grid-template-rows 0.32s cubic-bezier(...),
                     visibility 0s linear 0.32s; }
.faq-a > div { min-height: 0; overflow: hidden; }
.faq-a p { margin: 0; padding-bottom: 24px; ... }
```

`visibility: hidden` on the closed panel, delayed out by 0.32s so it does not
kill the closing tween, removes collapsed answers from the a11y tree and stops
the Baltic Electrical link inside answer 3 from being tab-reachable while
hidden. `aria-expanded="false"` is what tells AT the content exists.

**A 24px floor bug cost one full QA cycle.** Collapsed panels measured
`height: 24px`, not 0, in every mode. `min-height: 0` on the grid item zeroes its
*content box*, but the item's `padding-bottom: 24px` still counts toward the
row's automatic minimum size, so `0fr` could never reach zero. Fix: give the item
`overflow: hidden` (which resolves the automatic minimum to 0) and move the
spacing inward onto `.faq-a p` as `padding-bottom`. Open-state appearance is
unchanged.

### Browser support, stated honestly

`grid-template-rows: 0fr <-> 1fr` interpolation needs Chrome 107+, Firefox 120+,
Safari 16.4+. Older browsers get an instant open/close with no tween, which still
satisfies every accessibility and keyboard requirement. Flagged to the user.

### Verification: `/tmp/faqqa.py` OVERALL PASS 642/642

New script. 1440/1180/390/360 x {no-preference, reduce} x **both routes that
render `<Faq>`** (`/index.html` 6 entries and `/motorized.html` 4 — the FAQ is
not homepage-only). Uses a settle poll on `.faq-list` opacity, not a fixed sleep
(lesson 9). Per mode: every answer non-empty; `aria-controls` == panel id;
`aria-labelledby` == button id; starts collapsed with height < 1px and
`visibility: hidden`; click opens (height > 20, visible, `data-open="true"`) and
does not open siblings; click closes; **Enter** opens and closes; **Space** opens
and closes; every panel opened at once stays readable; exactly one `data-reveal`
on the container and zero inside; no `data-reveal-group`; no page errors.

Dist / no-JS proof on both routes: every answer's text present in the built HTML;
panel count matches; every panel `data-open="true"`; no inline height on any
panel.

Answer copy is untouched **by construction** — `git diff --stat` for this section
is `faq.tsx`, `styles.css`, `prerender.py` only. `FAQS` in `index.tsx` and the
motorized entries were never opened.

### Regression suite after the change, all clean

`bun run lint` 0 violations; `/tmp/probe11.py` renders (6 faq panel ids present);
`bun run build` passes including the new prerender guard, 8 routes;
`/tmp/flashprobe.py` no flash on any route (`flashMs: null`);
`/tmp/motionqa.py` `stuck=0` / `initLeft=0` everywhere, including reduced motion
and the GSAP-chunk-blocked run; `/tmp/fastscroll.py` TOTAL BROKEN 0;
`/tmp/overflow360.py` 0 overflow on all routes.

### Lesson repeats

- **Lesson 1, seventh instance.** The first QA run's 96 failures ("collapsed
  panel not visible, vis=visible") were the dev server serving stale CSS: source
  and built CSS both had `data-open`, the served stylesheet had none. Documented
  cure applied. Note also that `curl`ing `/src/web/styles.css` is an
  **unreliable** way to introspect dev CSS — it disagreed with itself between
  checks. Trust the built CSS plus computed styles in a real browser instead.
- **Lesson 7 again.** Both real defects (prerender baking, 24px floor) were
  invisible to reasoning and only appeared under measurement.

## V1.2 SECTION 16: FOOTER (ONE DUPLICATED CONVERSION PARAGRAPH REMOVED)

Brief (line 239): keep the wordmark treatment, the brand line about good window
treatments, the Aviva signature, real phone and email, the South Florida service
area, the response-time statement and the privacy link. Remove one of the
repeated conversion paragraphs so the footer does not repeat the contact
section. Keep it warm, concise, personal. Keep the cream typographic wordmark on
dark; do not recolor the color logo.

### What was removed, and why that one

`SiteFooter` in `components/site-chrome.tsx` had exactly one conversion
paragraph, inside `.f-say`:

> "If you are still weighing options, start with a conversation. Thirty minutes,
> no obligation, and you will come away knowing what your windows actually
> need."

That is the contact section's pitch restated almost word for word. The contact
block already promises the thirty-minute call, "no obligation", and (since
section 14) "You'll leave the first meeting knowing exactly what's possible,
whether or not you work with us." Deleted; replaced by a JSX comment recording
what stood there.

`.f-say` now holds just the quiet `Begin a conversation` link (`href="#contact"`)
followed by the Aviva signature, so the footer signs off instead of selling the
same call twice. **Nothing else was touched** - every "keep" item in the brief
is still in place and asserted by QA.

Scope check before editing: `SiteFooter` is used by **`index.tsx` only**, and
`index.tsx` is the only page carrying `id="contact"`, so the `#contact` anchor
cannot dangle. `LandingFooter` and `ThinFooter` were not touched.

CSS: one rule added after `footer.site .f-begin:hover` -
`footer.site .f-say .f-begin:first-child { margin-top: 0; }`. The link's 12px top
offset existed only to clear the deleted paragraph. The JSX comment is not an
element, so `:first-child` still matches.

### Verification: `/tmp/footerqa.py` OVERALL PASS 97/97

New script. 1440/1180/390/360 plus a built-HTML pass. Per viewport: wordmark is
the text "Studio Elpa" and **not** a bitmap (zero `<img>` in the footer, so the
cream typographic treatment on dark still stands); brand line verbatim;
signature verbatim; phone text `(561) 836-0026` behind a `tel:` href; email text
`aviva@studioelpa.com` behind the matching `mailto:`; "Serving South Florida.";
"We reply within one business day."; privacy link resolves to exactly
`/privacy.html`; all three distinctive fragments of the deleted paragraph absent;
`.f-say` contains no paragraph other than the signature; exactly one `.f-begin`;
child order is link then signature; no em dash; no page errors.

Contrast solved against the measured footer background, not assumed: wordmark and
brand line both clear AA. Built-HTML pass repeats every assertion against
`dist/index.html` so the prerendered footer is proven too.

### One measurement that looks alarming and is not

`/tmp/probe11.py` body text length fell 12031 -> 10308 across sections 15 and 16.
Only ~160 characters of copy were deleted. The rest is **lesson 18**: `innerText`
excludes text hidden by `visibility: hidden`, so once the section 15 CSS actually
reached the browser the collapsed FAQ answers stopped counting. `/tmp/faqqa.py`
proves those answers are present in the DOM and readable when opened, and the
dist pass proves they ship in the static HTML. Not a copy loss.

### Regression suite

`bun run lint` 0 violations; `/tmp/probe11.py` renders; `bun run build` passes
including the section 15 prerender guard, 8 routes written.

---

## WARM EDITORIAL TYPOGRAPHY, STAGE A: SELF-HOSTED FONTS

Newsreader replaces Cormorant Garamond and Instrument Sans replaces Jost,
sitewide. This supersedes the V1 and V1.2 instruction to preserve the existing
typography direction, and supersedes V1 locked decision 5 for the footer
wordmark. The user approved all three named consequences: FAQ questions move to
the sans, the footer wordmark becomes Newsreader, and CTA letter-spacing comes
down.

### Payload, measured not assumed

Before, the latin subsets Google actually served for the eight declared faces:

| face | bytes |
|---|---|
| Cormorant Garamond 400 / 500 / 600 | 37640 each |
| Cormorant Garamond 400 italic | 23660 |
| Jost 300 / 400 / 500 / 600 | 26576 each |
| **total** | **242884 (237.2 kB)** |

All 32 subset files together would have been 659.2 kB, but only the latin slice
is ever fetched for this site.

After, three self-hosted files:

| file | axes | bytes |
|---|---|---|
| newsreader-var-latin.woff2 | wght 400-500, opsz pinned 24 | 37712 |
| newsreader-italic-latin.woff2 | wght 400, opsz pinned 18, static | 22860 |
| instrument-sans-var-latin.woff2 | wght 400-600, wdth pinned 100 | 27156 |
| **total** | | **87728 (85.7 kB)** |

**64% smaller, and no third-party request at all.**

### Why variable fonts, and why opsz is pinned

Both families come back from the upstream API as variable fonts, so the honest
self-hosted set is three files rather than the six faces the brief lists. Live
weight ranges are what prevent synthetic bold: a request for 500 or 600 lands on
a real instance instead of being smeared by the browser.

The `opsz` axis is what costs bytes. Keeping it live cost 86.2 kB for the
Newsreader roman alone; pinning it took the same file to 36.8 kB. Pinned at 24
for the roman because Newsreader here is display type (hero, section headings,
titles), and at 18 for the italic because italics run at text sizes.

Newsreader keeps wght 400-500 rather than 400 alone, which costs about 15 kB,
because the stylesheet declares `font-weight: 500` on serif in roughly ten
places including the global `h1-h4` rule. The brief's "500 only if visually
necessary" is satisfied by tuning individual rules, not by dropping the range
and letting the browser clamp.

### Four real defects the QA found

1. `.nav-cta` asked for **700**. Instrument Sans is hosted at 400-600, so that
   was a synthetic bold on every page's header CTA. Now 600, the brief's button
   weight.
2. `.wordmark` asked for **600** against a 400-500 Newsreader. Also synthetic.
   Now 500.
3. `<em>` in body copy inherited the sans, which has **no italic face**, so
   emphasis was being slanted synthetically. Now Newsreader Italic 400 with a
   1.04em bump to compensate for the smaller x-height. This is what the brief
   wants anyway: italics as an editorial moment.
4. `.page-article .footnote` was itself italic in the sans. Same synthetic
   slant. Now Newsreader Italic 400 at 15.5px, keeping the italic intent.

### The arrow glyphs

`/tmp/glyphqa.py` compares every character the eight built routes render against
each font's cmap. It found the site renders U+2190 and U+2192 in seven places
("← Back to site", "Read the story →", and four more).

**Newsreader has no arrow glyphs at all** - not in Google's latin slice, not in
the upstream full 564-glyph TTF. Instrument Sans does. All seven arrows were
measured to render in sans context, so the sans is the face that must carry
them, and two things were needed:

- the file rebuilt from the **upstream full TTF** rather than Google's latin
  slice, subset to latin plus U+2190-2193. Built lean (`--no-hinting`,
  `--desubroutinize`, explicit layout features) it came out at 27.2 kB, which is
  *smaller* than Google's 28.3 kB slice while carrying four glyphs more.
- the declared `unicode-range` widened to admit U+2190-2193. Without that the
  browser gates the file out for those characters no matter what it contains.

Belt and braces, `--serif` now lists `"Instrument Sans"` before Georgia, so
anything Newsreader cannot draw falls through to a face that is still
self-hosted rather than to whatever the OS supplies.

### Google Fonts removed

Three `<link>`s deleted from `index.html`: two preconnects and the stylesheet.
Replaced by a single `rel=preload as=font crossorigin` for
`newsreader-var-latin.woff2`, the file the hero headline needs, per the brief's
"preload only the Newsreader file needed by the hero heading".

`prerender.py`'s `unblock_paint()` lost its second branch entirely. That branch
existed to de-block the third-party font stylesheet with a `rel=preload` plus
`onload` swap, worth about 760 ms of hero stall. There is no external font
request left to de-block. Branch 1, inlining the built stylesheet, is untouched,
and the `@font-face` blocks now ride along inside that inlined CSS.

### Verification

- `bun run lint` 0 violations, `bun run build` passes, 8 routes prerendered.
- `/tmp/probe11.py` body text length **10308, identical to the section 16
  baseline**, so no copy moved.
- `/tmp/fontqa.py` **85 PASS 0 FAIL** across all 8 routes against the gzipped
  prerendered dist on 4310: no third-party font request, every `/fonts/*.woff2`
  200 with `font/woff2`, all three faces declared and the two roman faces
  loaded, no synthetic bold or italic anywhere, no page or console errors.
- `/tmp/glyphqa.py` Instrument Sans covers all 80 rendered characters.
- Zero `fonts.googleapis` or `fonts.gstatic` strings in built html, css or js.

`"ID Grotesk Trial"` shows up once per route in the family census. That is the
template's "Made with Runable" badge, not site copy. Left alone.

---

## WARM EDITORIAL TYPOGRAPHY, STAGE B: TYPE ASSIGNMENTS

Brief sections 2, 3 and 4, plus the two remaining approved consequences (FAQ
questions to the sans, CTA letter-spacing reduced). Two files touched:
`styles.css` and `pages/estimate.tsx`. 88 insertions, 11 deletions.

### The weight ranking was inverted, and that was the main event

The global `h1, h2, h3, h4` rule set `font-weight: 500`. The brief asks for
Regular 400 on the hero and on major headings, with 500 reserved for "smaller
headings only where Regular lacks sufficient clarity". The old global made every
heading medium by default, which is the opposite ranking, so the global flipped
to 400.

This is what justifies keeping Newsreader's live 400-500 weight range from stage
A rather than shipping 400 alone. 500 is now restated deliberately in five
places, every one of them a real "clarity" case rather than a default:

| rule | why 500 |
|---|---|
| `.page-lp .hero h1` | reversed on a dark ground |
| `.callout h2` | reversed on a dark ground |
| `.collection h3` | small serif, dark band; inherited by `.manifesto .collection h3` at 21px |
| `.svc-item h4` | 19px, the smallest serif heading on the site |
| `.wordmark`, `.step-row .n`, `.project-head h3`, estimate h1/h2, `.reco h4` | already restated 500 before stage B, unchanged |

Everything else that previously rode the global now renders Regular 400:
`h2.big`, `.svc-feature-text h3`, `.svc .card h3`, `.step-row h3`, `.post h3`,
`.contact-side h3`, `.page-article` h1/h2/h4, `.page-privacy` h1/h2, and the
home hero.

### Line-height bands and headline tracking

The inherited 1.15 was applied to everything. It is correct only for the
brief's "smaller serif headings" band (1.15-1.25), so it stays as the default
and the larger tiers restate their own:

| tier | brief band | applied |
|---|---|---|
| home hero `h1` | 0.98-1.04 | **1.0**, tracking **-0.02em** |
| `.page-lp .hero h1` | 0.98-1.04 | **1.02**, tracking -0.02em |
| `.page-article h1` | - | kept 1.1, added tracking -0.02em |
| `h2.big`, `.callout h2` | 1.05-1.12 | **1.08**, tracking -0.015em |
| `.svc-feature-text h3` (38px) | 1.05-1.12 | **1.1**, tracking -0.015em |
| everything smaller | 1.15-1.25 | inherited 1.15 |
| body | 1.65-1.75 | unchanged at 1.75 |

Tracking starts at the brief's suggested -0.02em on the hero and eases to
-0.015em on the section tier, which runs at roughly two thirds the size and
does not need the same correction.

**The tighter hero leading pulled the hero shorter, not taller.** Desktop
1440: **1013px -> 980px, down 3.3%.** Section 6 only requires that it must not
become substantially taller, so this is the right direction.

### FAQ questions moved to Instrument Sans

`.faq-q` was `var(--serif)` 500 at 22.5px. It is now `var(--sans)` 500 at
**19.5px**, line-height 1.4, tracking -0.005em. Two reasons for the size drop:
Instrument Sans reads appreciably larger than Newsreader at the same nominal
size, so 19.5px holds the previous optical weight; and 22.5px of sans in a
button would have out-shouted the serif headings around it. This is the second
deliberate size change of the overhaul, after stage A's `.footnote`.

The family census confirms the swap was surgical: index went from 138 sans / 61
serif to **144 sans / 55 serif**. Six elements crossed, which is exactly the six
FAQ questions, and nothing else moved.

### CTA letter-spacing reduced

The brief calls the current CTA tracking too heavy. Instrument Sans also
carries wider sidebearings than Jost did, so the same nominal value reads looser
than it used to.

| rule | before | after |
|---|---|---|
| `.btn` | 0.13em | **0.10em** |
| `.nav-cta` | 0.14em | **0.11em** |
| `.page-estimate .btn` | 0.2em, the heaviest control on the site | **0.13em** |

Only tracking moved. All padding is untouched, so V1.2 section 3's button
height is preserved and only the button width narrows. Measured `.btn` height
is now 47.625px, not the 49.625px recorded in V1.2 - that 2px came from
stage A's font metrics change, not from this tracking edit. Still well above
the 44px tap target.

Eyebrows were left alone. `.kicker` at 0.3em and `.svc-more-head h3` at 0.24em
are wide, but the brief only calls out CTA tracking as excessive, and wide
eyebrows are part of the editorial voice.

### One utility-text fix

`estimate.tsx` had a bare `<i>` with an inline `fontSize: 13` for the drapery
assumption note. Stage A's `em, i, cite` rule correctly pulled it out of the
sans, which has no italic face and was slanting it synthetically, but that left
it as 13px Newsreader Italic. The brief puts utility text in Instrument Sans
and keeps Newsreader away from small interface text, so it is now
`.assume-note`: sans, upright, 14px, `--ink-soft`. The inline font size is gone
with it.

The remaining inline type styles are four `fontWeight: 500` spans in
`estimate.tsx` (sans, a real instance) and one `fontSize: 14` utility line in
`index.tsx`. Both fine.

### Verification

- `bun run lint` 0 violations. `bun run build` passes, 8 routes prerendered,
  both prerender guards still pass.
- `/tmp/probe11.py` body text **10308, byte-identical to baseline** - no copy
  moved.
- `/tmp/fontqa.py` **85 PASS 0 FAIL**. The weight changes introduced no
  synthetic faces; every computed weight is inside what the hosted files supply.
- `/tmp/faqqa.py` **642/642** after the family swap.
- `/tmp/footerqa.py` **97/97**, wordmark unaffected.
- `/tmp/glyphqa.py` Instrument Sans covers all 80 rendered characters.
- `/tmp/navwrap.py` no navigation label wraps; all 1 line at 1200px and above,
  drawer collapses below 1025px as before.
- `/tmp/overflow360.py` zero horizontal overflow on all 8 routes at 360px.
- `/tmp/h1flash.py` ALL PASS - the hero heading never dips below opacity 1 on
  desktop or mobile, so self-hosted font loading does not delay it.
- `/tmp/flashprobe.py` no reveal flashes, every final opacity 1.
- `/tmp/motionqa.py` no stuck reveals on any route, reduced motion and
  GSAP-blocked fallbacks both still render everything.
- `/tmp/fastscroll.py` **TOTAL BROKEN: 0** across all six scenarios.
- Journal card rules verified untouched by grep, so the 4.98:1 tag contrast and
  10.10:1 title contrast are unchanged. `.post h3` now inherits 400, which
  changes perceived weight but not the measured ratio.

---

## WARM EDITORIAL TYPOGRAPHY, STAGE C: THE SEVEN-WIDTH RESPONSIVE REVIEW

Brief section 6. Reviewed 1440, 1280, 1180, 1024, 768, 390 and 360 across
`/index.html`, `/estimate.html` and `/journal-blackout.html` against the ten
checks the section lists, using a new `/tmp/respqa.py` driven at the gzipped
production `dist` on port 4310.

### The first run said 58 failures. Fifty-six were the script, not the site.

Two measurement bugs, both proven wrong by `/tmp/verifyfail.py` before anything
was edited:

1. **"header phone runs 3 lines", once per width.** The phone is
   `<a class="header-phone">` wrapping an inline `<svg>` plus a `<span>`.
   `Range.getClientRects()` over the whole element returns a rect for the SVG
   *and* two overlapping rects for the same text run, so rounding their tops
   produced three distinct values. A text-node-only TreeWalker returns exactly
   one rect: 110.53px wide at 1440, 102.91px at 390. The phone number has
   always been one clear line. `lines()` now walks text nodes and merges rects
   by line-box centre.
2. **"form type below 15px", 49 instances.** Every one was a field `LABEL` at
   13.5px, uppercase, 0.08em tracking, Instrument Sans, `--ink-soft`. Those are
   the brief's "small uppercase labels", which it explicitly allows to run
   smaller. The editable controls measure **18px**, comfortably past the 16px
   iOS focus-zoom threshold. The check now holds `input`/`textarea`/`select` to
   16px and labels to a 12px legibility floor.

Eleventh time a QA script has lied before the site did. Verify the script.

### Two real defects, both fixed

**Hero descenders at 390 and 360.** At 43px with `line-height: 1.0` the ink
below the baseline needed 12px and the line box gave 11px. Nothing was actually
clipped - the overflow-ancestor probe came back null - but the `g` in "light"
pressed against the cap line of the sentence below, which is what the brief
means by cropped punctuation and descenders. Mobile hero leading is now
**1.04**, still inside the brief's 0.98-1.04 hero band, scoped to
`max-width: 560px` so the desktop hero keeps the 1.0 that measured well in
stage B.

Cost: the mobile hero grew **781 -> 788px at 390** and **764 -> 771px at 360**,
7px, under 1%. Section 6 only asks that the hero not become substantially
taller, and it is still shorter than the 1013px it was before stage B.

**Orphaned last lines at 390 and 360.** The section heading "A few rooms we're
proud of." broke with "of." alone on a final line at 9-10% of the column.

The handover had this pinned on `.project-head h3`. Measurement says otherwise:
the element is **`h2.big.center`**. Balance was applied to the wrong selector
first, measured, found ineffective, and reverted. `text-wrap: balance` now sits
on **`h2.big`**, which is every major section heading on every page, and on
`.page-home .hero h1 .hline` inside the mobile block so the two hero sentences
balance rather than dropping "too." alone.

### Result

`/tmp/respqa.py` **PASS 826, FAIL 0**, no judgement notes left.

| width | hero h | h1 fs / line-height / tracking / weight | h1 lines | CLS |
|---|---|---|---|---|
| 1440 | 980 | 72.5 / 72.5px / -1.45px / 400 | 3 | 0.0012 |
| 1280 | 980 | 72.5 / 72.5px / -1.45px / 400 | 3 | 0.0000 |
| 1180 | 980 | 72.5 / 72.5px / -1.45px / 400 | 3 | 0.0003 |
| 1024 | 902 | 69.43 / 69.43px / -1.389px / 400 | 2 | 0.0004 |
| 768 | 780 | 52.07 / 52.07px / -1.041px / 400 | 2 | 0.0000 |
| 390 | 788 | 43 / 44.72px / -0.86px / 400 | 4 | 0.0001 |
| 360 | 771 | 43 / 44.72px / -0.86px / 400 | 4 | 0.0015 |

**CLS is 0.0000-0.0015 at every width**, against a 0.014 baseline and a 0.02
gate. Section 7's "no noticeable CLS from font loading" is satisfied and
measured, not assumed - the single preloaded roman file and the matched
fallback metrics do their job. Zero horizontal overflow anywhere. No nav label
wraps. Headings clear of clipping at all seven widths.

### Verification

- `bun run lint` 0 violations. `bun run build` passes, 8 routes prerendered,
  both prerender guards pass.
- `/tmp/probe11.py` body text **10308**, unchanged. No copy moved.
- `/tmp/fontqa.py` **85 PASS 0 FAIL**. `/tmp/glyphqa.py` Instrument Sans covers
  all 80 rendered characters.
- `/tmp/h1flash.py` ALL PASS. `/tmp/flashprobe.py` no flashes.
  `/tmp/motionqa.py` no stuck reveals. `/tmp/fastscroll.py` TOTAL BROKEN: 0.
- `/tmp/overflow360.py` zero overflow on all 8 routes. `/tmp/parasize.py`
  body copy still uniform.

---

## §7 PERFORMANCE AND QA, PLUS THE V1 LOCK-DOWN PASS

Closes the typography brief's §7 (line 195) and V1.2's §17 (line 255). No site
code changed in this step. Four documents were rewritten: `design.md`,
`README.md`, `QA-NOTE.md` and this file.

### Lighthouse mobile, re-measured on the prerendered + gzipped dist

`/tmp/lh-typography.json`, served by `/tmp/gzserve.py` on port 4310.

| metric | before fonts (V1.2) | now |
|---|---|---|
| Performance | 71 | **78** |
| FCP | 2.2 s | **2.0 s** |
| LCP | 6.0 s | **5.3 s** |
| TBT | 250 ms | **70 ms** |
| CLS | 0.014 | **0** |
| Speed Index | 2.4 s | 2.6 s |
| A11y / Best Practices / SEO | 100 / 100 / 100 | **100 / 100 / 100** |

Full progression, mobile: 54 client-rendered uncompressed → 55 prerender →
63 + gzip → 63 + inline CSS + async fonts → 64 + hero srcset → 71 + motion
refactor → **78 + self-hosted typography**.

Self-hosting won *even though* it forfeited the `unblock_paint()` async-font
trick worth ~760 ms of hero stall. LCP is still gated on the 575 kB main chunk
parse, so the brief's 90+ goal remains unmet. Reported honestly.

### §7 checklist

- All three `/fonts/*.woff2` return `200 font/woff2` at 37712 / 22860 / 27156.
- No external font request anywhere: `/tmp/fontqa.py` 85 PASS 0 FAIL.
- `font-display: swap` present 3× in source, 3× in the built CSS.
- No page or console errors on any of the 9 routes (`/tmp/qa.py`).
- No missing glyphs, no synthetic bold, no synthetic italic.
- CLS 0.0000–0.0015 across all 7 widths; Lighthouse reports 0.
- Prerender and hydration preserved: 8 routes, both build guards pass.
- Hero heading never delayed: `/tmp/h1flash.py` ALL PASS.

### Lock-down battery, all green in one sitting

`bun run lint` 0 · `bun run build` passes · `probe11` body text 10308 unchanged ·
`respqa` 826/0 · `fontqa` 85/0 · `glyphqa` all 80 covered · `faqqa` 642/642 ·
`footerqa` 97/97 · `contactqa` 171/0 · `balticqa` 18/0 · `journalqa` 258/0 ·
`collqa` 174/0 · `tradeqa` OVERALL PASS · `cmpqa` 80/80 · `cmp390` CLS 0.00000 ·
`menuqa` 5/5 · `qa_a11y` faded=0 everywhere · `qa_copy` clean · `qa_booking`
10 CTAs 0 misconfigured · `qa2` 14 images 0 broken · `qa_wizard` full walk ·
`h1flash` / `flashprobe` / `motionqa` clean · `fastscroll` 0 broken ·
`overflow360` 0 · `parasize` uniform 18.5px · `processqa` anchor clears header ·
brand-name audit clean in dist · 0 em dashes in rendered copy across 8 routes ·
`.env` byte-identical to `/tmp/.env.studioelpa.bak`.

### V1.2 §2's last open item is now CLOSED

`/tmp/scrollspy.py` is new. The thin active-section indicator still works after
the GSAP motion refactor: PASS 5 / FAIL 0. It has no DOM node, so the script
reads `getComputedStyle(el, '::after')` — 1px high, `rgb(109, 114, 4)`
(`--accent`), opacity 1, width tracking each label. Nav links are
`#about`, `#services`, `#process`, `#designers`, `#contact`, plus `#projects`.

One honest nit, noted not chased: scrolled back to the very top, `#about` stays
active because there is no `#home` nav link to hand the state back to.

### tradeqa.py had a stale expectation — script fixed, site untouched

`FAIL copy verbatim` at all 5 modes. `/tmp/tradediff.py` (new) diffed rendered
against expected: row index 2 legitimately gained the Baltic Electrical naming
in the approved commit `22d2fad`. `EXPECTED` updated → OVERALL PASS. **Twelfth
time a QA script lied before the site did.**

### qa.py's "broken_images" is a lazy-load artifact, not a defect

The six `art-*.jpg` on `/` and two `ba-*.jpg` on `/drapery.html` all serve 200
with full bytes (curl-verified: 272442, 354620, 286471, 264038, 367671, 194993,
193411, 188457) and all exist on disk. They are `loading="lazy"` and were never
scrolled into view, so `naturalWidth` was 0 at check time.

### A lead-transmission near-miss, investigated and guarded

`qa_wizard.py` had no guard and the wizard auto-submits on reaching step 6 (it
printed "Sending your request…"). **No lead was transmitted:** `ps aux` and
`ss -ltnp` show only Vite listening on 4200, there is no Hono API process and no
`/api` proxy in `packages/web/vite.config.ts`, so the POST hit the SPA fallback
and died in the sandbox. Formspree/Sheet forwarding lives in the backend handler,
which never executed.

`/tmp/qa_wizard.py` is now guarded with the same
`page.route("**/api/rpc/**", _block_leads)` abort used in `qa_form_fail.py`,
installed immediately before the `page.goto(.../estimate.html)` line. Re-run
confirms `[guard] blocked lead submit`. The resulting
`net::ERR_FAILED` console line is that abort, not a site defect. **Never remove
the guard.** Lesson: before believing a QA script transmitted something, check
what is actually listening.

### Screenshots

`/tmp/screens.py` is new. Ten PNGs at `device_scale_factor=2` into
`/home/user/screens-typography/`. It walks the whole page first to settle every
reveal, then does `scrollIntoView` + `page.screenshot(clip=box)` per section
(never `locator.screenshot()`, per the `.hero-frame` timeout lesson).

Actual file dimensions, from `identify` (CSS px is half of each, since the clips
were captured at `device_scale_factor=2`):

| file | pixels | CSS px |
|---|---|---|
| `hero-desktop.png` | 2880x1630 | 1440x815 |
| `service-desktop.png` | 2880x1616 | 1440x808 |
| `process-desktop.png` | 2880x1616 | 1440x808 |
| `contact-desktop.png` | 2880x1616 | 1440x808 |
| `footer-desktop.png` | 2880x1096 | 1440x548 |
| `hero-mobile390.png` | 780x1542 | 390x771 |
| `service-mobile390.png` | 780x1526 | 390x763 |
| `process-mobile390.png` | 780x1526 | 390x763 |
| `contact-mobile390.png` | 780x1520 | 390x760 |
| `footer-mobile390.png` | 780x1620 | 390x810 |

All ten were eyeballed via two `montage` contact sheets. Correct in every frame:
Newsreader 400 headings, Instrument Sans body and CTAs, olive `--accent` buttons,
the footer wordmark rendered as live Newsreader 500 text, no synthetic weights, no
clipped descenders, and the mobile hero wrapping to four balanced lines. The one
cosmetic nit visible is the known mismatched mobile hero CTA widths, deliberately
left unchanged.

Section clips start below the sticky header, so the header and logo are out of
frame by design. For header shots use `/tmp/hdrshot.py` or the existing
`/tmp/hdr-1440.png` / `/tmp/hdr-390.png`.

### Documentation rewrite

- **`design.md`** — the whole Typography section replaced with a "Warm Editorial"
  section (three files with axes and bytes, the 237.2 → 85.7 kB delta,
  `font-display: swap`, family roles, the 400-default / 500-exceptions ranking,
  the line-height bands, tracking values, the 18.5px body decision,
  `text-wrap: balance`, the arrow-glyph finding). The Cormorant wordmark line now
  reads Newsreader 500. Buttons records the real tracking values (0.10 / 0.11 /
  0.13em) and notes the 47.625px measured height. Motion rewritten for the V1.2
  §1 refactor: GSAP lazy and limited, CSS `IntersectionObserver` reveals, the
  removed hero stagger and photography parallax, the reduced-motion no-op trap.
- **`README.md`** — the cream Cormorant wordmark line fixed; bundle figure
  4.4 MB → 5.4 MB (5,449,864 bytes) with the largest files named; the file tree
  gained `fonts/`, `vite.config.ts`, `prerender-plugin.ts` and `prerender.py`;
  `use-motion.ts` re-described and `home-gsap.ts` added; the Motion contract
  rewritten to cover the runtime hidden state and the prerender guard that
  depends on it. Two new sections: **Fonts** (the three files, the payload delta,
  why `opsz` is pinned, the arrow-glyph / `unicode-range` trap, and the exact
  regeneration steps including `--break-system-packages brotli`) and
  **Prerendering** (the plugin, port 4311, the 8 routes, the two build guards,
  and the caveat that prerendering only affects the production build).
- **`QA-NOTE.md`** — §2's "Headings Cormorant, body Jost" row rewritten as
  superseded; bundle figure corrected; the Lighthouse open item rewritten as
  "78, not 90+, gated on the 575 kB chunk". Three new sections: **§6 V1.1**,
  **§7 V1.2** (the full battery table, the scroll-spy closure, the three
  script-defect findings, and both lead-transmission incidents disclosed in
  full) and **§8 the typography overhaul** (payload table, the four synthetic-face
  defects, glyph coverage, the Lighthouse table, the 7-width responsive table,
  every deliberate deviation, and the "nothing else moved" evidence).

================================================================================
§8 BALTIC ELECTRICAL NAMING AND LINKING PASS
================================================================================

User instruction: name and link Baltic Electrical consistently in EVERY
electrical reference, including the Motorized section copy and the remaining
unnamed mentions. Use "our licensed, insured electrical partner, Baltic
Electrical" linked to https://balticelectrical.com/ (new tab, rel="noopener").
It should read the same way everywhere, no unnamed references left.

This closes long-standing open items 30 and 31.

THE CANONICAL PHRASE, now identical in all eight places:
  "our licensed, insured electrical partner, Baltic Electrical"
always rendered through <BalticLink /> from components/partner.tsx, so the href,
target and rel can never drift between mentions.

SIX CODE EDITS
1. index.tsx SERVICE_SIGNATURE.body - converted from a plain string to a JSX
   fragment so it can carry <BalticLink />. Safe because SERVICE_SIGNATURE is a
   standalone object literal rendered once as <p>{SERVICE_SIGNATURE.body}</p>,
   NOT part of the mapped SERVICES_PRIMARY array.
2. index.tsx ONE ROOF dark band - "our licensed, insured partner" became "our
   licensed, insured electrical partner, <BalticLink />".
3. index.tsx §10 trade spec-list row 3 - bold label changed from "A licensed,
   insured electrical partner." to "Electrical, handled for you.", and the
   sentence now carries the canonical phrase. THE LABEL CHANGE IS REQUIRED:
   without it the bullet states the same credential twice in one sentence pair.
   This edits approved §10 copy - flagged to the user so they can overrule.
4. motorized.tsx section copy - "our licensed, insured partner" became the
   canonical phrase. THIS is the "Motorized section copy" the user meant.
5. blackout.tsx - new BalticLink import; the "Wiring handled for you" benefit
   list now names and links Baltic. This list sits in a DARK band.
6. founder.tsx - new BalticLink import; "a trusted, licensed and insured
   electrical partner" became the canonical phrase. Light .page-article ground.

Mentions went from 5 to 8. Verified with rg -n "BalticLink" on the pages dir:
index.tsx 56, 165 (FAQ), 461, 533; motorized.tsx 32 (FAQ), 129;
blackout.tsx 155; founder.tsx 70.

FOUR ELECTRICAL REFERENCES DELIBERATELY LEFT UNNAMED
Naming Baltic in any of these would be factually wrong, not consistent:
  a. The two FAQ QUESTIONS ("Do I need to hire my own electrician?"). Questions,
     not statements about who does the work. Their answers name Baltic.
  b. The descriptions of THE BAD ALTERNATIVE at other companies ("find your own
     electrician", "an electrician you have to find and schedule yourself").
     These describe someone else's electrician, by design.
  c. "you never have to find or coordinate an electrician" / "while a client
     hunts for an electrician". Same reason.
  d. index.tsx:120, the LIST OF THINGS WE MEASURE ("Sun exposure, ceiling
     height, window dimensions, furniture, electrical, safety").
Full rg -n -i "electric" audit re-run after the edits; reads exactly as intended.

THE MOTORIZED HERO SUPPORT COPY CONTAINS NO ELECTRICAL REFERENCE AT ALL
Verified by reading motorized.tsx:60-110. There was nothing there to attribute,
so the Motorized requirement is satisfied by the section-copy edit at line 128
instead. Stated plainly in the report so it does not read as a miss.

A REAL ACCESSIBILITY DEFECT THIS PASS FOUND AND FIXED
The handover assumed the dark-band mention would "inherit correctly" because the
ONE ROOF mention had been verified before. MEASUREMENT DISPROVED THAT (lesson 7
again: do not trust an assumption over a measurement). Two of the eight mentions
sit on the dark ink band rgb(57,41,27):
  - index.tsx ONE ROOF band
  - blackout.tsx benefit list
The olive --accent #6D7204 that links use on light grounds measures only 2.69:1
there, far below AA 4.5. There was NO dark-band link colour rule in styles.css
at all - only a .band.dark a:focus-visible rule - so the link simply inherited
the global olive.

FIX: <BalticLink /> gained a partner-link class, and a new rule at the very end
of styles.css renders it in --dark-kick (#C9A67E, 6.13:1) with an underline on
dark bands. The underline also gives the link a non-colour affordance against
the surrounding cream body copy. Scoped to .partner-link so buttons and other
links inside dark bands keep their own treatment. Placed last in the file so
source order cannot be beaten by an equal-specificity rule (lesson 6).

Candidate on-dark colours measured against rgb(57,41,27):
  --dark-head #faf7f2  13.04:1
  --dark-body #e8e1d4  10.72:1
  --dark-kick #c9a67e   6.13:1   <- chosen, reads as an accent
  --dark-mute #a89f92   5.33:1
  --accent    #6d7204   2.69:1   FAIL

Light-ground links keep the site's existing olive-without-underline convention.
Changing that sitewide is a design decision, not an accessibility fix, so it was
left alone and noted.

/tmp/balticcontrast.py (NEW) reads each link's computed colour and walks up to
the first non-transparent background, then applies the AA threshold with the
large-text exemption. Final: 8 links measured, 0 below AA.
  --bg cream #F5F1EA    --accent      4.60:1  pass
  --surface  #FAF7F2    --accent      4.84:1  pass
  dark ink   #39291B    --dark-kick   6.13:1  pass

QA SCRIPT WORK
/tmp/balticqa.py was rewritten: 18 checks on 2 routes became 43 checks on 4
routes (index, motorized, blackout, founder), adding a canonical-phrase
assertion, a "no unnamed partner phrasing left" regex, a per-route brand-embargo
check and a sitewide count assertion. Result: 43 checks, 0 failed, sitewide
linked mentions 8.

/tmp/tradeqa.py EXPECTED row 2 was updated for the new §10 label before the run.
That was a script fix, not a site fix. Result: OVERALL PASS.

ONE QA FINDING WAS A SCRIPT DEFECT, NOT A SITE DEFECT - the fourteenth this
project. The canonical-phrase check first failed on /index.html at 3 of 4. Cause:
it matched against innerText, which reflects RENDERED line breaks, and the §10
mention's link wraps to the next visual line at 1440px, putting a newline where
the source has a space. textContent showed the correct string. /tmp/canonprobe.py
proved it by dumping both textContent and innerText around each mention. The
check now matches whitespace-normalised textContent.

A SECOND SELF-INFLICTED TRAP WORTH REMEMBERING: writing a JS comment containing
a literal \n inside balticqa.py's Python triple-quoted JS string turned it into a
real newline at runtime, splitting the comment mid-line and throwing
"SyntaxError: Unexpected identifier 'the'". Never put an escape sequence in a JS
comment embedded in a Python string.

FULL BATTERY, ALL GREEN
  bun run lint            0 violations
  bun run build           passes, 8 routes prerendered, both guards pass
  probe11                 body text 10369 (was 10308 - THE BASELINE MOVED, the
                          pass adds real words; report the new number, never
                          claim "unchanged")
  balticqa                43 / 0, sitewide count 8
  balticcontrast          8 links, 0 below AA
  tradeqa                 OVERALL PASS
  respqa                  826 PASS / 0 FAIL, no regression
  faqqa                   642 / 642
  journalqa               258 / 0
  qa2                     14 images, 0 broken, 0 page errors
  qa_copy                 clean, brand embargo holds
  qa_booking              10 CTAs, 0 misconfigured
  overflow360             0 overflow at 360px
  motionqa, h1flash       clean
  brand audit in dist     CLEAN (source hits are the known comments only:
                          estimate-engine.ts:9, :62, partner.tsx:12-13)
  em-dash scan, 8 routes  0
  partner-link rule confirmed present in the built CSS in dist

DOCS
  QA-NOTE.md - corrected BOTH stale "10,308 unchanged baseline" claims, and
  added a full "§9 Naming and linking Baltic Electrical in every electrical
  reference" section: the eight mentions table, the four deliberate non-edits
  with reasons, the two changes worth a veto, the accessibility defect with the
  contrast table, the QA table, and the script-defect finding.

SCREENSHOTS REGENERATED
/tmp/screens.py re-run after the pass, since the Motorized Shading service
signature copy changed. Actual output dimensions in CSS px (the dimensions
recorded in the §7 notes were stale - the section clips are full-section, not
one-viewport):
  hero-desktop        1440x981     hero-mobile390     390x788
  service-desktop     1440x1967    service-mobile390  390x2400
  process-desktop     1440x1249    process-mobile390  390x2141
  contact-desktop     1440x1299    contact-mobile390  390x2163
  footer-desktop      1440x549     footer-mobile390   390x811
All written at device_scale_factor=2 into /home/user/screens-typography/.

VISUAL CONFIRMATION OF THE DARK-BAND LINK
/tmp/darklinkshot.py (NEW) crops the containing paragraph of each dark-band
Baltic mention and montages the two into /tmp/dl-sheet.png. Eyeballed: warm tan
--dark-kick, underlined, clearly legible against the dark ink band on both the
homepage ONE ROOF band and the blackout benefit list, and it reads as a link
rather than as emphasis.

DESIGN.MD
New "## Inline links" section records the light-ground treatment (olive, no
underline, 4.60/4.84:1), the dark-band treatment (--dark-kick plus underline,
6.13:1), why --accent must never be used on dark, where the rule lives and why
it is last in the file, and the rule that named trade partners always render
through <BalticLink />.

## §9 V2 PHASE 1 (footer lockup + Elvira + hero video: DONE and committed)

Baseline: V1 complete at `086f35e`, tree clean. Backup `/home/user/backups/studioelpa-v1-final.tar.gz`
(9.3 MB, 185 files). Plan written to `V2-PLAN.md` and approved by the user, with these answers:

- Drapery-headers card copy: **only 3.5 of 9 received** (Ripple Fold, Pinch Pleat, French Pleat, Euro
  Pleat truncated mid-sentence). Guide is PARKED until the rest arrives. Do not invent the copy.
- Elvira: title confirmed **"Creative Director, Home Textiles"**. Bio not written yet; the user
  authorised exactly one placeholder line: "Elvira Vasiljeva leads home textile design at Studio Elpa."
  Leave room to expand. Invent nothing.
- Hero poster: user will attach `hero-clean-final.png`. Video work proceeds; poster wired when it lands.
- Video budget: **balanced, under 4 MB**.
- Performance: **code-splitting is a real Phase 1 workstream**, before adding pages.
- Footer logo: **confirmed** to replace the text wordmark (supersedes V1 locked decision #5).
- Market figures: **prioritisation only**, never in public page copy.

### Done so far

1. **Assets placed** in `packages/web/public/assets/`:
   - `hero-motion.mp4` 1,125,352 B (H.264 high, CRF 22, 1600x900, audio stripped, +faststart)
   - `hero-motion.webm` 697,815 B (VP9 CRF 32) — both from the HEVC original, total 1.82 MB, under budget
   - `team-elvira.jpg` 109,478 B (900x1200, 3:4 crop from the 741x1600 original)
   - `logo-footer-cream.png` 47,400 B (640x240 reversed lockup, cream on transparent, tagline included)
2. **Footer logo swap.** New `<FooterLogo>` in `components/brand.tsx` (intrinsic 640x240, inline height
   owns the size, alt carries the tagline copy so it is not trapped in the bitmap). `<Wordmark>` kept
   and documented but no longer used by either footer. `site-chrome.tsx` import and both call sites
   swapped. CSS `.footer-logo` + `footer.site`/`footer.lp` rhythm added after the `.wordmark` rules.
   **`footerqa.py`'s "wordmark-is-text" assertion must now be updated deliberately, not "fixed".**
3. **Elvira team block (§8).** Added inside `#about`, after the `.wrap.two` grid, as `.wrap.team`
   `data-reveal`. Kicker "Design", h3 name, `.team-role` title, one placeholder line. CSS `.team` /
   `.team-photo` / `.team-role` added after `.cq-not`; class names verified free beforehand.
   Deliberately not a card grid and not a circular avatar.

Checks so far: `bun run lint` 0 violations. `probe11` body text **10476** (was 10369) — the baseline
moved again; Elvira's three lines account for it.

### Next

Hero video into `.hero-frame` (poster pending), then §3 AEO foundation, then code-splitting.

### Hero motion clip (V2 §9)

New `components/hero-motion.tsx` exporting `<HeroMotion poster>`. It refuses to mount the `<video>`
at all when `prefers-reduced-motion: reduce` matches, and otherwise mounts on `requestIdleCallback`
(3 s timeout) with a 1200 ms `setTimeout` fallback for Safari. WebM `<source>` first, MP4 second,
`muted loop playsInline autoPlay preload="auto" aria-hidden tabIndex={-1}`, and it fades in over
1200 ms on `canplay`. Carries a `biome-ignore useMediaCaption` comment — removing it fails lint.

Placed in `.hero-frame` **after the `<img>` and before `.hero-sweep`**, so the sunlight sweep still
paints on top. `.hero-video` CSS mirrors the still's grade exactly
(`sepia(.3) saturate(.86) brightness(1.03) contrast(.93)`) so the fade is a dissolve, not a colour
jump, and `display: none !important` inside the existing `prefers-reduced-motion` block.

- **The still remains the LCP element**: the `<img>` is untouched, still preloaded, still
  `fetchPriority="high"`. The video only mounts after idle. That is how §9's "must not delay LCP" holds.
- **The prerender guard is not tripped**: it fails the build on `#root` descendants with inline
  `opacity: 0` *and non-empty text*. The video has no text, and `prerender.py` drives Chrome with
  `reduced_motion="reduce"`, so the video is never in the snapshot.
- Interim poster is `/assets/hero-1120.jpg` — swap when `hero-clean-final.png` arrives.

### The footer lockup squish — a real defect, not a script defect

`footerqa` failed 123/125 at 1440 and 1180: natural ratio 2.667 vs rendered 2.532. The lockup
rendered 263.33x104 instead of 277.33x104, i.e. ~14 px narrower — genuinely squashed.

Cause, established by measurement rather than reasoning (five inline-style variants tried in the
browser): `footer.site .f-top` is `grid-template-columns: auto 1fr`, and Chrome resolved that auto
track to **263.328 px** — it does not feed the height-derived width of a `max-width: 100%` replaced
element back into intrinsic track sizing. The global `img { max-width: 100% }` at styles.css:159 then
clamped the image to the 263 px track while `height: 104px` held, so the ratio broke. `justify-self`
was a red herring: `max-width: none` alone rendered 277.33x104 at exactly 2.667 with **0 overflow**.

Fix: `max-width: none` on `footer.site .footer-logo` and `footer.lp .footer-logo` (where the fixed
height is what we mean), `max-width: 100%` restated in the `≤560px` branch (where the width is
column-derived and the clamp is correct again), plus `justify-self: start; align-self: end;
aspect-ratio: 640 / 240` on the base `.footer-logo` as belt-and-braces against future distortion.

`footerqa.py` itself was updated **deliberately**, not "fixed back": the two V1 assertions
`wordmark present` / `wordmark is text not bitmap` are now inverted, with a comment saying so, and
the script asserts the lockup's src, load state, alt (must carry "Studio Elpa", "window treatments"
and "home textiles" so tagline copy is not trapped in the bitmap), undistorted ratio, column fit,
minimum height, absence of any text wordmark and that the lockup is the footer's only bitmap. The
old wordmark contrast check was retired — a bitmap has no computed text colour. 97 → 125 checks.

### QA results for this slice

`footerqa` **125/125** · `respqa` 826/0 · `faqqa` 642/642 · `journalqa` 258/0 · `contactqa` 171/171 ·
`balticqa` 43/0 (sitewide count still 8) · `balticcontrast` 8 links, 0 below AA · `tradeqa` PASS ·
`heroviewqa` 15/0 · `fastscroll` 0 broken · `overflow360` 0 at 360 · `motionqa` 0 stuck ·
`h1flash` ALL PASS · `qa_a11y` no reduced-motion errors · `qa2` 0 broken images, 0 page errors ·
`qa_copy` embargo clean · `qa_booking` 10 CTAs, 0 misconfigured · `bun run lint` 0 violations ·
`probe11` body text **10476** (new baseline) · `bun run build` clean, prerender wrote 8/8 routes.
The asset optimizer takes `hero-motion.mp4` a further 56% down in `dist`.

Main chunk 578.21 kB / gzip 175.22 kB — code-splitting is the next workstream, still not started.

### Still blocked on the user

The 5.5 missing drapery-header card texts (guide parked), Elvira's real bio, `hero-clean-final.png`.

---

## §10 V2 AEO FOUNDATION (route registry, per-page head, JSON-LD graph, robots, sitemap)

V2 brief §3. Built after the Phase 1 slice, verified, and committed separately so the
content work and the machine-readability work stay reviewable apart from each other.

### The route registry is now the single source of truth

`packages/web/src/web/lib/site-routes.json` holds `origin` plus a `routes[]` array. Each
route carries `path`, `aliases`, `title`, `description`, `schema` (`home` | `service` |
`article` | `page`), optional `serviceType`, `breadcrumb`, `headline`, `datePublished`,
`noindex`, and `changefreq` / `priority`. `lib/routes.ts` wraps it with `ORIGIN`, `ROUTES`,
`canonical(path)` and `routeFor(path)` (returns `undefined` rather than throwing).

Importing JSON from `src/` is allowed — the lint rule that bans asset imports does not
cover `.json`, and `bun run lint` is clean with it.

**This closed a real gap:** before this, every one of the eight routes served the
homepage's `<title>` and meta description. All eight now have unique, hand-written ones.

### Per-page head and structured data

`components/page-seo.tsx` exports `<PageSeo path="/x.html" />`, mounted as the first child
of each of the eight page roots. In a `useEffect` it removes any `[data-seo="page"]`
leftovers, sets `document.title`, updates-or-creates `description`, `og:title`,
`og:description`, `og:url` and `og:type`, sets `<link rel="canonical">`, honours `noindex`,
and appends one `<script type="application/ld+json" data-seo="page">`. It returns `null`.

It mutates the DOM **on purpose**: the prerender step snapshots
`document.documentElement.outerHTML`, so everything it writes lands in the static HTML that
crawlers fetch.

`lib/seo-data.ts` holds `AREA_SERVED` (30 South Florida cities with real ZIPs, ordered by
the target-areas priority) and `graphFor(route)`, which returns one `@graph`:
`Organization` (`#organization`), `["HomeAndConstructionBusiness","LocalBusiness"]`
(`#localbusiness`, with `areaServed` City nodes carrying postal codes, an eight-service
`hasOfferCatalog`, `priceRange: "$$$"`), `WebSite` (`#website`), then the page node
(`Service` with `serviceType` + `provider` ref, `Article` with headline and publisher ref,
or `WebPage`), then a `BreadcrumbList` where a breadcrumb label exists.

Two hard rules are stated in the file header and asserted by QA: **no market figures**
(the target-areas research is prioritisation only, never public copy and never JSON-LD)
and **nothing invented** — no ratings, reviews, awards, `foundingDate`, employee counts,
and no `sameAs` until real profiles exist.

### Prerender: registry-driven, with a head guard and a generated sitemap

`packages/web/vite/prerender.py` no longer hardcodes its route list; it reads the registry.
It gained `write_sitemap(dist)` (skips `noindex`) and `head_defects(route, html)`, which
**fails the build** if a route's title or description does not match the registry, or its
canonical or JSON-LD is missing. Guard order: `open_disclosures()` → `unblock_paint()` →
collapsed-panel guard → `head_defects()`.

`packages/web/public/sitemap.xml` was **deleted**. The sitemap is generated into `dist/` at
build time. **Consequence, stated plainly: the dev server on 4200 has no `/sitemap.xml`;
only the production build has one.**

### robots.txt

Rewritten with a blanket `User-agent: * / Allow: /` plus explicit groups for Googlebot,
Googlebot-Image, Google-Extended, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot,
Claude-SearchBot, PerplexityBot, Applebot and Applebot-Extended, then the `Sitemap:` line.
Named groups exist because bot-protection layers commonly pass only matched rules.

Allowing GPTBot, Google-Extended and Applebot-Extended lets models train on the site as
well as search it. That is a deliberate reading of "be the answer AI assistants give", and
it is a business decision the user can reverse in one file.

### QA

New `/tmp/aeoqa.py`, **438 checks, 438/438**, read against `packages/web/dist` rather than
the dev server. Per route: title and description match the registry, exactly one
self-referencing canonical, one `og:url` / `og:title`, exactly one JSON-LD block that
parses, the expected nodes and stable `@id`s, the phone `(561) 836-0026` and the email,
`areaServed` ≥ 25 with named cities and ZIPs present and every area `addressRegion: "FL"`,
**no street address claimed**, schema-specific fields, breadcrumb positions and URLs (and
none on the homepage), **no `aggregateRating` / `reviewCount` / `ratingValue` / `award` /
`foundingDate` / `numberOfEmployees`**, no em dash, no embargoed brands, **no dollar
figures**, exactly one `<h1>`. Then sitewide: all titles unique, all descriptions unique,
robots allows all eight named agents with no blanket `Disallow`, and the sitemap `<loc>`
list equals the registry order exactly with no duplicates and all absolute https.

Full battery re-run after the AEO edits, all unchanged: `footerqa` 125/125 · `respqa` 833/0
· `faqqa` 642/642 · `journalqa` 258/0 · `contactqa` 171/171 · `balticqa` 43/0 (sitewide 8) ·
`balticcontrast` 8 links, 0 below AA · `tradeqa` PASS · `heroviewqa` 15/0 · `fastscroll` 0
broken · `overflow360` 0 · `motionqa` 0 stuck · `h1flash` ALL PASS · `qa_a11y` clean · `qa2`
0 broken images · `qa_copy` clean · `qa_booking` 10/0 · `lint` 0 violations · `probe11`
body text **10476**, unchanged.

### Honest non-completions from this slice

1. `/sitemap.xml` exists only in the production build, not on the dev server.
2. The eight titles and meta descriptions are **my wording, written to the voice rules but
   not reviewed by Aviva**.
3. `sameAs` is empty — no social profiles were supplied and none were invented.
4. No `address` is claimed in `LocalBusiness`. A Google Business Profile match will need a
   real address or an explicit service-area configuration.
5. `datePublished: "2026-07-01"` on the blackout Journal article is an assumption from the
   project timeline, not a date the user gave. Confirm it.
6. V2 §3 also asks that the host/CDN not block these crawlers via firewall or bot
   protection. That lives in hosting settings, not the codebase, and is **not done**.

### Why this comes before Phase 2

Every V2 page added from here gets its title, description, canonical, JSON-LD, prerender
pass, head guard and sitemap entry **for free** by adding one object to
`site-routes.json` and mounting `<PageSeo>`. Add the route to the registry first, then
`app.tsx`, then the page component.

---

## §11 V2 JOURNAL GUIDE: DRAPERY HEADERS, THE HERO POSTER, AND PLAY-ONCE HERO MOTION

Three things landed together: the nine-card drapery-headers guide, the clean final hero
artwork as the video poster, and a change to how the hero clip plays.

### The guide — `/drapery-headers.html`

The card copy arrived in full (`Runnable_V2_Drapery_Headers_3Voa5J.md`), which unblocked the
page that had been parked since §9. **All nine cards' name, tagline, body, "The Feeling" and
"We Love It For", plus the closing panel line, are the client's copy verbatim.** The dek, the
single lead paragraph, the two closing paragraphs and the CTA block are my words.

Route added to `site-routes.json` **before** `/privacy.html`, as `schema: "article"` with
breadcrumb "Drapery Headers, Compared" and `datePublished: "2026-09-08"`. Because the registry
is the single source of truth, the title, description, canonical, Article JSON-LD, breadcrumb,
prerender pass, head guard and sitemap entry all came for free — exactly the payoff §10 was
built for. Then `app.tsx` (lazy route) and the page component with `<PageSeo>` as first child.

Layout is a two-column `.header-grid` of nine `.header-card`s; the ninth ("And beyond") spans
full width because its photo is the only landscape one. One `<h1>`; the nine card names are
`<h2>`s.

**Two sizing decisions, both measured, both about never upscaling a real photograph.** The
supplied photos are only ~150px wide. The photo track is therefore a fixed `146px` and the
image carries `max-width: none`, so the global `img { max-width: 100% }` cannot re-enter and
distort it — the same class of bug as the footer lockup squish. The wide card was **caught
upscaling**: it first measured 296x297 from a 272px-tall source, because `height: 100%` filled
the card row. Fixed with an explicit `height: 272px` plus `align-self: start`, re-measured at
exactly 296x272. At ≤560px a full-bleed photo would have meant a >2x upscale, so the photo is
centred as a swatch instead.

The guide CSS was inserted **before** the Baltic Electrical partner-link block, which must stay
last in source order.

Both link directions are wired: the homepage's third Journal card was the "Coming soon"
placeholder for this exact guide and is now a real link, and `drapery.tsx` gained a line
pointing at the guide.

### Hero poster

`hero-clean-final.png` (actually a JPEG — `identify` before trusting an extension) became
`/assets/hero-poster.jpg` at quality 74, 153,623 B, chosen by visual comparison against the
source rather than by picking a number.

**The hero `<img>` was deliberately NOT replaced.** The clean art is 1365px wide against the
existing 1800px `hero.jpg` tier, so swapping it would downgrade the top srcset tier. Offered to
the client instead; it needs a full-resolution export.

### Play-once hero motion (client request, this turn)

The client reported a jump at the end of the hero clip and asked for the loop to be removed,
with a ~0.6s crossfade to the static image as the resting state.

**Measured the cause before changing anything.** Frame-to-frame mean-abs-diff over the clip's
last second tapers smoothly, 0.45 down to 0.013 — the clip settles on its own. The last frame
against the first frame measures **54.38**, roughly 4,000x a settled step. So the jump was
purely the loop seam, and the conditional instruction to "trim the final ~0.3s if jitter
remains" **did not apply — no trim was made.**

`loop` removed. On `ended` the component swaps `.on` for `.out`, which overrides only the
transition duration to 600ms and lets the base `opacity: 0` dissolve the video back to the
still; 600ms later the element unmounts and frees the decoder. `.hero-video.out` deliberately
does not restate `opacity`, because at equal specificity (0,2,0) it would otherwise race `.on`
on source order. `FADE_OUT_MS` in the component and the CSS duration must stay in sync.

Reduced motion needed no change: the component already refuses to mount the video at all, so
"static image only" was already true, and it is now asserted.

### QA

`heroviewqa` was **rewritten where it was wrong**: it asserted `loop is True`, which the client
has now explicitly reversed. It gained a poster assertion and a whole play-once section, and
went 15 → 23 checks, all passing. The fade measured **603ms** with a clean opacity ramp
(1 → 0.007), the video unmounts, and it never restarts.

`journalqa` also had to be corrected rather than obeyed: it modelled cards 1 **and** 2 as
unpublished, and card 2 is now the live guide. While fixing it I found the hover section was
**passing vacuously** — it dispatched a synthetic `MouseEvent`, which never triggers CSS
`:hover`, so "does not lift on hover" could never have failed. It now drives a real pointer and
asserts `:hover` actually matched before drawing any conclusion. 258 → 264 checks, all passing.

Six scripts carried hardcoded route lists that missed the ninth route (`qa.py`, `qa_a11y.py`,
`qa_copy.py`, `qa_booking.py`, `overflow360.py`, `motionqa.py`); all six now include it.

Full battery: `lint` 0 · `build` clean, **9 routes, sitemap 9 urls** · `aeoqa` **493/493** ·
`heroviewqa` **23/0** · `journalqa` **264/0** · `footerqa` 125/125 · `respqa` 833/0 · `faqqa`
642/642 · `contactqa` 171/171 · `balticqa` 43/0 (sitewide 8) · `balticcontrast` 8 links, 0
below AA · `tradeqa` PASS · `fastscroll` 0 broken · `overflow360` 0 across all 9 · `motionqa` 0
stuck · `h1flash` ALL PASS · `qa_a11y` clean on all 9 · `qa2` 0 broken images, 0 page errors ·
`qa_copy` 0 em dashes, 0 banned, 0 missing alt · `qa_booking` 10 CTAs, 0 misconfigured ·
`guideshot` 9 cards, 1 h1, 0 overflow, every image at or below natural size.

**`probe11` body text moved 10476 → 10481**, as expected from the Journal card swapping
"Coming soon" for "Read the guide →". New baseline.

### Honest non-completions from this slice

1. The guide's dek, lead paragraph, two closing paragraphs and CTA block are **my words**, not
   reviewed. The nine cards and the closing panel are the client's verbatim.
2. **The nine photographs are only ~150px wide.** The layout never displays them larger, which
   keeps them sharp but caps how generous the grid can be. Higher-resolution originals would be
   needed to go bigger; upscaling would fabricate detail and was not done.
3. The hero still was **not** swapped to the clean final art — resolution regression, see above.
   So the clip now dissolves to `hero.jpg`, which still carries the stray pencil marks the clean
   art removes. **This is the one point where the request and the shipped result differ, and it
   is flagged to the client.**
4. `datePublished: "2026-09-08"` for the guide is my assumption, like the blackout article's.
5. Performance work is still not started; the guide adds a tenth lazy chunk but does not touch
   the homepage critical path.

---

## §12 V2 TEAM: TWO REAL PEOPLE, TWO REAL PHOTOGRAPHS, AND `/meet-elvira.html`

Elvira's bio and Aviva's headshot both arrived in the same stretch, which closed the last
V2 content blockers. The team block stopped being a placeholder.

### What shipped

- `.wrap.team` is now a two-card block: `.team-grid` (two `1fr` columns, 44px gap), each
  `.team-card` an editorial `132px 1fr` split. One `data-reveal` on the outer container.
  Kicker "Who you'll work with" (my wording). `.team-slot`, the placeholder that existed
  only while Aviva's photo was pending, is gone from markup and CSS.
- `/meet-elvira.html`, the tenth route, modelled on `founder.tsx`. Elvira's bio is
  **verbatim**, lead through "Not for much longer." Its kicker, dek and closing CTA are
  my words. `schema: "page"`, deliberately: an `article` schema needs a `datePublished`
  and I was not going to invent one. Zero booking links, which is right for an article
  page; it ends on a soft CTA to `/index.html#contact`.
- Both portraits are real supplied photographs. No stock, no stand-ins.

### The framing decision, and the reversal

First pass, I tight-cropped Aviva to head-and-shoulders (900x1200) so her card would match
Elvira's close portrait. The client rejected it: fit both to the same card size with
`object-fit: cover`, focal point on the face, so they read as one set of warm lifestyle
portraits, and do not force either into an awkward tight crop.

Shipped instead: Elvira untouched at 900x1200 (3:4, close face portrait); Aviva re-cropped
from the higher-resolution resend at 720x900 (4:5), a generous seated framing that keeps the
headband, the striped shirt and the setting. Both fit an identical **132x176** 3:4 box.
Chosen by generating three candidate crops, montaging them beside Elvira, and looking at the
sheet — then simulating the actual `cover` render at card scale and looking at that too.

### The correction I had to make mid-task

I had assumed a 4:5 source in a 3:4 box trims **vertically**, so `object-position` Y would
be the focal control. That is backwards. A source **wider** than its box fits by height and
trims **horizontally**. Consequences:

1. Aviva's vertical framing is decided entirely by the image crop, not by CSS. Picking the
   right candidate crop *was* the whole decision.
2. Only ~6.25% comes off her sides, symmetric about her face.
3. Both crops are already face-centred, so `object-position: 50% 50%` is correct for both.
   Per-image modifier classes would have been two identical rules, so I did not add them —
   noise, not clarity. Flagged rather than manufactured.
4. The previous `object-position: 50% 26%` was a no-op dressed up as a focal point. Gone,
   and the CSS comment now states the measured behaviour instead of an assumption.

Lesson 7 again: do not trust arithmetic or an inherited assumption over measurement.

### Verification

`lint` 0 across 74 files. `build` clean, **10 routes, sitemap 10 urls**, all three prerender
guards passed. New **`teamqa` 99/0**, run against the built dist on 4310 rather than the dev
server, asserting the core invariant that **both portraits occupy identical boxes** plus the
measured cover geometry. `aeoqa` 493 → **545/545** (+52 for the tenth route). Full battery
green; `probe11` body text 10481 → **10724**, expected from the second card and its teaser.
Six QA scripts with hardcoded route lists gained the tenth route.

Two QA-script defects found and fixed, both script-side, not site-side: a screenshot `clip`
mixing page-relative and viewport-relative coordinates, whose exception was swallowing the
entire assertion summary; and a `header a` selector grabbing the logo instead of the back
link.

### Honest non-completions

1. The portrait box is **132x176**, small for "warm lifestyle portraits". The client asked
   for the same card size so I kept it and raised the tension rather than growing it
   unilaterally.
2. `.wrap.two` still has "Read a note from our founder →" directly above Aviva's "Read
   more →", both pointing at `/founder.html`. Flagged, **not removed silently**.
3. Main chunk 587.50 → **590.48 kB** (gzip 178.26 kB). The team markup lands in the eagerly
   imported homepage. Code-splitting now starts from a slightly worse number.
4. The team kicker, and the new page's kicker, dek, CTA, title and meta description, are all
   my wording. Only Elvira's bio is the client's, and it is untouched.

## §13 V2 BLINDSPACE: THE PARTNERSHIP, COMPLIANTLY, AND A CONCEALMENT STORY THAT DID NOT EXIST

### The instruction, and the guardrail it reverses

Blindspace is approved via WindowModes. This **reverses a long-standing embargo** that
covered Blindspace, Lutron and Somfy together. The reversal is **Blindspace only**. Lutron
and Somfy stay banned everywhere, and three QA suites that asserted the old three-brand
embargo had to be corrected rather than worked around.

### What I found before building, which contradicted the brief's own description

The brief called `-black.png` the light-background file and `-blue.png` "the sage version
where a lighter logo is needed". Measured, with `identify` and corner-pixel sampling:

| File | Size | Actual artwork | Alpha |
|---|---|---|---|
| `-black.png` | 709x297, 40,745 B | black mark on OPAQUE **white** | none |
| `-blue.png` | 714x305, 41,268 B | black mark on OPAQUE **sage** `#adc9c6` | none |

So **neither file is a light or reversed logo** — the mark is black in both — and **both are
fully opaque**. There is no supplied asset that works on a dark ground. That matters because
the site has a dark ink band (`--ink` rgb(57,41,27)).

It also matters that our light ground is **cream** (`--bg` #f5f1ea), not white. Dropping the
white-plate artwork straight onto the page shows a visible white rectangle edge.

Lesson recorded: **check for an alpha channel before placing an image on a coloured
background**, and **never trust an asset's filename over its pixels** (`-blue.png` contains no
blue).

### The resolution

The lockup sits on a deliberate **white (#fff) plate** with generous padding and a hairline.
The plate colour matches the artwork's own baked-in white **exactly**, so the seam is
invisible and the padding reads as the required clear space rather than as a container bolted
on. This recolours nothing, crops nothing, obstructs nothing, distorts nothing. And it stays
**off the dark band entirely**, which sidesteps needing a reversed logo we do not have.

Chosen after rendering both files on cream and reading the contact sheet (`/tmp/bs_sheet.png`),
then reading the real rendered section at 1440 and 390.

### What shipped

- `components/partner.tsx` — header comment now carries the Blindspace usage rules in full,
  the GUARDRAIL paragraph names **only Lutron and Somfy**, plus `BLINDSPACE_URL` and a new
  **`BlindspaceLockup`** component. Same reason `BalticLink` exists: the file path, href,
  target, rel and alt live in exactly one place and cannot drift.
- `styles.css` — `.bs-lockup` / `.bs-lockup-link` block, inserted **before** the
  `NAMED PARTNER LINK` block so that block stays last in source order. Width stated
  explicitly at 208px with `height: auto` and `max-width: none`, so the intrinsic 709:297
  ratio is exact and the global `img{max-width:100%}` rule cannot resize it (lesson 15).
  Padding 30/34, reduced to 24/26 below 560px.
- `pages/motorized.tsx` — a **new concealment section**, on a light `.block`, between
  "Specified right, installed clean." and the FAQ. There was **no concealment story on either
  page** before this (`rg -ni "conceal|recess|pocket|hidden|built-in"` over both pages returned
  nothing), so this is written copy, not a logo drop.
- `pages/drapery.tsx` — a fifth `<b>`-led bullet in "The Studio Elpa difference", naming
  Blindspace in body copy with **no second lockup**. My call, disclosed: the client said
  "and/or", and one lockup sitewide is the more conservative read of "standalone with clear
  space".
- Assets keep their official filenames minus the attachment hash, so provenance is obvious
  in the repo.

### The build does not alter the artwork — verified, not assumed

The asset optimizer reported the PNG "58% smaller", which on a logo is exactly the kind of
thing that would quietly quantise flat colour and count as a recolour. Measured instead:
`compare -metric AE` = **0**, `RMSE` = **0 (0)**, dimensions unchanged at 709x297. The
optimisation is lossless. Compliance holds through the build.

### QA

Three suites actively asserted Blindspace was absent and would have produced genuine
failures that were **script staleness, not site defects**:

1. `/tmp/balticqa.py` — embargo regex and its label narrowed to Lutron/Somfy.
2. `/tmp/qa_copy.py` — Blindspace removed from the must-NOT-appear list; Lutron, Somfy,
   "made in Europe" and "As seen in" kept.
3. `/tmp/aeoqa.py` — **deliberately left banning Blindspace**, with a comment explaining
   why: it only inspects JSON-LD, and naming a partner inside our own Organization /
   LocalBusiness graph would imply an affiliation we must not claim. Keeping it banned there
   is the correct guard, not staleness.

New **`/tmp/blindspaceqa.py`**, **220 passed, 0 failed** against the built dist on 4310:
official file only, exact href, `_blank`, `noopener`, exact alt, rendered ratio matched to
both the intrinsic and the official 2.3872 (measured 2.3874), never upscaled, no `filter` /
blend mode / reduced opacity / cropping `object-fit`, real clear space on all four sides,
white plate, nothing else inside the link, no second logo, no tagline in the container,
**not obstructed** (`elementFromPoint` at the centre returns the lockup), correct spelling
sitewide with five misspelling variants checked, eleven endorsement/affiliation phrases
absent, and Lutron/Somfy still absent on all nine routes.

Full battery re-run green: lint 0/74 · build clean, 10 routes, sitemap 10 · aeoqa 545/545 ·
teamqa 99/0 · balticqa 43/0 sitewide 8 · respqa 840/0 · faqqa 642/642 · contactqa 171/171 ·
journalqa 264/0 · footerqa 125/125 · balticcontrast 8 links 0 below AA · heroviewqa 23/0 ·
tradeqa PASS · menuqa PASS · guideshot clean · h1flash ALL PASS · qa2 17 images 0 broken ·
fastscroll 0 broken · qa_a11y faded=0 all 10 · qa_booking 10 CTAs 0 bad · overflow360 0 ·
motionqa 0 stuck 0 initLeft (motorized reveals 10 → 12, the two new blocks) · qa_copy em=0
banned=0 missing_alt=0 emoji=0.

`probe11` body text **10724, unchanged** — correct, because the new copy is on motorized and
drapery, not the homepage. Main chunk 590.48 → **591.19 kB** (gzip 178.36 kB): `partner.tsx`
is reached from the homepage, so the component lands in the eager chunk. Expected, tiny.

### Honest non-completions

1. **Neither supplied lockup can go on a dark background.** Both are opaque with a black
   mark. A transparent or genuinely reversed file would have to be supplied.
2. **The section's kicker, heading and both paragraphs are my words.** The client supplied
   exactly one sentence, "For a fully concealed look, we install Blindspace recess systems",
   which is used verbatim.
3. **The drapery mention is text-only, with no lockup**, on my judgement rather than a client
   instruction.
4. I describe the systems as "pockets that finish flush with the ceiling or the reveal" and
   deliberately avoided claiming a specific construction method I could not verify.

## §14 CODE SPLITTING: THE MEASURED BOTTLENECK WAS NOT THE JAVASCRIPT

The user asked for code splitting as a Phase 1 workstream, before more pages. Baseline
was Performance **78**, main chunk 591.19 kB raw / 178.36 kB gzip, with Lighthouse
reporting **69 KiB of that chunk unused** on the homepage.

### The measurement that redirected the work

Rather than guess at what to split, I enabled sourcemaps for one throwaway build and
attributed every generated byte in the chunk to its source module (`/tmp/smeown.py`;
`source-map-explorer` refuses this chunk, complaining about "generated column Infinity").
That gave the real composition:

| Raw bytes | Module | Movable? |
|---|---|---|
| 330,933 | react-dom | No, it is the framework |
| 54,135 | `pages/index.tsx` | No, it is the landing page |
| 47,685 + 13,132 + 2,276 | `@runablehq/website-runtime` + html-to-image + goober | **Blocked, see below** |
| 27,446 | `@tanstack/query-core` | No, eager via `Provider`, which must stay |
| 24,390 | `@orpc/*` (client, tanstack-query, standard-server, shared) | **Yes** |
| 8,183 | `components/contact-form.tsx` | **Yes** |

So of a 591 kB chunk, only about 95 kB was ever movable, and 56% of it is react-dom.

### What shipped: the contact form's network machinery is deferred

`components/contact-form.tsx` reached `queries/leads` → `lib/api`, which pulls the whole
oRPC client stack onto the homepage's critical path, for a form that sits in `#contact`
far below the fold and cannot be submitted until someone scrolls to it and types.

The **markup stays eager on purpose**: it is real crawlable content, it is in the
prerendered HTML, and its height is what holds CLS at zero. Only the network code moved,
using the same dynamic-`import()` shape `lib/home-gsap.ts` already proved:

- `queries/leads.ts` gains `submitLeadDirect()`, which calls the same procedure through
  the same typed `client` from `lib/api` with no hook. Its input type is derived from
  `AppRouterClient` so it cannot drift from the router.
- `contact-form.tsx` drops the static import, holds one reused promise in a ref, warms it
  on the form's first `onFocus`, and awaits it in an async `onSubmit`. A failed chunk
  fetch lands in the same `catch` as a failed submission, and the existing fallback copy
  already points the visitor at email.
- `estimate.tsx` keeps `useSubmitLead()` untouched. That page is already a lazy route, so
  the hook costs it nothing, and `QueryClientProvider` stays exactly where it was.

Result: main chunk **591.23 → 564.68 kB raw, 178.39 → 169.60 kB gzip**, with a new
`leads-*.js` chunk of 26.92 kB / 9.44 kB gzip that loads on first focus.

**And the Lighthouse score did not move: 78 → 77, LCP flat at 5.7 s.** Total blocking time
was only 50 ms to begin with, so there was never a JavaScript-execution problem to solve.

### The real bottleneck, found by reading the network waterfall

The hero image finished downloading at **35 ms** while LCP sat at **5662 ms**. The
`lcp-breakdown-insight` and `lcp-discovery-insight` audits both *passed*, and the
breakdown summed to ~396 ms observed. That gap is Lighthouse's simulated slow-4G model:
LCP is gated on how many bytes must cross the wire before the hero can paint, and the
waterfall showed four pillar tiles (~300 kB), the footer lockup and the header logo all
being fetched eagerly, in parallel with the hero.

Two fixes, both attribute-only:

- The four `.pillar .pimg` tiles get `loading="lazy"`, `decoding="async"` and explicit
  1000x750 dimensions. They are below the fold on every screen size. `.pillar .pimg`
  already pins `aspect-ratio: 4/3` with `width: 100%` in `styles.css`, so the box is
  reserved by CSS whether or not the image has loaded, which is why this costs no shift.
- `FooterLogo` in `brand.tsx` gets the same. The footer is the last thing on every page.

### The honest result, median of three runs

Single runs are noisy in this project (LCP drifted 5.3 → 5.7 s once with no change at
all), so this is a median, not a lucky run:

| | Before | After |
|---|---|---|
| Performance | 78 | **81** |
| LCP | 5.7 s | **4.88 s** |
| FCP | 1.8 s | 1.73 s |
| CLS | 0 | **0** |
| Unused JS | 69 KiB | 63 KiB |
| Main chunk (gzip) | 178.36 kB | 169.61 kB |

The code splitting contributed roughly nothing to the score; the image loading fix
contributed all three points. Both are worth keeping, but that is the honest attribution.

### Rejected: lazy-loading the badge runtime

`@runablehq/website-runtime` plus html-to-image and goober is **63 kB of eager JS on
every route**, the single largest movable block, and first paint needs none of it. Moving
it to `lazy()` works and keeps both components mounted, but `bun run lint` rejects it:

```
packages/web/src/web/app.tsx
  error  Missing import from "@runablehq/website-runtime"  [web-app-keeps-runable-runtime]
```

The template requires a *static* import. I could have satisfied the rule by leaving a
static import beside the `lazy()` call, but that both defeats the split, since the module
lands in the eager chunk either way, and games a deliberate platform guard. Reverted in
full; `app.tsx` is untouched at `git checkout`. **That 63 kB is not ours to move**, and it
is the main reason the chunk cannot get much below 564 kB.

### Verification

New `/tmp/splitqa.py`, **26 passed / 0 failed** against the built dist, asserts: no
`leads-*` chunk on initial load, every form field and the submit button present and
enabled without it, the form and its labels present in the **JavaScript-disabled**
prerendered HTML, the chunk arriving after first focus, client-side validation still
running with zero network calls, focus still moving to the first invalid field, a real
submit reaching the procedure, the failure branch rendering with `role="alert"` and the
mailto fallback, and the button re-enabling with its label reset.

**It carries the same guard as the other three form scripts**: every `/api/rpc/**` call is
aborted at the network layer, so it cannot repeat the incident where real leads reached
Formspree and the Sheet. The `net::ERR_FAILED` console line is that guard working.

Two initial failures in that script were **the script's fault, not the site's**: `.btn` is
`text-transform: uppercase`, so `inner_text()` reported "SEND IT OVER". Switched to
`text_content()`. That is the twenty-third time a QA script, not the site, was wrong.

Full battery re-run green: `contactqa` 171/0, `respqa` 840/0 (CLS 0.0000 at 768 and 390,
0.0015 at 360, all unchanged), `qa_a11y` faded=0 with no reduced-motion errors, `pillarqa`
PASS desktop and mobile, `motionqa` 0 stuck / 0 initLeft, `blindspaceqa` 220/0, `aeoqa`
545/545, `faqqa` 642/642, `teamqa` 99/0, `balticqa` 43/0 sitewide 8, `footerqa` 125/125,
`journalqa` 264/0, `heroviewqa` 23/0, `qa_booking` 10 CTAs 0 misconfigured, `overflow360`
0 on all 10, `fastscroll` 0 broken, `h1flash` ALL PASS, `qa`/`qa2` all 200 with zero page
errors. `probe11` body text **10724, unchanged**, correct because every change here was an
attribute or an import, never copy. Build clean, 10 routes prerendered, sitemap 10 urls,
all three prerender guards passed.

### Honest non-completions

1. **Performance is 81, not the 90+ V2 asks for.** The remaining gap is page weight, not
   code: 2,065 KiB total, of which `hero-motion.webm` is 682 kB, `hero-poster.jpg` 150 kB
   and the two before/after JPEGs 239 kB. The hero video is the obvious next lever and it
   is a user-facing decision, not a refactor.
2. **63 kB of eager JS is locked in place** by the template's lint rule, as above.
3. **`@tanstack/query-core`, 27 kB, stays eager** because `Provider` must stay mounted.
4. **`react-icons` and `react-hook-form` are declared dependencies imported nowhere.**
   Unimported means unbundled, so removing them would not move any number. Left in place
   rather than churn the lockfile on a verified-green tree; flagged as housekeeping.
5. The success path of the deferred submit is **still unverified end to end**, because
   verifying it means transmitting a real lead. Only the failure path is proven.

---

## §15 PHASE 2 SERVICE PAGES, THE SPEC-LIST GRID BUG, AND THE HERO CLIP SWAP

### 15.1 The spec-list bug: a grid container blockifies every inline child

The client reported that on the homepage, `#designers` -> "What we bring" -> row 03, the
Baltic Electrical link overlapped its own sentence and rendered as "Electrhunts".

Root cause, diagnosed rather than guessed. `.trade .spec-list li` is
`display: grid; grid-template-columns: 34px 1fr`. **A grid container blockifies every
inline-level child into its own grid item.** The row's children were therefore the `::before`
numeral, the `<b>`, the leading text run, **the `<a>` as a separate grid item**, and the
trailing text run. The `<a>` was auto-placed into row 3, column 1, the 34px numeral column,
where it overflowed and collided with the text beside it. The other eight Baltic mentions sit
in plain `ul.clean` lists, which is why exactly one of nine broke.

Fix, two parts:
1. Every one of the four `<li>` detail runs is wrapped in `<span className="spec-detail">`,
   so the whole run is a single grid item. All four, not just the broken one, so the next
   inline link added there cannot reintroduce the bug.
2. `.trade .spec-list li .spec-detail { grid-column: 2 }` — the column is stated explicitly
   rather than left to auto-placement. Inserted mid-file, because `.band.dark .partner-link`
   must remain the last block in `styles.css`.

Row 03 now carries the client's exact sentence. `/tmp/specqa.py`: **72 checks, 0 failures**
at 1440/390/360.

**The QA script was wrong first.** It reported 3 failures, one identical "overlapping pair"
at every viewport. `/tmp/rectdump.py` showed rects 3 and 4 were byte-identical:
`Range.getClientRects()` emits one rect for the inline `<a>` box **and another for the text
run inside it**. The overlap heuristic counted that self-referential pair. Fixed by
de-duplicating rects to within 1px before the pairwise comparison. The site was never wrong.
That is the twenty-fourth time a QA script, not the site, was the defect.

### 15.2 Phase 2 = the three service pages that did not exist yet

`V2-PLAN.md` names "Custom Drapery, Motorized Shades, Blackout" for Phase 2, but **all three
shipped in V1**, so the plan's wording is stale. Brief §4 keeps V1's hierarchy and lists 12
service pages; the missing primary is Roller & Solar Shades, and the next two in §4's own
order are Roman Shades and Natural Woven. Decorative Hardware moves to Phase 4. This is my
call and it is reversible in one line.

| Page | Route | Angle |
|---|---|---|
| `roller-solar-shades.tsx` | `/roller-solar-shades.html` | Heat, glare and fading on big glass without losing the view; openness factor as the real decision |
| `roman-shades.tsx` | `/roman-shades.html` | Fabric where drapery would swallow the window; flat / relaxed / hobbled |
| `natural-woven-shades.tsx` | `/natural-woven-shades.html` | Texture in hard pale coastal rooms; honest limits on privacy and humidity |

All three follow `blackout.tsx`'s structure exactly. Every FAQ answer carries an honest
limitation, because that is the brand voice: solar screens give no night privacy, a Roman is
not truly blackout unaided, unlined woven gives little privacy and moves with humidity.

The brief's Template A is explicitly "Service + City"; there is no service-only template, so
I used its skeleton minus the city specificity.

`site-routes.json` is now **13 routes**, `app.tsx` lazy-loads all three, and the homepage §7
services grid finally links through: `SERVICES_PRIMARY` and `SERVICES_MORE` gained an `href`
**string** field rendered as a `<Link>` inside the map, never JSX in the data (lesson 25).
Decorative Hardware has an empty href and therefore renders no anchor.

Build: 13 routes prerendered, sitemap 13 urls, all three prerender guards passed.
Booking CTAs went 10 -> **19**, not the 16 I predicted: each new page carries three, like
every other service page. 0 misconfigured. Baltic mentions 8 -> **9**, all canonical.
`qa_copy.py`: 0 em dashes, 0 banned words, 0 missing alts across all 13 routes.

### 15.3 The hero clip swap, and the seam that is not seamless

The client supplied a reversed clip: dark, shades rise, ends on the bright open room.
Encoded to 1600x900, audio stripped at the encoder rather than only muted:
`hero-motion.mp4` 1,379,199 B (H.264 crf25, faststart) and `hero-motion.webm` 543,054 B
(VP9 crf36). **1.92 MB total against a ~4 MB budget.** The build's asset optimizer then
re-encoded the MP4 to 500,496 B; proven faithful, not degraded, at RMSE 0.016 on the final
frame and 0.013 mid-clip.

**No behaviour changed, because the component was already correct**: autoplay, muted,
playsInline, `loop` absent, `onEnded` -> `.out` -> 600ms crossfade -> unmount, and under
reduced motion the `<video>` is never mounted and no clip bytes are fetched at all.
`/tmp/heroswapqa.py`: **25 checks, 0 failures**.

The still was also swapped to the clean final artwork, which closes the longest-standing
honest non-completion on this build: the hero no longer carries stray pencil marks.
`hero.jpg`, `hero-1120.jpg`, `hero-780.jpg` and `hero-poster.jpg` all regenerate from that
master, and the srcset's top candidate drops **1800w -> 1365w** in both `index.html` and
`index.tsx`, because the supplied master is 1365x768 and upscaling would ship bytes with no
detail behind them.

**The seam does not match, and the client's premise that it does is measurably wrong.**
Captured through the identical CSS grade, in the identical box, with the breathing loop and
the sweep frozen:

- clip final frame mean RGB **(194.6, 168.6, 138.3)**
- clean still mean RGB **(212.5, 209.0, 202.8)**

The blue channel differs by 64 levels. Rendered RMSE across the seam is **0.176**. A scale
search rules out a framing offset: after normalising colour, best fit is scale 1.06 at RMSE
0.169 against 0.172 at scale 1.00, which is flat. So the residual is **baked-in amber warmth
plus genuine differences in the two renders' linework and floor shadows**, not a transform
anyone can correct away. Raised with the client rather than silently colour-correcting their
artwork.
