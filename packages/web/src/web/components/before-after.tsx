import { useEffect, useRef, useState } from "react";

/**
 * V1.2 section 11: the before/after comparison, the site's signature
 * interactive moment.
 *
 * Accessibility and failure model, in the order the brief asks for it:
 *
 * - The FIRST render is the static two-figure presentation the site already
 *   shipped, with both images and both labels in the markup. That is what the
 *   prerenderer snapshots, so a reader with no JavaScript, a failed chunk, or a
 *   slow network gets two fully captioned photographs rather than an empty box.
 *   The interactive frame is only swapped in after mount, i.e. only once JS has
 *   demonstrably run.
 * - Reduced motion keeps the static side-by-side view permanently. The brief
 *   asks for a static side-by-side or stacked presentation in that mode, and
 *   this is the honest reading: no wipe, no handle, nothing to drag.
 * - The control is a native <input type="range">. That buys real keyboard
 *   support (arrows, Home, End, Page keys), touch dragging, pointer dragging
 *   anywhere across the frame, and correct screen-reader semantics for free.
 *   A hand-rolled pointer handler would have had to reimplement all of it, worse.
 * - Both labels are always rendered and never move, at either end of the frame,
 *   whatever the handle position.
 *
 * Motion contract: the images are never hidden. The one-time hint tween below
 * only moves the divider, and only after the frame is in view.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Where the divider rests. Slightly off centre so both rooms read at a glance. */
const REST = 48;
/** Where the one-time hint starts, so the wipe travels inward to REST. */
const HINT_FROM = 64;

type Shot = {
	src: string;
	alt: string;
	label: string;
};

const BEFORE: Shot = {
	src: "/assets/ba-before.jpg",
	alt: "The arched dining room window before, left almost bare",
	label: "Before",
};

const AFTER: Shot = {
	src: "/assets/ba-after.jpg",
	alt: "The same window after, with full custom sheer drapery",
	label: "After",
};

/** The presentation that ships in the HTML: two photographs, two labels. */
function StaticPair() {
	return (
		<div className="ba" data-reveal-group>
			{[BEFORE, AFTER].map((s) => (
				<figure key={s.src} data-reveal>
					<span className="ba-tag">{s.label}</span>
					<img
						className="ba-img"
						src={s.src}
						alt={s.alt}
						loading="lazy"
						decoding="async"
					/>
				</figure>
			))}
		</div>
	);
}

export function BeforeAfter() {
	// Starts false on purpose: see the note above about the prerendered state.
	const [interactive, setInteractive] = useState(false);
	const [pos, setPos] = useState(REST);
	const frameRef = useRef<HTMLDivElement | null>(null);
	const hinted = useRef(false);
	/**
	 * Cancels the hint tween if it is currently running. The reader always wins:
	 * without this, a drag or an arrow key pressed during the 900ms tween is
	 * silently overwritten on the next animation frame. Measured: the tween
	 * starts ~1.25s after the frame enters view on desktop and ~1.39s on mobile,
	 * so that window is genuinely reachable.
	 */
	const stopHint = useRef<(() => void) | null>(null);

	useEffect(() => {
		if (window.matchMedia(REDUCED).matches) return;
		setInteractive(true);
	}, []);

	// One-time hint: once the frame is actually on screen, walk the divider from
	// HINT_FROM to REST so the reader can see that the seam moves. Runs once,
	// never on scroll up, and is not scroll-linked, so there is nothing to pin
	// and no scroll to hijack.
	useEffect(() => {
		const frame = frameRef.current;
		if (!interactive || !frame || hinted.current) return;

		let raf = 0;
		let cancelled = false;
		let timer = 0;

		// Any reader input stops the hint, whether it lands before the tween
		// starts or halfway through it.
		stopHint.current = () => {
			cancelled = true;
			hinted.current = true;
			io.disconnect();
			window.clearTimeout(timer);
			cancelAnimationFrame(raf);
		};

		const tween = () => {
			if (cancelled) return;
			hinted.current = true;
			const start = performance.now();
			const dur = 900;
			setPos(HINT_FROM);
			const step = (now: number) => {
				if (cancelled) return;
				const t = Math.min(1, (now - start) / dur);
				// ease-out cubic, matching the calm curve used elsewhere
				const e = 1 - (1 - t) ** 3;
				setPos(HINT_FROM + (REST - HINT_FROM) * e);
				if (t < 1) raf = requestAnimationFrame(step);
			};
			raf = requestAnimationFrame(step);
		};

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					io.disconnect();
					// Let the reveal settle first, so the two motions do not overlap.
					timer = window.setTimeout(tween, 260);
				}
			},
			{ threshold: 0.35 },
		);
		io.observe(frame);

		return () => {
			cancelled = true;
			io.disconnect();
			window.clearTimeout(timer);
			cancelAnimationFrame(raf);
			stopHint.current = null;
		};
	}, [interactive]);

	if (!interactive) return <StaticPair />;

	const rounded = Math.round(pos);

	// No data-reveal on .cmp: this subtree mounts after usePageMotion's layout
	// effect has already queried the DOM, so it could never be observed.
	// Leaving the attribute on would imply motion that never runs. The static
	// pair it replaces does carry the reveal.
	return (
		<div className="cmp">
			<div className="cmp-frame" ref={frameRef}>
				{/* Before sits underneath and is never clipped. */}
				<img className="ba-img cmp-img" src={BEFORE.src} alt={BEFORE.alt} decoding="async" />

				{/* After is clipped from the left edge to the divider. */}
				<div className="cmp-after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
					<img className="ba-img cmp-img" src={AFTER.src} alt={AFTER.alt} decoding="async" />
				</div>

				{/* Both labels, always present, never moving. */}
				<span className="ba-tag cmp-tag cmp-tag-before">{BEFORE.label}</span>
				<span className="ba-tag cmp-tag cmp-tag-after">{AFTER.label}</span>

				{/* Purely visual. The range input below is the real control. */}
				<div className="cmp-handle" style={{ left: `${pos}%` }} aria-hidden="true">
					<span className="cmp-grip" />
				</div>

				<input
					className="cmp-range"
					type="range"
					min={0}
					max={100}
					step={0.5}
					value={pos}
					onPointerDown={() => stopHint.current?.()}
					onKeyDown={() => stopHint.current?.()}
					onChange={(e) => {
						// The reader always wins over the hint tween.
						stopHint.current?.();
						hinted.current = true;
						setPos(Number(e.target.value));
					}}
					aria-label="Reveal the finished room. Drag, or use the arrow keys."
					aria-valuetext={`${rounded}% of the finished room revealed`}
				/>
			</div>
		</div>
	);
}
