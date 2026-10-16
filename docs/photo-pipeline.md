# How photos are served

The site is static (GitHub Pages, no server). Photos are optimized **at build
time on your machine** into small WebP files that get committed to the repo.
There is no CDN and no image server — just pre-built files.

## The flow, end to end

```
content folder (Drive) / <name>.jpg   ← originals (full-res, the source of truth)
        │
        │  npm run content  (build-content.mjs, then build-images.mjs — uses sharp)
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

### 1. Originals — the full-res source files
Originals live in the **content folder** — loose photos and series folders —
described in [content-folder.md](content-folder.md). That's the only place you
add or replace a photo. Originals are never served to the browser.

Where the folder lives is configurable: a synced Google Drive folder via
`photos.config.json` `{ "contentDir": … }` (gitignored), a one-off
`CONTENT_DIR=…` env var, or by default the in-repo stand-in
`media-src/content/` (today's placeholders). See
[content-folder.md → Setup](content-folder.md#setup).

Originals should be **large JPEG, PNG, WebP or TIFF exports** — not HEIC or
camera RAW, which `sharp` can't read (the build stops and names the file).

### 2. Build step — `npm run content`
`npm run content` first writes `content.js` (`scripts/build-content.mjs`), then
runs `scripts/build-images.mjs` (the [`sharp`](https://sharp.pixelplumbing.com/)
library). `npm run images` runs just the image half.

For each photo it writes WebP copies at up to four widths —
**160 / 320 / 640 / 1280** — into `media/photos/<id>-<w>.webp`, where the id is
the filename without its number prefix (`01-iceberg.jpg` → `iceberg`). It never
upscales: a photo smaller than 1280px just gets fewer sizes, and its own full
width is added as the sharpest step. EXIF rotation is applied, so phone photos
come out upright. It also writes `media/photos/manifest.js`, listing each
photo's pixel dimensions and which widths exist.

It's **incremental**: a photo is only re-encoded when an output is missing or
older than the original, and outputs for removed or renamed photos are deleted.

This step runs **only on your machine**. `node_modules` and `sharp` are dev-only
and are gitignored. The committed derivatives are what ships.

### 3. Serving — `script.js`
`index.html` loads `manifest.js` before `script.js`. When the carousel/grids
render, a helper (`setPhotoSrc`) builds a responsive `<img>`:
- **`srcset`** lists every available WebP width.
- **`sizes`** tells the browser how wide the image will display in that context,
  so it downloads the smallest file that still looks sharp. On phones, carousel
  frames start on a small file (`SIZES.carouselIdle`) and switch to the full one
  as they near focus — otherwise a 3× iPhone pulls the largest width for every
  frame.
- intrinsic width/height are set from the manifest.

`content.js` refers to photos as `media/photos/<id>.<ext>`; the helper takes the
id from that and serves the WebP derivatives.

## Why static / why WebP
Scale is ~50–100 photos added infrequently, so a CDN is overkill. WebP is
~5–10× smaller than the PNG originals and is supported by every current browser.

## Adding or replacing a photo

Put it in the content folder and run `npm run content` — see
[content-folder.md](content-folder.md). Commit `content.js` and `media/photos/`.

## Testing locally

```bash
npm install                    # once, to get sharp
npm run content                # build content.js + WebP + manifest
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
