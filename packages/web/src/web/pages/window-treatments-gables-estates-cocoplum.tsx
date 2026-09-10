import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. Angle from
   the brief's Gables Estates and Cocoplum hook: designer-led waterfront
   estates, drapery craft plus motorization, designer partnership. This page is
   written to be readable by a designer as much as by a homeowner, and makes no
   claim about how much of our work arrives through the trade. */

const FAQS: FaqEntry[] = [
	{
		q: "I am the designer. What do you actually need from me?",
		a: "A specification and the freedom to tell you the truth about it. Send the fabric, the header, the finish and the intent, and we will confirm repeat, width, weight and behavior before anything is cut. If a cloth will not hold a fourteen foot panel the way your elevation drawing shows, you will hear it from us while it is still changeable, not after installation.",
	},
	{
		q: "Will you deal directly with my client?",
		a: "Only as much as you want us to. Some designers want us in the room for measuring and nowhere else, and that is fine. Others want us handling the client on the window treatments entirely. Either works, as long as it is agreed at the start. The vision stays the designer's in both cases, and we do not use a project as our own marketing.",
	},
	{
		q: "Can you motorize drapery at estate scale, not just shades?",
		a: (
			<>
				Yes, and it is a large part of what we do. Motorized custom drapery is harder than
				motorized shades because the hardware has to be sized to real panel weight and the track
				has to be set true, or it will be noisy and it will not stack cleanly. We specify to the
				finished weight of your fabric rather than to a catalog maximum. Power is run by our
				licensed and insured electrical partner, <BalticLink />, coordinated by us.
			</>
		),
	},
];

export default function GablesEstatesCocoplumPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-gables-estates-cocoplum.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Gables Estates and Cocoplum</div>
							<h1>Window Treatments for Gables Estates and Cocoplum</h1>
							<p>
								Designer-led waterfront estates. We fabricate to specification, motorize what is
								too wide to work by hand, and stay out of the way.
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
						<h2 className="big">A workroom that can be trusted with the drawing.</h2>
						<p className="lede">
							On a designer-led estate the design question is usually settled long before we
							arrive. What is not settled is whether the thing can be made the way it was drawn,
							at that width, in that cloth, and hung so it stacks and hangs correctly on the
							first attempt. That is the part we are for. The interesting problems here are
							scale, weight and tolerance rather than taste.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The most useful thing a fabricator can do for a designer is raise the problem
							early, while it is still a drawing and not yet a cut length of fabric.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Made to specification, installed by our own team.</h2>
							<p>
								We measure the openings ourselves, in the house, and confirm the specification
								before anything is cut. Custom drapery is made to measure in European fabrics.
								Motorized drapery and shading covers the openings that are too tall or too wide
								to work by hand, sized to the real weight of the panel. Installation is by our
								own installers rather than a subcontractor, and the wiring is handled by our
								licensed and insured electrical partner, <BalticLink />, scheduled by us so the trade
								coordination is not the designer's problem.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Repeat, width and weight confirmed</b> before a cut, in writing.
							</li>
							<li>
								<b>Hardware sized to finished panel weight</b>, not to a catalog maximum.
							</li>
							<li>
								<b>One point of contact</b>, so the designer is not chasing trades.
							</li>
							<li>
								<b>No project used as our marketing</b>, and no client names.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Gables Estates and Cocoplum sit inside our{" "}
							<Link to="/motorized-drapery-coral-gables.html">
								motorized drapery in Coral Gables
							</Link>{" "}
							territory, which also covers Pinecrest. On the treatments,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers the hardware,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers fullness, headers and
							stack-back, <Link to="/european-fabrics.html">European fabrics</Link> covers what
							we specify and why, and{" "}
							<Link to="/custom-home-textiles.html">custom home textiles</Link> covers the work
							beyond the window. Our guide to{" "}
							<Link to="/drapery-headers.html">drapery headers, compared</Link> is a useful
							reference on a specification call.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things designers and clients here ask.</h2>
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
							<h2 className="big">Tell us about the project.</h2>
							<p>
								We work in Gables Estates, Cocoplum and across Coral Gables and Pinecrest. Start
								with a relaxed 30-minute call, send us the specification if there is one, and we
								will tell you honestly what it will take.
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
