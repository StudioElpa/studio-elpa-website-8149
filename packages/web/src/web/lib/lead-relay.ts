/**
 * LEAD RELAY, the client-side primary sink
 * ---------------------------------------------------------------------------
 * Every lead form on the site posts here first: a Google Apps Script web app
 * that appends the row to the Sheet and upserts the contact into Attio.
 *
 * Three deliberate choices, all of them the client's:
 *
 *  1. The POST carries `Content-Type: text/plain;charset=utf-8` even though the
 *     body is JSON. That keeps it a CORS-simple request, so the browser sends
 *     it without a preflight, because Apps Script does not answer OPTIONS and an
 *     application/json body would be blocked before it ever left the page.
 *  2. Fire and forget. The caller shows its thank-you optimistically and never
 *     waits on the response, because a relay round trip through Apps Script is
 *     slow enough to feel broken.
 *  3. The URL and the shared token are public by design. They are a spam gate
 *     on an endpoint whose only power is to append a lead, not a credential:
 *     nothing else is reachable with them.
 *
 * sendLeadToRelay only ever rejects when the request never reached the network
 * (offline, DNS, blocked). An HTTP error is invisible to a simple request, so
 * treat a resolved promise as "handed to the browser", not as "stored".
 */

const RELAY_URL =
	"https://script.google.com/macros/s/AKfycbzq-qGEXksrJMQITJaBpVahffytBCs2-Ca9LNIOslGcCA0p71kH2fn9ct2jxU1wHwxd7g/exec";

const FORM_SECRET = "elpa_9f3k2";

/** One label per form, so the Sheet says which surface the lead came from. */
export const RELAY_SOURCE = {
	homepage: "Homepage - Begin a conversation",
	estimate: "Estimate page",
	/* Direct-mail landing pages. The QR code on each mailer points at one of
	   these, with utm_campaign carrying the mail code (e.g. M1-NEW). */
	mailWelcome: "Mail landing - Welcome Home (recent buyers)",
	mailSmart: "Mail landing - Smart Living (smart-home communities)",
	mailRenew: "Mail landing - Renew (established homes)",
} as const;

export interface RelayLead {
	name: string;
	email: string;
	phone: string;
	/** Everything the visitor told us, already composed into one block. */
	message: string;
	source: string;
	/** Honeypot. Humans leave it empty; the relay drops any row that has it. */
	companyWebsite: string;
}

/**
 * First-touch UTM memory. A mailer QR lands someone on /welcome with
 * utm_campaign=M1-NEW; if they wander to the homepage and submit the form
 * there, the lead should still carry the mail code. The landing URL's params
 * are kept in sessionStorage for the visit. Storage can be unavailable
 * (private mode, blocked), so every access is guarded and the live URL wins.
 */
const UTM_KEY = "elpa_utm";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign"] as const;
type Utm = Record<(typeof UTM_FIELDS)[number], string>;

export function rememberUtm() {
	if (typeof window === "undefined") return;
	const q = new URLSearchParams(window.location.search);
	if (!q.get("utm_campaign") && !q.get("utm_source")) return;
	const utm = Object.fromEntries(UTM_FIELDS.map((k) => [k, q.get(k) ?? ""])) as Utm;
	try {
		window.sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
	} catch {
		/* storage blocked: the live URL is still read at submit time */
	}
}

function storedUtm(): Utm | null {
	try {
		const raw = window.sessionStorage.getItem(UTM_KEY);
		return raw ? (JSON.parse(raw) as Utm) : null;
	} catch {
		return null;
	}
}

/** page + utm_*, read off the current URL at submit time (or the visit's landing URL). */
function context() {
	if (typeof window === "undefined") {
		return { page: "", utm_source: "", utm_medium: "", utm_campaign: "" };
	}
	const q = new URLSearchParams(window.location.search);
	const live = q.get("utm_campaign") || q.get("utm_source");
	const kept = live ? null : storedUtm();
	return {
		page: window.location.pathname,
		utm_source: q.get("utm_source") ?? kept?.utm_source ?? "",
		utm_medium: q.get("utm_medium") ?? kept?.utm_medium ?? "",
		utm_campaign: q.get("utm_campaign") ?? kept?.utm_campaign ?? "",
	};
}

export function relayBody(lead: RelayLead) {
	return {
		name: lead.name,
		email: lead.email,
		phone: lead.phone,
		message: lead.message,
		source: lead.source,
		...context(),
		company_website: lead.companyWebsite,
		token: FORM_SECRET,
	};
}

export function sendLeadToRelay(lead: RelayLead) {
	return fetch(RELAY_URL, {
		method: "POST",
		/* Simple request on purpose. See the note above, and do not "fix" this to
		   application/json, it will start failing CORS. */
		headers: { "Content-Type": "text/plain;charset=utf-8" },
		body: JSON.stringify(relayBody(lead)),
		/* Survives the visitor navigating away the moment they see the thanks. */
		keepalive: true,
	}).then(() => undefined);
}
