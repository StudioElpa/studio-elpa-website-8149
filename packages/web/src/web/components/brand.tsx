/**
 * Logo handling, kept in one place so the real assets can be dropped in later
 * without touching any page.
 *
 * Only logo.png and logo-mark.png exist today, both dark-on-light. Per Aviva:
 * on light grounds use the real logo as-is; on dark grounds do NOT recolor or
 * force it — set the wordmark as cream text instead. That text is Newsreader
 * since the Warm Editorial typography pass; it is a temporary editorial
 * treatment and does not reproduce the official logo.
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

/**
 * True pixel dimensions of /assets/logo-header.png: a lossless crop of
 * logo.png (pure crop plus transparent clear space, no resampling, recoloring
 * or redrawing) that removes only the two tagline lines and the excess canvas.
 * Verified with `convert logo-header.png -trim`: the ink measures exactly
 * 850x207 at +24+24, so nothing is clipped and 24px of clear space survives on
 * all four sides.
 *
 * Why it exists: dropping the tagline raises the wordmark's share of the asset,
 * so at the same rendered height the letterforms are noticeably larger. The
 * header cannot render the tagline at a legible size at any height that fits,
 * so it uses this crop. Keep logo.png for placements where the tagline can
 * actually be read.
 */
const LOGO_HEADER_W = 898;
const LOGO_HEADER_H = 255;

const VARIANTS = {
	/**
	 * The complete lockup, tagline included. logo-mark.png is a different file:
	 * the same artwork with the tagline cropped off AND the wordmark clipped at
	 * the baseline, which is why it read as cramped and illegible. Never point a
	 * variant back at it.
	 */
	full: {
		src: "/assets/logo.png",
		width: LOGO_W,
		height: LOGO_H,
		alt: "Studio Elpa, window treatments and home textiles",
	},
	/** Tagline-free crop for tight chrome. See LOGO_HEADER_W above. */
	header: {
		src: "/assets/logo-header.png",
		width: LOGO_HEADER_W,
		height: LOGO_HEADER_H,
		alt: "Studio Elpa",
	},
} as const;

interface LogoProps {
	/**
	 * Rendered height in px. Omit it to let CSS own the height — the site header
	 * does this so its media queries can shrink the logo. An inline height would
	 * beat a stylesheet rule and freeze the logo at one size on every viewport.
	 */
	height?: number;
	className?: string;
	/** "full" keeps the tagline; "header" is the tagline-free crop. */
	variant?: keyof typeof VARIANTS;
}

export function Logo({
	height,
	className = "logo-img",
	variant = "full",
}: LogoProps) {
	const art = VARIANTS[variant];
	return (
		<img
			className={className}
			src={art.src}
			alt={art.alt}
			// Intrinsic dimensions as attributes: the browser knows the aspect ratio
			// before the bitmap arrives, which reserves the right box (no layout
			// shift) and makes a stray width rule unable to stretch the lockup.
			width={art.width}
			height={art.height}
			// width:auto derives the width from the intrinsic ratio, so the lockup
			// cannot be squished no matter what height wins.
			style={height ? { height, width: "auto" } : undefined}
		/>
	);
}

/**
 * True pixel dimensions of /assets/logo-footer-cream.png: the reversed lockup
 * Aviva supplied in V2, drawn cream on transparent so it sits on the dark ink
 * footer without any recoloring. It carries the full tagline, so the alt text
 * carries it too rather than leaving that copy trapped in the bitmap.
 */
const LOGO_FOOTER_W = 640;
const LOGO_FOOTER_H = 240;

interface FooterLogoProps {
	/**
	 * Rendered height in px. Omit it (both footers do) to let CSS own the
	 * height: an inline height would beat the stylesheet and freeze the lockup
	 * at one size, which is exactly what makes it too wide on a 390px screen.
	 */
	height?: number;
	className?: string;
}

/**
 * Reversed cream lockup for dark footers. This is the real asset, so it
 * replaces the temporary <Wordmark> text treatment there. <Wordmark> stays for
 * any dark ground where no reversed artwork exists.
 */
export function FooterLogo({ height, className = "footer-logo" }: FooterLogoProps) {
	return (
		<img
			className={className}
			src="/assets/logo-footer-cream.png"
			alt="Studio Elpa, window treatments and home textiles"
			width={LOGO_FOOTER_W}
			height={LOGO_FOOTER_H}
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
