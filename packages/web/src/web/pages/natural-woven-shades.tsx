import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. The angle is texture and warmth: what a woven material does
   to Florida light, and the honest limitations (privacy, darkness) that make
   lining and layering the real decisions. No electrical content, so no
   BalticLink import. */

const CARDS = [
	{
		title: "Light becomes golden",
		body: "A woven shade does not block the sun so much as translate it. Hard midday glare comes through the weave as something warm and diffused, and the room reads softer all afternoon.",
	},
	{
		title: "Texture the eye can read",
		body: "Reed, grass, jute, bamboo. Up close you can see the hand of it, the small irregularities of a natural material, which is exactly what a room of flat painted surfaces is missing.",
	},
	{
		title: "Lined when a room needs it",
		body: "Unlined, a woven shade filters light and gives very little privacy. Add a lining and it can give you privacy, a dimout, or close to full darkness, without losing the texture on the room side.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Will an unlined woven shade give me privacy?",
		a: "Not really, and anyone who tells you otherwise is selling. The weave is open by nature, so during the day it obscures more than it hides, and after dark, with the lights on, it hides very little. For bedrooms, baths and any room facing a neighbor we specify a privacy or blackout lining, which keeps the texture facing into the room.",
	},
	{
		q: "How do they hold up in coastal humidity?",
		a: "Natural fibers move with humidity, so a woven shade in South Florida will settle slightly over its first months. That is normal and it is why we allow for it at measure rather than pretending it does not happen. In a bathroom or an open-air lanai we usually steer toward the more stable materials, or toward a woven-look alternative that will not take on moisture.",
	},
	{
		q: "Can they be motorized?",
		a: "Yes, and on tall openings we recommend it. A lined woven shade carries real weight, so a tall one is a genuine effort to raise by hand. Motorization also keeps the shade running on a schedule rather than being left at whatever height it landed on last week.",
	},
	{
		q: "How long does it take?",
		a: "Custom and made to order, so typically about 6 to 8 weeks from order to installation. Natural materials are woven in batches and shade slightly between them, so we order a whole room together rather than one window at a time.",
	},
];

export default function NaturalWovenShadesPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/natural-woven-shades.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-woven.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Natural Woven Shades · South Florida</div>
							<h1>Warmth you can see the hand of.</h1>
							<p>
								Shades woven from reeds, grasses and bamboo that turn hard Florida light into
								something soft and golden. Beautiful on their own, better layered with drapery,
								and lined whenever a room needs privacy or darkness.
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
						<div className="kicker">Why they suit a Florida house</div>
						<h2 className="big">Coastal rooms can go cold without texture.</h2>
						<p className="lede">
							So much of a South Florida home is hard and smooth: stone floors, plaster walls,
							glass to the ceiling, a palette kept deliberately pale. It photographs beautifully
							and it can still feel unfinished to live in. A natural weave is the cheapest way back
							to warmth, because it brings in an organic material with actual depth, and it does it
							at the window, where the light will show it off all day.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							They are the one treatment people reach out and touch. That is usually a sign the
							room needed them.
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
							<h2 className="big">Chosen in your light, not under showroom bulbs.</h2>
							<p>
								We start with a conversation about the room, never a catalog. Natural material is
								the one category where a sample really has to be seen at the window it is meant
								for, because the weave changes completely between morning and late afternoon, and
								the color shifts against your wall rather than against a white board. We measure
								every opening ourselves, order a whole room from one batch, and our own installers
								hang it. One point of contact throughout.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Samples left with you</b>, so you can watch a weave through a full day before
								committing.
							</li>
							<li>
								<b>Ordered by the room</b>, because natural fibers shade slightly from batch to
								batch.
							</li>
							<li>
								<b>Lining specified per window</b>, from none at all to full blackout, depending on
								what that room actually needs.
							</li>
							<li>
								<b>Cordless and child-safe</b> as standard, with motorization on the tall or heavy
								openings.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Best in company.</h2>
						<p className="lede">
							A woven shade and <Link to="/drapery.html">custom drapery</Link> is one of the most
							reliable pairings we install: texture inside the opening, softness on the wall around
							it. Where sun and heat are the real complaint, a{" "}
							solar shade does that work better and can sit behind the weave. If the room is for sleeping, read why{" "}
							<Link to="/blackout.html">blackout</Link> is its own specification, and consider{" "}
							<Link to="/motorized.html">motorization</Link> on anything above reach. For a more
							tailored fabric look in the same space, compare{" "}
							<Link to="/roman-shades.html">Roman shades</Link>.
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
							<h2 className="big">Want to see a weave in your own light?</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us about the room, and we will bring the
								materials worth looking at rather than all of them.
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
