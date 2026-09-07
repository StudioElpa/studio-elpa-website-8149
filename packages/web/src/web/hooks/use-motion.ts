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
 * - The hero heading and hero copy are never animated. They are the LCP
 *   candidates and the brief forbids delaying them.
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

	// useLayoutEffect, not useEffect: the hidden class is applied before the
	// browser paints, so content never flashes in and then hides itself.
	useLayoutEffect(() => {
		const root = ref.current;
		if (!root || prefersReduced()) return;

		const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
		if (!items.length) return;

		// Stagger index is per group, so each group counts from zero.
		for (const group of root.querySelectorAll<HTMLElement>("[data-reveal-group]")) {
			const kids = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
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

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const el = entry.target as HTMLElement;
					io.unobserve(el); // play once
					reveal(el);
				}
			},
			// Fires a little before the element's top edge arrives, matching the
			// old "top 82%" trigger.
			{ rootMargin: "0px 0px -18% 0px", threshold: 0.01 },
		);

		for (const el of items) io.observe(el);

		return () => {
			io.disconnect();
			// Leave the DOM in its final, visible state.
			for (const el of items) {
				el.style.transitionDelay = "";
				el.classList.remove(HIDDEN, SHOWN);
			}
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
