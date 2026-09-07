import { spawnSync } from "child_process";
import path from "path";
import type { Plugin } from "vite";

/**
 * Prerenders every route into a real static HTML file after the bundle is
 * written, so each .html URL serves fully rendered markup in the first
 * response instead of an empty <div id="root">.
 *
 * The work happens in vite/prerender.py (headless Chrome, reduced motion
 * emulated). Build-only, and deliberately non-fatal on a soft failure: a
 * missing Chrome or playwright should degrade to the client-rendered build,
 * not break `bun run build`. A hard failure inside the script, such as a page
 * error or baked-in opacity:0, does fail the build, because shipping
 * invisible text would be worse than shipping no prerender.
 */
export default function prerenderPlugin(): Plugin {
	return {
		name: "studio-elpa-prerender",
		apply: "build",
		enforce: "post",
		closeBundle() {
			const dir = __dirname;
			const dist = path.resolve(dir, "../dist");
			const script = path.resolve(dir, "prerender.py");

			const res = spawnSync("python3", [script, dist], {
				stdio: "inherit",
				cwd: path.resolve(dir, ".."),
			});

			if (res.error) {
				this.warn(`prerender skipped: ${res.error.message}`);
				return;
			}
			if (res.status !== 0) {
				this.error(`prerender failed with exit code ${res.status}`);
			}
		},
	};
}
