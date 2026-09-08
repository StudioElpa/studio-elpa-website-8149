import { useEffect, useId, useState } from "react";

/**
 * The original site rendered FAQs as static <div>s with every answer always
 * open — nothing to operate, nothing announced. This is a real disclosure:
 * a <button> with aria-expanded/aria-controls driving a CSS-only
 * grid-template-rows transition (0fr <-> 1fr). No JS animation, no measuring.
 *
 * The default state is OPEN, on purpose. The prerendered HTML therefore ships
 * every answer visible, and the collapsed state is applied by JS after mount.
 * That matches the site's motion contract: with no JS, a failed chunk, or
 * animation disabled, the copy is readable rather than clipped to zero height.
 */

export interface FaqEntry {
	q: string;
	a: React.ReactNode;
}

function FaqItem({ entry }: { entry: FaqEntry }) {
	const [ready, setReady] = useState(false);
	const [open, setOpen] = useState(false);
	const id = useId();

	// Only collapse once JS is running and the button is actually operable.
	useEffect(() => {
		setReady(true);
	}, []);

	const expanded = ready ? open : true;

	return (
		<div className="faq-item">
			<button
				type="button"
				className="faq-q"
				aria-expanded={expanded}
				aria-controls={`faq-panel-${id}`}
				id={`faq-btn-${id}`}
				onClick={() => setOpen((v) => !v)}
			>
				<span>{entry.q}</span>
				<span className="faq-icon" aria-hidden="true" />
			</button>
			<section
				className="faq-a"
				id={`faq-panel-${id}`}
				aria-labelledby={`faq-btn-${id}`}
				data-open={expanded ? "true" : "false"}
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
		<div className="faq-list" style={{ marginTop: 26 }} data-reveal>
			{entries.map((entry) => (
				<FaqItem key={entry.q} entry={entry} />
			))}
		</div>
	);
}
