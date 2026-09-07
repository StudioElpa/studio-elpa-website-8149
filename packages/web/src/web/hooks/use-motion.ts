import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion contract for this site (brief section 7):
 *
 * - Nothing is hidden by CSS. Every reveal animates *from* a hidden state
 *   inside useLayoutEffect, so if JS never runs, or reduced motion is on,
 *   the copy is already in its final, readable state. Hero text is never
 *   gated behind an animation.
 * - Calm values only: 0.5-0.8s, power2/power3 out, 0.06-0.1s stagger,
 *   travel under 24px, parallax a few percent.
 * - play-once. No scrub-driven text, no reverse-on-scroll-up jitter.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

function prefersReduced() {
	return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

/**
 * Attach to a page root. Animates, in order:
 *   [data-hero]      children, on load, as one orchestrated intro
 *   [data-reveal]    on scroll, grouped by their [data-reveal-group] ancestor
 *   [data-parallax]  a few percent of drift while the section passes
 */
export function usePageMotion<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T | null>(null);

	useLayoutEffect(() => {
		const root = ref.current;
		if (!root || prefersReduced()) return;

		const ctx = gsap.context(() => {
			// ---- hero intro: one timeline, staggered, runs immediately ----
			// The illustration is excluded: it is the LCP element, so it gets its
			// own reveal below that never starts from opacity 0.
			const heroItems = gsap.utils.toArray<HTMLElement>(
				"[data-hero] > *:not([data-hero-art])",
			);
			if (heroItems.length) {
				gsap.from(heroItems, {
					opacity: 0,
					y: 16,
					duration: 0.75,
					ease: "power3.out",
					stagger: 0.08,
					clearProps: "opacity,transform",
				});
			}

			// ---- header nav: staggered arrival, top-down ----
			const navItems = gsap.utils.toArray<HTMLElement>("[data-nav] > *");
			if (navItems.length) {
				gsap.from(navItems, {
					opacity: 0,
					y: -6,
					duration: 0.5,
					ease: "power2.out",
					stagger: 0.06,
					delay: 0.1,
					clearProps: "opacity,transform",
				});
			}

			// ---- hero illustration: soft scale-and-fade in, then slow drift ----
			// Two separate targets on purpose. The load reveal animates the <img>,
			// the scroll parallax animates its wrapper, so the two transforms never
			// fight over the same matrix. The reveal starts at 0.55 opacity rather
			// than 0 so the LCP element is substantially painted on frame one.
			const heroArt = root.querySelector<HTMLElement>("[data-hero-art]");
			const heroImg = heroArt?.querySelector<HTMLElement>("img");

			if (heroImg) {
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
				// Drifts down as the page scrolls up, so it reads as travelling
				// slower than the copy above it. Transform only, so it cannot
				// affect paint timing.
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

			// ---- scroll reveals ----
			// Elements sharing a [data-reveal-group] parent animate together as a
			// staggered set, so a grid arrives as a grid instead of item by item.
			const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
			const grouped = new Set<HTMLElement>();

			for (const group of groups) {
				const items = gsap.utils.toArray<HTMLElement>(group.querySelectorAll("[data-reveal]"));
				if (!items.length) continue;
				for (const item of items) grouped.add(item);

				gsap.from(items, {
					opacity: 0,
					y: 20,
					duration: 0.7,
					ease: "power2.out",
					stagger: 0.07,
					clearProps: "opacity,transform",
					scrollTrigger: {
						trigger: group,
						start: "top 82%",
						toggleActions: "play none none none",
					},
				});
			}

			const singles = gsap.utils
				.toArray<HTMLElement>("[data-reveal]")
				.filter((el) => !grouped.has(el));

			for (const el of singles) {
				gsap.from(el, {
					opacity: 0,
					y: 20,
					duration: 0.7,
					ease: "power2.out",
					clearProps: "opacity,transform",
					scrollTrigger: {
						trigger: el,
						start: "top 85%",
						toggleActions: "play none none none",
					},
				});
			}

			// ---- restrained parallax on photography ----
			const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");
			for (const el of parallax) {
				const amount = Number(el.dataset.parallax) || 4;
				gsap.fromTo(
					el,
					{ yPercent: -amount / 2 },
					{
						yPercent: amount / 2,
						ease: "none",
						scrollTrigger: {
							trigger: el,
							start: "top bottom",
							end: "bottom top",
							scrub: true,
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
	}, []);

	return ref;
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
