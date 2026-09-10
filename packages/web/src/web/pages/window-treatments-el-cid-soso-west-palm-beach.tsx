import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. Angle from
   the brief's El Cid and SoSo hook: historic renovations sitting next to new
   construction, treatments that respect the architecture with the modern parts
   hidden behind them. */

const FAQS: FaqEntry[] = [
	{
		q: "Our windows are original and not exactly square. Is that a problem?",
		a: "It is normal, and it is the reason we measure every opening individually rather than measuring one and multiplying. An older house settles, and a window that was square when it was built often is not now. We template the opening as it actually is, and where a shade has to sit inside a frame that runs out of true we plan for it in the fabrication instead of discovering it on installation day.",
	},
	{
		q: "Can we motorize without spoiling the character of the room?",
		a: (
			<>
				Yes, and this is most of the work in a house like this. The point of good motorization
				here is that you cannot see it. Hardware sits above the sightline or inside the pocket,
				the fabric and the header carry the room, and the modern part stays out of view. Wiring
				runs through our licensed, insured electrical partner, <BalticLink />, coordinated by us,
				which matters more in a renovation where walls and ceilings are only open once.
			</>
		),
	},
	{
		q: "When should we bring you in on a renovation?",
		a: "Earlier than most people do. While the ceiling is still open and the power route is still a drawing, a drapery pocket or a recessed shade is an easy decision. Once the ceiling is closed, the same request means opening it again. We are glad to come and look at a job at the drawing stage and tell you what to leave room for, even if the treatments themselves are months away.",
	},
];

export default function ElCidSoSoPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-el-cid-soso-west-palm-beach.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · El Cid and SoSo, West Palm Beach</div>
							<h1>Window Treatments for El Cid and SoSo Homes</h1>
							<p>
								Historic houses being carefully brought back, and new houses being built next
								door to them. Both want treatments that look like they belong to the building.
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
						<h2 className="big">Modern comfort, without arguing with the architecture.</h2>
						<p className="lede">
							These are neighborhoods with real architectural character, and a window treatment
							can either respect it or fight it. An arched opening, a deep reveal, a casement
							that swings inward, a plaster return with no square edge to fasten to: each one
							rules some options out. At the same time nobody wants to live with 1925 light
							control. The job is to get the comfort of a modern system and keep it invisible.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							In a house with character, the best compliment a window treatment can get is that
							nobody notices it was added.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Templated to the opening you actually have.</h2>
							<p>
								We come to the house, measure and template every opening ourselves, and work
								from the building as it stands rather than from a plan of how it was drawn.
								Custom drapery does the softening and hides a great deal of hardware. Shades
								handle the sun where a panel would be wrong. Shaped and arched openings are
								templated individually. Everything is made to measure in European fabrics and
								fitted by our own installers, with wiring by our licensed, insured electrical partner, <BalticLink />, scheduled by us so a renovation does not stall waiting
								on a trade.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Every opening measured on its own</b>, because an old house is rarely square.
							</li>
							<li>
								<b>Hardware kept out of the sightline</b>, above it or inside the pocket.
							</li>
							<li>
								<b>Brought in at the drawing stage</b>, while the ceiling is still open.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating to specification without getting in the
								way.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							El Cid and SoSo sit inside our wider{" "}
							<Link to="/custom-drapery-palm-beach.html">Palm Beach</Link> territory, across the
							bridge from{" "}
							<Link to="/window-treatments-palm-beach-island.html">Palm Beach Island</Link>. On
							the treatments,{" "}
							<Link to="/specialty-shaped-windows.html">specialty and shaped windows</Link>{" "}
							covers arches and rakes,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers the hardware
							and where it hides, and <Link to="/drapery-hardware.html">drapery hardware</Link>{" "}
							covers poles, tracks and returns. Our guide to{" "}
							<Link to="/drapery-headers.html">drapery headers, compared</Link> is a good place
							to start on the look.
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
								We work in El Cid, SoSo and across West Palm Beach. Start with a relaxed
								30-minute call, tell us what stage the house is at, and we will come and look at
								the openings before anything gets closed up.
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
