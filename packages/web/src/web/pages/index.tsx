import { Link } from "wouter";
import { SiteHeader, SiteFooter } from "../components/site-chrome";
import { ContactForm } from "../components/contact-form";
import { Faq, type FaqEntry } from "../components/faq";
import { BeforeAfter } from "../components/before-after";
import { CONTACT } from "../components/brand";
import { BalticLink } from "../components/partner";
import { HeroMotion } from "../components/hero-motion";
import { PageSeo } from "../components/page-seo";
import { usePageMotion, useHomeMotion } from "../hooks/use-motion";

/* Copy is ported verbatim from the original index.html. Structure and section
   order are unchanged; only rhythm, motion, and the accordion/form mechanics
   were touched. */

/* "At your service". Same four items, same destinations, same illustrations.
   The V1.2 section 4 pass had ranked the first two as promises and the last
   two as actions, with wider columns, larger labels and a chevron. The client
   asked for one uniform set instead, so there is no per-tile variant any more:
   every entry renders identically and the order is the only ordering signal. */
const PILLARS = [
	{
		href: "#process",
		img: "tile-glove.jpg",
		alt: "White glove service",
		title: "White Glove Service",
	},
	{
		href: "#services",
		img: "tile-custom.jpg",
		alt: "Fully customized solutions",
		title: "Fully Customized Solutions",
	},
	{
		href: "/estimate.html",
		img: "tile-estimate.jpg",
		alt: "Quick estimate",
		title: "Quick Estimate",
	},
	{
		href: "#contact",
		img: "tile-appt.jpg",
		alt: "Schedule a private appointment",
		title: "Schedule a Private Appointment",
	},
];

/* The signature treatment. Featured on its own, above the rest. */
const SERVICE_SIGNATURE = {
	img: "art-motor.jpg",
	alt: "Motorized shades lowered evenly across a wide wall of glass",
	title: "Motorized Shades",
	sig: "Our signature is motorized custom drapery: European fabric that moves on a schedule, on quiet, reliable motors, ready for smart-home integration.",
	body: (
		<>
			The luxury of never touching a cord. Quiet, reliable motors for the windows you can't
			reach, whole walls of glass, and cord-free child safety, with the wiring handled by our
			licensed, insured electrical partner, <BalticLink />.
		</>
	),
	tags: "Child-safe · smart-home · big glass",
};

/* The other primary categories, given full editorial cards. Roller Shades was
   removed here in V2: it is no longer a standalone service, its content lives
   inside Motorized Shades (the signature treatment above). That leaves one card,
   so the grid gets `.svc-solo` rather than a hole beside it. */
const SERVICES_PRIMARY = [
	{
		img: "art-drapery-linen.jpg",
		alt: "Custom drapery in soft blue linen framing floor-to-ceiling windows in a South Florida bedroom.",
		title: "Custom Drapery",
		body: "The softest thing you can add to a room. Made to measure in European fabrics, chosen for how they fall, age, and handle light, down to the header, lining, and stack-back.",
		tags: "Softening · warmth · framing windows",
		href: "/drapery.html",
	},
];

/* Quieter continuation. Same copy, same photographs, lighter weight. */
const SERVICES_MORE = [
	{
		img: "art-roman.jpg",
		alt: "A tailored Roman shade stacked in even folds above a window",
		title: "Roman Shades",
		body: "The softness of fabric in a tailored, space-saving form. A favorite for kitchens, baths, and windows where full curtains would be too much. Cordless and child-safe.",
		tags: "Kitchens · baths · soft look",
		href: "/roman-shades.html",
	},
	{
		img: "art-woven.jpg",
		alt: "A natural woven shade in grasses and bamboo filtering warm light",
		title: "Natural Woven Shades",
		body: "Warmth and character woven from grasses, reeds, and bamboo. They filter light into something soft and golden, beautiful on their own and even better layered with drapery.",
		tags: "Texture · organic · filtered light",
		href: "/natural-woven-shades.html",
	},
	{
		img: "art-hardware.jpg",
		alt: "A decorative metal drapery rod, bracket, and finial",
		title: "Decorative Hardware",
		body: "The jewelry of the window. The right rod, bracket, or finial pulls the whole look together, matched to the fabric, the room, and the way the drapery moves.",
		tags: "Bronze · brass · matte black",
		href: "/drapery-hardware.html",
	},
];

/* The rest of the service set. Nine cards in the grid above would bury the
   primary categories, so the remaining pages are surfaced as a compact link
   list underneath. Strings only, because this array is mapped (see the note
   on SERVICES_PRIMARY). */
const SERVICES_REST = [
	{ label: "Blackout Shades and Drapery", href: "/blackout.html" },
	{ label: "Smart-Home Window Treatments", href: "/smart-home-window-treatments.html" },
	{ label: "Specialty-Shaped Windows", href: "/specialty-shaped-windows.html" },
	{ label: "European Fabrics and Textiles", href: "/european-fabrics.html" },
	{ label: "Flame-Retardant Window Treatments", href: "/flame-retardant-drapery.html" },
	{ label: "Hospitality and Restaurant Projects", href: "/hospitality-window-treatments.html" },
	{ label: "Custom Home Textiles", href: "/custom-home-textiles.html" },
];

const STEPS = [
	{
		title: "We listen.",
		body: "Tell us about your home and how you live in it. Which rooms matter most. What made you start this project now. We take notes, and we don't interrupt.",
	},
	{
		title: "We learn the room.",
		body: "How is it used, and when? Morning coffee or evening TV? Kids, pets, work-from-home? A room's daily rhythm decides everything that follows.",
	},
	{
		title: "We find what's not working.",
		body: "Glare on the screen. A room too hot to use in the afternoon. Fading on the floor. Light that wakes you too early. These are the problems good treatments quietly solve.",
	},
	{
		title: "We observe and measure.",
		body: "Sun exposure, ceiling height, window dimensions, furniture, electrical, safety. We measure carefully and photograph everything, so the solution fits the reality of the space.",
	},
	{
		title: "We recommend.",
		body: "Only now do we talk products, always in terms of your goals. The problem comes first. The product follows.",
	},
	{
		title: "We tell you exactly what's next.",
		body: "Timeline, proposal, production, installation. You should never wonder who's responsible or when you'll hear from us. That clarity is part of the work.",
	},
];

const COLLECTIONS = [
	{
		title: "The Bed Collection",
		body: "European linen and luxury cotton bedding, with the decorative pillows and throws that make a room feel considered.",
	},
	{
		title: "The Bath Collection",
		body: "Towels and textiles that turn a daily routine into something a little better.",
	},
	{
		title: "The Outdoor Collection",
		body: "Custom furniture covers and outdoor textiles built for the climate they live in.",
	},
	{ title: "The Living Collection", body: "The finishing pieces that pull a home together." },
];

const FAQS: FaqEntry[] = [
	{
		q: "Do you have a showroom, or do you come to us?",
		a: "We come to you. Window treatments live in your rooms, in your light, so that's where every project should begin, and we bring the samples, fabric books, and measuring tools to you. We also offer virtual consultations and ship anywhere in the U.S. Just know that our remote projects still involve plenty of face-to-face time on video: we guide you through the measurements, walk you through fabric selection, and supervise the installation, every step of the way. We hold your hand from start to finish.",
	},
	{
		q: "What does a project cost?",
		a: "Custom work is priced by the project, because no two rooms are alike. After your consultation, you'll get a clear proposal with no surprises. We're not the cheapest option, and we're not trying to be. We're the option you don't have to redo.",
	},
	{
		q: "How long does it take?",
		a: "Because our work is custom and made to order, often in fabrics sourced from Europe, typical lead time runs about 6 to 8 weeks from order to installation. Some major holidays can add to that, and we'll always set a clear expectation at the time of order confirmation, then keep you updated the whole way.",
	},
	{
		q: "For motorized shades, do I need to hire my own electrician?",
		a: (
			<>
				No. We coordinate it through our licensed, insured electrical partner, <BalticLink />, on
				the same schedule as the rest of your project. You never have to find or schedule an
				electrician yourself.
			</>
		),
	},
	{
		q: "Do you work with my interior designer?",
		a: "Gladly. Designers are some of our most valued partners. We coordinate directly with your designer, follow their specifications, and protect their vision at every step.",
	},
	{
		q: "Is the consultation really free?",
		a: "Yes, and there's no obligation. You'll come away understanding what's possible in your space whether or not you decide to work with us.",
	},
];

export default function HomePage() {
	const root = usePageMotion<HTMLDivElement>();
	// Homepage only. Lazily pulls in GSAP once the browser is idle, so it stays
	// out of the initial chunk and ScrollTrigger is never registered on the
	// seven routes that do not use it.
	useHomeMotion(root);

	return (
		<div className="page-home" ref={root}>
			<PageSeo path="/index.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<SiteHeader />

			<main id="main">
				{/* ---------------- HERO ---------------- */}
				<section className="hero" id="home">
					<div className="inner" data-hero>
						<div className="kicker">Custom Window Treatments · South Florida</div>
						{/* Two block spans rather than a <br />, so the line break is authored in
						    the markup and the prerendered HTML already contains it. They once
						    existed so GSAP could settle the headline line by line; that stagger
						    was removed on client instruction and the spans stay purely for the
						    line break and the 560px text-wrap: balance rule. Nothing animates
						    them. The h1 still holds the whole sentence for assistive tech. */}
						<h1>
							<span className="hline">The light was always beautiful.</span>{" "}
							<span className="hline">Now the room is, too.</span>
						</h1>
						<p>
							Custom drapery and shades, made to measure in European fabrics and fitted to how you
							actually live. We start with a conversation about your home, never a catalog.
						</p>
						<div className="btn-row">
							<a className="btn btn-dark" href="#contact">
								Begin with a conversation
							</a>
							<Link className="btn btn-line" to="/estimate.html">
								Get a quick estimate
							</Link>
						</div>
						<div className="hero-art">
							{/* The wrapper and the frame used to carry three motions between them
							    (GSAP parallax on .hero-art, a 24s CSS breathing loop on
							    .hero-frame, a one-time GSAP reveal on the <img>). All three are
							    gone on client instruction: the only motion in the hero is the
							    video clip below. .hero-frame now exists solely for the max-width
							    (1280px since V2 HEROSIZE) and the edge feather mask. */}
							<div className="hero-frame">
								<img
									src="/assets/hero-1120.jpg"
									/* The full 1800px file was going to phones too, which made a
									   224 kB image the LCP element on a 390px viewport. */
									/* 1365w, not 1800w: the still is now the clean final artwork the
									   client supplied, which is 1365x768. Nothing is upscaled. */
									srcSet="/assets/hero-780.jpg 780w, /assets/hero-1120.jpg 1120w, /assets/hero.jpg 1365w"
									/* Tracks .hero-frame's max-width exactly. V2 HEROSIZE took the frame
									   from 860px to 1280px, so an 860px `sizes` would now UNDERSTATE the
									   box and let the browser serve a 1120w candidate into a 1280px slot,
									   i.e. an upscaled hero. Equally, an overstated value picks a
									   candidate larger than anything that renders. Keep the two in sync. */
									sizes="(max-width: 1280px) 100vw, 1280px"
									alt="Illustration of a South Florida living room with drapery, a boy using a shade remote, and a dog"
									width={1120}
									height={630}
									/* The LCP element. Preloaded in index.html and flagged high
									   priority so it is never queued behind the tiles below it. */
									fetchPriority="high"
									decoding="async"
								/>
								{/* V2 section 9. Mounted after idle, over the still, never under
								    reduced motion. The <img> above stays the LCP element. */}
								<HeroMotion poster="/assets/hero-poster-v3.jpg" />
								{/* The decorative 34s sunlight sweep that used to sit here was
								    removed with the rest of the hero motion. */}
							</div>
						</div>
					</div>
				</section>

				{/* ---------------- AT YOUR SERVICE ---------------- */}
				<section className="block" style={{ paddingTop: 22 }} id="service">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 26 }} data-reveal>
							<div className="kicker">At your service</div>
							<h2 className="big center">A calm, hands-on way to work.</h2>
						</div>
						{/* All four tiles are one uniform set: same image size and aspect
						    ratio, same alignment, same centred label, same feather, same
						    hover lift, and no chevron on any of them. */}
						<div className="pillars" data-reveal-group>
							{PILLARS.map((p) => {
								const inner = (
									<>
										{/* Below the fold on every screen size, and four of them at
										    ~75 kB each. Eager, they were downloading in parallel with
										    the hero and pushing the largest paint out on a throttled
										    connection. The 4/3 aspect-ratio in styles.css reserves the
										    box, so deferring them costs no layout shift. */}
										<img
											className="pimg"
											src={`/assets/${p.img}`}
											alt={p.alt}
											width={1000}
											height={750}
											loading="lazy"
											decoding="async"
										/>
										<h3>{p.title}</h3>
									</>
								);
								return p.href.startsWith("#") ? (
									<a className="pillar" href={p.href} key={p.title} data-reveal>
										{inner}
									</a>
								) : (
									<Link className="pillar" to={p.href} key={p.title} data-reveal>
										{inner}
									</Link>
								);
							})}
						</div>
					</div>
				</section>

				{/* ---------------- PROMISE ---------------- */}
				{/* V1.2 section 5. Copy is untouched. The closing line used to be a
				    second soft paragraph in the same centred column, where it read as an
				    afterthought. It is now a pull quote set off to the right of the
				    explanatory paragraph, which gives the section a rhythm without adding
				    imagery or animation. */}
				<section className="block">
					<div className="wrap">
						<div className="center narrow" data-reveal>
							<div className="kicker">The promise</div>
							<h2 className="big center">A beautiful home should also be a comfortable one.</h2>
						</div>
						<div className="promise-grid" data-reveal>
							<div className="body-text">
								<p>
									Window treatments do far more than dress a window. Done well, they soften
									the afternoon glare, keep a room from overheating, protect your floors and
									furniture from the sun, and let you sleep past sunrise. They make a space
									feel finished, and easier to live in.
								</p>
							</div>
							<p className="pull">
								That's the whole point of what we do. Everything else is detail.
							</p>
						</div>
					</div>
				</section>

				{/* ---------------- DIFFERENCE ---------------- */}
				<section className="block band" id="about">
					<div className="wrap two" data-reveal-group>
						<div data-reveal>
							<div className="kicker">Who we are</div>
							<h2 className="big">We start with the room, not the catalog.</h2>
						</div>
						<div className="body-text" data-reveal>
							<p>
								Studio Elpa began with a simple frustration: too many beautiful rooms are undone by
								the wrong window treatments. Glare on the television. A bedroom that fills with
								light at 6 a.m. Furniture fading in the Florida sun.
							</p>
							<p>
								So we work differently. We start by asking about the room, how you use it, when the
								sun comes in, what's been quietly bothering you for years. Only then do we talk
								about drapery, or shades, or motors. We are consultants first, product experts
								second, salespeople never.
							</p>
							{/* V1.2 section 6. Same sentence, same words, same order. What the
							    clients actually say was buried at the end of a dense paragraph, so
							    it is now a separate typographic element. This is the section's one
							    restrained entrance; the paragraphs above it are not animated. */}
							<p className="cq-lead">
								It's a slower way to work. It's also the reason our clients tell us,
							</p>
							<div className="client-quote" data-reveal>
								<p className="cq-said">
									<em>"You really listened,"</em>
								</p>
								<p className="cq-not">
									instead of <em>"You sold me something."</em>
								</p>
							</div>
							<p>
								<Link to="/founder.html">Read a note from our founder →</Link>
							</p>
						</div>
					</div>
					{/* V2 section 8. Two real people with real faces, each kept to a name,
					    a title, one line and a link to the full page. Both portraits are
					    real photographs the users supplied, at deliberately different
					    framings: Elvira's is a close face portrait, Aviva's a wider seated
					    one. object-fit: cover fits both to one box so they read as a set.
					    No stock, no stand-ins. */}
					<div className="wrap team" data-reveal>
						<div className="kicker">Who you'll work with</div>
						<div className="team-grid">
							<div className="team-card">
								<img
									className="team-photo"
									src="/assets/team-aviva.jpg"
									alt="Aviva Druyan, Founder and Creative Director of Studio Elpa"
									width={720}
									height={900}
									loading="lazy"
								/>
								<div className="team-text">
									<h3>Aviva Druyan</h3>
									<p className="team-role">Founder &amp; Creative Director</p>
									<p className="team-teaser">
										The vision, client experience, design direction, and the point of view behind
										Studio Elpa.
									</p>
									<p className="team-link">
										<Link to="/founder.html">Read more →</Link>
									</p>
								</div>
							</div>
							<div className="team-card">
								<img
									className="team-photo"
									src="/assets/team-elvira.jpg"
									alt="Elvira Vasiljeva, Creative Director of Home Textiles at Studio Elpa"
									width={900}
									height={1200}
									loading="lazy"
								/>
								<div className="team-text">
									<h3>Elvira Vasiljeva</h3>
									<p className="team-role">Creative Director, Home Textiles</p>
									<p className="team-teaser">
										The sourcing eye, textile relationships, European artisan network, and the
										person constantly finding what nobody else has yet.
									</p>
									<p className="team-link">
										<Link to="/meet-elvira.html">Read more →</Link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ---------------- SERVICES ---------------- */}
				<section className="block" id="services">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 44 }} data-reveal>
							<div className="kicker">What we do</div>
							<h2 className="big center">
								Complete custom window treatments, made to measure.
							</h2>
							<p className="soft">
								These are solutions, not a menu. The right choice for your room depends on how you
								live in it, which is exactly where every project starts.
							</p>
						</div>
						{/* Signature treatment, featured editorially. */}
						<div className="svc-feature" data-reveal>
							<div className="svc-feature-art">
								<img
									className="ph"
									src={`/assets/${SERVICE_SIGNATURE.img}`}
									alt={SERVICE_SIGNATURE.alt}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<div className="svc-feature-text">
								<div className="kicker">Our signature</div>
								<h3>{SERVICE_SIGNATURE.title}</h3>
								<p className="svc-sig">{SERVICE_SIGNATURE.sig}</p>
								<p>{SERVICE_SIGNATURE.body}</p>
								<div className="tags">{SERVICE_SIGNATURE.tags}</div>
								{/* Rendered once, so a Link inline here is safe. The mapped
								    cards below use an href string instead (see SERVICES_PRIMARY). */}
								<p className="svc-golink">
									<Link to="/motorized.html">See Motorized Shades →</Link>
								</p>
							</div>
						</div>

						{/* The other primary categories. One card since the V2 roller
						    consolidation, so the two-column grid collapses to a centered
						    single column and the card keeps its own proportions. */}
						<div
							className={SERVICES_PRIMARY.length === 1 ? "svc svc-solo" : "svc"}
							data-reveal-group
						>
							{SERVICES_PRIMARY.map((s) => (
								<div className="card" key={s.title} data-reveal>
									<img
										className="ph"
										src={`/assets/${s.img}`}
										alt={s.alt}
										loading="lazy"
										decoding="async"
									/>
									<div className="cb">
										<h3>{s.title}</h3>
										<p>{s.body}</p>
										<div className="tags">{s.tags}</div>
										{s.href ? (
											<p className="svc-golink">
												<Link to={s.href}>See {s.title} →</Link>
											</p>
										) : null}
									</div>
								</div>
							))}
						</div>

						{/* Quieter continuation. Every treatment stays one scroll away. */}
						<div className="svc-more-head">
							<h3>Explore all treatments</h3>
							<span className="svc-more-rule" aria-hidden="true" />
						</div>
						<div className="svc-more" data-reveal-group>
							{SERVICES_MORE.map((s) => (
								<div className="svc-item" key={s.title} data-reveal>
									<img
										className="ph"
										src={`/assets/${s.img}`}
										alt={s.alt}
										loading="lazy"
										decoding="async"
									/>
									<h4>{s.title}</h4>
									<p>{s.body}</p>
									<div className="tags">{s.tags}</div>
									{s.href ? (
										<p className="svc-golink">
											<Link to={s.href}>See {s.title} →</Link>
										</p>
									) : null}
								</div>
							))}
						</div>

						{/* Everything else we make, one line each. */}
						<div className="svc-rest" data-reveal>
							<h4>More from the studio</h4>
							<ul className="svc-rest-list">
								{SERVICES_REST.map((s) => (
									<li key={s.href}>
										<Link to={s.href}>{s.label}</Link>
									</li>
								))}
							</ul>
						</div>

						<p className="svc-close" data-reveal>
							Not sure what you need?{" "}
							<a href="#contact">
								Let's talk it through
								<span className="svc-go" aria-hidden="true" />
							</a>
						</p>
					</div>
				</section>

				{/* ---------------- ONE ROOF ---------------- */}
				{/* V1.2 section 8: one quiet reveal for the whole band, not two
				    staggered halves, and it fires before the band reaches the
				    fold (data-reveal="early") so the dark slab is never seen
				    empty on a fast scroll or an anchor jump. */}
				<section className="block band dark oneroof">
					<div className="wrap two" data-reveal="early">
						<div>
							<div className="kicker">One roof, no runaround</div>
							<h2 className="big">
								One team, from the first question to the last shade raised on your schedule.
							</h2>
						</div>
						<div className="body-text">
							<p>
								Custom window treatments usually mean juggling people: a salesperson, an installer
								you've never met, and, for motorized shades, an electrician you have to find and
								schedule yourself. Something always falls through the cracks.
							</p>
							<p>
								We keep it all coordinated under one roof. Our own installers hang every treatment,
								and the electrical that motorization needs is handled by our licensed, insured
								electrical partner, <BalticLink />, scheduled and managed by us. No chasing a
								third party,
								no <em>"that's not our department,"</em> and no gap between the person who designed
								your project and the people who finish it. One point of contact, from the first
								conversation to the last shade raised on your schedule.
							</p>
						</div>
					</div>
				</section>

				{/* ---------------- PROCESS ---------------- */}
				<section className="block" id="process">
					<div className="wrap narrow center" data-reveal>
						<div className="kicker">How we work</div>
						<h2 className="big center">The Discovery Consultation.</h2>
						<div className="body-text">
							<p>
								You can't recommend a solution before you understand the problem, and every room
								has its own. So we begin every project the same way: by listening. It's free, with
								no obligation to go further.
							</p>
						</div>
					</div>
					<div className="wrap" style={{ marginTop: 20 }}>
						{/* V1.2 section 9: one fine vertical line connecting the six
						    steps. The track is plain CSS and is fully drawn by
						    default, so reduced motion, a failed GSAP chunk and
						    no-JS all show the complete line. GSAP only ever draws
						    it back from scaleY(0), never hides copy. */}
						<div className="steps" data-reveal-group data-process>
							<div className="process-line" aria-hidden="true">
								<span className="process-line-fill" data-process-progress />
							</div>
							{STEPS.map((s, i) => (
								<div className="step-row" key={s.title} data-reveal data-step>
									<div className="n">{i + 1}</div>
									<div>
										<h3>{s.title}</h3>
										<p>{s.body}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ---------------- DESIGNERS ---------------- */}
				<section className="block band accent trade" id="designers">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 36 }} data-reveal>
							<div className="kicker">For designers, architects &amp; builders</div>
							<h2 className="big center">The execution behind your vision.</h2>
							<p className="soft">
								You've already designed the room. We bring the window treatments to life exactly as
								you imagined, on time, on spec, and without ever getting between you and your
								client. The creative vision is yours. Ours is to make it real.
							</p>
						</div>
						<div className="trade-cols" data-reveal-group>
							<div className="trade-col" data-reveal="x">
								<div className="kicker">What we bring</div>
								{/* The detail text is wrapped in .spec-detail on purpose. `.trade
								    .spec-list li` is `display: grid`, and a grid container blockifies
								    every inline-level child into its own grid item, so an inline <a>
								    (BalticLink, item 03) was being auto-placed into the 34px numeral
								    column and colliding with the text either side of it. Wrapping the
								    whole run in one element keeps it a single grid item. Applied to all
								    four rows so the next link added here cannot reintroduce the bug. */}
								<ul className="clean spec-list">
									<li>
										<b>Technical expertise.</b>
										<span className="spec-detail">
											Solar exposure, stack-back, light control, fabric behavior, and the details
											that make or break a spec.
										</span>
									</li>
									<li>
										<b>Our own crews.</b>
										<span className="spec-detail">
											Precise measuring and installation by people who do this every day, never
											subcontracted.
										</span>
									</li>
									<li>
										<b>Electrical, handled for you.</b>
										<span className="spec-detail">
											The electrical is handled by our licensed, insured electrical partner,{" "}
											<BalticLink />, so motorized projects don't stall while a client hunts for
											an electrician; we coordinate it for you.
										</span>
									</li>
									<li>
										<b>Proactive communication.</b>
										<span className="spec-detail">
											You'll always know where things stand.
										</span>
									</li>
								</ul>
							</div>
							<div className="trade-col" data-reveal="x">
								<div className="kicker">How we work with you</div>
								<div className="body-text">
									<p>
										We can work from your specification package or help you build one. We
										coordinate directly with you or through your client, whichever you prefer. We
										never bypass you, never contradict you in front of a client, and if we ever
										spot a concern, we raise it with you privately.
									</p>
									<p>
										Your relationship with your client is yours. We're here to protect it. We
										measure our success by one thing: whether working with us made your job
										easier.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ---------------- PROJECTS ---------------- */}
				<section className="block" id="projects">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 36 }} data-reveal>
							<div className="kicker">Selected projects</div>
							<h2 className="big center">A few rooms we're proud of.</h2>
							<p className="soft">
								Every project starts as a conversation and ends as a room someone loves living in.
								Here's one of them.
							</p>
						</div>
						<div className="center narrow project-head" style={{ margin: "8px auto 0" }} data-reveal>
							<div className="kicker">Before &amp; after</div>
							<h3>A bare arched window, finally dressed.</h3>
						</div>
						<BeforeAfter />
						<p className="ba-cap soft" data-reveal>
							The same dining room. A tall arched window left almost bare, given full custom sheer
							drapery that softens the afternoon light and finally frames the architecture, without
							ever hiding the view.
						</p>
					</div>
				</section>

				{/* ---------------- WHAT'S NEXT ---------------- */}
				<section className="block band dark" id="next">
					<div className="wrap">
						<div className="narrow" style={{ marginBottom: 36 }} data-reveal>
							<div className="kicker">The bigger picture</div>
							<h2 className="big">Window treatments are where we begin.</h2>
							<p>
								Studio Elpa started with windows because that's where beauty and comfort meet most
								visibly. Our vision is bigger: a complete home textiles house, thoughtfully
								assembled one collection at a time, each held to the same standard as our window
								work.
							</p>
						</div>
						{/* V1.2 section 12: an editorial manifesto list, not an expansion grid.
						    One reveal on the whole list rather than four staggered items, so
						    there is no four-item entrance sequence. */}
						<div className="collections manifesto" data-reveal>
							{COLLECTIONS.map((c) => (
								<div className="collection" key={c.title}>
									<h3>{c.title}</h3>
									<p>{c.body}</p>
								</div>
							))}
						</div>
						<p style={{ marginTop: 26 }} data-reveal>
							Want to know when a collection arrives? We'll only reach out when there's something
							genuinely worth sharing.{" "}
							<a href="#contact" style={{ color: "var(--dark-kick)" }}>
								Keep me posted →
							</a>
						</p>
					</div>
				</section>

				{/* ---------------- JOURNAL ---------------- */}
				<section className="block" id="journal">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 36 }} data-reveal>
							<div className="kicker">The Journal</div>
							<h2 className="big center">Notes on light, fabric, and living well at home.</h2>
							<p className="soft">
								We spend our days thinking about how rooms work. This is where we share some of it.
							</p>
						</div>
						{/* V1.2 section 13: only the first story is published. The other two are
						    marked "Coming soon" and stripped of link-like styling (.post-soon) so
						    an unavailable article never reads as clickable. One reveal on the
						    container replaces the three-item stagger. */}
						<div className="journal" data-reveal>
							<Link className="post" to="/journal-blackout.html">
								<div className="tag">Light</div>
								<h3>The case for real darkness</h3>
								<p>
									Why blackout matters for real, restful sleep, and how motorization quietly takes
									the worry off your plate.
								</p>
								<span className="read">Read the story →</span>
							</Link>
							<div className="post post-soon">
								<div className="tag">Comfort</div>
								<h3>Why your beautiful room has a glare problem</h3>
								<p>
									The quiet fix that keeps the view and loses the squint, and protects your floors
									and furniture while it's at it.
								</p>
								<span className="soon">Coming soon</span>
							</div>
							<Link className="post" to="/drapery-headers.html">
								<div className="tag">Drapery</div>
								<h3>Ripple fold, pinch pleat, or grommet?</h3>
								<p>
									A plain-English guide to drapery headers, and how the one you choose changes the
									whole feel of a room.
								</p>
								<span className="read">Read the guide →</span>
							</Link>
						</div>
						<div className="center soft" style={{ marginTop: 26, fontSize: 14 }} data-reveal>
							More articles coming soon.
						</div>
					</div>
				</section>

				{/* ---------------- CONTACT ---------------- */}
				<section className="block band" id="contact">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 44 }} data-reveal>
							<div className="kicker">Let's begin</div>
							<h2 className="big center">Tell us about the room.</h2>
							<p className="soft">
								Every project here starts the same way, with a conversation, not a commitment. Tell
								us a little about your home and what you're hoping to improve, and we'll take it
								from there. You'll leave the first meeting knowing exactly what's possible, whether
								or not you work with us.
							</p>
						</div>
						{/* V1.2 section 14: the form and the direct-contact block reveal together as
						    one unit. Individual fields are never animated (ContactForm carries no
						    data-reveal of its own). */}
						<div className="contact-grid" data-reveal>
							<div>
								<ContactForm sourcePage="/index.html" />
							</div>
							<div className="contact-side">
								<h3>Prefer to talk?</h3>
								<a
									className="btn btn-dark"
									href={CONTACT.booking}
									target="_blank"
									rel="noopener"
									style={{
										display: "block",
										textAlign: "center",
										width: "100%",
										marginBottom: 18,
									}}
								>
									Book a 30-minute call
								</a>
								<div className="row">
									<span className="l">Call</span>
									<a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
								</div>
								<div className="row">
									<span className="l">Email</span>
									<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
								</div>
								<div className="row">
									<span className="l">Serving</span>South Florida
								</div>
								<div className="row">
									<span className="l">Response</span>Within one business day
								</div>
								{/* V1.2 section 14: "what happens next" as a concise three-step
								    sequence instead of one run-on paragraph. The wording of the three
								    actions is the original copy, split. */}
								<div className="next-lead">Here's what happens next</div>
								<ol className="next-steps">
									<li>We get back to you within one business day.</li>
									<li>We ask a few things to understand your project.</li>
									<li>We set up a time to visit.</li>
								</ol>
								<p className="soft next-note">
									No pressure, no obligation, just the start of getting it right.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* ---------------- FAQ ---------------- */}
				<section className="block band accent">
					<div className="wrap narrow">
						<div className="center" data-reveal>
							<div className="kicker">Good questions</div>
							<h2 className="big center">The things people usually want to know.</h2>
						</div>
						<Faq entries={FAQS} />
					</div>
				</section>

				{/* V1.2 section 14: the final "Tell us about the room." callout is removed.
				    Its heading was identical to the contact section's own h2 higher up the
				    same page and its button only scrolled back to that section, so it
				    repeated the conversion request without adding a step. The one piece of
				    information it carried that was not stated elsewhere ("You'll leave the
				    first meeting knowing exactly what's possible, whether or not you work
				    with us.") has been folded into the contact intro paragraph. The
				    .callout styles stay: drapery, motorized and blackout still use them. */}
			</main>

			<SiteFooter />
		</div>
	);
}
