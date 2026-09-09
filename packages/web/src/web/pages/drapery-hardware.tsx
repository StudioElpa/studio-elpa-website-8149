import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. This replaces the homepage "Decorative Hardware" card's dead
   end, and it is deliberately about two things at once: hardware you are meant to
   see, and hardware you are meant not to. Structure matches the other service pages. */

const CARDS = [
	{
		title: "Rods, brackets and finials",
		body: "Bronze, brass, matte black, hand-finished wood. Chosen against the fabric and the metal already in the room, at a diameter that suits the drop rather than the catalog.",
	},
	{
		title: "Track you are not meant to notice",
		body: "Ceiling-mounted and recessed track for long runs, corners and walls of glass, where the point is that the drapery appears to come out of the architecture.",
	},
	{
		title: "Rings, hooks and the quiet parts",
		body: "The pieces nobody photographs and everybody feels. A ring that glides, a return that closes, a hem that stops exactly where it should.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Should the hardware match my door handles and faucets?",
		a: "Match or relate, but do not force it. In a room where the metal is already consistent, matching reads calm. Where the finishes are mixed, which is most real houses, picking up one of them deliberately looks intentional and chasing all of them looks anxious. We choose it in the room, with the fabric in hand, because finishes read completely differently under South Florida light than they do on a website.",
	},
	{
		q: "Rod or track?",
		a: "A rod is jewelry and a track is engineering. Use a rod where the hardware is part of the look and the run is a normal width. Use track for long walls of glass, for corners, for anything motorized, and for the recessed and ceiling-mounted details where the drapery should seem to have no hardware at all. Plenty of houses want both, in different rooms.",
	},
	{
		q: "Can you install into concrete block, or a ceiling that has nothing behind it?",
		a: "Yes, and this is a real South Florida problem rather than a theoretical one. Block, poured concrete, thin drywall over furring, and ceilings with no blocking where you need it all need different fixings, and heavy interlined drapery is unforgiving of a guess. Our own installers do this work and carry the fixings for it, which is why we measure the wall as well as the window.",
	},
	{
		q: "Can I keep the hardware I already have?",
		a: "Sometimes, and we will say so if you can. If the rod is sound, the right diameter for the new drapery weight, and the brackets are fixed into something real, reusing it is sensible and we will happily hang new panels on it. If it will sag under interlined fabric, we will tell you that instead of quietly hanging it and letting you discover it in a year.",
	},
];

export default function DraperyHardwarePage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/drapery-hardware.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-hardware.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Drapery Hardware · South Florida</div>
							<h1>The part you see last and feel first.</h1>
							<p>
								Rods, brackets, finials, rings and concealed track, specified with the fabric
								rather than after it, and installed into walls and ceilings that will actually hold
								them.
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
						<h2 className="big">Beautiful fabric on the wrong rod looks cheap.</h2>
						<p className="lede">
							Hardware is where most drapery quietly goes wrong. A rod too thin for the drop bows in
							the middle. Brackets fixed into nothing pull out of the wall a season later. A finial
							from a different world than the fabric makes an expensive room look assembled from
							parts. And a track chosen without thinking about the return leaves a stripe of light
							down the wall every night. None of it is dramatic on its own. All of it is the
							difference between drapery that looks made and drapery that looks bought.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Hardware is either the jewelry or the architecture. What it should never be is an
							afterthought.
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
							<h2 className="big">Specified with the fabric, in the room.</h2>
							<p>
								We do not pick hardware from a page. We bring finishes to the house and hold them
								against the fabric, the wall color and the metal that is already there, at the hour
								you use the room. Then we size the rod or the track to the weight and the drop the
								drapery will actually have, work out the fixings for the wall we are drilling into,
								and our own installers hang it. If your drapery is motorized, the track and the
								motor are specified as one thing, not bolted together later.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Finish chosen against the fabric</b>, in daylight, in the room it will live in.
							</li>
							<li>
								<b>Sized for the real drop and weight</b>, so an interlined panel never bows the
								rod.
							</li>
							<li>
								<b>Fixings worked out on site</b>, for block, concrete, or a ceiling with no
								blocking where you need it.
							</li>
							<li>
								<b>Returns and overlaps detailed</b>, because that is where the light gets in at
								the edges.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Hardware is chosen last and decided early.</h2>
						<p className="lede">
							The header decides the hardware, so the useful next read is our guide to{" "}
							<a href="/drapery-headers.html">drapery headers, compared</a>, where the same fabric
							on a ripple fold, a pinch pleat and a grommet becomes three different rooms. From
							there,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers the fabric, the lining and the
							stack-back, and{" "}
							<Link to="/european-fabrics.html">European fabrics and textiles</Link> covers what the
							panels are actually made of. If anything is going to move on its own, decide that
							before the track:{" "}
							<Link to="/motorized.html">motorized drapery and shades</Link>.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things people ask.</h2>
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
							<h2 className="big">Seen or unseen?</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us whether you want the hardware to be
								part of the room or to disappear into it, and we will show you what that looks
								like.
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
