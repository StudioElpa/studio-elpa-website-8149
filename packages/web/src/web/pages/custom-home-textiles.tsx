import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. This is the one service that is not a window treatment, so the
   copy has to earn its place: the angle is that the same workroom and the same
   European fabrics carry on into the rest of the room. Structure matches the other
   service pages. */

const CARDS = [
	{
		title: "Bedding and headboards",
		body: "Coverlets, shams, bolsters and upholstered headboards, made in the same cloth family as the drapery so the bedroom reads as one thought rather than several purchases.",
	},
	{
		title: "Cushions and throws",
		body: "The layer that makes a finished room look lived in. Cut from the offcuts of your own drapery where it suits, or deliberately set against it.",
	},
	{
		title: "Table linen and the small things",
		body: "Runners, napkins, placemats and the pieces that only appear when people come over. Small work, and the part of a house that guests actually handle.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Do I have to be a drapery client?",
		a: "No, though most people who ask are. We take home textile work on its own, and it is often how a project starts: bedding for one room, then the windows a season later. The only thing we would say honestly is that a small standalone order carries the same measuring and making effort as a large one, so the value is better when there is a room's worth of it.",
	},
	{
		q: "Can you match the fabric to drapery I already have?",
		a: "Usually, if we can identify the fabric or you still have the details. Where the exact cloth is discontinued, which happens, the better answer is often to relate rather than match: a tone from the same family, a different weight, so it looks chosen instead of almost right. We will show you both options before deciding.",
	},
	{
		q: "Is everything washable?",
		a: "Not all of it, and we will be specific rather than vague. Linens and cottons for bedding and table linen are generally launderable and we make them expecting that. Interlined coverlets, velvets and most upholstered pieces are not, and want professional cleaning. You get the care advice with the delivery, in writing.",
	},
	{
		q: "How long does it take?",
		a: "Typically the same 6 to 8 weeks as the rest of our work, since it comes from the same workroom and the same fabric orders. Where textiles are being made alongside drapery for the same room, we deliver them together so the room finishes in one moment rather than in instalments.",
	},
];

export default function CustomHomeTextilesPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/custom-home-textiles.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/project-2.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Custom Home Textiles · South Florida</div>
							<h1>The rest of the room, in the same hand.</h1>
							<p>
								Bedding, headboards, cushions, throws and table linen, made in the same workroom
								and the same European fabrics as your drapery, so the softness carries all the way
								through the house.
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
						<h2 className="big">Beautiful windows above a bed that does not match them.</h2>
						<p className="lede">
							It is the most common way a finished room stops just short. The drapery is made, the
							fabric was chosen carefully, the light is finally right, and then the bedding came
							from somewhere else entirely and the whole room reads as two decisions instead of one.
							The fix is not more shopping. It is having the same people, working from the same
							fabrics, make the soft things in the room at the same time as the ones at the window.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							A room is finished when nothing in it looks like it arrived separately.
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
							<h2 className="big">Measured and made, the same way the drapery is.</h2>
							<p>
								We measure the bed, the bench, the table, exactly as we would an opening, because a
								coverlet that is two inches short is as obvious as a curtain that is. Fabrics are
								chosen in the room alongside the window treatments, in the same visit, so the
								relationships are decided while you can see them together. Everything is made to
								order, delivered with written care advice, and where it accompanies drapery, it
								arrives on the same day.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Measured in person</b>, beds and benches included, not ordered to a standard
								size.
							</li>
							<li>
								<b>Chosen alongside the drapery</b>, in the room, so the fabrics are decided
								against each other.
							</li>
							<li>
								<b>Delivered together</b> with the window treatments, so the room finishes in one
								moment.
							</li>
							<li>
								<b>Care advice in writing</b>, with the honest version of what can and cannot be
								laundered.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Start at the window, finish at the bed.</h2>
						<p className="lede">
							The natural starting point is{" "}
							<Link to="/drapery.html">custom drapery</Link>, and the work grows outward from it, using the
							same cloth described on{" "}
							<Link to="/european-fabrics.html">European fabrics and textiles</Link>. In bedrooms
							the other half of the conversation is darkness, which is a specification of its own:{" "}
							<Link to="/blackout.html">blackout</Link>, and our Journal piece on{" "}
							<a href="/journal-blackout.html">the case for real darkness</a>. Where the window
							wants softness without full curtains,{" "}
							<Link to="/roman-shades.html">Roman shades</Link> in a matching fabric are often the
							neatest way to tie a bedroom together.
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
							<h2 className="big">Which room is nearly finished?</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us what is already in the room, and we
								will tell you what it is missing and what it would take.
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
