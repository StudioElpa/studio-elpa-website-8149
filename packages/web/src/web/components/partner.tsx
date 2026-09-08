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
 * Blindspace is CLEARED, via WindowModes, and may be named and shown using the
 * official co-brand lockup only. Its usage rules are strict, so it also lives here
 * as a component rather than as loose markup that could drift:
 *
 *   - Use ONLY the supplied official lockup files. Never recolor, crop, obstruct,
 *     distort, or combine the lockup with another logo or a Studio Elpa tagline.
 *   - Show it standalone, with clear space around it.
 *   - Always link to https://www.blindspace.com in a new tab with rel="noopener",
 *     alt text exactly "Blindspace for Window Modes".
 *   - Spell it "Blindspace": one word, capital B, everywhere.
 *   - Keep the copy factual. Blindspace supplies the recess/pocket systems we
 *     install. NEVER imply Blindspace endorses or is affiliated with Studio Elpa.
 *
 * GUARDRAIL: no other third-party brand may appear anywhere on the site. Lutron and
 * Somfy are still on hold pending partner approval, so motors and integration stay
 * in generic language only ("quiet, reliable motors", "smart-home integration").
 * Do not add a component here for either of them.
 */

export const BALTIC_URL = "https://balticelectrical.com/";

export const BLINDSPACE_URL = "https://www.blindspace.com";

/**
 * The official "Blindspace for Window Modes" co-brand lockup, standalone and linked.
 *
 * The supplied artwork is a black mark on an OPAQUE white plate (measured: no alpha
 * channel, corner pixels rgb(255,255,255)). The site's light ground is cream
 * (--bg #f5f1ea), so dropping the file straight onto the page would show a visible
 * white rectangle edge. Rather than recolor or crop the artwork, which the usage
 * rules forbid, the lockup sits on a deliberate white plate whose colour matches the
 * artwork's own baked-in white exactly: the seam is invisible and the padding reads
 * as the required clear space.
 *
 * The second supplied file (-blue.png) is NOT a light or reversed logo: it is the
 * same black mark on an opaque sage plate (#adc9c6). Neither file works on the dark
 * ink band, so the lockup is only ever placed on light grounds. A transparent or
 * genuinely reversed lockup would have to be supplied for dark use.
 *
 * The alt text is deliberately "Blindspace for Window Modes" with Window Modes as
 * two words, per the partner's instruction, even though the artwork sets it as one.
 */
export function BlindspaceLockup() {
	return (
		<div className="bs-lockup">
			<a className="bs-lockup-link" href={BLINDSPACE_URL} target="_blank" rel="noopener">
				<img
					src="/assets/blindspace-for-windowmodes-black.png"
					alt="Blindspace for Window Modes"
					width={709}
					height={297}
					loading="lazy"
				/>
			</a>
		</div>
	);
}

/** The business name, linked. Renders inline inside a sentence. */
export function BalticLink() {
	return (
		<a className="partner-link" href={BALTIC_URL} target="_blank" rel="noopener">
			Baltic Electrical
		</a>
	);
}
