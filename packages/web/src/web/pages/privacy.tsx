import { BackHeader, ThinFooter } from "../components/site-chrome";
import { CONTACT } from "../components/brand";
import { PageSeo } from "../components/page-seo";
import { usePageMotion } from "../hooks/use-motion";

/* Copy ported verbatim from the original privacy.html, with two changes:

   1. The original ended with a visible ".note" addressed "Note for Studio
      Elpa:" — an internal instruction to the client that was shipping to
      visitors. Removed.
   2. The original computed the "last updated" date with `new Date()` on every
      page load, so the policy always claimed to have been revised today. It is
      a pinned constant now: bump LAST_UPDATED when the policy text changes. */

const LAST_UPDATED = new Date("2026-09-07T12:00:00Z").toLocaleDateString("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
	timeZone: "UTC",
});

export default function PrivacyPage() {
	const root = usePageMotion<HTMLDivElement>();

	return (
		<div className="page-privacy" ref={root}>
			<PageSeo path="/privacy.html" />
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<BackHeader href="/index.html" label="← Back to site" />

			<main id="main">
				<div className="doc-wrap">
					<div data-hero>
						<div className="kicker">Studio Elpa</div>
						<h1>Privacy Policy</h1>
						<p className="updated">Last updated: {LAST_UPDATED}</p>
					</div>

					<div className="note" data-reveal>
						Plain-language summary: we only collect the details you send us through our contact
						form so we can reply to you and plan your project. We don't sell your information, and
						we don't send marketing you didn't ask for.
					</div>

					<p data-reveal>
						This Privacy Policy explains how Studio Elpa ("we," "us," or "our") collects, uses, and
						protects information when you visit our website or contact us. By using this site or
						submitting our contact form, you agree to the practices described here.
					</p>

					<h2 data-reveal>Information we collect</h2>
					<p data-reveal>
						We collect only the information you choose to give us. When you submit our contact
						form, that typically includes:
					</p>
					<ul data-reveal>
						<li>Your name</li>
						<li>Your email address</li>
						<li>Your phone number (if you provide it)</li>
						<li>Your project's city or area</li>
						<li>Whether you're a homeowner or a trade partner</li>
						<li>Anything you tell us about your room or project</li>
					</ul>
					<p data-reveal>
						Our website does not use tracking cookies or advertising pixels. If we add analytics or
						scheduling tools in the future, we'll update this policy first.
					</p>

					<h2 data-reveal>How we use your information</h2>
					<p data-reveal>We use the information you send us to:</p>
					<ul data-reveal>
						<li>Respond to your inquiry and answer your questions</li>
						<li>Schedule and prepare for your consultation</li>
						<li>Plan, quote, and carry out your project</li>
						<li>Keep in touch with you about work we're doing together</li>
					</ul>
					<p data-reveal>
						We will not send you unrelated marketing without your permission, and we will never
						sell or rent your information to anyone.
					</p>

					<h2 data-reveal>How your information is handled</h2>
					<p data-reveal>
						Contact-form submissions are delivered to us by email through a third-party form
						service, and we store your details in the tools we use to run our business (such as our
						email and customer records). These providers process your information only to deliver it
						to us. We take reasonable steps to keep your information secure, though no method of
						transmission over the internet is ever completely secure.
					</p>

					<h2 data-reveal>Sharing</h2>
					<p data-reveal>
						We may share your information with trusted partners only as needed to complete your
						project, for example an interior designer you've asked us to coordinate with, or a
						supplier fulfilling your order. We may also disclose information if required by law.
					</p>

					<h2 data-reveal>Your choices</h2>
					<p data-reveal>
						You can ask us at any time to see what information we hold about you, correct it, or
						delete it. Just email us at the address below and we'll take care of it.
					</p>

					<h2 data-reveal>Children</h2>
					<p data-reveal>
						Our website and services are intended for adults. We do not knowingly collect
						information from anyone under 18.
					</p>

					<h2 data-reveal>Changes to this policy</h2>
					<p data-reveal>
						We may update this policy from time to time. When we do, we'll revise the "last updated"
						date above.
					</p>

					<h2 data-reveal>Contact us</h2>
					<p data-reveal>Questions about this policy or your information? Reach us at:</p>
					<p data-reveal>
						Studio Elpa
						<br />
						Serving South Florida
						<br />
						Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
						<br />
						Phone: <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
					</p>
				</div>
			</main>

			<ThinFooter />
		</div>
	);
}
