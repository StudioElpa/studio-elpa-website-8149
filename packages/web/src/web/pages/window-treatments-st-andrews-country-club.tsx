import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template B (neighbourhood), typographic hero. Angle from the
   brief: large club homes that come round on renovation cycles, so the subject
   is the whole-home package and working to a designer's drawings. */

const FAQS: FaqEntry[] = [
	{
		q: "Can you quote a whole house at once?",
		a: "Yes, and it is the sensible way to buy a house this size. We measure every opening in one visit, specify room by room, and price it as one project. You get one installation, one delivery date, and fabrics that were chosen next to each other rather than months apart.",
	},
	{
		q: "We are renovating with an architect and a designer. Where do you fit?",
		a: "We regularly work alongside interior designers, and we work to their drawings. The vision stays theirs. Our part is to say early whether a specified cloth will behave as a twelve foot panel in Florida light, and to get the track, the pocket and the power into the drawing while it is still a drawing.",
	},
	{
		q: "Do we have to do the whole house in one fabric?",
		a: (
			<>
				No, and you should not. What holds a house together is a consistent approach to header,
				length and lining, not one cloth everywhere. The bedrooms can be quiet and the main rooms
				can carry more weight, and they will still read as one house. Where anything needs
				motorizing, the power goes through our licensed and insured electrical partner, <BalticLink />.
			</>
		),
	},
];

export default function StAndrewsPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/window-treatments-st-andrews-country-club.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero plain">
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">
								Window Treatments · St. Andrews Country Club, Boca Raton
							</div>
							<h1>Window Treatments for St. Andrews Country Club Homes</h1>
							<p>
								Large club houses, thirty or forty openings apiece, and a renovation cycle that
								comes round often enough to be worth planning for.
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
						<h2 className="big">Thirty windows, one decision.</h2>
						<p className="lede">
							The difficulty in a house this size is not any single window. It is that there are
							forty of them, in rooms with different jobs, and treating each one as its own little
							project is how a house ends up looking assembled rather than designed. We survey the
							whole house at once, then decide what repeats and what is allowed to be different.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							Consistency is a header, a length and a lining used with discipline. It is not the
							same fabric in every room.
						</p>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How we work</div>
							<h2 className="big">One survey, one schedule, one installation.</h2>
							<p>
								We measure the house in a single visit and build the specification room by room,
								so the fabrics, the linings and the headers are chosen alongside each other.
								Everything is made to order in European fabrics and fitted by our own installers
								on one schedule rather than five. Where a room calls for motorization, the wiring
								is handled by our licensed and insured electrical partner, <BalticLink />, scheduled
								and managed by us. If you are working with a designer, we fabricate to their
								specification and keep to it.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Whole-home survey</b>, so the plan is made once and not forty times.
							</li>
							<li>
								<b>Cut to each opening</b>, because near-identical windows are not identical.
							</li>
							<li>
								<b>One installation date</b>, our own installers, one point of contact.
							</li>
							<li>
								<b>Designer-friendly</b>, working to the drawings you already have.
							</li>
						</ul>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow" data-reveal>
						<div className="kicker">Where this goes next</div>
						<h2 className="big">Nearby, and in the detail.</h2>
						<p className="lede">
							St. Andrews sits inside our wider{" "}
							<Link to="/custom-window-treatments-boca-raton.html">
								custom window treatments in Boca Raton
							</Link>{" "}
							territory, alongside{" "}
							<Link to="/window-treatments-royal-palm-yacht-club.html">
								Royal Palm Yacht &amp; Country Club
							</Link>{" "}
							and{" "}
							<Link to="/window-treatments-the-sanctuary-boca-raton.html">The Sanctuary</Link>. On
							the treatments, <Link to="/drapery.html">custom drapery</Link>,{" "}
							<Link to="/roman-shades.html">Roman shades</Link> and{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link> are the three that come
							up most in a house this size, and{" "}
							<Link to="/custom-home-textiles.html">custom home textiles</Link> is how the same
							cloth carries into cushions and bedding.
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
							<h2 className="big">Tell us about the house.</h2>
							<p>
								We serve St. Andrews Country Club and greater Boca Raton. Start with a relaxed
								30-minute call, tell us roughly how many rooms are in scope, and we will come and
								survey the lot in one visit.
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
