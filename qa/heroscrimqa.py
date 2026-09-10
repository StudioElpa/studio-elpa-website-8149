#!/usr/bin/env python3
"""
HERO SCRIM CONTRAST QA — Studio Elpa V2

The photographic heroes no longer darken the whole photograph. Contrast for the
hero copy comes from a scrim that sits behind the copy block only, so the only
honest way to check the copy is legible is to measure the pixels that actually
end up behind it: render the page, hide the copy, screenshot exactly the box the
copy occupied, and read the composite back.

Reports, per page and per viewport, the WORST pixel behind the paragraph and
behind the h1. A photograph has no single background colour, so the worst pixel
is the standard applied here rather than an average that a blown-out window
could hide inside.

Run against the built site: python3 qa/heroscrimqa.py [--port 4310]
"""

import argparse
import io
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

# The photographic heroes. The 13 window-treatments-* geo pages are deliberately
# absent: those carry a typographic header on the cream ground, no photograph and
# no scrim, and the brief asks for them to be left alone.
PAGES = [
    "blackout.html",  # .hero.night
    "custom-drapery-fort-lauderdale.html",
    "custom-drapery-palm-beach.html",
    "custom-home-textiles.html",
    "custom-roman-shades-palm-beach-gardens.html",
    "custom-window-treatments-boca-raton.html",
    "drapery-hardware.html",
    "drapery.html",
    "european-fabrics.html",
    "flame-retardant-drapery.html",
    "hospitality-window-treatments.html",
    "luxury-window-treatments-jupiter.html",
    "motorized-drapery-coral-gables.html",
    "motorized-shades-delray-beach.html",
    "motorized.html",
    "natural-woven-shades.html",
    "roman-shades.html",
    "smart-home-window-treatments.html",
    "specialty-shaped-windows.html",
]

VIEWPORTS = [("desktop", 1440, 900), ("phone", 390, 844)]

# WCAG 2.1 AA for body-size text.
MIN_PARA = 4.5
# The h1 runs 40px+ at 500 weight, which is large-scale text under 1.4.3.
MIN_H1 = 3.0

# Hides the copy but NOT .inner itself, because the scrim is .inner::before and
# visibility on the parent would take the pseudo-element with it.
HIDE_COPY = """
.page-lp .hero .inner > * { visibility: hidden !important; }
"""


def lin(c: float) -> float:
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb) -> float:
    r, g, b = rgb[0], rgb[1], rgb[2]
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(l1: float, l2: float) -> float:
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def parse_rgb(css: str):
    nums = css.replace("rgba", "").replace("rgb", "").strip("() ").split(",")
    return tuple(int(float(n)) for n in nums[:3])


def worst_pixel(shot_text: bytes, shot_bare: bytes, text_lum: float):
    """
    The lowest contrast any GLYPH pixel gets from what sits behind it.

    Two screenshots of the same box: one with the copy showing, one with it
    hidden. Where they differ, a glyph is. Measuring the whole bounding box
    instead would judge the scrim on the empty corners either side of a short
    centred last line, which no one has to read.
    """
    a = Image.open(io.BytesIO(shot_text)).convert("RGB")
    b = Image.open(io.BytesIO(shot_bare)).convert("RGB")
    if a.size != b.size:
        return None, None, 0

    worst = 99.0
    worst_rgb = None
    glyphs = 0
    for y in range(a.height):
        for x in range(a.width):
            pa = a.getpixel((x, y))
            pb = b.getpixel((x, y))
            # A glyph core, not an antialiased edge: the pixel has to have
            # moved a long way towards the text colour.
            if max(abs(pa[0] - pb[0]), abs(pa[1] - pb[1]), abs(pa[2] - pb[2])) < 40:
                continue
            glyphs += 1
            c = contrast(text_lum, luminance(pb))
            if c < worst:
                worst, worst_rgb = c, pb
    return worst, worst_rgb, glyphs


def clip_of(page, selector: str):
    box = page.locator(selector).first.bounding_box()
    if not box or box["width"] < 10 or box["height"] < 8:
        return None, None
    color = page.locator(selector).first.evaluate("el => getComputedStyle(el).color")
    return {
        "x": box["x"],
        "y": box["y"],
        "width": box["width"],
        "height": box["height"],
    }, color


def measure(label: str, shots, floor: float):
    """shots = (text screenshot, bare screenshot, computed text colour)."""
    shot_text, shot_bare, color = shots
    worst, rgb, glyphs = worst_pixel(shot_text, shot_bare, luminance(parse_rgb(color)))

    problems = []
    if not glyphs:
        return [f"FAIL {label}: found no glyph pixels to measure"], None
    if worst < floor:
        problems.append(
            f"FAIL {label}: worst glyph {worst:.2f}:1 (needs {floor}:1), "
            f"text {color} over rgb{rgb}"
        )
    return problems, worst


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=4310)
    args = ap.parse_args()
    base = f"http://localhost:{args.port}"

    problems = []
    rows = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/opt/google/chrome/chrome",
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        for name, w, h in VIEWPORTS:
            ctx = browser.new_context(viewport={"width": w, "height": h})
            page = ctx.new_page()
            for slug in PAGES:
                url = f"{base}/{slug}"
                page.goto(url, wait_until="domcontentloaded")
                # These pages hydrate client-side; wait for the real element.
                page.wait_for_selector(".hero p", timeout=15000)
                page.wait_for_timeout(900)

                # The scrim must exist and must not have been left as a
                # whole-frame wash by a later edit.
                has_scrim = page.evaluate(
                    "() => {"
                    " const el = document.querySelector('.hero .inner');"
                    " if (!el) return 'no .inner';"
                    " const s = getComputedStyle(el, '::before');"
                    " if (s.content === 'none') return 'no ::before scrim';"
                    " if (!/blur\\(/.test(s.filter))"
                    "   return 'scrim has no soft edge, filter: ' + s.filter;"
                    " const hero = getComputedStyle(document.querySelector('.hero'), '::after');"
                    " const wash = (hero.backgroundImage.match(/0?\\.\\d+\\)/g) || [])"
                    "   .map(Number.parseFloat ? (v) => parseFloat(v) : parseFloat);"
                    " if (wash.some((a) => a > 0.26))"
                    "   return 'whole-frame wash is back at alpha ' + Math.max(...wash);"
                    " return 'ok';"
                    "}"
                )
                if has_scrim != "ok":
                    problems.append(f"FAIL {slug} [{name}]: {has_scrim}")

                # Both boxes and both states in one pass: the hero copy animates
                # in, so reloading between measurements raced the sequence.
                pclip, pcolor = clip_of(page, ".hero p")
                hclip, hcolor = clip_of(page, ".hero h1")
                if not pclip or not hclip:
                    problems.append(f"FAIL {slug} [{name}]: hero copy has no box")
                    rows.append((slug, name, None, None))
                    continue

                ptext = page.screenshot(clip=pclip)
                htext = page.screenshot(clip=hclip)
                handle = page.add_style_tag(content=HIDE_COPY)
                pbare = page.screenshot(clip=pclip)
                hbare = page.screenshot(clip=hclip)
                handle.evaluate("el => el.remove()")

                pp, pworst = measure(
                    f"{slug} [{name}] paragraph", (ptext, pbare, pcolor), MIN_PARA
                )
                hp, hworst = measure(
                    f"{slug} [{name}] h1", (htext, hbare, hcolor), MIN_H1
                )
                problems += pp + hp
                rows.append((slug, name, pworst, hworst))
            ctx.close()
        browser.close()

    print(f"{'page':46} {'viewport':9} {'para':>7} {'h1':>7}")
    for slug, name, pw, hw in rows:
        pf = f"{pw:.2f}" if pw else "n/a"
        hf = f"{hw:.2f}" if hw else "n/a"
        flag = "" if (pw and pw >= MIN_PARA and hw and hw >= MIN_H1) else "  <-- FAIL"
        print(f"{slug:46} {name:9} {pf:>7} {hf:>7}{flag}")

    paras = [r[2] for r in rows if r[2]]
    if paras:
        print(f"\nworst paragraph contrast anywhere: {min(paras):.2f}:1")

    print()
    if problems:
        for x in problems:
            print(x)
        print(f"\n{len(problems)} problem(s) across {len(PAGES)} photographic heroes")
        return 1
    print(f"PASS: {len(PAGES)} photographic heroes x {len(VIEWPORTS)} viewports, "
          f"paragraph >= {MIN_PARA}:1 and h1 >= {MIN_H1}:1 on every worst pixel")
    return 0


if __name__ == "__main__":
    sys.exit(main())
