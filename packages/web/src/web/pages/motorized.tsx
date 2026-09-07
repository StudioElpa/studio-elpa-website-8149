import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { CONTACT } from "../components/brand";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original motorized.html, with one edit: the
   "Battery or hardwired" line used an em dash, which the brief bans, so it is
   a colon now. */

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

const FAQS: FaqEntry[] = [
	{
		q: "Do I need to hire my own electrician?",
		a: "No. We coordinate it through our trusted, licensed and insured electrical partner, on the same schedule as the rest of your project. You never have to find or schedule one yourself.",
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
		q: "Is the first call really free?",
		a: "Yes, and there's no obligation. A relaxed 30-minute conversation to understand your windows and see if we're the right fit.",
	},
];

export default function MotorizedPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
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
							<div className="kicker">Motorized Shading · South Florida</div>
							<h1>The luxury of never touching a cord.</h1>
							<p>
								Quiet, reliable shades that rise with your morning and close on schedule. For the
								windows you can't reach, walls of glass, and a home that's cord-free and
								child-safe.
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

				<section className="block">
					<div className="wrap narrow center" data-reveal>
						<div className="kicker">The part that trips most people up</div>
						<h2 className="big">Motorized shades need power. We handle that.</h2>
						<div className="note">
							Most companies sell you the shades and then leave the electrical up to you: find your
							own electrician, get on their schedule, and hope everyone shows up in the right
							order. Not here. The wiring is handled by our trusted, licensed and insured
							electrical partner, scheduled and managed by us. You never have to find or coordinate
							an electrician. One point of contact, wired and working before we leave.
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
