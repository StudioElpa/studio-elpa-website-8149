import { useEffect } from "react";
import { canonical, routeFor } from "../lib/routes";
import { graphFor } from "../lib/seo-data";

/**
 * Per-page head tags and JSON-LD.
 *
 * Every page mounts `<PageSeo path="/its-path.html" />` as its first child.
 * The component writes the title, meta description, canonical link, Open
 * Graph URL/title/description and one `application/ld+json` graph into
 * `<head>` from the route registry.
 *
 * Why it mutates the DOM instead of rendering into a head library: the build
 * prerenders each route by snapshotting `document.documentElement.outerHTML`
 * from a real browser, so anything written here during mount lands in the
 * static HTML that crawlers and AI assistants actually fetch. index.html keeps
 * the homepage values as the document defaults, which is what the fallback
 * response serves for an unknown route.
 *
 * Everything it writes is tagged `data-seo="page"` so a client-side route
 * change replaces the previous page's tags rather than stacking a second set.
 */
export function PageSeo({ path }: { path: string }) {
	useEffect(() => {
		const route = routeFor(path);
		if (!route) return;

		const head = document.head;
		for (const stale of head.querySelectorAll('[data-seo="page"]')) stale.remove();

		document.title = route.title;

		const setMeta = (attr: "name" | "property", key: string, content: string) => {
			// index.html already ships the homepage meta tags. Update those in
			// place when they exist so there is never a duplicate description,
			// and create a tagged one otherwise.
			const existing = head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
			if (existing) {
				existing.setAttribute("content", content);
				return;
			}
			const meta = document.createElement("meta");
			meta.setAttribute(attr, key);
			meta.setAttribute("content", content);
			meta.setAttribute("data-seo", "page");
			head.appendChild(meta);
		};

		setMeta("name", "description", route.description);
		setMeta("property", "og:title", route.title);
		setMeta("property", "og:description", route.description);
		// Consolidation stubs point their canonical (and og:url, which crawlers
		// read as the same claim) at the page that absorbed them.
		const canonicalPath = route.canonicalTo ?? route.path;

		setMeta("property", "og:url", canonical(canonicalPath));
		setMeta("property", "og:type", route.schema === "article" ? "article" : "website");

		let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
		if (!link) {
			link = document.createElement("link");
			link.rel = "canonical";
			link.setAttribute("data-seo", "page");
			head.appendChild(link);
		}
		link.href = canonical(canonicalPath);

		if (route.noindex) setMeta("name", "robots", "noindex, follow");

		const ld = document.createElement("script");
		ld.type = "application/ld+json";
		ld.setAttribute("data-seo", "page");
		ld.textContent = graphFor(route);
		head.appendChild(ld);
	}, [path]);

	return null;
}
