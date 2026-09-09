import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { BalticLink } from "../components/partner";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 service page. The angle here is deliberately NOT "motorized" again: that is
   /motorized.html. This page is about integration, the layer above the motor, and
   about the planning that has to happen before drywall. Structure follows
   roller-solar-shades.tsx so every service page reads the same way. */

const CARDS = [
	{
		title: "One button, one room",
		body: "Scenes rather than switches. Morning opens the bedroom to the garden, afternoon drops the west screens before the glare arrives, evening closes the whole ground floor at once.",
	},
	{
		title: "It has to work for guests",
		body: "A keypad on the wall that anyone can read beats an app nobody has downloaded. We always specify a physical control alongside the phone, because the phone is never in the room.",
	},
	{
		title: "Planned before the walls close",
		body: "Power, pockets and control locations are cheap to place during construction and expensive to add afterward. If you are building or renovating, this is the conversation to have early.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Do I need a smart-home system already?",
		a: "No. A set of motorized shades on their own remote or wall keypad is a complete, finished solution and it is what most homes end up with. Integration is worth it when you already run a control system, or when the house is large enough that walking to each room to adjust it stops being reasonable.",
	},
	{
		q: "Will this work with the system my integrator installed?",
		a: "Usually, and we will tell you honestly before you order if it will not. We coordinate directly with your AV or automation integrator so the shades appear in the same interface as your lighting rather than living in a separate app. Where a system is closed or proprietary, the answer is sometimes that a bridge is needed, and we would rather say so up front than after installation.",
	},
	{
		q: "What happens when the internet goes down?",
		a: "The shades still move. Local control, whether that is a keypad or a handheld remote, does not depend on your connection. Only the remote-from-anywhere and schedule-from-the-cloud features pause, which is the honest trade of anything connected.",
	},
	{
		q: "Battery or hardwired?",
		a: "Battery motors are simple, quiet and fine on a handful of shades in a finished house. On a whole floor, or on tall or heavy panels, hardwiring is the better answer because nobody wants a recharging schedule across twenty windows. Where wiring is needed it is handled by our licensed, insured electrical partner, so it stays part of one project rather than becoming your problem to arrange.",
	},
];

export default function SmartHomeWindowTreatmentsPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/smart-home-window-treatments.html" />
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
							<div className="kicker">Smart-Home Window Treatments · South Florida</div>
							<h1>The house should handle the light on its own.</h1>
							<p>
								Motorized drapery and shades that live inside the system you already use, on
								schedules and scenes rather than switches, with the wiring, the control locations
								and the integration planned as one job.
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
						<h2 className="big">A motor is hardware. A scene is a habit.</h2>
						<p className="lede">
							Most people who ask for smart shades do not actually want to control anything. They
							want to stop thinking about it. They want the west wall covered before the four
							o'clock glare, the bedroom open to the light in the morning, and the whole ground
							floor closed when the house goes to sleep, without anyone walking around doing it. The
							motor is the easy part. Getting the house to do the right thing at the right hour, in
							a way your family and your guests can actually override, is the work.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The measure of a good system is that nobody in the house ever mentions it.
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
							<h2 className="big">One team, from the power to the pleat.</h2>
							<p>
								The usual version of this project has three companies in it: someone to sell the
								shades, an electrician you have to find yourself, and an integrator who arrives
								after the fact to make it all talk. We do it as one. We measure, we specify the
								motors and the fabric together, our electrical partner runs the power, our own
								installers hang it, and we coordinate with your integrator so it lands in your
								existing interface. You have one number to call.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Control locations agreed on site</b>, next to the light switches people already
								reach for, not wherever the wire happened to end.
							</li>
							<li>
								<b>Power planned before finishes</b>, so a hardwired motor never becomes a surface
								conduit.
							</li>
							<li>
								<b>Wiring by our licensed, insured electrical partner</b>, <BalticLink />, so you
								never have to find someone yourself.
							</li>
							<li>
								<b>Scenes set with you in the room</b>, at the hour they matter, then adjusted once
								you have lived with them.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Start with what moves, then decide how it is told to.</h2>
						<p className="lede">
							If you are weighing whether to motorize at all, start with{" "}
							<Link to="/motorized.html">motorized drapery and shades</Link>, which covers the
							motors, the noise, and what it costs to reach the windows you cannot. Integration
							suits{" "}
							<Link to="/roller-solar-shades.html">roller and solar shades</Link> on big west-facing
							glass better than anything else, and it is what makes{" "}
							<Link to="/blackout.html">blackout</Link> in a bedroom genuinely effortless. If the
							house is still on paper, so is the best moment to talk:{" "}
							<Link to="/drapery.html">custom drapery</Link> pockets and motor pockets both need
							deciding before the ceiling is closed.
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
							<h2 className="big">Building, renovating, or just tired of the glare?</h2>
							<p>
								Start with a relaxed 30-minute call. If you are mid-construction we will tell you
								what to leave room for, and if you are not, we will tell you what is still
								possible.
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
