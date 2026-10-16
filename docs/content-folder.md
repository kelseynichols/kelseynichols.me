# The content folder

One folder decides what's on the site. Folders make series, filenames set the
order, and markdown files hold the words. `npm run content` turns the folder
into the site's `content.js` and the web-sized photos.

The folder lives in Google Drive (see [Setup](#setup)). Until that's set up,
the build reads the in-repo stand-in at `media-src/content/`, which holds
today's placeholder photos and writing laid out this way, so it doubles as a
working example.

## At a glance

```
kelseynichols-content/
  010-red-door.jpg            a standalone photo in the carousel
  020-lofoten/                a folder of photos is a series
    info.md                   title, date, cover, optional intro essay
    01-iceberg.jpg            photos, in this order inside the series
    02-nordic-bathhouse.jpg
  030-long-beach-pier.jpg     a photo with words attached:
  030-long-beach-pier.md      same name → adds a title, alt text or an essay
  040-notes-on-light.md       a markdown file on its own is a writing piece
  050-studio-site.png         a screenshot plus a web: link
  050-studio-site.md          is a web project
  _ideas.md                   starts with _ → ignored (drafts, notes)
```

## The rules

| You make                               | The site shows |
|----------------------------------------|----------------|
| A loose photo                          | A photo frame in the carousel. |
| A folder of photos                     | A series. Its cover sits in the carousel; clicking opens a grid of every photo in the folder. |
| `info.md` in a folder                  | The series title and date. Any paragraphs show as an intro essay above the grid. |
| A photo + a `.md` with the same name   | That photo with alt text and a title. If the `.md` has paragraphs, clicking the photo opens them as an essay. |
| A `.md` on its own                     | A text card in the carousel that opens the essay. |
| A `.md` with `web:`                    | The matching screenshot in browser chrome, linking out to that address. |
| A `.md` with only `cover: <photo>`     | Another carousel frame for a photo that lives elsewhere (e.g. inside a series). |
| A name starting with `_`               | Nothing. Use it for drafts and notes. |

The **"All work"** end card and the `/all/` page collect every photo
automatically. There's no file for it.

### Order comes from the number at the front

The number prefix sets the carousel order (`010-`, `020-`…) and the order
inside a series (`01-`, `02-`…). The numbers never show on the site. Files
without a number go after the numbered ones, alphabetically.

Count in tens at the top level, so a new piece fits between `020` and `030` as
`025-` without renaming anything else.

### The rest of the name is the photo id and the page address

`020-lofoten/` becomes `kelseynichols.me/series/lofoten/`, and `01-iceberg.jpg`
becomes the photo `iceberg`. Names are lowercased and spaces become dashes, so
`020-Joshua Tree/` works and becomes `joshua-tree`.

- Every photo name must be unique across the whole folder, even across series.
- Renaming a series folder or writing file changes its web address. Changing
  only the number is safe.

## The markdown files

Each file can start with a settings block between `---` lines, then the
writing. Every setting is optional. Paragraphs are separated by a blank line.

**Series — `020-lofoten/info.md`**

```md
---
title: Lofoten
date: Norway · 2024
cover: iceberg          # carousel photo; defaults to the first one
alt:
  iceberg: Sculpted blue iceberg floating in still water.
  lake-backflip: A diver backflipping off a platform into a lake.
---

Optional intro. It shows above the photo grid.
```

If there's no `title`, the folder name is used (`joshua-tree` → "Joshua Tree").

**Writing — `040-notes-on-light.md`**

```md
---
title: Notes on Light and Color
date: February 2025
excerpt: The short line shown on the carousel card.
---

Shooting film teaches you to see color as something you wait for.

Second paragraph…
```

Without an `excerpt`, the card shows the first paragraph.

**Alt text for a loose photo — `030-long-beach-pier.md`**

```md
---
alt: The Long Beach pier at dusk, fishing lines catching the light.
---
```

**Web project — `050-studio-site.md`** (next to `050-studio-site.png`)

```md
---
title: Studio Site
web: https://example.com
---
```

**Settings reference**

| Setting   | Where                 | Meaning |
|-----------|-----------------------|---------|
| `title`   | anywhere              | Heading / card title |
| `date`    | anywhere              | The small caption line ("Norway · 2024", "March 2025") |
| `excerpt` | writing, photo-essay  | Short line on the carousel card |
| `cover`   | `info.md`, lone `.md` | Which photo shows in the carousel (by photo name) |
| `alt`     | anywhere              | Photo description. In `info.md` it's a list of `photo: text` |
| `web`     | photo's `.md`, lone `.md` | Link for a web project |
| `slug`    | anywhere              | Override the page address (rarely needed) |

A misspelled setting is reported as a warning when you run the build.

Writing is plain paragraphs for now. Bold, italics and links can be added later.

**Alt text** is a short description of the photo for screen readers and search
engines. It's optional, and Claude can draft it from the photos for you to edit.

## Photo files

- **JPEG is best.** PNG, WebP and TIFF also work.
- **Not HEIC or camera RAW.** iPhone photos are HEIC by default; export them as
  JPEG. The build stops and names the file if it finds one.
- **Full size.** Don't resize. The build makes the 160 / 320 / 640 / 1280px
  WebP versions, never enlarges, and fixes phone-camera rotation.
- **Originals stay in Drive.** Only the small web versions are committed.

## Updating the site

1. Add, move or rename files in the content folder, or edit a `.md`.
2. Run `npm run content`. It checks the folder, rewrites `content.js`, and
   builds web versions of new or changed photos (unchanged ones are skipped).
3. Preview locally: `node scripts/generate-routes.mjs && python3 -m http.server 8123`,
   then open `http://<your Mac's IP>:8123` on your phone.
4. Commit and push. The live site updates in about a minute.

`content.js` is generated. Don't edit it by hand; the next build overwrites it.

If something's wrong, the build stops before writing anything and lists each
problem with the file it's in: duplicate photo names, two pages at the same
address, a `cover:` that doesn't match a photo, an empty series folder, or a
HEIC file.

## Setup

1. Install **Google Drive for desktop** so Drive shows up as a folder on the
   Mac (under `~/Library/CloudStorage/GoogleDrive-<you>/My Drive/`).
2. Make the content folder there, e.g. `My Drive/kelseynichols-content`.
3. In the repo, copy `photos.config.example.json` to `photos.config.json`
   (gitignored) and set `contentDir` to that folder's full path.
4. Run `npm run content`. The first line it prints names the folder it read.

One-off alternative without the config file:
`CONTENT_DIR="/path/to/folder" npm run content`.

## Under the hood

- `scripts/lib/content-folder.mjs` reads the folder into the content model
  (photo registry + ordered pieces). Both builds use it, so they always agree.
- `scripts/build-content.mjs` writes `content.js`. The shape is described in
  [content-model.md](content-model.md).
- `scripts/build-images.mjs` writes `media/photos/` and its manifest. See
  [photo-pipeline.md](photo-pipeline.md).
