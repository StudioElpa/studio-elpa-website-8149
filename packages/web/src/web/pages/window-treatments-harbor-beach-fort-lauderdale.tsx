import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. Angle from
   the brief's Harbor Beach hook: waterfront estates, boating clientele,
   frequent remodels, drapery scale plus solar control on the water side. The
   organising idea is the two-sided house, water on one side and hard sun on
   the other. No claim is made about how many houses here are being remodelled. */

const FAQS: FaqEntry[] = [
	{
		q: "We are away on the boat for weeks at a time. Does that matter?",
		a: "It matters for two reasons. A house that sits closed with sun on the glass will fade floors and furnishings while nobody is there to see it happening, so the day-to-day shading needs to be able to run without you. And the whole system should be simple enough that someone else can operate it. We set schedules that hold on their own and keep the controls obvious rather than clever.",
	},
	{
		q: "Can we keep the dock view and still cut the heat?",
		a: "Yes, that is exactly what an open solar weave does. It holds the horizon and the dock in view while taking out the glare and a good part of the solar heat that the air conditioning would otherwise fight. After dark the lit room becomes the visible one from the water, so a room you use in the evening usually wants a second, closed layer as well.",
	},
	{
		q: "We are mid-remodel. When do you need to be involved?",
		a: (
			<>
				Before the ceilings close. A drapery pocket, a recessed shade or a power run is
				straightforward while the framing is open and awkward afterwards. We are glad to look at
				drawings and tell you what to leave room for even if the treatments are months out.
				Power is run by our licensed and insured electrical partner, <BalticLink />, coordinated by
				us, which keeps that step off your general contractor's critical path.
			</>
		),
	},
];

export default function HarborBeachPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-harbor-beach-fort-lauderdale.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Harbor Beach, Fort Lauderdale</div>
							<h1>Window Treatments for Harbor Beach Homes</h1>
							<p>
								Water on one side, hard afternoon sun on the other, and a dock that is the reason
								the house is where it is. The treatments have to serve all three.
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
						<h2 className="big">Keep the water, lose the heat.</h2>
						<p className="lede">
							A waterfront house is usually asked to give up the view in order to be
							comfortable, and that is the wrong trade. The glare and the solar heat can come out
							of a room without closing it off, but only if the shading on the water side is
							specified for openness and the drapery is doing the softening rather than the light
							control. Get those two jobs the wrong way round and the room is either hot or dark.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Two layers, two jobs. The shade argues with the sun. The drapery finishes the room.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Measured on the water side, late in the day.</h2>
							<p>
								We come to the house, measure the openings ourselves and look at the water
								elevation when the light is worst rather than when it is flattering. Solar and
								roller shades take the glare and the heat off the big glass, custom drapery
								carries the scale of the room and the finish, and blackout layers do the
								bedrooms. Everything is made to measure in European fabrics and fitted by our own
								installers, with wiring handled by our licensed and insured electrical partner,{" "}
								<BalticLink />, scheduled by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Openness factor chosen for the view</b>, so the horizon survives the shade.
							</li>
							<li>
								<b>Schedules that run without you</b>, for the weeks the house is empty.
							</li>
							<li>
								<b>Stack-back measured off the frame</b>, so a wide slider still opens fully.
							</li>
							<li>
								<b>Coordinated with your contractor</b>, before the ceilings close.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Harbor Beach sits inside our{" "}
							<Link to="/custom-drapery-fort-lauderdale.html">Fort Lauderdale</Link> territory,
							a few minutes from{" "}
							<Link to="/window-treatments-las-olas-isles.html">the Las Olas Isles</Link>. On the
							treatments,{" "}
							<Link to="/roller-solar-shades.html">roller and solar shades</Link> covers openness
							and heat, <Link to="/drapery.html">custom drapery</Link> covers the making and the
							stack-back, and{" "}
							<Link to="/smart-home-window-treatments.html">smart home window treatments</Link>{" "}
							covers schedules and control. Our{" "}
							<Link to="/journal-blackout.html">guide to blackout</Link> is the place to start on
							bedrooms.
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
								We work in Harbor Beach and across Fort Lauderdale. Start with a relaxed
								30-minute call, tell us which side of the house is the problem, and we will come
								and see it at the hour it bothers you.
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
