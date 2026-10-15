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

// Cache-busting version: the commit SHA in CI, a timestamp locally. Appended
// to the style.css / script.js / content.js URLs so every deploy serves fresh
// assets instead of a browser holding onto a stale cached copy (the filenames
// are unchanged, so the server still returns the same files).
const version = (process.env.GITHUB_SHA || Date.now().toString()).slice(0, 8);
const shell = rawShell
  .replace('href="style.css"', `href="style.css?v=${version}"`)
  .replace('src="script.js"', `src="script.js?v=${version}"`)
  .replace('src="content.js"', `src="content.js?v=${version}"`)
  .replace(
    'src="media/photos/manifest.js"',
    `src="media/photos/manifest.js?v=${version}"`
  );

// Routes come straight from the pieces authored in content.js, so adding a
// piece there is all it takes — no route list to keep in sync here. content.js
// is a plain script that sets window.SITE_CONTENT; run it with a minimal window
// stub to read the pieces, then derive routes the same way the site does:
// a piece with `photos` opens a series (/series/), otherwise `writing` opens a
// reading piece (/read/).
const contentSrc = readFileSync(join(root, "content.js"), "utf8");
const sandboxWindow = {};
new Function("window", contentSrc)(sandboxWindow);
const pieces = (sandboxWindow.SITE_CONTENT && sandboxWindow.SITE_CONTENT.pieces) || [];
const seriesSlugs = pieces.filter((p) => p.slug && p.photos).map((p) => p.slug);
const readingSlugs = pieces
  .filter((p) => p.slug && p.writing && !p.photos)
  .map((p) => p.slug);
const routes = [
  "about",
  "contact",
  "all",
  ...readingSlugs.map((s) => `read/${s}`),
  ...seriesSlugs.map((s) => `series/${s}`),
];

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
