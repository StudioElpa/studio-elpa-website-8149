import { useRef, useState } from "react";
import { RELAY_SOURCE, sendLeadToRelay } from "../lib/lead-relay";
import { CONTACT } from "./brand";

/**
 * The original form had bare <label> elements next to their inputs with no
 * htmlFor, no validation feedback beyond the browser default, and reported
 * failure through alert(). Same fields, same names, same copy — now labelled,
 * announced, and inline.
 *
 * The markup stays eager on purpose: it is real crawlable content, it is in the
 * prerendered HTML, and its height is what keeps CLS at zero. Only the network
 * machinery is deferred — ../queries/leads pulls the @orpc client stack, which
 * nothing on first paint needs, so it is loaded on first focus. Same
 * dynamic-import shape as lib/home-gsap.ts.
 *
 * Submission goes to the Apps Script relay (lib/lead-relay), fire and forget,
 * with the thank-you shown optimistically. ../queries/leads is now only the
 * secondary path: it runs when the relay request never reaches the network, and
 * the server route behind it emails Aviva through Formspree.
 */

type LeadsModule = typeof import("../queries/leads");

const TYPES = [
	"A homeowner",
	"An interior designer / trade partner",
	"An architect or builder",
	"Other",
];

interface Errors {
	name?: string;
	email?: string;
}

export function ContactForm({ sourcePage }: { sourcePage: string }) {
	const [values, setValues] = useState({
		name: "",
		email: "",
		phone: "",
		area: "",
		type: TYPES[0],
		message: "",
		trap: "",
	});
	const [errors, setErrors] = useState<Errors>({});
	const [failed, setFailed] = useState(false);
	const [sent, setSent] = useState(false);

	/* One in-flight promise, reused. Warmed on first focus so that by the time
	   anyone has finished typing their name the module is already resident, and
	   submit is not waiting on a round trip for the code itself. */
	const leads = useRef<Promise<LeadsModule> | null>(null);
	function warmLeads() {
		leads.current ??= import("../queries/leads");
		return leads.current;
	}

	function set<K extends keyof typeof values>(key: K, value: string) {
		setValues((v) => ({ ...v, [key]: value }));
		if (key === "name" || key === "email") setErrors((e) => ({ ...e, [key]: undefined }));
	}

	function validate() {
		const next: Errors = {};
		if (!values.name.trim()) next.name = "Please tell us your name.";
		if (!values.email.trim()) next.email = "We need an email address to reply to.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
			next.email = "That email address doesn't look quite right.";
		return next;
	}

	/* The relay carries four content fields, so the two the form asks for on top
	   of them ride along in the message rather than being dropped. */
	function relayMessage() {
		return [
			values.message.trim() || "(no message provided)",
			"",
			`Project area: ${values.area.trim() || "(not given)"}`,
			`You are: ${values.type}`,
		].join("\n");
	}

	/** Only reached when the relay request never left the browser. */
	async function fallbackToServer() {
		try {
			const { submitLeadDirect, readUtm } = await warmLeads();
			const res = await submitLeadDirect({
				...values,
				sourcePage,
				submittedAt: new Date().toISOString(),
				...readUtm(),
			});
			if (!res.ok) throw new Error("lead route reported every sink failed");
		} catch {
			/* A failed chunk fetch and a failed submission read the same to the
			   visitor, so take the thanks back down and point them at email. */
			setSent(false);
			setFailed(true);
		}
	}

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFailed(false);

		const found = validate();
		setErrors(found);
		if (Object.keys(found).length) {
			const first = document.getElementById(`cf-${Object.keys(found)[0]}`);
			first?.focus();
			return;
		}

		/* Optimistic: the thanks goes up now, the relay finishes on its own. */
		setSent(true);
		sendLeadToRelay({
			name: values.name.trim(),
			email: values.email.trim(),
			phone: values.phone.trim(),
			message: relayMessage(),
			source: RELAY_SOURCE.homepage,
			companyWebsite: values.trap,
		}).catch(fallbackToServer);
	}

	if (sent) {
		return (
			<output>
				<p className="serif-lede">
					Thank you. Your message is on its way, and we'll be in touch within one business day.
				</p>
			</output>
		);
	}

	return (
		<form onSubmit={onSubmit} onFocus={warmLeads} noValidate>
			<div className="field">
				<label id="cf-name-l" htmlFor="cf-name">Your name</label>
				<input
					id="cf-name" aria-labelledby="cf-name-l"
					type="text"
					name="name"
					autoComplete="name"
					required
					value={values.name}
					onChange={(e) => set("name", e.target.value)}
					aria-invalid={errors.name ? true : undefined}
					aria-describedby={errors.name ? "cf-name-err" : undefined}
				/>
				{errors.name && (
					<p className="field-error" id="cf-name-err">
						{errors.name}
					</p>
				)}
			</div>

			<div className="field">
				<label id="cf-email-l" htmlFor="cf-email">Email</label>
				<input
					id="cf-email" aria-labelledby="cf-email-l"
					type="email"
					name="email"
					autoComplete="email"
					required
					value={values.email}
					onChange={(e) => set("email", e.target.value)}
					aria-invalid={errors.email ? true : undefined}
					aria-describedby={errors.email ? "cf-email-err" : undefined}
				/>
				{errors.email && (
					<p className="field-error" id="cf-email-err">
						{errors.email}
					</p>
				)}
			</div>

			<div className="field">
				<label id="cf-phone-l" htmlFor="cf-phone">Phone</label>
				<input
					id="cf-phone" aria-labelledby="cf-phone-l"
					type="tel"
					name="phone"
					autoComplete="tel"
					value={values.phone}
					onChange={(e) => set("phone", e.target.value)}
				/>
			</div>

			<div className="field">
				<label id="cf-area-l" htmlFor="cf-area">Where's the project? (city / area)</label>
				<input
					id="cf-area" aria-labelledby="cf-area-l"
					type="text"
					name="area"
					value={values.area}
					onChange={(e) => set("area", e.target.value)}
				/>
			</div>

			<div className="field">
				<label id="cf-type-l" htmlFor="cf-type">You are…</label>
				<select
					id="cf-type" aria-labelledby="cf-type-l"
					name="type"
					value={values.type}
					onChange={(e) => set("type", e.target.value)}
				>
					{TYPES.map((t) => (
						<option key={t}>{t}</option>
					))}
				</select>
			</div>

			<div className="field">
				<label id="cf-message-l" htmlFor="cf-message">Tell us about the room (what you'd love to improve)</label>
				<textarea
					id="cf-message" aria-labelledby="cf-message-l"
					name="message"
					value={values.message}
					onChange={(e) => set("message", e.target.value)}
				/>
			</div>

			{/* honeypot — off-screen, never focusable */}
			<div className="visually-hidden" aria-hidden="true">
				<label id="cf-trap-l" htmlFor="cf-trap">Leave this field empty</label>
				<input
					id="cf-trap" aria-labelledby="cf-trap-l"
					name="company_website"
					tabIndex={-1}
					autoComplete="off"
					value={values.trap}
					onChange={(e) => set("trap", e.target.value)}
				/>
			</div>

			<button type="submit" className="btn btn-dark" style={{ width: "100%" }}>
				Send it over
			</button>

			<p className="reassure" role={failed ? "alert" : undefined}>
				{failed ? (
					<>
						Something went wrong on our end. Please email us at{" "}
						<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we'll pick it up from
						there.
					</>
				) : (
					<>We read every message ourselves, and we'll reply personally. No call center, no bots.</>
				)}
			</p>
		</form>
	);
}
