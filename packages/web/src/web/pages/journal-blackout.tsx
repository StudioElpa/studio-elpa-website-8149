import { BackHeader, ThinFooter } from "../components/site-chrome";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original journal-blackout.html, with one edit:
   "heavy drapes ... transform the room's mood" used a word the brief bans, so it
   now reads "change the room's mood entirely". */

export default function JournalBlackoutPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-article" ref={root}>
			<PageSeo path="/journal-blackout.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<BackHeader href="/index.html#journal" label="← The Journal" />

			<main id="main">
				<article>
					<div className="article-wrap">
						<div data-hero>
							<div className="kicker">The Journal · Light</div>
							<h1>The case for real darkness</h1>
							<p className="dek">
								A little light in the bedroom feels harmless. Your body disagrees. Here's what the
								dark is really doing for you, and how to stop fighting for it.
							</p>
							<div className="byline">Studio Elpa · Notes on living well at home</div>
						</div>

						<p className="lead" data-reveal>
							The bedroom was always meant to be a sanctuary, yet most of us spend our nights
							floating in a persistent, synthetic twilight.
						</p>

						<p data-reveal>
							We allow streetlights, passing headlights, and the faint glare of screen light to leak
							through thin fabrics, unaware of how quietly they erode our health.
						</p>

						<p data-reveal>
							We're particular about how a bedroom is meant to work, because rest is the whole job
							of the room. A restorative night asks for two non-negotiables: a space that is cool,
							and a space that is completely, unconditionally dark. It is only in that absolute
							stillness that the mind drops its guard, giving way to the kind of sleep that leaves
							you waking up genuinely energized, ready to step into the morning as yourself.
						</p>

						<h2 data-reveal>What the science quietly confirms</h2>

						<p data-reveal>
							Science simply confirms what our bodies intuitively feel. Deep in the brain sits the
							suprachiasmatic nucleus, our master clock, which relies on light sensors that read
							exposure right through closed eyelids. When ambient light seeps in, it suppresses
							melatonin and locks you out of deep, slow-wave sleep. Instead of a full autonomic
							power-down, your heart rate, blood pressure, and core temperature are denied their
							lowest daily baselines. Your sympathetic nervous system stays idling in gear.
						</p>

						<p data-reveal>
							Throughout the night, unseen micro-arousals, brief disruptions you'll never remember,
							repeatedly pull you out of delta-wave sleep. Over time, even dim light raises
							nighttime heart rates and alters morning blood sugar, creating a quiet slide toward
							insulin resistance.
						</p>

						<p className="pull" data-reveal>
							You don't need more hours in bed. You need the hours you already have to actually
							count.
						</p>

						<h2 data-reveal>Darkness you don't have to compromise for</h2>

						<p data-reveal>
							Creating absolute darkness doesn't mean compromising on how a space feels during the
							day. Room darkening is as much an art of tailoring as it is a functional necessity,
							and the approach should always mirror the architecture of the room.
						</p>

						<div className="duo" data-reveal-group>
							<div className="card" data-reveal>
								<div className="label">For the minimalist</div>
								<h4>Clean lines, absolute opacity</h4>
								<p>
									If your aesthetic leans toward clean lines and uncluttered surfaces, a custom
									blackout roller or Roman shade provides a crisp, architectural finish. Framed
									within the window casing, it disappears into the room's geometry, offering
									absolute opacity without visual weight.
								</p>
							</div>
							<div className="card" data-reveal>
								<div className="label">For the tactile &amp; soft</div>
								<h4>Texture that quiets a room</h4>
								<p>
									If you prefer a space layered and quieted by texture, heavy drapes paired with
									hand-finished hardware change the room's mood entirely. Dense linens lined with
									light-blocking backing or rich velvets absorb both ambient light and subtle
									acoustic noise, wrapping the space in a softened, cocoon-like calm.
								</p>
							</div>
						</div>

						<h2 data-reveal>Let the room do the work</h2>

						<p data-reveal>
							To make the transition into rest effortless, motorization can be integrated quietly
							behind the scenes. There is a simple, understated luxury in pressing a button from
							bed, or letting an automated schedule gently lower the shades, and watching the
							outside world glide shut as evening takes over. It removes the daily friction of
							drawing the house closed, so the shift from daylight to deep rest becomes something
							the room does for you.
						</p>

						<p data-reveal>
							We spend a third of our lives in the dark. Designing that darkness thoughtfully isn't
							just about dressing a window. It's about honoring the quiet hours that make the waking
							ones possible.
						</p>

						<p className="footnote" data-reveal>
							Drawn from published sleep and circadian research. Shared to inform, not as medical
							advice; for concerns about your sleep or health, talk with your doctor.
						</p>

						<div className="cta" data-reveal>
							<div className="kicker">No pressure. Just a conversation.</div>
							<h3>Ready to make your bedroom truly dark?</h3>
							<p>
								Tell us about the room, how you use it, and when the light wakes you. We'll take it
								from there.
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
