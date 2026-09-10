import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). Fort Lauderdale's angle is the
   canal city: houses that face a waterway with another house on the far bank,
   so privacy and view are in direct tension, plus the city apartments where the
   same problem arrives vertically. Written for Fort Lauderdale specifically. */

const CARDS = [
	{
		title: "Privacy across the water",
		body: "A canal is narrower than it feels. The far bank is a lit window looking straight back at yours after dark, which is a different problem from daytime glare and needs its own layer.",
	},
	{
		title: "Light off the waterway",
		body: "Moving water throws a second, restless light up onto ceilings and walls. It is lovely at seven in the morning and punishing at two in the afternoon, and the lining is what decides which one you keep.",
	},
	{
		title: "Remodels, not rebuilds",
		body: "Where a house is being reworked rather than replaced, the existing openings, the older headers and a ceiling that is already closed set real constraints. We measure for them rather than around them.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Our house faces a canal. How do we keep the view and still have privacy?",
		a: "By splitting the job. A solar shade during the day keeps the view and takes out the glare, and a second layer, drapery or a dimout roller, closes at night when the lit side of the glass becomes the visible one. One fabric cannot do both jobs honestly, and anyone who says otherwise is selling you the compromise.",
	},
	{
		q: "Do you work in condominiums and apartments as well as houses?",
		a: "Yes. Buildings usually have rules about what the outside of the glass can look like, and we work within them rather than discovering them at installation. Tell us the association guidelines at the consultation and we will specify to them.",
	},
	{
		q: "The ceilings are already finished. Can we still recess a track?",
		a: "Sometimes, and where we cannot there are face-fixed options that read almost as clean if the pelmet or the return is detailed properly. We will look at the actual ceiling before promising either way.",
	},
	{
		q: "Who handles the wiring for motorized drapery?",
		a: (
			<>
				Our licensed, insured electrical partner, <BalticLink />. They handle the power and we
				schedule and manage them, so the wiring, the track and the fabrication answer to one point
				of contact.
			</>
		),
	},
	{
		q: "How long does a project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function FortLauderdalePage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/custom-drapery-fort-lauderdale.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-drapery-linen.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Custom Drapery · Fort Lauderdale</div>
							<h1>Custom Drapery in Fort Lauderdale</h1>
							<p>
								A canal house lives in public. The water is the reason you are there, and the far
								bank is close enough to see who is home.
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
						<h2 className="big">Two problems wearing one coat.</h2>
						<p className="lede">
							Waterfront rooms here are asked for privacy and openness at the same time, and the
							hours those two things are wanted barely overlap. During the day the glass wants to
							stay glass and the sun wants stopping. After dark the room lights up and becomes the
							thing on display. Drapery is what closes that second half of the day, and it does it
							while making a hard-edged room feel like somewhere you would sit down.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Panels are not decoration on a canal. They are the difference between a room you
							look at and a room you live in after six.
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
								We measure in the room, look at the water side and the street side separately, and
								specify each opening for the job it is actually doing. Everything is made to order
								in European fabrics, with the header, lining and length decided together, and hung
								by our own installers. Where a project calls for motorization, the wiring is
								handled by our licensed, insured electrical partner, <BalticLink />, scheduled and
								managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Day layer and night layer</b>, specified separately, because they are not the
								same request.
							</li>
							<li>
								<b>European fabrics</b>, chosen for how they age in humidity and reflected light.
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
						<h2 className="big">On the water, and in the detail.</h2>
						<p className="lede">
							We work the Fort Lauderdale waterfront, including{" "}
							<Link to="/window-treatments-harbor-beach-fort-lauderdale.html">Harbor Beach</Link>{" "}
							and <Link to="/window-treatments-las-olas-isles.html">the Las Olas Isles</Link>. On
							the treatments, <Link to="/drapery.html">custom drapery</Link> covers the making and
							the stack-back, <Link to="/motorized.html">motorized shades and drapery</Link> covers
							the openings that are too wide to work by hand,{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link> is the bedroom
							conversation, and our guide to{" "}
							<a href="/drapery-headers.html">drapery headers, compared</a> explains what each
							header does to the feel of a room.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things waterfront clients ask.</h2>
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
								We work across Fort Lauderdale, from the waterfront streets to the buildings along
								the beach. Start with a relaxed 30-minute call, tell us which side of the house is
								the problem, and we will come and look at it at the hour it happens.
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
