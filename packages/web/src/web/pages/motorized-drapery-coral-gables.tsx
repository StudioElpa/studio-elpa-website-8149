import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). Coral Gables is the designer-led
   end of the territory, and the service hook is motorized drapery rather than
   shades: the track and the fabrication have to be specified together, which is
   the part most projects get wrong. Written for the Gables specifically. */

const CARDS = [
	{
		title: "Track and cloth, decided together",
		body: "A motor moves a track, and the track has to be chosen for the weight of the finished panel. Specify the fabric first and the hardware second and you get a drapery that drags. We do both at the same table.",
	},
	{
		title: "Old houses, hidden wiring",
		body: "Mediterranean and mid-century houses here have plaster, beams and ceilings worth keeping. Getting power to a track without cutting into any of that is a planning problem, and it is solved before anything is ordered.",
	},
	{
		title: "Quiet is a specification",
		body: "Motor choice, mounting and the tolerance in the track decide how much you hear. In a formal room where the drapery draws while people are sitting under it, that matters more than any feature on a spec sheet.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Can drapery be motorized without it looking mechanical?",
		a: "Yes, and it should. The hardware sits above the line of sight or inside a recess, the panels return to the wall, and what you see is cloth moving. If the track is visible from the sofa, something has been specified for the installer's convenience rather than the room's.",
	},
	{
		q: "We are working with an interior designer. How does that work?",
		a: "We regularly work alongside interior designers. The vision stays theirs. We fabricate to their specification, tell them honestly how a fabric will behave once it is a twelve foot panel in this climate, and flag anything about repeat, width or weight before it is cut.",
	},
	{
		q: "Our house is older. Will we have to open the ceiling?",
		a: (
			<>
				Not always. Battery motors handle a surprising number of runs now, and where a hardwired
				track is genuinely the better answer, our licensed and insured electrical partner,{" "}
				<BalticLink />, plans the route with us before anything is cut. Either way you get the
				answer at specification, not on installation day.
			</>
		),
	},
	{
		q: "Can motorized drapery and shades run together?",
		a: "They can, and in a room with real glass they usually should. A solar shade doing the daytime and drapery closing in the evening can share one control, so the room has two settings rather than four switches.",
	},
	{
		q: "How long does a project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function CoralGablesPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/motorized-drapery-coral-gables.html" />
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
							<div className="kicker">Motorized Drapery · Coral Gables</div>
							<h1>Motorized Drapery in Coral Gables</h1>
							<p>
								Wide openings, tall ceilings, and houses with plaster and beams worth protecting.
								Motorized drapery here is a planning job before it is a hardware job.
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
						<h2 className="big">Some panels are simply too big to pull.</h2>
						<p className="lede">
							Past a certain width and height, drapery stops being something you touch. Reaching a
							fourteen foot panel means a hand on the cloth twice a day, which marks it, and a
							pull at the wrong angle, which racks the header. A motor moves the whole run evenly
							from the top, which is both easier to live with and kinder to the fabric than any
							hand ever is.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Motorization is not a gadget on top of the drapery. It is part of how the drapery is
							built.
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
							<h2 className="big">One studio for the cloth and the mechanism.</h2>
							<p>
								We specify the track, the motor, the header and the fabric as one decision, then
								make everything to measure in European fabrics and fit it with our own installers.
								The power is handled by our licensed and insured electrical partner, <BalticLink />,
								scheduled and managed by us, so the wiring, the track and the fabrication all
								answer to one point of contact. If you are working with a designer, we work to
								their drawings and stay out of the relationship.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Hardware sized to the finished panel</b>, not to a catalog page.
							</li>
							<li>
								<b>Wiring routed at specification</b>, so nothing is cut into a ceiling as a
								surprise.
							</li>
							<li>
								<b>Our own installers</b>, so the making and the hanging are the same
								responsibility.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating to specification without getting between
								you and your client.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">South of the city, and into the detail.</h2>
						<p className="lede">
							We work the Gables and the waterfront around it, including{" "}
							<Link to="/window-treatments-gables-estates-cocoplum.html">
								Gables Estates and Cocoplum
							</Link>
							. On the treatments, <Link to="/motorized.html">motorized shades and drapery</Link>{" "}
							covers the hardware in full,{" "}
							<Link to="/smart-home-window-treatments.html">smart home integration</Link> covers
							scenes and scheduling, <Link to="/drapery.html">custom drapery</Link> covers the
							making, and <Link to="/european-fabrics.html">European fabrics</Link> explains what
							we buy and why. Our guide to{" "}
							<a href="/drapery-headers.html">drapery headers, compared</a> is worth reading before
							you pick a pleat, because not every header suits a track.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things Gables clients ask.</h2>
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
							<h2 className="big">Tell us about the opening.</h2>
							<p>
								We work Coral Gables and Pinecrest, houses and apartments alike. Start with a
								relaxed 30-minute call, tell us how wide and how tall, and we will tell you
								honestly whether it wants a motor or just a better track.
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
