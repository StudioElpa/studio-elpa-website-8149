import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Logo, Wordmark, CONTACT } from "./brand";
import { useCondensedHeader, useScrollSpy } from "../hooks/use-motion";

/* ---------------------------------------------------------------------------
   Link conventions on this site
   - same-page anchor          → plain <a href="#x">
   - another page + an anchor  → plain <a href="/index.html#x"> (full load, so
                                 the browser handles the scroll itself)
   - another page, no anchor   → wouter <Link>, stays a SPA navigation
   URLs keep their .html suffix so every existing inbound link and indexed
   URL from the old static site still resolves.
--------------------------------------------------------------------------- */

const HOME_SECTIONS = ["about", "services", "process", "designers", "projects", "journal"];

const NAV = [
	{ label: "About", hash: "about" },
	{ label: "What We Do", hash: "services" },
	{ label: "How We Work", hash: "process" },
	{ label: "For Designers", hash: "designers" },
	{ label: "Projects", hash: "projects" },
];

/** Small handset glyph so the number reads as tappable, not as plain text. */
function PhoneIcon() {
	return (
		<svg
			className="phone-icon"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			aria-hidden="true"
		>
			<path
				d="M6.6 3.5h2.3l1.4 3.6-1.8 1.3a10.6 10.6 0 0 0 5.1 5.1l1.3-1.8 3.6 1.4v2.3a1.9 1.9 0 0 1-2.1 1.9A15.4 15.4 0 0 1 4.7 5.6 1.9 1.9 0 0 1 6.6 3.5Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/**
 * Click-to-call, always visible at every breakpoint. It sits in the bar rather
 * than inside <nav> on purpose: nav collapses into the drawer on small screens,
 * and a phone number you have to open a menu to find is a phone number nobody
 * calls.
 */
function HeaderPhone() {
	return (
		<a className="header-phone" href={CONTACT.phoneHref}>
			<PhoneIcon />
			<span>{CONTACT.phone}</span>
		</a>
	);
}

function MenuIcon({ open }: { open: boolean }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
			{open ? (
				<path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
			) : (
				<>
					<path d="M3 7h18" strokeLinecap="round" />
					<path d="M3 12h18" strokeLinecap="round" />
					<path d="M3 17h18" strokeLinecap="round" />
				</>
			)}
		</svg>
	);
}

/** Sticky header for the homepage: anchor nav, scrollspy, mobile drawer. */
export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const condensed = useCondensedHeader();
	const active = useScrollSpy(HOME_SECTIONS);
	const btnRef = useRef<HTMLButtonElement | null>(null);
	const navRef = useRef<HTMLElement | null>(null);
	// Whether closing should hand focus back to the menu button. True when the
	// drawer is dismissed (Escape, or the button itself), false when the reader
	// picked a destination, because yanking focus back to the hamburger after
	// choosing a section would undo the choice they just made.
	const restoreRef = useRef(false);

	const closeMenu = (restoreFocus: boolean) => {
		restoreRef.current = restoreFocus;
		setOpen(false);
	};

	// Escape closes the drawer — a menu you can only close with a mouse is a
	// trap — and Tab is kept inside it, so focus cannot wander onto the page
	// content sitting behind a full-screen overlay.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeMenu(true);
				return;
			}
			if (e.key !== "Tab") return;
			const btn = btnRef.current;
			const nav = navRef.current;
			if (!btn || !nav) return;
			// The button is part of the cycle: it is the drawer's own control and
			// stays visible as the close affordance while the drawer is open.
			const items = [
				btn,
				...Array.from(nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")),
			];
			const first = items[0];
			const last = items[items.length - 1];
			if (!first || !last) return;
			const el = document.activeElement as HTMLElement | null;
			if (!el || !items.includes(el)) {
				// Focus is somewhere behind the overlay (logo, phone, page body).
				e.preventDefault();
				first.focus();
			} else if (e.shiftKey && el === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && el === last) {
				e.preventDefault();
				first.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	// Focus returns to the button that opened the drawer, so a keyboard reader
	// resumes where they were instead of at the top of the document.
	useEffect(() => {
		if (open || !restoreRef.current) return;
		restoreRef.current = false;
		btnRef.current?.focus();
	}, [open]);

	return (
		<header className={condensed ? "site condensed" : "site"}>
			<div className="wrap bar">
				<a className="logo" href="#home" onClick={() => closeMenu(false)}>
					{/* No height prop: styles.css owns it so the media queries can
					    shrink the logo. See Logo's height doc comment. */}
					<Logo variant="header" />
				</a>
				<HeaderPhone />
				<button
					type="button"
					className="menu-btn"
					ref={btnRef}
					aria-expanded={open}
					aria-controls="site-nav"
					aria-label={open ? "Close menu" : "Open menu"}
					onClick={() => {
						restoreRef.current = false;
						setOpen((v) => !v);
					}}
				>
					<MenuIcon open={open} />
				</button>
				<nav
					className={open ? "main open" : "main"}
					id="site-nav"
					ref={navRef}
					aria-label="Main"
					data-nav
				>
					{NAV.map((item) => (
						<a
							key={item.hash}
							href={`#${item.hash}`}
							className={active === item.hash ? "active" : undefined}
							onClick={() => closeMenu(false)}
						>
							{item.label}
						</a>
					))}
					<Link to="/estimate.html" onClick={() => closeMenu(false)}>
						Estimate
					</Link>
					<a className="nav-cta" href="#contact" onClick={() => closeMenu(false)}>
						Begin a conversation
					</a>
				</nav>
			</div>
		</header>
	);
}

/**
 * Full footer, homepage only (the landing pages use LandingFooter, the article
 * and privacy pages ThinFooter). Deliberately not a link-column grid: a
 * wordmark, one line in the studio's voice, a signed note, and the real
 * contact block. Dark ground, so the wordmark stands in for the logo.
 */
export function SiteFooter() {
	return (
		<footer className="site">
			<div className="wrap">
				<div className="f-top">
					<Wordmark />
					<p className="f-line">
						Good window treatments do not announce themselves. They just make a room feel
						finished.
					</p>
				</div>
				<div className="f-mid">
					<div className="f-say">
						{/* V1.2 section 16: a "thirty minutes, no obligation, you will come away
						    knowing what your windows need" pitch lived here and restated the
						    contact section almost word for word. Removed so the footer signs
						    off rather than selling the same call twice. */}
						<a className="f-begin" href="#contact">
							Begin a conversation
						</a>
						<p className="f-sign">Aviva, Studio Elpa</p>
					</div>
					<div className="f-contact">
						<h3>Reach us</h3>
						<a className="f-tel" href={CONTACT.phoneHref}>
							{CONTACT.phone}
						</a>
						<a className="f-mail" href={`mailto:${CONTACT.email}`}>
							{CONTACT.email}
						</a>
						<p>Serving South Florida.</p>
						<p>We reply within one business day.</p>
					</div>
				</div>
				<div className="base">
					<p>European fabrics · Made for how you live</p>
					<p>
						© {new Date().getFullYear()} Studio Elpa ·{" "}
						<Link to="/privacy.html">Privacy Policy</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}

/** Slim header used by the drapery / motorized / blackout landing pages. */
export function LandingHeader() {
	const condensed = useCondensedHeader();
	return (
		<header className={condensed ? "lp condensed" : "lp"}>
			<div className="bar">
				<Link to="/index.html" className="logo" aria-label="Studio Elpa home">
					<Logo variant="header" height={44} className="" />
				</Link>
				<a className="nav-cta" href={CONTACT.booking} target="_blank" rel="noopener">
					Book a 30-minute call
				</a>
			</div>
		</header>
	);
}

/** Slim footer used by the landing pages. */
export function LandingFooter() {
	return (
		<footer className="lp">
			<div className="wrap">
				<Wordmark size={24} />
				<p>
					Custom window treatments in European fabrics, made for how you live. Serving South
					Florida.
				</p>
				<p>
					<a href={CONTACT.phoneHref}>{CONTACT.phone}</a> ·{" "}
					<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{" "}
					<Link to="/index.html">studioelpa.com</Link>
				</p>
			</div>
		</footer>
	);
}

/** One-line header with a back link — founder note, journal article, privacy. */
export function BackHeader({ href, label }: { href: string; label: string }) {
	return (
		<header>
			<div className="bar">
				<Link to="/index.html" className="logo" aria-label="Studio Elpa home">
					<Logo variant="header" height={44} className="" />
				</Link>
				<a className="back" href={href}>
					{label}
				</a>
			</div>
		</header>
	);
}

/** Single-line footer — founder note, journal article, privacy. */
export function ThinFooter() {
	return (
		<footer className="thin">
			<div className="wrap">
				<p>Studio Elpa · European fabrics · Made for how you live</p>
			</div>
		</footer>
	);
}
