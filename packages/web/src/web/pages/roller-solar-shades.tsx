import { useEffect } from "react";
import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { PageSeo } from "../components/page-seo";

/* CONSOLIDATION STUB.
   Roller and solar shades are no longer a standalone service: their content now
   lives inside Motorized Shades. This URL stays resolvable rather than 404ing,
   because it was a real indexed page with inbound links.

   Three moving parts, all deliberate:
   1. The registry entry carries `noindex` (kept out of the sitemap) and
      `canonicalTo: "/motorized.html"`, so the canonical here points at the page
      that absorbed this one instead of at itself.
   2. A client redirect moves a human or a JS-executing crawler along at once.
   3. `window.__PRERENDER__` suppresses that redirect during the build snapshot.
      Without it the prerenderer would follow the redirect and write the
      Motorized page's html into this file, leaving a duplicate at a dead URL
      with no redirect left in it. See vite/prerender.py.

   The static file therefore contains the line below, which is what a crawler
   that does not run JS reads, and what a visitor sees for the instant before
   the redirect fires. */

export default function RollerSolarShadesPage() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return;
		window.location.replace("/motorized.html");
	}, []);

	return (
		<div className="page-lp">
			<PageSeo path="/roller-solar-shades.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="block">
					<div className="wrap narrow center">
						<div className="kicker">This page has moved</div>
						<h1 className="big">Roller and solar shades are now Motorized Shades.</h1>
						<p className="lede">
							Solar screens, dimout and blackout fabrics are all still here. They live on our{" "}
							<Link to="/motorized.html">Motorized Shades</Link> page now, alongside the motors and
							the wiring, because that is how we specify them. You should arrive there
							automatically.
						</p>
					</div>
				</section>
			</main>

			<LandingFooter />
		</div>
	);
}
