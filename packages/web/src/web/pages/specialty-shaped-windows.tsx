import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. This is one of the brief's named differentiator angles: shades
   for arched, angled and specialty-shaped windows. The copy leans on the thing
   that actually distinguishes us here, which is that these openings cannot be
   ordered, only measured and fabricated. Structure matches the other service pages. */

const CARDS = [
	{
		title: "Arched and half-round",
		body: "A true arch takes a fan or a fixed panel shaped to the curve. Sometimes the honest answer is to treat the rectangle below it and leave the arch open, because the arch is the reason the room is beautiful.",
	},
	{
		title: "Angled and raked",
		body: "Gable ends and stair windows that follow a roofline. The track and the hem both have to sit on the rake, and the fabric has to hang plumb while the opening does not.",
	},
	{
		title: "Corners, bays and curved walls",
		body: "Glass that turns a corner needs the treatment to turn with it, on curved or mitred track, so the eye reads one line instead of three separate windows.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Can an arched window actually be covered?",
		a: "Yes, and often it should not be. A fixed shaped panel or a fan shade will cover an arch, but a fixed panel does not move, so you are choosing permanent filtering rather than control. On a west-facing arch that bakes the room, that is the right trade. On a north-facing arch that is simply pretty, we usually recommend treating the rectangle underneath and leaving the curve alone. We will tell you which one you have.",
	},
	{
		q: "Will a shaped shade look as clean as a rectangular one?",
		a: "Close, but be realistic. Any shade that follows a curve or a rake has a slightly larger light gap at the edges than a square one does, because two shapes have to meet along a line that is not straight. We minimise it with side channels and careful templating. If a room needs true darkness, a shaped shade alone will not deliver it and we would pair it with drapery.",
	},
	{
		q: "How do you measure something that is not square?",
		a: "In person, with a template. For curves and rakes we take physical patterns of the opening rather than trusting a drawing, because a plastered arch is almost never the radius the plans say it is. That template goes to the workroom with the order. It is slower than a tape measure and it is the reason these fit.",
	},
	{
		q: "Does it cost more, and take longer?",
		a: "Yes to both, honestly. Shaped work carries extra fabrication and extra site time, and the templating step adds a visit. Most specialty openings still land in the usual 6 to 8 week window from order to installation, but we will give you a real date for your project rather than a general one.",
	},
];

export default function SpecialtyShapedWindowsPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/specialty-shaped-windows.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-motor.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Specialty-Shaped Window Treatments · South Florida</div>
							<h1>Arched, angled, and nothing like a rectangle.</h1>
							<p>
								Custom shades and drapery for the openings nobody sells off a shelf. Arches, gable
								rakes, corner glass, curved walls and windows two storeys up, templated on site and
								made to the shape you actually have.
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
						<h2 className="big">The best window in the house is usually the hardest one.</h2>
						<p className="lede">
							South Florida architecture is full of openings that were drawn to be admired: the arch
							over the entry, the gable end above the great room, the glass that wraps a corner
							toward the water. They are the reason the house feels the way it does, and they are
							exactly the ones every catalog quietly declines. Which is how people end up living
							with one unusable room, or with a treatment that fits badly enough to spoil the shape
							it was meant to serve.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							A shaped window is not a harder version of a normal order. It is a pattern, taken by
							hand, from the wall in front of you.
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
							<h2 className="big">Templated, not estimated.</h2>
							<p>
								We come to you and take the opening physically, curve by curve, before anything is
								ordered. Then we tell you plainly what will work and what will not, including the
								cases where our advice is to leave the shape uncovered and treat what is below it.
								Our own installers fit the finished piece, so the person hanging it has seen the
								window before, and the light gaps are where we said they would be.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Physical templates</b> for arches and rakes, because a plastered curve is never
								the radius on the drawing.
							</li>
							<li>
								<b>Honest advice about fixed panels</b>, which cover a shape but do not move, so
								you know the trade before you buy it.
							</li>
							<li>
								<b>Side channels where darkness matters</b>, to close the gap a non-straight edge
								always leaves.
							</li>
							<li>
								<b>High and unreachable openings motorized</b>, since a shade nobody can reach is a
								shade nobody uses.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Shaped openings usually want two layers.</h2>
						<p className="lede">
							The shape gets solved with a fitted shade;{" "}
							<Link to="/roller-solar-shades.html">a solar or dimout roller</Link> under the rake,
							or a fixed panel in the arch. The room gets finished with{" "}
							<Link to="/drapery.html">custom drapery</Link> on the rectangle below, which is also
							what softens the light gaps a shaped edge leaves. Anything above head height is worth{" "}
							<Link to="/motorized.html">motorizing</Link>, and if the opening is in a bedroom,{" "}
							<Link to="/blackout.html">blackout</Link> is a separate specification worth reading
							before you decide.
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
							<h2 className="big">Send us the window everyone else said no to.</h2>
							<p>
								Start with a relaxed 30-minute call. Describe the shape, or send a photo, and we
								will tell you honestly whether it should be covered and what that would take.
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
