# Studio Elpa — QA note

Run against **Section 10, "Acceptance checklist (run before publishing)"** of the
build brief. Date: 7 September 2026.

Every result below is from an actual test run, not an inspection by eye. Scripted
checks drove a real Chrome instance against the running site; the scripts are kept
in `/tmp` and are re-runnable. Where something could **not** be verified, it is
marked `UNVERIFIABLE` with the reason — it is not marked passed.

**Summary: 15 of the 18 checklist items pass. 1 fails (Lighthouse performance).
2 cannot be verified yet because Attio has no API key.**

---

## 1. Content & voice

| Check | Result |
|---|---|
| Zero em dashes across all pages | **PASS** |
| No banned words/phrases (Section 5a) | **PASS** |
| No invented testimonials, stats, awards, project names | **PASS** |
| Facts intact | **PASS** |

Audited on the **rendered DOM** of all 8 routes with every FAQ expanded, not on the
source — so copy inside collapsed panels and JS-built strings was included.

- **0** em dashes, **0** banned words, **0** images missing `alt`, **0** emoji.
- The only en dashes are inside numeric price ranges (`$2,497 – $3,943`), which the
  brief explicitly permits.
- Present as required: "European fabrics", "licensed and insured", "South Florida",
  "one business day".
- Absent as required: "made in Europe", Somfy, Lutron, Blindspace, "As seen in".

The original copy was **much cleaner than the brief assumed**. Only four real
defects existed, all fixed; Section 5 was a light edit, not a rewrite:

1. `motorized.html:111` — em dash in prose, now a colon.
2. `estimate.html` — 4 em-dash UI placeholders, now "not provided" / "none"; the
   fourth (`<div class="range">—</div>`) no longer exists by construction.
3. `journal-blackout` — "transform the room's mood" → "change the room's mood entirely".
4. `drapery` hero — "quietly transformative" → "quietly changes how the whole room feels".

No invented social proof was found in the original and none was added. The only
real project on the site remains the arched dining window before/after.

## 2. Design

| Check | Result |
|---|---|
| Brand tokens applied exactly; body copy readable at all sizes | **PASS**, with 2 recorded token deviations |
| No AI/template design tells; real assets, no stock/AI imagery, no partner logos | **PASS** |
| Headings serif (sentence case), body sans | **PASS** — originally Cormorant Garamond + Jost; **superseded** by the Warm Editorial pass, now Newsreader + Instrument Sans (see §8) |

All 23 original photographs are used as-is. No stock or generated imagery was
introduced. No partner logos appear anywhere.

Two colour tokens were changed, **both to satisfy the accessibility requirement in
the same checklist** — see §5 and the deviations list:

- `--accent` `#7B8105` → `#6D7204`
- footer `#8a8177` → the already-defined `var(--dark-mute)`

Confirmed by screenshot that the darker accent still reads as the brand olive on
both kickers and solid buttons.

One AI/unfinished-draft tell was found and removed: a visible internal
"Note for Studio Elpa:" block on `privacy.html`.

## 3. Motion

| Check | Result |
|---|---|
| GSAP reveals calm; hero text readable instantly, not blocked by animation | **PASS** |
| `prefers-reduced-motion` fully disables transforms | **PASS** |
| No jank on scroll; holds up on mobile | **PASS** (CLS 0.015) |

The motion contract is enforced structurally rather than by convention: **no reveal
class in the CSS sets `opacity: 0`.** GSAP animates *from* a hidden state inside
`useLayoutEffect`. If JavaScript fails, is slow, or reduced motion is on, all copy
renders immediately in its final state. Hero text can never be hidden by animation.

Reduced-motion tested across all 8 routes: **0 faded elements**, correct `<h1>` on
each, zero console errors. Durations are 0.5–0.8s, travel ≤20px, stagger 0.07–0.08.

## 4. Lead flow

| Check | Result |
|---|---|
| Test submission creates/updates a Person, a Deal, and a Note in Attio | **UNVERIFIABLE — no API key exists** |
| Designer/architect submissions create/link a Company and are tagged as trade | **UNVERIFIABLE — no API key exists** |
| Internal notification email arrives at aviva@studioelpa.com | **NOT TESTED — deliberately** |
| Thank-you state on success, fallback email message on failure | **PASS** |
| "Book a 30-minute call" opens the Google Calendar link | **PASS** |

**On the two Attio items.** Attio is not set up yet: there is no API key and no
pipeline or stage IDs. I did not invent them. The function is written against the
exact object, attribute and stage names in the Attio setup checklist and is fully
config-driven, so adding `ATTIO_API_KEY` plus the stage IDs turns it on with **zero
code change**. What *was* verified is that it degrades correctly: with no key the
submission returns `{"ok":true,"sinks":{"attio":"skipped",...}}` and the visitor
still gets the thank-you state. The Person/Company/Deal/Note assertions themselves
must be re-run once the key exists. **They are pending, not passing.**

**On the notification email.** Deliberately not sent. The only wired notification
path is the live Formspree endpoint, which forwards to the real
`aviva@studioelpa.com` inbox and the real Google Sheet. Firing a test submission
would put junk into a client's live inbox and spreadsheet. Per the agreed scope,
Google Workspace email was skipped because Attio and the existing Formspree
endpoint already email Aviva; the Gmail/SMTP path is documented in the README as
the future option. **Verify with one real submission at go-live.**

**What was verified end to end**, with both fallback endpoints temporarily blanked
so nothing reached the client's live inbox — and `.env` afterwards confirmed
byte-identical to its backup, twice, with `diff`:

- **Success branch:** returns `ok:true`, the thank-you copy replaces the form inside
  a native `<output>`.
- **Failure branch** (fallback pointed at a dead port): returns `ok:false`, the
  failure message and `mailto:aviva@studioelpa.com` render, **typed values are
  preserved**, and the button re-enables so the visitor can retry.
- **Validation:** empty submit renders both errors, moves focus to `#cf-name`, sets
  `aria-invalid`; malformed email is caught.
- Failure is reported **only when every configured sink rejects**, so one dead sink
  cannot lose a lead that another accepted. The honeypot is silently accepted.
- **Estimate wizard, all 6 steps:** step-3 dimension validation, step-5
  name/email/consent validation, the product-narrowing case (switching product
  remaps rows and preserves dimensions), correct results maths
  (`$2,497 – $3,943`, quantity maths correct), confirmation `<output>`, `ok:true`,
  zero errors.
- **Booking CTA:** 10 across the site, every one pointing at the correct Calendar
  URL with `target="_blank" rel="noopener"`, **0 misconfigured**. (`estimate.html`
  reports 0 at page load because its booking CTA lives on step 6; it was verified
  in the wizard run.)

## 5. Technical

| Check | Result |
|---|---|
| Lighthouse mobile 90+ across the board | **FAIL on Performance.** A11y / Best Practices / SEO pass at 100 |
| Keyboard nav + focus states; FAQ accordions operable; alt text present | **PASS** |
| Exports to plain static files, bundle < 40 MB, loads from a static host | **PASS**, with one caveat |

### Lighthouse mobile (production build, throttled)

| Run | Perf | A11y | Best Practices | SEO |
|---|---|---|---|---|
| Baseline | 42 | 91 | 100 | 100 |
| + code splitting, hero preload | 48 | 91 | 100 | 100 |
| **Final** | **54** | **100** | **100** | **100** |

Final metrics: FCP 5.3s, LCP 8.2s, TBT 360ms, CLS 0.015, Speed Index 5.3s.
Against baseline: **LCP −4.4s, TBT −390ms, Performance +12, Accessibility +9.**

**Performance does not reach 90 and I want to be direct about why, because it is
architectural rather than a tuning gap.** The brief asked for plain static files
with no build step; the platform requires the managed React stack, and that
conflict was raised and accepted at the start. Client-rendered React paints nothing
until the main bundle parses. At ~665 KB over Lighthouse's simulated slow 4G with
4× CPU throttling, that is roughly a 5s first paint by arithmetic. Scoring 90+
needs FCP under 1.8s, i.e. on the order of 100 KB of initial JavaScript. That is
not reachable by tuning this stack's client-render model.

Two fixes were applied and did help materially — route-level code splitting (main
chunk 772 KB → 681 KB, plus 7 per-page chunks) and preloading the hero image with
`fetchpriority="high"`, which alone took 4.4s off LCP. **Closing the remaining gap
needs SSR or prerendering, which is a scope decision for you.** On real hardware
and a normal connection the site feels considerably faster than these throttled
figures suggest, but I am reporting the throttled numbers because those are what
the checklist asks for.

### Accessibility: 91 → 100

Three WCAG AA failures were found and fixed.

1. **Contrast.** The footer used a hardcoded `#8a8177` on `#39291b` = **3.64:1**,
   below the 4.5:1 minimum. This was a genuine bug: `--dark-mute` `#a89f92`
   (**5.33:1**) was already defined and documented but simply never used. Now
   restored to the token. Separately `--accent` `#7B8105` failed both ways — 3.74:1
   as kicker text on cream and 4.21:1 behind white button text — so it was darkened
   11% at the same hue to `#6D7204`, giving **4.60:1** and **5.17:1**.
2. **Heading order.** The two footer column headings were `<h4>` following page
   `<h2>`/`<h3>` content, skipping a level. Promoted to `<h3>`, with the CSS
   selector renamed so their 11px visual size is unchanged.
3. **Target size.** The footer phone and email links were 94 × 23.8px, under the
   24px minimum, because an inline `display: inline` was cancelling the footer's
   block padding. Removed, giving ~32px targets.

Worth flagging honestly: the heading fix initially **regressed visually** and the
Lighthouse score did not catch it, because `h3 → h4` is still a legal increment and
scored 100 either way. A screenshot caught that one heading had kept the wrong tag
and was rendering in serif. Both headings were then confirmed identical by reading
computed styles. Scores alone were not sufficient here.

### Keyboard and assistive technology

- Mobile drawer: `aria-expanded` false → Enter → true → Escape → false; Space also
  works; `aria-label` flips Open/Close menu; `aria-controls="site-nav"` resolves.
- All **6 FAQ accordions** toggle correctly with both Enter and Space; each is a
  real disclosure with `aria-expanded`/`aria-controls` and a labelled panel.
- The **skip link is the first Tab stop**. Global `:focus-visible` rings are present.
- **0** images missing `alt` across all 8 routes.

### Static export

`bun run build` succeeds. The bundle is **5.4 MB** (5,449,864 bytes as of the
typography pass), well inside the 40 MB budget.
All 9 routes return 200 with the correct `<h1>` and **zero console or page errors**;
the homepage after a full scroll loads 14 images with **0 broken**.

**Caveat:** the static bundle covers the site itself, but the `leads.submit`
endpoint is server-side. Hosting the static files alone on Porkbun means the form
would have no backend. The README documents both the `.htaccess` SPA rewrite and
this constraint.

---

## 6. V1.1 — the ten refinements

All ten shipped (commits `1c292be` → `6d3938e`, plus `ebe3fe1` for the
header/mobile/overflow pass). Verified by `/tmp/scale_type.py`, `/tmp/scale_vw.py`,
`/tmp/hdrcheck.py`, `/tmp/logocheck.py`, `/tmp/navwrap.py`, `/tmp/overflow360.py`.

| Check | Result |
|---|---|
| Type scale tightened, no orphaned or clipped headings | **PASS** |
| Header logo swapped to the tagline-free crop (`logo-header.png`, 898×255) | **PASS** |
| Mobile drawer opens/closes, focus trapped, Esc closes | **PASS** (`/tmp/menuqa.py`, 5/5) |
| Zero horizontal overflow at 360px on all 8 routes | **PASS** (`/tmp/overflow360.py`) |
| Reveal flash on load eliminated | **PASS** (`/tmp/flashprobe.py`, `fa22534`) |

Honest non-completions carried out of V1.1: the breathing zoom and light sweep the
brief described were **never actually built in V1.1** (they arrived in the V1.2 §3
hero work), and the light sweep crosses the whole illustration rather than a single
pane.

## 7. V1.2 — the seventeen-section refinement pass

All 17 sections shipped. §17 is this QA pass. Full battery, re-run in one sitting on
the final tree:

| Script | Result |
|---|---|
| `bun run lint` | **0 violations** |
| `bun run build` | **passes**, 8 routes prerendered, both build guards pass |
| `/tmp/probe11.py` | body text **10,308 chars** at the V1 lock (now 10,369 after the §9 Baltic naming pass) |
| `/tmp/respqa.py` (7 widths × 3 routes) | **826 PASS / 0 FAIL** |
| `/tmp/faqqa.py` (§15) | **642 / 642** |
| `/tmp/footerqa.py` (§16) | **97 / 97** |
| `/tmp/contactqa.py` (§14) | **171 checks, 0 failed** |
| `/tmp/journalqa.py` (§13) | **258 checks, 0 failed** |
| `/tmp/collqa.py` (§12) | **174 checks, 0 failed** |
| `/tmp/cmpqa.py` (§11) | **80 / 80** |
| `/tmp/tradeqa.py` (§10) | **OVERALL PASS** |
| `/tmp/processqa.py` (§9) | anchor clears sticky header: **YES** |
| `/tmp/balticqa.py` | **18 checks, 0 failed** |
| `/tmp/scrollspy.py` (§2) | **PASS 5 / FAIL 0** |
| `/tmp/motionqa.py`, `/tmp/h1flash.py`, `/tmp/flashprobe.py` | no stuck reveals, no flashes, hero never dips below opacity 1 |
| `/tmp/fastscroll.py` (6 scenarios) | **TOTAL BROKEN: 0** |
| `/tmp/qa_a11y.py` | every route `faded=0`, reduced-motion errors **NONE** |
| `/tmp/qa_copy.py` | required phrases present, banned strings absent |
| `/tmp/qa_booking.py` | **10 booking CTAs, 0 misconfigured** |
| `/tmp/qa2.py` | 14 images, 0 broken, 0 page errors, href audit clean |
| `/tmp/qa_wizard.py` | walks all 6 steps, validation fires, reco + CTAs correct |
| `/tmp/overflow360.py` | zero overflow, all 8 routes |
| `/tmp/parasize.py` | body copy uniform at 18.5px |
| Brand-name audit | `dist` **zero hits**; `src` only 3 known code comments |
| Em-dash scan | **0 em dashes** in rendered copy across all 8 dist routes |
| `.env` diff | **byte-identical** to backup |

**§2's active-section indicator is confirmed working after the motion refactor.**
It has no DOM node, so `/tmp/scrollspy.py` reads the `::after` pseudo-element's
computed style: 1px high, `rgb(109, 114, 4)` (`--accent`), opacity 1, width tracking
each label. One honest nit: scrolled back to the very top, `#about` stays active
because there is no `#home` nav link to hand the state back to.

### Three QA findings that were script defects, not site defects

Recorded because they would otherwise read as regressions:

1. **`/tmp/respqa.py` reported 58 failures; 56 were its own bugs.** Proven with
   `/tmp/verifyfail.py` *before* anything was edited. (a) "header phone runs 3
   lines" — `Range.getClientRects()` returns a rect per fragment, including the
   inline `<svg>`, and can return overlapping rects for one text run. The line
   counter now walks text nodes only and merges by line-box centre; truth is one
   line at every width (110.53px at 1440, 102.91px at 390). (b) "form type below
   15px", 49 instances — every one was a field `<label>` at 13.5px uppercase, which
   the brief explicitly allows to run small. The editable controls measure **18px**,
   past the 16px iOS focus-zoom threshold.
2. **`/tmp/tradeqa.py`'s `EXPECTED` copy was stale**, predating the approved
   Baltic Electrical naming in `22d2fad`. Diffed with `/tmp/tradediff.py`, script
   corrected, site untouched.
3. **`/tmp/qa.py`'s "broken images" are a lazy-load artifact.** The six `art-*.jpg`
   and two `ba-*.jpg` it flags all serve **200 with full bytes** (curl-verified) and
   all exist on disk. They are `loading="lazy"` and were never scrolled into view,
   so `naturalWidth` was 0 at check time.

### Lead-transmission incidents — disclosed in full

- **Historical: up to 3 real submissions were transmitted** by `/tmp/qa_form.py`
  and `/tmp/qa_form_fail.py`, because the root `.env` holds live `FORMSPREE_ENDPOINT`
  and `SHEET_ENDPOINT`. Two are confirmed ("QA Fail Branch", `qa+fail@example.com`)
  and one likely ("QA Test Lead", `qa+sandbox@example.com`). **Delete these records
  from the sheet.**
- **This pass: `/tmp/qa_wizard.py` ran unguarded once** and the wizard auto-submits
  on reaching step 6. Investigated immediately and **no lead was transmitted**:
  `ps aux` and `ss -ltnp` show only Vite listening on 4200, there is no Hono API
  process and no `/api` proxy in `vite.config.ts`, so the POST hit the SPA fallback
  and died in the sandbox.
- **All three scripts are now guarded** (route abort, or filling the `#cf-trap`
  honeypot). The guards must never be removed. A `net::ERR_FAILED` console line in
  `qa_wizard` output is the guard's own abort, not a site defect.

## 8. The "Warm Editorial" typography overhaul

Cormorant Garamond + Jost are **replaced sitewide** by **Newsreader** (headings,
pull quotes, the footer wordmark) and **Instrument Sans** (body, UI, labels, FAQ
questions). Shipped in three commits: `aee53a4` (fonts), `a963dad` (weights,
leading, tracking), `0e1a64b` (responsive review).

### Font payload

| File | Axes | Bytes |
|---|---|---|
| `newsreader-var-latin.woff2` | `wght` 400–500, `opsz` pinned 24 | 37,712 |
| `newsreader-italic-latin.woff2` | `wght` 400, `opsz` pinned 18 | 22,860 |
| `instrument-sans-var-latin.woff2` | `wght` 400–600, `wdth` pinned 100 | 27,156 |
| **After** | | **87,728 (85.7 kB)** |
| **Before** (8 Google-served latin faces) | | **242,884 (237.2 kB)** |

**64% smaller, and zero third-party font requests.** Verified by `/tmp/fontqa.py`
(**85 PASS / 0 FAIL**): no external font request on any route, every
`/fonts/*.woff2` returns `200 font/woff2` at the expected byte size, no synthetic
bold and no synthetic italic anywhere, per-route family census as expected.
`font-display: swap` appears 3× in source and 3× in the built CSS.

### Four synthetic-face defects found and fixed

They existed the moment the fonts changed and were only visible under measurement:
`.nav-cta` asked weight 700 of a 400–600 face (now 600); `.wordmark` asked 600 of a
400–500 face (now 500); `<em>` inherited the sans, which has no italic face (new
`em, i, cite` rule in the serif italic); `.page-article .footnote` was italic in the
sans (now serif italic, and grew 14.5px → 15.5px).

### Glyph coverage

`/tmp/glyphqa.py` checks every rendered character against each font's cmap:
**Instrument Sans covers all 80 rendered characters.** Newsreader ships **no arrow
glyphs anywhere upstream**, and the site renders `←`/`→` in seven places, so those
are carried by Instrument Sans (listed inside `--serif` ahead of Georgia, with
`unicode-range` widened to `U+2190-2193`). `/tmp/arrowfam.py` confirms all seven.

### Performance — Lighthouse mobile, measured on the prerendered, gzipped `dist`

| Metric | Before fonts (V1.2) | After |
|---|---|---|
| Performance | 71 | **78** |
| FCP | 2.2 s | **2.0 s** |
| LCP | 6.0 s | **5.3 s** |
| TBT | 250 ms | **70 ms** |
| CLS | 0.014 | **0** |
| Speed Index | 2.4 s | 2.6 s |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | **100 / 100 / 100** |

Full progression, mobile: client-rendered uncompressed **54** → prerender 55 →
+ gzip 63 → + inline CSS + async fonts 63 → + hero `srcset` 64 → + motion refactor
71 → **+ self-hosted typography 78**.

Removing the Google Fonts link also removed a `prerender.py` trick that de-blocked
the third-party font stylesheet, worth roughly **760 ms** of hero stall. The user
was told this before the change and chose removal anyway. **The re-measure
vindicates it: 71 → 78.**

### Responsive review — 7 widths

`/tmp/respqa.py`: **826 PASS / 0 FAIL**, no notes. Zero horizontal overflow, no nav
label wraps, no clipped headings at any width.

| Width | Hero height | h1 size / leading / tracking / weight | h1 lines | CLS |
|---|---|---|---|---|
| 1440 | 980 | 72.5 / 72.5px / -1.45px / 400 | 3 | 0.0012 |
| 1280 | 980 | 72.5 / 72.5px / -1.45px / 400 | 3 | 0.0000 |
| 1180 | 980 | 72.5 / 72.5px / -1.45px / 400 | 3 | 0.0003 |
| 1024 | 902 | 69.43 / 69.43px / -1.389px / 400 | 2 | 0.0004 |
| 768 | 780 | 52.07 / 52.07px / -1.041px / 400 | 2 | 0.0000 |
| 390 | 788 | 43 / 44.72px / -0.86px / 400 | 4 | 0.0001 |
| 360 | 771 | 43 / 44.72px / -0.86px / 400 | 4 | 0.0015 |

The tighter hero leading pulled the **desktop** hero from 1013px to **980px**
(−3.3%). The **mobile** hero grew 7px (781→788 at 390, 764→771 at 360, under 1%) to
give Newsreader's descenders room: at 43px with leading 1.0 the ink below the
baseline needed 12px and the line box gave 11px. Nothing was ever actually clipped
(the clip probe returned null) but it read tight, so mobile leading went to 1.04 —
still inside the brief's 0.98–1.04 hero band. Desktop keeps 1.0.

### Deliberate typography deviations, all recorded

- **Three variable-font files, not the six static faces** the brief's §1 lists.
  Weight ranges are live, so nothing is synthesised.
- **Body size stays 18.5px sitewide**, above the brief's 17–18px desktop band, at
  the user's explicit choice: uniformity wins.
- **The global heading weight flipped from 500 to 400**, so most headings are
  lighter than they shipped. This is the brief's ranking; 500 is restated
  deliberately in five clarity cases (`.page-lp .hero h1` and `.callout h2`
  reversed on dark, `.collection h3` small serif on dark, `.svc-item h4` at 19px,
  plus the wordmark and step numerals that were already 500).
- **`.faq-q` dropped 22.5px → 19.5px** when it moved to Instrument Sans. A
  deliberate optical match, but a real size reduction. Exactly six elements crossed
  families (index census 138 sans / 61 serif → 144 sans / 55 serif).
- **CTA tracking reduced**: `.btn` 0.13em → 0.10em, `.nav-cta` 0.14em → 0.11em,
  `.page-estimate .btn` 0.2em → 0.13em. Padding untouched, so only width narrows.
  Measured `.btn` height is now **47.625px**, not the 49.625px in the V1.2 notes;
  that 2px came from the new font metrics, not this edit. Still above 44px.
- **Eyebrow tracking was left alone** (`.kicker` 0.3em, `.svc-more-head h3`
  0.24em). Only CTA tracking was called excessive.
- **`text-wrap: balance` on `h2.big`** changes heading line breaks at **every**
  width, not just mobile. It was added to fix a mobile orphan ("of." alone on a
  line, 9–10% of the column, in "A few rooms we're proud of."), which
  `/tmp/orphan390.py` proved lives on `h2.big.center` — an earlier attempt on
  `.project-head h3` was measured, found ineffective, and reverted.
- **One markup change was made**, the only one in the whole pass: an inline-styled
  `<i>` in `estimate.tsx` became `<span className="assume-note">` with a real CSS
  rule (sans, upright, 14px, `--ink-soft`). **No words changed.**

### Nothing else moved

Body text was **byte-identical at 10,308 characters** at the end of the typography
overhaul. It later moved to **10,369** in the §9 Baltic naming pass, which added
real words. `.env` is byte-identical to
its backup. All 10 booking CTAs intact and correctly configured. The href audit is
clean. No copy, integration, URL or functional change.

### Screenshots

Ten PNGs at 2× device scale in `/home/user/screens-typography/`: hero, service,
process, contact and footer at both 1440 desktop and 390 mobile. Section clips
start below the sticky header, so the header is out of frame by design.

---

## Deviations from the original, all deliberate

**Structural**

- Rebuilt on the managed stack (Bun/Vite/React/Hono) rather than plain static
  files — the conflict you accepted. `.html` URLs are preserved so existing links
  and SEO survive.
- Google Workspace email skipped by agreement; documented as the future path.
- Route-level code splitting, hero preload, `fetchPriority="high"` (performance).

**Design tokens**

- `--accent` `#7B8105` → `#6D7204` (WCAG AA). *This is a brand token change.*
- Footer `#8a8177` → `var(--dark-mute)` (bug fix, restores the documented token).
- `.btn-dark` normalised to the brief; dark-band body text normalised to `#E8E1D4`.
- Footer column headings `<h4>` → `<h3>`; footer links given ≥24px tap targets.

**Content**

- `privacy.html`: internal "Note for Studio Elpa:" block removed (draft tell).
- `privacy.html`: "last updated" was recomputed with `new Date()` on every page
  load, so it always claimed to be current. Now pinned to a fixed constant.

**Estimate flow**

- **Auto-submit.** The original required a second click ("Send this to Studio
  Elpa") on the results screen, silently losing every lead that had already
  consented at step 5 and then closed the tab. It now submits when the visitor
  presses "See my estimate"; step 6 shows a confirmation line and keeps both the
  booking and "Email Aviva directly" CTAs.
- Privacy link repointed from absolute `https://studioelpa.com/privacy` to local
  `/privacy.html`.

**Markup / accessibility**

- `role="status"` → native `<output>`; `role="region"` → `<section>`.
- The six progress bars are now `aria-hidden` decoration preceded by a visually
  hidden "Step N of 6".
- `role="img"` background divs → real `<img>` elements in 5 places, each with
  descriptive `alt` and `loading="lazy"`.

**Assets**

- `og-image.png` was a **6.5 MB stock template image referenced by nothing**, and
  the site had no social preview at all. Replaced with a 124 KB branded 1200×630
  JPEG built from the real hero and logo; `og:`/`twitter:` tags added.
- `favicon.ico` regenerated from the real `logo-mark.png`.

**CRM**

- Attio deal name uses `Website inquiry - {name}` with a hyphen, not the setup
  checklist's em dash, because the site holds a strict no-em-dash rule. This is an
  internal CRM record title only. Say the word if you'd rather match the checklist
  exactly — it is one line.

---

## §9 Naming and linking Baltic Electrical in every electrical reference

The brief: name and link the electrical partner consistently in **every** electrical
reference, including the Motorized section copy and the remaining unnamed mentions,
so it reads the same way everywhere with no unnamed references left.

The canonical phrase is now, in all eight places:

> our licensed, insured electrical partner, **Baltic Electrical**

always rendered through `<BalticLink />` from `components/partner.tsx`, so the href,
`target="_blank"` and `rel="noopener"` can never drift between mentions.

### The eight mentions

| File | Where |
|---|---|
| `pages/index.tsx` | Motorized Shading service signature copy |
| `pages/index.tsx` | homepage FAQ answer |
| `pages/index.tsx` | ONE ROOF dark band |
| `pages/index.tsx` | §10 trade spec sheet, row 3 |
| `pages/motorized.tsx` | page FAQ answer |
| `pages/motorized.tsx` | "the wiring is handled" section copy |
| `pages/blackout.tsx` | "Wiring handled for you" benefit list (dark band) |
| `pages/founder.tsx` | founder narrative |

Mentions went from **5 to 8**. `blackout.tsx` and `founder.tsx` each needed a new
`BalticLink` import. `SERVICE_SIGNATURE.body` in `index.tsx` was converted from a
plain string to a JSX fragment so it could carry the link; that object is standalone
and rendered once, so no other consumer was affected.

### Four electrical references were deliberately left unnamed

Naming Baltic in any of these would be factually wrong, not consistent:

1. **The two FAQ questions** ("Do I need to hire my own electrician?"). They are
   questions, not statements about who does the work; the answers name Baltic.
2. **The descriptions of the bad alternative at other companies** ("find your own
   electrician", "an electrician you have to find and schedule yourself"). These
   describe someone else's electrician, by design.
3. **"you never have to find or coordinate an electrician"** and "while a client
   hunts for an electrician". Same reason.
4. **The list of things we measure** ("Sun exposure, ceiling height, window
   dimensions, furniture, electrical, safety"), where "electrical" is a survey item.

This is a deliberate decision, not an oversight.

### Two changes worth your veto

- **The §10 spec-list bold label changed** from "A licensed, insured electrical
  partner." to **"Electrical, handled for you."** Without it the bullet would state
  the same credential twice in one sentence pair. This edits approved §10 copy, so
  overrule it if you'd rather keep the original label and accept the repetition.
- **The motorized hero support copy contains no electrical reference at all**
  (verified by reading it). There was nothing there to attribute, so the Motorized
  requirement is satisfied by the section copy instead.

### A real accessibility defect this pass found and fixed

Two of the eight mentions sit on the dark ink band (`#39291B`): the homepage ONE
ROOF band and the blackout benefit list. The olive `--accent` (`#6D7204`) that links
use on light grounds measures only **2.69:1** there, well below AA. It was assumed
the dark path would inherit correctly; **measurement disproved that**, and there was
no dark-band link colour rule in the stylesheet at all.

Fix: `<BalticLink />` gained a `partner-link` class and dark bands now render it in
`--dark-kick` (**6.13:1**) with an underline, which also gives the link a
non-colour affordance against the surrounding cream body copy. Scoped to
`.partner-link` so buttons and other dark-band links keep their own treatment, and
placed last in `styles.css` so source order cannot be beaten.

Measured with `/tmp/balticcontrast.py`, which reads each link's computed colour and
walks up to the first non-transparent background:

| ground | colour | ratio | AA |
|---|---|---|---|
| `--bg` cream `#F5F1EA` | `--accent` | 4.60:1 | pass |
| `--surface` `#FAF7F2` | `--accent` | 4.84:1 | pass |
| dark ink `#39291B` | `--dark-kick` | 6.13:1 | pass |

**8 links measured, 0 below AA.**

Light-ground links keep the site's existing olive-without-underline convention;
changing that sitewide is a design decision, not an accessibility fix.

### QA

| Script | Result |
|---|---|
| `bun run lint` | **0 violations** |
| `bun run build` | **passes**, 8 routes prerendered, both guards pass |
| `/tmp/balticqa.py` (rewritten: 4 routes) | **43 checks, 0 failed**, sitewide count 8 |
| `/tmp/balticcontrast.py` (new) | **8 links, 0 below AA** |
| `/tmp/tradeqa.py` (§10) | **OVERALL PASS** with the new label |
| `/tmp/probe11.py` | body text **10,369** (was 10,308 — the pass adds words) |
| `/tmp/respqa.py` | **826 PASS / 0 FAIL**, no regression |
| `/tmp/faqqa.py` | **642 / 642** |
| `/tmp/journalqa.py` | **258 / 0** |
| `/tmp/qa2.py` | 14 images, 0 broken, 0 page errors |
| `/tmp/qa_copy.py` | clean, brand embargo holds |
| `/tmp/qa_booking.py` | 10 CTAs, 0 misconfigured |
| `/tmp/overflow360.py` | 0 overflow |
| `/tmp/motionqa.py`, `/tmp/h1flash.py` | clean |
| brand audit, `dist` | **clean** |
| em-dash scan, 8 routes | **0** |

`balticqa.py` was extended from 18 checks on 2 routes to 43 checks on 4 routes,
adding a canonical-phrase assertion, an "no unnamed partner phrasing left" regex and
a per-route brand-embargo check.

**One QA finding was a script defect, not a site defect** — the fourteenth this
project. The canonical-phrase check first failed on `/index.html` at 3 of 4. Cause:
the check matched against `innerText`, which reflects **rendered** line breaks, and
the §10 mention's link wraps to the next visual line at 1440px, putting a newline
where the source has a space. `textContent` showed the correct string. The check now
matches whitespace-normalised `textContent`.

---

## §10 V2 Phase 1 — footer lockup, the team block, the hero motion clip

Three pieces of V2, all measured rather than eyeballed.

**Footer lockup.** The reversed cream artwork (`logo-footer-cream.png`, 640x240) replaces
the live-text wordmark in both footers, at the user's explicit confirmation. This
supersedes the V1 decision that dark grounds render the wordmark as Newsreader text.
`footerqa.py` grew 97 → **125 checks** and its two V1 assertions ("wordmark present",
"wordmark is text not bitmap") were **inverted deliberately**, with a comment in the script
saying so — this is a changed requirement, not a silenced failure. The old wordmark contrast
check was retired, because a bitmap has no computed text colour. Because the tagline is
baked into the bitmap, the script now asserts the alt text carries "Studio Elpa", "window
treatments" and "home textiles", so that copy is not lost to crawlers or screen readers.

**One real site defect was caught by that new suite**, unusually — thirteen of the previous
fourteen QA surprises were script defects. `footerqa` failed 123/125 at 1440 and 1180 px:
the lockup's natural ratio is 2.667 but it rendered 2.532, i.e. 263.33x104 instead of
277.33x104. Cause, isolated by trying five inline-style variants in a real browser rather
than by reasoning: `footer.site .f-top` is `grid-template-columns: auto 1fr`, Chrome resolved
that auto track to 263.328 px without feeding the replaced element's height-derived width
into intrinsic track sizing, and the global `img { max-width: 100% }` then clamped the image
to the track while `height: 104px` held. `justify-self` was a red herring — `max-width: none`
alone restored 277.33x104 at exactly 2.667 with zero overflow. Fixed with `max-width: none`
on both desktop rules, `max-width: 100%` restated in the `≤560px` branch where the width is
column-derived, and `aspect-ratio: 640 / 240` on the base rule as insurance. **125/125.**

**Team block.** Elvira Vasiljeva, "Creative Director, Home Textiles" (title confirmed by the
user), added inside `#about`. Deliberately an editorial two-column split, not a card grid and
not a circular avatar. **Her card carries a single approved placeholder line, not a bio** —
the user authorised that exact sentence and nothing more, so no background, tenure or
credentials were invented. Body-text baseline moved 10369 → **10476** as a result; that is
the new `probe11` baseline.

**Hero motion clip.** A new `heroviewqa.py` (15 checks, 15/0) verifies the video mounts,
carries `muted`/`loop`/`playsInline`/`autoplay`/`aria-hidden`, is not paused, advances its
`currentTime`, applies the `.on` fade to computed opacity 1, and **covers the still exactly
(dx/dy/dw/dh all 0.0)**; that under `reduced_motion="reduce"` **zero videos mount** and the
still is visible; and that both encodes return 200 with the right MIME type. Chrome needs
`--autoplay-policy=no-user-gesture-required` for this test. The still stays the LCP element —
untouched, still preloaded, still `fetchPriority="high"` — and the prerender guards are not
tripped, because the video has no text and `prerender.py` renders with reduced motion so the
video is never in the snapshot.

**Full battery re-run for this slice, all green:** `footerqa` 125/125, `respqa` 826/0,
`faqqa` 642/642, `journalqa` 258/0, `contactqa` 171/171, `balticqa` 43/0 (sitewide count
still 8), `balticcontrast` 8 links 0 below AA, `tradeqa` PASS, `heroviewqa` 15/0,
`fastscroll` 0 broken, `overflow360` 0 overflow at 360, `motionqa` 0 stuck reveals,
`h1flash` ALL PASS, `qa_a11y` no reduced-motion errors, `qa2` 0 broken images 0 page errors,
`qa_copy` embargo clean, `qa_booking` 10 CTAs 0 misconfigured, `lint` 0 violations,
`bun run build` clean with 8/8 routes prerendered.

**Not improved by this slice:** the main chunk is now 578.21 kB (gzip 175.22 kB) and
Lighthouse mobile Performance is still **78**. Code-splitting is the next V2 workstream and
has not started, so no performance claim should be made for Phase 1 yet.

---

## §11 V2 AEO foundation

New script: **`/tmp/aeoqa.py`, 438 checks, 438/438.** It reads `packages/web/dist`, not the
dev server, because the AEO surface only exists in the prerendered build.

Per route it asserts: title and meta description match the route registry exactly; one
self-referencing canonical; `og:url` / `og:title` / `og:description`; exactly one JSON-LD
block that parses; the `Organization`, `LocalBusiness` / `HomeAndConstructionBusiness` and
`WebSite` nodes with stable `@id`s; the phone `(561) 836-0026` and `aviva@studioelpa.com`;
`areaServed` of at least 25 cities with named cities and real ZIPs and every entry
`addressRegion: "FL"`; **no street address claimed**; the schema-specific fields for
`Service`, `Article` and `WebPage`; breadcrumb positions, labels and URLs, and that the
homepage has none; **no `aggregateRating`, `reviewCount`, `ratingValue`, `award`,
`foundingDate` or `numberOfEmployees`** anywhere; no em dash; no Lutron / Somfy /
Blindspace; **no dollar figures** (the target-areas market research is prioritisation only
and must never reach public copy or structured data); exactly one `<h1>`.

Sitewide it asserts: all eight titles unique, all eight descriptions unique, `robots.txt`
allows all eight named crawler groups with no blanket `Disallow`, and the generated
`sitemap.xml` `<loc>` list equals the registry order exactly, with no duplicates and all
absolute https URLs.

**A second guard now lives in the build itself.** `prerender.py` gained
`head_defects(route, html)`, which fails `bun run build` if any route's title, description,
canonical or JSON-LD is wrong or missing. It sits alongside the existing hidden-text and
collapsed-FAQ guards, so a regression cannot ship silently.

**Honest caveat:** `packages/web/public/sitemap.xml` was deleted and the sitemap is now
generated into `dist/` from the route registry at build time. The dev server on port 4200
therefore serves no `/sitemap.xml`; only the production build has one. Verify it in `dist`,
not in dev.

Whether the host or CDN blocks any of these crawlers at the firewall or bot-protection
layer is outside the codebase and has **not** been verified.

---

## §12 V2 Journal guide, hero poster, play-once hero motion

New route `/drapery-headers.html`: nine header cards, client copy verbatim, one `<h1>`,
Article JSON-LD and breadcrumb, linked both ways with the homepage Journal and
`drapery.html`. `guideshot` confirms 9 cards, 0 overflow at 1440/390/360, 0 page errors,
and **every image rendered at or below its natural size** — the wide card was caught
upscaling 272 → 297 and fixed to an exact 296x272.

Hero clip no longer loops. Measured the reported end-of-clip jump first: the last frame
against the first is a mean-abs-diff of **54.38** versus **0.013** for a settled
frame-to-frame step, so it was the loop seam, not jitter in the closing frames. **No trim
was needed.** On `ended` the video crossfades out over 600ms (measured 603ms) to the still
and unmounts. Reduced motion mounts no video at all, unchanged and now asserted.

Two QA scripts were corrected because they modelled the old behaviour, not because the
site was wrong: `heroviewqa` asserted `loop is True` (15 → 23 checks), and `journalqa`
treated the third Journal card as unpublished (258 → 264 checks). While fixing the latter
I found its hover section **passed vacuously** — it dispatched a synthetic `MouseEvent`,
which never triggers CSS `:hover`. It now drives a real pointer and asserts `:hover`
actually matched. Six scripts with hardcoded route lists gained the ninth route.

Battery: `lint` 0 · `build` clean, 9 routes, sitemap 9 urls · `aeoqa` **493/493** ·
`heroviewqa` 23/0 · `journalqa` 264/0 · `footerqa` 125/125 · `respqa` 833/0 · `faqqa`
642/642 · `contactqa` 171/171 · `balticqa` 43/0 · `balticcontrast` 0 below AA · `tradeqa`
PASS · `fastscroll` 0 · `overflow360` 0 · `motionqa` 0 stuck · `h1flash` ALL PASS ·
`qa_a11y` clean · `qa2` 0 broken · `qa_copy` 0 em dashes · `qa_booking` 10/0.
**`probe11` body text 10476 → 10481**, expected: the Journal card swapped "Coming soon"
for "Read the guide →".

## §13 The two-person team block and `/meet-elvira.html`

Elvira's bio and Aviva's headshot both arrived, so the team block became real: two cards,
two real photographs, no placeholder line, plus a new `/meet-elvira.html` carrying the bio
**verbatim**. Tenth route in the registry, `schema: "page"` (an `article` schema needs a
`datePublished` I would have had to invent, so I did not).

**The portrait framing was redone on the client's revised instruction.** The first pass
tight-cropped Aviva to head-and-shoulders to match Elvira's close portrait; the client
rejected that and asked for both fitted to one box with `object-fit: cover`, focal point on
the face, neither forced into an awkward crop. Shipped: Elvira untouched at 900x1200 (3:4,
close), Aviva re-cropped generously at 720x900 (4:5, seated, keeping headband, striped shirt
and setting), both into an identical 132x176 3:4 box.

**A correction worth recording.** I had assumed a 4:5 source in a 3:4 box would trim
*vertically*, making `object-position` Y the focal control. Measured, it is the opposite: a
source **wider** than the box fits by height and trims **horizontally**. So Aviva's vertical
framing is decided entirely by the image crop, and only ~6.25% is trimmed off her sides,
symmetric about her face. Since both crops are already face-centred, `object-position:
50% 50%` is correct for both and per-image modifier classes would have been two identical
rules — so I did not add them. The old `50% 26%` was a no-op dressed up as a focal point and
is gone. Crop choice was made by generating three candidates, montaging them beside Elvira,
and looking; the middle one shipped.

Battery: `lint` 0, 74 files · `build` clean, **10 routes, sitemap 10 urls** · `aeoqa`
**545/545** (493 → 545, +52 for the tenth route) · **`teamqa` 99/0 (new)** · `heroviewqa`
23/0 · `journalqa` 264/0 · `footerqa` 125/125 · `respqa` 840/0 · `faqqa` 642/642 ·
`contactqa` 171/171 · `balticqa` 43/0, sitewide 8 · `balticcontrast` 8 links, 0 below AA ·
`tradeqa` PASS · `fastscroll` 0 broken · `overflow360` 0 across 10 routes · `motionqa` 0
stuck · `h1flash` ALL PASS · `qa_a11y` clean, 10 routes · `qa2` 0 broken, 0 errors ·
`qa_copy` 0 em dashes / banned / missing alt / emoji · `qa_booking` 10 CTAs, 0
misconfigured, **`/meet-elvira.html` correctly 0** · `guideshot` clean · `menuqa` PASS.
**`probe11` body text 10481 → 10724**, expected: the second card plus its teaser.

Two QA-script defects fixed (script wrong, site right): a screenshot `clip` mixed
page-relative and viewport-relative coordinates and the exception was swallowing the whole
assertion summary; and a `header a` selector was grabbing the logo instead of the back link.
`teamqa` asserts the core invariant — **both portraits occupy identical boxes** — plus the
measured cover geometry, rather than the old aspect-parity check that only held while both
sources happened to share a ratio.

Main chunk 587.50 → **590.48 kB** (gzip 178.26 kB); the team markup lands in the eagerly
imported homepage. Expected, not a defect, but code-splitting now starts from a slightly
worse number.

## §14 Blindspace: the partnership, compliantly

Blindspace is cleared via WindowModes. This reversed an embargo that had covered
Blindspace, Lutron and Somfy as one group; the reversal is **Blindspace only** and
Lutron/Somfy remain banned sitewide.

**The supplied files are not what the brief described.** Measured with `identify` plus
corner-pixel sampling: `-black.png` (709x297) is a black mark on an **opaque white**
plate, and `-blue.png` (714x305) is the **same black mark on an opaque sage plate**
(`#adc9c6`), not a light or reversed logo. Neither has an alpha channel, so **neither
can be placed on the dark ink band**, and our light ground is cream (`--bg` #f5f1ea),
not white.

Resolution: the lockup sits on a deliberate **white (#fff) plate** with 30/34px padding
and a hairline. The plate matches the artwork's own baked-in white exactly, so the seam
is invisible and the padding reads as the required clear space. Nothing is recoloured,
cropped, obstructed or distorted, and the lockup never touches a dark ground.

Shipped: `BlindspaceLockup` in `components/partner.tsx` (single source of the path, href,
target, rel and alt, exactly like `BalticLink`); a `.bs-lockup` block in `styles.css`
placed **before** the `NAMED PARTNER LINK` block so that block stays last in source
order; a **new concealment section** on `motorized.tsx` carrying the one lockup; and a
text-only Blindspace mention in the `drapery.tsx` difference list.

**The build does not alter the artwork.** The asset optimizer reported the PNG 58%
smaller, which on flat-colour logo art is exactly what a silent recolour would look
like. Measured instead: `compare -metric AE` = **0**, `RMSE` = **0 (0)**, dimensions
unchanged. Lossless.

**Three suites asserted Blindspace was absent** and would have failed as script
staleness, not site defects. `balticqa` and `qa_copy` were narrowed to Lutron/Somfy.
`aeoqa` was **deliberately left banning Blindspace**, with a comment: it inspects only
JSON-LD, and naming a partner inside our own Organization/LocalBusiness graph would
imply an affiliation we must not claim.

New `/tmp/blindspaceqa.py`: **220 passed, 0 failed** against the built dist on 4310.
It asserts the official file, exact href/`_blank`/`noopener`/alt, rendered ratio matched
to both the intrinsic and the official 2.3872 (measured 2.3874), no upscale, no
`filter`/blend/opacity/crop, clear space on all four sides, the white plate, nothing else
inside the link, no second logo, no tagline in the container, no obstruction via
`elementFromPoint`, correct spelling against five misspelling variants, eleven
endorsement phrases absent, and Lutron/Somfy absent on all nine routes.

Rest of the battery re-run green. `probe11` body text **10724, unchanged** (the new copy
is on motorized and drapery, not the homepage). `motionqa` motorized reveals 10 → 12, the
two new blocks. Main chunk 590.48 → **591.19 kB** (gzip 178.36 kB): `partner.tsx` is
reached from the homepage, so the component lands in the eager chunk.

Carried as honest non-completions: **neither lockup works on dark** (a transparent or
reversed file would have to be supplied); the section's kicker, heading and both
paragraphs are **my words**, with only the sentence "For a fully concealed look, we
install Blindspace recess systems" verbatim from the client; and the drapery mention is
text-only **on my judgement**, since the client said "and/or".

## §15 Code splitting, and the measurement that redirected it

The plan was to split the JavaScript. Before writing any of it I measured what the main
chunk actually contains, by enabling sourcemaps for one throwaway build and attributing
every generated byte to its source module. `source-map-explorer` refuses Vite's minified
single-line chunks ("generated column Infinity"), so this was done with `/tmp/smeown.py`,
which decodes the VLQ mappings directly; it left 0 bytes unattributed against 591,178.

Composition of the 591 kB chunk: **react-dom 331 kB**, `pages/index.tsx` 54 kB, the
Runable badge runtime plus html-to-image and goober **63 kB**, `@tanstack/query-core`
27 kB, `@orpc/*` 24 kB, `site-chrome.tsx` 13 kB, `contact-form.tsx` 8 kB, wouter 5 kB.
**Only about 95 kB was ever movable, and 56% of the chunk is the framework.**

**What shipped.** `contact-form.tsx` reached `queries/leads` → `lib/api`, dragging the
whole oRPC client stack onto the critical path for a form that sits below the fold and
cannot be submitted until someone scrolls to it and types. `queries/leads.ts` gained
`submitLeadDirect()`, which calls the same procedure through the same typed `client` from
`lib/api` with no hook and derives its input type from `AppRouterClient` so it cannot
drift. The form drops the static import, holds one reused promise in a ref, warms it on
first `onFocus`, and awaits it in an async `onSubmit` with a `pending` button state. A
failed chunk fetch lands in the same `catch` as a failed submission, where the existing
fallback copy already points the visitor at email. `estimate.tsx` keeps `useSubmitLead()`
and `QueryClientProvider` is untouched.

**The markup stays eager on purpose**: it is real crawlable content, it is in the
prerendered HTML, and its reserved height is what holds CLS at zero.

**Then the network waterfall showed the split was not the problem.** The hero image
finished downloading at **35 ms** while LCP sat at **5662 ms**, and both LCP insight
audits *passed*. That gap is Lighthouse's simulated slow-4G model: LCP is gated on how
many bytes must cross the wire before the hero can paint, and four pillar tiles (~300 kB),
the header logo and the footer lockup were all being fetched eagerly alongside it. Fix:
`loading="lazy"` + `decoding="async"` on the four `.pillar .pimg` tiles (plus explicit
1000x750) and on `FooterLogo`. CLS-safe because `.pillar .pimg` already pins
`aspect-ratio: 4/3` at `width: 100%`, so the box is reserved before the image loads.

**Result, median of three runs** (single runs drift here — LCP moved 5.3 → 5.7 s once with
no change at all):

| | Before | After |
|---|---|---|
| Performance | 78 | **81** |
| LCP | 5.7 s | **4.88 s** |
| FCP | 1.8 s | 1.73 s |
| CLS | 0 | **0** |
| Unused JS | 69 KiB | 63 KiB |
| Main chunk | 591.23 kB / 178.39 gzip | **564.76 kB / 169.61 gzip** |
| Total page weight | 2,094 KiB | 2,065 KiB |

New `leads-*.js` chunk: 26.92 kB raw / 9.44 kB gzip, fetched on first focus.
A11y / best practices / SEO stay 100 / 100 / 100.

**The honest attribution: the code splitting bought about 9 kB gzip and zero points
(78 → 77 on its own, LCP flat). All three points came from four image attributes.**
Total blocking time was 50 ms to begin with, so there was never a JS-execution problem.

**Rejected: lazy-loading the badge runtime.** That 63 kB is the single largest movable
block and first paint needs none of it, but `bun run lint` rejects it —
`web-app-keeps-runable-runtime` requires a **static** import in `app.tsx`. Leaving a
static import beside a `lazy()` call would satisfy the rule while defeating the split and
gaming a deliberate platform guard. Reverted in full; `app.tsx` is untouched. **That 63 kB
is not ours to move**, and it is why the chunk cannot get much below 564 kB.

**Verification.** New `/tmp/splitqa.py`, **26 passed / 0 failed**, run against the built
dist rather than the dev server (chunk names only exist in a real build). It asserts: no
`leads-*` chunk on initial load; every field and an enabled submit button present without
it; the form and its labels present in the **JavaScript-disabled** prerendered HTML; the
chunk arriving after first focus; validation still running with **zero** network calls;
focus still moving to the first invalid field; a real submit reaching the procedure; the
failure branch rendering with `role="alert"` and the mailto fallback; and the button
re-enabling with its label reset. **It carries the same network-abort guard as the other
three form scripts**, so it cannot repeat the incident where real QA leads reached
Formspree and the Sheet.

Two initial failures in that script were **the script's fault, not the site's**: `.btn` is
`text-transform: uppercase`, so `inner_text()` reported "SEND IT OVER". Switched to
`text_content()`. Twenty-third instance of a QA script, not the site, being wrong.

Full battery green afterwards: `contactqa` 171/0, `respqa` 840/0 with CLS unchanged
(0.0000 at 768 and 390, 0.0015 at 360), `qa_a11y` faded=0 and no reduced-motion errors,
`pillarqa` PASS desktop and mobile, `motionqa` 0 stuck / 0 initLeft, `blindspaceqa` 220/0,
`aeoqa` 545/545, `faqqa` 642/642, `teamqa` 99/0, `balticqa` 43/0 sitewide 8, `footerqa`
125/125, `journalqa` 264/0, `heroviewqa` 23/0, `qa_booking` 10 CTAs 0 misconfigured,
`overflow360` 0 on all 10, `fastscroll` 0 broken, `h1flash` ALL PASS, `qa`/`qa2` all 200
with zero page errors. `probe11` body text **10724, unchanged** — correct, because every
change here was an attribute or an import, never copy. Build clean, 10 routes prerendered,
sitemap 10 urls, all three prerender guards passed.

One new benign artifact: `qa.py`'s `broken_images` list may grow now that the pillar tiles
are lazy. If it flags `tile-*.jpg`, confirm with `qa2.py`, which uses a settle window,
before believing it.

**Honest non-completions:** performance is **81, not the 90+ V2 asks for**, and the
remaining gap is page weight, not code; 63 kB of eager JS is locked in place by the
template lint rule; `@tanstack/query-core` (27 kB) stays eager because `Provider` must
stay mounted; `react-icons` and `react-hook-form` are declared but imported nowhere, so
removing them would move no number and they were left alone; and **the deferred submit's
success path is unverified end to end**, because verifying it means transmitting a real
lead. Only the failure path is proven.

## §16 Phase 2 service pages, the spec-list grid bug, and the hero clip swap

**The spec-list bug.** Homepage `#designers` row 03 rendered the Baltic Electrical link on
top of its own sentence ("Electrhunts"). Cause: `.trade .spec-list li` is `display: grid`,
and a grid container blockifies every inline-level child into its own grid item, so the `<a>`
became a separate item and was auto-placed into the 34px numeral column. Fixed by wrapping
all four detail runs in `<span class="spec-detail">` and pinning `grid-column: 2`. Verified
by `/tmp/specqa.py` at 1440/390/360: **72 passed, 0 failed**. The script itself was wrong
first, counting `getClientRects()`'s duplicate rect for an inline element and its inner text
run as an overlap; de-duplicated to within 1px.

**Phase 2 pages.** `/roller-solar-shades.html`, `/roman-shades.html`,
`/natural-woven-shades.html`, all lazy-loaded, all registered in `site-routes.json` (now 13
routes), all linked from the homepage services grid. Build prerenders 13 routes, sitemap has
13 urls, all three prerender guards pass.

| Check | Result |
|---|---|
| `bun run lint` | 0 violations, 77 files |
| `bun run build` | clean, 13 routes, 13 sitemap urls |
| `qa_copy.py` (13 routes) | 0 em dashes, 0 banned words, 0 missing alt, 0 emoji |
| `qa_booking.py` | 19 booking CTAs, 0 misconfigured |
| `balticqa.py` | 53 checks, 0 failed, 9 canonical linked mentions |
| `specqa.py` | 72 passed, 0 failed |
| `heroswapqa.py` | 25 passed, 0 failed |

Six QA scripts carried hardcoded route lists and were stale by three routes
(`qa.py`, `qa_a11y.py`, `qa_copy.py`, `qa_booking.py`, `overflow360.py`, `motionqa.py`), plus
`balticqa.py`'s sitewide count. All updated.

**Hero clip swap.** New reversed clip encoded to `hero-motion.mp4` 1,379,199 B and
`hero-motion.webm` 543,054 B, 1600x900, audio stripped at the encoder. 1.92 MB total, under
the ~4 MB budget. Behaviour was already exactly what was asked and is unchanged: plays once,
no loop, 600ms crossfade to the still, then unmounts; reduced motion mounts no video and
fetches no clip bytes. The still is now the clean final artwork, which closes the
long-standing pencil-marks non-completion; srcset's top candidate is 1365w, not 1800w,
because that is the master's real width.

**The seam is not seamless, and this needs a decision.** Measured through the same CSS grade
in the same box: clip final frame mean RGB (194.6, 168.6, 138.3) against the still's
(212.5, 209.0, 202.8), rendered RMSE 0.176. A scale search rules out a framing offset (best
fit 1.06 at 0.169 versus 1.00 at 0.172, i.e. flat). The gap is baked-in amber warmth plus
real differences between the two renders. Not corrected, because colour-correcting supplied
artwork is the client's call. See open item 11.

## Open items before go-live

1. **`estimate.html` shows unconfirmed pricing to real prospects.** The original's
   own warning is preserved verbatim in the code: drapery prices are placeholder
   assumptions with no drapery book provided, `PRICE_ADJUST = 0.70` is "estimates
   shown at 30% below book-derived figures (per Aviva, Jul 2026)", and the install
   and project-minimum figures are assumptions. I ported the maths faithfully and
   **changed no numbers**. This needs Aviva's sign-off before the page is public.
2. **Attio.** Add `ATTIO_API_KEY`, `ATTIO_PIPELINE_ID` and `ATTIO_STAGE_NEW_LEAD`
   to `.env`, then re-run the four Attio checklist assertions above. The
   Attio ↔ Google Workspace sync is configured inside Attio, not by the site.
3. **Send one real test submission** at go-live to confirm the notification email
   lands, then delete the test record from Attio and the sheet.
4. **Lighthouse performance is 81, not 90+.** Prerendering, gzip, inline CSS, a hero
   `srcset`, the motion refactor, self-hosted fonts and now lazy below-fold images took
   mobile from 54 to 81 (see §8 and §15). The earlier theory that the main chunk's parse
   cost gated LCP was **measured and disproved** in §15: total blocking time is ~66 ms and
   removing 26 kB of JS moved nothing. The remaining gap is **page weight** — see item 10.
5. Confirm you're happy with the privacy-link repoint and the Attio deal-name hyphen.
6. **All four V2 content blockers are now RESOLVED.** The nine drapery-header card
   texts arrived and the guide ships at `/drapery-headers.html`; the hero video poster
   is the supplied clean final artwork; Elvira's full bio arrived and ships **verbatim**
   at `/meet-elvira.html`, replacing the placeholder line; and Aviva's headshot arrived,
   so the team block carries two real photographs and no placeholder.
   Two smaller team questions are open in its place, neither blocking:
   **(a)** the portrait box is 132x176, which is small for "warm lifestyle portraits" —
   the client asked for the same card size, so it was kept, but it can grow on request.
   **(b)** `.wrap.two` still carries "Read a note from our founder →" directly above
   Aviva's "Read more →", and both target `/founder.html`. Two links to one page within
   a few hundred pixels. **Left in place pending the client's call, not removed silently.**
7. **The hero still is now the clean final art, but we lost the 1800w srcset tier.**
   `hero.jpg`, `hero-1120.jpg`, `hero-780.jpg` and `hero-poster.jpg` were all regenerated
   from the supplied clean artwork, so the stray pencil marks are gone. That master is
   only **1365px wide**, so the srcset's largest candidate dropped from 1800w to 1365w
   rather than upscale bytes with no detail behind them. **A full-resolution export would
   restore the high-DPI tier.**
8. **Confirm both article publication dates** — `2026-07-01` for the blackout story and
   `2026-09-08` for the headers guide are assumptions, and they appear in JSON-LD.
9. **Two Blindspace questions.** **(a)** Neither supplied lockup works on a dark
   background: both are opaque with a black mark, and the `-blue.png` is that same black
   mark on a sage plate rather than a reversed logo. If you ever want the lockup in the
   dark ink band, we need a **transparent-background or genuinely reversed export**.
   **(b)** You said "Motorized and/or Custom Drapery". I put the single lockup on
   `motorized.html` and made the drapery reference **text-only**, on the reading that one
   lockup sitewide is the more conservative interpretation of "standalone with clear
   space". Say the word and I will add a second lockup to `drapery.html`.
10. **The hero video is now the largest remaining performance lever, and cutting it is
    your call, not a refactor.** After §15 the homepage weighs 2,065 KiB, of which
    `hero-motion.webm` was **682 kB** — roughly a third of the page, downloading in
    parallel with the hero image that Lighthouse is timing. **§16's clip swap has already
    cut the served WebM to 543 kB**, so restate the numbers before re-deciding. Every
    code-level lever is either spent or locked by the template. The remaining options, in
    order of gain: drop the clip and ship the still alone; delay the video request until
    after the hero image has painted (keeps the motion, costs a beat before it starts);
    or re-encode harder at some quality cost. The clip is a deliberate brand decision, so
    I have changed nothing beyond the swap you asked for. **Which do you want?**
11. **The hero crossfade seam does not match, and correcting it means altering your
    artwork.** The new clip was supplied on the understanding that its final frame
    "matches the static hero exactly". Measured through the identical CSS grade that both
    the `<video>` and the `<img>` carry, it does not: the clip's last frame means
    **RGB (194.6, 168.6, 138.3)** against the still's **(212.5, 209.0, 202.8)** — a
    **64-level gap in the blue channel** — for a rendered **RMSE of 0.176** across the
    seam. A framing or scale offset is ruled out: after normalising colour per channel,
    the best scale fit is 1.06 at RMSE 0.169 versus 1.00 at 0.172, which is flat. The gap
    is baked-in amber warmth plus genuinely different shading and floor shadows between
    the two renders, and no transform corrects that away. Side-by-side evidence is at
    `hero-seam-evidence.png`. **Four options, your call:** **(a)** ship as is, since the
    dissolve reads as warm sunlight cooling to paper; **(b)** colour-correct the clip
    toward the paper white, matching per-channel mean and standard deviation, which
    alters supplied artwork; **(c)** use the clip's own final frame as the resting still,
    which contradicts your instruction to crossfade to the clean art and is lower
    fidelity than the master; **(d)** re-render the clip from the clean artwork so its
    last frame is literally the still. **(d) is the only one that is genuinely seamless.**

---

## §17 The full service page set, the static hero, and the v3 clip that freezes

### The seven new service pages

Thirteen services now have a page each. The new seven are
`/smart-home-window-treatments.html`, `/specialty-shaped-windows.html`,
`/drapery-hardware.html`, `/european-fabrics.html`, `/flame-retardant-drapery.html`,
`/hospitality-window-treatments.html` and `/custom-home-textiles.html`. The registry went
13 to 20 routes, each with a unique title and description, one `<h1>`, real crawlable body
text, a canonical URL, breadcrumbs, and a soft CTA.

`hasOfferCatalog` is now **derived from the route registry** rather than hand-maintained,
so it lists all thirteen services with URLs and can never fall behind the pages again.

On the homepage, six services stay as cards and everything past them is a link list under
**"More from the studio"**. That is my call, not yours — say if you want a different
treatment. It also fixed two real defects: the Decorative Hardware card was a dead link,
and `/blackout.html` was not linked from the homepage at all.

`drapery.html`, `motorized.html` and `blackout.html` each gained a "Where this goes next"
block. They were not rebuilt.

**All copy on all ten new service pages is mine**, as are the registry titles and
descriptions. The flame-retardant page claims no certification of our own and describes
only what the mill documents; **every compliance sentence needs Aviva's sign-off before
go-live.**

**The seven new pages cross-link services and Journal but NOT geo pages, because no geo
page exists yet.** Phase 3 must retrofit geo links into all thirteen.

### The hero is now completely static

You asked for the entrance animation, the headline stagger, the fade/rise and any parallax
to go. The note I inherited said the stagger and parallax were already removed. **That was
wrong** — all three tweens were still live, and I measured them before deleting them. The
headline, subcopy and CTAs now paint in place at opacity 1 with no transform, early and
late, on desktop and mobile. Scroll reveals on the rest of the page are untouched, and
GSAP still loads on the homepage to drive the process progress line.

**One judgement call you should overrule if I read it wrong.** Your explicit list was
entrance motion, but the next sentence said *the only motion in the hero is the video*, so
I also removed the two ambient CSS loops: the 24-second breathing zoom on the frame and
the 34-second sunlight sweep across it. A half-measure would have satisfied neither
reading. Both are one revert away.

### The v3 clip freezes on its last frame

The new master genuinely does end where the still begins: its final frame measures
**RGB (214.9, 208.6, 202.0)** against the clean still's **(212.7, 208.8, 202.8)** — inside
two levels per channel, against the 64-level blue gap the previous clip had.

The clip is now **played once and left frozen**. The 600 ms crossfade, the `onEnded`
handler and the unmount are gone; the `<video>` keeps its `.on` class at opacity 1 forever
and holds the last decoded frame. Verified in a real browser on both the dev server and
the prerendered build: the element reports `ended`, `paused`, `currentTime` parked at
`duration`, still mounted four seconds later, never carrying the old fade class.

Assets are versioned by filename, so caches are busted: `/assets/hero-motion-v3.mp4`
(886 kB source, 454 kB after the build optimizer, proven faithful) and
`/assets/hero-motion-v3.webm` (601 kB, what Chrome actually fetches). The poster was
renamed to `/assets/hero-poster-v3.jpg` even though its bytes did not change, so the whole
hero set carries one version.

**Two trades to state plainly.** The served WebM grew from **543 kB to 601 kB** with this
cut. And a paused `<video>` now stays in the document permanently holding a decoded frame
instead of unmounting and freeing the decoder.

**Old URLs that now 404 in production:** `/assets/hero-motion.mp4`, `/assets/hero-motion.webm`,
`/assets/hero-poster.jpg` and the interim `-v2` names. Intended, but it is a URL break.

### QA

`lint` 0 violations across 84 files. `build` exit 0, 20 routes, sitemap 20 urls.
`herostaticqa.py` **65/0** and `herofreezeqa.py` **48/0** are new permanent guards; they
replace eight scripts that asserted the motion and the crossfade you removed.
`motionqa.py`, `h1flash.py`, `earlyreveal.py`, `qa_a11y.py` (20 routes), `respqa.py`
**840/0** with CLS 0.0000-0.0015, `aeoqa.py` **1095/1095**, `qa.py`, `qa_copy.py`,
`qa_booking.py` 40 CTAs / 0 misconfigured, `balticqa.py` **73/0** with 11 linked mentions,
and `overflow360.py` 0 overflow on all 20 routes at 360px — all green.

**Lighthouse has NOT been re-measured.** The last median was 81, before Phase 2. Seven
routes, a new hero clip and every hero motion change have landed since, so treat 81 as
stale rather than current.

### Open items, updated

- **Item 11 (the crossfade seam) is CLOSED.** The dissolve no longer runs, and the frame it
  would have dissolved to matches the still anyway. The four options are withdrawn and
  `hero-seam-evidence.png` is obsolete.
- **Item 10 (hero video weight) restated: the served clip is now 601 kB**, not 682 kB.
  The levers are unchanged — ship the still alone, delay the video request until after the
  hero image paints, or re-encode harder.
- **New:** should the still `<img>` stay? It now only ever shows as pre-roll, under reduced
  motion, or if the video fails. It must stay as the LCP element, but the poster
  (`hero-poster-v3.jpg`, byte-identical to `hero.jpg`) is arguably redundant weight.
- **New:** confirm the seven shortened slugs, and confirm that "Decorative Hardware" and
  "Drapery Hardware" are one service.
- **New:** photography for all ten new service pages. Every one reuses homepage art. There
  is no arched-window photo, no restaurant photo and no fabric close-up.

## §18 The handwritten footer signature

The footer text sign-off `Aviva, Studio Elpa` is gone. In its place, a cream handwritten
signature image sits directly beneath the footer brand-statement line, inside a new
`.f-voice` wrapper that keeps `.f-top`'s two-column grid intact.

**Green after the change.** `footerqa.py` had to be rewritten first (it asserted `.f-sign`
and `sayChildren == ["f-begin","f-sign"]`, both of which no longer exist) and now passes
**200/200** across 1440/1180/390/360 plus the dist HTML. Full battery re-run: `qa_a11y`
clean on 20, `qa` clean, `qa2` 18 images 0 broken, `qa_copy` clean, `respqa` 840/0 with CLS
0.0000-0.0015, `overflow360` 0 overflow on 20 routes at 360px, `motionqa` green, `aeoqa`
1095/1095, `qa_booking` 40 CTAs 0 bad, `balticqa` 73/0 with 11 mentions, `herostaticqa`
65/0, `herofreezeqa` 48/0.

**The asset is faithful.** 3374x1521 master, real alpha, cream ink; no trimmable margin
(the strokes run to the canvas edge, so 2.218:1 is the true ratio). Shipped at 420x189,
17,662 B, 2x its 210px box. The build optimizer cut it 40% to 10,529 B and I proved it
bit-for-bit lossless (alpha RMSE 0.00000, composited-over-ink RMSE 0.00000).

**A missing footer logo was a false alarm in my own harness, not a site defect.**
`scrollIntoView()` plus a fixed wait does not reliably trigger Chrome's lazy-load in
headless: the lockup reported `complete: false`, `naturalWidth 0` and fired zero network
requests while being fully visible and correctly boxed, then screenshot as a blank column.
An incremental human-like scroll (`/tmp/lazyprobe.py`) shows 18 images and 0 failures. Every
screenshot harness now forces `loading='eager'` on all images, not just the one under test.

### New open items

- **The footer CTA column is now unsigned.** The text sign-off was deleted outright, not
  duplicated. If you want the CTA to keep a sign-off, say so and it comes back as text.
- **The sans "Studio Elpa" line under the signature was not built**, per your follow-up:
  the footer already carries the wordmark in the cream lockup and again in the copyright
  line.
- **The name "Aviva" is no longer crawlable text in the footer.** The image carries
  `alt="Aviva"`, which is right for a signature, but it contributes nothing to on-page copy.
  Aviva is still named in real text in the About section and on `/founder.html`.
- **The signature is homepage-only.** `LandingFooter`, which every service page uses and the
  geo pages will use, has no brand-statement line and therefore no signature. With 13
  service pages live and the geo layer next, the sign-off is absent from most of the site.
  Should it be added there?
- **Confirm the size.** Shipped at 210px desktop and ~205px on a 390px screen, the top of
  your 180-210px band, using the discretion you gave me on mobile.

## §19 The footer brand line and the right-offset sign-off

The footer statement now reads, verbatim as you gave it:

> Come with us, into a life touched by beautiful textiles.

The handwritten signature sits directly beneath it, offset to the right so it lands at the
end of the sentence rather than under its start, and it is smaller: 170px wide, down from
210px. The CTA column stays unsigned. Nothing else in the footer moved.

**How the right offset works**, in case a future change disturbs it: the text block hugs its
own text (`width: fit-content`, capped at a 42ch measure), so `margin-left: auto` on the
image pushes it to the end of the sentence. If that block were full width, the signature
would drift to the far right of empty space instead. The serif size and measure were moved
from the paragraph onto that wrapper so the statement and the sign-off share one measure by
construction; the paragraph class has exactly one use site, so that was safe.

**"Life touched by beautiful textiles" is recorded as the brand line** in a source comment
and in `task.md`, with the instruction that Phase 3 carries this statement and this signature
onto the service and geo page footers, which today have neither.

### Something I got wrong and caught before shipping

My first version of the width cap overflowed a 360px-wide phone by 12px. It looked right in
screenshots at 1440 and 390, and one of the guard scripts called it clean. The responsive
battery disagreed, and it was correct: a percentage width cap on a grid item measures against
the column, not against where the item actually starts, so the block ran 12px past the screen
edge. Fixed with the right CSS primitive and re-verified.

Two consequences worth stating plainly:

- **One of my guards (`overflow360.py`) gave a false clean.** I do not trust it until I have
  reconciled it against the responsive battery that caught this. That work is outstanding.
- **390px is not a narrow enough test.** I will not call mobile clean again without a 360px
  measurement.

### Verified

Lint clean (84 files). Build clean, 20 routes, sitemap 20 urls. Responsive battery 840 pass /
0 fail across seven widths down to 360. Footer suite 209/209 against the new contract.
Overflow probe: zero offenders at 360 on both the dev server and the production build.
Accessibility, copy, image and link suites all clean. Desktop and mobile footer screenshots
read and confirmed by eye.

### Open items

- **Confirm the size.** 170px is my read of "small", and it is below the 180-210px band you
  gave for the previous revision. Easy to nudge either way.
- **The brand-line note did not save to my cross-chat memory** - five attempts, all rejected
  on malformed input from me, not a tool fault. It is safely in the repo (`task.md` and a
  source comment), so this project is covered, but it will not follow me into a new chat. Say
  the word and I will retry it cleanly.
- **The signature and brand line are homepage-only today.** Phase 3 fixes that; it is now a
  committed requirement rather than an open question.

## §20 The footer note: one handwritten image replaces both lines

The typeset brand statement and the separate handwritten signature are both gone. In their
place is the single artwork you supplied, containing the whole sentence, the heart and the
"Aviva" sign-off, cream on transparent, sitting on the dark footer. It renders 580px wide on
desktop, inside the 520-620px band you gave, with the original aspect ratio preserved
exactly, and it is pushed to the right so it balances the cream logo on the left.

Nothing else in the footer moved, and the footer is the same height as before: the image
reserves its box up front, so there is no layout shift when it loads.

### The sentence is still real text, three ways over

You asked for it and it matters more than usual here, because this site is being built to be
read by AI assistants as much as by people. The sentence survives as:

- the image's `alt` text, carrying the statement and the sign-off together
- a hidden paragraph behind the image with the statement verbatim, present in the page
  source and in the accessibility tree, positioned off-view rather than switched off
- Aviva's name in ordinary visible text in the About section and on `/founder.html`

**One judgement call I made:** the hidden paragraph is marked `aria-hidden`. Without it, a
screen reader would announce the sentence twice in a row, once from the image and once from
the paragraph. With it, the sentence is announced once and stays fully crawlable in the
source. If you would rather it be announced by the paragraph instead of by the image, that is
a one-attribute change in either direction; say which you prefer.

### The artwork, and why the file on the site is not the file you sent

The original is 5096x4051 and reports an aspect ratio of roughly 1.26. That number is an
artifact: only about 1.5% of its pixels are solid, and there is faint haze and a scatter of
stray pen dots spread over almost the full height. Measured against the actual ink, the
handwriting occupies a band with a ratio of about 2.43. Had I sized the file as sent, the
footer would have reserved 461px of height for 239px of handwriting, roughly 45% dead space,
and the balance you asked for would have been lost.

So the shipped file is your artwork **cropped to the ink with a small pad**, then resized. It
is a crop only. No pixel inside that box was altered and no stroke edge was touched, so the
handwriting is exactly as you drew it, antialiasing included.

### The one cost, stated plainly

The note ships at **52,590 bytes**, against 10,529 bytes for the small signature it replaces.
That is about 42kB more footer artwork. It sits below the fold and loads lazily, so it should
not affect how fast the page feels or scores, but it is a real increase and you should know
it.

I did try to shrink it. Reducing the colour count got it to 18-22kB, a seven-fold saving, but
measured against the ink it damaged the soft edges of the strokes on more than 20,000 pixels.
Handwriting is mostly edge, so that was not a trade worth making without asking. The tools
that would do this properly without quality loss are not available in this environment. If
the weight matters to you, the honest options are a slightly smaller display width or a
flattened version on the dark brown rather than a transparent one.

### Verified

Lint clean. Build clean, 20 routes. Footer suite rewritten against the new contract and
passing 466/466 across eight widths from 1440 down to 360. Responsive battery 840 pass / 0
fail. Overflow probe clean at 360 on both the dev server and the production build.
Accessibility, copy, image and link suites clean. Footer screenshots at five widths read and
confirmed by eye: logo left and note right on desktop, both stacked and left-aligned on
phones, where a right-pushed note under a left-aligned logo would have read wrong.

I also confirmed the build's image optimizer did not alter the artwork while compressing it:
composited on the actual footer brown, 133 pixels out of 641,080 differ perceptibly.

### Open items

- **The `aria-hidden` decision above** is mine and reversible in one attribute.
- **The weight**, 42kB up on the footer. Options listed above if you want it back.
- **Still homepage-only.** `LandingFooter`, used by all 13 service pages and by the geo pages
  next, has neither the statement nor the sign-off. Carrying both onto those footers is a
  committed Phase 3 task, not an open question.
- **The old signature file is now unused** but left on disk rather than deleted, in case you
  want it back somewhere. It costs nothing on the pages that do not use it.

---

## §21 Custom Drapery photography

The photo you sent is now the Custom Drapery image. It appears in two places, which were the
only two places Custom Drapery used a photo of its own:

- the lead treatment card on the homepage, with your alt text applied word for word
- the hero at the top of the Custom Drapery page

Your alt text reads: "Custom drapery in soft blue linen framing floor-to-ceiling windows in a
South Florida bedroom." The hero is a CSS background image rather than a picture element, so
there is no alt attribute to set there. That is correct behaviour, not an omission: the hero
is decoration behind a headline that already says what the page is about.

### One thing I did not change, on purpose

The Hospitality and Restaurant page was also using the old drapery photo for its hero. I left
it alone. It is a different service, and swapping its photography under the heading of a
Custom Drapery request felt like a decision that is yours rather than mine. Say the word and
it takes a minute.

### The card crop is untouched, and slightly better than before

The card's dimensions and its `object-fit: cover` behaviour were not modified at all. Worth
knowing why the result looks tidier anyway: your photo is 1264 by 848, a ratio of 1.49, and
the card box is 1.45. The old photo was 1.60. So the card now trims about 2.4% off the sides
instead of about 9%, and the photo still has more than two and a half times the resolution the
card needs on a large screen.

It also ships lighter. Compressed it comes out at 138kB against the old photo's 255kB.

### Worth your call

The hero on the Custom Drapery page is the one place the fit is imperfect. A hero is much
wider than it is tall, so it crops roughly a third off the top and bottom of your photo. I
read it at desktop and phone widths and it holds up, the bed, the blue panels and the glass
all stay in frame. But the dark wash over the hero was tuned for the old photo, which was
darker through the middle. Yours is pale bedding right where the body copy and the outlined
"Get a quick estimate" button sit, so the text is softer against it than it used to be on a
phone.

I have not touched it, because both fixes, deepening the wash or shifting the crop upward,
change the crop behaviour you asked me to preserve. Two honest options if it bothers you: a
slightly stronger wash on that hero only, or a second crop of the same photo cut for a wide
hero shape.

### Verified

Lint clean. Build clean, 20 routes. A new suite for this swap passes 35 of 35: it checks the
card's source, your exact alt text, the photo's true pixel size, that `object-fit: cover` and
the 16 by 11 card box are still in force, the rendered crop at three widths, the hero's
background, and that Hospitality is still on the old photo as intended. Image, responsive and
overflow suites all clean, including 360px. All four screenshots read by eye.

## §22 The three V2 changes: Roller folded into Motorized, a bigger hero, and the footer swap

Three changes, all done, nothing published. Taking them in the order you asked.

### 1. Roller Shades is gone, and Motorized Shades absorbed it

There is now one page for powered and solar shading instead of two. The standalone Roller
Shades card is off the homepage, and everything that was genuinely only on the roller page
moved into Motorized Shades rather than being thrown away: the solar screen openness
explanation, dimout, blackout, and the bit about keeping the view. Three questions came with
it, on choosing an openness factor, on night privacy behind a solar shade, and on very wide
windows. "Solar shades" survives as a term inside Motorized, exactly as you asked. The word
"roller" is gone from every sentence a visitor can read.

The old address still works. `/roller-solar-shades.html` is now a short page that says roller
and solar shades are Motorized Shades now and sends the visitor straight to `/motorized.html`.
Nothing on the site links to it any more, but old bookmarks, anything Aviva has sent by email,
and anything Google still has indexed all land somewhere sensible instead of a dead end.

Two details worth knowing, because they are the difference between a redirect that helps and
one that quietly costs you ranking.

The stub tells search engines not to index it AND tells them the real page is
`/motorized.html`. A redirect page that points at itself throws away whatever standing the old
URL had built. Pointed properly, that standing folds into Motorized instead.

The stub also behaves differently for the page-builder that writes your static files than it
does for a real visitor. Without that distinction the builder would have followed its own
redirect and saved a copy of the Motorized page at the roller address, which would have given
you two identical pages at two addresses and no working redirect for anyone who actually
arrived. It is now specifically the builder that is held back, not automated browsers in
general, so the redirect stays testable. I have a test that drives a real browser to the old
address and confirms it ends up on Motorized with the absorbed content present.

Nine other pages mentioned roller or solar shades in passing and were updated. Where a
paragraph already linked to Motorized, the second mention became plain text rather than a
second link to the same place in the same sentence. Nothing on the site 404s.

**Your call, and I have deliberately not made it.** Removing the Roller card leaves exactly
one card in the main services row. I centred it at a readable width so it does not sit in a
hole or stretch across the full page, and it looks intentional. But the honest alternative is
to promote Blackout, or Roman Shades, up from the secondary list so the row still holds two.
That is a decision about which service you want ranked as headline, which is yours.

I also relabelled the estimate tool, since it said "roller" in six places. "Roller shade,
light-filtering" is now "Shade, light-filtering", "Day-night double roller" is now "Day-night
double shade", and so on. No price changed, and prices are still waiting on you.

### 2. The hero image now leads, not the headline

The image frame went from 860px wide to 1280px, inside your 1240 to 1300 range, still
contained rather than running edge to edge. Because the illustration fills the frame's width,
its height went up with it: 484px to 720px, half again as tall. Nothing is stretched. I
measured the shape of the picture before and after and it is unchanged to three decimal
places.

Measured on the page, the image is now 720px tall against the headline's 116px. It is
unambiguously the first thing your eye lands on. The headline and both buttons are still
there, and the animation still plays once and freezes on its last frame with its space
reserved in advance, so nothing on the page jumps while it loads.

**The one thing I could not do, and why.** You asked for taller framing. I got taller by
widening, which is honest growth. What I did not do is crop the picture to a taller shape,
which is the other way to get height. Cropping this particular illustration to anything taller
than its natural shape cuts the boy and the dog out of the frame, and they are the reason the
picture works. This is the same conclusion we reached earlier in the project for the same
reason. If you want a genuinely taller hero, it needs new artwork drawn tall, not this artwork
trimmed. Say the word and I will spec the shape.

Two knock-on changes you should know about, both reversible in one line.

The headline dropped from 72.5px to 58px at its largest. That is the "reduce the headline's
weight relative to the image" part of your brief, and it is 20% smaller, not a token nudge.
The smallest phone size is untouched at 43px.

The headline's line spacing went from 1.0 to 1.04. That one was not a preference. With the new
size, the descenders on letters like g and y were being clipped at two common browser widths.
The fix is four hundredths of a line and it is inside the range we agreed for hero type. The
original reason for the tighter setting was to keep the hero short, which is precisely what
this change reverses.

I also rebuilt the soft edge fade around the image as a proportion rather than a fixed number
of pixels. It had to change: widening the frame opened a range of screen sizes where the frame
is narrower than its maximum, and no single fixed value is right across that range. As a
proportion it now holds the look you approved at every width by itself, and the separate phone
override it used to need is gone.

### 3. The footer swap

The footer now opens with the lockup and your contact details side by side, and closes with
Aviva's handwritten note at the bottom right, next to "Begin a conversation". Practical
information first, the personal note signing off last. That is the order you asked for.

The note itself is untouched. Same image, same size, same reserved space, same wording, and
the invisible text version of the sentence that search engines and AI assistants read is still
there, still word for word, still set up so a screen reader hears the sentence once rather than
twice. "Begin a conversation" is where it was.

**One small thing I decided.** When the contact block moved up next to the logo, it sat
hard against the lockup and left the right half of the opening band empty, which read as
unfinished. I pushed the block to the right edge, so it balances the lockup the way the note
used to. The text inside it is still left-aligned; only the block moved. If you would rather it
sat close to the logo, that is one line to change back.

On a phone the whole footer stacks in the same reading order: lockup, Reach us, hairline,
Begin a conversation, the note, then the legal line.

### Verified

Build clean, 20 pages, sitemap unchanged at 19 addresses. Lint clean.

Sixteen test suites re-run against both the live preview and the built files after the final
change, all passing. The headline numbers: the sitewide structured-data and metadata suite
1088 of 1088, the responsive suite 833 of 833 across seven screen widths, the footer suite 534
of 534, the hero size suite 50 of 50, the hero freeze and static-fallback suites 65 and 48,
the redirect suite passing, and the partner-link, service-page, menu, copy, accessibility and
image suites all clean. No page errors, no broken images, no em dashes, no missing alt text.
No horizontal overflow at 360px, the narrowest phone width worth testing.

The footer suite was rewritten rather than deleted. It had been asserting the old arrangement,
so it would have failed by construction; it now asserts the new one, including that the contact
details come before the note in the underlying page source and not merely in the visual
layout. Styling can fake a visual order, and source order is what a crawler and an AI assistant
actually read. The responsive suite had one leftover rule that said the hero must not get
taller, written back when we were deliberately keeping it short. I re-based that number to the
new approved height and reworded it rather than removing it, so it still catches the hero
growing by accident later.

I read the footer by eye at desktop, tablet and phone widths.

### Still outstanding, unchanged by this pass

The statement and sign-off are still on the homepage footer only. The thirteen service pages
use a slimmer footer that does not carry them, and now does not carry the new ordering either.
That remains a Phase 3 job.

Page speed has not been re-measured since Phase 2, where mobile scored around 81. The hero
image now renders at 1280px wide, so the largest-element load time is worth measuring again
before go-live.

Estimate prices still need your numbers. The duplicate founder link in the homepage About
section is still waiting on your preference. And nothing here has been published.

## §23 Your two photographs, and Blackout moved up

All three changes are in. Nothing is published.

### The restaurant photograph

It is now the hero of the Hospitality and Restaurant page, replacing the drapery photograph that
was there. It suits the page: the dark panelling and the green booth sit behind the headline
without fighting it, and the drapery is legible as drapery, which is the point.

One thing I could not do as written. You asked for `object-fit: cover` and gave me alt text. That
hero is a CSS background image rather than a picture element, so it has no alt attribute to put
your sentence into. This is the same situation as the Custom Drapery hero in §21, and the same
answer: the image is decoration sitting behind a headline that already says "A dining room people
want to sit in", so a screen reader describing the photograph too would just repeat the headline.
No alt is the correct behaviour here, not an oversight. Your sentence is saved as a comment in the
code beside the image so it is not lost if the photograph ever becomes a picture element.

The cropping behaviour you asked to keep is unchanged.

### The hospitality photograph

This one needed a decision from you and you made it, so it is now a new band lower down the same
page, sitting directly after "One team, and a schedule that respects your covers." It is a real
picture element, so your alt text IS applied, word for word.

I kept the photograph at its natural proportions rather than cropping it into a letterbox strip.
The subject is drapery running from ceiling to floor, and a shallower band would have cut the top
off. I added a short caption underneath.

Worth your judgement on one point: the photograph reads as much like a high-end private bedroom as
a hotel room, to my eye. Your alt text calls it a hotel-room window. On a page about hotels and
restaurants that may be exactly what you want, since it shows the treatment rather than the
building. But it is your call, and if you would rather the alt text not say hotel, it is a one-line
change.

### Blackout moved up beside Custom Drapery

Done, and the row is balanced again the way it was when Roller sat there. Motorized Shades is
untouched above it. Blackout has been removed from the small link list underneath, so it now
appears exactly once on the page rather than twice.

You asked to see the card copy I drafted from your Blackout page:

> **Blackout Shades and Drapery**
> True dark, not a dimmer version of the room. Fitted tight to the glass or layered behind drapery
> so the light has nowhere to slip through, and by day the room still feels bright.
> Bedrooms · nurseries · real darkness

That is pulled from three things already on that page: fitting tight to the glass, nurseries, and
dark by night without being gloomy by day. Change any of it and I will match it.

### Something you should look at before this goes live

Every automated check passed and the row is perfectly balanced, but when I looked at the actual
page I do not think the Blackout card works yet, and the reason is the photograph.

You chose the bedroom photograph already used on the Blackout page, which was sensible: no new
asset, and consistent. On that page it works, because the headline immediately tells you the room
is about to be made dark. On the homepage it does not have that help. The photograph shows a bright
room flooded with sunshine, with sheer curtains pulled wide open and the garden doors letting the
light straight in. Directly beneath it the card promises true dark and light with nowhere to slip
through. The picture argues with the words.

There is a second, smaller thing. The card next to it, Custom Drapery, is also a bedroom, also with
the bed on the left and glass doors on the right. Side by side on a desktop screen the two look
like near-copies of each other, so the most important row on your homepage is now two similar
bedrooms.

I have left it exactly as you asked, because this is a photography decision and it is yours. Your
options, roughly in order of how well they fix it:

1. Send me a genuine blackout photograph, a bedroom actually darkened, ideally mid-close so you can
   see the seal at the glass. This is the only real fix, and it is the strongest possible image for
   that card.
2. Put the drapery photograph that just came off the hospitality hero onto one of the two cards.
   It is now unused, so it costs nothing, and it breaks the two-bedroom repetition.
3. Change the Custom Drapery photograph instead and leave Blackout alone.
4. Leave it as it is.

Related: that bedroom photograph now appears in three places, on this card, on the Blackout page
hero, and on the European Fabrics page hero. Option 1 would relieve that too.

I also wrote the card's alt text to describe what the photograph genuinely shows, drapery drawn
back from garden doors, rather than claiming darkness that is not in the picture.

### Checks

The full suite is green: 2,600-odd individual assertions across responsive layout, the AI-answer
and search layer, the footer, the hero, accessibility, copy rules and brand embargoes. No broken
images, no console errors, no horizontal overflow at 360px, and layout shift still effectively
zero. The build produces all 20 pages and a 19-url sitemap.

One suite needed extending rather than just re-running. It was checking the five old service titles
and so could not see the promoted card at all. It now also proves Blackout appears exactly as often
as its siblings, which is what catches a duplicate if one ever creeps back, and that the row really
is two columns again.

I read the hero, the new band and the services row by eye at desktop, tablet and phone widths.

### Still outstanding

The footer statement and sign-off remain on the homepage only; the thirteen service pages use the
slimmer footer. Phase 3.

Page speed has not been re-measured since Phase 2, where mobile scored around 81. This pass adds
two more photographs to the site, so it is worth measuring again before go-live.

Estimate prices still need your numbers, and the duplicate founder link in the homepage About
section is still waiting on your preference.

## 24. Centring the hero text on the service pages

Done, on all thirteen service pages rather than only Motorized Shades, so they now match each
other and the homepage.

### What was actually wrong, because it was not quite what it looked like

Before changing anything I measured the hero on every service page. The text block was already
exactly centred over the image, to the pixel. It was not floated to the right.

Two other things were true, and together they produced the effect you saw:

1. The text inside the block was left-aligned, so the kicker, heading, paragraph and buttons all
   ran from the left edge of the block.
2. The paragraph is set to a narrower measure than the heading, and it had no side margins, so it
   sat hard against the block's left edge. Its centre was sixty pixels left of the heading's
   centre. That mismatch is what makes a heading and the sentence under it look untidy.

The dark wash over these hero photographs is also heavier on the left than the right, so a
left-aligned block leaves a dark empty margin beside it and genuinely reads as pushed to the right.
Your instinct was right, the cause was just elsewhere.

Now the whole block is centre-aligned, the paragraph sits evenly beneath the heading with their
centres exactly aligned, and the buttons are centred under both. Vertical centring was already
correct and is untouched.

The Quick Estimate page header was already centred and needed nothing. The Journal article
"Drapery headers, compared" has a plain header on a light background rather than a hero over a
photograph, so I deliberately left it alone.

### One thing I want to raise, and it needs your call

Because the dark wash is heaviest on the left, moving the text to the centre moves it over a
slightly lighter part of each photograph. So I measured the real legibility properly: I found the
exact pixels each letter inks, then read the photograph's colour underneath every one of them, on
all twelve photographic heroes, at desktop and phone width, both before and after the change.

The finding is bigger than this change. These heroes do not meet the accessibility contrast
standard, and they did not before either. Centring the text does not cause that, but it does make
it marginally worse, never better. On the Custom Drapery page the heading goes from 2.75 to 2.07
against a 3.0 minimum, and on the Flame Retardant page almost every pixel of the paragraph is
under the standard both before and after.

I have not changed the look of your photographs to fix it, because that is a brand decision:

1. Deepen the dark wash over the hero photographs a little, sitewide. Most reliable fix, and it
   costs some of the brightness of the images.
2. Make the wash even left-to-right instead of heavier on the left. This is arguably the natural
   companion to centred text, and it helps without darkening the whole thing as much.
3. Leave the wash alone and accept that the hero headlines are decorative over photography.

Separately, on a phone the Motorized paragraph now runs about ten centred lines. Centred text that
long is harder to read than left-aligned. If you like, I can keep the centring on desktop and
left-align just that paragraph on phones. Say the word.

### Checks

Full suite green, nothing needed fixing: responsive layout, the AI-answer and search layer, the
footer, hero, accessibility, copy rules and brand embargoes. No broken images, no console errors,
no sideways scrolling at 360px, layout shift effectively zero, all twenty pages build with a
nineteen-url sitemap. I confirmed the centring is identical on the live build as well as the
preview, and read the heroes by eye at desktop, tablet and phone.

### Still waiting on you

The four photography points from the last note are still open, in particular the Blackout card
photograph on the homepage, which shows a bright sunlit room beside copy promising true darkness.

Also unchanged: the footer statement and sign-off are still homepage only, page speed has not been
re-measured since Phase 2, and the estimate prices and the duplicate founder link still need you.

## 25. The Blackout photograph, and the first geographic page

### Your Blackout photograph is in

The darkened nursery is now in both places it was needed: the Blackout card on the homepage, and
the hero of the Blackout page. Both were showing a bright sunlit bedroom next to copy promising
true darkness, which was the most awkward mismatch left on the site. It reads properly now, and the
crop on the homepage card keeps the glow along the floor visible, which is the whole story of the
photograph.

The alt text is your wording, so anyone using a screen reader gets the same picture in words.

One knock-on benefit: the old bright bedroom photograph is now used only once on the site, on the
European Fabrics page. That gives us one more photograph to work with on the geographic pages,
where we are short.

### The first geographic page, for your approval

This is the start of Phase 3, the geography work. Rather than write twenty pages and ask you to
review them in bulk, here is one to react to first: **Custom Drapery in Palm Beach**.

The copy is the worked example from your brief, used close to as written. The plan for the other
nineteen is the same shape but genuinely different words each time, built from the per-area angles
in your brief. No two pages will be the same text with a place name swapped, which is both what you
asked for and the only version of this that actually works.

Three decisions you confirmed and one you should sanity check on the page itself:

1. Which thirteen neighbourhoods we build. Your list stands.
2. Imagery: the seven city pages get a photograph, the thirteen neighbourhood pages get the
   typographic header treatment instead. We have roughly ten usable photographs and twenty pages,
   and repeating the same image across five geographic pages looks worse than not using one.
3. This page tells search engines and AI assistants that it covers Palm Beach and the 33480 ZIP
   specifically, rather than the whole thirty-city territory. The main Custom Drapery page still
   claims everywhere. That distinction is the entire point of a geographic page.

The one thing to check by eye: whether the Palm Beach page sounds like you. If the voice is right,
the other nineteen follow quickly. If it is not, better to find out on page one.

### Not linked up yet

Nothing on the site links into the Palm Beach page yet. That is deliberate. The links from Custom
Drapery and the other service pages go in once all twenty geographic pages exist, so we wire them
once instead of twenty times. It will not ship unlinked.

### Checks

Everything green: twenty-one pages build with a twenty-url sitemap, the search and AI-answer layer
passes 1146 checks, no broken images, no console errors, no sideways scrolling on a phone, layout
shift effectively zero. I confirmed the new photograph actually loads at full size rather than just
appearing in the code, and looked at both the card and the hero by eye at desktop and phone.

### Still waiting on you

Page speed still has not been re-measured since Phase 2, and twenty new pages are about to be
added, so that needs a proper pass before publish. The footer statement and sign-off are still
homepage only. The estimate prices and the duplicate founder link still need you.
