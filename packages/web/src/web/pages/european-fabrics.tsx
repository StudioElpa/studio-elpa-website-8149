import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. One of the brief's named differentiator angles. Careful
   wording rule applies throughout: European FABRICS, never "made in Europe".
   Structure matches the other service pages. */

const CARDS = [
	{
		title: "Linen and linen blends",
		body: "The fabric most people are picturing when they say they want it to look effortless. It creases, it moves, it softens with age, and in a humid climate it wants the right lining behind it.",
	},
	{
		title: "Wools, velvets and heavier weaves",
		body: "For rooms that want weight and quiet. They absorb sound, hold a pleat beautifully, and give an evening room a depth that a light fabric never will.",
	},
	{
		title: "Sheers with actual structure",
		body: "Voiles and open weaves that hold their shape instead of clinging to the glass. This is where European mills are genuinely hard to match.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Why European fabrics specifically?",
		a: "Because of the finishing and the consistency. The mills we buy from have been refining the same weaves for a very long time, and it shows in how a panel falls, how a sheer holds its body, and how the color reads across two bolts of the same order. It is not about the label. It is about a fabric behaving the same way in your room as it did in the sample.",
	},
	{
		q: "Will linen fade or rot in South Florida sun?",
		a: "Any natural fibre fades in direct sun, and we would rather say that plainly than sell you a fantasy. What changes the outcome is the lining, the layering and the position. We specify a lining and often an interlining to take the ultraviolet hit instead of the face fabric, and on brutal west-facing glass we pair drapery with a solar shade so the fabric is never the only thing in the way.",
	},
	{
		q: "Can I use a fabric my designer specified?",
		a: "Yes, and we do it constantly. If you or your designer has a fabric in mind we will fabricate in it, tell you honestly how it will behave in this climate, and flag anything that concerns us about repeat, width or weight before it is cut. We work with trade designers on exactly this basis.",
	},
	{
		q: "Does buying from European mills add time?",
		a: "Sometimes, and it depends on whether the fabric is in stock. Most projects still land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we tell you the real date at the point you choose the fabric, not afterwards.",
	},
];

export default function EuropeanFabricsPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/european-fabrics.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/lp-bedroom.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">European Fabrics &amp; Textiles · South Florida</div>
							<h1>Chosen for how it falls, not how it photographs.</h1>
							<p>
								Linens, wools, velvets and structured sheers from European mills, specified with
								the lining, the header and the climate in mind, and cut for your windows.
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
						<h2 className="big">A swatch tells you the color. It tells you nothing else.</h2>
						<p className="lede">
							Two fabrics can look identical in your hand and behave like different materials on the
							window. One breaks into a soft, heavy fold and one hangs flat and thin. One holds its
							color for years behind the right lining and one goes grey on the sun side by the
							second season. The whole craft of this is knowing which is which before it is cut,
							and that knowledge comes from working with the same mills long enough to trust them.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							We buy European fabrics because of how they behave three years in, not because of how
							they look on the roll.
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
							<h2 className="big">Fabric first, in your light.</h2>
							<p>
								We bring the fabrics to you and hang them in the room, because a linen that looks
								warm in a showroom can read grey against your wall color and your particular
								afternoon. We look at them at the hour you actually use the room. Then we specify
								the lining and interlining with the face fabric, not after it, since that is what
								decides both how it falls and how long it lasts. Everything is cut and made to
								your measurements.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Samples seen in your room</b>, against your walls, at your worst hour of light.
							</li>
							<li>
								<b>Lining specified with the face fabric</b>, since it carries the ultraviolet and
								most of the weight of the fold.
							</li>
							<li>
								<b>Repeat and width checked before cutting</b>, so a pattern matches across a wide
								wall of glass.
							</li>
							<li>
								<b>Designer's own specification welcome</b>, fabricated by us, with any concerns
								flagged before it is cut.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">The fabric is half the decision.</h2>
						<p className="lede">
							The other half is the header, which changes the same cloth completely; our guide to{" "}
							<a href="/drapery-headers.html">drapery headers, compared</a> shows exactly that. From
							there,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers the making and the stack-back,{" "}
							<Link to="/drapery-hardware.html">drapery hardware</Link> covers what it hangs on, and{" "}
							<Link to="/custom-home-textiles.html">custom home textiles</Link> is where the same
							fabrics carry on into cushions, bedding and upholstery. If the room is a restaurant or
							a hotel, the fabric also has to be rated:{" "}
							<Link to="/flame-retardant-drapery.html">flame-retardant drapery</Link>.
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
							<h2 className="big">Let us bring the fabrics to you.</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us the room and the feeling you are
								after, and we will arrive with the right shortlist instead of the whole library.
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
