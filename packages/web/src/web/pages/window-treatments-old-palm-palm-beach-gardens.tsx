import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. Angle from
   the brief's Old Palm hook: estate club homes, whole-home window packages,
   tall glass on the golf side. The distinguishing idea on this page is scope,
   a house done in one pass rather than a room at a time. */

const FAQS: FaqEntry[] = [
	{
		q: "Can you do the whole house at once?",
		a: "Yes, and a house this size is usually easier that way. Doing it in one pass means the fabrics are specified against each other, the headers agree from room to room, the motorized openings share one way of being controlled, and the installation happens on a schedule instead of in pieces over a year. It also means we measure everything on one visit and find the awkward openings early.",
	},
	{
		q: "The golf-side glass is very tall. What works there?",
		a: (
			<>
				Shading that you never have to reach. On tall glass the practical answer is a motorized
				solar or roller shade for the day and drapery for the evening and the scale, both driven
				rather than pulled. Wiring runs through our licensed, insured electrical partner,{" "}
				<BalticLink />, coordinated by us. Decided early it is a simple run. Decided after the
				ceiling closes it is a much bigger job.
			</>
		),
	},
	{
		q: "How long does a whole-home package take?",
		a: "Plan on six to eight weeks from approved measurements and fabric to installation, sometimes longer where a particular mill or a large repeat is involved. We would rather tell you a real date at the start than a hopeful one. For a full house we install in a planned sequence, usually the rooms you live in first.",
	},
];

export default function OldPalmPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-old-palm-palm-beach-gardens.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Old Palm, Palm Beach Gardens</div>
							<h1>Window Treatments for Old Palm Golf Club Homes</h1>
							<p>
								Estate-scale rooms, high ceilings, and tall glass facing the course. Houses where
								the window treatments are a package rather than a purchase.
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
						<h2 className="big">A whole house that agrees with itself.</h2>
						<p className="lede">
							In an estate-scale home the risk is not any single window. It is that the house
							gets done a room at a time over several years, by several people, and ends up
							slightly inconsistent everywhere. Different whites. Headers that do not match.
							Three ways to raise a shade. Treating the house as one package is what keeps it
							coherent, and it is generally cheaper than doing it twice.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Scale is the whole brief here. A panel that looks generous in a normal room looks
							mean under a fourteen foot ceiling.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">One visit, one specification, one installer.</h2>
							<p>
								We come to the house, measure every opening ourselves and specify the rooms
								against each other rather than in isolation. Custom drapery carries the scale of
								the large rooms, solar and roller shades take the sun off the golf-side glass,
								Roman shades suit the smaller and softer rooms, and motorization covers
								everything too tall to work by hand. It is all made to measure in European
								fabrics and fitted by our own installers, with the wiring handled by our
								licensed, insured electrical partner, <BalticLink />, scheduled by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Specified as one house</b>, so whites, headers and controls agree.
							</li>
							<li>
								<b>Fullness set for the ceiling height</b>, not to a standard multiplier.
							</li>
							<li>
								<b>Motorization decided early</b>, while the power route is still a drawing.
							</li>
							<li>
								<b>Installed in a planned sequence</b>, the lived-in rooms first.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Old Palm sits inside our{" "}
							<Link to="/custom-roman-shades-palm-beach-gardens.html">
								Palm Beach Gardens
							</Link>{" "}
							territory, a short drive from{" "}
							<Link to="/luxury-window-treatments-jupiter.html">Jupiter</Link>. On the
							treatments,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers the tall
							glass, <Link to="/roman-shades.html">Roman shades</Link> covers the softer rooms,
							and <Link to="/drapery.html">custom drapery</Link> covers fullness, headers and
							stack-back. If the house is on a smart system,{" "}
							<Link to="/smart-home-window-treatments.html">
								smart home window treatments
							</Link>{" "}
							explains how the shading fits into it.
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
							<h2 className="big">Tell us about the house.</h2>
							<p>
								We work in Old Palm and across Palm Beach Gardens and North Palm Beach. Start
								with a relaxed 30-minute call, tell us whether this is one room or the whole
								house, and we will come and measure it properly.
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
