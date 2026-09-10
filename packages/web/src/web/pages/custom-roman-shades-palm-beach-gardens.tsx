import { Link } from "wouter";
import { LandingHeader, LandingFooter } from "../components/site-chrome";
import { Faq, type FaqEntry } from "../components/faq";
import { BalticLink } from "../components/partner";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* V2 geo page, Template A (service + city). Palm Beach Gardens is inland club
   and family housing rather than oceanfront, so the hook is the Roman shade:
   softness at a window that does not have room for full panels, and rooms that
   repeat across a large house. Written for the Gardens specifically. */

const CARDS = [
	{
		title: "Flat fold or relaxed",
		body: "A flat fold with battens reads tailored and architectural. A relaxed fold curves gently across the bottom and reads softer. It is the first decision, and it changes the room more than the color will.",
	},
	{
		title: "Where panels will not fit",
		body: "Over a kitchen sink, in a stairwell, beside a door that swings. A Roman shade gives you cloth and softness in the places drapery has nowhere to stack.",
	},
	{
		title: "The lining does the work",
		body: "The same face fabric can filter light or stop it dead depending on what is behind it. Blackout for a bedroom, a light-filtering lining where you want the room to glow rather than go dark.",
	},
];

const FAQS: FaqEntry[] = [
	{
		q: "What is the difference between a Roman shade and a roller shade?",
		a: "A Roman shade is made of your fabric and folds up into soft stacked pleats, so it reads as a piece of the room. A roller is a technical fabric on a tube and reads as equipment, which is exactly right when the job is glare control on a wall of glass. Plenty of houses want one of each, in different rooms.",
	},
	{
		q: "Can Roman shades be blackout?",
		a: "Yes, with a blackout lining and, in a bedroom, a side channel or a generous overlap to deal with the light that comes around the edges rather than through the cloth. Real darkness is a fitting problem as much as a fabric one.",
	},
	{
		q: "Can they be motorized?",
		a: (
			<>
				They can, and in a stairwell or above a run of cabinets it is often the only sensible way
				to reach them. The power goes through our licensed and insured electrical partner,{" "}
				<BalticLink />, scheduled and managed by us.
			</>
		),
	},
	{
		q: "We have eight windows that are almost identical. Does that make it cheaper?",
		a: "It makes it better, and usually simpler. Ordering a house together means one fabric run, one installation and a line that stays true across a wall. Each shade is still cut to its own opening, because almost identical is not identical.",
	},
	{
		q: "How long does a project take?",
		a: "Most projects land in the usual 6 to 8 week window from order to installation. A cut-to-order weave or a special dye can add to that, and we give you the real date when you choose the fabric rather than afterwards.",
	},
];

export default function PalmBeachGardensPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp" ref={root}>
			<PageSeo path="/custom-roman-shades-palm-beach-gardens.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader />

			<main id="main">
				<section className="hero">
					<div
						className="bgimg"
						style={{ backgroundImage: "url('/assets/art-roman.jpg')" }}
						data-parallax
					/>
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">Custom Roman Shades · Palm Beach Gardens</div>
							<h1>Custom Roman Shades in Palm Beach Gardens</h1>
							<p>
								The neatest way to put real fabric at a window that has nowhere for panels to
								stack. Made to measure, hung by the people who made them.
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
						<h2 className="big">Softness, without giving up the opening.</h2>
						<p className="lede">
							Gardens houses are generous but they are not all glass, and a lot of their windows
							sit where drapery has no room: over a counter, in a stair, beside a door that has to
							swing. A Roman shade puts your fabric at those windows and then gets out of the way
							by folding up into the head of the opening. It is also the quietest way to make
							eight ordinary windows in one house look considered.
						</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							A Roman shade is the one treatment that is entirely made of the thing you chose. It
							had better be cut properly.
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
							<h2 className="big">Measured window by window, made to order.</h2>
							<p>
								We measure every opening ourselves, decide the fold style, the lining and the
								mounting per window, and make everything to order in European fabrics. Our own
								installers fit them, so the making and the hanging are one responsibility. Where a
								shade needs to be motorized, the wiring is handled by our licensed and insured electrical partner, <BalticLink />, scheduled and managed by us.
							</p>
						</div>
						<ul className="clean" data-reveal>
							<li>
								<b>Fold style chosen per room</b>, flat and tailored or relaxed and soft.
							</li>
							<li>
								<b>Lining specified with the cloth</b>, blackout, dimout or light-filtering.
							</li>
							<li>
								<b>Cut to its own opening</b>, even when eight windows look the same on the plan.
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
						<h2 className="big">Around the Gardens, and into the detail.</h2>
						<p className="lede">
							We work Palm Beach Gardens and North Palm Beach, including{" "}
							<Link to="/window-treatments-old-palm-palm-beach-gardens.html">Old Palm</Link>. On
							the treatments, <Link to="/roman-shades.html">Roman shades</Link> covers the
							construction in full, <Link to="/drapery.html">custom drapery</Link> is for the rooms
							that do have somewhere to stack,{" "}
							<Link to="/blackout.html">blackout drapery and shades</Link> is the bedroom
							conversation, <Link to="/natural-woven-shades.html">natural woven shades</Link> is
							the warmer, more textural cousin, and{" "}
							<Link to="/custom-home-textiles.html">custom home textiles</Link> is how the same
							cloth carries on into cushions and bedding.
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">A few things Gardens clients ask.</h2>
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
							<h2 className="big">Tell us about the windows.</h2>
							<p>
								We work Palm Beach Gardens and North Palm Beach, one room or a whole house. Start
								with a relaxed 30-minute call, tell us how many windows and what they are near,
								and we will come out with fabrics rather than a brochure.
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
