/**
 * The structured-data layer: the studio's identity as JSON-LD, plus the
 * geography it actually serves.
 *
 * Two hard rules apply here because this is public, machine-read copy:
 *
 * 1. **No market figures.** The target-areas research carries price
 *    thresholds and medians, and those are for deciding where to spend
 *    effort. They never appear on a page or in a schema.
 * 2. **Nothing invented.** No ratings, no review counts, no award or
 *    certification claims, no founding year, no employee count, no social
 *    profiles until real ones exist. An empty field beats a plausible one,
 *    and a fabricated `aggregateRating` is the kind of thing that gets a
 *    business demoted rather than cited.
 */

import { CONTACT } from "../components/brand";
import { ORIGIN, ROUTES, canonical, type SiteRoute } from "./routes";

/**
 * The cities and ZIPs Studio Elpa serves, ordered by the priority in the
 * target-areas reference (core territory first, then the Jupiter corridor,
 * Fort Lauderdale waterfront, Miami, and the Keys and Treasure Coast edges).
 *
 * This is `areaServed` for the LocalBusiness and every Service. Listing real
 * postal codes is what ties the business to a place for local search and for
 * assistants answering "who does this near me"; it is also why the list stays
 * honest, and only names places a consult would genuinely be driven to.
 */
export const AREA_SERVED: { city: string; region: "FL"; zips: string[] }[] = [
	{ city: "Boca Raton", region: "FL", zips: ["33432", "33431", "33496", "33487"] },
	{ city: "Delray Beach", region: "FL", zips: ["33483"] },
	{ city: "Gulf Stream", region: "FL", zips: ["33483"] },
	{ city: "Ocean Ridge", region: "FL", zips: ["33435"] },
	{ city: "Manalapan", region: "FL", zips: ["33462"] },
	{ city: "Highland Beach", region: "FL", zips: ["33487"] },
	{ city: "Palm Beach", region: "FL", zips: ["33480"] },
	{ city: "West Palm Beach", region: "FL", zips: ["33401", "33405"] },
	{ city: "Wellington", region: "FL", zips: ["33414"] },
	{ city: "Palm Beach Gardens", region: "FL", zips: ["33418"] },
	{ city: "North Palm Beach", region: "FL", zips: ["33408"] },
	{ city: "Juno Beach", region: "FL", zips: ["33408"] },
	{ city: "Jupiter", region: "FL", zips: ["33477", "33469"] },
	{ city: "Tequesta", region: "FL", zips: ["33469"] },
	{ city: "Hobe Sound", region: "FL", zips: ["33455"] },
	{ city: "Stuart", region: "FL", zips: ["34996"] },
	{ city: "Fort Lauderdale", region: "FL", zips: ["33301", "33316", "33305", "33308"] },
	{ city: "Lighthouse Point", region: "FL", zips: ["33064"] },
	{ city: "Hillsboro Beach", region: "FL", zips: ["33062"] },
	{ city: "Coral Gables", region: "FL", zips: ["33156", "33143", "33134", "33146"] },
	{ city: "Pinecrest", region: "FL", zips: ["33156"] },
	{ city: "Key Biscayne", region: "FL", zips: ["33149"] },
	{ city: "Miami", region: "FL", zips: ["33133", "33131"] },
	{ city: "Miami Beach", region: "FL", zips: ["33139", "33140", "33109"] },
	{ city: "Bal Harbour", region: "FL", zips: ["33154"] },
	{ city: "Surfside", region: "FL", zips: ["33154"] },
	{ city: "Aventura", region: "FL", zips: ["33180"] },
	{ city: "Sunny Isles Beach", region: "FL", zips: ["33160"] },
	{ city: "Key Largo", region: "FL", zips: ["33037"] },
	{ city: "Islamorada", region: "FL", zips: ["33036"] },
];

/**
 * `areaServed` as schema.org `City` nodes, each carrying its postal codes.
 *
 * Defaults to the whole footprint, which is right for the sitewide business
 * node and for a service page that really does cover all thirty cities. A geo
 * page passes its own short list instead, so "Custom Drapery in Palm Beach"
 * claims Palm Beach rather than restating the entire territory.
 */
function areaServedNodes(list: { city: string; region?: "FL"; zips: string[] }[] = AREA_SERVED) {
	return list.map((a) => ({
		"@type": "City",
		name: a.city,
		address: {
			"@type": "PostalAddress",
			addressLocality: a.city,
			addressRegion: a.region ?? "FL",
			addressCountry: "US",
			postalCode: a.zips.join(", "),
		},
	}));
}

const ORG_ID = `${ORIGIN}/#organization`;
const BUSINESS_ID = `${ORIGIN}/#localbusiness`;
const WEBSITE_ID = `${ORIGIN}/#website`;

/**
 * The sitewide graph: Organization, the HomeAndConstructionBusiness that is
 * the same entity as a local business, and the WebSite. Emitted on every page
 * with stable @ids so the per-page nodes can point at it instead of restating
 * the studio each time.
 *
 * No street address: the studio works out of client homes and does not run a
 * showroom the public visits, so `areaServed` carries the geography and no
 * `address` is claimed. `HomeAndConstructionBusiness` is the closest real
 * subtype for made-to-measure work installed in the home.
 */
function identityGraph() {
	/* Derived from the route registry rather than hand-listed, so the catalog
	   can never fall behind the pages again: every route with schema "service"
	   is a service we really offer and really have a page for, and its `url`
	   gives an assistant somewhere to send a reader. */
	const services = ROUTES.filter((r) => r.schema === "service").map((r) => ({
		name: r.serviceType ?? r.breadcrumb ?? r.title,
		url: canonical(r.path),
	}));

	return [
		{
			"@type": "Organization",
			"@id": ORG_ID,
			name: "Studio Elpa",
			url: ORIGIN,
			logo: `${ORIGIN}/assets/logo.png`,
			image: `${ORIGIN}/og-image.jpg`,
			telephone: CONTACT.phone,
			email: CONTACT.email,
			description:
				"Custom window treatments and home textiles for South Florida homes: drapery, shades and motorized systems, made to measure in European fabrics and installed by one team.",
		},
		{
			"@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
			"@id": BUSINESS_ID,
			name: "Studio Elpa",
			url: ORIGIN,
			image: `${ORIGIN}/og-image.jpg`,
			telephone: CONTACT.phone,
			email: CONTACT.email,
			priceRange: "$$$",
			parentOrganization: { "@id": ORG_ID },
			description:
				"Made-to-measure drapery, shades and motorized window treatments for luxury homes across South Florida. One point of contact from consultation to installation, with electrical handled by a licensed, insured partner.",
			areaServed: areaServedNodes(),
			hasOfferCatalog: {
				"@type": "OfferCatalog",
				name: "Window treatments and home textiles",
				itemListElement: services.map((s) => ({
					"@type": "Offer",
					itemOffered: { "@type": "Service", name: s.name, url: s.url },
				})),
			},
		},
		{
			"@type": "WebSite",
			"@id": WEBSITE_ID,
			url: ORIGIN,
			name: "Studio Elpa",
			publisher: { "@id": ORG_ID },
			inLanguage: "en-US",
		},
	];
}

/**
 * Home > [parent city page] > page. Omitted on the homepage, which is the
 * root. A neighborhood page declares its parent city page so the trail
 * reflects the real hierarchy rather than flattening every geo page to depth
 * two.
 */
function breadcrumb(route: SiteRoute) {
	if (!route.breadcrumb) return null;
	const trail = [
		{ "@type": "ListItem", position: 1, name: "Home", item: canonical("/index.html") },
	];
	const parent = route.parent ? ROUTES.find((r) => r.path === route.parent) : undefined;
	if (parent?.breadcrumb) {
		trail.push({
			"@type": "ListItem",
			position: trail.length + 1,
			name: parent.breadcrumb,
			item: canonical(parent.path),
		});
	}
	trail.push({
		"@type": "ListItem",
		position: trail.length + 1,
		name: route.breadcrumb,
		item: canonical(route.path),
	});
	return {
		"@type": "BreadcrumbList",
		"@id": `${canonical(route.path)}#breadcrumbs`,
		itemListElement: trail,
	};
}

/** The page-specific node: Service, Article, or a plain WebPage. */
function pageNode(route: SiteRoute) {
	const url = canonical(route.path);
	const base = {
		"@id": `${url}#page`,
		url,
		name: route.title,
		description: route.description,
		isPartOf: { "@id": WEBSITE_ID },
		inLanguage: "en-US",
	};

	if (route.schema === "service") {
		return {
			"@type": "Service",
			"@id": `${url}#service`,
			name: route.breadcrumb ?? route.title,
			serviceType: route.serviceType,
			description: route.description,
			url,
			provider: { "@id": BUSINESS_ID },
			areaServed: areaServedNodes(route.areaServed),
		};
	}

	if (route.schema === "article") {
		return {
			"@type": "Article",
			...base,
			headline: route.headline ?? route.title,
			datePublished: route.datePublished,
			author: { "@id": ORG_ID },
			publisher: { "@id": ORG_ID },
			mainEntityOfPage: url,
		};
	}

	return { "@type": "WebPage", ...base };
}

/**
 * The full JSON-LD graph for one route: the sitewide identity, the page's own
 * node, and its breadcrumbs, in a single `@graph` so there is one script tag
 * per page rather than four competing ones.
 */
export function graphFor(route: SiteRoute): string {
	const nodes: unknown[] = [...identityGraph(), pageNode(route)];
	const crumbs = breadcrumb(route);
	if (crumbs) nodes.push(crumbs);
	return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
