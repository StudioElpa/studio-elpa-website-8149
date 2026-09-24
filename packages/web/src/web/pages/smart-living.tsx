import { CampaignPage, type CampaignContent } from "../components/campaign-page";
import { RELAY_SOURCE } from "../lib/lead-relay";

/* Mail segment: newer smart-home communities (Lotus, Lotus Edge, The Bridges,
   Seven Bridges). Smart-home integration leads, visibly, per the brief.
   Mailer QR: /smart-living?utm_source=direct-mail&utm_medium=qr&utm_campaign=M1-SMART */

const CONTENT: CampaignContent = {
	path: "/smart-living.html",
	relaySource: RELAY_SOURCE.mailSmart,
	image: "/assets/art-motor.jpg",
	kicker: "Motorized shades · Smart-home integration",
	title: (
		<>
			A smart home deserves
			<br />
			windows that keep up.
		</>
	),
	sub: "Custom drapery and shades, motorized and connected to your smart-home system. Designed, installed and programmed by one team, with the electrical handled for you.",
	intro: {
		kicker: "Built for how these homes work",
		heading: "Your house already runs on a schedule. The windows should too.",
		body: "In homes like the ones in Lotus, The Bridges and Seven Bridges, the lighting, the climate and the security already answer to an app. Window treatments are usually the last thing left that still needs a hand. We specify shades and drapery that close against the afternoon sun on their own, open with the morning, and fit into the scenes you already use, while still looking like they were made for the room. Because they were.",
	},
	pull: "The best smart shade is the one you stop noticing by the second week.",
	servicesHeading: "Beautiful first. Clever where it counts.",
	services: [
		{
			title: "Smart-home integration",
			body: "Shades and drapery that join your existing system, your phone and your voice assistant. Programmed into scenes and schedules, and tested before we leave.",
		},
		{
			title: "Motorization",
			body: "Quiet, reliable motors, hardwired or battery, chosen on the merits of your house. Controls that make sense to everyone who lives there.",
		},
		{
			title: "Custom drapery",
			body: "Motorized drapery in European fabrics, so a tall wall of glass gets softness as well as control.",
		},
		{
			title: "Solar and blackout shades",
			body: "Solar weaves that keep the view and cut the glare and heat, and blackout shades for bedrooms that need real darkness.",
		},
		{
			title: "Electrical coordination",
			body: "Where a motor needs power, our licensed and insured electrical partner does the work, scheduled and managed by us. No extra trade for you to find.",
		},
		{
			title: "Installation and setup",
			body: "Our own installers fit everything, pair every motor, and walk you through the controls on the day.",
		},
	],
	how: {
		heading: "The wiring is our problem, not yours.",
		body: "We look at the house elevation by elevation, decide what each window is being asked to do, and specify the shade, the fabric and the motor against that. Then we coordinate the power, install, program and hand it over working.",
		steps: [
			<>
				<b>A consultation at the house</b>, including how your smart-home system is set up today.
			</>,
			<>
				<b>A plan per elevation</b>, because the east wall and the west wall are not the same problem.
			</>,
			<>
				<b>Power handled for you</b>, licensed and insured, on our schedule.
			</>,
			<>
				<b>Installed, programmed, explained</b>, with scenes and schedules set before we leave.
			</>,
		],
	},
	consult: {
		heading: "Let's connect the windows.",
		body: "Tell us which rooms get the hardest sun and what system the house runs on. We will come out, look at it in the room, and show you what is possible.",
	},
};

export default function SmartLivingPage() {
	return <CampaignPage c={CONTENT} />;
}
