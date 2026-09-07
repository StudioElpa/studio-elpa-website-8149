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
