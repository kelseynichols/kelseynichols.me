/* ============================================================
   SITE CONTENT — the one place you edit to change what's on the page.
   See docs/content-model.md for the full model. In short:

   • PHOTOS  — every photo defined once, by id → { src, alt }.
               The id is just the original file's name (iceberg.png → "iceberg").
   • PIECES  — the carousel, in order. Each piece is a cover photo plus
               whatever it carries. Fill in only the fields that apply:
                 cover    photo id shown in the reel
                 photos   list of photo ids → opens a gallery (a "series")
                 writing  paragraphs → opens an essay (intro if it also has photos)
                 web      a URL → renders the cover as a browser mockup, links out
                 title / meta / slug / excerpt
               A piece with no cover and only writing renders as a text card.

   This file is a plain script (no build step) so both the site and
   scripts/generate-routes.mjs can read it.
   ============================================================ */

(function () {
  "use strict";

  const PHOTOS = {
    "red-img":                     { src: "media/photos/red-img.jpg",                     alt: "Test photo." },
    "ladder-workers":              { src: "media/photos/ladder-workers.png",              alt: "Street scene with two workers carrying a ladder past a warm yellow wall." },
    "flower-shop-double-exposure": { src: "media/photos/flower-shop-double-exposure.png", alt: "Double-exposure of a flower shop street scene." },
    "iceberg":                     { src: "media/photos/iceberg.png",                     alt: "Sculpted blue iceberg floating in still water." },
    "nordic-bathhouse":            { src: "media/photos/nordic-bathhouse.png",            alt: "Boardwalk and bathhouse by the sea, swimmers below." },
    "badlands":                    { src: "media/photos/badlands.png",                    alt: "Figure standing amid the eroded ridges of the Badlands." },
    "lake-backflip":               { src: "media/photos/lake-backflip.png",               alt: "A diver backflipping off a platform into a lake." },
    "riverside-sunbathers":        { src: "media/photos/riverside-sunbathers.png",        alt: "People sunbathing along a wooden waterfront deck." },
    "tropical-beach":              { src: "media/photos/tropical-beach.png",              alt: "A palm-lined tropical beach with mountains and sailboats." },
    "seven-magic-mountains":       { src: "media/photos/seven-magic-mountains.png",       alt: "Colorful stacked boulder sculptures in the desert." },
    "life-ring-portrait":          { src: "media/photos/life-ring-portrait.png",          alt: "Portrait beside a life ring, with a light leak." },
    "jacaranda-tree":              { src: "media/photos/jacaranda-tree.png",              alt: "A blooming jacaranda tree against a stone wall." },
    "wild-sunflowers":             { src: "media/photos/wild-sunflowers.png",             alt: "A field of wild sunflowers against the sky." },
    "white-temple":                { src: "media/photos/white-temple.png",                alt: "Ornate white temple architecture against clouds." },
    "rocking-chairs-portrait":     { src: "media/photos/rocking-chairs-portrait.png",     alt: "Two women sitting together on white rocking chairs." },
    "lily-pond":                   { src: "media/photos/lily-pond.png",                   alt: "Pink water lilies floating on a dark pond." },
    "laundromat":                  { src: "media/photos/laundromat.png",                  alt: "Rows of washers and dryers lit by warm evening light." },
    "kyoto-pagoda":                { src: "media/photos/kyoto-pagoda.png",                alt: "A woman with a red umbrella on a Kyoto street, pagoda behind." },
    "garden-bench":                { src: "media/photos/garden-bench.png",                alt: "Three people reading on a bench along a garden boardwalk." },
    "arched-balconies":            { src: "media/photos/arched-balconies.png",            alt: "Looking up at rows of curved balcony architecture." },
    "brick-balconies":             { src: "media/photos/brick-balconies.png",             alt: "Brick apartment facade with residents on their balconies." },
    "yellow-daisies":              { src: "media/photos/yellow-daisies.png",              alt: "Close-up of yellow daisies with dark purple centers." },
    "sf-cable-car":                { src: "media/photos/sf-cable-car.png",                alt: "A cable car on a San Francisco street among skyscrapers." },
  };

  const PIECES = [
    { cover: "red-img" },
    { cover: "ladder-workers" },
    { cover: "flower-shop-double-exposure" },
    {
      // A series: the cover opens a gallery of the whole set. Switch the reel
      // cover by changing `cover` to any photo id (in the gallery or not).
      cover: "iceberg",
      slug: "lofoten",
      title: "Lofoten",
      meta: "Norway · 2024",
      photos: [
        "iceberg", "nordic-bathhouse", "badlands", "lake-backflip",
        "riverside-sunbathers", "tropical-beach", "seven-magic-mountains",
        "life-ring-portrait",
      ],
    },
    { web: null }, // web project — add a cover screenshot + URL when ready
    { cover: "jacaranda-tree" },
    { cover: "wild-sunflowers" },
    { cover: "white-temple" },
    {
      slug: "helen-park",
      meta: "April 2025",
      title: "Lorem Ipsum Dolor Sit Amet.",
      excerpt: "Curabitur in nulla a ipsum laoreet imperdiet. Proin semper egestas gravida. Integer id risus ex. In id fermentum tortor. Integer volutpat magna eu purus porttitor porta id eu nibh.",
      writing: [
        "Curabitur in nulla a ipsum laoreet imperdiet. Proin semper egestas gravida. Integer id risus ex. In id fermentum tortor. Integer volutpat magna eu purus porttitor porta id eu nibh. Sed euismod, nunc sit amet aliquam lacinia, nisl nisl aliquet nisl, nec aliquam nisl nisl sit amet nisl.",
        "Aenean lacinia, magna ut posuere consectetur, leo nibh dignissim odio, ac volutpat lectus odio at urna. Maecenas convallis, lacus eget porta congue, nibh velit varius elit, quis tincidunt sem sapien vitae nunc. Donec feugiat quam a venenatis aliquam.",
        "Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. This is placeholder body copy standing in for the full piece.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam at tortor in tellus interdum sagittis. The real essay lands here — this view is only demonstrating how reading a full piece feels.",
      ],
    },
    { cover: "rocking-chairs-portrait" },
    { cover: "badlands" },
    { cover: "lily-pond" },
    { web: null },
    { cover: "life-ring-portrait" },
    { cover: "seven-magic-mountains" },
    { cover: "iceberg" },
    {
      slug: "quiet-mornings",
      meta: "March 2025",
      title: "Quiet Mornings In Long Beach.",
      excerpt: "Aenean lacinia, magna ut posuere consectetur, leo nibh dignissim odio, ac volutpat lectus odio at urna. Maecenas convallis, lacus eget porta congue, nibh velit varius elit.",
      writing: [
        "Aenean lacinia, magna ut posuere consectetur, leo nibh dignissim odio, ac volutpat lectus odio at urna. Maecenas convallis, lacus eget porta congue, nibh velit varius elit, quis tincidunt sem sapien vitae nunc.",
        "Donec feugiat quam a venenatis aliquam. Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. The morning light in Long Beach does something specific to the color of everything — this is where that observation would live.",
        "Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Placeholder text, standing in for the full piece.",
      ],
    },
    { cover: "laundromat" },
    {
      cover: "kyoto-pagoda",
      slug: "kyoto",
      title: "Kyoto",
      meta: "Japan · 2023",
      photos: [
        "kyoto-pagoda", "white-temple", "jacaranda-tree", "lily-pond",
        "garden-bench", "laundromat",
      ],
    },
    { cover: "arched-balconies" },
    { web: null },
    { cover: "riverside-sunbathers" },
    { cover: "tropical-beach" },
    { cover: "lake-backflip" },
    {
      slug: "notes-on-light",
      meta: "February 2025",
      title: "Notes On Light And Color.",
      excerpt: "Donec feugiat quam a venenatis aliquam. Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. Suspendisse potenti. Pellentesque habitant morbi tristique senectus.",
      writing: [
        "Donec feugiat quam a venenatis aliquam. Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Shooting film teaches you to see color as something you wait for rather than something you fix later — the full note picks that up here.",
        "Nam at tortor in tellus interdum sagittis. Placeholder body copy standing in for the full piece so the reading flow can be felt end to end.",
      ],
    },
    { cover: "garden-bench" },
    { cover: "brick-balconies" },
    { cover: "yellow-daisies" },
    { cover: "sf-cable-car" },
    // Contact sheet — the end card. Opens the /all/ grid of every photo.
    { archive: true, title: "All work" },
  ];

  window.SITE_CONTENT = { photos: PHOTOS, pieces: PIECES };
})();
