// Writes content.js from the content folder (see docs/content-folder.md).
// Run via `npm run content`, which then builds the images. content.js is
// generated and committed; the content folder is the source of truth.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveContentDir, readContentFolder, reportProblems } from "./lib/content-folder.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { dir, from } = resolveContentDir(root);
console.log(`Content folder: ${dir}  [${from}]\n`);

const result = readContentFolder(dir);
reportProblems(result, dir);

// Photo src keeps the media/photos/<id>.<ext> form the site already uses;
// setPhotoSrc (script.js) maps the id onto the WebP derivatives.
const photos = {};
for (const [id, p] of result.photos) {
  photos[id] = { src: `media/photos/${id}${p.ext}`, alt: p.alt };
}

const out = `/* ============================================================
   SITE CONTENT — GENERATED. Do not edit by hand.

   Built by scripts/build-content.mjs from the content folder
   (\`npm run content\`). To change what's on the site, edit the folder:
   see docs/content-folder.md. The shape is documented in
   docs/content-model.md.

   This file is a plain script (no build step at load time) so both the
   site and scripts/generate-routes.mjs can read it.
   ============================================================ */

window.SITE_CONTENT = {
  photos: ${JSON.stringify(photos, null, 2).replace(/\n/g, "\n  ")},
  pieces: ${JSON.stringify(result.pieces, null, 2).replace(/\n/g, "\n  ")},
};
`;

writeFileSync(join(root, "content.js"), out);

const counts = result.pieces.reduce((acc, p) => {
  const kind = p.archive ? "end card" : "web" in p ? "web" : p.photos ? "series" : p.writing ? (p.cover ? "photo-essay" : "writing") : "photo";
  acc[kind] = (acc[kind] || 0) + 1;
  return acc;
}, {});
console.log(
  `Wrote content.js: ${result.photos.size} photos, ${result.pieces.length} pieces ` +
    `(${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ")})`
);
