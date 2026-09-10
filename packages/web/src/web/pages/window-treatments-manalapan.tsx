import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero, no
   photograph, per the no-stock rule. The angle is the brief's Ocean Ridge and
   Manalapan hook: ocean-to-lake houses that take light from both sides, salt
   air, blackout bedrooms and solar shading on big glass. Nothing here claims a
   project, a client or a volume. */

const FAQS: FaqEntry[] = [
	{
		q: "Our house faces the ocean on one side and the lake on the other. Does that change anything?",
		a: "It changes the order we work in. Two exposures means two different problems in the same house, and they do not peak at the same hour. The ocean side takes hard morning light and the salt that comes with it. The lake side takes the long afternoon and the low glare that comes off water. We measure and specify each elevation on its own terms rather than repeating one solution around the house.",
	},
	{
		q: "How do you choose fabric for a house this close to salt air?",
		a: "By being honest about it. Salt air and strong ultraviolet are hard on fiber, and a fabric that behaves beautifully inland can tire quickly on an oceanfront elevation. We choose the cloth together with its lining, because the lining takes the sun first and does most of the protecting. We will tell you plainly if something you love is the wrong choice for the window you want it on.",
	},
	{
		q: "Can a bedroom on the water be genuinely dark?",
		a: (
			<>
				Yes, but it takes a layer built for it. A solar weave holds the horizon during the day
				and will not darken a room at night. For real rest we pair it with a blackout layer and
				close the light gaps at the sides and the top, which is where the light actually gets in.
				Where an opening is too wide to work comfortably by hand we motorize it, with the wiring
				handled by our licensed, insured electrical partner, <BalticLink />, coordinated by us.
			</>
		),
	},
];

export default function ManalapanPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-manalapan.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Manalapan</div>
							<h1>Window Treatments for Manalapan Homes</h1>
							<p>
								A narrow strip of land with the ocean on one side and the lake on the other. The
								light comes from both directions, and it arrives at different hours.
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
						<h2 className="big">Two exposures, one house, and salt in the air.</h2>
						<p className="lede">
							An ocean-to-lake house is really two houses as far as light is concerned. The east
							glass takes a bright, hard morning and the west glass takes a long afternoon that
							comes back up off the water. Add salt air and a great deal of ultraviolet, and the
							window treatments have to do more than look right. They have to keep looking right.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							The mistake is to solve the whole house once. We solve it elevation by elevation,
							then make it look like one decision.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Measured in the room, at the hour it misbehaves.</h2>
							<p>
								We come to the house, measure the openings ourselves and look at each elevation
								when it is actually a problem, which for a west-facing lake room is late in the
								day. Solar and roller shades take the glare and the solar heat off the big glass.
								Blackout layers do the bedrooms. Custom drapery softens the scale and holds the
								whole thing together. Everything is made to measure in European fabrics and
								fitted by our own installers, and the wiring for anything motorized goes through
								our licensed, insured electrical partner, <BalticLink />, scheduled by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Each elevation specified separately</b>, because east and west glass are not
								the same problem.
							</li>
							<li>
								<b>Fabric and lining chosen together</b>, since the lining takes the sun first.
							</li>
							<li>
								<b>Blackout treated as a layer</b>, not as a darker shade.
							</li>
							<li>
								<b>One point of contact</b>, from the first measurement to the last panel.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Manalapan sits in the coastal stretch we cover from{" "}
							<Link to="/motorized-shades-delray-beach.html">Delray Beach</Link>, alongside{" "}
							<Link to="/window-treatments-gulf-stream.html">Gulf Stream</Link>. On the
							treatments themselves,{" "}
							<Link to="/roller-solar-shades.html">roller and solar shades</Link> is the
							big-glass answer, <Link to="/blackout.html">blackout drapery and shades</Link>{" "}
							covers the bedrooms, and{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains how we choose
							cloth that survives a coastal elevation. Our{" "}
							<Link to="/journal-blackout.html">guide to blackout</Link> goes through where the
							light really gets in.
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
								We work in Manalapan and along the coast through Gulf Stream and Delray Beach.
								Start with a relaxed 30-minute call, tell us which side of the house is the
								problem, and we will come and look at it at the hour it bothers you.
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
