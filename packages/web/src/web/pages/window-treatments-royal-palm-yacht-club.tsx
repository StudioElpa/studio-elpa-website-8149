import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood), typographic hero. Angle from the
   brief: waterfront estates on the Intracoastal, a yachting lifestyle, and
   interiors that are formal without being precious. Nothing invented. */

const FAQS: FaqEntry[] = [
	{
		q: "Can a formal room still be comfortable?",
		a: "That is usually the brief here, and drapery is how it is met. Full-length panels with real fullness give a room ceremony, and the fabric weight decides whether it reads as a hotel or as a house. We would rather make something you sit down in than something you photograph.",
	},
	{
		q: "The water side of the house is almost all glass. Where do we start?",
		a: "With the hours. We look at what the sun does to that elevation through the day, then split the work: a solar shade for the glare and the heat, panels for the scale and the evening. Deciding which layer does what before choosing any fabric saves a great deal of money.",
	},
	{
		q: "Who handles the wiring for motorized runs?",
		a: (
			<>
				Our licensed, insured electrical partner, <BalticLink />. They do the power, we schedule
				and manage them, and the track, the motor and the fabrication answer to one point of
				contact.
			</>
		),
	},
];

export default function RoyalPalmYachtClubPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-royal-palm-yacht-club.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">
								Window Treatments · Royal Palm Yacht &amp; Country Club, Boca Raton
							</div>
							<h1>Window Treatments for Royal Palm Yacht &amp; Country Club Homes</h1>
							<p>
								Houses that face their own dockage, with rooms built for entertaining and glass
								that runs the length of the water side.
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
						<h2 className="big">Formal, and still lived in.</h2>
						<p className="lede">
							The rooms here are made for people: a long table, a bar, doors that open onto the
							dock. They want drapery with enough presence to hold the scale of the architecture
							and enough softness that nobody feels they are standing in a lobby. That balance is
							decided by fullness, length and fabric weight, and it is set at the measurement
							rather than adjusted afterwards.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Presence comes from fullness and length, not from pattern. The quietest cloth, cut
							generously, outdoes a busy one every time.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Measured in the room, made to order, hung by us.</h2>
							<p>
								We come to the house, measure the openings ourselves and look at the fabrics
								against your own walls at the hour you use the room. Everything is made to measure
								in European fabrics, specified with the lining and interlining rather than after
								them, and fitted by our own installers. Where the water side is too wide to draw
								by hand, motorization is planned early and the wiring is handled by our licensed, insured electrical partner, <BalticLink />, scheduled and managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Scale set against the architecture</b>, so the drapery holds its own beside
								stone and glass.
							</li>
							<li>
								<b>Solar control on the water side</b>, taking the glare before the fabric has to.
							</li>
							<li>
								<b>Our own installers</b>, so the making and the hanging are the same
								responsibility.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating to specification and staying out of the
								relationship.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Royal Palm sits inside our wider{" "}
							<Link to="/custom-window-treatments-boca-raton.html">
								custom window treatments in Boca Raton
							</Link>{" "}
							territory, alongside{" "}
							<Link to="/window-treatments-the-sanctuary-boca-raton.html">The Sanctuary</Link> and{" "}
							<Link to="/window-treatments-st-andrews-country-club.html">
								St. Andrews Country Club
							</Link>
							. On the treatments, <Link to="/drapery.html">custom drapery</Link> covers the making
							and the stack-back, <Link to="/motorized.html">motorized shades and drapery</Link>{" "}
							covers the wide openings, and{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains what we buy and
							why. If you are weighing pleats, start with{" "}
							<a href="/drapery-headers.html">drapery headers, compared</a>.
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
								We serve Royal Palm Yacht &amp; Country Club and greater Boca Raton. Start with a
								relaxed 30-minute call, tell us which rooms matter most, and we will come out with
								a shortlist instead of the whole library.
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
