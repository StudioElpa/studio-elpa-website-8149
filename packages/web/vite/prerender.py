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
import os
import re
import socketserver
import sys
import threading

# Scratch only, and deliberately not 4200 (dev server), 4300 (the template's
# mobile port) or 4310 (kept free for serving dist while measuring).
PORT = 4311

ROUTES = [
    "/index.html",
    "/drapery.html",
    "/motorized.html",
    "/blackout.html",
    "/estimate.html",
    "/founder.html",
    "/journal-blackout.html",
    "/privacy.html",
]

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
    """Take the two render-blocking stylesheets off the critical path.

    1. The built stylesheet (about 40 kB, 9 kB gzipped) becomes an inline
       <style>, which removes a whole round trip before first paint.
    2. The Google Fonts stylesheet loads asynchronously via rel=preload plus
       an onload swap, with a <noscript> fallback. The font URL already has
       display=swap, so headings paint in the fallback face and swap in
       Cormorant when it lands, instead of holding the paint for ~760 ms.
    """
    # 1. inline the local stylesheet
    match = re.search(r'<link rel="stylesheet"[^>]*href="(/assets/[^"]+\.css)"[^>]*>', html)
    if match:
        css_path = os.path.join(dist, match.group(1).lstrip("/"))
        if os.path.exists(css_path):
            with open(css_path, encoding="utf-8") as fh:
                css = fh.read()
            html = html.replace(match.group(0), f"<style>{css}</style>")

    # 2. de-block the font stylesheet
    fonts = re.search(r'<link href="(https://fonts\.googleapis\.com/[^"]+)" rel="stylesheet">', html)
    if fonts:
        url = fonts.group(1)
        html = html.replace(
            fonts.group(0),
            f'<link rel="preload" as="style" href="{url}">'
            f'<link rel="stylesheet" href="{url}" media="print" '
            f'onload="this.media=\'all\';this.onload=null">'
            f'<noscript><link rel="stylesheet" href="{url}"></noscript>',
        )

    return html


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
        snapshots[route] = unblock_paint(snapshots[route], dist)

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
    return 0


if __name__ == "__main__":
    sys.exit(main())
