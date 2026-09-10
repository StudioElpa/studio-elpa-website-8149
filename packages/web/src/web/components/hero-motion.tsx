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
 * state of the hero from then on.
 *
 * Reduced motion is a real no-op, not a shortened animation: the <video> is
 * never mounted at all, so the still is what the visitor sees.
 *
 * Two encodes from one master: H.264 MP4 (universal) and VP9 WebM (smaller
 * where it is supported). Both encodes are silent by design as well as by the
 * muted attribute.
 */

const MP4 = "/assets/hero-motion-v3.mp4";
const WEBM = "/assets/hero-motion-v3.webm";

interface HeroMotionProps {
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

		const idle = window.requestIdleCallback;
		const handle = idle ? idle(start, { timeout: 3000 }) : window.setTimeout(start, 1200);

		return () => {
			cancelled = true;
			if (idle && window.cancelIdleCallback) window.cancelIdleCallback(handle as number);
			else window.clearTimeout(handle as number);
		};
	}, []);

	if (!mounted) return null;

	const className = playing ? "hero-video on" : "hero-video";

	return (
		// biome-ignore lint/a11y/useMediaCaption: silent decorative clip, no speech
		<video
			ref={(el) => {
				// React does not reliably emit the muted attribute, and iOS will not
				// autoplay unless the element is provably muted before playback. Set
				// it imperatively the moment the element exists.
				if (el) {
					el.muted = true;
					el.defaultMuted = true;
				}
			}}
			className={className}
			poster={poster}
			autoPlay
			muted
			playsInline
			preload="auto"
			aria-hidden="true"
			tabIndex={-1}
			onCanPlay={(e) => {
				// A <video> inserted by JS after load does not honour the autoplay
				// attribute on iOS Safari, so start the muted clip by hand.
				const v = e.currentTarget;
				v.muted = true;
				v.defaultMuted = true;
				const p = v.play();
				if (p && typeof p.catch === "function") p.catch(() => {});
				setPlaying(true);
			}}
		>
			<source src={WEBM} type="video/webm" />
			<source src={MP4} type="video/mp4" />
		</video>
	);
}
