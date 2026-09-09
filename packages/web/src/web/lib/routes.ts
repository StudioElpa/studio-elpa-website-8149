/**
 * Typed access to the route registry in `site-routes.json`.
 *
 * The JSON is the single source of truth: the router, the per-page head tags,
 * the build-time sitemap and `vite/prerender.py` all read the same list, so a
 * new V2 page cannot ship un-prerendered or missing from the sitemap. Add the
 * route to the JSON first, then wire its component in `app.tsx`.
 */

import registry from "./site-routes.json";

export type RouteSchema = "home" | "service" | "article" | "page";

export type SiteRoute = {
	/** Canonical path, always with the .html suffix the original site used. */
	path: string;
	/** Extra paths that serve the same page. "/" for the homepage. */
	aliases: string[];
	title: string;
	description: string;
	schema: RouteSchema;
	/** Service pages only: what the Service schema advertises. */
	serviceType?: string;
	/** Label used in the BreadcrumbList. Omitted on the homepage. */
	breadcrumb?: string;
	/**
	 * Geo pages only: narrows the Service's `areaServed` to the places that
	 * page is actually about. Without it a service page claims the whole
	 * thirty-city footprint, which is right for /drapery.html and wrong for
	 * "Custom Drapery in Palm Beach". Cities named here must also exist in
	 * AREA_SERVED, so the studio never claims a place sitewide it does not
	 * claim locally.
	 */
	areaServed?: { city: string; zips: string[] }[];
	/** Geo pages only: the parent city page a neighborhood page sits under. */
	parent?: string;
	/** Article pages only. */
	headline?: string;
	datePublished?: string;
	noindex?: boolean;
	/**
	 * Consolidation stubs only: the path this URL's canonical should point at.
	 * Defaults to the route's own path. Used by the retired
	 * /roller-solar-shades.html stub so its ranking signals fold into
	 * /motorized.html instead of pointing back at a noindex page.
	 */
	canonicalTo?: string;
	changefreq: string;
	priority: string;
};

export const ORIGIN: string = registry.origin;

export const ROUTES: SiteRoute[] = registry.routes as SiteRoute[];

/** Absolute canonical URL for a registry path. */
export function canonical(path: string): string {
	return `${ORIGIN}${path}`;
}

/**
 * Look a route up by its canonical path. Returns undefined rather than
 * throwing: a missing entry should degrade to the document defaults in
 * index.html, never blank the page.
 */
export function routeFor(path: string): SiteRoute | undefined {
	return ROUTES.find((r) => r.path === path);
}
