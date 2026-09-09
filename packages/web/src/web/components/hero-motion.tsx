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
 * The clip plays EXACTLY ONCE, is not looped, and now FREEZES ON ITS LAST
 * FRAME by client instruction. It opens with the shades part way down, raises
 * them, and settles on the bright open room; that final frame is the resting
 * state of the hero from then on. Nothing fades out and nothing unmounts, so
 * there is no dissolve back to the still and therefore no crossfade seam: the
 * measured colour gap that made the old handoff visible cannot occur when the
 * handoff never happens. The still underneath is what shows before the clip is
 * ready, under reduced motion, and if the video ever fails to load.
 *
 * The trade for freezing is that the <video> element stays in the document
 * with its decoded last frame, rather than being torn down to free the
 * decoder. It is paused at that point, so it costs no ongoing decode work.
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

/* Versioned filenames, not query strings. Browsers and intermediary caches
   kept serving the old bytes from the original URL when the clip was first
   replaced; a `?v=` suffix is honoured inconsistently by caches and by some
   CDNs, so the file itself is renamed on every re-cut. v3 is the clip that
   starts with the shades part way down and ends on the open room, and it is
   the cut the hero freezes on. Any future re-cut bumps the suffix again rather
   than overwriting these files. */
const MP4 = "/assets/hero-motion-v3.mp4";
const WEBM = "/assets/hero-motion-v3.webm";

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

	// .on fades the clip in over 1200ms and is never removed again: the clip
	// holds its last frame at full opacity once it ends.
	const className = playing ? "hero-video on" : "hero-video";

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
		>
			<source src={WEBM} type="video/webm" />
			<source src={MP4} type="video/mp4" />
		</video>
	);
}
