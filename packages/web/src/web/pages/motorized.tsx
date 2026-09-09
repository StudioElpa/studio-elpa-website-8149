import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { BalticLink, BlindspaceLockup } from "../components/partner";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original motorized.html, with one edit: the
   "Battery or hardwired" line used an em dash, which the brief bans, so it is
   a colon now.

   V2 consolidation: roller and solar shades are no longer a standalone service.
   Their unique content moved in here, in FABRICS below plus three of their FAQs,
   because the fabric choice and the motor are one specification, not two.
   "Solar shades" survives as a FABRIC term by client decision (it names an
   openness factor, not a mechanism); the word "roller" does not. */

const CARDS = [
	{
		title: "Hard-to-reach windows",
		body: "Tall, stacked, or over furniture. Motorization reaches what a hand never comfortably could, all from a button or your voice.",
	},
	{
		title: "Whole-room control",
		body: "A wall of glass moves together in one smooth motion. Set a schedule once and forget you ever had to think about it.",
	},
	{
		title: "Cord-free child safety",
		body: "No cords anywhere is the safest configuration for homes with children and pets, and it looks cleaner, too.",
	},
];

/* Absorbed from the retired roller and solar shades page. The angle is the
   specific South Florida problem these fabrics solve: heat and glare on big
   glass without giving up the view. */
const FABRICS = [
	{
		title: "Solar screens keep the view",
		body: "An open weave cuts glare and solar heat while you still see the water, the garden, the street. The tighter the weave, the more privacy and the less view, and choosing that number is most of the job.",
	},
	{
		title: "Dimout for the in-between rooms",
		body: "Living rooms, offices, guest rooms. Enough privacy after dark and enough softness by day, without committing the room to full blackness.",
	},
	{
		title: "Blackout where sleep happens",
		body: "In bedrooms and nurseries we fit tight to the glass, or layer with drapery, so light has nowhere to slip around the edges.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "Do I need to hire my own electrician?",
		a: (
			<>
				No. We coordinate it through our licensed, insured electrical partner, <BalticLink />, on
				the same schedule as the rest of your project. You never have to find or schedule one
				yourself.
			</>
		),
	},
	{
		q: "Can it work with my smart home?",
		a: "Yes. We specify motors that integrate with common smart-home systems, controlled by remote, app, voice, or an automatic schedule.",
	},
	{
		q: "Battery or hardwired?",
		a: "Both are options. Battery is simpler for existing homes; hardwired is cleaner for new construction or renovations. We help you pick and handle it.",
	},
	{
		q: "What openness factor should I choose?",
		a: "It depends on which direction the window faces and what you want to keep. A 3 percent weave holds a view well and still cuts most of the glare. A 1 percent gives you more privacy and less view. West-facing walls of glass usually want the tighter weave. We look at the room and the hour you actually use it before we specify anything.",
	},
	{
		q: "Will a solar shade give me privacy at night?",
		a: "No. After dark the lit side becomes the visible side, so a solar screen reads the other way around. Where a room needs both daytime view and nighttime privacy, we pair a solar shade with a dimout fabric or with drapery.",
	},
	{
		q: "Do shades work on very wide windows?",
		a: "Up to a point. Past a certain width a single shade gets heavy and can track unevenly, so we split the opening into matched panels and align the seams with the mullions. On tall or wide glass we almost always motorize, because a shade nobody can reach is a shade nobody uses.",
	},
	{
		q: "Is the first call really free?",
		a: "Yes, and there's no obligation. A relaxed 30-minute conversation to understand your windows and see if we're the right fit.",
	},
];

export default function MotorizedPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/motorized.html" />
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
							<div className="kicker">Motorized Shades · South Florida</div>
							<h1>The luxury of never touching a cord.</h1>
							<p>
								Quiet, reliable shades that rise with your morning and close on schedule. Solar
								screens that hold your view while cutting glare and heat, dimout for privacy,
								blackout for sleep. For the windows you can't reach, walls of glass, and a home
								that's cord-free and child-safe.
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
						<div className="kicker">Why motorize</div>
						<h2 className="big">It's not about being fancy. It's about ease.</h2>
						<p className="lede">
							Waking to shades that lift with the sun is a genuine pleasure. But the real value is
							quieter: the windows you can't easily reach, the whole wall of glass that moves as
							one, the child-safe home with no cords anywhere, and the calm of a room that manages
							its own light.
						</p>
					</div>
				</section>

				<section className="block band">
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

				{/* Absorbed from the retired roller and solar shades page. The motor
				    moves it; the fabric decides what the light does. */}
				<section className="block">
					<div className="wrap center narrow" data-reveal>
						<div className="kicker">Why it matters here</div>
						<h2 className="big">South Florida sun is not a decorating problem.</h2>
						<p className="lede">
							It is a heat problem, a glare problem, and a fading problem. Afternoon sun through a
							wall of glass warms a room the air conditioning then has to fight, throws enough
							glare that you close the room off entirely, and over a few seasons it takes the
							color out of rugs, art and upholstery. The right fabric is the quiet piece of
							engineering that stops all three, without asking you to give up the reason you
							bought the house.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap">
						<div className="center" data-reveal>
							<div className="kicker">The fabric does the light control</div>
							<h2 className="big center">Three ways to handle the light.</h2>
						</div>
						<div className="three" data-reveal-group style={{ marginTop: 22 }}>
							{FABRICS.map((c) => (
								<div className="card" key={c.title} data-reveal>
									<h3>{c.title}</h3>
									<p>{c.body}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The right shade is the one you forget about. It handles the worst hour of the day and
							then gets out of the way of the view.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow center" data-reveal>
						<div className="kicker">The part that trips most people up</div>
						<h2 className="big">Motorized shades need power. We handle that.</h2>
						<div className="note">
							Most companies sell you the shades and then leave the electrical up to you: find your
							own electrician, get on their schedule, and hope everyone shows up in the right
							order. Not here. The wiring is handled by our licensed, insured electrical partner,{" "}
							<BalticLink />, scheduled and managed by us. You never have to find or coordinate an
							electrician. One point of contact, wired and working before we leave.
						</div>
					</div>
				</section>

				<section className="block band">
					<div className="wrap two" data-reveal-group>
						<div data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Specified right, installed clean.</h2>
							<p className="lede">
								We start with how you live in the room, then match the motor, the fabric, and the
								controls to it. Remote, app, voice, or a schedule you'll forget is even running.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Quiet, reliable motors</b> matched to the window and the job.
							</li>
							<li>
								<b>Battery or hardwired</b>: we help you choose, and handle the wiring either way.
							</li>
							<li>
								<b>Smart-home integration</b> so it works with the rest of your house.
							</li>
							<li>
								<b>Our own installers</b> and one point of contact, start to finish.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap two" data-reveal-group>
						<div data-reveal>
							<div className="kicker">Concealment</div>
							<h2 className="big">The hardware can disappear into the architecture.</h2>
							<p className="lede">
								A motorized shade is only ever as clean as the opening it lives in. Where the
								ceiling or the window reveal allows it, we specify a recess so the tube, the
								fabric roll, and the motor sit out of the line of sight.
							</p>
						</div>
						<div data-reveal>
							<p>
								For a fully concealed look, we install Blindspace recess systems: pockets that
								finish flush with the ceiling or the reveal, so the shade reads as part of the room
								instead of something added to it afterwards.
							</p>
							<p>
								It is a specification decision rather than a retrofit, so it is worth raising
								early. If your project is still at framing or drywall, tell us and we will detail
								it with your builder.
							</p>
							<BlindspaceLockup />
						</div>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">The motor is the means, not the point.</h2>
						<p className="lede">
							What you live with is the treatment itself. Most motorized work here is either the
							shades above or <Link to="/drapery.html">custom drapery</Link>, and in a bedroom the
							specification changes again for <Link to="/blackout.html">blackout</Link>. If the
							shades should answer to the same system as the lighting and the climate, see{" "}
							<Link to="/smart-home-window-treatments.html">smart-home window treatments</Link>.
							Arched and angled openings follow their own rules on{" "}
							<Link to="/specialty-shaped-windows.html">specialty-shaped windows</Link>, and the
							concealed track a motorized panel rides on is covered under{" "}
							<Link to="/drapery-hardware.html">drapery hardware</Link>.
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
							<h2 className="big">Let's talk about your windows.</h2>
							<p>
								Start with a relaxed 30-minute call. We'll help you figure out what's worth
								motorizing and what isn't.
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
