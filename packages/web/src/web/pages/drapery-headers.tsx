import { Link } from "wouter";
import { PageSeo } from "../components/page-seo";
import { BackHeader, ThinFooter } from "../components/site-chrome";
import { usePageMotion } from "../hooks/use-motion";

/* V2 Journal guide: the nine drapery headers.

   Every card's name, tagline, body, "The Feeling" and "We Love It For" line is
   the user's supplied copy, verbatim, and so is the closing panel. The only
   words that are mine are the dek, the one lead paragraph and the closing CTA,
   all written to the voice rules and all flagged in task.md for overrule.

   The photographs are the supplied originals at their native size (about 150px
   wide). The layout deliberately displays them no larger than that, because
   upscaling a real photograph to fill a bigger frame would be inventing detail
   the camera never captured. */

interface Header {
	slug: string;
	name: string;
	tagline: string;
	body: string;
	feeling: string;
	loveItFor: string;
	image: string;
	/** Natural pixel size of the supplied photograph. Never displayed larger. */
	w: number;
	h: number;
	/** The closing card. Its photograph is landscape, so it spans the grid. */
	wide?: boolean;
}

const HEADERS: Header[] = [
	{
		slug: "ripple-fold",
		name: "Ripple Fold",
		tagline: "Modern and effortless.",
		body: "Clean, continuous waves create a soft, modern look. No pleats to count, just a beautiful flow that lets the fabric shine.",
		feeling: "Effortless, clean, soft, contemporary.",
		loveItFor:
			"Large windows, sheers, modern homes and rooms where the fabric is the star.",
		image: "/assets/headers/01-ripple-fold.jpg",
		w: 146,
		h: 413,
	},
	{
		slug: "pinch-pleat",
		name: "Pinch Pleat",
		tagline: "Tailored and classic.",
		body: "A perennial favorite. Pinch pleats bring structure and a tailored feel to a room. They work beautifully in both traditional and transitional spaces.",
		feeling: "Polished, tailored, timeless.",
		loveItFor:
			"Almost everything, which is probably why it never goes out of style.",
		image: "/assets/headers/02-pinch-pleat.jpg",
		w: 148,
		h: 413,
	},
	{
		slug: "french-pleat",
		name: "French Pleat",
		tagline: "Elegant and refined.",
		body: "A more decorative version of the pinch pleat, with three distinct folds at each pleat. It creates fullness and a formal, luxurious look.",
		feeling: "Elegant, traditional, dressed.",
		loveItFor:
			"Formal rooms, dining rooms, luxurious bedrooms and fabrics that deserve a little ceremony.",
		image: "/assets/headers/03-french-pleat.jpg",
		w: 152,
		h: 413,
	},
	{
		slug: "euro-pleat",
		name: "Euro Pleat",
		tagline: "Tailored and relaxed.",
		body: "The pleat is gathered right at the top, giving a tailored look with a looser, more relaxed silhouette.",
		feeling: "Tailored, relaxed, quietly sophisticated.",
		loveItFor:
			"Transitional interiors, relaxed luxury and rooms that need structure without stiffness.",
		image: "/assets/headers/04-euro-pleat.jpg",
		w: 146,
		h: 413,
	},
	{
		slug: "box-pleat",
		name: "Box Pleat",
		tagline: "Clean and refined.",
		body: "Simple, structured and modern. Box pleats create straight, tailored folds that give your drapery a clean, architectural look.",
		feeling: "Crisp, architectural, composed.",
		loveItFor:
			"Tailored interiors, geometric spaces and designs where clean repetition matters.",
		image: "/assets/headers/05-box-pleat.jpg",
		w: 148,
		h: 413,
	},
	{
		slug: "inverted-box-pleat",
		name: "Inverted Box Pleat",
		tagline: "Understated and chic.",
		body: "Fullness is tucked behind the pleat, creating a flat, refined appearance from the front. It has the architecture of a box pleat without announcing itself quite as loudly.",
		feeling: "Restrained, precise, understated.",
		loveItFor:
			"Sophisticated contemporary and transitional rooms where a quiet, tailored look is desired.",
		image: "/assets/headers/06-inverted-box-pleat.jpg",
		w: 152,
		h: 413,
	},
	{
		slug: "goblet-pleat",
		name: "Goblet Pleat",
		tagline: "Grand and decorative.",
		body: "A rounded, sculptural pleat that makes a statement. It's decorative, formal and unapologetically elegant.",
		feeling: "Grand, decorative, dramatic.",
		loveItFor:
			"Formal rooms, traditional architecture, tall ceilings and statement drapery.",
		image: "/assets/headers/07-goblet-pleat.jpg",
		w: 146,
		h: 362,
	},
	{
		slug: "grommet",
		name: "Grommet",
		tagline: "Casual and contemporary.",
		body: "Large metal rings are inserted directly into the fabric, making them easy to open and close. It's practical and straightforward.",
		feeling: "Casual, contemporary.",
		loveItFor: "The right project. Sometimes simplicity and budget matter most.",
		image: "/assets/headers/08-grommet.jpg",
		w: 148,
		h: 362,
	},
	{
		slug: "and-beyond",
		name: "And Beyond…",
		tagline: "Custom and less-common.",
		body: "There are also cartridge pleats, pencil pleats, single and double pleats, tab tops, tie tops and custom combinations. Each brings its own character, and the right choice depends on your space, your style and how you live.",
		feeling: "Unique, personal, always intentional.",
		loveItFor: "Homes that don't follow a blueprint.",
		image: "/assets/headers/09-and-beyond.jpg",
		w: 296,
		h: 272,
		wide: true,
	},
];

export default function DraperyHeadersPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-article guide" ref={root}>
			<PageSeo path="/drapery-headers.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<BackHeader href="/index.html#journal" label="← The Journal" />

			<main id="main">
				<article>
					<div className="article-wrap">
						<div data-hero>
							<div className="kicker">The Journal · Drapery</div>
							<h1>Drapery headers, compared</h1>
							<p className="dek">
								Ripple fold, pinch pleat, grommet and six more. The header is the top few inches of
								a curtain, and it decides more about how a room feels than almost anything else you
								choose.
							</p>
							<div className="byline">Studio Elpa · Notes on living well at home</div>
						</div>

						<p className="lead" data-reveal>
							Same window, same fabric, same length. Change the header and you have changed the room.
							Here is what each one does, in plain English, so you can walk into your consultation
							already knowing what you like.
						</p>
					</div>

					<div className="guide-wrap">
						<div className="header-grid">
							{HEADERS.map((h) => (
								<section
									className={h.wide ? "header-card header-card-wide" : "header-card"}
									key={h.slug}
									data-reveal
								>
									<img
										className="header-photo"
										src={h.image}
										alt={`${h.name} drapery header, shown on a curtain at the rod`}
										width={h.w}
										height={h.h}
										loading="lazy"
										decoding="async"
									/>
									<div className="header-text">
										<h2>{h.name}</h2>
										<p className="header-tagline">{h.tagline}</p>
										<p className="header-body">{h.body}</p>
										<dl className="header-meta">
											<dt>The Feeling</dt>
											<dd>{h.feeling}</dd>
											<dt>We Love It For</dt>
											<dd>{h.loveItFor}</dd>
										</dl>
									</div>
								</section>
							))}
						</div>

						<div className="header-close" data-reveal>
							<p>Different header. Same fabric. A completely different feeling.</p>
						</div>
					</div>

					<div className="article-wrap">
						<p data-reveal>
							If you are weighing two of these against each other, that is usually a good sign: it
							means the room could carry either, and the decision belongs with the fabric, the
							hardware and the ceiling height rather than with a rule. We work through all of it at
							the measure, with the samples up at the window.
						</p>

						<p data-reveal>
							Headers are one part of a drapery order. For how the rest of it comes together, from
							fabric and lining to hardware and hem, see{" "}
							<Link to="/drapery.html">custom drapery</Link>.
						</p>

						<div className="cta" data-reveal>
							<div className="kicker">No pressure. Just a conversation.</div>
							<h3>Not sure which header your room wants?</h3>
							<p>
								Tell us about the windows and how the room is used. We will bring the samples and
								show you the difference in person.
							</p>
							<a className="btn btn-solid" href="/index.html#contact">
								Begin a conversation
							</a>
						</div>
					</div>
				</article>
			</main>

			<ThinFooter />
		</div>
	);
}
