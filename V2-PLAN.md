# Studio Elpa V2 — build plan

Baseline: V1 complete and committed at `086f35e`, tree clean, dev server up on 4200.
Backup taken: `/home/user/backups/studioelpa-v1-final.tar.gz` (9.3 MB, 185 files).

Sources: `Runnable_V2.md` (13 sections), `Studio_Elpa_Target_Areas.md` (tiered geography),
`Runnable_V2_Page_Copy.md` (Template A/B + per-area angles).

## Scope inventory

| Item | Brief | Count |
|---|---|---|
| Technical AEO foundation (JSON-LD ×5 types, robots, sitemap, canonicals) | §3 | sitewide |
| Service pages | §4 | 12 |
| Service + city pages | §5 | 7 |
| Neighborhood pages | §5 / target-areas | 13 |
| Journal guides | §7 | 10–15 |
| Team addition (Elvira) | §8 | 1 |
| Hero video | §9 | 1 |
| UTM lead-source tracking into Attio | §10 | 1 |
| Performance 90+ mobile | §2, §12 | currently **78** |

That is ~35 new routes. It cannot be one pass. Proposed phasing below.

## Phase 1 — foundation and the things whose assets are already in hand

1. **§3 technical AEO foundation.** Sitewide `Organization` + `LocalBusiness`/`HomeAndConstructionBusiness`
   JSON-LD with `areaServed` from the ZIP tables; per-page `Service`, `Article`, `BreadcrumbList` helpers;
   canonical tags; `robots.txt` rewrite explicitly allowing `OAI-SearchBot`, Googlebot, Bingbot and
   referencing `sitemap.xml`; `sitemap.xml` generated from the route list rather than hand-maintained.
   The brief calls this the unblocker, and every later page inherits it for free.
2. **Route-registration plumbing.** One source of truth for routes shared by the router, `prerender.py`
   and the sitemap, so a new V2 page cannot ship un-prerendered.
3. **Hero video (§9)** — transcode to H.264 MP4 + WebM, strip audio, compress, poster still,
   `prefers-reduced-motion` fallback, deferred so it does not become LCP. (Blockers Q3/Q4 below.)
4. **Footer logo swap** to `logo-footer-cream.png`, contrast-checked; `footerqa.py`'s
   "wordmark-is-text" assertion updated deliberately.
5. **Elvira (§8)** added to the who-we-are section. (Blocked on bio + title, Q2.)
6. **Drapery-headers Journal guide (§7)** — nine-card responsive grid, closing panel, linked from the
   Journal and the Custom Drapery service page; resolves the now-duplicative "More articles coming soon."
   line. (Blocked on the nine card texts, Q1.)

## Phase 2 — the three primary service pages

Custom Drapery, Motorized Shades, Blackout — full Template A treatment, each with `Service` JSON-LD,
unique title/meta/h1, soft CTA, and internal links to the geo and Journal layers.
These are the pages the geo layer will link into, so they come before the geo layer.

## Phase 3 — geography, in bullseye order

The bullseye 15 first, then Tier 1, then Tier 2/3: 7 service+city pages, then the 13 neighborhood pages.
Each page written from its own per-area angle in the page-copy doc — genuinely different text, not a
city-name swap. No dollar figures from the research doc in public copy (see Q6).

## Phase 4 — remaining service pages and Journal guides

The other 9 service pages and the remaining 9–14 guides, batched.

## Phase 5 — lead-source tracking and performance

- §10 UTM capture → lead payload → Attio field. Built config-driven; **not verifiable** until Attio is
  configured (standing open item). Note: wiring an API path changes the form-QA safety calculus, so
  listeners get re-checked before any form QA runs.
- **Performance.** 90+ mobile is a stated acceptance criterion and today the site is 78 with LCP 5.3 s,
  gated on the ~575 kB main JS chunk's parse cost. V2 *adds* ~35 routes and a video. Reaching 90 needs a
  real code-splitting workstream (per-route lazy chunks, trimming the shared bundle), not tuning.
  I do not want to tick that box silently — see Q5.

## Standing constraints carried into V2

Brand voice and V1 rules unchanged; zero em dashes; no invented content, testimonials, stats or imagery;
Baltic Electrical named and linked via `<BalticLink />`; Lutron/Somfy/Blindspace still embargoed;
WCAG 2.1 AA; `.html` URLs; every new route added to `prerender.py`; no publishing.
