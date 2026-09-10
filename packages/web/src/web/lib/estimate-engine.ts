/* ===========================================================================
   STUDIO ELPA — ESTIMATE ENGINE
   ---------------------------------------------------------------------------
   Every figure below is an ALL-IN range for one typical window of about
   40 sqft: fabrication, hardware, and standard installation included.
   Motorization is a separate flat adder, not scaled by size.

   Supplied by the client on 2026-09-10, replacing the supplier-price-book
   interpolation the original estimate.html used. Do not "tidy" these figures:
   they are the client's, not ours. Edit numbers here only.

   ⚠ THREE MAPPING CALLS ARE OURS, NOT THE CLIENT'S — confirm before launch:
     · "Sheers 250-700" is read as sheer DRAPERY panels (drape_sheer), a
       lighter make than the 675-1500 custom drapery. It could instead have
       meant a sheer shade product.
     · day-night, honeycomb, and sheer shading are selectable in the wizard
       and named in homepage copy, but appear in no client price band. Priced
       here at the nearest band and flagged `assumed`.
     · Aviva's sign-off on these six ranges is NOT yet confirmed in writing.
   These numbers are shown to real prospects.
   =========================================================================== */

/** The window the client's ranges describe. Everything scales off this. */
const BASE_SQFT = 40;

/** Size scaling is clamped: no window prices below 0.7x or above 1.8x base. */
const SIZE_MIN = 0.7;
const SIZE_MAX = 1.8;

interface PriceRow {
	label: string;
	/** All-in low and high for one ~40 sqft window. */
	lo: number;
	hi: number;
	assumed?: boolean;
}

export const P: Record<string, PriceRow> = {
	// Client band: solar / light-filtering shades.
	roller_lf: { label: "Shade · solar / light-filtering", lo: 300, hi: 700 },
	// Client band: roller / blackout shades.
	roller_bo: { label: "Shade · blackout", lo: 300, hi: 700 },
	// Client band: Roman shades.
	roman: { label: "Roman shade", lo: 300, hi: 500 },
	// Client band: natural woven shades.
	woven: { label: "Natural woven shade", lo: 300, hi: 500 },
	// No client band. Nearest is the roller/solar band. OUR ASSUMPTION.
	daynight: { label: "Day-night double shade", lo: 300, hi: 700, assumed: true },
	// No client band. Nearest is the roller/solar band. OUR ASSUMPTION.
	honeycomb: { label: "Honeycomb shade", lo: 300, hi: 700, assumed: true },
	// No client band. A premium soft-vane product, so priced with drapery. OUR ASSUMPTION.
	sheershade: { label: "Sheer shading (soft vanes)", lo: 675, hi: 1500, assumed: true },
	// Client band: sheers. Read as sheer drapery panels. OUR ASSUMPTION.
	drape_sheer: { label: "Drapery · sheer (pair)", lo: 250, hi: 700, assumed: true },
	// Client band: custom drapery, simple track included.
	drape_bo: { label: "Drapery · lined / blackout (pair)", lo: 675, hi: 1500 },
};

/** Flat per motorized window, whatever the size. */
const MOTOR = { lo: 300, hi: 1500 };

/** Below this, we show a starting point rather than a smaller number. */
const PROJECT_MIN = 1500;

/** Every figure shown to a visitor lands on a $25 step. */
const round25 = (n: number) => Math.round(n / 25) * 25;

/* ------------------------------- selections ------------------------------ */

export const GOALS = [
	{ v: "sleep", b: "Deeper sleep", s: "Blackout for bedrooms, darkness on your schedule." },
	{ v: "sun", b: "Tame the Florida sun", s: "Heat and brightness under control, view preserved." },
	{ v: "glare", b: "Glare on screens", s: "TV and work calls without squinting." },
	{ v: "privacy", b: "Privacy", s: "Comfortable evenings without feeling watched." },
	{
		v: "uv",
		b: "Protect furniture & floors",
		s: "UV quietly fades what you love. We can stop it.",
	},
	{
		v: "beauty",
		b: "I just love beautiful curtains",
		s: "An excellent reason. Maybe the best one.",
		em: true,
	},
	{ v: "motor", b: "Effortless mornings", s: "Motorized shades that move on schedule." },
	{ v: "notsure", b: "Not sure yet", s: "That's what the consultation is for." },
] as const;

export const PRODUCTS = [
	{ v: "shades", b: "Shades", s: "Solar, day-night, honeycomb, clean and architectural." },
	{ v: "drapery", b: "Drapery", s: "Custom curtains, tailored to the millimeter." },
	{
		v: "both",
		b: "Both, layered",
		s: "Shades for control, drapery for softness. The full effect.",
	},
	{ v: "guide", b: "Guide me", s: "We'll recommend from your goals.", em: true },
] as const;

export const ROOMS = [
	"Living room",
	"Primary bedroom",
	"Bedroom",
	"Nursery / kids",
	"Kitchen",
	"Dining",
	"Office",
	"Bathroom",
	"Slider / patio door",
	"Other",
] as const;

const SHADE_TYPES: Array<[string, string]> = [
	["roller_lf", "Solar or light-filtering"],
	["roller_bo", "Blackout"],
	["daynight", "Day-night (zebra)"],
	["honeycomb", "Honeycomb (insulating)"],
	["roman", "Roman shade"],
	["woven", "Natural woven"],
	["sheershade", "Sheer shading (soft vanes)"],
];

const DRAPE_TYPES: Array<[string, string]> = [
	["drape_sheer", "Drapery, sheer"],
	["drape_bo", "Drapery, blackout / lined"],
];

const COMBO_TYPES: Array<[string, string]> = [["combo_lfbo", "Shade + drapery (layered)"]];

/** Treatment options offered, narrowed by what the visitor said they want. */
export function typeOptions(product: string): Array<[string, string]> {
	if (product === "shades") return SHADE_TYPES;
	if (product === "drapery") return DRAPE_TYPES;
	return [...SHADE_TYPES, ...DRAPE_TYPES, ...COMBO_TYPES];
}

/** Pre-select the treatment their goals point at, so the form arrives helpful. */
export function smartDefault(goals: string[]): string {
	if (goals.includes("sleep")) return "roller_bo";
	if (goals.includes("beauty")) return "drape_sheer";
	if (goals.includes("sun") || goals.includes("glare") || goals.includes("uv")) return "roller_lf";
	return "roller_lf";
}

export function hintFor(type: string): string {
	const isDrape = type.startsWith("drape") || type.startsWith("combo");
	return isDrape
		? "Measure the window (or wall) width, and height from near the ceiling to the floor."
		: "Measure inside the window frame: width across, height top of frame to sill.";
}

export function labelFor(type: string): string {
	if (type === "combo_lfbo") return "Shade + drapery (layered)";
	const all = [...SHADE_TYPES, ...DRAPE_TYPES, ...COMBO_TYPES];
	return all.find(([v]) => v === type)?.[1] ?? type;
}

/* -------------------------------- pricing -------------------------------- */

export interface WindowRow {
	id: number;
	room: string;
	type: string;
	w: string;
	h: string;
	q: string;
	m: boolean;
}

/**
 * How much of the base ~40 sqft price this window carries. Clamped, so a tiny
 * window still pays for a real workroom run and a huge one does not run away.
 * The same factor scales lo and hi, which is what keeps lo below hi.
 */
function sizeFactor(w: number, h: number): number {
	const sqft = (w * h) / 144;
	if (!Number.isFinite(sqft) || sqft <= 0) return SIZE_MIN;
	return Math.min(SIZE_MAX, Math.max(SIZE_MIN, sqft / BASE_SQFT));
}

/**
 * One window, one treatment: the base band scaled by size, plus a flat
 * motorization adder that is deliberately NOT size-scaled.
 */
export function priceWin(type: string, w: number, h: number, motor: boolean) {
	const f = sizeFactor(w, h);
	let lo = 0;
	let hi = 0;

	const add = (key: string) => {
		const row = P[key];
		if (!row) return;
		lo += row.lo * f;
		hi += row.hi * f;
	};

	if (type === "combo_lfbo") {
		add("roller_lf");
		add("drape_bo");
	} else {
		add(type);
	}

	if (motor) {
		lo += MOTOR.lo;
		hi += MOTOR.hi;
	}

	return { lo, hi };
}

export const fmt = (n: number) => round25(n).toLocaleString("en-US");

export interface EstimateLine {
	key: number;
	room: string;
	label: string;
	motor: boolean;
	w: number;
	h: number;
	q: number;
	lo: number;
	hi: number;
}

export interface EstimateResult {
	/** True sum of the line items, never floored. */
	lo: number;
	hi: number;
	windows: number;
	lines: EstimateLine[];
	anyMotor: boolean;
	anyAssumed: boolean;
	/** The sum lands under the project minimum, so show a starting point instead. */
	belowMin: boolean;
	/** The starting point to show when `belowMin`. */
	minimum: number;
}

/**
 * Sums the windows. Line figures are rounded to $25 BEFORE they are summed, so
 * the headline is exactly the sum of the figures on screen: the old version
 * floored `lo` to the project minimum and then pulled `hi` up to match it,
 * which printed "$1,500 – $1,500" over a line reading "$254 – $464".
 */
export function computeEstimate(rows: WindowRow[]): EstimateResult {
	let lo = 0;
	let hi = 0;
	let anyAssumed = false;
	const lines: EstimateLine[] = [];

	for (const r of rows) {
		const w = Number(r.w);
		const h = Number(r.h);
		const q = Math.max(1, Number(r.q) || 1);
		const p = priceWin(r.type, w, h, r.m);
		const lineLo = round25(p.lo * q);
		const lineHi = round25(p.hi * q);
		lo += lineLo;
		hi += lineHi;
		if (P[r.type]?.assumed || r.type === "combo_lfbo") anyAssumed = true;
		lines.push({
			key: r.id,
			room: r.room,
			label: labelFor(r.type),
			motor: r.m,
			w,
			h,
			q,
			lo: lineLo,
			hi: lineHi,
		});
	}

	return {
		lo,
		hi,
		windows: rows.reduce((a, r) => a + Math.max(1, Number(r.q) || 1), 0),
		lines,
		anyMotor: rows.some((r) => r.m),
		anyAssumed,
		belowMin: lo < PROJECT_MIN,
		minimum: PROJECT_MIN,
	};
}

/* ----------------------- internal lead scoring --------------------------- */

/** Never shown to the visitor. It rides along in the note that reaches Aviva. */
export function leadScore(
	est: EstimateResult,
	rows: WindowRow[],
	role: string,
	timeline: string,
	smsOk: boolean,
) {
	let s = 0;
	const why: string[] = [];
	const n = est.windows;

	if (n >= 6) {
		s += 25;
		why.push(`${n} windows`);
	} else if (n >= 3) {
		s += 15;
		why.push(`${n} windows`);
	} else {
		s += 5;
	}

	if (rows.some((r) => r.m)) {
		s += 15;
		why.push("motorization");
	}

	if (timeline === "asap") {
		s += 20;
		why.push("ASAP timeline");
	} else if (timeline === "1-3") {
		s += 15;
		why.push("1-3mo");
	} else if (timeline === "3-6") {
		s += 8;
	}

	if (role === "designer" || role === "builder") {
		s += 20;
		why.push(`trade: ${role}`);
	} else if (role === "homeowner") {
		s += 10;
	} else if (role === "renter") {
		s -= 10;
		why.push("renter");
	}

	if (est.hi > 10000) {
		s += 20;
		why.push("est >$10k");
	} else if (est.hi > 5000) {
		s += 12;
		why.push("est >$5k");
	} else if (est.hi > 2500) {
		s += 6;
	}

	if (smsOk) s += 5;

	const tier = s >= 70 ? "A · call today" : s >= 40 ? "B · follow up within 24h" : "C · nurture gently";
	return { s, tier, why };
}

/* --------------------------- recommendation ------------------------------ */

const RECO: Array<[string[], string]> = [
	[
		["sleep"],
		"For deeper sleep, we'd look at true blackout in the bedrooms, fitted tight to the glass or paired with drapery so the light has nowhere to slip through. Darkness you control is the fastest quality-of-life upgrade a bedroom can get.",
	],
	[
		["sun", "glare"],
		"For the Florida sun, screen and light-filtering fabrics tame heat and glare while keeping your view, the room stays bright, just kinder.",
	],
	[
		["uv"],
		"Your furniture and floors will thank you: the same fabrics that soften glare block the UV that quietly fades wood, art, and upholstery.",
	],
	[
		["privacy"],
		"For privacy, day-night and light-filtering fabrics give you evenings that feel enclosed without living in the dark.",
	],
	[
		["beauty"],
		"And since you love curtains, so do we. European linen, sewn to the millimeter, changes a room the way nothing else does.",
	],
	[
		["motor"],
		"Motorization means the house wakes up gently on schedule, and no cords anywhere, which is the safest configuration for children and pets.",
	],
];

export function recoText(goals: string[]): string {
	const parts = RECO.filter(([keys]) => keys.some((k) => goals.includes(k))).map(([, text]) => text);
	if (!parts.length) {
		parts.push(
			"From what you've shared, we'd start with a conversation about how each room is used, that's where the right answer always comes from.",
		);
	}
	return parts.join(" ");
}

const GOAL_WORDS: Record<string, string> = {
	sleep: "better sleep",
	sun: "relief from the sun",
	glare: "less glare",
	privacy: "more privacy",
	uv: "protection for your furnishings",
	beauty: "beautiful curtains",
	motor: "effortless mornings",
	notsure: "an expert opinion",
};

export function goalWords(goals: string[]): string {
	const g = goals.map((x) => GOAL_WORDS[x]).filter(Boolean);
	if (g.length > 1) return `${g.slice(0, -1).join(", ")} and ${g[g.length - 1]}`;
	return g[0] ?? "a better-feeling home";
}

/* ------------------------- summary sent to Aviva ------------------------- */

export interface SummaryInput {
	name: string;
	email: string;
	phone: string;
	role: string;
	timeline: string;
	area: string;
	notes: string;
	goals: string[];
	smsOk: boolean;
	est: EstimateResult;
	rows: WindowRow[];
}

/**
 * The internal summary. The original used "—" for empty values, which the brief
 * bans site-wide, so blanks read "not provided" now.
 */
export function buildSummary(i: SummaryInput): string {
	const score = leadScore(i.est, i.rows, i.role, i.timeline, i.smsOk);
	const lines = [
		`New estimate request, ${i.name}`,
		"",
		`LEAD SCORE: ${score.s} · Tier ${score.tier}`,
		`Signals: ${score.why.join(", ") || "none"}`,
		"",
		`Contact: ${i.email} · ${i.phone || "no phone"} · SMS/call OK: ${i.smsOk ? "YES" : "no"}`,
		`Role: ${i.role} · Timeline: ${i.timeline} · Area: ${i.area || "not provided"}`,
		`Goals: ${i.goals.join(", ")}`,
		`Notes: ${i.notes || "not provided"}`,
		"",
		`ESTIMATE: ${fmt(i.est.lo)} – ${fmt(i.est.hi)} (${i.est.windows} windows; ${
			i.est.anyMotor
				? "includes a $300-$1,500 motorization allowance per motorized window"
				: "no motorization selected"
		})`,
		...(i.est.belowMin
			? [
					`NOTE: under the ${fmt(i.est.minimum)} project minimum, so the visitor was shown a ${fmt(
						i.est.minimum,
					)} starting point, not the summed figure.`,
				]
			: []),
		...i.est.lines.map(
			(l) => ` · ${l.room}: ${l.label}${l.motor ? " MOTORIZED" : ""} ${l.w}x${l.h}" x${l.q}`,
		),
		"",
		`Consent: privacy YES${i.smsOk ? ", TCPA phone/SMS YES" : ""}, ${new Date().toISOString()}`,
	];
	return lines.join("\n");
}

/** Estimate roles → the same Contact type options the contact form sends Attio. */
export const ROLE_TO_CONTACT_TYPE: Record<string, string> = {
	homeowner: "A homeowner",
	designer: "An interior designer / trade partner",
	builder: "An architect or builder",
	renter: "Other",
};
