import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). The hero is typographic rather than
   photographic: there is no honest photograph of most of these enclaves and the
   brief forbids stock or generated imagery, so `.hero.plain` carries the header
   on type against the cream ground. Copy follows the brief's worked example for
   Admirals Cove closely, which is the one neighbourhood it wrote in full. */

const FAQS: FaqEntry[] = [
	{
		q: "Do you work with our interior designer?",
		a: "Gladly. We regularly work alongside interior designers, and the vision stays theirs. We fabricate to their specification, tell them honestly how a fabric will behave once it is a fourteen foot panel in Florida light, and flag anything about repeat, width or weight before it is cut.",
	},
	{
		q: "Our sliders are too tall to reach. What are the options?",
		a: (
			<>
				Motorization, and it is close to essential at this scale. Shades and drapery that glide on
				a schedule or with a touch are what make a house of tall glass easy to live in. The wiring
				goes through our licensed and insured electrical partner, <BalticLink />, coordinated by
				us, so nothing stalls waiting on a trade.
			</>
		),
	},
	{
		q: "Can we keep the water view and still cut the heat?",
		a: "Yes, that is what a solar weave is for. An open weave holds the horizon and takes out the glare and much of the solar heat. After dark the lit room becomes the visible one, so a bedroom on the water usually wants a second, closed layer as well.",
	},
];

export default function AdmiralsCovePage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-admirals-cove-jupiter.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Admirals Cove, Jupiter</div>
							<h1>Window Treatments for Admirals Cove Residences</h1>
							<p>
								Big waterfront glass, tall ceilings, wide sliders that open the living space to
								the docks and the sky. Exactly the kind of house where window treatments earn
								their place.
							</p>
							<div className="btn-row">
								<a
									className="btn btn-solid"
									href={CONTACT.booking}
									target="_blank"
									rel="noopener"
								>
									Book a 30-minute call
								</a>
								<Link className="btn btn-ghost" to="/estimate.html">
									Get a quick estimate
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="block">
					<div className="wrap center narrow" data-reveal>
						<div className="kicker">What these homes ask for</div>
						<h2 className="big">Taming the afternoon without closing the house up.</h2>
						<p className="lede">
							The glass is beautiful and it is the reason the house is worth what it is worth. It
							also brings in afternoon glare, solar heat that the air conditioning then has to
							fight, and enough ultraviolet to tire floors and furnishings. The job is to take all
							of that out while leaving you the privacy and the rest you want, and the view you
							bought the house for.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							This is where the combination matters. Drapery softens the scale, shades handle the
							sun, and motorization is what makes a house this size easy to live in.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">One team from the first measurement to the last panel.</h2>
							<p>
								We come to the house, measure the openings ourselves and watch the light at the
								hour you actually use the room. Custom drapery softens a big room, solar and
								roller shades handle the Florida sun on walls of glass, and motorized shading
								covers the openings that are too tall or too wide to work by hand. Everything is
								made to measure in European fabrics and fitted by our own installers. The wiring
								is handled by our licensed and insured electrical partner, <BalticLink />,
								coordinated by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Stack-back measured off the frame</b>, so a wide slider still opens all the
								way.
							</li>
							<li>
								<b>Salt-air-aware fabrics</b>, chosen with the lining rather than after it.
							</li>
							<li>
								<b>Motorization planned early</b>, while the power route is still a drawing.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating on spec, on time, without getting between a
								designer and their client.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Admirals Cove sits inside our wider{" "}
							<Link to="/luxury-window-treatments-jupiter.html">
								luxury window treatments in Jupiter
							</Link>{" "}
							territory, alongside{" "}
							<Link to="/window-treatments-jupiter-island.html">Jupiter Island</Link>. On the
							treatments themselves,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers the hardware,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers the making and the stack-back,
							and <Link to="/blackout.html">blackout drapery and shades</Link> is the bedroom
							answer. Our guide to <a href="/drapery-headers.html">drapery headers, compared</a>{" "}
							walks through ripple fold, pinch pleat and French pleat, and how each changes the
							feel of a room.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things clients here ask.</h2>
						</div>
						<div style={{ marginTop: 22 }}>
							<Faq entries={FAQS} />
						</div>
					</div>
				</section>

				<section className="block">
					<div className="wrap">
						<div className="callout" data-reveal>
							<div className="kicker">No pressure. Just a conversation.</div>
							<h2 className="big">Tell us about the room.</h2>
							<p>
								We serve Admirals Cove and greater Jupiter. Start with a relaxed 30-minute call,
								tell us which openings are the problem, and we will come out and look at them at
								the hour they misbehave.
							</p>
							<div className="btn-row">
								<a
									className="btn btn-solid"
									href={CONTACT.booking}
									target="_blank"
									rel="noopener"
								>
									Book a 30-minute call
								</a>
								<Link className="btn btn-ghost" to="/estimate.html">
									Get a quick estimate
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			<LandingFooter />
		</div>
	);
}
