// Emit a real index.html for every client-side route so clean URLs
// (/about/, /read/<slug>/) load directly on a static host with no server
// rewrites. index.html is the single source of truth; routing itself is
// handled in script.js. Run in CI before the Pages deploy (see
// .github/workflows/pages.yml), or locally to test routes before pushing.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shell = readFileSync(join(root, "index.html"), "utf8");
const js = readFileSync(join(root, "script.js"), "utf8");

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

console.log(`Generated ${routes.length} route page(s):\n  ${routes.join("\n  ")}`);
