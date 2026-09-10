import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). Boca Raton is the broadest of the
   city pages, so the angle is the range of house types rather than one
   treatment: club interiors, waterfront estates, and the renovation cycles that
   run through both. Written for Boca specifically, not swapped from another
   city. Nothing about the place is invented. */

const CARDS = [
	{
		title: "Club house, waterfront house",
		body: "A country club interior and a house on the Intracoastal want different things. One is asking for warmth and ceremony, the other for glare control on glass that faces open water. Same studio, different specification.",
	},
	{
		title: "Renovation timing",
		body: "Window treatments are decided late and needed early. If the drapery is specified while the trim is still being drawn, the track can be recessed and the wiring can run before the ceiling closes.",
	},
	{
		title: "Rooms that repeat",
		body: "Large houses have five or six windows that are nearly, but not quite, the same. Made to measure means each one is cut to its own opening, so the line across a wall stays true.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Do you cover all of Boca Raton?",
		a: "Yes, east and west. That takes in the country club communities inland, the older streets near the beach, and the waterfront addresses in between. We measure in the room in all of them, because a plan will not tell you how a window sits under its own soffit.",
	},
	{
		q: "We are renovating. When should window treatments come into it?",
		a: "Earlier than most people expect. Once the window openings are set, we can specify a recessed track, a pocket in the ceiling, or the power for a motorized run, and all of those are cheap now and expensive later. If the house is already finished we still have good options, they are just fewer.",
	},
	{
		q: "Can you do the whole house at once?",
		a: (
			<>
				Yes, and it is usually the better way to buy. Ordering a house together keeps the fabrics,
				the linings and the headers speaking to one another and it means one installation rather
				than five. Where a room needs motorization, the wiring goes through our licensed, insured electrical partner, <BalticLink />, scheduled by us.
			</>
		),
	},
	{
		q: "What is the difference between a shade and drapery here?",
		a: "Shades solve sun and privacy. Drapery solves scale and feeling. Most Boca rooms with real glass end up wanting both, a solar shade doing the working hours and panels at the sides doing everything else. We will tell you honestly when a room only needs one of them.",
	},
	{
		q: "How long does a project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function BocaRatonPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/custom-window-treatments-boca-raton.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/lp-bedroom.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Custom Window Treatments · Boca Raton</div>
							<h1>Custom Window Treatments in Boca Raton</h1>
							<p>
								Boca Raton is two towns at once: club houses set back behind gates, and
								waterfront houses that face east into the morning. The window treatment answer is
								not the same in both.
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
						<div className="kicker">Why it matters here</div>
						<h2 className="big">The sun arrives before you do.</h2>
						<p className="lede">
							East-facing rooms take the whole of the morning, and west-facing rooms take the
							afternoon at an angle low enough to reach across the floor. That is what fades a rug
							and warms a room the air conditioning then has to fight. Shading handles the heat
							and the glare, drapery handles the scale, and deciding which does what is most of
							the work.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The question is rarely which fabric. It is which window is doing the damage, and at
							what hour.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap">
						<div className="three" data-reveal-group>
							{CARDS.map((c) => (
								<div className="card" key={c.title} data-reveal>
									<h3>{c.title}</h3>
									<p>{c.body}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">One team, from the measurement to the last bracket.</h2>
							<p>
								We start with a conversation about the rooms and how you use them, then measure
								in person. Everything is made to order in European fabrics, specified with its
								lining rather than after it, and hung by our own installers, so the making and
								the fitting are the same responsibility. Where a project calls for motorization,
								the wiring is handled by our licensed, insured electrical partner,{" "}
								<BalticLink />, scheduled and managed by us. You never have to find or coordinate
								a trade.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Measured in the room</b>, at the hour you use it, with fabrics held against
								your own walls.
							</li>
							<li>
								<b>Whole-house planning</b>, so five rooms read as one house rather than five
								decisions.
							</li>
							<li>
								<b>Our own installers</b>, and one point of contact from first question to final
								hem.
							</li>
							<li>
								<b>Electrical handled for you</b>, licensed and insured, coordinated on our
								schedule.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Neighborhoods and rooms.</h2>
						<p className="lede">
							We work throughout Boca Raton, including{" "}
							<Link to="/window-treatments-royal-palm-yacht-club.html">
								Royal Palm Yacht &amp; Country Club
							</Link>
							,{" "}
							<Link to="/window-treatments-st-andrews-country-club.html">
								St. Andrews Country Club
							</Link>{" "}
							and{" "}
							<Link to="/window-treatments-the-sanctuary-boca-raton.html">The Sanctuary</Link>. On
							the treatments themselves, <Link to="/drapery.html">custom drapery</Link> covers the
							making and the stack-back,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers the openings
							too tall or too wide to work by hand,{" "}
							<Link to="/roman-shades.html">Roman shades</Link> suit the windows that want
							softness without full panels, and{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link> is the bedroom
							conversation. Our guide to{" "}
							<a href="/drapery-headers.html">drapery headers, compared</a> is a good place to
							start if you are weighing styles.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things Boca clients ask.</h2>
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
							<h2 className="big">Tell us about the house.</h2>
							<p>
								We work across Boca Raton, east and west, from the beachside streets to the club
								communities inland. Start with a relaxed 30-minute call, tell us which rooms are
								bothering you, and we will come out with a shortlist rather than a catalog.
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
