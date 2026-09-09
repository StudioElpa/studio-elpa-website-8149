import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { BalticLink } from "../components/partner";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. Deliberately distinct from /flame-retardant-drapery.html: that
   page is about the fabric rating, this one is about running a project inside a
   business that cannot close. Structure matches the other service pages. */

const CARDS = [
	{
		title: "Built for a hundred hands a day",
		body: "Residential drapery is touched by a family. A restaurant panel is touched by everyone who walks past it. Weights, hems, linings and hardware all get specified up a level.",
	},
	{
		title: "Rooms that are too loud",
		body: "Hard floors, glass and stone make a dining room that nobody can talk in. Heavy fabric on a long wall is one of the few acoustic fixes that also looks like a design decision.",
	},
	{
		title: "Phased around service",
		body: "Measured, delivered and installed between covers or overnight, section by section, so the room is ready before the doors open.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Can you work without closing the restaurant?",
		a: "In most cases yes. We measure during quiet hours, fabricate off site, and install overnight or between services, usually in phases so only part of the room is out of use at a time. What we will not do is promise a single-night turnaround for a room that genuinely needs three. You will get a real schedule at survey.",
	},
	{
		q: "How long does a hospitality project take?",
		a: "The making is the same 6 to 8 weeks as a residential project, because it is the same custom fabrication. What changes the total is the front end: confirming the rated fabric and the sign-off path can add time if it has not been considered yet. Bring us in early and the timeline usually looks like any other project.",
	},
	{
		q: "Do you handle rated fabric and the paperwork?",
		a: "Yes. Public areas generally need textiles meeting a recognised flame-resistance standard, and we specify inside that range and keep the mill's documentation with your project. Whether your specific space and layout satisfy the code is your fire marshal's determination, not ours, and we say so plainly rather than implying we can sign it off.",
	},
	{
		q: "Is this worth it for a small independent room?",
		a: "Sometimes not, and we will say so. If the room has four windows and a modest budget, an off-the-shelf solution may serve you better than custom, and we would rather tell you that on the first call than sell you something disproportionate. Where it does pay off is durability, acoustics, glare on a west-facing terrace, or a room whose look is part of what people come for.",
	},
];

export default function HospitalityWindowTreatmentsPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/hospitality-window-treatments.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					{/* The client's photograph of a private dining booth. Supplied with the
					    alt sentence "Custom drapery framing a private dining booth in an
					    upscale restaurant." It is kept here because a CSS background image
					    cannot carry an alt attribute. Per QA-NOTE §21 that is correct: the
					    hero is decoration behind an <h1> that already names the subject, so
					    announcing it again would only repeat the headline to a screen
					    reader. The hospitality photograph lower down is a real <img> and
					    does carry its alt. */}
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-restaurant.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">
								Hospitality &amp; Restaurant Window Treatments · South Florida
							</div>
							<h1>A dining room people want to sit in.</h1>
							<p>
								Custom drapery and shades for restaurants, hotels, clubs and private dining, built
								to take daily handling, quiet a hard room, control the afternoon sun, and go in
								without closing you.
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
						<h2 className="big">Guests cannot name it, but they feel it in ten seconds.</h2>
						<p className="lede">
							A room with nothing soft in it is loud, bright and slightly unwelcoming, and people
							sit for less time in it without ever knowing why. In South Florida you get all three
							at once: a wall of glass facing west, hard floors chosen to survive, and a five
							o'clock glare that empties the best tables in the house. Textile is the single
							intervention that answers all of it, which is why the rooms that feel expensive almost
							always have fabric on the walls of glass.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The window treatment is not decoration in a restaurant. It is how long the table stays
							occupied.
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
							<h2 className="big">One team, and a schedule that respects your covers.</h2>
							<p>
								We survey the space with your operating hours in front of us, not after the fact.
								Rated fabric options come out at the first meeting so nothing has to be substituted
								later. We fabricate off site, phase the installation around service, and our own
								installers do the fitting, which means the schedule is ours to hold. Where shades
								are motorized, the power is run by our electrical partner as part of the same job,
								so you are not coordinating trades between dinner services.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Surveyed against your service hours</b>, with the phasing agreed before anything
								is ordered.
							</li>
							<li>
								<b>Specified for commercial handling</b>, in weights, hems and hardware, not
								residential ones.
							</li>
							<li>
								<b>Rated fabric and mill documentation</b> held with the project for your
								inspector.
							</li>
							<li>
								<b>Motorization wired by</b> our licensed, insured electrical partner,{" "}
								<BalticLink />, on the same schedule.
							</li>
						</ul>
					</div>
				</section>

				{/* Photograph band, placed directly after the "How we work" band so it sits
				    against the hotel and scheduling copy. A real <img> rather than a
				    background, so the client's alt sentence is carried verbatim. Native
				    3:2 is kept rather than cropped to a letterbox: the subject is drapery
				    running ceiling to floor, and a shallower band would cut the top of it. */}
				<section className="block">
					<div className="wrap" data-reveal>
						<figure className="photoband">
							<img
								src="/assets/art-hospitality.jpg"
								alt="Layered sheer and drapery at a floor-to-ceiling hotel-room window."
								width={1536}
								height={1024}
								loading="lazy"
								decoding="async"
							/>
							<figcaption className="soft">
								Sheer drawn across the glass for daytime privacy, with drapery layered to the
								sides to close the room down at night. The same pairing does the work in a guest
								room as in a dining room.
							</figcaption>
						</figure>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Three decisions usually settle a hospitality room.</h2>
						<p className="lede">
							The rating, which is covered on{" "}
							<Link to="/flame-retardant-drapery.html">flame-retardant drapery</Link>. The glare,
							which on a west-facing terrace is usually solved by{" "}
							a solar shade rather than by fabric alone. And whether anything moves on its own, which matters more in a room with
							no spare staff:{" "}
							<Link to="/motorized.html">motorized drapery and shades</Link>. The making itself is
							on <Link to="/drapery.html">custom drapery</Link>, and the cloth on{" "}
							<Link to="/european-fabrics.html">European fabrics and textiles</Link>.
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
							<h2 className="big">Which room is losing you the five o'clock tables?</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us the space and your service hours, and
								we will come and look at it at the hour it is actually a problem.
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
