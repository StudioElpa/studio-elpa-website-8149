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

/** page + utm_*, read off the current URL at submit time. */
function context() {
	if (typeof window === "undefined") {
		return { page: "", utm_source: "", utm_medium: "", utm_campaign: "" };
	}
	const q = new URLSearchParams(window.location.search);
	return {
		page: window.location.pathname,
		utm_source: q.get("utm_source") ?? "",
		utm_medium: q.get("utm_medium") ?? "",
		utm_campaign: q.get("utm_campaign") ?? "",
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
