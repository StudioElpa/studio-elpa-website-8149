import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). Delray's angle is the coastal
   strip: second homes that sit empty for months, salt air, and ocean light that
   arrives without anything in front of it. Motorization is the service hook
   because a house nobody is standing in still needs its shades to move. */

const CARDS = [
	{
		title: "A house that shades itself",
		body: "Shades on a schedule close against the worst of the afternoon whether or not anyone is home. For a house that is empty half the year, that is the difference between a floor that keeps its color and one that does not.",
	},
	{
		title: "Salt air is a specification",
		body: "Anything within a few streets of the ocean lives in salt. It decides the hardware finish, the bracket, and which fabrics we will put in a room that gets opened to the breeze.",
	},
	{
		title: "Openness, in a number",
		body: "A solar weave is rated by how much of the view it lets through. Three percent holds a view and kills most of the glare, one percent gives privacy and less view. Choosing that number, per elevation, is most of the job.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Can motorized shades be added to a finished house?",
		a: (
			<>
				Usually yes. Battery motors have got good enough that a retrofit no longer means opening
				walls, and where hardwiring is the better answer, the work goes to our licensed, insured
				electrical partner, <BalticLink />, scheduled and managed by us. We will tell you which of
				the two your house actually wants rather than defaulting to the easy one.
			</>
		),
	},
	{
		q: "How do they run when we are not in Florida?",
		a: "On a schedule, and on your phone if you want it. The useful setting is not the clever one, it is shades that come down over the hot elevation each afternoon and go back up in the evening, all year, without anybody thinking about it.",
	},
	{
		q: "Are they loud?",
		a: "Quiet enough that the surprise is usually how little you hear. Motor choice and how the shade is mounted matter more than the brand of anything, and a shade fitted tight into a recess is quieter than one hanging off the face of the wall.",
	},
	{
		q: "Will a solar shade still let us see the water?",
		a: "That is what it is for. An open weave cuts glare and solar heat while you still read the horizon through it. The trade is privacy after dark, when the lit side becomes the visible side, which is why a bedroom on the ocean usually wants a second, closed layer as well.",
	},
	{
		q: "How long does a project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function DelrayBeachPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/motorized-shades-delray-beach.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-roller.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Motorized Shades · Delray Beach</div>
							<h1>Motorized Shades in Delray Beach</h1>
							<p>
								Near the ocean the light arrives with nothing in front of it. Shades that move on
								their own are how a house near the water looks after itself.
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
						<h2 className="big">Ocean light is unfiltered light.</h2>
						<p className="lede">
							A few blocks from the beach there is no canopy and no neighboring roofline to break
							the sun, so it comes in flat and hard and then again off the water. That is what
							fades a sofa arm and lifts the temperature of a room the air conditioning then has
							to pull back down. A solar shade on the exposed elevations takes that hit first, and
							if it closes itself on a schedule it takes it every day, not just the days someone
							remembers.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The best motorization is the kind you stop noticing by the second week.
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
							<h2 className="big">The wiring is our problem, not yours.</h2>
							<p>
								We look at the house elevation by elevation, decide what each opening is actually
								being asked to do, and specify the shade, the fabric openness and the motor
								against that. Everything is made to measure and fitted by our own installers. The
								power, where a project needs it, is handled by our licensed, insured electrical partner, <BalticLink />, scheduled and managed by us, so nothing stalls waiting on
								a trade you had to find yourself.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Specified per elevation</b>, because the east wall and the west wall are not
								the same problem.
							</li>
							<li>
								<b>Hardwired or battery</b>, chosen on the merits of your house rather than on
								ours.
							</li>
							<li>
								<b>Our own installers</b>, so the fitting and the fabrication answer to the same
								people.
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
						<h2 className="big">Along the coast, and into the detail.</h2>
						<p className="lede">
							We work the coastal strip either side of Delray, including{" "}
							<Link to="/window-treatments-gulf-stream.html">Gulf Stream</Link> and{" "}
							<Link to="/window-treatments-manalapan.html">Manalapan</Link>. On the treatments,{" "}
							<Link to="/motorized.html">motorized shades and drapery</Link> covers how the
							hardware is specified,{" "}
							<Link to="/smart-home-window-treatments.html">smart home integration</Link> covers
							scheduling and control,{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link> is the bedroom answer,
							and <Link to="/drapery.html">custom drapery</Link> is what softens the room the
							shades are working in. Our Journal piece on{" "}
							<a href="/journal-blackout.html">the case for real darkness</a> is worth ten minutes
							if the bedroom is the reason you are here.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things coastal clients ask.</h2>
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
							<h2 className="big">Tell us which wall the sun hits.</h2>
							<p>
								We work Delray Beach and the coast around it, including Gulf Stream and
								Manalapan. Start with a relaxed 30-minute call, tell us what the light is doing
								and when, and we will come out and look at it in the room.
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
