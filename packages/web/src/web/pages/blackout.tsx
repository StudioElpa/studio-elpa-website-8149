import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { BalticLink } from "../components/partner";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original blackout.html. The dark-band list used
   per-item inline colors (#cfc9bf); that now comes from `.band.dark ul.clean`
   with the brief's #E8E1D4, so the inline styles are gone. */

const CARDS = [
	{
		title: "Fitted tight to the glass",
		body: "The magic is in the seal. We fit blackout treatments close to the window, or pair them with drapery, so light has nowhere to slip through.",
	},
	{
		title: "For nurseries too",
		body: "The difference between a nap that happens and an afternoon that falls apart. True darkness helps little ones settle and stay down.",
	},
	{
		title: "Dark, not gloomy",
		body: "Blackout by night, and by day the room still feels bright and beautiful. You get both, because the treatment is made for your room.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Blackout, dimout, or solar? What do I need?",
		a: "For sleep you want true blackout, fitted tight or layered with drapery. Dimout gives privacy and rest without full darkness; solar screens tame glare while keeping the view. We'll match it to how you use the room.",
	},
	{
		q: "Do I need motorization for blackout?",
		a: "No, but it helps you actually use it. When the room closes itself on schedule, the dark happens every night without you thinking about it.",
	},
	{
		q: "How long does it take?",
		a: "Custom and made to order, so typically about 6 to 8 weeks from order to installation. We set a clear expectation up front.",
	},
	{
		q: "Want to go deeper?",
		a: (
			<>
				Read <a href="/journal-blackout.html">The case for real darkness</a>, our piece on why
				blackout matters for sleep, and how motorization takes the friction out of it.
			</>
		),
	},
];

export default function BlackoutPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/blackout.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero night">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/lp-bedroom.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Blackout &amp; Better Sleep · South Florida</div>
							<h1>Make your bedroom truly dark.</h1>
							<p>
								Custom blackout treatments that block the light, not just dim it, so you sleep
								deeper and wake when you meant to. And motorization that closes the room for you.
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
						<h2 className="big">A little light is enough to wreck a good night.</h2>
						<p className="lede">
							Your body reads light as an instruction. Even a sliver, even through closed eyelids,
							tells your brain to ease off the melatonin that keeps you under, and your sleep
							drifts into the shallows. In South Florida the sun arrives early and strong, so if
							your bedroom can't hold the dark, neither can you.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Real blackout doesn't just dim a room. It removes the light. The kind of dark where
							you lose track of the hour and sink back down instead of surfacing.
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
						{/* Uses the shared .body-text size rather than a one-off inline
						    font-size: running prose is one size sitewide, and an inline
						    value is exactly what put this paragraph out of step. */}
						<div className="body-text" data-reveal>
							<div className="kicker">The easy part</div>
							<h2 className="big">Let the room close itself.</h2>
							<p>
								Most people who own blackout shades don't use them the way they should. The
								window's too tall, the cord's a hassle, and it's late. Motorization removes the
								excuse: shades that lower on a schedule you set once, and rise gently in the
								morning. No cords, no reaching, nothing to get out of a warm bed for.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Close on schedule</b>, so the room is dark before you're even in bed.
							</li>
							<li>
								<b>Wake to light on purpose</b>, not a stripe of sun across your face.
							</li>
							<li>
								<b>Cord-free and child-safe</b>, the safest choice in a bedroom or nursery.
							</li>
							<li>
								<b>Wiring handled for you</b> through our licensed, insured electrical partner,{" "}
								<BalticLink />.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Darkness is a specification, not a fabric.</h2>
						<p className="lede">
							The long version of the reasoning on this page is our Journal piece on{" "}
							<a href="/journal-blackout.html">the case for real darkness</a>. In practice blackout
							usually arrives as a shade inside the opening with{" "}
							<Link to="/drapery.html">custom drapery</Link> over it, or as a{" "}
							<Link to="/roman-shades.html">Roman shade</Link> where a flat panel would look too
							plain. For the daytime half of the same window, the solar and dimout fabrics that
							go with it, and a room that should darken on a schedule, see{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link>. The side channels and
							pockets that kill the light leak sit under{" "}
							<Link to="/drapery-hardware.html">drapery hardware</Link>.
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
							<h2 className="big">Ready to make your bedroom truly dark?</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us about the room and how the light wakes
								you, and we'll take it from there.
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
