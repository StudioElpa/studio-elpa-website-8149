import { CampaignPage, type CampaignContent } from "../components/campaign-page";
import { RELAY_SOURCE } from "../lib/lead-relay";

/* Mail segment: established luxury homeowners (high-value, longer ownership).
   Angle: beautiful textiles, updating existing treatments, turnkey service.
   Mailer QR: /renew?utm_source=direct-mail&utm_medium=qr&utm_campaign=M1-LUX */

const CONTENT: CampaignContent = {
	path: "/renew.html",
	relaySource: RELAY_SOURCE.mailRenew,
	image: "/assets/art-drapery.jpg",
	kicker: "Custom drapery and shades · Turnkey service",
	title: (
		<>
			Your home has grown.
			<br />
			Let the windows catch up.
		</>
	),
	sub: "Beautiful European textiles, made to measure for the house you love. We update tired treatments, add what is missing, and handle every step from design to installation.",
	intro: {
		kicker: "A fresh look, without the project",
		heading: "The windows are often the last thing to be updated.",
		body: "Furniture changes, rooms change purpose, the art moves. The drapery that was right fifteen years ago may be faded on the sunny side, or simply not you anymore. We look at what you have, keep what still works, and replace what does not, in fabrics chosen for the light in each room. You make the decisions. We take care of everything else.",
	},
	pull: "Good window treatments do not announce themselves. They make a room feel finished.",
	servicesHeading: "Considered, made to measure, and handled for you.",
	services: [
		{
			title: "Custom drapery",
			body: "European linens, sheers and wovens, with headers, linings and hardware chosen to suit the architecture and the way the room is used.",
		},
		{
			title: "Updating what you have",
			body: "New fabric on sound hardware, a lining that finally blocks the afternoon, or a sheer layer added. Not every window needs to start over.",
		},
		{
			title: "Shades",
			body: "Roman, natural woven, roller and solar, including blackout for bedrooms and UV protection for floors and furnishings.",
		},
		{
			title: "Motorization and smart-home integration",
			body: "Quiet motors on drapery and shades, added to an existing house, and connected to your smart-home system if you have one.",
		},
		{
			title: "Turnkey design and installation",
			body: "One team from the first measurement to the final hem. Our own installers, with electrical coordinated by our licensed partner where motors need power.",
		},
		{
			title: "Designer collaboration",
			body: "Already working with an interior designer? We are glad to support their vision and handle the technical side.",
		},
	],
	how: {
		heading: "You choose. We handle the rest.",
		body: "We come to you with samples, look at every room in its own light, and give you a clear proposal. From there we manage fabrication, hardware, electrical and installation, and you simply enjoy the result.",
		steps: [
			<>
				<b>A private consultation at home</b>, with fabrics and samples brought to you.
			</>,
			<>
				<b>An honest assessment</b> of what to keep, what to refresh and what to replace.
			</>,
			<>
				<b>Made to measure</b> in European fabrics, typically 6 to 8 weeks from order.
			</>,
			<>
				<b>Installed with care</b> by our own team, with the house left as we found it.
			</>,
		],
	},
	consult: {
		heading: "Let's talk about your windows.",
		body: "Tell us which rooms you would like to refresh. We will visit with samples, listen first, and show you what is possible, with no obligation.",
	},
};

export default function RenewPage() {
	return <CampaignPage c={CONTENT} />;
}
