import { BackHeader, ThinFooter } from "../components/site-chrome";
import { BalticLink } from "../components/partner";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original founder.html. */

export default function FounderPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-article founder" ref={root}>
			<PageSeo path="/founder.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<BackHeader href="/index.html#about" label="← Back to Studio Elpa" />

			<main id="main">
				<article>
					<div className="article-wrap">
						<div data-hero>
							<div className="kicker">A note from our founder</div>
							<h1>On making a home you can finally breathe in.</h1>
							<p className="dek">
								Linen, Baltic summers, and why the best rooms aren't the ones you admire from the
								doorway.
							</p>
						</div>

						<p className="lead" data-reveal>
							I've always believed the best rooms don't just look beautiful. They feel good to live
							in.
						</p>

						<p data-reveal>
							I love drapery. Not the heavy, stuffy, dust-collecting kind, but fabric that moves
							with a room. Light, airy, soft. The kind that lets a house breathe. Maybe that isn't
							a coincidence: elpa means breath in Latvian.
						</p>

						<p data-reveal>
							I was born and raised in the Baltics, where the beach sand is warm and silky, the
							pine trees make the air taste impossibly clean, and a summer tan lingers long after
							the short season ends. My grandmother was a seamstress. My mother began her own
							career as one at sixteen. Fabric and craftsmanship were around me long before I
							understood how much they were shaping me. Textiles are, quite literally, in my blood.
						</p>

						<p data-reveal>
							I grew up sleeping on linen sheets in summer. Years later, in Florida, I kept
							remembering how real linen felt on those gentle Baltic nights. These days I sleep on
							linen with silk pillowcases, so every part of me feels a little pampered. I say it as
							a joke, but there's something serious underneath it. Home should feel good.
						</p>

						<p data-reveal>
							And what feels good to me may be completely wrong for you. My closest friend and I
							can talk for hours, yet neither of us would ever want to live in the other's house.
							That is exactly the point. Studio Elpa is not about my taste. It's about yours. I
							want to know how you actually live: what bothers you about a room, what you love, how
							the morning light comes in, where you curl up at night, how you want to feel when you
							walk through the door. I also have a soft spot for a slightly wild idea. Hot pink
							silk-lined drapes? We should talk.
						</p>

						<p data-reveal>
							That's why I think of us as consultants first, and salespeople never. I want the
							whole process to feel considered and, honestly, easy: the first conversation, the
							European fabrics, the craftsmanship, the hardware, the motorization, the
							installation. We keep the work close, with our own installers and our licensed,
							insured electrical partner, <BalticLink />, because you shouldn't have to coordinate
							five people
							to finish one beautiful room. And when we work alongside your designer, their vision
							is something we protect.
						</p>

						<p data-reveal>
							When a project is done, I don't want you to come home to a house. I want you to walk
							into a sanctuary. I want your child to run into their room after a loud day at school,
							or a louder afternoon roughhousing with the dog by the pool, and feel their whole
							body settle. I want you to close the door on the outside world and, finally, breathe.
						</p>

						<p data-reveal>
							That's what I hope we make for you. Not rooms to admire from the doorway. Rooms you
							can't wait to live in.
						</p>

						<p className="sig" data-reveal>
							Aviva<small>Founder, Studio Elpa</small>
						</p>

						<div className="cta" data-reveal>
							<div className="kicker">No pressure. Just a conversation.</div>
							<h3>Tell me about the room.</h3>
							<p>
								Every project here starts with a conversation, not a commitment. I'd love to hear
								how you live.
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
