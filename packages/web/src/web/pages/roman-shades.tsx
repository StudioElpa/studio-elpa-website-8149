import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. The angle here is fabric in a tailored form: the rooms where
   full drapery is too much, and the fold styles that change how formal it reads.
   No electrical content on this page, so no BalticLink import. */

const CARDS = [
	{
		title: "Flat fold",
		body: "The quietest of the three. The shade pulls up into clean horizontal folds and hangs almost flat when it is down, which lets a good fabric speak for itself.",
	},
	{
		title: "Relaxed fold",
		body: "A soft smile along the bottom edge. Less formal, warmer in a kitchen or a beach house, and forgiving on windows that see a lot of daily use.",
	},
	{
		title: "Hobbled fold",
		body: "Permanent cascading folds that stay full even when the shade is down. The most decorative option, and the one that gives a plain window real presence.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Roman shades or drapery?",
		a: "It is usually about the room, not the look. Roman shades sit inside the opening and take no wall space, so they suit kitchens, baths, stairwells and any window where panels would crowd the furniture. Drapery softens a whole wall and handles scale. In living rooms and bedrooms we often specify both, a Roman inside the frame and drapery outside it.",
	},
	{
		q: "Can a Roman shade block light properly?",
		a: "It can get close with the right lining. A blackout lining stops light through the fabric, but a Roman hangs slightly off the glass, so a little light still finds the edges. For a bedroom that has to be genuinely dark we either fit an inside-mount roller behind it or layer with drapery, and we will tell you which before you order.",
	},
	{
		q: "Are they safe with children and pets?",
		a: "Yes. We build them cordless and child-safe as standard. Where an opening is high or heavy, motorization removes the reach as well as the cord.",
	},
	{
		q: "How long does it take?",
		a: "Custom and made to order, so typically about 6 to 8 weeks from order to installation. Fabric lead times occasionally add to that, and we tell you at the point of choosing rather than afterwards.",
	},
];

export default function RomanShadesPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/roman-shades.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-roman.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Roman Shades · South Florida</div>
							<h1>Fabric, tailored to the window.</h1>
							<p>
								The softness of drapery in a form that takes no wall space. Made to measure in
								European fabrics, folded the way the room wants, cordless and child-safe.
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
						<div className="kicker">Where they earn their place</div>
						<h2 className="big">For the windows drapery would swallow.</h2>
						<p className="lede">
							Not every window wants panels. A window over a sink, a bath, a stair landing, a
							breakfast nook with a banquette against the wall. Put drapery there and it is in the
							way, or it looks like an apology. A Roman shade gives you the same fabric, the same
							warmth and the same made-to-measure care, contained inside the opening where it
							belongs.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The fold style does more work than the fabric. It is what decides whether the room
							reads formal, relaxed, or quietly decorative.
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
							<h2 className="big">Made for one opening, and only that one.</h2>
							<p>
								We start with a conversation about the room, never a catalog. We come to you,
								measure each opening ourselves, and decide the mount, the lining, the fold depth
								and where the folds land in relation to the glass. A Roman shade shows its
								workmanship every time it is raised, so the fabrication matters more here than
								almost anywhere else. Our own installers hang it, and one person stays with your
								project from the first question to the last bracket.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>European fabrics</b>, chosen for how they fold and how they hold color in
								strong coastal light.
							</li>
							<li>
								<b>Lining specified per room</b>, from a light filter to a full blackout, rather
								than one lining everywhere.
							</li>
							<li>
								<b>Fold depth set to the window</b>, so the stack sits where you want it and never
								covers more glass than it has to.
							</li>
							<li>
								<b>Cordless and child-safe</b> as standard, with motorization where an opening is
								high or heavy.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Rarely the only thing in the room.</h2>
						<p className="lede">
							Roman shades layer well. Pair them with{" "}
							<Link to="/drapery.html">custom drapery</Link> when a wall needs softening, or with{" "}
							<Link to="/roller-solar-shades.html">solar shades</Link> where the sun is the real
							problem and the Roman is there for warmth. On tall or awkward openings,{" "}
							<Link to="/motorized.html">motorization</Link> makes them usable every day rather
							than once a week. If you are still weighing how the top of a window should look, our
							guide to <a href="/drapery-headers.html">drapery headers</a> is a useful companion
							read.
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
							<h2 className="big">Tell us about the window.</h2>
							<p>
								Start with a relaxed 30-minute call. Describe the room and how it is used, and we
								will tell you whether a Roman shade is the right answer or not.
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
