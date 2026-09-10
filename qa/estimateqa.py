#!/usr/bin/env python3
"""
ESTIMATE WIZARD QA
------------------
Drives the real /estimate.html wizard in a browser and asserts the pricing
behaviour the client specified on 2026-09-10:

  1. The headline range is EXACTLY the sum of the line items shown on screen.
     (This is the bug the client reported: headline "$1,500-$1,500" while the
     single line read "$254-$464".)
  2. Every displayed figure lands on a $25 step.
  3. A project whose summed low falls under the $1,500 minimum shows the
     "Where our projects start" / single $1,500 framing plus the explainer
     line, and does NOT show a collapsed or floored range.
  4. A project over the minimum shows a true range and no minimum framing.
  5. Motorization adds a flat $300-$1,500 per motorized window, not scaled by
     size: the same window priced with and without motorization differs by
     exactly that, whatever its square footage.
  6. Size scaling is clamped: a tiny window and a huge window of the same
     treatment stay inside the 0.7x - 1.8x band off the 40 sqft base.

The lead relay and the API are blocked at the network layer so running this
never posts a test lead into the client's sheet.

Usage:  python3 qa/estimateqa.py [--port 4200]
"""

import argparse
import re
import sys

from playwright.sync_api import sync_playwright

CHROME = "/opt/google/chrome/chrome"
CHROME_ARGS = ["--no-sandbox", "--disable-dev-shm-usage"]

MINIMUM = 1500
MOTOR_LO, MOTOR_HI = 300, 1500

failures: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)
    print(f"  FAIL  {msg}")


def ok(msg: str) -> None:
    print(f"  ok    {msg}")


def money(text: str) -> list[int]:
    """Pull every dollar figure out of a string, in order."""
    return [int(m.replace(",", "")) for m in re.findall(r"\$([\d,]+)", text)]


def block_network(page) -> None:
    """Never let a QA run reach the client's relay or the lead API."""
    page.route(
        "**://script.google.com/**",
        lambda route: route.fulfill(status=200, body='{"ok":true}'),
    )
    page.route(
        "**/api/**",
        lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"ok":true,"id":"qa-stub"}',
        ),
    )


def start(page, base: str) -> None:
    page.goto(f"{base}/estimate.html", wait_until="domcontentloaded")
    page.wait_for_selector("button.choice", timeout=30000)


def pick_goal_and_product(page, product_label: str) -> None:
    # Step 1: one goal, then Continue.
    page.locator("button.choice").first.click()
    page.get_by_role("button", name="Continue").click()
    # Step 2: the named product, then Continue.
    page.wait_for_selector("h2#s2", timeout=15000)
    page.locator("button.choice", has_text=product_label).first.click()
    page.get_by_role("button", name="Continue").click()
    page.wait_for_selector("h2#s3", timeout=15000)


def window_ids(page) -> list[str]:
    """The row id suffix of every window card currently on step 3."""
    return page.eval_on_selector_all(
        ".win select[id^='w-room-']",
        "els => els.map(e => e.id.replace('w-room-',''))",
    )


def fill_window(page, rid: str, *, wtype: str, w: int, h: int, q: int = 1, motor: bool = False) -> None:
    page.select_option(f"#w-type-{rid}", wtype)
    page.fill(f"#w-w-{rid}", str(w))
    page.fill(f"#w-h-{rid}", str(h))
    page.fill(f"#w-q-{rid}", str(q))
    box = page.locator(f"#w-m-{rid}")
    if motor != box.is_checked():
        box.click()


def through_to_results(page, name: str = "QA Test") -> None:
    # Step 3 -> 4
    page.get_by_role("button", name="Continue").click()
    page.wait_for_selector("#est-role", timeout=15000)
    page.select_option("#est-role", "homeowner")
    page.select_option("#est-timeline", "1-3")
    page.fill("#est-zip", "33480")
    page.get_by_role("button", name="Continue").click()
    # Step 5: contact + consent
    page.wait_for_selector("#est-name", timeout=15000)
    page.fill("#est-name", name)
    page.fill("#est-email", "qa@example.com")
    page.fill("#est-phone", "5615550123")
    page.check("#est-privacy")
    page.get_by_role("button", name=re.compile("See my estimate", re.I)).click()
    page.wait_for_selector("h2#s6", timeout=30000)
    page.wait_for_selector(".est .range", timeout=15000)


def read_results(page) -> dict:
    label = page.locator(".est .lbl").inner_text().strip()
    headline = money(page.locator(".est .range").inner_text())
    lines = []
    for i in range(page.locator(".line").count()):
        row = page.locator(".line").nth(i)
        figs = money(row.locator(".amt").inner_text())
        lines.append({"text": row.inner_text().strip(), "lo": figs[0], "hi": figs[1]})
    return {"label": label, "headline": headline, "lines": lines}


def check_rounding(res: dict, case: str) -> None:
    bad = [n for n in res["headline"] if n % 25]
    for ln in res["lines"]:
        bad += [n for n in (ln["lo"], ln["hi"]) if n % 25]
    if bad:
        fail(f"{case}: figures not on a $25 step: {bad}")
    else:
        ok(f"{case}: every displayed figure lands on a $25 step")


def check_line_order(res: dict, case: str) -> None:
    for ln in res["lines"]:
        if ln["lo"] >= ln["hi"]:
            fail(f"{case}: line low is not below its high ({ln['lo']} / {ln['hi']})")
            return
    ok(f"{case}: every line reads low below high")


# ---------------------------------------------------------------------------


def case_small_window(page, base: str) -> dict:
    """One small roller shade: under the minimum, so the $1,500 framing shows."""
    case = "single small window"
    print(f"\n{case}")
    start(page, base)
    pick_goal_and_product(page, "Shades")
    ids = window_ids(page)
    fill_window(page, ids[0], wtype="roller_lf", w=36, h=60)
    through_to_results(page)
    res = read_results(page)

    if len(res["lines"]) != 1:
        fail(f"{case}: expected 1 line item, saw {len(res['lines'])}")

    if "where our projects start" not in res["label"].lower():
        fail(f"{case}: expected the minimum framing, label read {res['label']!r}")
    else:
        ok(f"{case}: label reads {res['label']!r}")

    if len(res["headline"]) != 1 or res["headline"][0] != MINIMUM:
        fail(f"{case}: expected a single ${MINIMUM} headline, saw {res['headline']}")
    else:
        ok(f"{case}: headline is a single ${MINIMUM:,} starting point, not a collapsed range")

    body = page.locator("section .care").last.inner_text()
    if "projects typically begin around" not in body.lower():
        fail(f"{case}: the $1,500 explainer line is missing under the headline")
    else:
        ok(f"{case}: explainer line present under the headline")

    ln = res["lines"][0]

    # The explainer must name the summed figure too, otherwise a $1,500
    # headline sitting above a smaller line item reads as a contradiction.
    said = money(body)
    if ln["lo"] not in said or ln["hi"] not in said:
        fail(
            f"{case}: explainer does not reconcile the headline with the lines, "
            f"it names {said} but the treatments come to ${ln['lo']}-${ln['hi']}"
        )
    else:
        ok(f"{case}: explainer reconciles ${MINIMUM:,} with the ${ln['lo']}-${ln['hi']} treatments")

    if ln["lo"] >= MINIMUM:
        fail(f"{case}: line low ${ln['lo']} is not under the minimum, wrong test fixture")
    else:
        ok(f"{case}: line still shows its own true figures (${ln['lo']} - ${ln['hi']}), not floored")

    check_rounding(res, case)
    check_line_order(res, case)
    return res


def case_multi_window(page, base: str) -> dict:
    """Four windows over the minimum: headline must be the sum of the lines."""
    case = "multi window over minimum"
    print(f"\n{case}")
    start(page, base)
    pick_goal_and_product(page, "Guide me")
    page.locator("button.add").click()
    page.locator("button.add").click()
    ids = window_ids(page)
    if len(ids) < 3:
        fail(f"{case}: could not add window rows, saw {len(ids)}")
        return {}
    fill_window(page, ids[0], wtype="drape_bo", w=96, h=96)
    fill_window(page, ids[1], wtype="roller_bo", w=48, h=72, q=2, motor=True)
    fill_window(page, ids[2], wtype="roman", w=36, h=60)
    through_to_results(page)
    res = read_results(page)

    if "estimated investment range" not in res["label"].lower():
        fail(f"{case}: expected the normal range label, saw {res['label']!r}")
    else:
        ok(f"{case}: label reads {res['label']!r}")

    if len(res["headline"]) != 2:
        fail(f"{case}: expected a two-figure headline range, saw {res['headline']}")
        return res

    sum_lo = sum(l["lo"] for l in res["lines"])
    sum_hi = sum(l["hi"] for l in res["lines"])
    if res["headline"] != [sum_lo, sum_hi]:
        fail(
            f"{case}: headline ${res['headline'][0]:,}-${res['headline'][1]:,} is NOT the sum of "
            f"the lines (${sum_lo:,}-${sum_hi:,}) -- this is the reported bug"
        )
    else:
        ok(
            f"{case}: headline ${sum_lo:,} - ${sum_hi:,} is exactly the sum of "
            f"{len(res['lines'])} line items"
        )

    if sum_lo <= MINIMUM:
        fail(f"{case}: fixture summed under the minimum (${sum_lo}), pick bigger windows")
    else:
        ok(f"{case}: summed low ${sum_lo:,} clears the ${MINIMUM:,} minimum, no minimum framing")

    if page.locator(".est .per").inner_text().find("motorization allowance") < 0:
        fail(f"{case}: motorized selection did not surface the allowance note")
    else:
        ok(f"{case}: motorization allowance note present")

    check_rounding(res, case)
    check_line_order(res, case)
    return res


def case_motor_flat(page, base: str) -> None:
    """The motor adder is flat per window, whatever the window's size."""
    print("\nmotorization is flat, not size scaled")
    for label, (w, h) in {"small 30x48": (30, 48), "large 120x108": (120, 108)}.items():
        plain = {}
        for motor in (False, True):
            start(page, base)
            pick_goal_and_product(page, "Shades")
            rid = window_ids(page)[0]
            fill_window(page, rid, wtype="roller_lf", w=w, h=h, motor=motor)
            through_to_results(page)
            res = read_results(page)
            plain[motor] = (res["lines"][0]["lo"], res["lines"][0]["hi"])
        d_lo = plain[True][0] - plain[False][0]
        d_hi = plain[True][1] - plain[False][1]
        if (d_lo, d_hi) != (MOTOR_LO, MOTOR_HI):
            fail(
                f"{label}: motor adder was ${d_lo}/${d_hi}, expected a flat "
                f"${MOTOR_LO}/${MOTOR_HI}"
            )
        else:
            ok(f"{label}: motor adder is a flat ${MOTOR_LO} - ${MOTOR_HI:,}")


def case_size_clamp(page, base: str) -> None:
    """Size scaling stays inside the 0.7x - 1.8x band off the 40 sqft base."""
    print("\nsize scaling is clamped to 0.7x - 1.8x")
    base_lo, base_hi = 300, 700  # roller_lf at 40 sqft, per the client's table
    for label, (w, h), factor in [
        ("tiny 18x24 (clamps up to 0.7x)", (18, 24), 0.7),
        ("huge 144x144 (clamps down to 1.8x)", (144, 144), 1.8),
    ]:
        start(page, base)
        pick_goal_and_product(page, "Shades")
        rid = window_ids(page)[0]
        fill_window(page, rid, wtype="roller_lf", w=w, h=h)
        through_to_results(page)
        res = read_results(page)
        got_lo, got_hi = res["lines"][0]["lo"], res["lines"][0]["hi"]
        want_lo = round(base_lo * factor / 25) * 25
        want_hi = round(base_hi * factor / 25) * 25
        if (got_lo, got_hi) != (want_lo, want_hi):
            fail(
                f"{label}: line read ${got_lo}-${got_hi}, expected "
                f"${want_lo}-${want_hi} at {factor}x"
            )
        else:
            ok(f"{label}: ${got_lo} - ${got_hi:,}, exactly {factor}x the 40 sqft base")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", default="4200")
    args = ap.parse_args()
    base = f"http://localhost:{args.port}"

    print(f"estimate wizard QA against {base}")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=CHROME, args=CHROME_ARGS)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        block_network(page)
        try:
            case_small_window(page, base)
            case_multi_window(page, base)
            case_motor_flat(page, base)
            case_size_clamp(page, base)
        finally:
            browser.close()

    print()
    for n in notes:
        print(f"note: {n}")
    if failures:
        print(f"\nFAIL: {len(failures)} problem(s) in the estimate wizard")
        for f in failures:
            print(f"  - {f}")
        return 1
    print("PASS: headline reconciles with its line items, $25 rounding holds, "
          "the $1,500 minimum framing shows only below the minimum, the motor "
          "adder is flat and size scaling is clamped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
