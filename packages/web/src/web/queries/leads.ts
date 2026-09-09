import { useMutation } from "@tanstack/react-query";
import { client, orpc } from "../lib/api";
import type { AppRouterClient } from "../../api";

/** The lead-intake procedure's input, taken from the router so it never drifts. */
export type LeadInput = Parameters<AppRouterClient["leads"]["submit"]>[0];

/** Posts a contact-form or estimate inquiry to the lead-intake procedure. */
export function useSubmitLead() {
	return useMutation(orpc.leads.submit.mutationOptions());
}

/**
 * Same procedure, same typed client, no hook.
 *
 * The contact form sits in #contact, far below the fold, and cannot be
 * submitted until someone scrolls to it and types. Reaching it through a hook
 * meant lib/api — and with it the whole @orpc client stack, 24 kB of it — sat
 * on the homepage's critical path. This lets the form pull the module in on
 * first focus instead, so first paint never pays for it. The estimate wizard
 * still uses the hook above: that page is already a lazy route, so the import
 * costs it nothing.
 */
export async function submitLeadDirect(input: LeadInput) {
	return client.leads.submit(input);
}

/** Reads utm_* off the current URL so campaign traffic is attributed in Attio. */
export function readUtm() {
	if (typeof window === "undefined") return { utmSource: "", utmMedium: "", utmCampaign: "" };
	const q = new URLSearchParams(window.location.search);
	return {
		utmSource: q.get("utm_source") ?? "",
		utmMedium: q.get("utm_medium") ?? "",
		utmCampaign: q.get("utm_campaign") ?? "",
	};
}
