import { CampaignPage, type CampaignContent } from "../components/campaign-page";
import { RELAY_SOURCE } from "../lib/lead-relay";

/* Mail segment: recent buyers (bought roughly 6 to 18 months ago).
   Mailer QR: /welcome?utm_source=direct-mail&utm_medium=qr&utm_campaign=M1-NEW */

const CONTENT: CampaignContent = {
	path: "/welcome.html",
	relaySource: RELAY_SOURCE.mailWelcome,
	image: "/assets/lp-bedroom.jpg",
	kicker: "For new homeowners",
	title: (
		<>
			Welcome home.
			<br />
			Now let's dress the windows.
		</>
	),
	sub: "Custom drapery, shades and motorization for the house you just made yours. Measured, made and installed by one team, so the last unfinished part of moving in is finally finished.",
	intro: {
		kicker: "Why now",
		heading: "You already know what the windows need.",
		body: "A few months in a house teaches you things no floor plan does. Where the sun lands at four in the afternoon. Which bedroom wakes up too early. Which room the neighbors can see into once the lights are on. That is the best brief we could ask for. We start with how you live in the house, then recommend what each window actually needs, and nothing it does not.",
	},
	pull: "The builder gave you windows. We make them feel like home.",
	servicesHeading: "Everything the windows need, from one team.",
	services: [
		{
			title: "Custom drapery",
			body: "Made to measure in European fabrics, with the header, lining and fullness chosen for the room, not pulled from a catalog.",
		},
		{
			title: "Shades",
			body: "Roller, solar, Roman and natural woven. Solar shades that keep the view and lose the glare, blackout where sleep matters.",
		},
		{
			title: "Motorization",
			body: "Quiet, reliable motors on shades and drapery, on a schedule or a touch. Easiest to plan now, while the house is still coming together.",
		},
		{
			title: "Smart-home integration",
			body: "Shades that work with the system you already have, your phone and your voice assistant, set up and tested before we leave.",
		},
		{
			title: "Installation",
			body: "Fitted by our own installers, so the people who measured the window answer for how it hangs.",
		},
		{
			title: "Electrical, coordinated",
			body: "Where a motor wants power, our licensed and insured electrical partner handles it, scheduled and managed by us.",
		},
	],
	how: {
		heading: "One conversation, then we take it from there.",
		body: "You should not have to manage four trades to finish your windows. We handle the measuring, the making, the motors and the install, and we keep you posted along the way.",
		steps: [
			<>
				<b>A consultation at the house</b>, where we ask about the rooms before we open a sample book.
			</>,
			<>
				<b>A clear proposal</b>, room by room, with no surprises later.
			</>,
			<>
				<b>Made to measure</b>, typically 6 to 8 weeks from order to installation.
			</>,
			<>
				<b>Installed and tested</b>, motors programmed and the house left clean.
			</>,
		],
	},
	consult: {
		heading: "Let's finish the windows.",
		body: "Tell us a little about the house and which rooms are bothering you most. We will come to you with samples and ideas, and you will leave the first meeting knowing exactly what is possible.",
	},
};

export default function WelcomePage() {
	return <CampaignPage c={CONTENT} />;
}
