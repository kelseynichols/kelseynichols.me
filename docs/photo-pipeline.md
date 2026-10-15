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

### 1. Masters — a folder of full-res originals
**This is the only place you add or replace a photo.** Masters are never served
to the browser — they're the big source files the pipeline resizes down.

Where that folder lives is configurable (see
[Pointing at Google Drive](#pointing-at-google-drive)). By default it's the
in-repo `media-src/photos/` (today's placeholder stand-ins). The intended setup
is a **synced Google Drive folder** so the large originals stay out of git.

Masters should be **high-quality exports — large JPEG, PNG, or TIFF**, not
camera RAW (`.CR2`/`.NEF`/`.ARW`/`.DNG`), which `sharp` can't read. Export from
your editor first, then save to the masters folder.

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

## Pointing at Google Drive

The masters folder defaults to `media-src/photos/` in the repo. To read from a
synced Google Drive folder instead (big originals never touch git):

1. Install **Google Drive for desktop** and let it sync. Your Drive then shows
   up as a normal folder on the Mac, under
   `~/Library/CloudStorage/GoogleDrive-<you>@gmail.com/My Drive/…`.
2. Put your master photos in a folder there, e.g.
   `…/My Drive/kelseynichols-photos/masters/`.
3. In the repo, copy `photos.config.example.json` to **`photos.config.json`**
   and set `srcDir` to that folder's full path. This file is gitignored — it's
   your machine's local setting, not shared.
4. Run `npm run images`. It prints which folder it read
   (`Masters: … [photos.config.json]`) so you can confirm.

The derivatives it writes into `media/photos/` still get committed — only the
masters move to Drive. (One-off alternative without a config file:
`PHOTOS_SRC="/path/to/folder" npm run images`.)

## Adding or replacing a photo

1. Drop the full-res file into your masters folder (`media-src/photos/`, or your
   Drive folder once configured) — `.png`, `.jpg`, `.webp`, or `.tif`. Use a
   clean, lowercase, hyphenated name; that becomes its ID, e.g. `golden-gate.jpg`.
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
