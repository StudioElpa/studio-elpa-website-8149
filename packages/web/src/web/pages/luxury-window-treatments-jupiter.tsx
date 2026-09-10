import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). Jupiter's angle is water on both
   sides of the house: dock light, tall sliders, and rooms that are opened to
   the air far more often than an inland house ever is. Written for Jupiter,
   Tequesta and Hobe Sound, which is what the route's areaServed claims. */

const CARDS = [
	{
		title: "Sliders decide the hardware",
		body: "A twelve foot slider that is opened every day cannot have a panel in its way. Stack-back is measured off the frame so the drapery clears the glass completely, and the track is chosen for a run that long rather than a room that small.",
	},
	{
		title: "The dock throws light back",
		body: "Water and pale decking bounce the afternoon up into the ceiling. Rooms on the water take light from below as well as in front, which is why the lining carries as much of the specification as the face fabric.",
	},
	{
		title: "Open house, open weave",
		body: "A house that lives with its doors open wants fabrics that tolerate humidity and salt without going limp or chalky. That rules some cloth out before we ever get to color.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Do you cover Tequesta and Hobe Sound as well?",
		a: "Yes. The whole stretch north of the Jupiter Inlet is comfortable territory for us, including Jupiter Island. It is one drive and one crew, and the houses are asking similar questions of their windows.",
	},
	{
		q: "Our main room is a wall of sliders. Is drapery even sensible?",
		a: "It is often the thing that makes the room work. The trick is the stack, panels that gather entirely off the glass when they are open, so you keep the full opening and gain something soft on a wall that is otherwise all frame and reflection. Pair it with a solar shade and the glare goes too.",
	},
	{
		q: "What holds up near salt air?",
		a: "Fabrics with a stable fiber and a lining that does the ultraviolet work, plus hardware finishes that will not pit. We choose all three together at the consultation and tell you plainly if something you love is going to look tired in three years in that particular room.",
	},
	{
		q: "Who does the electrical for motorized runs?",
		a: (
			<>
				Our licensed, insured electrical partner, <BalticLink />. They handle the power, we
				schedule and manage them, and the track, the motor and the fabrication all answer to one
				point of contact. You never have to find or coordinate a trade.
			</>
		),
	},
	{
		q: "How long does a project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function JupiterPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/luxury-window-treatments-jupiter.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/project-1.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Luxury Window Treatments · Jupiter</div>
							<h1>Luxury Window Treatments in Jupiter</h1>
							<p>
								Jupiter houses are built to be opened. Wide sliders, water on one side, and rooms
								that spend half the year with the doors pushed back.
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
						<h2 className="big">Big glass is the point, and the problem.</h2>
						<p className="lede">
							The glass is why the house was built this way, so nothing we do should shrink it.
							What it needs instead is control: heat and glare taken out of the middle of the day,
							privacy after dark when the lit room becomes the visible one, and something soft at
							the edges so a room of stone and frame has somewhere for the eye to settle. That is
							three different jobs, and they are rarely done well by one layer.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Keep the view you bought the house for. Lose the glare, the heat and the fading that
							came with it.
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
							<h2 className="big">Specified in the room, made to the millimeter.</h2>
							<p>
								We come to the house, measure the openings ourselves and watch what the light does
								at the hour you actually use the room. Everything is made to order in European
								fabrics, with the lining and interlining specified alongside the face cloth rather
								than after it, and hung by our own installers. Where a project calls for
								motorization, the wiring is handled by our licensed, insured electrical partner,{" "}
								<BalticLink />, scheduled and managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Stack-back measured off the frame</b>, so a wide slider still opens all the
								way.
							</li>
							<li>
								<b>European fabrics</b>, chosen for how they behave in humidity and hard coastal
								light.
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
						<h2 className="big">North of the inlet, and into the detail.</h2>
						<p className="lede">
							We work throughout Jupiter and up the coast, including{" "}
							<Link to="/window-treatments-admirals-cove-jupiter.html">Admirals Cove</Link> and{" "}
							<Link to="/window-treatments-jupiter-island.html">Jupiter Island</Link>. On the
							treatments, <Link to="/motorized.html">motorized shades and drapery</Link> covers the
							openings that are too tall or too wide to work by hand,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers the making and the stack-back,{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains what we buy and
							why, and <Link to="/specialty-shaped-windows.html">specialty shaped windows</Link> is
							for the arches and angles the architect could not resist.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things Jupiter clients ask.</h2>
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
								We work Jupiter, Tequesta and Hobe Sound, from the club communities to the
								oceanfront. Start with a relaxed 30-minute call, tell us what the room is asking
								for, and we will come out with the right shortlist rather than the whole library.
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
