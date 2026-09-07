/* ===========================================================================
   STUDIO ELPA — ESTIMATE ENGINE
   ---------------------------------------------------------------------------
   Ported number-for-number from the original estimate.html config block. Do
   not "tidy" these figures: they are the client's, not ours.

   All prices are RETAIL, from supplier retail price books:
     · 2024 Unique Roller Shades (Nov 2024)   · Unique Honeycomb (Dec 2021)
     · Sheer Shadings collection              · Automate (May 2022) / Somfy (Apr 2022)
   Anchors = price at [15 sqft (36x60), 24 sqft (48x72), 48 sqft (72x96)].
   lo = value-tier chart, hi = designer-tier chart. Edit numbers here only.

   ⚠ UNCONFIRMED, RAISE BEFORE LAUNCH — carried over from the original file:
     · DRAPERY prices are PLACEHOLDER assumptions (no drapery book was
       provided); confirm against the European workroom costs.
     · PRICE_ADJUST 0.70 shows estimates 30% below the book-derived figures
       (per Aviva, Jul 2026).
     · INSTALL and PROJECT_MIN are assumptions.
   These numbers are shown to real prospects, so they need Aviva's sign-off.
   =========================================================================== */

const SQFT_ANCHORS = [15, 24, 48] as const;

/** Estimates shown at 30% below book-derived figures (per Aviva, Jul 2026). */
const PRICE_ADJUST = 0.7;

/** Motorization is NOT priced here; it is quoted separately at consultation. */
const INCLUDE_MOTOR_IN_PRICE = false;

interface PriceRow {
	label: string;
	lo: [number, number, number];
	hi: [number, number, number];
	assumed?: boolean;
}

export const P: Record<string, PriceRow> = {
	// Charts 2 → 7
	roller_lf: { label: "Roller shade · light-filtering / sheer", lo: [158, 192, 365], hi: [301, 378, 722] },
	// Charts 3 → 10
	roller_bo: { label: "Roller shade · blackout", lo: [166, 209, 390], hi: [393, 573, 1037] },
	// Double Chart 1 → ~5
	daynight: { label: "Day-night double roller", lo: [517, 708, 1250], hi: [700, 950, 1650] },
	// Groups 1 → 4
	honeycomb: { label: "Honeycomb shade", lo: [293, 419, 745], hi: [381, 545, 969] },
	// Groups 3 → 4
	sheershade: { label: "Sheer shading (soft vanes)", lo: [1070, 1463, 2315], hi: [1307, 1853, 2723] },
	drape_sheer: {
		label: "Drapery · sheer linen (pair)",
		lo: [900, 1050, 1400],
		hi: [1500, 1750, 2300],
		assumed: true,
	},
	drape_bo: {
		label: "Drapery · lined / blackout (pair)",
		lo: [1300, 1500, 2000],
		hi: [2200, 2550, 3400],
		assumed: true,
	},
};

/** Automate Li-ion → Somfy class. */
const MOTOR = { shade_lo: 315, shade_hi: 660, drape_lo: 900, drape_hi: 1400 };

/** Per window. Assumption — edit. */
const INSTALL = { shade: 55, drape: 150 };

/** Assumption — edit. */
const PROJECT_MIN = 1500;

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
	{ v: "shades", b: "Shades", s: "Roller, day-night, honeycomb, clean and architectural." },
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
	["roller_lf", "Roller, light-filtering"],
	["roller_bo", "Roller, blackout"],
	["daynight", "Day-night (zebra)"],
	["honeycomb", "Honeycomb (insulating)"],
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

/** Linear interpolation over the sqft anchors, extrapolating past the top one. */
function interp(vals: readonly [number, number, number], sqft: number): number {
	const a = SQFT_ANCHORS;
	if (sqft <= a[0]) return vals[0];
	if (sqft >= a[2]) return vals[2] + ((vals[2] - vals[1]) / (a[2] - a[1])) * (sqft - a[2]);
	const i = sqft <= a[1] ? 0 : 1;
	return vals[i] + (vals[i + 1] - vals[i]) * ((sqft - a[i]) / (a[i + 1] - a[i]));
}

export function priceWin(type: string, w: number, h: number, motor: boolean) {
	const sqft = Math.max((w * h) / 144, 6);
	let lo = 0;
	let hi = 0;
	let mlo = 0;
	let mhi = 0;
	let inst = 0;

	const add = (key: string, isDrape: boolean) => {
		const row = P[key];
		if (!row) return;
		lo += interp(row.lo, sqft);
		hi += interp(row.hi, sqft);
		inst += isDrape ? INSTALL.drape : INSTALL.shade;
		if (motor && INCLUDE_MOTOR_IN_PRICE) {
			mlo += isDrape ? MOTOR.drape_lo : MOTOR.shade_lo;
			mhi += isDrape ? MOTOR.drape_hi : MOTOR.shade_hi;
		}
	};

	if (type === "combo_lfbo") {
		add("roller_lf", false);
		add("drape_bo", true);
	} else {
		add(type, type.startsWith("drape"));
	}

	return { lo: (lo + mlo + inst) * PRICE_ADJUST, hi: (hi + mhi + inst) * PRICE_ADJUST };
}

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

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
	lo: number;
	hi: number;
	windows: number;
	lines: EstimateLine[];
	anyMotor: boolean;
	anyAssumed: boolean;
}

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
		lo += p.lo * q;
		hi += p.hi * q;
		if (P[r.type]?.assumed || r.type === "combo_lfbo") anyAssumed = true;
		lines.push({
			key: r.id,
			room: r.room,
			label: labelFor(r.type),
			motor: r.m,
			w,
			h,
			q,
			lo: p.lo * q,
			hi: p.hi * q,
		});
	}

	lo = Math.max(lo, PROJECT_MIN);
	hi = Math.max(hi, lo);

	return {
		lo,
		hi,
		windows: rows.reduce((a, r) => a + Math.max(1, Number(r.q) || 1), 0),
		lines,
		anyMotor: rows.some((r) => r.m),
		anyAssumed,
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
		`ESTIMATE: $${fmt(i.est.lo)} – $${fmt(i.est.hi)} (${i.est.windows} windows; motorization NOT included in figure)`,
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
