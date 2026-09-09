import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original drapery.html, with one edit: the hero
   line read "quietly transformative" and the brief bans "transformative", so it
   now says what it actually means. */

const CARDS = [
	{
		title: "Softness and warmth",
		body: "Fabric takes the hard edge off a room, absorbs sound, and makes a space feel calm and considered the moment you walk in.",
	},
	{
		title: "The right fit, exactly",
		body: "Header, lining, length, and stack-back all chosen for your windows. Ripple fold, relaxed pleat, or floor-pooling linen that moves with a breeze.",
	},
	{
		title: "Better with shades",
		body: "Layer drapery over solar or blackout shades and you get beauty and performance together: light, privacy, and warmth, all in your control.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "What does custom drapery cost?",
		a: "It's priced by the project, because fabric, size, and hardware all matter. After a quick look at your space you'll get a clear proposal with no surprises. We're not the cheapest, and we're not trying to be.",
	},
	{
		q: "How long does it take?",
		a: "Because the work is custom and made to order, typical lead time runs about 6 to 8 weeks from order to installation. We set a clear expectation up front and keep you posted.",
	},
	{
		q: "Do you come to me?",
		a: "Yes. We bring the samples and fabric books to your home, in your light. We also offer virtual consultations and ship anywhere in the U.S.",
	},
	{
		q: "Is the first call really free?",
		a: "Yes, and there's no obligation. It's a relaxed 30-minute conversation to understand your project and see if we're the right fit.",
	},
];

export default function DraperyPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/drapery.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-drapery.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Custom Drapery · South Florida</div>
							<h1>Drapery that makes a room feel finished.</h1>
							<p>
								Made to measure in European fabrics and fitted to your windows and the way you
								live. Soft, warm, and it quietly changes how the whole room feels.
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
						<div className="kicker">Why it matters</div>
						<h2 className="big">The one thing that pulls a room together.</h2>
						<p className="lede">
							Nothing finishes a space like drapery. It softens hard corners, warms up glass and
							stone, quiets the echo of a room, and frames a view the way it deserves. Done well,
							it's the difference between a house and a home.
						</p>
						<p className="lede">
							The header, the few inches at the top where the fabric meets the rod, decides more
							about the feeling than almost anything else you choose. Our{" "}
							<Link to="/drapery-headers.html">guide to drapery headers</Link> walks through all
							nine, in plain English.
						</p>
					</div>
				</section>

				<section className="block band">
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

				<section className="block">
					<div className="wrap two" data-reveal-group>
						<div data-reveal>
							<div className="kicker">The Studio Elpa difference</div>
							<h2 className="big">Consultants first. Salespeople never.</h2>
							<p className="lede">
								We don't start with a catalog. We start with your room, how you use it, and what
								you'd love it to feel like. Then we handle everything, so it's effortless for you.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Made to measure</b> in European fabrics chosen for how they fall, age, and
								handle light.
							</li>
							<li>
								<b>Our own installers</b> hang every treatment, never subcontracted.
							</li>
							<li>
								<b>One point of contact</b> from the first conversation to the final steam and
								dress.
							</li>
							<li>
								<b>We protect the designer's vision</b> when you're working with one.
							</li>
							<li>
								<b>Concealed hardware</b> where the architecture allows it: for a fully concealed
								look, we install Blindspace recess systems so the track sits out of sight.
							</li>
						</ul>
					</div>
				</section>

				<section className="block band">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 30 }} data-reveal>
							<div className="kicker">Before &amp; after</div>
							<h2 className="big">A bare arched window, finally dressed.</h2>
						</div>
						<div className="ba" data-reveal-group>
							<figure data-reveal>
								<span className="ba-tag">Before</span>
								<img
									className="ba-img"
									src="/assets/ba-before.jpg"
									alt="Bare arched dining room window before treatment"
									loading="lazy"
									decoding="async"
								/>
							</figure>
							<figure data-reveal>
								<span className="ba-tag">After</span>
								<img
									className="ba-img"
									src="/assets/ba-after.jpg"
									alt="The same arched window with full custom sheer drapery"
									loading="lazy"
									decoding="async"
								/>
							</figure>
						</div>
						<p className="ba-cap soft" data-reveal>
							The same dining room, given full custom sheer drapery that softens the afternoon
							light and finally frames the architecture, without hiding the view.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Drapery is one layer of the room.</h2>
						<p className="lede">
							The panel is only half of it. What it hangs from decides how it moves, which is why{" "}
							<Link to="/drapery-hardware.html">drapery hardware</Link> gets its own page, and the
							cloth itself is a decision of its own, covered under{" "}
							<Link to="/european-fabrics.html">European fabrics and textiles</Link>. For the detail
							that sets the character of a panel more than anything else, our Journal piece on{" "}
							<a href="/drapery-headers.html">drapery headers</a> walks through all nine. Drapery
							layers well over <Link to="/roller-solar-shades.html">roller and solar shades</Link>{" "}
							or a <Link to="/roman-shades.html">Roman shade</Link>, and when the panels should draw
							themselves, <Link to="/motorized.html">motorized drapery</Link> is the next step.
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
							<h2 className="big">Tell us about the room.</h2>
							<p>
								Start with a relaxed 30-minute call. We'll bring the questions and the fabric
								knowledge; you bring the room.
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
