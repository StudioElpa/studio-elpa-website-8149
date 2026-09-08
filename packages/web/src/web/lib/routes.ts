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
	/** Article pages only. */
	headline?: string;
	datePublished?: string;
	noindex?: boolean;
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
