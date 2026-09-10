import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood), typographic hero. Angle from the
   brief: understated luxury and significant interiors, so the subject is
   restraint, and motorization that is felt rather than seen. */

const FAQS: FaqEntry[] = [
	{
		q: "We do not want anything that looks like a showroom. Is that a problem?",
		a: "It is the easiest brief we get. Restraint is mostly a matter of a plain cloth cut generously, a header that does not draw attention, and hardware you never see. What people read as understated is usually just proportion done properly.",
	},
	{
		q: "Can motorization be invisible?",
		a: (
			<>
				Close to it. The track goes above the sightline or into a recess, the panels return to the
				wall, and what you see is cloth moving. The power is handled by our licensed, insured electrical partner, <BalticLink />, planned before anything is cut so no ceiling is opened
				as a surprise.
			</>
		),
	},
	{
		q: "The house has significant interiors already. Will you work to them?",
		a: "That is the job. We take the room as it is, including the pieces you are not changing, and specify cloth that sits with them rather than competing. Where you are working with a designer, we fabricate to their specification.",
	},
];

export default function GulfStreamPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-gulf-stream.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Window Treatments · Gulf Stream</div>
							<h1>Window Treatments for Gulf Stream Homes</h1>
							<p>
								A town where the good houses do not announce themselves. The window treatments
								should not either.
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
						<h2 className="big">Quiet is harder than loud.</h2>
						<p className="lede">
							Restraint shows every mistake. A plain linen panel has nowhere to hide a crooked
							hem, a short length or a header pulling out of line, which is exactly why it is the
							right choice in a house like this and exactly why it has to be made properly. The
							cloth is simple. The making is not.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Pattern forgives poor making. Plain cloth tells the truth about it.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">Proportion first, then cloth.</h2>
							<p>
								We measure in the room, set the length and the fullness against the architecture,
								and only then talk about fabric. Everything is made to order in European fabrics,
								specified with the lining and interlining rather than after them, and fitted by
								our own installers. Where an opening is too wide or too tall to draw by hand, the
								motorization is planned early and the wiring is handled by our licensed, insured electrical partner, <BalticLink />, scheduled and managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Hardware out of sight</b>, so what you notice is the cloth and not the
								mechanism.
							</li>
							<li>
								<b>Salt-air-aware fabrics</b>, chosen for how they age this close to the ocean.
							</li>
							<li>
								<b>Our own installers</b>, so the making and the hanging are one responsibility.
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
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							Gulf Stream sits inside our wider{" "}
							<Link to="/motorized-shades-delray-beach.html">
								motorized shades in Delray Beach
							</Link>{" "}
							territory, alongside <Link to="/window-treatments-manalapan.html">Manalapan</Link>.
							On the treatments, <Link to="/drapery.html">custom drapery</Link> covers the making,{" "}
							<Link to="/european-fabrics.html">European fabrics</Link> explains what we buy and
							why, <Link to="/motorized.html">motorized shades and drapery</Link> covers the
							hardware, and <Link to="/roman-shades.html">Roman shades</Link> suit the windows
							with nowhere to stack.
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
								We serve Gulf Stream and the coast either side of it. Start with a relaxed
								30-minute call, tell us what you want the room to feel like, and we will bring
								the shortlist to you.
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
