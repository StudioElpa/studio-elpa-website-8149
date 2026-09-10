import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood), typographic hero. Angle from the
   brief: gated waterfront estates, so privacy on the water and solar control on
   wide glass are the two subjects. */

const FAQS: FaqEntry[] = [
	{
		q: "The house is gated. Do we really need privacy treatments?",
		a: "The gate handles the street. It does nothing about the water, which is the side with all the glass and all the passing traffic. After dark the lit room is the visible one from a boat, and that is the case the second layer answers.",
	},
	{
		q: "Can one shade give us privacy and keep the view?",
		a: "Not honestly. An open solar weave keeps the view and takes the glare in daylight, and it goes transparent from the outside once your lights are on. A house on the water wants a day layer and a night layer, and saying so up front is cheaper than discovering it later.",
	},
	{
		q: "How do you handle very wide openings?",
		a: (
			<>
				By specifying the track for the finished weight and motorizing anything too wide to draw
				evenly by hand. The power is handled by our licensed, insured electrical partner,{" "}
				<BalticLink />, scheduled and managed by us, so the wiring and the fabrication answer to
				one point of contact.
			</>
		),
	},
];

export default function SanctuaryPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-the-sanctuary-boca-raton.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · The Sanctuary, Boca Raton</div>
							<h1>Window Treatments for The Sanctuary, Boca Raton</h1>
							<p>
								A gate takes care of the street. The water side is where these houses are
								actually exposed, and it is also where all the glass is.
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
						<h2 className="big">Private from the water, open to it.</h2>
						<p className="lede">
							Waterfront estates here are built to look out, and they succeed at it so thoroughly
							that the room becomes visible in return the moment the sun goes down. The answer is
							two layers with two jobs: an open solar weave that holds the view and takes the heat
							out of the afternoon, and a closing layer, drapery or a dimout shade, that belongs
							to the evening.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Daylight and darkness ask opposite things of the same window. One fabric cannot
							answer both without lying about one of them.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Specified elevation by elevation.</h2>
							<p>
								We measure in the room and treat the water side and the street side as separate
								problems, because they are. Solar fabrics are chosen by openness against each
								elevation, drapery is specified with its lining rather than after it, and
								everything is made to order in European fabrics and fitted by our own installers.
								Motorized runs are planned early and the wiring is handled by our licensed, insured electrical partner, <BalticLink />, scheduled and managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Day layer and night layer</b>, specified separately for the water side.
							</li>
							<li>
								<b>Openness chosen per elevation</b>, not one weave for the whole house.
							</li>
							<li>
								<b>Our own installers</b>, so the making and the hanging are one responsibility.
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
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							The Sanctuary sits inside our wider{" "}
							<Link to="/custom-window-treatments-boca-raton.html">
								custom window treatments in Boca Raton
							</Link>{" "}
							territory, alongside{" "}
							<Link to="/window-treatments-royal-palm-yacht-club.html">
								Royal Palm Yacht &amp; Country Club
							</Link>{" "}
							and{" "}
							<Link to="/window-treatments-st-andrews-country-club.html">
								St. Andrews Country Club
							</Link>
							. On the treatments,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers solar fabrics
							and hardware, <Link to="/drapery.html">custom drapery</Link> covers the closing
							layer, and <Link to="/blackout.html">blackout drapery and shades</Link> is the
							bedroom conversation.
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
							<h2 className="big">Tell us about the water side.</h2>
							<p>
								We serve The Sanctuary and greater Boca Raton. Start with a relaxed 30-minute
								call, tell us what the glass is doing to you and when, and we will come out and
								see it for ourselves.
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
