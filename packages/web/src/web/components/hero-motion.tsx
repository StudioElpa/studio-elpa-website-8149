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
 * The clip plays EXACTLY ONCE and is not looped. Measured, the wrap from the
 * last frame back to the first was a mean-abs-diff of 54.4 against 0.013 for a
 * settled frame-to-frame step, which is the visible jump the client reported;
 * the clip's own closing frames taper smoothly to a near-freeze, so there is
 * nothing to trim. On `ended` the video crossfades out over 600ms to reveal the
 * static illustration underneath, then unmounts and frees the decoder. The
 * resting state of the hero is therefore the still, permanently.
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
	/**
	 * The still shown until the clip is ready. This is the clean final artwork
	 * supplied for the poster, not the hero <img> file: the poster is fetched
	 * only once the video mounts on idle, so it never competes with the LCP
	 * image. It carries the same CSS grade as the still, so the handoff reads
	 * as one image warming into motion.
	 */
	poster: string;
}

/** Must match the .hero-video.out transition-duration in styles.css. */
const FADE_OUT_MS = 600;

export function HeroMotion({ poster }: HeroMotionProps) {
	const [mounted, setMounted] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [ending, setEnding] = useState(false);
	const [gone, setGone] = useState(false);

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

	// Once the fade-out has run, the video is removed for good and the still
	// underneath is the resting state.
	useEffect(() => {
		if (!ending) return;
		const t = window.setTimeout(() => setGone(true), FADE_OUT_MS);
		return () => window.clearTimeout(t);
	}, [ending]);

	if (!mounted || gone) return null;

	// .on fades the clip in over 1200ms; .out overrides the duration to 600ms
	// and lets the base opacity:0 dissolve it back to the still.
	const className = ending ? "hero-video out" : playing ? "hero-video on" : "hero-video";

	return (
		// biome-ignore lint/a11y/useMediaCaption: silent decorative clip, no speech
		<video
			className={className}
			poster={poster}
			autoPlay
			muted
			playsInline
			preload="auto"
			aria-hidden="true"
			tabIndex={-1}
			onCanPlay={() => setPlaying(true)}
			onEnded={() => setEnding(true)}
		>
			<source src={WEBM} type="video/webm" />
			<source src={MP4} type="video/mp4" />
		</video>
	);
}
