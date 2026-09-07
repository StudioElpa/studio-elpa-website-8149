/**
 * The ONLY module in the app that imports GSAP.
 *
 * It is never imported statically. useHomeMotion() reaches it through a
 * dynamic import() after the homepage's critical content has painted, which
 * is what keeps GSAP and ScrollTrigger out of the initial JS chunk. Import it
 * eagerly anywhere and that benefit disappears, so don't.
 *
 * Per brief section 1, GSAP earns its place in exactly three experiences:
 *   1. Hero gentle illustration movement  (here)
 *   2. Discovery-process progress         (here, when the section exists)
 *   3. Projects before-and-after          (interaction-driven, its own module)
 * Everything else uses CSS transitions or the Intersection Observer reveal in
 * hooks/use-motion.ts.
 *
 * Deliberately NOT animated here: the hero heading and hero paragraph. They
 * are the LCP candidates, and the brief forbids delaying them. They paint in
 * their final state and are never touched by JS.
 */

/** Cleanup handle returned by startHomeMotion. */
export type StopMotion = () => void;

export async function startHomeMotion(root: HTMLElement): Promise<StopMotion> {
	// Both plugins arrive in one lazy chunk.
	const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
		import("gsap"),
		import("gsap/ScrollTrigger"),
	]);

	// Registered here rather than at module scope, so ScrollTrigger is only ever
	// registered on a route that actually uses it (brief section 1).
	gsap.registerPlugin(ScrollTrigger);

	const ctx = gsap.context(() => {
		const heroArt = root.querySelector<HTMLElement>("[data-hero-art]");
		const heroImg = heroArt?.querySelector<HTMLElement>("img");

		// Two separate targets on purpose: the reveal animates the <img> and the
		// drift animates its wrapper, so the two transforms never fight over the
		// same matrix.
		// ---- headline settles line by line (brief section 3) ----
		// The brief allows the headline to settle "once it is already rendered",
		// and section 1 forbids delaying or concealing it. Both hold here because
		// this is TRANSFORM ONLY: opacity is never touched, so the h1 is fully
		// legible at every frame, including before this module has even loaded.
		// 8px is deliberately tiny; anything larger stops reading as a settle.
		const heroLines = root.querySelectorAll<HTMLElement>("[data-hero] h1 .hline");
		if (heroLines.length > 0) {
			gsap.from(heroLines, {
				y: 8,
				duration: 0.65,
				ease: "power2.out",
				stagger: 0.08,
				// Hand the element back to CSS with no inline transform left behind.
				clearProps: "transform",
			});
		}

		if (heroImg) {
			// "Resolves gently from a soft wash into final linework" (brief section
			// 3). The wash is blur plus desaturation, so what resolves is the FOCUS
			// of the drawing rather than a zoom: the pencil lines gather out of a
			// soft bloom. Scale is deliberately not animated any more, so nothing
			// here reads as a zoom and the only scale on the hero is the CSS
			// breathing loop on .hero-frame.
			//
			// The end state repeats .hero-art img's CSS filter verbatim. GSAP
			// animating `filter` replaces the whole property, so omitting the base
			// filter would make the illustration snap to full saturation on the
			// last frame. clearProps then returns ownership to the stylesheet.
			const BASE_FILTER = "sepia(0.3) saturate(0.86) brightness(1.03) contrast(0.93)";
			gsap.fromTo(
				heroImg,
				{
					// Starts at 0.6, never 0. The illustration is a large painted area,
					// so starting fully transparent would read as a flash and risk
					// making the fade itself the LCP moment.
					opacity: 0.6,
					filter: `blur(5px) sepia(0.42) saturate(0.6) brightness(1.08) contrast(0.72)`,
				},
				{
					opacity: 1,
					filter: BASE_FILTER,
					duration: 1.2,
					ease: "power2.out",
					clearProps: "opacity,filter",
				},
			);
		}

		if (heroArt) {
			// Drifts down as the page scrolls up, so it reads as travelling slower
			// than the copy above it. Transform only, so it cannot affect paint.
			gsap.fromTo(
				heroArt,
				{ yPercent: 0 },
				{
					// Brief section 3 caps the scroll drift at 5-7%. 6% sits inside the
					// band rather than exactly on the ceiling.
					yPercent: 6,
					ease: "none",
					scrollTrigger: {
						trigger: heroArt,
						start: "top 70%",
						end: "bottom top",
						scrub: 0.6,
					},
				},
			);
		}

		// ---- discovery process progress line (brief section 9) ----
		// Draws only as far as the reader has travelled. Scale, not height, so it
		// stays on the compositor. The line is decorative: the steps themselves
		// are plain readable copy with no motion dependency.
		const progress = root.querySelector<HTMLElement>("[data-process-progress]");
		const track = progress?.closest<HTMLElement>("[data-process]");
		if (progress && track) {
			gsap.fromTo(
				progress,
				{ scaleY: 0 },
				{
					scaleY: 1,
					ease: "none",
					transformOrigin: "top center",
					scrollTrigger: {
						trigger: track,
						start: "top 75%",
						end: "bottom 60%",
						scrub: 0.5,
					},
				},
			);
		}
	}, root);

	// Fonts and lazy images change layout after first paint; recompute.
	const refresh = () => ScrollTrigger.refresh();
	window.addEventListener("resize", refresh);
	if (document.fonts?.ready) void document.fonts.ready.then(refresh);

	return () => {
		window.removeEventListener("resize", refresh);
		ctx.revert();
	};
}
