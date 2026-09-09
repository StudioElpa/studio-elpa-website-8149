import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. One of the brief's named differentiator angles: FR drapery for
   restaurants and hospitality. IMPORTANT: this page claims no certification of our
   own. It describes the standard an inspector asks about and says we pass on the
   mill's documentation, which is ordinary practice. Every compliance sentence here
   is flagged in QA-NOTE for Aviva's sign-off before go-live. */

const CARDS = [
	{
		title: "Inherently flame-retardant fabric",
		body: "The fibre itself carries the property, so it does not wash out and does not need re-treating. It is the specification we prefer wherever the budget and the look allow it.",
	},
	{
		title: "Treated fabric, honestly labelled",
		body: "A topical treatment opens up a much wider range of fabrics. It also has a service life, and it can be affected by cleaning, so we tell you what re-treatment will look like before you choose it.",
	},
	{
		title: "Documentation that survives an inspection",
		body: "The certificate matters as much as the cloth. We keep the mill's paperwork with your project so it is in a folder when someone asks for it, not a phone call to a supplier a year later.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Does my restaurant actually need FR drapery?",
		a: "Usually, but the person to confirm it is your local fire marshal or building official, not us. Assembly and hospitality occupancies in Florida generally require textiles in public areas to meet a recognised flame-resistance standard, and the inspector will ask to see documentation for what is hanging on the wall. We will supply the certificate for the fabric we install. We will not tell you your project is compliant, because that is the authority's call.",
	},
	{
		q: "What is the difference between inherently FR and treated?",
		a: "Inherently flame-retardant fibres have the property built into the material, so it lasts as long as the fabric does. A treated fabric is a normal cloth with a flame-retardant finish applied, which is effective but has a service life and can be degraded by cleaning or by time. Inherent costs more up front and asks nothing of you afterward. Treated costs less and comes with a maintenance obligation. We will tell you which one your project should carry.",
	},
	{
		q: "Does FR fabric have to look institutional?",
		a: "No, and this is the main reason people are surprised. The range of inherently flame-retardant weaves from European mills is genuinely good now, including sheers and heavy textures that read like any other luxury drapery. It is narrower than the unrestricted range, and we will show you the real shortlist rather than pretending there is no constraint at all.",
	},
	{
		q: "Can you work around our service hours?",
		a: "Yes. Installation in a working restaurant or hotel happens when the room is closed, and we plan it that way from the first site visit. Our own installers do the work, so the schedule is ours to hold rather than a subcontractor's to move.",
	},
];

export default function FlameRetardantDraperyPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/flame-retardant-drapery.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/ba-after.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Flame-Retardant (FR) Window Treatments · South Florida</div>
							<h1>Rated fabric that still looks like drapery.</h1>
							<p>
								Inherently flame-retardant and treated textiles for restaurants, hotels, clubs and
								assembly spaces, specified with the documentation your inspector will ask for and
								installed around your service hours.
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
						<h2 className="big">The usual compromise is a beautiful room in an ugly fabric.</h2>
						<p className="lede">
							Most operators discover the flame-resistance requirement late, after the interior is
							designed and the drapery has been chosen. What follows is a scramble, and the fabric
							that arrives is whatever was rated and available, which is why so many otherwise
							lovely dining rooms have curtains that feel like they came from somewhere else
							entirely. Specified early, it does not have to go that way. The rated range is far
							better than its reputation, and the paperwork is a filing job rather than a crisis.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Compliance is not the design constraint people think it is. Leaving it until the end
							is.
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
							<h2 className="big">Specified early, documented properly, fitted after hours.</h2>
							<p>
								We start by asking what the space is classified as and who is signing it off, then
								we build the fabric shortlist inside that constraint rather than outside it. You
								see rated options at the first meeting, not a beautiful scheme that has to be
								unpicked later. We hold the mill's documentation with your project file, and our
								own installers fit the work when the room is closed. One team, one schedule, one
								point of contact.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Rated options shown first</b>, so nothing has to be substituted after the design
								is approved.
							</li>
							<li>
								<b>Inherent or treated stated plainly</b>, including what re-treatment would ask of
								you later.
							</li>
							<li>
								<b>Mill documentation kept with the project</b>, ready when an inspector asks for
								it.
							</li>
							<li>
								<b>Installed outside service hours</b>, by our own installers, on a schedule we
								control.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Rated fabric is one requirement among several.</h2>
						<p className="lede">
							If the project is a restaurant, hotel or club, the wider picture is on{" "}
							<Link to="/hospitality-window-treatments.html">
								hospitality and restaurant window treatments
							</Link>
							, which covers durability, acoustics, phasing and turnaround. The fabric conversation
							itself continues on{" "}
							<Link to="/european-fabrics.html">European fabrics and textiles</Link>, and how the
							panels are made and hung is on{" "}
							<Link to="/drapery.html">custom drapery</Link> and{" "}
							<Link to="/drapery-hardware.html">drapery hardware</Link>. Where glare on a west-facing
							dining room is the real problem,{" "}
							<Link to="/motorized.html">solar shades</Link> often do more than fabric can.
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
							<h2 className="big">Bring us in before the fabric is chosen.</h2>
							<p>
								Start with a relaxed 30-minute call. Tell us the space and who is inspecting it,
								and we will tell you what the rated range can actually do for the room.
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
