/**
 * Logo handling, kept in one place so the real assets can be dropped in later
 * without touching any page.
 *
 * Only logo.png and logo-mark.png exist today, both dark-on-light. Per Aviva:
 * on light grounds use the real logo as-is; on dark grounds do NOT recolor or
 * force it — set the wordmark in cream Cormorant Garamond instead.
 *
 * When the designer supplies an SVG and a reversed lockup:
 *   - swap the <img src> in <Logo> for the SVG
 *   - replace the <Wordmark> body with an <img> of the reversed lockup
 * Nothing else in the codebase needs to change.
 */

/**
 * True pixel dimensions of /assets/logo.png. Emitted as the width/height
 * attributes on every instance so the browser knows the intrinsic aspect ratio
 * before the bitmap arrives: that reserves the right box (no layout shift) and
 * makes it impossible for a stray width rule to stretch the lockup.
 */
const LOGO_W = 900;
const LOGO_H = 337;

interface LogoProps {
	/**
	 * Rendered height in px. Omit it to let CSS own the height — the site header
	 * does this so its media queries can shrink the logo. An inline height would
	 * beat a stylesheet rule and freeze the logo at one size on every viewport.
	 */
	height?: number;
	className?: string;
}

export function Logo({ height, className = "logo-img" }: LogoProps) {
	return (
		<img
			className={className}
			// The full lockup. logo-mark.png is the same artwork with the tagline
			// cropped off AND the wordmark clipped at the baseline, which is why it
			// read as cramped and illegible. Do not point this back at it.
			src="/assets/logo.png"
			alt="Studio Elpa, window treatments and home textiles"
			width={LOGO_W}
			height={LOGO_H}
			// width:auto derives the width from the intrinsic ratio, so the lockup
			// cannot be squished no matter what height wins.
			style={height ? { height, width: "auto" } : undefined}
		/>
	);
}

interface WordmarkProps {
	/** Font size in px. Footer uses the CSS default (26). */
	size?: number;
}

/** Cream wordmark for dark grounds. Never a recolored bitmap. */
export function Wordmark({ size }: WordmarkProps) {
	return (
		<div className="wordmark" style={size ? { fontSize: size } : undefined}>
			Studio<span>&nbsp;Elpa</span>
		</div>
	);
}

export const CONTACT = {
	phone: "(561) 836-0026",
	phoneHref: "tel:+15618360026",
	email: "aviva@studioelpa.com",
	booking: "https://calendar.app.google/cBDn87e5pR5E6G4w9",
} as const;
