import { useEffect, useState } from "react";

/**
 * V2 section 9: the hero motion clip, layered over the still illustration.
 *
 * The still stays the LCP element. It is preloaded in index.html, flagged high
 * priority, and paints exactly as it did in V1; the video is mounted only after
 * the page is idle and only fades in once the browser says it can play. Nothing
 * about the first paint changes, which is the whole point of "must not delay
 * LCP" in the brief.
 *
 * Reduced motion is a real no-op, not a shortened animation: the <video> is
 * never mounted at all, so the still is what the visitor sees. That also keeps
 * the prerendered HTML clean, since prerender.py captures every route with
 * `prefers-reduced-motion: reduce`.
 *
 * Two encodes from one master: H.264 MP4 (universal) and VP9 WebM (smaller
 * where it is supported). The source clip was HEVC with a music track, which no
 * mainstream browser plays inline; both encodes are silent by design as well as
 * by the muted attribute.
 */

const MP4 = "/assets/hero-motion.mp4";
const WEBM = "/assets/hero-motion.webm";

interface HeroMotionProps {
	/** The still shown until the clip is ready. Same file as the hero <img>. */
	poster: string;
}

export function HeroMotion({ poster }: HeroMotionProps) {
	const [mounted, setMounted] = useState(false);
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (query.matches) return;

		let cancelled = false;
		const start = () => {
			if (!cancelled) setMounted(true);
		};

		// requestIdleCallback keeps the decode off the critical path. Safari has
		// no rIC, so it gets a timeout instead of nothing.
		const idle = window.requestIdleCallback;
		const handle = idle ? idle(start, { timeout: 3000 }) : window.setTimeout(start, 1200);

		return () => {
			cancelled = true;
			if (idle && window.cancelIdleCallback) window.cancelIdleCallback(handle as number);
			else window.clearTimeout(handle as number);
		};
	}, []);

	if (!mounted) return null;

	return (
		// biome-ignore lint/a11y/useMediaCaption: silent decorative loop, no speech
		<video
			className={playing ? "hero-video on" : "hero-video"}
			poster={poster}
			autoPlay
			muted
			loop
			playsInline
			preload="auto"
			aria-hidden="true"
			tabIndex={-1}
			onCanPlay={() => setPlaying(true)}
		>
			<source src={WEBM} type="video/webm" />
			<source src={MP4} type="video/mp4" />
		</video>
	);
}
