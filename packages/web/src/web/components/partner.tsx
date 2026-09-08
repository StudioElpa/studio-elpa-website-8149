/**
 * Named trade partners.
 *
 * Baltic Electrical is the licensed, insured South Florida electrical contractor
 * that handles the electrical on motorized projects. It is CLEARED to be named
 * and linked on the site.
 *
 * This exists as a component so the href, target and rel can never drift between
 * mentions: every "Baltic Electrical" on the site is the same link, opening in a
 * new tab with rel="noopener".
 *
 * GUARDRAIL: no other third-party brand may appear anywhere on the site. Lutron,
 * Somfy and Blindspace are pending partner approval, so motors and integration are
 * described in generic language only ("quiet, reliable motors", "smart-home
 * integration"). Do not add a component here for any of them.
 */

export const BALTIC_URL = "https://balticelectrical.com/";

/** The business name, linked. Renders inline inside a sentence. */
export function BalticLink() {
	return (
		<a href={BALTIC_URL} target="_blank" rel="noopener">
			Baltic Electrical
		</a>
	);
}
