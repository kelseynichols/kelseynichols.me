# Kelsey Nichols — Creative Portfolio

A single-page horizontal-carousel portfolio. Vertical scroll is hijacked and redirected to drive a film-reel-like horizontal carousel. Built as a static site with vanilla HTML / CSS / JS — no build step, no framework.

## Run locally

Any static file server works. The fonts and `picsum.photos` images need to load over `http://`, so `file://` will technically work but is not recommended.

```bash
# Pick one:
npx http-server -p 8123 -c-1 -s
# or:
python3 -m http.server 8123
```

Open <http://localhost:8123>.

## Project structure

```
.
├── index.html        # Markup
├── style.css         # All styles (design tokens, layout, responsive, fonts)
├── script.js         # Carousel, scrubber, filter, clock, scroll hijack
├── fonts/            # Monaspace Xenon family
│   ├── MonaspaceXenon-Regular.otf
│   ├── MonaspaceXenon-Italic.otf
│   ├── MonaspaceXenon-Bold.otf
│   ├── MonaspaceXenon-BoldItalic.otf
│   ├── MonaspaceXenon-ExtraLight.otf
│   └── MonaspaceXenon-ExtraLightItalic.otf
└── README.md
```

## Swapping content

All carousel items live in a single array at the top of `script.js`:

```js
const ITEMS = [
  { type: "photo",   src: "https://...", alt: "..." },
  { type: "web",     src: null,           alt: "..." },         // null → placeholder
  { type: "writing", meta: "April 2025", title: "...", body: "..." },
  // ...
];
```

Each entry's `type` must be `photo`, `web`, or `writing`. Replace, reorder, or add items without touching layout code.

## Controls

- **Mouse wheel / trackpad** — vertical and horizontal scroll both drive the carousel horizontally.
- **Touch swipe** — horizontal or vertical, both drive the carousel.
- **Arrow keys** — ← / → / ↑ / ↓ step one item; `Home` / `End` jump to ends; `Esc` returns to Work.
- **Filter icons** (top-center) — toggle filters: camera = photos, browser = web, lines = writing. Click an active filter again to clear.
- **Scrubber** (bottom-center) — click a tick to jump; click-and-drag for live scrub. Dimmed ticks (filtered out) are inert.
- **Thumbnail click** — centers that item.

## Design tokens

Defined in `style.css` under `:root`:

| Token | Value |
|---|---|
| `--color-bg` | `#120C0B` |
| `--color-accent` | `#C8DEC2` |
| `--color-surface` | `rgba(255,255,255,0.03)` |
| `--color-scrubber-dim` | `rgba(200,222,194,0.4)` |
| `--color-writing-continue` | `#D23D2D` |
| `--focused-size` | `640px` (mobile: `min(80vw, 340px)`) |
| `--thumb-size` | `160px` (mobile: `min(22vw, 100px)`) |
| `--item-gap` | `24px` |
| `--item-padding` | `24px` (mobile: `16px`) |
| `--tick-width` / `--tick-gap` / `--tick-max-height` | `1px` / `8px` / `32px` |
| `--easing` | `cubic-bezier(0.16, 1, 0.3, 1)` |

## URLs

| Route | View |
|---|---|
| `/` | Work (carousel) |
| `/#about` | About |
| `/#contact` | Contact |

Navigation never reloads — clicking a nav link rewrites the URL with
`history.pushState` and plays the same in-page transition as before. Back /
forward, refresh, deep links, and cmd-click-to-new-tab all work.

Hash fragments rather than clean paths (`/about`) deliberately: this is a
static site with no server rewrites, so `#about` is the only form that survives
a refresh or a shared link on any host, `file://` included. Deep-linking
straight to a panel skips the gallery intro and plays that panel's own line
reveal; Work stays retracted behind it and animates in when you navigate back.
An unrecognised fragment falls back to Work.

## Debug panel

Click the `Long Beach, California` label (bottom right) to open it; `Esc` closes.
Four tabs: **Motion** (scroll physics, snapping, filter timing, item dimming),
**Theme** (colors, typography), **Gallery** (item geometry, page margin, scrubber
ticks), **About** (panel typography and the line-reveal timing). `Reset` restores
every default; `Copy` puts the current values on the clipboard as JSON.

The Gallery tab's size controls write inline CSS variables *only* when a value
differs from its default — at the defaults they clear the inline property so the
responsive `@media` overrides still apply.

## Notes

- Only the **Creative** page is implemented. `Consulting`, `About`, `Contact` nav links are present but inert (placeholders).
- The clock always renders in `America/Los_Angeles`. The UTC-offset label (`GMT-8` / `GMT-7`) updates with DST automatically.
- On viewports under 400px wide, the date and `LONG BEACH, CALIFORNIA` label are hidden to give the header / footer breathing room.
- The `window.__kelsey` object is exposed for debugging (`offset`, `velocity`, `inSet`, `presence`, `sizes`).
