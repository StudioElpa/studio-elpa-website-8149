/**
 * The ONLY module in the app that imports GSAP.
 *
 * It is never imported statically. useHomeMotion() reaches it through a
 * dynamic import() after the homepage's critical content has painted, which
 * is what keeps GSAP and ScrollTrigger out of the initial JS chunk. Import it
 * eagerly anywhere and that benefit disappears, so don't.
 *
 * Per brief section 1, GSAP earned its place in three experiences. Two remain:
 *   1. Discovery-process progress  (here)
 *   2. Projects before-and-after   (interaction-driven, its own module)
 * Everything else uses CSS transitions or the Intersection Observer reveal in
 * hooks/use-motion.ts.
 *
 * THE HERO IS NOW ENTIRELY OUTSIDE THIS MODULE, by client instruction: no
 * entrance animation, no headline stagger, no fade or rise on load, and no
 * scroll parallax. The headline, subcopy, CTAs and illustration all render in
 * place immediately and are never touched by JS. The only motion in the hero
 * is the <video> clip in components/hero-motion.tsx. Do not reintroduce a
 * hero tween here.
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
		// The hero is deliberately untouched: no entrance tween, no headline
		// stagger, no illustration reveal and no scroll parallax (see the module
		// note above). Nothing here may query [data-hero] or [data-hero-art].

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

		// ---- active step emphasis (brief section 9) ----
		// toggleClass only. The class adds emphasis to the step the reader is on
		// (see .step-row.is-active in styles.css); it never removes emphasis
		// from the others, so forthcoming steps read as normal copy rather than
		// disabled content, and every step is fully readable from the start with
		// or without this running. No pinning, no scroll hijacking.
		if (track) {
			for (const step of track.querySelectorAll<HTMLElement>("[data-step]")) {
				ScrollTrigger.create({
					trigger: step,
					// The rows tile contiguously, so a band of "row straddles the
					// viewport midline" makes exactly one step active at a time.
					// A wider band (60%/40%) lit two adjacent steps at once.
					start: "top 50%",
					end: "bottom 50%",
					toggleClass: { targets: step, className: "is-active" },
				});
			}
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
