// Reads the content folder (see docs/content-folder.md) into the site's content
// model: a photo registry + an ordered list of pieces. Shared by
// build-images.mjs (which photos to resize) and build-content.mjs (which writes
// content.js), so both always agree on ids and order.
//
// Layout, in short:
//   010-red-door.jpg          loose image            → photo piece
//   010-red-door.md           same name as an image  → title/alt/essay/web for it
//   020-lofoten/              folder                 → series
//     info.md                 series settings + intro essay
//     01-iceberg.jpg          photos, in order
//   040-notes-on-light.md     lone markdown          → writing piece / cover ref / web
// Number prefixes set order and are stripped; the rest of the name is the photo
// id or page slug. Names starting with "_" or "." are ignored (drafts).

import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { join, extname, isAbsolute, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

const IMAGE_EXT = /\.(jpe?g|png|webp|tiff?)$/i;
const UNSUPPORTED_IMAGE_EXT = /\.(heic|heif|cr2|cr3|nef|arw|dng|raf|orf|rw2)$/i;
const MD_EXT = /\.md$/i;

// Frontmatter keys each kind of markdown file understands. Anything else is
// reported as a warning (likely a typo) rather than silently ignored.
const SERIES_KEYS = ["title", "date", "meta", "cover", "alt", "excerpt", "slug"];
const PIECE_KEYS = ["title", "date", "meta", "cover", "alt", "excerpt", "slug", "web"];

// Where the content folder lives. Resolution order:
//   1. CONTENT_DIR env var (PHOTOS_SRC still accepted)
//   2. photos.config.json {contentDir} ({srcDir} still accepted) — gitignored
//   3. media-src/content/ — the in-repo stand-in (placeholder content)
export function resolveContentDir(root) {
  const env = process.env.CONTENT_DIR || process.env.PHOTOS_SRC;
  if (env) return { dir: env, from: "CONTENT_DIR env" };
  const cfgPath = join(root, "photos.config.json");
  if (existsSync(cfgPath)) {
    const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
    const dir = cfg.contentDir || cfg.srcDir;
    if (dir) {
      return { dir: isAbsolute(dir) ? dir : resolve(root, dir), from: "photos.config.json" };
    }
  }
  return { dir: join(root, "media-src", "content"), from: "default (in-repo stand-in)" };
}

// "020-Lofoten Trip" → { order: 20, name: "lofoten-trip" }
function parseName(raw) {
  const m = raw.match(/^(\d+)[-_. ]+(.*)$/);
  const order = m ? Number(m[1]) : Infinity;
  const rest = m ? m[2] : raw;
  const name = rest
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { order, name };
}

function stem(file) {
  return file.slice(0, file.length - extname(file).length);
}

function humanize(name) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Numbered entries first, in number order; then unnumbered, alphabetically.
function byOrder(a, b) {
  if (a.order !== b.order) return a.order - b.order;
  return a.file.localeCompare(b.file, undefined, { numeric: true });
}

function listDir(dir) {
  return readdirSync(dir)
    .filter((f) => !f.startsWith(".") && !f.startsWith("_") && f !== "Icon\r")
    .map((file) => {
      const full = join(dir, file);
      return { file, full, isDir: statSync(full).isDirectory(), ...parseName(stem(file)) };
    });
}

// Split a markdown file into { data, paragraphs }. Paragraphs are separated by
// blank lines; single line breaks inside a paragraph become spaces.
function readMarkdown(path, problems) {
  const text = readFileSync(path, "utf8").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  let data = {};
  let body = text;
  const fm = text.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (fm) {
    try {
      data = parseYaml(fm[1]) || {};
    } catch (err) {
      problems.error(`${path}: the settings block between the --- lines isn't valid (${err.message.split("\n")[0]})`);
    }
    body = text.slice(fm[0].length);
  }
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  return { data: data && typeof data === "object" ? data : {}, paragraphs };
}

function checkKeys(path, data, allowed, problems) {
  for (const key of Object.keys(data)) {
    if (!allowed.includes(key)) {
      problems.warn(`${path}: unknown setting "${key}" (ignored). Known: ${allowed.join(", ")}`);
    }
  }
}

function str(v) {
  return v == null ? undefined : String(v).trim() || undefined;
}

export function readContentFolder(dir) {
  const errors = [];
  const warnings = [];
  const problems = {
    error: (m) => errors.push(m),
    warn: (m) => warnings.push(m),
  };

  const photos = new Map(); // id → { path, ext, alt }
  const pieces = [];
  const slugs = new Map(); // slug → path that claimed it

  function addPhoto(entry) {
    const id = entry.name;
    if (!id) {
      problems.error(`${entry.full}: the name has no letters or numbers to use as an id`);
      return null;
    }
    if (photos.has(id)) {
      problems.error(
        `Two photos are both named "${id}" — every photo name must be unique:\n` +
          `    ${photos.get(id).path}\n    ${entry.full}`
      );
      return null;
    }
    photos.set(id, { path: entry.full, ext: extname(entry.file).toLowerCase(), alt: "" });
    return id;
  }

  function claimSlug(slug, path) {
    if (slugs.has(slug)) {
      problems.error(
        `Two pages would both live at "${slug}" — rename one:\n    ${slugs.get(slug)}\n    ${path}`
      );
    } else {
      slugs.set(slug, path);
    }
  }

  function flagUnsupported(entry) {
    if (UNSUPPORTED_IMAGE_EXT.test(entry.file)) {
      problems.error(`${entry.full}: ${extname(entry.file)} files can't be read — export it as a JPEG`);
      return true;
    }
    return false;
  }

  // Covers named in markdown are checked after everything is read, since a
  // cover can point at a photo that lives later in the folder.
  const coverRefs = []; // { id, path }

  const top = listDir(dir).sort(byOrder);
  const topImages = new Map(top.filter((e) => !e.isDir && IMAGE_EXT.test(e.file)).map((e) => [stem(e.file), e]));

  for (const entry of top) {
    if (entry.isDir) {
      pieces.push(readSeries(entry));
    } else if (IMAGE_EXT.test(entry.file)) {
      const id = addPhoto(entry);
      if (!id) continue;
      const sidecarPath = join(dir, `${stem(entry.file)}.md`);
      const piece = { cover: id };
      if (existsSync(sidecarPath)) {
        const { data, paragraphs } = readMarkdown(sidecarPath, problems);
        checkKeys(sidecarPath, data, PIECE_KEYS, problems);
        if (str(data.alt)) photos.get(id).alt = str(data.alt);
        Object.assign(piece, pieceFields(data, paragraphs, entry, sidecarPath));
      }
      pieces.push(piece);
    } else if (MD_EXT.test(entry.file)) {
      if (topImages.has(stem(entry.file))) continue; // sidecar, handled with its image
      const { data, paragraphs } = readMarkdown(entry.full, problems);
      checkKeys(entry.full, data, PIECE_KEYS, problems);
      const piece = {};
      if (str(data.cover)) {
        piece.cover = str(data.cover);
        coverRefs.push({ id: piece.cover, path: entry.full });
        if (str(data.alt)) piece.alt = str(data.alt);
      }
      Object.assign(piece, pieceFields(data, paragraphs, entry, entry.full));
      if (!piece.cover && !piece.writing && !("web" in piece)) {
        problems.warn(`${entry.full}: no writing, cover or web link — it will show as an empty card`);
      }
      pieces.push(piece);
    } else if (!flagUnsupported(entry)) {
      problems.warn(`${entry.full}: not a photo, folder or .md file (ignored)`);
    }
  }

  // Fields shared by a photo's sidecar and a lone markdown file.
  function pieceFields(data, paragraphs, entry, path) {
    const out = {};
    if (paragraphs.length) {
      out.slug = str(data.slug) || entry.name;
      claimSlug(out.slug, path);
    }
    if (str(data.title)) out.title = str(data.title);
    const meta = str(data.date) || str(data.meta);
    if (meta) out.meta = meta;
    if (str(data.excerpt)) out.excerpt = str(data.excerpt);
    if (paragraphs.length) out.writing = paragraphs;
    if ("web" in data) out.web = str(data.web) || null;
    return out;
  }

  function readSeries(folder) {
    const inside = listDir(folder.full).sort(byOrder);
    const ids = [];
    for (const e of inside) {
      if (e.isDir) {
        problems.warn(`${e.full}: folders inside a series are ignored`);
      } else if (IMAGE_EXT.test(e.file)) {
        const id = addPhoto(e);
        if (id) ids.push(id);
      } else if (!MD_EXT.test(e.file) && !flagUnsupported(e)) {
        problems.warn(`${e.full}: not a photo or .md file (ignored)`);
      }
    }

    // Per-photo sidecars inside a series only carry alt text.
    const imageStems = new Set(inside.filter((e) => IMAGE_EXT.test(e.file)).map((e) => stem(e.file)));
    for (const e of inside) {
      if (!MD_EXT.test(e.file) || e.file.toLowerCase() === "info.md") continue;
      if (!imageStems.has(stem(e.file))) {
        problems.warn(`${e.full}: only info.md or a photo's same-name .md belong in a series folder (ignored)`);
        continue;
      }
      const { data } = readMarkdown(e.full, problems);
      const photo = photos.get(e.name);
      if (photo && str(data.alt)) photo.alt = str(data.alt);
    }

    const infoFile = inside.find((e) => e.file.toLowerCase() === "info.md");
    const { data, paragraphs } = infoFile
      ? readMarkdown(infoFile.full, problems)
      : { data: {}, paragraphs: [] };
    if (infoFile) checkKeys(infoFile.full, data, SERIES_KEYS, problems);

    if (data.alt && typeof data.alt === "object") {
      for (const [id, text] of Object.entries(data.alt)) {
        if (!ids.includes(id)) {
          problems.warn(`${infoFile.full}: alt text for "${id}", but there's no photo by that name in this folder`);
        } else if (str(text)) {
          photos.get(id).alt = str(text);
        }
      }
    }

    if (ids.length === 0) {
      problems.error(`${folder.full}: a series folder needs at least one photo`);
    }

    const slug = str(data.slug) || folder.name;
    claimSlug(slug, folder.full);
    const piece = { cover: str(data.cover) || ids[0], slug };
    if (str(data.cover)) coverRefs.push({ id: piece.cover, path: infoFile.full });
    piece.title = str(data.title) || humanize(folder.name);
    const meta = str(data.date) || str(data.meta);
    if (meta) piece.meta = meta;
    if (str(data.excerpt)) piece.excerpt = str(data.excerpt);
    piece.photos = ids;
    if (paragraphs.length) piece.writing = paragraphs;
    return piece;
  }

  for (const ref of coverRefs) {
    if (!photos.has(ref.id)) {
      problems.error(`${ref.path}: cover "${ref.id}" doesn't match any photo name in the folder`);
    }
  }

  // The contact-sheet end card is always last and needs no file.
  pieces.push({ archive: true, title: "All work" });

  return { photos, pieces, errors, warnings };
}

// Move a photo's .md into _removed/ once the photo itself is gone, so it doesn't
// turn into a stray card. A lone top-level .md counts as left behind when its
// name was a photo in the last build (previousIds) or when it has nothing a
// lone .md can show (no writing, cover or web link). A .md with cover: is
// never touched. Moved, not deleted, so any
// words in it can be put back. Returns the moved paths, relative to dir.
export function tidyOrphanedMarkdown(dir, previousIds = new Set()) {
  const moved = [];
  const bin = join(dir, "_removed");
  function moveToBin(entry, label) {
    if (!existsSync(bin)) mkdirSync(bin);
    let dest = join(bin, entry.file);
    for (let n = 2; existsSync(dest); n++) dest = join(bin, `${stem(entry.file)} (${n})${extname(entry.file)}`);
    renameSync(entry.full, dest);
    moved.push(label);
  }

  const top = listDir(dir);
  const topImageStems = new Set(top.filter((e) => !e.isDir && IMAGE_EXT.test(e.file)).map((e) => stem(e.file)));
  for (const entry of top) {
    if (entry.isDir) {
      const inside = listDir(entry.full);
      const imageStems = new Set(inside.filter((e) => IMAGE_EXT.test(e.file)).map((e) => stem(e.file)));
      for (const e of inside) {
        if (!e.isDir && MD_EXT.test(e.file) && e.file.toLowerCase() !== "info.md" && !imageStems.has(stem(e.file))) {
          moveToBin(e, `${entry.file}/${e.file}`);
        }
      }
    } else if (MD_EXT.test(entry.file) && !topImageStems.has(stem(entry.file))) {
      const { data, paragraphs } = readMarkdown(entry.full, { error() {}, warn() {} });
      if (str(data.cover)) continue; // a cover ref is named after a photo that lives elsewhere
      const showsSomething = paragraphs.length || "web" in data;
      if (previousIds.has(entry.name) || !showsSomething) moveToBin(entry, entry.file);
    }
  }
  return moved;
}

// Print problems with paths shown relative to the content folder; exit
// non-zero when there are errors so nothing half-built gets written.
export function reportProblems({ errors, warnings }, dir) {
  const short = (m) => m.split(dir + "/").join("");
  for (const w of warnings) console.warn(`  ! ${short(w)}`);
  if (errors.length) {
    console.error(`\n${errors.length} problem(s) to fix in the content folder:\n`);
    for (const e of errors) console.error(`  ✗ ${short(e)}\n`);
    process.exit(1);
  }
}
