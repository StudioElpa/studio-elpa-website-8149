# Studio Elpa — website & lead intake

Custom window treatments and home textiles, South Florida.

This is the Studio Elpa site plus the lead-intake function that feeds Attio CRM.
Pages, copy, and photography are carried over from the original static site; this
build adds motion, accessibility, and CRM wiring.

---

## 1. Running it

```bash
bun install
bun run dev      # http://localhost:4200
bun run lint     # oxlint, must be 0 errors / 0 warnings
bun run build    # production build into packages/web/dist
```

The web port is fixed at **4200**. If it is already in use: `bun run kill:port`.

**Routes keep their `.html` suffixes** (`/drapery.html`, `/estimate.html`, and so
on) so every existing inbound link, bookmark, and search result still resolves.
`/` and `/index.html` both serve the homepage.

| Route | Page |
|---|---|
| `/` · `/index.html` | Homepage |
| `/drapery.html` | Drapery landing page |
| `/motorized.html` | Motorized landing page |
| `/blackout.html` | Blackout landing page |
| `/estimate.html` | 6-step estimate wizard |
| `/founder.html` | Founder note |
| `/journal-blackout.html` | Journal article |
| `/privacy.html` | Privacy policy |

---

## 2. Environment variables and secrets

**All variables live in the single root `.env`.** Do not create `.env.local` or
any other env file. Everything in the table below is read **server-side only**,
inside `packages/web/src/api/routes/leads.ts`. None of it is exposed to the
browser, and none of it is prefixed `VITE_` (any `VITE_`-prefixed variable IS
shipped to the client, so never put a secret behind that prefix).

### Currently used by the lead function

| Variable | Secret | Status | Purpose |
|---|---|---|---|
| `ATTIO_API_KEY` | **yes** | **blank** | Attio API token. While blank, the Attio step is skipped entirely and the fallbacks still capture every lead. |
| `ATTIO_PIPELINE_ID` | no | **blank** | Deal pipeline id. Deals are created without pipeline/stage until this is set. |
| `ATTIO_STAGE_NEW_LEAD` | no | **blank** | Id of the "New lead" stage. |
| `NOTIFY_TO` | no | `aviva@studioelpa.com` | Internal notification recipient. |
| `FORMSPREE_ENDPOINT` | no (public by design) | live | `https://formspree.io/f/mrpgqbnk` — emails the submission to Aviva. |
| `SHEET_ENDPOINT` | no (public by design) | live | Apps Script webhook that appends to the Google Sheet behind AppSheet. |

### Turning Attio on

Attio is **entirely config-driven — there is no code change to make.** Aviva has
not set up her Attio workspace yet, so no API key, pipeline id, or stage ids
exist. Once they do:

1. Create the objects and attributes from `Attio_Setup_Checklist.md`.
2. Paste the real values into `.env`.
3. Restart the server.

Attribute **slugs** Attio derives from those attribute names are collected in a
single `SLUG` constant at the top of `leads.ts`. If an attribute is named
differently in Attio, change it there — nothing else in the codebase refers to
them.

> No pipeline or stage ids have been invented or guessed anywhere in this
> codebase. Where an id is absent the field is simply omitted from the payload.

### Documented future path (deliberately NOT wired)

Google Workspace email sending was **skipped by decision**: Attio and the
existing Formspree endpoint already email Aviva, so a third mail path would only
add a secret to rotate and a second copy of every notification. If a
site-generated email is ever wanted, this is the shape it would take. **None of
these are read by any code today.**

| Variable | Secret | Purpose |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **yes** | Service-account JSON, for the Gmail API with domain-wide delegation. |
| `GOOGLE_IMPERSONATED_USER` | no | Mailbox to send as, e.g. `aviva@studioelpa.com`. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` | no | SMTP relay alternative to the Gmail API. |
| `SMTP_PASS` | **yes** | SMTP or Google app password. |

**Secret hygiene:** `.env` is git-ignored and must never be committed. Secrets
belong in the host's environment settings, not in the repository. Rotate the
Attio key if it is ever pasted into a chat, ticket, or screenshot.

---

## 3. How the lead flow works

Both the homepage contact form and the estimate wizard post to **one** procedure,
`leads.submit` (`packages/web/src/api/routes/leads.ts`), over HTTPS POST. No
personal data is ever placed in a URL or query string.

```
Contact form  ─┐
               ├─→  leads.submit  ─┬─→  1. Attio    (Person → Company → Deal → Note)
Estimate wizard┘    (POST, HTTPS)  ├─→  2. Formspree (emails Aviva)
                                   └─→  3. Apps Script → Google Sheet
```

The three sinks run **concurrently and independently**, each with its own error
handler, so one outage never costs a lead.

### Sink 1 — Attio (primary CRM, skipped while the key is blank)

1. **Person**, upserted on email (`matching_attribute=email_addresses`) so a
   repeat inquiry updates one record instead of creating duplicates. Carries
   project area, lead source, contact type, and the trade-partner flag.
2. **Company**, upserted on name — **only** for trade submissions (interior
   designer / trade partner, architect / builder), so designers can be nurtured
   separately from homeowners.
3. **Deal**, named `Website inquiry - {name}`, carrying source page, project
   area, inquiry summary, and UTM values. `stage` and `pipeline` are attached
   only when the corresponding env ids are present.
4. **Note**, holding the submission verbatim, including the full estimate
   breakdown when the lead came from the wizard.

### Sink 2 — Formspree

JSON POST to `FORMSPREE_ENDPOINT`. This is the mechanism the original static site
used and it is what actually emails Aviva today.

### Sink 3 — Apps Script → Google Sheet

Form-encoded POST to `SHEET_ENDPOINT`, including a `source` field set to
`Contact` or `Estimate`. Kept as a backup feed; the sheet currently drives an
AppSheet app.

### Success, failure, and spam

- The procedure returns `{ ok, sinks }`, where `sinks` reports
  `ok` / `skipped` / `failed` per sink.
- It reports failure **only when every configured sink rejected the lead**. If
  Attio is down but Formspree accepted, the visitor still sees the thank-you,
  because the lead is safely captured.
- On success the form is replaced by the thank-you copy; on total failure an
  inline message points the visitor at `aviva@studioelpa.com`, with their typed
  values left intact so nothing has to be retyped.
- A hidden honeypot field (`trap`) is accepted and silently discarded, so bots
  get no signal from the response.
- With no sink configured at all, the lead is logged server-side and the visitor
  still sees success.

### Attio ↔ Google Workspace sync

> **Attio's Google Workspace sync — email and calendar — is configured inside
> Attio's own settings, not by this website.** In Attio, go to
> **Settings → Integrations → Google Workspace** and connect the
> `aviva@studioelpa.com` mailbox. Attio then logs email threads and meetings
> against the matching Person and Deal records automatically.
>
> This site's only job is to create the Person, Company, Deal, and Note. It does
> not send mail, touch the calendar, or broker that sync in any way. Nothing in
> this codebase needs to change when the sync is switched on.

---

## 4. Pointing the CTAs

All contact details and the booking URL are defined once, in the `CONTACT`
constant in `packages/web/src/web/components/brand.tsx`. Change them there and
every page updates.

```ts
export const CONTACT = {
  phone:     "(561) 836-0026",
  phoneHref: "tel:+15618360026",
  email:     "aviva@studioelpa.com",
  booking:   "https://calendar.app.google/cBDn87e5pR5E6G4w9",
};
```

- Every **"Book a 30-minute call"** CTA points at `CONTACT.booking` and opens in
  a new tab with `rel="noopener"`.
- If the phone number changes, update **both** `phone` (what is displayed) and
  `phoneHref` (what is dialled).

### Logo on dark backgrounds

Only `logo.png` and `logo-mark.png` exist and both are dark-on-light. On dark
bands the site therefore renders the "Studio Elpa" wordmark as live text in
cream Newsreader weight 500 rather than recolouring or forcing the bitmap. If a genuine light/cream
logo file is ever supplied, the swap points are isolated in the `Logo` and
`Wordmark` components in `brand.tsx`.

---

## 5. Exporting static files for Porkbun

```bash
bun run build      # → packages/web/dist
```

Upload the **contents** of `packages/web/dist` to the host's web root. The
current build is **5.4 MB** (5,449,864 bytes), well inside the 40 MB budget.
The largest single files are the 575 kB main JS chunk, the 53 kB stylesheet,
the 44 kB lazy ScrollTrigger chunk, the photography, and the three 22–38 kB
WOFF2 font files.

Two hosting requirements:

1. **SPA routing.** Routing is client-side, so the host must serve `index.html`
   for unmatched paths, otherwise a direct hit on `/drapery.html` 404s. On
   Apache-style hosts, a `.htaccess` in the web root does it:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

2. **The lead function needs a server.** `leads.submit` is server-side code and
   cannot run on static hosting. Either keep the site on Runable, where the API
   is hosted for you, or point the form at the Formspree and Apps Script
   endpoints directly and accept that Attio will not be written to.

---

## 6. Where things live

```
packages/web/
  index.html                    title, meta description, Open Graph, font preload
  vite.config.ts                plugin registration (prerender plugin last)
  vite/prerender-plugin.ts      build-only hook → prerender.py
  vite/prerender.py             static prerender of all 8 routes + build guards
  public/
    assets/                     all 23 original photographs and logos
    fonts/                      the three self-hosted WOFF2 files
    og-image.jpg                1200x630 social card
  src/
    api/routes/leads.ts         the lead-intake function (all three sinks)
    web/
      pages/                    one file per route
      components/
        brand.tsx               CONTACT, Logo, Wordmark
        contact-form.tsx        homepage form
        faq.tsx                 keyboard-operable accordion
        site-chrome.tsx         headers and footers
      hooks/use-motion.ts       CSS reveals via IntersectionObserver, reduced-motion aware
      lib/home-gsap.ts          the only GSAP importer, lazy-loaded on idle
      lib/estimate-engine.ts    estimate pricing and copy generation
      queries/leads.ts          useSubmitLead, readUtm
      styles.css                the whole design system
design.md                       brand tokens and design rules
QA-NOTE.md                      acceptance checklist results
```

Two conventions worth knowing before editing:

- **Assets are referenced by absolute path** (`/assets/hero.jpg`) and live only
  in `packages/web/public/`. Importing an asset from source fails `bun run lint`.
- **`__`-prefixed files and folders are template-managed.** Do not edit them.

### Motion contract

No reveal class sets `opacity: 0` in CSS. The hidden state is applied at runtime
(by the `IntersectionObserver` in `use-motion.ts`, or by GSAP where a scroll-linked
experience uses it), so if JavaScript fails to load, or the visitor prefers reduced
motion, all copy renders immediately in its final state. **Preserve this** for two
reasons: moving the hidden state into CSS would make the site's text depend on
JavaScript, and the prerender step has a build-time guard that fails the build if
any `#root` descendant with text carries an inline `opacity: 0`.

GSAP is no longer the default engine. `lib/home-gsap.ts` is the only module that
imports it, never statically: it is reached through `import()` inside
`requestIdleCallback` and drives a small number of scroll-linked experiences only.
Everything else is CSS.

### Fonts (self-hosted, no Google Fonts request)

The site loads no third-party font. Three WOFF2 files live in
`packages/web/public/fonts/` and are referenced from `styles.css` by absolute
path (`url("/fonts/...")`), never imported from source.

| File | Axes | Bytes |
|---|---|---|
| `newsreader-var-latin.woff2` | `wght` 400–500, `opsz` pinned to 24 | 37,712 |
| `newsreader-italic-latin.woff2` | `wght` 400, `opsz` pinned to 18, static | 22,860 |
| `instrument-sans-var-latin.woff2` | `wght` 400–600, `wdth` pinned to 100 | 27,156 |
| **Total** | | **87,728 (85.7 kB)** |

The eight faces Google previously served (Cormorant Garamond 400/500/600 + italic
400, Jost 300/400/500/600, latin subsets) totalled **242,884 bytes (237.2 kB)**.
Self-hosting is **64% smaller** and removes two preconnects plus a blocking
third-party stylesheet. All three declare `font-display: swap`. `index.html`
preloads only `newsreader-var-latin.woff2`; leave the hero-image preload above it
alone.

Weight ranges are kept **live** so the browser never synthesises a weight, and the
italic is a real face so `<em>` is never slanted synthetically.

**Two traps to know before touching these files.**

1. **`opsz` is what costs bytes.** Left live, the Newsreader roman alone was
   86.2 kB. Pinning the optical-size axis took it to 36.8 kB. Pin it.
2. **Newsreader ships no arrow glyphs anywhere upstream** — not in Google's latin
   slice, not in the full 564-glyph TTF — and the site renders `←`/`→` in seven
   places. Instrument Sans carries them, which needed two things: the sans rebuilt
   from the upstream full TTF, and the declared `unicode-range` widened to include
   `U+2190-2193`. **`unicode-range` gates a font out regardless of what the file
   actually contains**, so any future glyph addition needs both the glyph in the
   file and its codepoint inside the declared range. Belt and braces, `--serif`
   lists `"Instrument Sans"` ahead of Georgia.

To regenerate them:

```bash
pip install --break-system-packages brotli   # fontTools cannot read woff2 without it
```

- **Newsreader:** `curl` the css2 API with a modern-Chrome `User-Agent`, download
  the **`latin`** subset files from `fonts.gstatic.com`, then instance with
  `fontTools.varLib.instancer.instantiateVariableFont(font, limits, inplace=False,
  updateFontNames=False)` and save with `flavor = "woff2"`.
- **Instrument Sans:** built from the **upstream full TTF**
  (`google/fonts/ofl/instrumentsans/InstrumentSans[wdth,wght].ttf`), instanced to
  `{"wdth": 100, "wght": (400, 600)}`, then
  `pyftsubset --unicodes=<latin + U+2190-2193>
  --layout-features=kern,liga,calt,ccmp,locl,mark,mkmk,rlig --no-hinting
  --desubroutinize --flavor=woff2`. That lean build is 27.2 kB, smaller than
  Google's 28.3 kB slice while carrying four glyphs more.

### Prerendering

`packages/web/vite/prerender-plugin.ts` (`apply: "build"`, `enforce: "post"`) shells
out from `closeBundle` to `packages/web/vite/prerender.py`, which serves the built
`dist` on port **4311** with an SPA fallback, drives system Chrome over all **8**
routes with `reduced_motion="reduce"`, and writes the rendered markup back into each
`.html` file. It also inlines the built stylesheet so first paint is not
render-blocked. It is registered **last** in `vite.config.ts`; the asset optimizer
runs after it.

**Two guards fail the build** rather than shipping a broken page:

1. any `#root` descendant with non-empty text and an inline `opacity: 0`;
2. any FAQ `.faq-a` panel that is not `data-open="true"` (the accordion's CSS
   default is open and the collapsed state is applied at runtime, so a
   prerendered collapsed panel would ship permanently shut to no-JS visitors).

**Caveat: prerendering only affects the production build.** `bun run dev` on port
4200 is still client-rendered, so anything you measure in dev is not what visitors
get. Measure against `dist`.

---

## 7. Open items before go-live

1. **The estimate wizard shows unconfirmed pricing.** Carried over from the
   original `estimate.html` with its warning intact at the top of
   `estimate-engine.ts`: the drapery figures are placeholders (no drapery book
   was provided), `PRICE_ADJUST = 0.70` reflects "30% below book-derived
   figures (per Aviva, Jul 2026)", and the install and project-minimum values
   are assumptions. **These numbers need Aviva's sign-off before real prospects
   see them.** They have deliberately not been changed.
2. **Attio is not set up yet**, so leads currently reach Aviva by Formspree
   email and the Google Sheet only. See §2.
3. The privacy link in the estimate wizard was repointed from the absolute
   `https://studioelpa.com/privacy` to this site's own `/privacy.html`.
