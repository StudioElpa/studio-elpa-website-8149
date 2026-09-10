import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. Angle from
   the brief's Jupiter Island hook: ultra-private oceanfront estates, discreet
   high-craft work, salt-air fabrics. Discretion is the organising idea, which
   also means this page makes no claim about who we have worked for. */

const FAQS: FaqEntry[] = [
	{
		q: "How do you handle privacy and discretion?",
		a: "Quietly, and as a matter of policy. We do not photograph a house without written permission, we do not name clients, and we do not use a project as marketing because it was a notable address. The team that measures your house is the team that installs it, which keeps the number of people involved small.",
	},
	{
		q: "Does oceanfront exposure limit which fabrics we can use?",
		a: "It narrows the field honestly, yes. Direct salt air and sustained ultraviolet are hard on fiber, and some beautiful cloths are simply the wrong choice on a west or ocean-facing elevation. We choose the fabric and its lining together, since the lining takes the sun first and does most of the protecting, and we will say plainly when something you like belongs on a different window in the same house.",
	},
	{
		q: "Can motorization be silent?",
		a: (
			<>
				Close to it, if it is specified for that and installed properly. Noise usually comes from
				a motor working harder than it should or a track that is out of true, not from
				motorization itself. We size the hardware to the panel weight and set the track
				carefully. Power is run by our licensed, insured electrical partner, <BalticLink />,
				coordinated by us.
			</>
		),
	},
];

export default function JupiterIslandPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-jupiter-island.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Jupiter Island and Hobe Sound</div>
							<h1>Window Treatments for Jupiter Island Homes</h1>
							<p>
								Private oceanfront estates where the work should be excellent and the process
								should be invisible. A small team, on time, and not talking about it afterwards.
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
						<div className="kicker">What these homes ask for</div>
						<h2 className="big">High craft, handled discreetly.</h2>
						<p className="lede">
							An oceanfront estate asks two things of a window treatment. It has to survive
							where it is, because salt air and unbroken ultraviolet will find any shortcut in a
							fabric or a lining. And it has to be done without fuss, by people who arrive when
							they said, keep the house clean, and do not treat the address as a story to tell.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Discretion is not an add-on here. It is part of the specification, the same way the
							lining is.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">A small team, from measurement to last panel.</h2>
							<p>
								We come to the house, measure the openings ourselves and look at the light on the
								ocean elevation at the hour it is hardest. Custom drapery carries the scale and
								the finish, solar and roller shades take the glare and the heat off the big
								glass, and blackout layers do the bedrooms. Everything is made to measure in
								European fabrics and fitted by our own installers, never subcontracted out, with
								wiring handled by our licensed, insured electrical partner, <BalticLink />,
								scheduled by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>No photography without written permission</b>, and no client names.
							</li>
							<li>
								<b>Fabric and lining chosen for direct salt air</b>, honestly, even when it rules
								something out.
							</li>
							<li>
								<b>Our own installers</b>, so the same small team is in the house throughout.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating to specification and staying out of the
								way.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Jupiter Island sits at the top of our{" "}
							<Link to="/luxury-window-treatments-jupiter.html">Jupiter</Link> territory,
							alongside{" "}
							<Link to="/window-treatments-admirals-cove-jupiter.html">Admirals Cove</Link>. On
							the treatments,{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains how we choose
							cloth for a coastal elevation,{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link> is the bedroom answer,
							and <Link to="/motorized.html">motorized shades and drapery</Link> covers the
							hardware. Our <Link to="/journal-blackout.html">guide to blackout</Link> explains
							where the light actually gets in.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things clients here ask.</h2>
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
								We work on Jupiter Island, in Hobe Sound and across greater Jupiter. Start with a
								relaxed 30-minute call, tell us which openings are the problem, and we will come
								and look at them at the hour they misbehave.
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
