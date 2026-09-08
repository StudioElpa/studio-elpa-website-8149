import { BackHeader, ThinFooter } from "../components/site-chrome";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Bio supplied by the user and reproduced verbatim. The kicker, dek and the
   closing CTA block are the only words here that are ours; everything from the
   lead paragraph to "Not for much longer." is the user's own text, unedited.
   No booking link on article pages by design: the soft CTA points at #contact. */

export default function MeetElviraPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-article founder" ref={root}>
			<PageSeo path="/meet-elvira.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<BackHeader href="/index.html#about" label="← Back to Studio Elpa" />

			<main id="main">
				<article>
					<div className="article-wrap">
						<div data-hero>
							<div className="kicker">Creative Director, Home Textiles</div>
							<h1>Meet Elvira Vasiljeva</h1>
							<p className="dek">
								The Baltic eye behind our textiles, and the reason our fabrics rarely arrive from a
								catalogue.
							</p>
						</div>

						<img
							className="bio-portrait"
							src="/assets/team-elvira.jpg"
							alt="Elvira Vasiljeva, Creative Director of Home Textiles at Studio Elpa"
							width={900}
							height={1200}
							loading="lazy"
							data-reveal
						/>

						<p className="lead" data-reveal>
							There is something about growing up in the Baltics that stays with you.
						</p>

						<p data-reveal>
							The forests. The long winters. The tall pine trees. The quiet colors. The
							understanding that beauty does not always need to announce itself.
						</p>

						<p data-reveal>
							Elvira Vasiljeva, Studio Elpa's Creative Director for Home Textiles, brings that
							sensibility into everything she touches.
						</p>

						<p data-reveal>
							Born and raised in the Baltics, Elvira developed an early appreciation for restraint,
							texture and things made well. Her eye has never been drawn to excess for the sake of
							excess. She notices the weave of a fabric, the weight of linen in the hand, the tiny
							irregularities that make something feel crafted rather than manufactured.
						</p>

						<p data-reveal>
							More than twenty years ago, Elvira moved to France, and a whole new layer was added to
							that Baltic foundation.
						</p>

						<p data-reveal>
							Living in France gave her the opportunity to study the craft of textiles more closely
							and to experience another way of thinking about the home. French interiors taught her
							the value of ease, patina and things that become more beautiful with use. Time spent
							in Switzerland brought yet another influence: precision, quality and an almost
							obsessive respect for workmanship.
						</p>

						<p data-reveal>The result is a point of view that feels very much her own.</p>

						<p data-reveal>
							Elvira can admire a beautifully tailored textile and still be far more interested in
							the slightly imperfect handwoven one sitting quietly in the corner.
						</p>

						<p data-reveal>She is also relentlessly curious.</p>

						<p data-reveal>
							Put Elvira in a new city and, sooner or later, she will find the textile mill nobody
							talks about, the woman weaving something extraordinary in a small studio, the
							embroidery workshop that has been doing the same thing for three generations, or the
							artisan making an object you suddenly cannot imagine your home without.
						</p>

						<p data-reveal>
							She is an extraordinary relationship builder, which means sourcing for Studio Elpa
							often goes far beyond catalogues, trade shows and the usual suppliers.
						</p>

						<p data-reveal>
							It happens through conversations. Introductions. Friends of friends. Small workshops.
							Family-run manufacturers. And occasionally, a discovery followed by a message that
							simply says, <em>"You need to see this."</em>
						</p>

						<p data-reveal>
							That constant sourcing instinct is one of the reasons Studio Elpa is able to look
							beyond what is already everywhere.
						</p>

						<p data-reveal>
							We do not want to fill a collection simply because a category needs filling. We would
							rather wait until we find something with a point of view, something beautifully made,
							something that feels worth bringing into a home.
						</p>

						<p data-reveal>
							Elvira plays an enormous part in that process. She is continually searching for
							unusual fabrics, new techniques, interesting materials and, most importantly, talented
							people who still care deeply about how things are made.
						</p>

						<p data-reveal>
							Some of those relationships are already turning into very special Studio Elpa
							projects. A few of them are unlike anything we have offered before.
						</p>

						<p data-reveal>
							And yes, we are being annoyingly mysterious about them for the moment.
						</p>

						<p data-reveal>Not for much longer.</p>

						<div className="cta" data-reveal>
							<div className="kicker">No pressure. Just a conversation.</div>
							<h3>Tell us about the room.</h3>
							<p>
								If you are looking for something you have not seen everywhere else, that is the
								part of this we enjoy most.
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
