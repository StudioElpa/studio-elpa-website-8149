import { useId, useRef, useState } from "react";

/**
 * The original site rendered FAQs as static <div>s with every answer always
 * open — nothing to operate, nothing announced. This is a real disclosure:
 * a <button> with aria-expanded/aria-controls, height animated with the Web
 * Animations API (so it also respects reduced motion, which skips the tween).
 */

export interface FaqEntry {
	q: string;
	a: React.ReactNode;
}

function FaqItem({ entry }: { entry: FaqEntry }) {
	const [open, setOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const id = useId();

	function toggle() {
		const next = !open;
		setOpen(next);

		const panel = panelRef.current;
		if (!panel) return;

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduced) {
			panel.style.height = next ? "auto" : "0px";
			return;
		}

		const from = panel.getBoundingClientRect().height;
		panel.style.height = "auto";
		const to = next ? panel.getBoundingClientRect().height : 0;
		panel.style.height = `${from}px`;

		panel.animate(
			[{ height: `${from}px` }, { height: `${to}px` }],
			{ duration: 320, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
		).onfinish = () => {
			panel.style.height = next ? "auto" : "0px";
		};
	}

	return (
		<div className="faq-item" data-reveal>
			<button
				type="button"
				className="faq-q"
				aria-expanded={open}
				aria-controls={`faq-panel-${id}`}
				id={`faq-btn-${id}`}
				onClick={toggle}
			>
				<span>{entry.q}</span>
				<span className="faq-icon" aria-hidden="true" />
			</button>
			<section
				className="faq-a"
				id={`faq-panel-${id}`}
				aria-labelledby={`faq-btn-${id}`}
				ref={panelRef}
				style={{ height: 0 }}
			>
				<div>
					<p>{entry.a}</p>
				</div>
			</section>
		</div>
	);
}

export function Faq({ entries }: { entries: FaqEntry[] }) {
	return (
		<div style={{ marginTop: 26 }} data-reveal-group>
			{entries.map((entry) => (
				<FaqItem key={entry.q} entry={entry} />
			))}
		</div>
	);
}
