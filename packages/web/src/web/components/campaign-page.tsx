import type { ReactNode } from "react";
import { LandingHeader, LandingFooter } from "./site-chrome";
import { ContactForm } from "./contact-form";
import { CONTACT } from "./brand";
import { PageSeo } from "./page-seo";
import { usePageMotion } from "../hooks/use-motion";

/**
 * Direct-mail landing page layout (Sept 2026 homeowner mail campaign).
 *
 * One layout, three pages: /welcome (recent buyers), /smart-living (newer
 * smart-home communities) and /renew (established homes). Each mailer segment
 * gets its own QR code pointing at its own page, with utm_campaign carrying the
 * mail code, so every lead in the Sheet says which mailing produced it.
 *
 * Kept deliberately simple, per the campaign brief: one strong image, what the
 * studio does, and two ways to start (schedule a consultation, or send a note
 * through the tracked form). The pages are noindex and left out of the sitemap
 * and navigation, so their traffic is mail traffic and nothing else.
 *
 * Brand rules that apply here: no em dashes; Lutron and Somfy are never named;
 * the electrical partner stays generic because the mail area runs north of
 * Baltic's coverage.
 */

export type CampaignService = { title: string; body: string };

export type CampaignContent = {
	path: string;
	relaySource: string;
	image: string;
	kicker: string;
	title: ReactNode;
	sub: string;
	intro: { kicker: string; heading: string; body: string };
	pull: string;
	servicesHeading: string;
	services: CampaignService[];
	how: { heading: string; body: string; steps: ReactNode[] };
	consult: { heading: string; body: string };
};

const SCHEDULE = "Schedule a consultation";

function ScheduleButton({ className = "btn btn-solid" }: { className?: string }) {
	return (
		<a className={className} href={CONTACT.booking} target="_blank" rel="noopener">
			{SCHEDULE}
		</a>
	);
}

export function CampaignPage({ c }: { c: CampaignContent }) {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-lp page-campaign" ref={root}>
			<PageSeo path={c.path} />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<LandingHeader ctaLabel={SCHEDULE} />

			<main id="main">
				<section className="hero">
					<div className="bgimg" style={{ backgroundImage: `url('${c.image}')` }} data-parallax />
					<div className="wrap">
						<div className="inner" data-hero>
							<div className="kicker">{c.kicker}</div>
							<h1>{c.title}</h1>
							<p>{c.sub}</p>
							<div className="btn-row">
								<ScheduleButton />
								<a className="btn btn-ghost" href="#consult">
									Send us a note
								</a>
							</div>
						</div>
					</div>
				</section>

				<section className="block">
					<div className="wrap center narrow" data-reveal>
						<div className="kicker">{c.intro.kicker}</div>
						<h2 className="big">{c.intro.heading}</h2>
						<p className="lede">{c.intro.body}</p>
					</div>
				</section>

				<section className="block band">
					<div className="wrap center">
						<p className="pull" data-reveal>
							{c.pull}
						</p>
					</div>
				</section>

				<section className="block">
					<div className="wrap">
						<div className="center narrow" data-reveal style={{ marginBottom: 34 }}>
							<div className="kicker">What we do</div>
							<h2 className="big center">{c.servicesHeading}</h2>
						</div>
						<div className="three" data-reveal-group>
							{c.services.map((s) => (
								<div className="card" key={s.title} data-reveal>
									<h3>{s.title}</h3>
									<p>{s.body}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="block band dark">
					<div className="wrap two" data-reveal-group>
						<div className="body-text" data-reveal>
							<div className="kicker">How it works</div>
							<h2 className="big">{c.how.heading}</h2>
							<p>{c.how.body}</p>
						</div>
						<ul className="clean" data-reveal>
							{c.how.steps.map((step, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: static copy, never reordered
								<li key={i}>{step}</li>
							))}
						</ul>
					</div>
				</section>

				<section className="block band" id="consult">
					<div className="wrap">
						<div className="center narrow" style={{ marginBottom: 44 }} data-reveal>
							<div className="kicker">Book a private consultation</div>
							<h2 className="big center">{c.consult.heading}</h2>
							<p className="soft">{c.consult.body}</p>
						</div>
						<div className="contact-grid" data-reveal>
							<div>
								<ContactForm
									sourcePage={c.path}
									relaySource={c.relaySource}
									submitLabel="Request my consultation"
								/>
							</div>
							<div className="contact-side">
								<h3>Rather pick a time now?</h3>
								<a
									className="btn btn-dark"
									href={CONTACT.booking}
									target="_blank"
									rel="noopener"
									style={{ display: "block", textAlign: "center", width: "100%", marginBottom: 18 }}
								>
									{SCHEDULE}
								</a>
								<div className="row">
									<span className="l">Call</span>
									<a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
								</div>
								<div className="row">
									<span className="l">Email</span>
									<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
								</div>
								<div className="row">
									<span className="l">Consultation</span>Complimentary, in your home
								</div>
								<div className="row">
									<span className="l">Response</span>Within one business day
								</div>
								<div className="next-lead">Here's what happens next</div>
								<ol className="next-steps">
									<li>We get back to you within one business day.</li>
									<li>We ask a few things about the rooms and how you use them.</li>
									<li>We come to the house, with samples, at a time that suits you.</li>
								</ol>
								<p className="soft next-note">No pressure, no obligation.</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<LandingFooter />
		</div>
	);
}
