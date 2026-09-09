import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Motion contract for this site (V1 brief section 7, tightened by V1.2
 * section 1):
 *
 * - This module imports NO animation library. It is loaded on every route, so
 *   anything imported here lands in the initial JS chunk. GSAP lives in
 *   motion/home-gsap.ts and is only ever reached through a dynamic import.
 * - Nothing is hidden by CSS on its own. Every reveal is driven by a class
 *   that JavaScript adds at runtime, so if JS never runs, or GSAP fails to
 *   load, or reduced motion is on, the copy is already in its final readable
 *   state. The prerender step depends on this: it snapshots with reduced
 *   motion emulated, so no hidden state is ever baked into the static HTML.
 * - NOTHING in the hero is animated: heading, subcopy, CTAs and illustration
 *   all render in place with no entrance animation and no parallax, by client
 *   instruction. The heading is the LCP candidate and the brief forbids
 *   delaying it. The hero's only motion is the video clip in
 *   components/hero-motion.tsx.
 * - Calm values only: 0.5-0.8s, ease-out, ~0.07s stagger, travel under 24px.
 * - play-once. No scrub-driven text, no reverse-on-scroll-up jitter.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

function prefersReduced() {
	return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

/** Class names must match the reveal block in styles.css. */
const HIDDEN = "reveal-init";
const SHOWN = "reveal-in";

/** Matches the 0.07s stagger in the old GSAP grouped reveal. */
const STAGGER_MS = 70;
/** Cap so a large grid never leaves the last item waiting. */
const MAX_STAGGER_STEPS = 6;

/**
 * Attach to a page root. Reveals [data-reveal] elements on scroll using an
 * Intersection Observer and CSS transitions. No animation library involved.
 *
 * Elements sharing a [data-reveal-group] ancestor arrive together as a
 * staggered set, so a grid reads as a grid rather than item by item.
 *
 * Runs on every route. Anything heavier belongs in useHomeMotion.
 */
export function usePageMotion<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T | null>(null);

	// useLayoutEffect, not useEffect: the hidden class lands before React's own
	// paint. That alone is not enough on a prerendered page, which is why
	// anything already on screen is skipped outright below.
	useLayoutEffect(() => {
		const root = ref.current;
		if (!root || prefersReduced()) return;

		const all = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
		if (!all.length) return;

		// Anything already inside the first viewport is left alone.
		//
		// The pages are prerendered, so the static HTML paints its final copy
		// around 150ms, while hydration only reaches this hook around 580ms.
		// Hiding an element that the reader can already see produced a measured
		// 630ms blink on six routes. useLayoutEffect cannot prevent that: it is
		// early relative to React, not relative to the prerendered paint.
		//
		// Skipping them is also the calmer reading of the brief. Motion belongs
		// to the act of scrolling, so the first screen simply arrives.
		const inFirstView = (el: HTMLElement) => {
			const r = el.getBoundingClientRect();
			return r.top < window.innerHeight && r.bottom > 0;
		};
		const items = all.filter((el) => !inFirstView(el));
		if (!items.length) return;

		// Stagger index is per group, so each group counts from zero. Only the
		// elements that will actually animate get a delay, and the index counts
		// within that subset, so a group straddling the fold still starts its
		// stagger at zero instead of inheriting the offset of skipped siblings.
		const animated = new Set(items);
		for (const group of root.querySelectorAll<HTMLElement>("[data-reveal-group]")) {
			const kids = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
				(el) => animated.has(el),
			);
			kids.forEach((el, i) => {
				el.style.transitionDelay = `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
			});
		}

		for (const el of items) el.classList.add(HIDDEN);

		const reveal = (el: HTMLElement) => {
			el.classList.add(SHOWN);
			// Once shown, drop the delay so a later resize or repaint cannot
			// re-apply it, and let the element go back to being plain markup.
			const done = () => {
				el.style.transitionDelay = "";
				el.classList.remove(HIDDEN, SHOWN);
			};
			el.addEventListener("transitionend", done, { once: true });
		};

		// Still waiting to be revealed. Emptied as elements arrive, and used by
		// the scroll sweep below to know when it can stop listening.
		const pending = new Set(items);

		/**
		 * Put an element straight into its final state, with no transition.
		 * Used for content the reader has already scrolled past, where an
		 * entrance would animate something nobody is looking at, and where
		 * leaving it hidden would mean the copy never appears at all.
		 */
		const finalize = (el: HTMLElement) => {
			el.style.transitionDelay = "";
			el.classList.remove(HIDDEN, SHOWN);
		};

		// Two triggers, one reveal.
		//
		// Default: fires as the element's top edge arrives, matching the old
		// "top 82%" trigger. Motion belongs to the act of scrolling.
		//
		// Early, opted into with data-reveal="early": fires a fifth of a
		// viewport BEFORE the element reaches the fold. V1.2 section 8 asks for
		// this on the dark "one roof" band. A full-bleed dark section whose copy
		// has not arrived yet reads as an empty slab, and on a fast scroll or an
		// anchor jump that slab is the entire screen. Revealing ahead of the
		// fold means the band is never seen empty.
		const observers: IntersectionObserver[] = [];

		const makeObserver = (rootMargin: string) => {
			const obs = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) continue;
						const el = entry.target as HTMLElement;
						// play once, and it only ever sits in one observer
						obs.unobserve(el);
						pending.delete(el);
						reveal(el);
					}
				},
				{ rootMargin, threshold: 0.01 },
			);
			observers.push(obs);
			return obs;
		};

		const io = makeObserver("0px 0px -18% 0px");
		const ioEarly = makeObserver("0px 0px 20% 0px");

		for (const el of items) {
			(el.dataset.reveal === "early" ? ioEarly : io).observe(el);
		}

		// Safety net for fast scrolling.
		//
		// An Intersection Observer only calls back when the intersection ratio
		// crosses a threshold. On a hard flick of the wheel an element can go
		// from below the viewport to above it between two frames, never once
		// measured as intersecting, so no callback is ever delivered and the
		// element stays at opacity 0 permanently. Measured on this homepage: a
		// fast flick left 15 blocks of copy invisible on desktop and 17 on
		// mobile, including whole section headings.
		//
		// So on every scroll, sweep anything still pending that is now entirely
		// above the viewport and finalize it. The listener removes itself once
		// nothing is pending, so it costs nothing for the rest of the session.
		let ticking = false;
		const sweep = () => {
			ticking = false;
			for (const el of pending) {
				if (el.getBoundingClientRect().bottom >= 0) continue;
				// The element sits in exactly one observer, but the sweep does
				// not know which, so drop it from both.
				for (const obs of observers) obs.unobserve(el);
				pending.delete(el);
				finalize(el);
			}
			if (!pending.size) window.removeEventListener("scroll", onScroll);
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(sweep);
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			for (const obs of observers) obs.disconnect();
			window.removeEventListener("scroll", onScroll);
			// Leave the DOM in its final, visible state.
			for (const el of items) finalize(el);
		};
	}, []);

	return ref;
}

/**
 * Homepage-only GSAP. Loads motion/home-gsap.ts through a dynamic import once
 * the browser is idle, i.e. after the critical hero content has painted, so
 * GSAP and ScrollTrigger never sit in the initial chunk and never delay LCP.
 *
 * Failure is non-fatal by design: if the chunk 404s or the network drops, the
 * page keeps its fully readable, un-animated state. Nothing is gated on this.
 *
 * Pass the same ref returned by usePageMotion.
 */
export function useHomeMotion(ref: React.RefObject<HTMLElement | null>) {
	// useEffect, not useLayoutEffect: this must never block paint.
	useEffect(() => {
		const root = ref.current;
		if (!root || prefersReduced()) return;

		let stop: (() => void) | undefined;
		let cancelled = false;

		const start = () => {
			void import("../motion/home-gsap")
				.then(({ startHomeMotion }) => startHomeMotion(root))
				.then((s) => {
					// The effect may have torn down while the chunk was in flight.
					if (cancelled) s();
					else stop = s;
				})
				.catch(() => {
					// Deliberately silent. Everything is already readable.
				});
		};

		// requestIdleCallback keeps the fetch off the critical path. Safari has
		// no rIC, hence the timeout fallback.
		const ric = window.requestIdleCallback;
		const handle = ric
			? ric(start, { timeout: 2000 })
			: window.setTimeout(start, 200);

		return () => {
			cancelled = true;
			if (ric && window.cancelIdleCallback) window.cancelIdleCallback(handle as number);
			else window.clearTimeout(handle as number);
			stop?.();
		};
	}, [ref]);
}

/** True once the page has scrolled past `after` px — drives header.condensed. */
export function useCondensedHeader(after = 60) {
	const [condensed, setCondensed] = useState(false);

	useLayoutEffect(() => {
		const onScroll = () => setCondensed(window.scrollY > after);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [after]);

	return condensed;
}

/**
 * Highlights the nav link for whichever section owns the middle of the
 * viewport. Ported from the original site's IntersectionObserver scrollspy.
 */
export function useScrollSpy(ids: string[]) {
	const [active, setActive] = useState<string | null>(null);

	useLayoutEffect(() => {
		const els = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);
		if (!els.length) return;

		const spy = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActive(entry.target.id);
				}
			},
			{ rootMargin: "-45% 0px -50% 0px" },
		);

		for (const el of els) spy.observe(el);
		return () => spy.disconnect();
	}, [ids]);

	return active;
}
