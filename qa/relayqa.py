#!/usr/bin/env python3
"""
Lead relay QA. Run against the dist server (default http://localhost:4310).

Nothing ever reaches Google Apps Script or /api/rpc: both are intercepted, so
running this cannot create a real lead. That is deliberate. Earlier form QA on
this project put real rows in the client's sheet.

Asserts the contract: POST, text/plain content type, the eleven named body
fields, the shared token, the per-form source label, the pathname, the utm_*
triple read off the query string, and an empty honeypot. Also asserts the
thank-you is optimistic (shown without a relay response) and that the server
route is untouched unless the relay request fails to leave the browser.

Chrome is the system binary; playwright's bundled chromium is not installed.
"""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4310"
RELAY = "**script.google.com**"
RPC = "**/api/rpc**"
EXPECT_KEYS = {
    "name",
    "email",
    "phone",
    "message",
    "source",
    "page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "company_website",
    "token",
}

fails = []


def chk(scope, what, ok, got=""):
    print(("  ok   " if ok else "  FAIL ") + f"[{scope}] {what}" + (f"  {got}" if not ok and got != "" else ""))
    if not ok:
        fails.append((scope, what, got))


def wire(page, state, relay_mode="ok"):
    def on_relay(route):
        req = route.request
        state["relay"].append(
            {"method": req.method, "ctype": req.headers.get("content-type", ""), "body": req.post_data}
        )
        if relay_mode == "ok":
            route.fulfill(status=200, content_type="text/plain", body="OK")
        else:
            route.abort("failed")

    def on_rpc(route):
        state["rpc"].append(route.request.url)
        route.abort("failed")

    page.route(RELAY, on_relay)
    page.route(RPC, on_rpc)


def parse(state, scope):
    if len(state["relay"]) != 1:
        chk(scope, "exactly one relay request", False, len(state["relay"]))
        return None
    r = state["relay"][0]
    chk(scope, "relay method is POST", r["method"] == "POST", r["method"])
    chk(
        scope,
        "content-type is text/plain;charset=utf-8",
        r["ctype"].replace(" ", "").lower() == "text/plain;charset=utf-8",
        r["ctype"],
    )
    try:
        body = json.loads(r["body"] or "")
    except Exception as e:  # noqa: BLE001
        chk(scope, "body is JSON", False, str(e))
        return None
    chk(scope, "body carries exactly the named fields", set(body) == EXPECT_KEYS, sorted(set(body) ^ EXPECT_KEYS))
    chk(scope, "token is the form secret", body.get("token") == "elpa_9f3k2", body.get("token"))
    chk(scope, "honeypot empty", body.get("company_website") == "", body.get("company_website"))
    return body


with sync_playwright() as p:
    br = p.chromium.launch(
        executable_path="/opt/google/chrome/chrome", args=["--no-sandbox", "--disable-dev-shm-usage"]
    )

    # ---------------------------------------------------------------- homepage
    print("homepage contact form, relay reachable")
    state = {"relay": [], "rpc": []}
    pg = br.new_page()
    wire(pg, state)
    pg.goto(f"{BASE}/index.html?utm_source=goo&utm_medium=cpc&utm_campaign=drapery", wait_until="load")
    pg.wait_for_selector("#cf-name", timeout=20000)
    pg.fill("#cf-name", "QA Relay")
    pg.fill("#cf-email", "qa+relay@example.com")
    pg.fill("#cf-phone", "561 555 0100")
    pg.fill("#cf-area", "Boca Raton")
    pg.fill("#cf-message", "Two tall windows in the living room.")
    pg.click("form button[type=submit]")
    pg.wait_for_selector("output", timeout=10000)
    chk("home", "thank-you shown", "Thank you" in pg.inner_text("output"))
    pg.wait_for_timeout(1500)
    b = parse(state, "home")
    if b:
        chk("home", "source label", b["source"] == "Homepage - Begin a conversation", b["source"])
        chk("home", "page is the pathname", b["page"] == "/index.html", b["page"])
        chk("home", "utm_source", b["utm_source"] == "goo", b["utm_source"])
        chk("home", "utm_medium", b["utm_medium"] == "cpc", b["utm_medium"])
        chk("home", "utm_campaign", b["utm_campaign"] == "drapery", b["utm_campaign"])
        chk("home", "name through", b["name"] == "QA Relay", b["name"])
        chk("home", "email through", b["email"] == "qa+relay@example.com", b["email"])
        chk(
            "home",
            "message keeps project area and visitor type",
            "Boca Raton" in b["message"] and "You are:" in b["message"],
            b["message"][:90],
        )
    chk("home", "server route untouched on the happy path", state["rpc"] == [], state["rpc"])
    pg.close()

    # ------------------------------------------------- homepage, relay offline
    print("homepage contact form, relay unreachable")
    state = {"relay": [], "rpc": []}
    pg = br.new_page()
    wire(pg, state, relay_mode="abort")
    pg.goto(f"{BASE}/index.html", wait_until="load")
    pg.wait_for_selector("#cf-name", timeout=20000)
    pg.fill("#cf-name", "QA Fallback")
    pg.fill("#cf-email", "qa+fallback@example.com")
    pg.click("form button[type=submit]")
    pg.wait_for_timeout(5000)
    chk("fallback", "server route tried as the secondary sink", len(state["rpc"]) >= 1, state["rpc"])
    chk(
        "fallback",
        "failure copy shown once both sinks fail",
        "Something went wrong on our end" in pg.inner_text("body"),
    )
    pg.close()

    # --------------------------------------------------------- estimate wizard
    print("estimate wizard, relay reachable")
    state = {"relay": [], "rpc": []}
    pg = br.new_page()
    wire(pg, state)
    pg.goto(f"{BASE}/estimate.html?utm_source=bing", wait_until="load")
    pg.wait_for_selector("button.choice", timeout=20000)
    nxt = "div.step-nav button.btn:not(.ghost)"
    pg.click("button.choice")
    pg.click(nxt)
    pg.wait_for_selector("#s2", timeout=10000)
    pg.click("button.choice")
    pg.click(nxt)
    pg.wait_for_selector("#s3", timeout=10000)
    pg.select_option('select[id^="w-type-"]', index=1)
    pg.fill('input[id^="w-w-"]', "60")
    pg.fill('input[id^="w-h-"]', "90")
    pg.click(nxt)
    pg.wait_for_selector("#s4", timeout=10000)
    pg.select_option("#est-role", "homeowner")
    pg.select_option("#est-timeline", "1-3")
    pg.fill("#est-zip", "33432")
    pg.fill("#est-notes", "QA run, please ignore.")
    pg.click(nxt)
    pg.wait_for_selector("#s5", timeout=10000)
    pg.fill("#est-name", "QA Estimate")
    pg.fill("#est-email", "qa+estimate@example.com")
    pg.fill("#est-phone", "561 555 0101")
    pg.check("#est-privacy")
    pg.click(nxt)
    pg.wait_for_timeout(2500)
    b = parse(state, "estimate")
    if b:
        chk("estimate", "source label", b["source"] == "Estimate page", b["source"])
        chk("estimate", "page is the pathname", b["page"] == "/estimate.html", b["page"])
        chk("estimate", "utm_source", b["utm_source"] == "bing", b["utm_source"])
        chk(
            "estimate",
            "message carries the estimate summary",
            "33432" in b["message"] and len(b["message"]) > 80,
            b["message"][:90],
        )
    chk("estimate", "server route untouched on the happy path", state["rpc"] == [], state["rpc"])
    pg.close()

    br.close()

print()
print(f"{len(fails)} failure(s)")
sys.exit(1 if fails else 0)
