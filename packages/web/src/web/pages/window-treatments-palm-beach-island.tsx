import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood). Plain typographic hero. This page
   deliberately covers the whole island, the Estate Section, the North End and
   the Midtown lakefront, rather than splitting into three pages competing over
   33480. The angle is the brief's Palm Beach hooks: floor-length European
   drapery where ceremony is warranted, layered drapery plus shades on the
   lakefront. */

const FAQS: FaqEntry[] = [
	{
		q: "Is drapery still right for a room that is mostly glass and stone?",
		a: "It is usually what the room is missing. Glass and stone are hard surfaces, and a room built from them can sound and feel colder than it looks. Floor-length panels warm the room, soften the scale, absorb some of the echo, and frame the view instead of competing with it. In an island room that generally means generous, quiet panels that move well rather than anything decorative.",
	},
	{
		q: "What does layering actually mean on the lakefront?",
		a: "Two layers doing two jobs at one opening. A solar or roller shade takes the glare and the solar heat during the day while keeping the water in view. Drapery sits outside it and does the rest: privacy after dark, softness, and the finish. Lakefront rooms need the second layer more than people expect, because once the room is lit at night it becomes the visible one from outside.",
	},
	{
		q: "We are working with a designer. How does that go?",
		a: "Easily. We regularly work alongside interior designers, and the vision stays the designer's. We fabricate to their specification, tell them honestly how a fabric will behave once it is a long panel in island light, and raise anything about repeat, width or weight before it is cut rather than after.",
	},
];

export default function PalmBeachIslandPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-palm-beach-island.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Palm Beach Island</div>
							<h1>Window Treatments for Palm Beach Island Homes</h1>
							<p>
								From the Estate Section to the North End and the Midtown lakefront. Confident
								architecture, generous light, and rooms that deserve to be finished properly.
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
						<h2 className="big">Ceremony where it is warranted, restraint everywhere else.</h2>
						<p className="lede">
							The island is not one kind of house. An Estate Section room with tall windows and
							real formality wants drapery with some ceremony to it. A North End house is often
							lower, brighter and more relaxed, and the same treatment would look overdressed. A
							Midtown lakefront residence has a different problem again, glass facing water with
							neighbors in view. The craft is the same in all three. The answer is not.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Quiet luxury is a decision about restraint. It shows up in the length, the header
							and the lining, not in how much fabric is in the room.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Fabric brought to your wall, not to a showroom.</h2>
							<p>
								We start with the room rather than a catalog. We come to the house, measure the
								openings ourselves, and look at fabric against your own walls at the hour you
								actually use the space, because a linen that reads warm under showroom light can
								read gray in an island room at four in the afternoon. Everything is made to
								measure in European fabrics and hung by our own installers. Where a project calls
								for motorization, the wiring is handled by our licensed, insured electrical partner, <BalticLink />, scheduled and managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Length and break decided in the room</b>, where the floor and the light are.
							</li>
							<li>
								<b>Header chosen for the architecture</b>, formal or relaxed, not by default.
							</li>
							<li>
								<b>Lining specified for coastal light</b>, so color holds on the sun side.
							</li>
							<li>
								<b>Designer-friendly</b>, fabricating on spec and on time.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							This page sits under our{" "}
							<Link to="/custom-drapery-palm-beach.html">custom drapery in Palm Beach</Link>{" "}
							work, and across the bridge we cover{" "}
							<Link to="/window-treatments-el-cid-soso-west-palm-beach.html">
								El Cid and SoSo in West Palm Beach
							</Link>
							. On the treatments,{" "}
							<Link to="/drapery.html">custom drapery</Link> covers the making and the
							stack-back, <Link to="/roman-shades.html">Roman shades</Link> is often the right
							answer for a window that wants softness without full panels, and{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains what we choose
							and why. Our guide to{" "}
							<Link to="/drapery-headers.html">drapery headers, compared</Link> walks through
							ripple fold, pinch pleat and French pleat.
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
								We work across Palm Beach Island, from the Estate Section to the North End and
								the Midtown lakefront. Start with a relaxed 30-minute call, tell us which room
								is unfinished, and we will come and see it in its own light.
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
