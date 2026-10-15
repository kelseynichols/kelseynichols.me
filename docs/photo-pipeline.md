# How photos are served

The site is static (GitHub Pages, no server). Photos are optimized **at build
time on your machine** into small WebP files that get committed to the repo.
There is no CDN and no image server — just pre-built files.

## The flow, end to end

```
media-src/photos/<name>.png        ← masters (full-res, the source of truth)
        │
        │  npm run images   (scripts/build-images.mjs, uses sharp)
        ▼
media/photos/<name>-160.webp
media/photos/<name>-320.webp        ← derivatives, committed to the repo
media/photos/<name>-640.webp
media/photos/<name>-1280.webp
media/photos/manifest.js            ← dimensions + available widths per photo
        │
        │  browser loads manifest.js, then script.js
        ▼
<img srcset="…-320.webp 320w, …-640.webp 640w, …"
     sizes="…">                     ← browser picks the smallest file that looks sharp
```

### 1. Masters — `media-src/photos/`
Full-resolution originals. **This is the only place you add or replace a
photo.** Right now these are placeholder stand-ins committed to the repo; the
plan is to later point the pipeline at a Google Drive / Dropbox sync folder and
keep the real masters out of git. Masters are never served to the browser.

### 2. Build step — `npm run images`
Runs `scripts/build-images.mjs` (the [`sharp`](https://sharp.pixelplumbing.com/)
library). For each master it writes WebP copies at up to four widths —
**160 / 320 / 640 / 1280** — into `media/photos/`. It never upscales: a photo
smaller than 1280px just gets fewer sizes, and its own full width is added as
the sharpest step. It also writes `media/photos/manifest.js`, a tiny file
listing each photo's pixel dimensions and which widths exist.

This step runs **only on your machine**. `node_modules` and `sharp` are dev-only
and are gitignored. The committed derivatives are what ships.

### 3. Serving — `script.js`
`index.html` loads `manifest.js` before `script.js`. When the carousel/grids
render, a helper (`setPhotoSrc`) builds a responsive `<img>`:
- **`srcset`** lists every available WebP width.
- **`sizes`** tells the browser how wide the image will actually display in that
  context (carousel frame vs. grid tile vs. tiny thumbnail), so it downloads the
  smallest file that still looks sharp — e.g. a phone pulls a ~320px/~14KB frame
  instead of a full-res master.
- intrinsic width/height are set from the manifest so the layout doesn't jump
  while images load.

The photo list in `ITEMS` (top of `script.js`) still references the original
`media/photos/<name>.png` path. The helper derives the base name from that, so
**you don't edit `ITEMS` when the pipeline changes** — it just works.

## Why static / why WebP
Scale is ~50–100 photos added infrequently, so a CDN is overkill. WebP is
~5–10× smaller than the PNG masters and is supported by every current browser.
The big win is mobile: lighter frames mean the carousel no longer stutters
repainting full-res images mid-swipe.

## Adding or replacing a photo

1. Drop the full-res file into `media-src/photos/` (`.png`, `.jpg`, `.webp`, or
   `.tif`). Use a clean, lowercase, hyphenated name — that becomes its ID, e.g.
   `golden-gate.jpg`.
2. Run `npm run images`. This rebuilds `media/photos/` from scratch (so removing
   a master also removes its old derivatives).
3. Reference it in `ITEMS` in `script.js` by its **original path**, e.g.
   `{ type: "photo", src: "media/photos/golden-gate.jpg", alt: "…" }`.
   (In the `ITEMS` data you can write the master's extension; the browser is
   served the `.webp` derivatives regardless.)
4. Commit the new files in `media/photos/` (and the master in `media-src/` for
   now) along with your `script.js` change.

## Testing locally

```bash
npm install                    # once, to get sharp
npm run images                 # build WebP + manifest
node scripts/generate-routes.mjs   # build the clean-URL route pages
python3 -m http.server 8000    # serve from the repo root
# open http://localhost:8000
```

To confirm the responsive images are working: open the site, DevTools →
**Network → Img**, and watch which file loads as you view a photo — you should
see a `…-320.webp` / `…-640.webp`, not a `.png`. Inspecting the `<img>` element
should show a populated `srcset` and `sizes`.

First time only: `node_modules/` appears after `npm install` and is gitignored.
`sharp` ships prebuilt binaries, so there's nothing to compile.
