import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

/** Posts a contact-form or estimate inquiry to the lead-intake procedure. */
export function useSubmitLead() {
	return useMutation(orpc.leads.submit.mutationOptions());
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
