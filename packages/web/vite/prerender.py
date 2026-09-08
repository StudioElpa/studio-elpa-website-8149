#!/usr/bin/env python3
"""
Prerender each route of the built SPA into a real static HTML file.

Why: the client-rendered build paints nothing until the main JS chunk parses,
which put mobile FCP around 5s and capped Lighthouse performance in the 50s.
It also means crawlers and AI assistants fetch an empty <div id="root">.
Serving fully rendered HTML in the first response fixes both.

How: serve dist on a scratch port, drive headless Chrome over every route,
write document.documentElement.outerHTML back into dist/<route>.html. The
module scripts stay in the markup, so React still boots and takes over.

Two details that matter:

1. The browser context emulates `prefers-reduced-motion: reduce`. The site's
   motion contract animates *from* a hidden state inside useLayoutEffect, so
   under reduced motion GSAP never runs and the snapshot is captured with
   every element in its final, visible state. Without this, GSAP's inline
   opacity:0 would be baked into the static HTML and the text would be
   present but invisible.

2. All snapshots are captured before anything is written. dist/index.html is
   the fallback the scratch server hands to every unknown route, so
   overwriting it mid-run would poison the remaining pages.

Run automatically from prerender-plugin.ts at the end of `vite build`.
"""

import functools
import http.server
import json
import os
import re
import socketserver
import sys
import threading

# Scratch only, and deliberately not 4200 (dev server), 4300 (the template's
# mobile port) or 4310 (kept free for serving dist while measuring).
PORT = 4311

# The route list is NOT maintained here. It comes from the same registry the
# router and the per-page <PageSeo> tags read, so a new V2 page cannot ship
# un-prerendered or missing from the sitemap: adding it in one place adds it
# everywhere. If the registry ever fails to load, that is a build failure
# rather than a silently shorter run.
REGISTRY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "web", "lib", "site-routes.json")

with open(os.path.abspath(REGISTRY), encoding="utf-8") as _fh:
    _REGISTRY = json.load(_fh)

ORIGIN = _REGISTRY["origin"]
ROUTE_META = _REGISTRY["routes"]
ROUTES = [r["path"] for r in ROUTE_META]

CHROME = "/opt/google/chrome/chrome"


class SpaHandler(http.server.SimpleHTTPRequestHandler):
    """Static files when they exist, index.html for everything else."""

    def translate_path(self, path):
        local = super().translate_path(path)
        if os.path.isdir(local):
            index = os.path.join(local, "index.html")
            return index if os.path.exists(index) else local
        if not os.path.exists(local):
            return os.path.join(self.directory, "index.html")
        return local

    def log_message(self, *args):
        pass


def serve(dist: str):
    handler = functools.partial(SpaHandler, directory=dist)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def unblock_paint(html: str, dist: str) -> str:
    """Take the render-blocking stylesheet off the critical path.

    The built stylesheet (about 40 kB, 9 kB gzipped) becomes an inline
    <style>, which removes a whole round trip before first paint.

    There used to be a second branch here that de-blocked the Google Fonts
    stylesheet with a rel=preload plus onload swap, because that third-party
    request held the paint for roughly 760 ms. The fonts are self-hosted now,
    declared in @font-face inside this very stylesheet, so there is no
    external font request left to de-block. Every face uses font-display:
    swap, so headings still paint immediately in the fallback face.
    """
    # inline the local stylesheet
    match = re.search(r'<link rel="stylesheet"[^>]*href="(/assets/[^"]+\.css)"[^>]*>', html)
    if match:
        css_path = os.path.join(dist, match.group(1).lstrip("/"))
        if os.path.exists(css_path):
            with open(css_path, encoding="utf-8") as fh:
                css = fh.read()
            html = html.replace(match.group(0), f"<style>{css}</style>")

    return html


FAQ_PANEL_RE = re.compile(r"<section\b[^>]*>")
FAQ_BUTTON_RE = re.compile(r"<button\b[^>]*>")


def open_disclosures(html: str) -> str:
    """Ship the static HTML with every FAQ answer expanded.

    The prerenderer is a real browser, so the FAQ's mount effect collapses
    every panel before the snapshot is taken. Baking that collapsed state in
    would leave the answers clipped to zero height for anyone whose JS never
    runs, which is the exact failure the inverted default exists to prevent.
    React collapses them again on hydration, so this only changes the
    pre-hydration and no-JS renders. aria-expanded is flipped with the panel
    so the announced state never contradicts what is on screen.

    Only <section class="faq-a"> and <button class="faq-q"> are touched; the
    inlined stylesheet is left alone because it contains no such tags.
    """

    def panel(match: "re.Match[str]") -> str:
        tag = match.group(0)
        if 'class="faq-a"' not in tag:
            return tag
        return tag.replace('data-open="false"', 'data-open="true"')

    def button(match: "re.Match[str]") -> str:
        tag = match.group(0)
        if 'class="faq-q"' not in tag:
            return tag
        return tag.replace('aria-expanded="false"', 'aria-expanded="true"')

    return FAQ_BUTTON_RE.sub(button, FAQ_PANEL_RE.sub(panel, html))


def write_sitemap(dist: str) -> int:
    """Generate sitemap.xml from the registry, overwriting whatever public/ had.

    Hand-maintaining a sitemap alongside a growing set of V2 geography pages is
    a guarantee that the two drift, so the file is derived instead. robots.txt
    points at it.
    """
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    written = 0
    for meta in ROUTE_META:
        if meta.get("noindex"):
            continue
        lines.append("\t<url>")
        lines.append(f"\t\t<loc>{ORIGIN}{meta['path']}</loc>")
        lines.append(f"\t\t<changefreq>{meta['changefreq']}</changefreq>")
        lines.append(f"\t\t<priority>{meta['priority']}</priority>")
        lines.append("\t</url>")
        written += 1
    lines.append("</urlset>")
    with open(os.path.join(dist, "sitemap.xml"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    return written


TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)
CANONICAL_RE = re.compile(r'<link[^>]+rel="canonical"[^>]*>')
HREF_RE = re.compile(r'href="([^"]+)"')


def head_defects(route: str, html: str) -> list[str]:
    """Check the AEO head tags actually made it into the static HTML.

    <PageSeo> writes the title, description, canonical and JSON-LD from a mount
    effect. That is invisible in the source, so without this guard a page could
    ship with the homepage's title and nobody would notice until a crawler did.
    """
    meta = next((m for m in ROUTE_META if m["path"] == route), None)
    if meta is None:
        return [f"{route}: not in the route registry"]

    problems: list[str] = []
    title = TITLE_RE.search(html)
    if not title or title.group(1).strip() != meta["title"]:
        got = title.group(1).strip() if title else "(none)"
        problems.append(f"{route}: title is {got!r}, expected {meta['title']!r}")

    if f'content="{meta["description"]}"' not in html:
        problems.append(f"{route}: meta description does not match the registry")

    link = CANONICAL_RE.search(html)
    href = HREF_RE.search(link.group(0)) if link else None
    want = f"{ORIGIN}{meta['path']}"
    if not href or href.group(1) != want:
        problems.append(f"{route}: canonical is {href.group(1) if href else '(none)'}, expected {want}")

    if 'type="application/ld+json"' not in html:
        problems.append(f"{route}: no JSON-LD in the static HTML")

    return problems


def collapsed_panels(html: str) -> int:
    """Count FAQ panels that would ship collapsed. Must always be zero."""
    return sum(
        1
        for tag in FAQ_PANEL_RE.findall(html)
        if 'class="faq-a"' in tag and 'data-open="true"' not in tag
    )


def main() -> int:
    dist = sys.argv[1] if len(sys.argv) > 1 else "dist"
    dist = os.path.abspath(dist)
    if not os.path.exists(os.path.join(dist, "index.html")):
        print(f"prerender: no index.html in {dist}, skipping")
        return 0

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("prerender: playwright not available, skipping")
        return 0

    httpd = serve(dist)
    snapshots: dict[str, str] = {}
    failures: list[str] = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=CHROME,
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )
            # reduced_motion keeps GSAP from baking opacity:0 into the snapshot.
            ctx = browser.new_context(
                reduced_motion="reduce",
                viewport={"width": 1280, "height": 900},
            )
            page = ctx.new_page()
            errors: list[str] = []
            page.on("pageerror", lambda e: errors.append(str(e)))

            for route in ROUTES:
                before = len(errors)
                page.goto(f"http://127.0.0.1:{PORT}{route}", wait_until="networkidle")
                page.wait_for_function(
                    "() => { const r = document.getElementById('root');"
                    " return r && r.children.length > 0; }",
                    timeout=15000,
                )
                page.wait_for_timeout(250)
                html = page.evaluate("() => document.documentElement.outerHTML")
                # The hazard is text that exists in the markup but is invisible.
                # Only elements carrying text count: the Runable badge holds a
                # decorative opacity:0 texture layer that is not a problem.
                hidden = page.evaluate(
                    "() => [...document.querySelectorAll('#root *')]"
                    ".filter(el => el.style && el.style.opacity === '0')"
                    ".filter(el => (el.textContent || '').trim().length > 0).length",
                )
                if hidden:
                    failures.append(f"{route}: {hidden} inline opacity:0 elements")
                if len(errors) > before:
                    failures.append(f"{route}: {errors[-1]}")
                snapshots[route] = "<!DOCTYPE html>\n" + html

            browser.close()
    finally:
        httpd.shutdown()

    for route in list(snapshots):
        snapshots[route] = open_disclosures(snapshots[route])
        snapshots[route] = unblock_paint(snapshots[route], dist)
        collapsed = collapsed_panels(snapshots[route])
        if collapsed:
            failures.append(f"{route}: {collapsed} collapsed FAQ panels in static HTML")
        failures.extend(head_defects(route, snapshots[route]))

    if failures:
        # Bail out rather than ship invisible text or a half-rendered page.
        for f in failures:
            print(f"prerender: FAILED {f}")
        return 1

    for route, html in snapshots.items():
        out = os.path.join(dist, route.lstrip("/"))
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(html)
        print(f"prerender: {route} ({len(html) // 1024} kB)")

    print(f"prerender: {len(snapshots)} routes written")
    print(f"prerender: sitemap.xml with {write_sitemap(dist)} urls")
    return 0


if __name__ == "__main__":
    sys.exit(main())
