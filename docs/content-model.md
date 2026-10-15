# Content model — how the carousel is built

Everything on the site is one list of **pieces**. A piece is the unit you
author; each one becomes a frame in the carousel. This replaces the old rigid
split where a frame was *either* a photo *or* a series *or* writing *or* a web
project. Now a piece is just a cover photo plus whatever it happens to carry.

## The idea in one sentence

**A piece = an (optional) cover photo + optional payloads — a gallery, writing,
and/or a web link.** How it looks in the reel and what opens when you click it
are both derived from which fields you filled in.

## Fields

| Field     | Meaning                                                            | Optional? |
|-----------|-------------------------------------------------------------------|-----------|
| `cover`   | The photo shown in the reel (a photo **id** — see registry below) | Optional\* |
| `title`   | Label / heading                                                   | Optional  |
| `meta`    | Small caption line (e.g. `"Norway · 2024"`, a date)               | Optional  |
| `slug`    | Clean-URL segment for pieces that open a panel (series, writing)  | If routed |
| `alt`     | Alt text when the cover is written inline instead of via id       | Optional  |
| `photos`  | List of photo ids → makes it a **series** (opens a gallery grid)  | Optional  |
| `writing` | Essay paragraphs → opens a **reading** panel                      | Optional  |
| `web`     | A URL → renders the cover in browser chrome, links out on click   | Optional  |

\* `cover` is required for everything **except standalone writing** (a text-only
piece with no photo).

## What a piece looks like in the reel (its "face")

Derived, in this order:

1. has `web` → **browser-mockup card** showing the cover screenshot
2. has `cover` → **photo frame** (a series also gets the stacked-sheets look + a
   label with its photo count)
3. no cover (writing only) → **text card** (title + meta), like today's writing
   frame

## What opens when you click it (its "payload")

- has `photos` → the **gallery** grid
- has `writing` → the **essay**; if it *also* has `photos`, the essay shows as an
  intro above the gallery
- has `web` → opens the **link**
- none of the above → it's just a photo in the reel

## Everything you can make, in one shape

```js
// plain photo — cover only
{ cover: "red-img" }

// series — a cover photo that opens a gallery (switch the cover by changing
// the one id; it can be one of the photos below, or a separate hero shot)
{ cover: "iceberg", slug: "lofoten", title: "Lofoten", meta: "Norway · 2024",
  photos: ["iceberg", "nordic-bathhouse", "badlands", "lake-backflip"] }

// photo-essay — a cover photo that opens writing
{ cover: "garden-bench", slug: "quiet-mornings", title: "Quiet Mornings",
  meta: "March 2025", writing: ["First paragraph…", "Second paragraph…"] }

// series WITH an essay — writing shows as an intro above the gallery
{ cover: "kyoto-pagoda", slug: "kyoto", title: "Kyoto", photos: [...],
  writing: ["…"] }

// standalone writing — NO cover → renders as a text card
{ slug: "helen-park", title: "Helen Park", meta: "April 2025",
  writing: ["…", "…"] }

// web project — the cover is a screenshot of the design; browser chrome + link
{ cover: "project-screenshot", title: "Some Site", web: "https://example.com" }
```

The trick to the whole model: a plain photo and a standalone essay live in the
**same list, same shape** — they just fill in different fields.

## Photos are referenced by id

Every photo is defined once in a registry, then referenced by **id** from
`cover` and `photos`:

```js
const PHOTOS = {
  iceberg:  { src: "media/photos/iceberg.png",  alt: "Sculpted blue iceberg…" },
  badlands: { src: "media/photos/badlands.png", alt: "Figure amid eroded ridges." },
  // …
};
```

Why ids:
- **Switch a series' cover** by changing one id — no copy-pasting paths/alt text.
- A photo used as a cover *and* inside its own gallery is written **once**; its
  alt text can't drift out of sync.
- The id is just the original file's name (`iceberg.png` → `iceberg`), which is
  also the key the image pipeline uses (see [photo-pipeline.md](photo-pipeline.md)),
  so ids line up with the WebP derivatives automatically.

## The "All work" contact sheet

Unchanged in spirit: the `/all/` grid still gathers **every photo on the site**
— standalone covers plus every series frame — into one contact sheet. With the
registry it can simply walk `PHOTOS`, or walk the pieces; either way, nothing
to maintain by hand.

## Relationship to the old model

| Old type   | New piece                                              |
|------------|--------------------------------------------------------|
| `photo`    | `{ cover }`                                            |
| `series`   | `{ cover, photos, … }`                                 |
| `writing`  | `{ writing, … }` (no cover) — or attach a `cover`      |
| `web`      | `{ cover: <screenshot>, web: <url>, … }`               |
| `archive`  | kept as-is (the generated "All work" end card)         |

---

**Status:** model agreed, not yet built. Next step is refactoring `ITEMS` in
`script.js` to this shape and updating the render/routing to derive face +
payload from the fields instead of a single `type`.
