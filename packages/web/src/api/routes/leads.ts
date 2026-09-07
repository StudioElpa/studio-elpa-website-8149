import { z } from "zod";
import { base } from "../__core/app";

/* ===========================================================================
   LEAD INTAKE — Attio CRM + transitional fallbacks
   ---------------------------------------------------------------------------
   Every inquiry on the site (contact form + estimate wizard) posts here.
   Three sinks, tried independently so one failing never loses the lead:

     1. Attio   — Person (upsert by email) → Company (trade only) → Deal → Note
     2. Formspree — the endpoint the old static site used; emails Aviva
     3. Apps Script → Google Sheet — the sheet behind AppSheet

   Attio is entirely config-driven. With no ATTIO_API_KEY the Attio block is
   skipped, the fallbacks still run, and the visitor still gets a success
   response. Dropping the key + stage ids into the root .env later turns it on
   with zero code change.

   Attio ↔ Google Workspace email/calendar sync is configured inside Attio's
   own settings, not here. See README.
   =========================================================================== */

const ATTIO_API = "https://api.attio.com/v2";

/**
 * Attribute slugs Attio derives from the attribute names in the setup
 * checklist. If Aviva names an attribute differently in Attio, change it here
 * — nothing else in the codebase references these.
 */
const SLUG = {
	person: {
		projectArea: "project_area",
		leadSource: "lead_source",
		contactType: "contact_type",
		tradePartner: "trade_partner",
	},
	deal: {
		sourcePage: "source_page",
		projectArea: "project_area",
		inquirySummary: "inquiry_summary",
		utmSource: "utm_source",
		utmCampaign: "utm_campaign",
	},
} as const;

/** Form's "You are…" values → the Contact type select options in Attio. */
const CONTACT_TYPE: Record<string, string> = {
	"A homeowner": "Homeowner",
	"An interior designer / trade partner": "Designer / Trade",
	"An architect or builder": "Architect / Builder",
	Other: "Other",
};

const TRADE_TYPES = new Set(["An interior designer / trade partner", "An architect or builder"]);

export const leadInput = z.object({
	name: z.string().trim().min(1).max(200),
	email: z.string().trim().email().max(320),
	phone: z.string().trim().max(60).optional().default(""),
	area: z.string().trim().max(200).optional().default(""),
	type: z.string().trim().max(120).optional().default("A homeowner"),
	message: z.string().trim().max(5000).optional().default(""),
	/** Which page the inquiry came from, e.g. "/index.html" or "/estimate.html". */
	sourcePage: z.string().trim().max(300).optional().default(""),
	/** ISO timestamp captured client-side. */
	submittedAt: z.string().trim().max(60).optional().default(""),
	utmSource: z.string().trim().max(200).optional().default(""),
	utmMedium: z.string().trim().max(200).optional().default(""),
	utmCampaign: z.string().trim().max(200).optional().default(""),
	/** Estimate wizard only: the rendered estimate summary, appended to the Note. */
	estimate: z.string().trim().max(4000).optional().default(""),
	/** Honeypot. Bots fill it, humans never see it. */
	trap: z.string().max(200).optional().default(""),
});

type Lead = z.infer<typeof leadInput>;

interface SinkResult {
	attio: "ok" | "skipped" | "failed";
	formspree: "ok" | "skipped" | "failed";
	sheet: "ok" | "skipped" | "failed";
}

/* --------------------------------- Attio --------------------------------- */

async function attio(path: string, method: "POST" | "PUT", body: unknown, key: string) {
	const res = await fetch(`${ATTIO_API}${path}`, {
		method,
		headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		throw new Error(`Attio ${method} ${path} → ${res.status} ${await res.text()}`);
	}
	return (await res.json()) as { data?: { id?: { record_id?: string } } };
}

/** Only send attributes that actually have a value — empty strings pollute Attio. */
function present(values: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(values).filter(([, v]) => v !== "" && v !== undefined && v !== null),
	);
}

function noteBody(lead: Lead) {
	const lines = [
		`Name: ${lead.name}`,
		`Email: ${lead.email}`,
		lead.phone && `Phone: ${lead.phone}`,
		lead.area && `Project area: ${lead.area}`,
		`You are: ${lead.type}`,
		"",
		"Message:",
		lead.message || "(none provided)",
	];

	if (lead.estimate) lines.push("", "Estimate shown to the visitor:", lead.estimate);

	lines.push(
		"",
		`Source page: ${lead.sourcePage || "unknown"}`,
		`Submitted at: ${lead.submittedAt || new Date().toISOString()}`,
	);

	const utm = [
		lead.utmSource && `utm_source=${lead.utmSource}`,
		lead.utmMedium && `utm_medium=${lead.utmMedium}`,
		lead.utmCampaign && `utm_campaign=${lead.utmCampaign}`,
	].filter(Boolean);
	if (utm.length) lines.push(`UTM: ${utm.join(" · ")}`);

	return lines.filter((l) => l !== false && l !== undefined).join("\n");
}

async function pushToAttio(lead: Lead, key: string) {
	const isTrade = TRADE_TYPES.has(lead.type);

	// 1. Person — upsert on email so a repeat inquiry updates one record.
	const person = await attio(
		"/objects/people/records?matching_attribute=email_addresses",
		"PUT",
		{
			data: {
				values: present({
					name: [{ full_name: lead.name }],
					email_addresses: [{ email_address: lead.email }],
					...(lead.phone ? { phone_numbers: [{ original_phone_number: lead.phone }] } : {}),
					[SLUG.person.projectArea]: lead.area,
					[SLUG.person.leadSource]: "Website",
					[SLUG.person.contactType]: CONTACT_TYPE[lead.type] ?? "Other",
					[SLUG.person.tradePartner]: isTrade,
				}),
			},
		},
		key,
	);
	const personId = person.data?.id?.record_id;

	// 2. Company — trade partners only, so designers can be nurtured separately.
	let companyId: string | undefined;
	if (isTrade) {
		const firm = lead.area ? `${lead.name} (${lead.area})` : lead.name;
		const company = await attio(
			"/objects/companies/records?matching_attribute=name",
			"PUT",
			{ data: { values: present({ name: firm }) } },
			key,
		);
		companyId = company.data?.id?.record_id;
	}

	// 3. Deal. The checklist's naming convention uses an em dash; the site holds
	//    a strict no-em-dash rule, so this internal record title uses a hyphen.
	const pipelineId = process.env.ATTIO_PIPELINE_ID;
	const stageId = process.env.ATTIO_STAGE_NEW_LEAD;

	const deal = await attio(
		"/objects/deals/records",
		"POST",
		{
			data: {
				values: present({
					name: `Website inquiry - ${lead.name}`,
					...(stageId ? { stage: stageId } : {}),
					...(pipelineId ? { pipeline: pipelineId } : {}),
					...(personId ? { associated_people: [{ target_record_id: personId }] } : {}),
					...(companyId ? { associated_company: [{ target_record_id: companyId }] } : {}),
					[SLUG.deal.sourcePage]: lead.sourcePage,
					[SLUG.deal.projectArea]: lead.area,
					[SLUG.deal.inquirySummary]: lead.message,
					[SLUG.deal.utmSource]: lead.utmSource,
					[SLUG.deal.utmCampaign]: lead.utmCampaign,
				}),
			},
		},
		key,
	);
	const dealId = deal.data?.id?.record_id;

	// 4. Note with the submission verbatim, so nothing is ever lost to mapping.
	const parent = dealId
		? { parent_object: "deals", parent_record_id: dealId }
		: personId
			? { parent_object: "people", parent_record_id: personId }
			: null;

	if (parent) {
		await attio(
			"/notes",
			"POST",
			{
				data: {
					...parent,
					title: `Website inquiry - ${lead.name}`,
					format: "plaintext",
					content: noteBody(lead),
				},
			},
			key,
		);
	}
}

/* ------------------------------- fallbacks ------------------------------- */

function flatFields(lead: Lead, source: string) {
	return {
		name: lead.name,
		email: lead.email,
		phone: lead.phone,
		area: lead.area,
		type: lead.type,
		message: lead.message,
		estimate: lead.estimate,
		source,
		source_page: lead.sourcePage,
		submitted_at: lead.submittedAt || new Date().toISOString(),
		utm_source: lead.utmSource,
		utm_medium: lead.utmMedium,
		utm_campaign: lead.utmCampaign,
	};
}

async function pushToFormspree(lead: Lead, endpoint: string, source: string) {
	const res = await fetch(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json", Accept: "application/json" },
		body: JSON.stringify(flatFields(lead, source)),
	});
	if (!res.ok) throw new Error(`Formspree → ${res.status} ${await res.text()}`);
}

async function pushToSheet(lead: Lead, endpoint: string, source: string) {
	const form = new URLSearchParams();
	for (const [k, v] of Object.entries(flatFields(lead, source))) form.append(k, String(v ?? ""));
	const res = await fetch(endpoint, { method: "POST", body: form });
	if (!res.ok) throw new Error(`Sheet → ${res.status}`);
}

/* -------------------------------- handler -------------------------------- */

export const leads = {
	submit: base
		.input(leadInput)
		.handler(async ({ input }) => {
			// Honeypot: accept and discard, so bots get no signal from the response.
			if (input.trap) {
				return { ok: true, sinks: { attio: "skipped", formspree: "skipped", sheet: "skipped" } };
			}

			const source = input.estimate ? "Estimate" : "Contact";
			const sinks: SinkResult = { attio: "skipped", formspree: "skipped", sheet: "skipped" };

			const key = process.env.ATTIO_API_KEY;
			const formspree = process.env.FORMSPREE_ENDPOINT;
			const sheet = process.env.SHEET_ENDPOINT;

			const jobs: Promise<void>[] = [];

			if (key) {
				jobs.push(
					pushToAttio(input, key).then(
						() => {
							sinks.attio = "ok";
						},
						(err: unknown) => {
							sinks.attio = "failed";
							console.error("[leads] attio:", err);
						},
					),
				);
			}

			if (formspree) {
				jobs.push(
					pushToFormspree(input, formspree, source).then(
						() => {
							sinks.formspree = "ok";
						},
						(err: unknown) => {
							sinks.formspree = "failed";
							console.error("[leads] formspree:", err);
						},
					),
				);
			}

			if (sheet) {
				jobs.push(
					pushToSheet(input, sheet, source).then(
						() => {
							sinks.sheet = "ok";
						},
						(err: unknown) => {
							sinks.sheet = "failed";
							console.error("[leads] sheet:", err);
						},
					),
				);
			}

			await Promise.all(jobs);

			const delivered = Object.values(sinks).some((s) => s === "ok");
			const attempted = Object.values(sinks).some((s) => s !== "skipped");

			// Only report failure when every configured sink rejected the lead —
			// that's the case where the visitor genuinely needs to email instead.
			if (attempted && !delivered) {
				console.error("[leads] every sink failed", { email: input.email, sinks });
				return { ok: false as const, sinks };
			}

			if (!attempted) {
				console.warn("[leads] no sink configured; lead logged only", flatFields(input, source));
			}

			return { ok: true as const, sinks };
		}),
};
