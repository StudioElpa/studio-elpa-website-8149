import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. Angle from
   the brief's Las Olas Isles hook: neighbours across the canal, glass on every
   wall, privacy without losing the water view. Note the US spelling in all
   rendered copy: "neighbors". */

const FAQS: FaqEntry[] = [
	{
		q: "The house across the canal can see straight in. What actually fixes that?",
		a: "A layer that changes with the time of day. During daylight a solar weave reads as a surface from outside and as a view from inside, so it gives you privacy and keeps the canal. At night that reverses completely: the lit room becomes the visible one and the same shade gives you almost nothing. Any room you use after dark needs a second layer that closes, which is usually drapery.",
	},
	{
		q: "Can we get privacy without giving up the water?",
		a: "In the daytime, yes, and that is most of what people want. The trick is choosing the openness of the weave deliberately rather than accepting a default. Tighter weaves buy privacy and start to flatten the view. More open weaves keep the horizon and give up a little. We look at the actual sightline from your room to your neighbor's window and choose from there, rather than specifying the same fabric all the way around the house.",
	},
	{
		q: "Glass on every wall means a lot of openings. Where do we start?",
		a: (
			<>
				With the two or three rooms that are genuinely uncomfortable, not with the whole house.
				We would rather solve the west-facing living room and the primary bedroom properly and
				let you live with them for a while than specify twenty openings on day one. Where an
				opening is too wide to work by hand we motorize it, with power run by our licensed, insured electrical partner, <BalticLink />, coordinated by us.
			</>
		),
	},
];

export default function LasOlasIslesPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-las-olas-isles.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Las Olas Isles, Fort Lauderdale</div>
							<h1>Window Treatments for Las Olas Isles Homes</h1>
							<p>
								Narrow lots, glass on every wall, and neighbors a canal width away. Privacy here
								is a design problem, not a curtain problem.
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
						<h2 className="big">Close neighbors, and a view worth keeping.</h2>
						<p className="lede">
							On the isles the water is the reason for the house and it is also the reason your
							neighbor can see into your living room. Most people solve that by closing something
							permanently, which costs them the view they paid for. The better answer is a
							treatment that behaves differently at three in the afternoon than it does at nine
							at night, because privacy and glare are two different problems on the same window.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							A solar shade that gives you privacy at noon gives you none at all once the room
							is lit. Knowing that is most of the job.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Sightlines checked from your room, not from a plan.</h2>
							<p>
								We come to the house and look at what can actually be seen, from where, and at
								what hour, then specify each elevation from that rather than repeating one fabric
								around the house. Solar and roller shades handle daytime privacy and the glare
								off the water, custom drapery closes the room in the evening and softens a lot of
								hard glass, and blackout layers do the bedrooms. Everything is made to measure in
								European fabrics and fitted by our own installers, with wiring handled by our
								licensed, insured electrical partner, <BalticLink />, scheduled by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Openness chosen per elevation</b>, tighter where the neighbor is closer.
							</li>
							<li>
								<b>Day and night treated separately</b>, because one layer cannot do both.
							</li>
							<li>
								<b>Started with the worst rooms</b>, not with all twenty openings.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating to specification without getting in the
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
							The isles sit inside our{" "}
							<Link to="/custom-drapery-fort-lauderdale.html">Fort Lauderdale</Link> territory,
							just along the water from{" "}
							<Link to="/window-treatments-harbor-beach-fort-lauderdale.html">
								Harbor Beach
							</Link>
							. On the treatments,{" "}
							<Link to="/roller-solar-shades.html">roller and solar shades</Link> explains
							openness and privacy,{" "}
							<Link to="/natural-woven-shades.html">natural woven shades</Link> is the warmer
							option for the same job, and <Link to="/drapery.html">custom drapery</Link> covers
							the evening layer. Our guide to{" "}
							<Link to="/drapery-headers.html">drapery headers, compared</Link> covers how each
							header changes the feel of a room.
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
								We work across the Las Olas Isles and greater Fort Lauderdale. Start with a
								relaxed 30-minute call, tell us which room feels exposed, and we will come and
								look at the sightlines from inside it.
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
