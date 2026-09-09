import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { BalticLink } from "../components/partner";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. Copy is written for this page, not adapted from another one:
   the angle is the specific South Florida problem roller and solar shades solve,
   which is heat and glare on big glass without giving up the view. Structure
   follows blackout.tsx so the three service pages stay visually consistent. */

const CARDS = [
	{
		title: "Solar screens keep the view",
		body: "An open weave cuts glare and solar heat while you still see the water, the garden, the street. The tighter the weave, the more privacy and the less view, and choosing that number is most of the job.",
	},
	{
		title: "Dimout for the in-between rooms",
		body: "Living rooms, offices, guest rooms. Enough privacy after dark and enough softness by day, without committing the room to full blackness.",
	},
	{
		title: "Blackout where sleep happens",
		body: "In bedrooms and nurseries we fit tight to the glass, or layer with drapery, so light has nowhere to slip around the edges.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "What openness factor should I choose?",
		a: "It depends on which direction the window faces and what you want to keep. A 3 percent weave holds a view well and still cuts most of the glare. A 1 percent gives you more privacy and less view. West-facing walls of glass usually want the tighter weave. We look at the room and the hour you actually use it before we specify anything.",
	},
	{
		q: "Will a solar shade give me privacy at night?",
		a: "No. After dark the lit side becomes the visible side, so a solar screen reads the other way around. Where a room needs both daytime view and nighttime privacy, we pair a solar shade with a dimout roller or with drapery.",
	},
	{
		q: "Do roller shades work on very wide windows?",
		a: "Up to a point. Past a certain width a single shade gets heavy and can track unevenly, so we split the opening into matched panels and align the seams with the mullions. On tall or wide glass we usually recommend motorizing, because a shade nobody can reach is a shade nobody uses.",
	},
	{
		q: "How long does it take?",
		a: "Custom and made to order, so typically about 6 to 8 weeks from order to installation. We give you a clear date up front rather than a vague one.",
	},
];

export default function RollerSolarShadesPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/roller-solar-shades.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-roller.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Roller &amp; Solar Shades · South Florida</div>
							<h1>Take the heat out of the light, keep the view.</h1>
							<p>
								Solar screens that hold your view while cutting glare and solar gain, dimout for
								privacy, blackout for sleep. Made to measure, fitted close, and motorized when the
								glass is bigger than your reach.
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
						<h2 className="big">South Florida sun is not a decorating problem.</h2>
						<p className="lede">
							It is a heat problem, a glare problem, and a fading problem. Afternoon sun through a
							wall of glass warms a room the air conditioning then has to fight, throws enough glare
							that you close the room off entirely, and over a few seasons it takes the color out of
							rugs, art and upholstery. A roller shade is the quiet piece of engineering that stops
							all three, without asking you to give up the reason you bought the house.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The right shade is the one you forget about. It handles the worst hour of the day and
							then gets out of the way of the view.
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
							<h2 className="big">Specified for your window, not off a shelf.</h2>
							<p>
								We start with a conversation about the room and how you use it, never a catalog. We
								come to you, measure every opening ourselves, and read the light at the hour that
								actually bothers you. Then we specify the weave, the color, the roll direction, the
								cassette and the side channels, and our own installers fit it. One point of contact
								from the first question to the last bracket.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Measured in person</b>, every opening, because a wall of glass is rarely as
								square as it looks.
							</li>
							<li>
								<b>Weave and color chosen together</b>, since a dark screen sees out better and a
								light one bounces more heat.
							</li>
							<li>
								<b>Cord-free and child-safe</b> as standard, which matters in any room a child
								uses.
							</li>
							<li>
								<b>Wiring handled for you</b> when a shade is motorized, through our licensed,
								insured electrical partner, <BalticLink />.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Layering is usually the answer.</h2>
						<p className="lede">
							Roller shades do the work; drapery does the warmth. On most projects we hang both, a
							solar or dimout roller inside the opening and{" "}
							<Link to="/drapery.html">custom drapery</Link> outside it, so the room has something
							soft to look at when the shade is up. On tall or wide glass, or anywhere the shade
							should follow the sun without you,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> are what make it
							effortless. And if the room is for sleeping, read why{" "}
							<Link to="/blackout.html">blackout</Link> is a different specification entirely, or
							our Journal piece on{" "}
							<a href="/journal-blackout.html">the case for real darkness</a>.
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
							<h2 className="big">Which window is giving you trouble?</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us which room gets unusable in the
								afternoon, and we will tell you honestly what it needs.
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
