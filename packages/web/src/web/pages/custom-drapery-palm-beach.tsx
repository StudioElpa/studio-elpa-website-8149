import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). The exemplar for the geo layer:
   the remaining nineteen follow this shape, never this text. The brief is
   explicit that each geo page must be genuinely different rather than a
   city-name swap, so the lede, the body and the FAQs here are written for
   Palm Beach specifically and are drawn from the brief's worked copy.

   Nothing about the place is invented. The neighbourhoods named (Estate
   Section, North End, Midtown lakefront) come from the target-areas
   reference, and 33480 is the island's only ZIP, which is what the route's
   areaServed narrows the Service schema to. */

const CARDS = [
	{
		title: "The length is the whole thing",
		body: "Floor-length or nothing, in most island rooms. Whether a panel breaks softly at the floor or pools deliberately changes how formal the room reads, and it is decided at measurement, not after the fabric is cut.",
	},
	{
		title: "Light that comes off the water",
		body: "Lakefront and oceanfront rooms take light twice, once from the sky and once off the surface. That second bounce is what fades a face fabric, so the lining carries it instead.",
	},
	{
		title: "Scale that suits the architecture",
		body: "Wide openings and tall ceilings will make a standard panel look thin. Fullness, header and stack-back are specified against the opening so the drapery holds its own beside the stone and the glass.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Do you come to the island for a consultation?",
		a: "Yes. Palm Beach is core territory for us, and we measure and specify in the room rather than from a plan. We bring fabrics with us and look at them against your walls at the hour you actually use the space, because a linen that reads warm in a showroom can read gray in an island room at four in the afternoon.",
	},
	{
		q: "Can drapery work in a house that is mostly glass?",
		a: "It is usually the thing that makes the glass livable. Drapery softens the scale of a wide opening and gives the eye somewhere to rest, and where the sun is genuinely punishing we pair it with a solar shade so the fabric is never the only thing in the way. You keep the view and lose the glare.",
	},
	{
		q: "Our drapery needs to be motorized. Who handles the electrical?",
		a: (
			<>
				We do, through our licensed, insured electrical partner, <BalticLink />. They handle the
				power and we schedule and manage them, so the wiring, the track and the fabrication all
				answer to one point of contact. You never have to find or coordinate a trade.
			</>
		),
	},
	{
		q: "We are working with an interior designer. Does that complicate things?",
		a: "Not at all. We regularly work alongside interior designers, and the vision stays the designer's. We fabricate to their specification, tell them honestly how a fabric will behave in this climate, and flag anything about repeat, width or weight before it is cut.",
	},
	{
		q: "How long does a drapery project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function CustomDraperyPalmBeachPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/custom-drapery-palm-beach.html" />
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
							<div className="kicker">Custom Drapery · Palm Beach</div>
							<h1>Custom Drapery in Palm Beach</h1>
							<p>
								Nothing finishes a Palm Beach room like drapery. On the island the light is
								generous and the architecture is confident, and drapery is what softens all of
								it.
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
						<h2 className="big">
							Tall windows, wide openings, rooms that open to the water.
						</h2>
						<p className="lede">
							Drapery warms the stone and glass, frames the view, and makes a grand space feel
							like a home you actually live in. It is also the most forgiving way to handle island
							light. A room with two exposures and a lake in front of it takes sun from the sky
							and again off the water, and that second bounce is what tires furniture and floors.
							Panels with the right lining behind them take that hit instead.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							In a Palm Beach home that usually means generous, floor-length panels that move well
							and read as quiet luxury rather than decoration.
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
							<h2 className="big">A conversation about the room, never a catalog.</h2>
							<p>
								We make drapery to measure in European fabrics, chosen for how they fall, how
								they age, and how they handle strong coastal light. Everything is considered: the
								header, the lining, the length, the way the fabric pools or breaks at the floor.
								We come to you, measure carefully, and handle the whole project with our own
								installers, so there is one point of contact from the first question to the last
								panel hung. If a project calls for motorization, the wiring is handled by our
								licensed, insured electrical partner, <BalticLink />, scheduled and managed by
								us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Measured in the room</b>, at the hour you use it, with fabrics held against
								your own walls.
							</li>
							<li>
								<b>European fabrics</b>, specified with the lining and interlining rather than
								after them.
							</li>
							<li>
								<b>Our own installers</b>, so the making and the hanging are the same
								responsibility.
							</li>
							<li>
								<b>Electrical handled for you</b>, licensed and insured, coordinated on our
								schedule.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">If you are weighing header styles.</h2>
						<p className="lede">
							Our guide to <a href="/drapery-headers.html">drapery headers, compared</a> walks
							through ripple fold, pinch pleat, French pleat and more, and how each changes the
							feel of a room. From there,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers the making and the stack-back,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers the openings
							that are too tall or too wide to work by hand, and{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains what we buy and
							why. For a bedroom that needs real darkness,{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link>.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things island clients ask.</h2>
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
								We work across Palm Beach, from the Estate Section to the North End and the
								Midtown lakefront. Start with a relaxed 30-minute call. Tell us the room and the
								feeling you are after, and we will come to the island with the right shortlist
								instead of the whole library.
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
