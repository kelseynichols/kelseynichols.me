// Emit a real index.html for every client-side route so clean URLs
// (/about/, /read/<slug>/) load directly on a static host with no server
// rewrites. index.html is the single source of truth; routing itself is
// handled in script.js. Run in CI before the Pages deploy (see
// .github/workflows/pages.yml), or locally to test routes before pushing.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rawShell = readFileSync(join(root, "index.html"), "utf8");
const js = readFileSync(join(root, "script.js"), "utf8");

// Cache-busting version: the commit SHA in CI, a timestamp locally. Appended
// to the style.css / script.js URLs so every deploy serves fresh assets
// instead of a browser holding onto a stale cached copy (the filenames are
// unchanged, so the server still returns the same files).
const version = (process.env.GITHUB_SHA || Date.now().toString()).slice(0, 8);
const shell = rawShell
  .replace('href="style.css"', `href="style.css?v=${version}"`)
  .replace('src="script.js"', `src="script.js?v=${version}"`);

// Writing slugs come straight from the ITEMS data in script.js, so adding a
// piece there is all it takes — no route list to keep in sync here.
const slugs = [...js.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const routes = ["about", "contact", ...slugs.map((s) => `read/${s}`)];

for (const route of routes) {
  const dir = join(root, route);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), shell);
}

// Stamp the homepage too, but only in CI — running this locally must never
// rewrite the committed source index.html.
if (process.env.GITHUB_ACTIONS) {
  writeFileSync(join(root, "index.html"), shell);
}

console.log(
  `Generated ${routes.length} route page(s) at version ${version}:\n  ${routes.join("\n  ")}`
);
