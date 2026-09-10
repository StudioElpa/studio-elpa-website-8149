import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CONTACT, Logo } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";
import { RELAY_SOURCE, sendLeadToRelay } from "../lib/lead-relay";
import { readUtm, useSubmitLead } from "../queries/leads";
import {
	GOALS,
	PRODUCTS,
	ROLE_TO_CONTACT_TYPE,
	ROOMS,
	buildSummary,
	computeEstimate,
	fmt,
	goalWords,
	hintFor,
	recoText,
	smartDefault,
	typeOptions,
	type EstimateResult,
	type WindowRow,
} from "../lib/estimate-engine";

/* ===========================================================================
   ESTIMATE WIZARD
   ---------------------------------------------------------------------------
   Copy ported verbatim from the original estimate.html. All arithmetic lives
   in lib/estimate-engine.ts, so this file is UI and state only.

   Two deliberate changes from the original, both recorded in the QA note:

   1. The original required a second click ("Send this to Studio Elpa") on the
      results screen before anything was sent, and fell back to a mailto: if
      the fetch failed. Consent is already given and explicit at step 5, so
      the submission now fires when the visitor presses "See my estimate".
      Step 6 shows a confirmation line instead of a send button.
   2. The privacy link pointed at the absolute https://studioelpa.com/privacy.
      It now points at this site's own /privacy.html.
   =========================================================================== */

const ROLES: Array<[string, string]> = [
	["homeowner", "The homeowner"],
	["designer", "An interior designer"],
	["builder", "A builder / contractor"],
	["renter", "Renting my home"],
];

const TIMELINES: Array<[string, string]> = [
	["asap", "As soon as possible"],
	["1-3", "Within 1-3 months"],
	["3-6", "In 3-6 months"],
	["browsing", "Just exploring for now"],
];

const TOTAL_STEPS = 6;

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function EstimatePage() {
	const root = usePageMotion<HTMLDivElement>();
	const heading = useRef<HTMLHeadingElement>(null);
	const firstRender = useRef(true);

	const [step, setStep] = useState(1);
	const [error, setError] = useState("");

	const [goals, setGoals] = useState<string[]>([]);
	const [product, setProduct] = useState("");
	const [rows, setRows] = useState<WindowRow[]>([]);
	const nextId = useRef(1);

	const [role, setRole] = useState("");
	const [timeline, setTimeline] = useState("");
	const [zip, setZip] = useState("");
	const [notes, setNotes] = useState("");

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [privacyOk, setPrivacyOk] = useState(false);
	const [smsOk, setSmsOk] = useState(false);

	const [result, setResult] = useState<EstimateResult | null>(null);
	const [sendFailed, setSendFailed] = useState(false);

	const submit = useSubmitLead();

	/* Focus the new step's heading and return to the top of the page. Focus
	   moves for keyboard and screen-reader users; the scroll is instant under
	   reduced motion. */
	useLayoutEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		heading.current?.focus();
		const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
	}, [step]);

	function makeRow(): WindowRow {
		const id = nextId.current++;
		return {
			id,
			room: ROOMS[0],
			type: smartDefault([...goals]),
			w: "",
			h: "",
			q: "1",
			m: goals.includes("motor"),
		};
	}

	function addRow() {
		setRows((r) => [...r, makeRow()]);
	}

	function removeRow(id: number) {
		setRows((r) => r.filter((x) => x.id !== id));
	}

	function patchRow(id: number, patch: Partial<WindowRow>) {
		setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
	}

	/* Changing the product choice can narrow the treatment list past what a
	   window row already holds. Remap those rows to the first offered option so
	   no row can carry a treatment the visitor can no longer see. */
	function narrowRowTypes(nextProduct: string) {
		const options = typeOptions(nextProduct);
		setRows((r) =>
			r.map((x) => (options.some(([v]) => v === x.type) ? x : { ...x, type: options[0][0] })),
		);
	}

	function toggleGoal(v: string) {
		setError("");
		setGoals((g) => (g.includes(v) ? g.filter((x) => x !== v) : [...g, v]));
	}

	/** Validation gates, one per step, mirroring the original go() function. */
	function validateStep(n: number): string {
		if (n === 1 && goals.length === 0) return 'Choose at least one, even "not sure" counts.';
		if (n === 2 && !product) return "Pick one to continue.";
		if (n === 3) {
			const ok =
				rows.length > 0 &&
				rows.every((r) => {
					const w = Number(r.w);
					const h = Number(r.h);
					return r.type && w >= 12 && w <= 300 && h >= 12 && h <= 240;
				});
			if (!ok) return "Each window needs a type and both measurements (numbers in inches).";
		}
		if (n === 4 && (!role || !timeline))
			return "Please tell us who you are and your rough timeline.";
		return "";
	}

	function go(n: number) {
		setError("");
		if (n > step) {
			const problem = validateStep(step);
			if (problem) {
				setError(problem);
				return;
			}
		}
		if (n === 3 && rows.length === 0) setRows([makeRow()]);
		setStep(n);
	}

	/** Step 5 → results. Computes the range, then sends the lead immediately. */
	function finish() {
		setError("");
		if (!name.trim() || !emailOk(email.trim()) || !privacyOk) {
			setError("We need your name, a valid email, and the required consent box.");
			return;
		}

		const est = computeEstimate(rows);
		setResult(est);
		setSendFailed(false);
		setStep(6);

		const summary = buildSummary({
			name: name.trim(),
			email: email.trim(),
			phone: phone.trim(),
			role,
			timeline,
			area: zip.trim(),
			notes: notes.trim(),
			goals,
			smsOk,
			est,
			rows,
		});

		/* Relay first, fire and forget: step 6 is already on screen. The mutation
		   below is the secondary path, and only runs if the relay request never
		   reached the network. */
		sendLeadToRelay({
			name: name.trim(),
			email: email.trim(),
			phone: phone.trim(),
			message: summary,
			source: RELAY_SOURCE.estimate,
			companyWebsite: "",
		}).catch(() => sendViaServer(summary));
	}

	/** The old oRPC submission, now the fallback. */
	function sendViaServer(summary: string) {
		submit.mutate(
			{
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim(),
				area: zip.trim(),
				type: ROLE_TO_CONTACT_TYPE[role] ?? "Other",
				message: notes.trim(),
				sourcePage: "/estimate.html",
				submittedAt: new Date().toISOString(),
				estimate: summary,
				trap: "",
				...readUtm(),
			},
			{ onError: () => setSendFailed(true) },
		);
	}

	return (
		<div className="page-estimate" ref={root}>
			<PageSeo path="/estimate.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>

			<header className="est-head" data-hero>
				<Link href="/index.html" aria-label="Studio Elpa home">
					<Logo variant="header" height={44} className="est-logo" />
				</Link>
				<div className="k">Studio Elpa · Complimentary Estimate</div>
				<h1>
					Let's find out what your
					<br />
					windows are asking for.
				</h1>
				<p>
					Five quiet questions, two minutes, and a ballpark you can trust. No pressure, no
					obligation, just a starting point.
				</p>
			</header>

			<p className="visually-hidden">{`Step ${step} of ${TOTAL_STEPS}`}</p>
			<div className="prog" aria-hidden="true">
				{Array.from({ length: TOTAL_STEPS }, (_, i) => (
					<i key={i} className={i < step ? "on" : undefined} />
				))}
			</div>

			<main id="main">
				<div className="est-wrap">
					{step === 1 && (
						<section className="step on" aria-labelledby="s1">
							<h2 id="s1" ref={heading} tabIndex={-1}>
								First, what would make your rooms feel better?
							</h2>
							<p className="sub">
								Choose everything that applies. This matters more to us than what you buy: it
								tells us what your home needs.
							</p>
							<div className="choices">
								{GOALS.map((g) => (
									<button
										key={g.v}
										type="button"
										className="choice"
										aria-pressed={goals.includes(g.v)}
										onClick={() => toggleGoal(g.v)}
									>
										<b>{g.b}</b>
										<span className={"em" in g && g.em ? "em" : undefined}>{g.s}</span>
									</button>
								))}
							</div>
							<StepError message={error} />
							<div className="step-nav">
								<span />
								<button type="button" className="btn" onClick={() => go(2)}>
									Continue
								</button>
							</div>
						</section>
					)}

					{step === 2 && (
						<section className="step on" aria-labelledby="s2">
							<h2 id="s2" ref={heading} tabIndex={-1}>
								What are you drawn to?
							</h2>
							<p className="sub">
								If you're not certain, choose "Guide me", we'll suggest based on your answers.
							</p>
							<div className="choices">
								{PRODUCTS.map((p) => (
									<button
										key={p.v}
										type="button"
										className="choice"
										aria-pressed={product === p.v}
										onClick={() => {
											setError("");
											setProduct(p.v);
											narrowRowTypes(p.v);
										}}
									>
										<b>{p.b}</b>
										<span className={"em" in p && p.em ? "em" : undefined}>{p.s}</span>
									</button>
								))}
							</div>
							<StepError message={error} />
							<div className="step-nav">
								<button type="button" className="btn ghost" onClick={() => go(1)}>
									Back
								</button>
								<button type="button" className="btn" onClick={() => go(3)}>
									Continue
								</button>
							</div>
						</section>
					)}

					{step === 3 && (
						<section className="step on" aria-labelledby="s3">
							<h2 id="s3" ref={heading} tabIndex={-1}>
								Now, the windows themselves.
							</h2>
							<p className="sub">
								Rough measurements are perfectly fine, a metal tape and thirty seconds per
								window. We take exact measurements ourselves before anything is ordered.
								<br />
								<br />
								<b style={{ fontWeight: 500 }}>For shades:</b> measure <i>inside</i> the window
								frame, width × height.&nbsp;
								<b style={{ fontWeight: 500 }}>For drapery:</b> width of the window (or wall),
								and height from where the rod would hang, usually near the ceiling,{" "}
								<i>to the floor</i>.
							</p>

							{rows.map((r, i) => (
								<WindowFields
									key={r.id}
									row={r}
									index={i}
									product={product}
									onChange={(patch) => patchRow(r.id, patch)}
									onRemove={i > 0 ? () => removeRow(r.id) : undefined}
								/>
							))}

							<button type="button" className="add" onClick={addRow}>
								+ Add another window or room
							</button>
							<StepError message={error} />
							<div className="step-nav">
								<button type="button" className="btn ghost" onClick={() => go(2)}>
									Back
								</button>
								<button type="button" className="btn" onClick={() => go(4)}>
									Continue
								</button>
							</div>
						</section>
					)}

					{step === 4 && (
						<section className="step on" aria-labelledby="s4">
							<h2 id="s4" ref={heading} tabIndex={-1}>
								A little about the project.
							</h2>
							<p className="sub">This helps us prepare properly for you.</p>
							<div className="row">
								<div className="fld">
									<label id="est-role-l" htmlFor="est-role">You are…</label>
									<select
										id="est-role" aria-labelledby="est-role-l"
										value={role}
										onChange={(e) => {
											setError("");
											setRole(e.target.value);
										}}
									>
										<option value="">Select…</option>
										{ROLES.map(([v, l]) => (
											<option key={v} value={v}>
												{l}
											</option>
										))}
									</select>
								</div>
								<div className="fld">
									<label id="est-timeline-l" htmlFor="est-timeline">Timeline</label>
									<select
										id="est-timeline" aria-labelledby="est-timeline-l"
										value={timeline}
										onChange={(e) => {
											setError("");
											setTimeline(e.target.value);
										}}
									>
										<option value="">Select…</option>
										{TIMELINES.map(([v, l]) => (
											<option key={v} value={v}>
												{l}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="row">
								<div className="fld">
									<label id="est-zip-l" htmlFor="est-zip">City or ZIP</label>
									<input
										id="est-zip" aria-labelledby="est-zip-l"
										value={zip}
										onChange={(e) => setZip(e.target.value)}
										placeholder="e.g., Boca Raton or 33432"
										autoComplete="postal-code"
									/>
								</div>
								<div className="fld">
									<label id="est-notes-l" htmlFor="est-notes">Anything we should know? (optional)</label>
									<input
										id="est-notes" aria-labelledby="est-notes-l"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="High windows, a nursery, a view you love…"
									/>
								</div>
							</div>
							<StepError message={error} />
							<div className="step-nav">
								<button type="button" className="btn ghost" onClick={() => go(3)}>
									Back
								</button>
								<button type="button" className="btn" onClick={() => go(5)}>
									Continue
								</button>
							</div>
						</section>
					)}

					{step === 5 && (
						<section className="step on" aria-labelledby="s5">
							<h2 id="s5" ref={heading} tabIndex={-1}>
								Where should we send your estimate?
							</h2>
							<p className="sub">
								Your range appears on the next screen instantly, and Aviva will follow up
								personally within one business day.
							</p>
							<div className="row">
								<div className="fld">
									<label id="est-name-l" htmlFor="est-name">Name</label>
									<input
										id="est-name" aria-labelledby="est-name-l"
										value={name}
										onChange={(e) => {
											setError("");
											setName(e.target.value);
										}}
										autoComplete="name"
									/>
								</div>
								<div className="fld">
									<label id="est-email-l" htmlFor="est-email">Email</label>
									<input
										id="est-email" aria-labelledby="est-email-l"
										type="email"
										value={email}
										onChange={(e) => {
											setError("");
											setEmail(e.target.value);
										}}
										autoComplete="email"
									/>
								</div>
								<div className="fld">
									<label id="est-phone-l" htmlFor="est-phone">Phone (optional)</label>
									<input
										id="est-phone" aria-labelledby="est-phone-l"
										type="tel"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										autoComplete="tel"
									/>
								</div>
							</div>

							<div className="consent">
								<label htmlFor="est-privacy">
									<input
										id="est-privacy" aria-labelledby="est-privacy-l"
										type="checkbox"
										checked={privacyOk}
										onChange={(e) => {
											setError("");
											setPrivacyOk(e.target.checked);
										}}
									/>
									<span id="est-privacy-l">
										I agree that Studio Elpa may use the information above to prepare my
										estimate and contact me about it by email. See our{" "}
										<a href="/privacy.html" target="_blank" rel="noopener">
											Privacy Policy
										</a>
										. <b style={{ color: "var(--ink)", fontWeight: 500 }}>(required)</b>
									</span>
								</label>
								<label htmlFor="est-sms">
									<input
										id="est-sms" aria-labelledby="est-sms-l"
										type="checkbox"
										checked={smsOk}
										onChange={(e) => setSmsOk(e.target.checked)}
									/>
									<span id="est-sms-l">
										I'd also like to be reached by phone or text about my estimate. Message
										and data rates may apply; consent is not a condition of purchase and I
										can opt out anytime.{" "}
										<b style={{ color: "var(--ink)", fontWeight: 500 }}>(optional)</b>
									</span>
								</label>
								<div className="privacy-note">
									What happens to your data: we use it only to prepare and discuss your
									estimate. We don't sell it, share it with advertisers, or add you to any
									list you didn't ask for. Nothing is stored in your browser; your details
									are sent to us only when you press the button below. Ask us to delete them
									anytime at {CONTACT.email}.
								</div>
							</div>

							<StepError message={error} />
							<div className="step-nav">
								<button type="button" className="btn ghost" onClick={() => go(4)}>
									Back
								</button>
								<button type="button" className="btn" onClick={finish}>
									See my estimate
								</button>
							</div>
						</section>
					)}

					{step === 6 && result && (
						<Results
							result={result}
							name={name}
							goals={goals}
							pending={submit.isPending}
							failed={sendFailed}
							headingRef={heading}
						/>
					)}

					<Link href="/index.html" className="est-nav-back">
						← Back to Studio Elpa
					</Link>
				</div>
			</main>
		</div>
	);
}

/* ------------------------------------------------------------------ pieces */

function StepError({ message }: { message: string }) {
	if (!message) return null;
	return (
		<div className="errmsg" role="alert">
			{message}
		</div>
	);
}

interface WindowFieldsProps {
	row: WindowRow;
	index: number;
	product: string;
	onChange: (patch: Partial<WindowRow>) => void;
	onRemove?: () => void;
}

function WindowFields({ row, index, product, onChange, onRemove }: WindowFieldsProps) {
	const options = typeOptions(product);
	const n = index + 1;

	return (
		<div className="win">
			{onRemove && (
				<button
					type="button"
					className="rm"
					onClick={onRemove}
					title="Remove"
					aria-label={`Remove window ${n}`}
				>
					×
				</button>
			)}
			<div className="row">
				<div className="fld">
					<label id={`w-room-${row.id}-l`} htmlFor={`w-room-${row.id}`}>Room</label>
					<select
						id={`w-room-${row.id}`}
						aria-labelledby={`w-room-${row.id}-l`}
						value={row.room}
						onChange={(e) => onChange({ room: e.target.value })}
					>
						{ROOMS.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</div>
				<div className="fld">
					<label id={`w-type-${row.id}-l`} htmlFor={`w-type-${row.id}`}>Treatment</label>
					<select
						id={`w-type-${row.id}`}
						aria-labelledby={`w-type-${row.id}-l`}
						value={row.type}
						onChange={(e) => onChange({ type: e.target.value })}
					>
						{options.map(([v, l]) => (
							<option key={v} value={v}>
								{l}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="row">
				<div className="fld">
					<label id={`w-w-${row.id}-l`} htmlFor={`w-w-${row.id}`}>Width (inches)</label>
					<input
						id={`w-w-${row.id}`}
						aria-labelledby={`w-w-${row.id}-l`}
						type="number"
						min={12}
						max={300}
						placeholder="e.g., 36"
						value={row.w}
						onChange={(e) => onChange({ w: e.target.value })}
					/>
				</div>
				<div className="fld">
					<label id={`w-h-${row.id}-l`} htmlFor={`w-h-${row.id}`}>Height (inches)</label>
					<input
						id={`w-h-${row.id}`}
						aria-labelledby={`w-h-${row.id}-l`}
						type="number"
						min={12}
						max={240}
						placeholder="e.g., 60"
						value={row.h}
						onChange={(e) => onChange({ h: e.target.value })}
					/>
				</div>
				<div className="fld">
					<label id={`w-q-${row.id}-l`} htmlFor={`w-q-${row.id}`}>How many like this?</label>
					<input
						id={`w-q-${row.id}`}
						aria-labelledby={`w-q-${row.id}-l`}
						type="number"
						min={1}
						max={30}
						value={row.q}
						onChange={(e) => onChange({ q: e.target.value })}
					/>
				</div>
			</div>
			<div className="hint">{hintFor(row.type)}</div>
			<label className="mot" htmlFor={`w-m-${row.id}`}>
				<input
					id={`w-m-${row.id}`}
					aria-labelledby={`w-m-${row.id}-l`}
					type="checkbox"
					checked={row.m}
					onChange={(e) => onChange({ m: e.target.checked })}
				/>
				<span id={`w-m-${row.id}-l`}>
					I'm interested in motorization{" "}
					<span style={{ color: "var(--ink-soft)" }}>
						(we'll add an allowance to your range and quote the exact hardware at your
						consultation, cordless, and the safest choice around children)
					</span>
				</span>
			</label>
		</div>
	);
}

interface ResultsProps {
	result: EstimateResult;
	name: string;
	goals: string[];
	pending: boolean;
	failed: boolean;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
}

function Results({ result, name, goals, pending, failed, headingRef }: ResultsProps) {
	const first = name.trim().split(" ")[0];
	const plural = result.windows > 1 ? "s" : "";

	return (
		<section className="step on" aria-labelledby="s6">
			<h2 id="s6" ref={headingRef} tabIndex={-1}>
				Here's your starting point.
			</h2>

			<div className="care">
				Thank you, {first}, here's what we heard: you want {goalWords(goals)}.
			</div>

			<div className="est">
				<div className="lbl">
					{result.belowMin ? "Where our projects start" : "Estimated investment range"}
				</div>
				<div className="range">
					{result.belowMin ? (
						<>${fmt(result.minimum)}</>
					) : (
						<>
							${fmt(result.lo)} – ${fmt(result.hi)}
						</>
					)}
				</div>
				<div className="per">
					{result.windows} window{plural} · fabrication, hardware &amp; standard installation
					included
					{result.anyMotor && " · *includes a motorization allowance where you selected it"}
				</div>
			</div>

			{result.belowMin && (
				<p className="care">
					The treatments you described come to ${fmt(result.lo)} – ${fmt(result.hi)} on their own,
					and Studio Elpa projects typically begin around ${fmt(result.minimum)}. Let's talk about
					your whole space, that is where the work we do best starts to show.
				</p>
			)}

			<div>
				{result.lines.map((l) => (
					<div className="line" key={l.key}>
						<span>
							<b>{l.room}</b>, {l.label}
							{l.motor && " · motorized*"} · {l.w}"×{l.h}"{l.q > 1 && ` × ${l.q}`}
						</span>
						<span className="amt">
							${fmt(l.lo)} – ${fmt(l.hi)}
						</span>
					</div>
				))}
			</div>

			<div className="reco">
				<h4>What we'd explore together</h4>
				{recoText(goals)}
				{result.anyAssumed && (
					<>
						<br />
						<br />
						<span className="assume-note">
							Some of these are preliminary ranges, your fabric and hardware selection at
							consultation sets the exact number.
						</span>
					</>
				)}
			</div>

			<p className="fine">
				This is a considered ballpark based on your measurements and current European fabric
				collections, including fabrication and standard installation. The exact figure depends on
				fabric selection and precise measurements, both of which we handle at your complimentary
				in-home consultation. Whatever we quote there is what you pay: no surprises at
				installation.
			</p>

			<div className="result-cta">
				<a className="btn" href={CONTACT.booking} target="_blank" rel="noopener">
					Book a 30-minute call
				</a>
				<a className="btn ghost" href={`mailto:${CONTACT.email}`}>
					Email Aviva directly
				</a>
			</div>

			<output className="fine" style={{ display: "block", color: "var(--accent-2)" }}>
				{pending && "Sending your request…"}
				{!pending &&
					!failed &&
					"Thank you. Your request is on its way, and Aviva will reply within one business day."}
			</output>

			{failed && (
				<p className="fine" role="alert" style={{ color: "#8a3a1a" }}>
					Your estimate is above, but the request didn't reach us. Please send it to{" "}
					<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or call {CONTACT.phone} and we'll
					pick it up from there.
				</p>
			)}
		</section>
	);
}
