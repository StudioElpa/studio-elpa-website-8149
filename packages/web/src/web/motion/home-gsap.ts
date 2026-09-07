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
		if (heroImg) {
			// Starts at 0.55, never 0. The illustration is a large painted area, so
			// starting from fully transparent would both read as a flash and risk
			// making the fade itself the LCP moment.
			gsap.fromTo(
				heroImg,
				{ opacity: 0.55, scale: 1.035 },
				{
					opacity: 1,
					scale: 1,
					duration: 1.1,
					ease: "power2.out",
					clearProps: "opacity,transform",
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
					yPercent: 7,
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
