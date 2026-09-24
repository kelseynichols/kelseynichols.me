/* ============================================================
   K. NICHOLS — Creative page
   Vanilla JS horizontal carousel with scroll hijacking,
   momentum-based snapping, filter system, and scrubber.
   ============================================================ */

(() => {
  "use strict";

  /* ----------------------------------------------------------------
     Configuration — edit this array to swap content
  ---------------------------------------------------------------- */
  const ITEMS = [
    { type: "photo", src: "media/photos/ladder-workers.png", alt: "Street scene with two workers carrying a ladder past a warm yellow wall." },
    { type: "photo", src: "media/photos/flower-shop-double-exposure.png", alt: "Double-exposure of a flower shop street scene." },
    { type: "photo", src: "media/photos/nordic-bathhouse.png", alt: "Boardwalk and bathhouse by the sea, swimmers below." },
    { type: "web",   src: null, alt: "Web project preview." },
    { type: "photo", src: "media/photos/jacaranda-tree.png", alt: "A blooming jacaranda tree against a stone wall." },
    { type: "photo", src: "media/photos/wild-sunflowers.png", alt: "A field of wild sunflowers against the sky." },
    { type: "photo", src: "media/photos/white-temple.png",  alt: "Ornate white temple architecture against clouds." },
    {
      type: "writing",
      slug: "helen-park",
      meta: "April 2025",
      title: "Lorem Ipsum Dolor Sit Amet.",
      body: "Curabitur in nulla a ipsum laoreet imperdiet. Proin semper egestas gravida. Integer id risus ex. In id fermentum tortor. Integer volutpat magna eu purus porttitor porta id eu nibh.",
      full: [
        "Curabitur in nulla a ipsum laoreet imperdiet. Proin semper egestas gravida. Integer id risus ex. In id fermentum tortor. Integer volutpat magna eu purus porttitor porta id eu nibh. Sed euismod, nunc sit amet aliquam lacinia, nisl nisl aliquet nisl, nec aliquam nisl nisl sit amet nisl.",
        "Aenean lacinia, magna ut posuere consectetur, leo nibh dignissim odio, ac volutpat lectus odio at urna. Maecenas convallis, lacus eget porta congue, nibh velit varius elit, quis tincidunt sem sapien vitae nunc. Donec feugiat quam a venenatis aliquam.",
        "Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. This is placeholder body copy standing in for the full piece.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam at tortor in tellus interdum sagittis. The real essay lands here — this view is only demonstrating how reading a full piece feels.",
      ],
    },
    { type: "photo", src: "media/photos/rocking-chairs-portrait.png", alt: "Two women sitting together on white rocking chairs." },
    { type: "photo", src: "media/photos/badlands.png", alt: "Figure standing amid the eroded ridges of the Badlands." },
    { type: "photo", src: "media/photos/lily-pond.png", alt: "Pink water lilies floating on a dark pond." },
    { type: "web",   src: null, alt: "Web project preview." },
    { type: "photo", src: "media/photos/life-ring-portrait.png", alt: "Portrait beside a life ring, with a light leak." },
    { type: "photo", src: "media/photos/seven-magic-mountains.png", alt: "Colorful stacked boulder sculptures in the desert." },
    { type: "photo", src: "media/photos/iceberg.png", alt: "Sculpted blue iceberg floating in still water." },
    {
      type: "writing",
      slug: "quiet-mornings",
      meta: "March 2025",
      title: "Quiet Mornings In Long Beach.",
      body: "Aenean lacinia, magna ut posuere consectetur, leo nibh dignissim odio, ac volutpat lectus odio at urna. Maecenas convallis, lacus eget porta congue, nibh velit varius elit.",
      full: [
        "Aenean lacinia, magna ut posuere consectetur, leo nibh dignissim odio, ac volutpat lectus odio at urna. Maecenas convallis, lacus eget porta congue, nibh velit varius elit, quis tincidunt sem sapien vitae nunc.",
        "Donec feugiat quam a venenatis aliquam. Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. The morning light in Long Beach does something specific to the color of everything — this is where that observation would live.",
        "Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Placeholder text, standing in for the full piece.",
      ],
    },
    { type: "photo", src: "media/photos/laundromat.png", alt: "Rows of washers and dryers lit by warm evening light." },
    { type: "photo", src: "media/photos/kyoto-pagoda.png", alt: "A woman with a red umbrella on a Kyoto street, pagoda behind." },
    { type: "photo", src: "media/photos/arched-balconies.png", alt: "Looking up at rows of curved balcony architecture." },
    { type: "web",   src: null, alt: "Web project preview." },
    { type: "photo", src: "media/photos/riverside-sunbathers.png", alt: "People sunbathing along a wooden waterfront deck." },
    { type: "photo", src: "media/photos/tropical-beach.png", alt: "A palm-lined tropical beach with mountains and sailboats." },
    { type: "photo", src: "media/photos/lake-backflip.png", alt: "A diver backflipping off a platform into a lake." },
    {
      type: "writing",
      slug: "notes-on-light",
      meta: "February 2025",
      title: "Notes On Light And Color.",
      body: "Donec feugiat quam a venenatis aliquam. Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. Suspendisse potenti. Pellentesque habitant morbi tristique senectus.",
      full: [
        "Donec feugiat quam a venenatis aliquam. Integer aliquet condimentum eros, vel lobortis sapien pharetra eu. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Shooting film teaches you to see color as something you wait for rather than something you fix later — the full note picks that up here.",
        "Nam at tortor in tellus interdum sagittis. Placeholder body copy standing in for the full piece so the reading flow can be felt end to end.",
      ],
    },
    { type: "photo", src: "media/photos/garden-bench.png", alt: "Three people reading on a bench along a garden boardwalk." },
    { type: "photo", src: "media/photos/brick-balconies.png", alt: "Brick apartment facade with residents on their balconies." },
    { type: "photo", src: "media/photos/yellow-daisies.png", alt: "Close-up of yellow daisies with dark purple centers." },
    { type: "photo", src: "media/photos/sf-cable-car.png", alt: "A cable car on a San Francisco street among skyscrapers." },
  ];

  // Contact form routes here. Swap this to change where messages go.
  const CONTACT_EMAIL = "kelseynichols2@gmail.com";

  const EASE_OUT_EXPO = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  // Top of the scroll-end slider == "Never": at this value the carousel
  // never auto-snaps after scrolling; it rests wherever momentum leaves it.
  const SCROLL_END_NEVER = 2000;

  /* ----------------------------------------------------------------
     Tunable parameters (exposed in debug panel)
  ---------------------------------------------------------------- */
  const DEFAULTS = {
    // Scroll input
    pxPerItemFactor: 0.45,   // pxPerItem = focusedSize * factor
    deltaCap: 4.0,           // max items per single wheel event
    velocityCap: 0.1,        // max velocity (items/ms)
    // Animation loop
    activeScrollDecay: 0.99, // velocity decay per 16ms while user still scrolling
    momentumDecay: 0.80,     // velocity decay per 16ms after input stops
    scrollEndMs: 120,        // debounce after last wheel event before snapping (slider max = never)
    snapStrength: 90,        // smaller = faster snap (exponential time constant ms)
    // Filter
    filterMs: 400,           // duration of filter transition
    filterOffsetMs: 500,     // duration of offset animation when filter toggles
    // Touch
    touchVerticalWeight: 0.5,
    // Item focus dimming (distance from center → opacity)
    itemMinOpacity: 0.05,
    itemOpacityFalloff: 2.0,
    // Haptics (Vibration API — Android only; iOS Safari & desktop no-op)
    haptics: true,
    hapticMs: 6,             // pulse length per photo boundary crossed
  };

  const CONFIG = { ...DEFAULTS };

  /* ----------------------------------------------------------------
     Theme (colors + typography)
  ---------------------------------------------------------------- */
  const THEME_DEFAULTS = {
    colorBg: "#120C0B",
    colorAccent: "#C8DEC2",
    surfaceOpacity: 0.03,
    scrubberDimOpacity: 0.4,
    colorWritingContinue: "#D23D2D",
    fontBody: 11,           // all non-title text
    fontTitle: 32,          // writing card titles
    lineHeightBody: 1.5,
    lineHeightTitle: 1.3,
    letterSpacingBody: 0.05,
    letterSpacingTitle: 0.05,
    fontWeight: 400,
    textTransform: "uppercase",
    // About page
    aboutLedeScale: 1.5,    // multiplier on fontTitle
    aboutColumnWidth: 470,  // px
    aboutRevealStagger: 15,    // ms between consecutive lines
    aboutHeaderStaggerMult: 2, // header (lede) lines stagger this much more
    aboutLineDurationMs: 600,  // per-line slide duration (identical for entrance + exit)
    aboutRevealEasing: "easeOutCirc", // per-line curve, same for entrance + exit
    aboutVideoEnabled: false, // halftone loop in the corner, off by default
    // First-load intro (page chrome reveals through the About line masks
    // while the gallery plays its Work-entry transition)
    introStartMs: 80,
    introStagger: 55,
    introStageFadeMs: 700,
    introStageScaleMs: 1150,
    // Gallery geometry. These mirror the CSS :root defaults; applyTheme only
    // writes them inline when they differ from the default, so the responsive
    // @media overrides keep working until a value is actually tuned.
    galleryFocusedSize: 640,
    galleryThumbSize: 160,
    galleryItemGap: 24,
    galleryItemPadding: 24,
    galleryChromePad: 24,
    // Scrubber ticks (heights/opacity are applied per-tick in JS)
    tickWidth: 1,
    tickGap: 8,
    tickMinHeight: 16,
    tickMaxHeight: 32,
    tickMinOpacity: 0.5,
  };

  const THEME = { ...THEME_DEFAULTS };

  let activeDebugTab = "motion";

  /* ----------------------------------------------------------------
     DOM
  ---------------------------------------------------------------- */
  const track = document.getElementById("track");
  const scrubberEl = document.getElementById("scrubber");
  const scrubberTrack = document.getElementById("scrubberTrack");
  const metaDateEl = document.getElementById("metaDate");
  const metaTimeEl = document.getElementById("metaTime");
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
  const filtersEl = document.querySelector(".filters");
  const stage = document.querySelector(".stage");
  const pageEl = document.querySelector(".page");
  const aboutEl = document.getElementById("about");
  const navItems = Array.from(document.querySelectorAll("[data-nav]"));
  const locationEl = document.getElementById("location");
  const debugEl = document.getElementById("debug");
  const debugCloseBtn = document.getElementById("debugClose");
  const debugMotionControls = document.getElementById("debugMotionControls");
  const debugThemeControls = document.getElementById("debugThemeControls");
  const debugMotionSection = document.getElementById("debugMotionSection");
  const debugThemeSection = document.getElementById("debugThemeSection");
  const debugTabs = Array.from(document.querySelectorAll(".debug__tab"));
  const debugReadout = document.getElementById("debugReadout");
  const debugResetBtn = document.getElementById("debugReset");
  const debugCopyBtn = document.getElementById("debugCopy");
  const debugAboutControls = document.getElementById("debugAboutControls");
  const debugAboutSection = document.getElementById("debugAboutSection");
  const debugGalleryControls = document.getElementById("debugGalleryControls");
  const debugGallerySection = document.getElementById("debugGallerySection");

  // Set at top level, not in init(): this script is the last thing in <body>,
  // so it runs before the first paint and the retracted state is what the page
  // shows initially. Setting it inside init() would let a fully laid-out frame
  // paint first and the intro would read as a jump. playIntro() clears it.
  pageEl.classList.add("page--intro");

  /* ----------------------------------------------------------------
     State
  ---------------------------------------------------------------- */
  let focusedSize = 560;
  let thumbSize = 160;
  let gap = 24;
  let itemPadding = 24;
  let designInnerSize = focusedSize - 2 * itemPadding;

  /**
   * offset is a fractional index into the CURRENTLY VISIBLE items
   * (i.e. items where inSet[i] === true). 0 means the first visible
   * item is centered; 2.5 means halfway between visible items 2 & 3.
   */
  let offset = 0;
  let activePanel = null;    // currently open reveal panel object, or null (Work)
  let velocity = 0;          // visible-items per ms
  let lastFrameTime = 0;
  let rafId = null;
  let snapTarget = null;
  let snapDuration = null;   // null = use snapStrength exponential; number = ease-out expo over N ms
  let snapStartTime = 0;
  let snapStartOffset = 0;
  let lastInputTime = 0;
  let lastHapticIdx = null;   // rounded offset at last haptic tick

  // Per-item state
  const itemNodes = [];      // .item elements
  const itemScaleNodes = []; // .item__scale wrappers
  const inSet = [];          // bool: currently matches filter
  const presence = [];       // 0..1: animated for filter transitions
  const presenceTarget = []; // 0 or 1
  const presenceStart = [];  // timestamp
  const presenceFrom = [];   // value at transition start

  let activeFilter = null;

  // Scrubber tick appearance
  let hoveredTickIndex = -1;
  // Min/max heights and the dim floor are tunable in the Gallery debug tab;
  // a fully focused tick is always at full brightness.
  const TICK_MAX_OP = 1;

  /* ----------------------------------------------------------------
     Build DOM
  ---------------------------------------------------------------- */
  function buildItems() {
    track.innerHTML = "";
    itemNodes.length = 0;
    itemScaleNodes.length = 0;
    inSet.length = 0;
    presence.length = 0;
    presenceTarget.length = 0;
    presenceStart.length = 0;
    presenceFrom.length = 0;

    ITEMS.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = `item item--${item.type}`;
      el.setAttribute("role", "listitem");
      el.setAttribute("data-index", String(i));
      el.setAttribute("data-type", item.type);
      el.style.setProperty("--presence", "1");

      const scale = document.createElement("div");
      scale.className = "item__scale";

      const inner = document.createElement("div");
      inner.className = "item__inner";

      if (item.type === "photo") {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt || "";
        img.loading = "lazy";
        img.draggable = false;
        inner.appendChild(img);
      } else if (item.type === "web") {
        const chrome = document.createElement("div");
        chrome.className = "item__chrome";
        ["red", "yellow", "green"].forEach((c) => {
          const dot = document.createElement("span");
          dot.className = `dot dot--${c}`;
          chrome.appendChild(dot);
        });
        inner.appendChild(chrome);

        const content = document.createElement("div");
        content.className = "item__content";
        if (item.src) {
          const img = document.createElement("img");
          img.src = item.src;
          img.alt = item.alt || "";
          img.loading = "lazy";
          img.draggable = false;
          content.appendChild(img);
        } else {
          const ph = document.createElement("div");
          ph.className = "item__placeholder";
          ph.textContent = "[Web Project Prev.]";
          content.appendChild(ph);
        }
        inner.appendChild(content);
      } else if (item.type === "writing") {
        const meta = document.createElement("div");
        meta.className = "item__meta";
        meta.textContent = item.meta || "";
        inner.appendChild(meta);

        const title = document.createElement("div");
        title.className = "item__title";
        title.textContent = item.title || "";
        inner.appendChild(title);

        const body = document.createElement("div");
        body.className = "item__body";
        body.textContent = item.body || "";
        inner.appendChild(body);

        const cont = document.createElement("div");
        cont.className = "item__continue";
        const left = document.createElement("span");
        left.textContent = "Continue";
        const right = document.createElement("span");
        right.className = "item__continue-arrow";
        right.textContent = "\u2192";
        cont.appendChild(left);
        cont.appendChild(right);
        inner.appendChild(cont);

        // "Continue \u2192" opens the full piece in the reading panel. Only wired
        // when the item has a slug + full body to show.
        if (item.slug && Array.isArray(item.full) && item.full.length) {
          cont.classList.add("item__continue--link");
          cont.setAttribute("role", "link");
          cont.setAttribute("tabindex", "0");
          cont.setAttribute("aria-label", `Continue reading: ${item.title || ""}`.trim());
          const open = (e) => {
            e.stopPropagation();      // don't let the card's re-center click fire
            e.preventDefault();
            openReading(item.slug);
          };
          cont.addEventListener("click", open);
          cont.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") open(e);
          });
        }
      }

      scale.appendChild(inner);
      el.appendChild(scale);

      el.addEventListener("click", () => {
        if (presence[i] < 1) return;
        const v = itemIndexToVisibleIndex(i);
        if (v < 0) return;
        const cur = Math.round(offset);
        if (v === cur) {
          if (item.type === "writing" && item.slug && Array.isArray(item.full) && item.full.length) {
            openReading(item.slug);
          }
          return;
        }
        animateOffsetTo(v);
      });

      track.appendChild(el);
      itemNodes.push(el);
      itemScaleNodes.push(scale);
      inSet.push(true);
      presence.push(1);
      presenceTarget.push(1);
      presenceStart.push(0);
      presenceFrom.push(1);
    });
  }

  /* ----------------------------------------------------------------
     Scrubber
  ---------------------------------------------------------------- */
  function buildScrubber() {
    scrubberTrack.innerHTML = "";
    ITEMS.forEach((_, i) => {
      const tick = document.createElement("button");
      tick.className = "tick";
      tick.setAttribute("type", "button");
      tick.setAttribute("data-index", String(i));
      tick.setAttribute("aria-label", `Go to item ${i + 1}`);
      tick.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!inSet[i]) return;
        const v = itemIndexToVisibleIndex(i);
        if (v >= 0) animateOffsetTo(v);
      });
      tick.addEventListener("pointerenter", () => {
        hoveredTickIndex = i;
        updateScrubberClasses();
      });
      tick.addEventListener("pointerleave", () => {
        if (hoveredTickIndex === i) hoveredTickIndex = -1;
        updateScrubberClasses();
      });
      scrubberTrack.appendChild(tick);
    });
  }

  function updateScrubberClasses() {
    const ticks = scrubberTrack.querySelectorAll(".tick");
    ticks.forEach((tick, i) => {
      const dim = !inSet[i];
      tick.classList.toggle("is-dim", dim);

      // Progressive focus: a tick grows as its item is scrolled toward
      // center, reaching full height/brightness at exact focus.
      let focus = 0;
      if (!dim) {
        const visIdx = itemIndexToVisibleIndex(i);
        const dist = visIdx - offset;
        focus = Math.max(0, Math.min(1, 1 - Math.abs(dist)));
      }

      // Hovering an active (in-set) tick forces it to full size/brightness.
      const hovered = i === hoveredTickIndex && !dim;
      const f = hovered ? 1 : focus;

      const minH = THEME.tickMinHeight;
      const maxH = THEME.tickMaxHeight;
      const minOp = THEME.tickMinOpacity;
      const h = minH + (maxH - minH) * f;
      tick.style.height = `${h.toFixed(2)}px`;
      tick.style.opacity = dim
        ? String(minOp)
        : (minOp + (TICK_MAX_OP - minOp) * f).toFixed(3);

      tick.classList.toggle("is-active", f > 0.999);
    });
  }

  /* ----------------------------------------------------------------
     Index helpers
  ---------------------------------------------------------------- */
  function countInSet() {
    let n = 0;
    for (let i = 0; i < inSet.length; i++) if (inSet[i]) n++;
    return n;
  }

  function visibleIndexToItemIndex(visIdx) {
    const n = countInSet();
    if (n === 0) return -1;
    const v = Math.max(0, Math.min(n - 1, Math.round(visIdx)));
    let count = 0;
    for (let i = 0; i < inSet.length; i++) {
      if (!inSet[i]) continue;
      if (count === v) return i;
      count++;
    }
    return -1;
  }

  function itemIndexToVisibleIndex(itemIdx) {
    if (!inSet[itemIdx]) return -1;
    let count = 0;
    for (let i = 0; i < itemIdx; i++) if (inSet[i]) count++;
    return count;
  }

  /* ----------------------------------------------------------------
     Sizing
  ---------------------------------------------------------------- */
  function readSizes() {
    const measure = document.createElement("div");
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.pointerEvents = "none";
    measure.style.width = "var(--focused-size)";
    document.body.appendChild(measure);
    focusedSize = measure.getBoundingClientRect().width;
    measure.style.width = "var(--thumb-size)";
    thumbSize = measure.getBoundingClientRect().width;
    measure.style.width = "var(--item-gap)";
    gap = measure.getBoundingClientRect().width;
    measure.style.width = "var(--item-padding)";
    itemPadding = measure.getBoundingClientRect().width;
    measure.remove();
    designInnerSize = focusedSize - 2 * itemPadding;
  }

  /* ----------------------------------------------------------------
     Render
  ---------------------------------------------------------------- */
  function sizeAtDistance(distance) {
    const d = Math.min(1, Math.max(0, 1 - Math.abs(distance)));
    return thumbSize + (focusedSize - thumbSize) * d;
  }

  // Opacity falls from 1 at center toward itemMinOpacity over itemOpacityFalloff
  // visible-index units. Further items stay at the floor.
  function opacityAtDistance(distance) {
    const falloff = Math.max(0.001, CONFIG.itemOpacityFalloff);
    const t = Math.min(1, Math.abs(distance) / falloff);
    return 1 - t * (1 - CONFIG.itemMinOpacity);
  }

  function render() {
    const n = countInSet();
    if (n === 0) {
      track.style.transform = `translate3d(0, -50%, 0)`;
      return;
    }

    // 1) For each item: focus amount, base size, presence-scaled width.
    let visIdx = 0;
    const sizes = new Array(itemNodes.length);
    for (let i = 0; i < itemNodes.length; i++) {
      const el = itemNodes[i];
      let baseSize;
      let isFocused = false;
      let dist = 0;
      if (inSet[i]) {
        dist = visIdx - offset;
        baseSize = sizeAtDistance(dist);
        isFocused = Math.abs(dist) < 0.5;
        visIdx++;
      } else {
        baseSize = thumbSize;
      }
      const pres = presence[i];
      const w = baseSize * pres;
      sizes[i] = w;

      el.style.setProperty("--presence", pres.toFixed(4));

      // Distance-based dimming × filter presence.
      let itemOpacity = pres;
      if (inSet[i]) {
        itemOpacity = opacityAtDistance(dist) * pres;
      }
      el.style.opacity = itemOpacity.toFixed(4);

      if (pres < 0.999) {
        el.style.filter = `blur(${((1 - pres) * 4).toFixed(2)}px)`;
      } else if (el.style.filter) {
        el.style.filter = "";
      }
      el.classList.toggle("is-focused", inSet[i] && isFocused);
    }

    // 2) Lay out: widths, padding (scaled with presence), margin-left for gap.
    //    Apply scale transform to inner content so everything (text,
    //    chrome, graphics) shrinks uniformly with the container.
    const denom = Math.max(1e-6, designInnerSize);
    for (let i = 0; i < itemNodes.length; i++) {
      const w = sizes[i];
      const pres = presence[i];
      itemNodes[i].style.width = `${w}px`;
      itemNodes[i].style.height = `${w}px`;
      itemNodes[i].style.padding = `${itemPadding * pres}px`;
      itemNodes[i].style.marginLeft = i === 0 ? "0px" : `${gap * pres}px`;

      // Inner padded area:
      const innerW = Math.max(0, w - 2 * itemPadding * pres);
      const scale = innerW / denom;
      itemScaleNodes[i].style.transform = `scale(${scale.toFixed(4)})`;
    }

    // 3) Compute the target X (center of focused position) and translate the track.
    const lowerVis = Math.floor(offset);
    const upperVis = Math.min(n - 1, lowerVis + 1);
    const t = Math.max(0, Math.min(1, offset - lowerVis));

    const lowerItemIdx = visibleIndexToItemIndex(lowerVis);
    const upperItemIdx = visibleIndexToItemIndex(upperVis);

    // Compute cumulative left edges (matches CSS layout in JS terms).
    const leftEdges = new Array(itemNodes.length);
    let cursor = 0;
    for (let i = 0; i < itemNodes.length; i++) {
      if (i > 0) cursor += gap * presence[i];
      leftEdges[i] = cursor;
      cursor += sizes[i];
    }

    let targetCenter = 0;
    if (lowerItemIdx >= 0) {
      const lowerCenter = leftEdges[lowerItemIdx] + sizes[lowerItemIdx] / 2;
      if (upperItemIdx >= 0 && upperItemIdx !== lowerItemIdx) {
        const upperCenter = leftEdges[upperItemIdx] + sizes[upperItemIdx] / 2;
        targetCenter = lowerCenter + (upperCenter - lowerCenter) * t;
      } else {
        targetCenter = lowerCenter;
      }
    }

    const stageWidth = stage.clientWidth;
    const tx = stageWidth / 2 - targetCenter;
    track.style.transform = `translate3d(${tx}px, -50%, 0)`;

    updateScrubberClasses();

    if (debugEl.classList.contains("is-open")) updateDebugReadout();
  }

  /* ----------------------------------------------------------------
     Animation loop
  ---------------------------------------------------------------- */
  function startLoop() {
    if (rafId !== null) return;
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function tick(now) {
    const dt = Math.max(1, now - lastFrameTime);
    lastFrameTime = now;

    let needsContinue = false;

    // ---- Presence transitions (filter)
    for (let i = 0; i < itemNodes.length; i++) {
      if (presenceTarget[i] !== presence[i]) {
        const elapsed = now - presenceStart[i];
        const k = Math.min(1, elapsed / CONFIG.filterMs);
        const e = EASE_OUT_EXPO(k);
        presence[i] = presenceFrom[i] + (presenceTarget[i] - presenceFrom[i]) * e;
        if (k >= 1) presence[i] = presenceTarget[i];
        if (presence[i] !== presenceTarget[i]) needsContinue = true;
      }
    }

    // ---- Carousel motion
    // While the user is actively scrubbing, freeze all snap/momentum so
    // the carousel sits exactly where the scrubber puts it (no fighting
    // jitter). Motion resumes on release.
    const n = countInSet();
    const maxOff = Math.max(0, n - 1);

    if (scrubbing) {
      // No motion logic; offset is driven by scrubFromClientX.
    } else if (snapTarget !== null) {
      if (snapDuration !== null) {
        // Ease-out expo over fixed duration.
        const elapsed = now - snapStartTime;
        const k = Math.min(1, elapsed / snapDuration);
        const e = EASE_OUT_EXPO(k);
        offset = snapStartOffset + (snapTarget - snapStartOffset) * e;
        if (k >= 1) {
          offset = snapTarget;
          snapTarget = null;
          snapDuration = null;
        } else {
          needsContinue = true;
        }
      } else {
        // Exponential approach.
        const diff = snapTarget - offset;
        if (Math.abs(diff) < 0.0005) {
          offset = snapTarget;
          snapTarget = null;
        } else {
          const factor = 1 - Math.exp(-dt / CONFIG.snapStrength);
          offset += diff * factor;
          needsContinue = true;
        }
      }
      velocity = 0;
    } else if (Math.abs(velocity) > 1e-6) {
      // Momentum glide. We do NOT auto-snap here based on idle time —
      // snapping is triggered explicitly when scroll input ends (wheel
      // debounce), on touch release, or by clicks/keys. This lets
      // trackpad inertia play out naturally without the carousel
      // snapping mid-gesture during brief pauses.
      const idleTime = now - lastInputTime;
      if (idleTime < 60) {
        velocity *= Math.pow(CONFIG.activeScrollDecay, dt / 16);
      } else {
        offset += velocity * dt;
        velocity *= Math.pow(CONFIG.momentumDecay, dt / 16);
      }

      if (offset < 0) {
        offset = 0;
        velocity = 0;
      } else if (offset > maxOff) {
        offset = maxOff;
        velocity = 0;
      }

      if (Math.abs(velocity) > 1e-6) needsContinue = true;
    }

    render();

    // Haptic tick each time the focused photo changes during live motion.
    // No-ops where the Vibration API is unsupported (iOS Safari, desktop).
    if (needsContinue || scrubbing) {
      const focusIdx = Math.round(offset);
      if (lastHapticIdx !== null && focusIdx !== lastHapticIdx) fireHaptic();
      lastHapticIdx = focusIdx;
    } else {
      lastHapticIdx = null;
    }

    // "Live" = offset is changing rapidly (scroll/snap motion or active
    // scrubbing). While live, disable tick height/opacity CSS transitions
    // so the scrubber tracks scroll directly; when idle, transitions give
    // smooth hover and settle.
    scrubberTrack.classList.toggle("scrubber__track--live", needsContinue || scrubbing);

    if (needsContinue) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  const canVibrate = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  function fireHaptic() {
    if (!CONFIG.haptics || !canVibrate) return;
    navigator.vibrate(CONFIG.hapticMs);
  }

  function animateOffsetTo(targetVisIdx, duration) {
    if (wheelEndTimer) { clearTimeout(wheelEndTimer); wheelEndTimer = null; }
    snapTarget = Math.max(0, Math.min(countInSet() - 1, targetVisIdx));
    snapStartOffset = offset;
    snapStartTime = performance.now();
    snapDuration = typeof duration === "number" ? duration : null;
    velocity = 0;
    startLoop();
  }

  /* ----------------------------------------------------------------
     Filter
  ---------------------------------------------------------------- */
  function applyFilter(filter) {
    const previousFocusedItemIdx = visibleIndexToItemIndex(Math.round(offset));
    activeFilter = filter;

    const now = performance.now();
    for (let i = 0; i < ITEMS.length; i++) {
      const matched = !filter || ITEMS[i].type === filter;
      const wasInSet = inSet[i];
      inSet[i] = matched;
      if (matched !== wasInSet) {
        presenceFrom[i] = presence[i];
        presenceTarget[i] = matched ? 1 : 0;
        presenceStart[i] = now;
      }
    }

    filterBtns.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    filtersEl.classList.toggle("has-active", !!filter);

    // Compute new offset: nearest matching item to previous focus.
    let newOffset = 0;
    if (countInSet() > 0) {
      if (previousFocusedItemIdx >= 0 && inSet[previousFocusedItemIdx]) {
        newOffset = itemIndexToVisibleIndex(previousFocusedItemIdx);
      } else {
        let bestVis = 0;
        let bestDist = Infinity;
        let visCount = 0;
        for (let i = 0; i < ITEMS.length; i++) {
          if (!inSet[i]) continue;
          const d = Math.abs(i - (previousFocusedItemIdx >= 0 ? previousFocusedItemIdx : 0));
          if (d < bestDist) {
            bestDist = d;
            bestVis = visCount;
          }
          visCount++;
        }
        newOffset = bestVis;
      }
    }

    // Smoothly animate offset to the new target over the same duration
    // as the filter transition (instead of an instant jump).
    velocity = 0;
    if (newOffset === offset) {
      snapTarget = null;
      snapDuration = null;
    } else {
      snapTarget = newOffset;
      snapStartOffset = offset;
      snapStartTime = now;
      snapDuration = CONFIG.filterOffsetMs;
    }
    startLoop();
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      if (activeFilter === f) {
        applyFilter(null);
      } else {
        applyFilter(f);
      }
    });
  });

  /* ----------------------------------------------------------------
     Input: wheel
  ---------------------------------------------------------------- */
  let lastWheelTime = 0;
  let wheelEndTimer = null;

  // Snap to the nearest item from the current position. Called when scroll
  // input truly ends (wheel debounce / touch release), not on idle pauses.
  function snapToNearest() {
    wheelEndTimer = null;
    if (scrubbing) return;
    const n = countInSet();
    if (n === 0) return;
    const maxOff = Math.max(0, n - 1);
    velocity = 0;
    snapTarget = Math.max(0, Math.min(maxOff, Math.round(offset)));
    snapStartOffset = offset;
    snapStartTime = performance.now();
    snapDuration = null; // exponential approach via snapStrength
    startLoop();
  }

  // True when an event originated inside the debug panel, which owns its own
  // scrolling and key handling. Guarded against non-Node targets (an event
  // dispatched straight at `window` has target === window, which would make
  // Node.contains throw).
  function isFromDebugPanel(e) {
    return e.target instanceof Node && debugEl.contains(e.target);
  }

  function onWheel(e) {
    if (activePanel) return;
    // The debug panel scrolls itself. Without this the global preventDefault
    // below swallowed every wheel event over it, so its taller tabs (Motion)
    // were clipped with no way to reach the controls below the fold.
    if (isFromDebugPanel(e)) return;
    e.preventDefault();
    const n = countInSet();
    if (n === 0) return;

    const dy = e.deltaY;
    const dx = e.deltaX;
    const raw = Math.abs(dy) >= Math.abs(dx) ? dy : dx;

    let pixels = raw;
    if (e.deltaMode === 1) pixels = raw * 16;
    else if (e.deltaMode === 2) pixels = raw * 800;

    const pxPerItem = focusedSize * CONFIG.pxPerItemFactor;
    let deltaItems = pixels / pxPerItem;
    deltaItems = Math.max(-CONFIG.deltaCap, Math.min(CONFIG.deltaCap, deltaItems));

    const now = performance.now();
    const dt = lastWheelTime > 0 ? Math.max(1, now - lastWheelTime) : 16;
    offset += deltaItems;
    const maxOff = Math.max(0, n - 1);
    if (offset < 0) offset = 0;
    if (offset > maxOff) offset = maxOff;

    velocity = deltaItems / dt;
    velocity = Math.max(-CONFIG.velocityCap, Math.min(CONFIG.velocityCap, velocity));

    snapTarget = null;
    snapDuration = null;
    lastWheelTime = now;
    lastInputTime = now;

    // Debounce: every wheel event (including trackpad inertia) resets the
    // timer, so we only snap once the entire gesture — momentum and all —
    // has come to rest. At the "Never" setting we don't schedule a snap at
    // all; the carousel simply rests wherever momentum leaves it.
    if (wheelEndTimer) { clearTimeout(wheelEndTimer); wheelEndTimer = null; }
    if (CONFIG.scrollEndMs < SCROLL_END_NEVER) {
      wheelEndTimer = setTimeout(snapToNearest, CONFIG.scrollEndMs);
    }

    startLoop();
  }

  /* ----------------------------------------------------------------
     Input: keyboard
  ---------------------------------------------------------------- */
  function onKey(e) {
    if (activePanel) {
      if (e.key === "Escape") navTo("work");
      return;
    }
    if (e.key === "Escape" && debugEl.classList.contains("is-open")) {
      closeDebug();
      return;
    }
    // Keys aimed at a debug control belong to that control — otherwise the
    // arrow keys below stole them and scrolled the carousel instead of
    // nudging the focused slider.
    if (isFromDebugPanel(e)) return;

    const n = countInSet();
    if (n === 0) return;
    const cur = Math.round(offset);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      animateOffsetTo(Math.min(n - 1, cur + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      animateOffsetTo(Math.max(0, cur - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      animateOffsetTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      animateOffsetTo(n - 1);
    }
  }

  /* ----------------------------------------------------------------
     Input: touch
  ---------------------------------------------------------------- */
  let touching = false;
  let touchLastX = 0;
  let touchLastY = 0;
  let touchLastTime = 0;

  function onTouchStart(e) {
    if (activePanel) return;
    if (e.touches.length !== 1) return;
    if (wheelEndTimer) { clearTimeout(wheelEndTimer); wheelEndTimer = null; }
    touching = true;
    touchLastX = e.touches[0].clientX;
    touchLastY = e.touches[0].clientY;
    touchLastTime = performance.now();
    velocity = 0;
    snapTarget = null;
    snapDuration = null;
    lastInputTime = touchLastTime;
  }

  function onTouchMove(e) {
    if (activePanel) return;
    if (!touching || e.touches.length !== 1) return;
    e.preventDefault();
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const now = performance.now();
    const dx = x - touchLastX;
    const dy = y - touchLastY;
    const combined = -dx + -dy * CONFIG.touchVerticalWeight;

    const pxPerItem = focusedSize * CONFIG.pxPerItemFactor;
    const deltaItems = combined / pxPerItem;
    offset += deltaItems;
    const maxOff = Math.max(0, countInSet() - 1);
    if (offset < 0) offset = 0;
    if (offset > maxOff) offset = maxOff;

    const dt = Math.max(1, now - touchLastTime);
    velocity = Math.max(-CONFIG.velocityCap, Math.min(CONFIG.velocityCap, deltaItems / dt));

    touchLastX = x;
    touchLastY = y;
    touchLastTime = now;
    lastInputTime = now;
    startLoop();
  }

  function onTouchEnd() {
    if (!touching) return;
    touching = false;
    lastInputTime = performance.now();
    startLoop();
  }

  /* ----------------------------------------------------------------
     Input: scrubber drag
  ---------------------------------------------------------------- */
  let scrubbing = false;

  function scrubFromClientX(clientX) {
    const rect = scrubberTrack.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    const itemIdxFloat = ratio * (ITEMS.length - 1);

    // Register the click to the NEAREST visible item and land exactly on it —
    // never interpolate to an in-between position (which would otherwise force
    // a secondary snap animation on release).
    let bestVis = -1;
    let bestDist = Infinity;
    let visCount = 0;
    for (let i = 0; i < ITEMS.length; i++) {
      if (!inSet[i]) continue;
      const d = Math.abs(i - itemIdxFloat);
      if (d < bestDist) {
        bestDist = d;
        bestVis = visCount;
      }
      visCount++;
    }
    if (bestVis < 0) return;

    offset = bestVis;
    velocity = 0;
    snapTarget = null;
    snapDuration = null;
    startLoop();
  }

  function onScrubberDown(e) {
    e.preventDefault();
    if (wheelEndTimer) { clearTimeout(wheelEndTimer); wheelEndTimer = null; }
    scrubbing = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    scrubFromClientX(x);
  }

  function onScrubberMove(e) {
    if (!scrubbing) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    scrubFromClientX(x);
  }

  function onScrubberUp() {
    if (!scrubbing) return;
    scrubbing = false;
    const n = countInSet();
    const nearest = Math.round(offset);
    snapTarget = Math.max(0, Math.min(n - 1, nearest));
    snapDuration = null;
    velocity = 0;
    startLoop();
  }

  /* ----------------------------------------------------------------
     Clock
  ---------------------------------------------------------------- */
  // While the intro masks are in place the clock's text lives inside a
  // .line__inner, so writing el.textContent would tear the mask out.
  function setChromeText(el, text) {
    const inner = el.querySelector(".line__inner");
    if (inner) inner.textContent = text;
    else el.textContent = text;
  }

  function updateClock() {
    const tz = "America/Los_Angeles";
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const dp = {};
    dateParts.forEach((p) => (dp[p.type] = p.value));
    setChromeText(metaDateEl, `${dp.month}.${dp.day}.${dp.year}`);

    const timeParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tp = {};
    timeParts.forEach((p) => (tp[p.type] = p.value));
    let tzLabel = tp.timeZoneName || "GMT";
    tzLabel = tzLabel.replace(/^GMT([+-])0?(\d+)(?::?00)?$/, "GMT$1$2");
    let hh = tp.hour;
    if (hh === "24") hh = "00";
    setChromeText(metaTimeEl, `${hh}:${tp.minute} ${tzLabel}`);
  }

  /* ----------------------------------------------------------------
     Debug panel
  ---------------------------------------------------------------- */
  // Ranges must contain each key's default with room on BOTH sides — several
  // of these used to sit pinned at their own maximum (or, for itemMinOpacity,
  // outside the range entirely), so dragging them up did nothing and the
  // slider position disagreed with the value it printed.
  const DEBUG_FIELDS = [
    { key: "pxPerItemFactor",   label: "Scroll px / item ÷ focused", min: 0.1, max: 2.0, step: 0.01 },
    { key: "deltaCap",          label: "Max items / wheel event",    min: 0.1, max: 8.0, step: 0.05 },
    { key: "velocityCap",       label: "Velocity cap (items/ms)",    min: 0.005, max: 0.3, step: 0.001 },
    { key: "activeScrollDecay", label: "Active scroll decay /16ms",  min: 0.1, max: 1.0, step: 0.01 },
    { key: "momentumDecay",     label: "Momentum decay /16ms",       min: 0.5, max: 0.99, step: 0.01 },
    { key: "scrollEndMs",       label: "Scroll-end snap delay (ms)", min: 40, max: SCROLL_END_NEVER, step: 20, neverAt: SCROLL_END_NEVER },
    { key: "snapStrength",      label: "Snap time constant (ms)",    min: 30, max: 400, step: 10 },
    { key: "filterMs",          label: "Filter transition (ms)",     min: 100, max: 1200, step: 25 },
    { key: "filterOffsetMs",    label: "Filter offset slide (ms)",   min: 100, max: 1500, step: 25 },
    { key: "touchVerticalWeight", label: "Touch vertical weight",    min: 0,   max: 1.0, step: 0.05 },
    { key: "itemMinOpacity",      label: "Item min opacity (far)",   min: 0,   max: 1.0, step: 0.01 },
    { key: "itemOpacityFalloff",  label: "Item opacity falloff",     min: 0.5, max: 8.0, step: 0.1 },
  ];

  const THEME_COLOR_FIELDS = [
    { key: "colorBg", label: "Background", type: "color" },
    { key: "colorAccent", label: "Foreground", type: "color" },
    { key: "colorWritingContinue", label: "Action", type: "color" },
  ];

  const THEME_OPACITY_FIELDS = [
    { key: "surfaceOpacity", label: "Surface opacity", min: 0, max: 0.35, step: 0.01 },
    { key: "scrubberDimOpacity", label: "Scrubber dim opacity", min: 0, max: 1, step: 0.01 },
  ];

  const THEME_FONT_FIELDS = [
    { key: "fontBody",           label: "Body size (px)",      min: 8,   max: 24,   step: 1     },
    { key: "lineHeightBody",     label: "Body line height",    min: 1.0, max: 2.5,  step: 0.05  },
    { key: "letterSpacingBody",  label: "Body tracking (em)",  min: 0,   max: 0.15, step: 0.005 },
    { key: "fontTitle",          label: "Title size (px)",     min: 12,  max: 72,   step: 1     },
    { key: "lineHeightTitle",    label: "Title line height",   min: 0.8, max: 2.0,  step: 0.05  },
    { key: "letterSpacingTitle", label: "Title tracking (em)", min: -0.1, max: 0.15, step: 0.005 },
  ];

  const THEME_LETTER_SPACING_FIELDS = [];

  const THEME_LETTERFORM_FIELDS = [
    {
      key: "fontWeight",
      label: "Letterform weight",
      options: [
        { value: "200", label: "Extra Light" },
        { value: "400", label: "Regular" },
        { value: "700", label: "Bold" },
      ],
    },
    {
      key: "textTransform",
      label: "Letter case",
      options: [
        { value: "uppercase", label: "Uppercase" },
        { value: "none", label: "As typed" },
        { value: "lowercase", label: "Lowercase" },
        { value: "capitalize", label: "Capitalize" },
      ],
    },
  ];

  function hexToRgba(hex, alpha) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Gallery sizes have responsive @media overrides in the stylesheet. Writing
  // them inline unconditionally would defeat those on every load, so a value
  // sitting at its default clears the inline property instead and lets CSS win.
  function setTunedPxVar(root, name, value, defaultValue) {
    if (value === defaultValue) root.style.removeProperty(name);
    else root.style.setProperty(name, `${value}px`);
  }

  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty("--color-bg", THEME.colorBg);
    root.style.setProperty("--color-accent", THEME.colorAccent);
    root.style.setProperty("--color-surface", `rgba(255, 255, 255, ${THEME.surfaceOpacity})`);
    root.style.setProperty(
      "--color-scrubber-dim",
      hexToRgba(THEME.colorAccent, THEME.scrubberDimOpacity)
    );
    root.style.setProperty("--color-writing-continue", THEME.colorWritingContinue);
    root.style.setProperty("--font-body", `${THEME.fontBody}px`);
    root.style.setProperty("--font-title", `${THEME.fontTitle}px`);
    root.style.setProperty("--line-height-body", String(THEME.lineHeightBody));
    root.style.setProperty("--line-height-title", String(THEME.lineHeightTitle));
    root.style.setProperty("--letter-spacing-body", `${THEME.letterSpacingBody}em`);
    root.style.setProperty("--letter-spacing-title", `${THEME.letterSpacingTitle}em`);
    root.style.setProperty("--about-lede-scale", String(THEME.aboutLedeScale));
    root.style.setProperty("--about-column-width", `${THEME.aboutColumnWidth}px`);
    root.style.setProperty("--about-line-duration", `${THEME.aboutLineDurationMs}ms`);
    root.style.setProperty(
      "--about-line-ease",
      LINE_EASINGS[THEME.aboutRevealEasing] || LINE_EASINGS.easeOutCirc
    );
    root.style.setProperty("--font-weight", String(THEME.fontWeight));
    root.style.setProperty("--text-transform", THEME.textTransform);

    setTunedPxVar(root, "--focused-size", THEME.galleryFocusedSize, THEME_DEFAULTS.galleryFocusedSize);
    setTunedPxVar(root, "--thumb-size", THEME.galleryThumbSize, THEME_DEFAULTS.galleryThumbSize);
    setTunedPxVar(root, "--item-gap", THEME.galleryItemGap, THEME_DEFAULTS.galleryItemGap);
    setTunedPxVar(root, "--item-padding", THEME.galleryItemPadding, THEME_DEFAULTS.galleryItemPadding);
    setTunedPxVar(root, "--chrome-pad", THEME.galleryChromePad, THEME_DEFAULTS.galleryChromePad);

    // No responsive overrides on these, so they can be written outright.
    root.style.setProperty("--tick-width", `${THEME.tickWidth}px`);
    root.style.setProperty("--tick-gap", `${THEME.tickGap}px`);
    root.style.setProperty("--tick-max-height", `${THEME.tickMaxHeight}px`);
    root.style.setProperty("--intro-stage-fade", `${THEME.introStageFadeMs}ms`);
    root.style.setProperty("--intro-stage-scale", `${THEME.introStageScaleMs}ms`);
    root.classList.toggle("about-video-enabled", !!THEME.aboutVideoEnabled);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", THEME.colorBg);

    // Scrubber ticks use accent color inline — refresh classes.
    updateScrubberClasses();
  }

  function formatNum(v, step) {
    const decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
    return v.toFixed(decimals);
  }

  function fieldDisplay(field, v) {
    if (field.neverAt != null && v >= field.neverAt) return "Never";
    if (field.unit === "em") return `${formatNum(v, field.step)}em`;
    return formatNum(v, field.step);
  }

  function addDebugSelectRow(container, field, onChange) {
    const row = document.createElement("div");
    row.className = "debug__row";

    const labelEl = document.createElement("label");
    labelEl.htmlFor = `dbg-${field.key}`;
    labelEl.textContent = field.label;
    row.appendChild(labelEl);

    const valueEl = document.createElement("span");
    valueEl.className = "debug__value";
    row.appendChild(valueEl);

    const select = document.createElement("select");
    select.id = `dbg-${field.key}`;
    select.className = "debug__select";
    field.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      select.appendChild(option);
    });

    const current = String(field.getValue());
    select.value = current;
    const active = field.options.find((opt) => opt.value === current);
    valueEl.textContent = active ? active.label : current;

    select.addEventListener("change", () => {
      const parsed =
        field.key === "fontWeight" ? parseInt(select.value, 10) : select.value;
      field.setValue(parsed);
      const chosen = field.options.find((opt) => opt.value === select.value);
      valueEl.textContent = chosen ? chosen.label : select.value;
      onChange();
    });

    row.appendChild(select);
    container.appendChild(row);
  }

  function addDebugRow(container, field, onChange) {
    const row = document.createElement("div");
    row.className = "debug__row";

    const labelEl = document.createElement("label");
    labelEl.htmlFor = `dbg-${field.key}`;
    labelEl.textContent = field.label;
    row.appendChild(labelEl);

    const valueEl = document.createElement("span");
    valueEl.className = "debug__value";
    row.appendChild(valueEl);

    let input;
    if (field.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.id = `dbg-${field.key}`;
      input.checked = !!field.getValue();
      valueEl.textContent = input.checked ? "On" : "Off";
      input.addEventListener("change", () => {
        field.setValue(input.checked);
        valueEl.textContent = input.checked ? "On" : "Off";
        onChange();
      });
    } else if (field.type === "color") {
      input = document.createElement("input");
      input.type = "color";
      input.id = `dbg-${field.key}`;
      input.value = field.getValue();
      valueEl.textContent = input.value.toUpperCase();
      input.addEventListener("input", () => {
        field.setValue(input.value);
        valueEl.textContent = input.value.toUpperCase();
        onChange();
      });
    } else {
      input = document.createElement("input");
      input.type = "range";
      input.id = `dbg-${field.key}`;
      input.min = String(field.min);
      input.max = String(field.max);
      input.step = String(field.step);
      input.value = String(field.getValue());
      valueEl.textContent = fieldDisplay(field, field.getValue());
      input.addEventListener("input", () => {
        const v = parseFloat(input.value);
        field.setValue(v);
        valueEl.textContent = fieldDisplay(field, v);
        onChange();
      });
    }

    row.appendChild(input);
    container.appendChild(row);
    return { input, valueEl };
  }

  function addSectionTitle(container, text) {
    const title = document.createElement("div");
    title.className = "debug__section-title";
    title.textContent = text;
    container.appendChild(title);
  }

  function buildMotionDebug() {
    debugMotionControls.innerHTML = "";
    DEBUG_FIELDS.forEach((field) => {
      addDebugRow(debugMotionControls, {
        ...field,
        getValue: () => CONFIG[field.key],
        setValue: (v) => { CONFIG[field.key] = v; },
      }, () => render());
    });
  }

  function buildThemeDebug() {
    debugThemeControls.innerHTML = "";

    addSectionTitle(debugThemeControls, "Colors");
    THEME_COLOR_FIELDS.forEach((field) => {
      addDebugRow(debugThemeControls, {
        ...field,
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, applyTheme);
    });

    addSectionTitle(debugThemeControls, "Surfaces");
    THEME_OPACITY_FIELDS.forEach((field) => {
      addDebugRow(debugThemeControls, {
        ...field,
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, applyTheme);
    });

    addSectionTitle(debugThemeControls, "Typography");
    THEME_FONT_FIELDS.forEach((field) => {
      addDebugRow(debugThemeControls, {
        ...field,
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, applyTheme);
    });
    THEME_LETTER_SPACING_FIELDS.forEach((field) => {
      addDebugRow(debugThemeControls, {
        ...field,
        unit: "em",
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, applyTheme);
    });

    addSectionTitle(debugThemeControls, "Letterforms");
    THEME_LETTERFORM_FIELDS.forEach((field) => {
      addDebugSelectRow(debugThemeControls, {
        ...field,
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, applyTheme);
    });
  }

  const GALLERY_ITEM_FIELDS = [
    { key: "galleryFocusedSize",  label: "Focused size (px)", min: 240, max: 900, step: 8 },
    { key: "galleryThumbSize",    label: "Thumb size (px)",   min: 48,  max: 400, step: 4 },
    { key: "galleryItemGap",      label: "Item gap (px)",     min: 0,   max: 120, step: 2 },
    { key: "galleryItemPadding",  label: "Item padding (px)", min: 0,   max: 80,  step: 2 },
  ];

  const GALLERY_PAGE_FIELDS = [
    { key: "galleryChromePad", label: "Page margin (px)", min: 8, max: 80, step: 2 },
  ];

  const GALLERY_SCRUBBER_FIELDS = [
    { key: "tickWidth",      label: "Tick width (px)",  min: 1,  max: 8,  step: 1 },
    { key: "tickGap",        label: "Tick gap (px)",    min: 2,  max: 24, step: 1 },
    { key: "tickMinHeight",  label: "Tick min height",  min: 2,  max: 48, step: 1 },
    { key: "tickMaxHeight",  label: "Tick max height",  min: 8,  max: 72, step: 1 },
    { key: "tickMinOpacity", label: "Tick dim opacity", min: 0,  max: 1,  step: 0.01 },
  ];

  const GALLERY_INTRO_FIELDS = [
    { key: "introStartMs", label: "Text start (ms)", min: 0, max: 600, step: 10 },
    { key: "introStagger", label: "Text stagger (ms)", min: 0, max: 200, step: 5 },
    { key: "introStageFadeMs", label: "Gallery fade (ms)", min: 200, max: 2000, step: 10 },
    { key: "introStageScaleMs", label: "Gallery scale (ms)", min: 200, max: 2500, step: 10 },
  ];

  const GALLERY_FIELDS = [
    ...GALLERY_ITEM_FIELDS,
    ...GALLERY_PAGE_FIELDS,
    ...GALLERY_SCRUBBER_FIELDS,
    ...GALLERY_INTRO_FIELDS,
  ];

  // Geometry changes have to be re-measured out of CSS (readSizes) before the
  // carousel can lay out against them.
  function applyGalleryChange() {
    applyTheme();
    readSizes();
    render();
  }

  function buildGalleryDebug() {
    debugGalleryControls.innerHTML = "";

    const groups = [
      ["Items", GALLERY_ITEM_FIELDS],
      ["Page", GALLERY_PAGE_FIELDS],
      ["Scrubber", GALLERY_SCRUBBER_FIELDS],
      ["Intro", GALLERY_INTRO_FIELDS],
    ];

    groups.forEach(([title, fields]) => {
      addSectionTitle(debugGalleryControls, title);
      fields.forEach((field) => {
        addDebugRow(debugGalleryControls, {
          ...field,
          getValue: () => THEME[field.key],
          setValue: (v) => {
            // Every gallery value except the opacity floor is a whole pixel.
            THEME[field.key] = field.step >= 1 ? Math.round(v) : v;
          },
        }, applyGalleryChange);
      });
    });
  }

  const ABOUT_FIELDS = [
    {
      key: "aboutLedeScale",
      label: "Lede scale",
      min: 0.8, max: 3.0, step: 0.05,
    },
    {
      key: "aboutColumnWidth",
      label: "Column width (px)",
      // step 4, not 8: the 396px default has to land on the grid or the slider
      // snaps to 400 and silently disagrees with the value it prints.
      min: 240, max: 720, step: 4,
    },
    {
      key: "aboutRevealStagger",
      label: "Line stagger (ms)",
      min: 0, max: 200, step: 5,
    },
    {
      key: "aboutHeaderStaggerMult",
      label: "Header stagger ×",
      min: 1, max: 6, step: 0.25,
    },
    {
      key: "aboutLineDurationMs",
      label: "Line duration (ms)",
      min: 150, max: 1000, step: 10,
    },
  ];

  function buildAboutDebug() {
    debugAboutControls.innerHTML = "";

    addSectionTitle(debugAboutControls, "Typography");
    ABOUT_FIELDS.slice(0, 2).forEach((field) => {
      addDebugRow(debugAboutControls, {
        ...field,
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, () => {
        applyTheme();
        relayoutPanels();
      });
    });

    addSectionTitle(debugAboutControls, "Reveal");
    ABOUT_FIELDS.slice(2).forEach((field) => {
      addDebugRow(debugAboutControls, {
        ...field,
        getValue: () => THEME[field.key],
        setValue: (v) => { THEME[field.key] = v; },
      }, () => {
        applyTheme();
        relayoutPanels();
      });
    });

    addDebugSelectRow(debugAboutControls, {
      key: "aboutRevealEasing",
      label: "Reveal easing",
      options: [
        { value: "linear",       label: "Linear" },
        { value: "easeOutQuad",  label: "Ease Out (Quad)" },
        { value: "easeOutCubic", label: "Ease Out (Cubic)" },
        { value: "easeOutQuart", label: "Ease Out (Quart)" },
        { value: "easeOutCirc",  label: "Ease Out (Circ)" },
        { value: "easeInCubic",  label: "Ease In (Cubic)" },
        { value: "easeInOut",    label: "Ease In–Out" },
      ],
      getValue: () => THEME.aboutRevealEasing,
      setValue: (v) => { THEME.aboutRevealEasing = v; },
    }, applyTheme);

    addSectionTitle(debugAboutControls, "Video");
    addDebugRow(debugAboutControls, {
      key: "aboutVideoEnabled",
      label: "Show About video",
      type: "checkbox",
      getValue: () => THEME.aboutVideoEnabled,
      setValue: (v) => { THEME.aboutVideoEnabled = v; },
    }, applyTheme);

    addSectionTitle(debugAboutControls, "Preview");
    const previewRow = document.createElement("div");
    previewRow.className = "debug__mode-row";
    [
      { dir: "in", label: "Play In" },
      { dir: "out", label: "Play Out" },
    ].forEach(({ dir, label }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "debug__mode-btn";
      btn.textContent = label;
      btn.addEventListener("click", () => playAboutPreview(dir));
      previewRow.appendChild(btn);
    });
    debugAboutControls.appendChild(previewRow);
  }

  function buildDebug() {
    buildMotionDebug();
    buildThemeDebug();
    buildGalleryDebug();
    buildAboutDebug();
  }

  function setDebugTab(tab) {
    activeDebugTab = tab;
    debugTabs.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.debugTab === tab);
    });
    debugMotionSection.classList.toggle("is-active", tab === "motion");
    debugThemeSection.classList.toggle("is-active", tab === "theme");
    debugGallerySection.classList.toggle("is-active", tab === "gallery");
    debugAboutSection.classList.toggle("is-active", tab === "about");
    debugReadout.style.display = tab === "motion" ? "" : "none";
  }

  function updateDebugReadout() {
    if (!debugReadout) return;
    const rows = [
      ["offset", offset.toFixed(3)],
      ["velocity", velocity.toFixed(5)],
      ["snap →", snapTarget == null ? "—" : String(snapTarget)],
      ["filter", activeFilter || "—"],
      ["visible", String(countInSet())],
      ["focused px", `${Math.round(focusedSize)}`],
    ];
    debugReadout.innerHTML = rows
      .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
      .join("");
  }

  function openDebug() {
    debugEl.classList.add("is-open");
    syncDebugInputs();
    updateDebugReadout();
  }
  function closeDebug() {
    debugEl.classList.remove("is-open");
  }
  function toggleDebug() {
    if (debugEl.classList.contains("is-open")) closeDebug();
    else openDebug();
  }

  function syncDebugInputs() {
    DEBUG_FIELDS.forEach((field) => {
      const input = document.getElementById(`dbg-${field.key}`);
      if (!input) return;
      input.value = String(CONFIG[field.key]);
      const valueEl = input.parentElement.querySelector(".debug__value");
      if (valueEl) valueEl.textContent = fieldDisplay(field, CONFIG[field.key]);
    });

    THEME_COLOR_FIELDS.forEach((field) => {
      const input = document.getElementById(`dbg-${field.key}`);
      if (!input) return;
      input.value = THEME[field.key];
      const valueEl = input.parentElement.querySelector(".debug__value");
      if (valueEl) valueEl.textContent = THEME[field.key].toUpperCase();
    });

    THEME_OPACITY_FIELDS
      .concat(THEME_FONT_FIELDS)
      .concat(THEME_LETTER_SPACING_FIELDS)
      .forEach((field) => {
        const input = document.getElementById(`dbg-${field.key}`);
        if (!input) return;
        input.value = String(THEME[field.key]);
        const valueEl = input.parentElement.querySelector(".debug__value");
        if (valueEl) valueEl.textContent = fieldDisplay({ ...field }, THEME[field.key]);
      });

    THEME_LETTERFORM_FIELDS.forEach((field) => {
      const select = document.getElementById(`dbg-${field.key}`);
      if (!select) return;
      select.value = String(THEME[field.key]);
      const valueEl = select.parentElement.querySelector(".debug__value");
      const active = field.options.find((opt) => opt.value === String(THEME[field.key]));
      if (valueEl) valueEl.textContent = active ? active.label : String(THEME[field.key]);
    });

    GALLERY_FIELDS.forEach((field) => {
      const input = document.getElementById(`dbg-${field.key}`);
      if (!input) return;
      input.value = String(THEME[field.key]);
      const valueEl = input.parentElement.querySelector(".debug__value");
      if (valueEl) valueEl.textContent = fieldDisplay(field, THEME[field.key]);
    });

    ABOUT_FIELDS.forEach((field) => {
      const input = document.getElementById(`dbg-${field.key}`);
      if (!input) return;
      input.value = String(THEME[field.key]);
      const valueEl = input.parentElement.querySelector(".debug__value");
      if (valueEl) valueEl.textContent = fieldDisplay(field, THEME[field.key]);
    });

    const easingSelect = document.getElementById("dbg-aboutRevealEasing");
    if (easingSelect) {
      easingSelect.value = THEME.aboutRevealEasing;
      const valueEl = easingSelect.parentElement.querySelector(".debug__value");
      const found = Array.from(easingSelect.options).find((o) => o.value === THEME.aboutRevealEasing);
      if (valueEl && found) valueEl.textContent = found.text;
    }

    const videoToggle = document.getElementById("dbg-aboutVideoEnabled");
    if (videoToggle) {
      videoToggle.checked = !!THEME.aboutVideoEnabled;
      const valueEl = videoToggle.parentElement.querySelector(".debug__value");
      if (valueEl) valueEl.textContent = videoToggle.checked ? "On" : "Off";
    }
  }

  function resetDebug() {
    Object.assign(CONFIG, DEFAULTS);
    Object.assign(THEME, THEME_DEFAULTS);
    syncDebugInputs();
    applyTheme();
    readSizes();
    relayoutPanels();
    render();
  }

  async function copyDebug() {
    const json = JSON.stringify({ motion: CONFIG, theme: THEME }, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      debugCopyBtn.textContent = "Copied!";
      setTimeout(() => (debugCopyBtn.textContent = "Copy"), 1200);
    } catch (err) {
      console.log("Copy failed; values:\n", json);
    }
  }

  /* ----------------------------------------------------------------
     About view

     A crossfading overlay. Text reveals line-by-line: each paragraph is
     split into visual lines, and each line is wrapped in an overflow mask
     with an inner element that slides up from behind it on open. Splitting
     is done while the element is laid out (opacity 0, still measurable) and
     re-run on resize so line breaks stay correct.
  ---------------------------------------------------------------- */
  // How far into the last line's exit Work starts coming in (fraction of the
  // line duration). Lower = more overlap / faster-feeling handoff.
  const PANEL_EXIT_OVERLAP = 0.15;

  function splitLines(el) {
    const text = el.dataset.text != null ? el.dataset.text : el.textContent;
    el.dataset.text = text;

    // 1) Lay out as individual words so we can read their line positions.
    el.textContent = "";
    const words = text.split(/\s+/).filter(Boolean);
    const wordSpans = words.map((w) => {
      const s = document.createElement("span");
      s.style.display = "inline-block";
      s.textContent = w;
      return s;
    });
    wordSpans.forEach((s, i) => {
      el.appendChild(s);
      if (i < wordSpans.length - 1) el.appendChild(document.createTextNode(" "));
    });

    // 2) Group words into lines by their vertical offset.
    const lines = [];
    let current = null;
    let lastTop = null;
    wordSpans.forEach((s) => {
      const top = s.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 1) {
        current = [];
        lines.push(current);
        lastTop = top;
      }
      current.push(s.textContent);
    });

    // 3) Rebuild as masked lines.
    el.textContent = "";
    const inners = [];
    lines.forEach((wordsInLine, li) => {
      const line = document.createElement("span");
      line.className = "line";
      const inner = document.createElement("span");
      inner.className = "line__inner";
      if (li === lines.length - 1) inner.classList.add("line__inner--last");
      inner.textContent = wordsInLine.join(" ");
      line.appendChild(inner);
      el.appendChild(line);
      inners.push(inner);
    });
    return inners;
  }

  // CSS timing functions applied to each individual line's slide motion. The
  // stagger between lines is always uniform (constant cadence); this only
  // shapes how a single line eases as it moves into place.
  const LINE_EASINGS = {
    linear:       "linear",
    easeOutQuad:  "cubic-bezier(0.5, 1, 0.89, 1)",
    easeOutCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
    easeOutQuart: "cubic-bezier(0.25, 1, 0.5, 1)",
    easeOutCirc:  "cubic-bezier(0, 0.55, 0.45, 1)",
    easeInCubic:  "cubic-bezier(0.32, 0, 0.67, 0)",
    easeInOut:    "cubic-bezier(0.65, 0, 0.35, 1)",
  };

  function wrapRevealMask(el) {
    const text = el.dataset.revealText != null ? el.dataset.revealText : el.textContent;
    el.dataset.revealText = text;
    el.textContent = "";
    const line = document.createElement("span");
    line.className = "line";
    const inner = document.createElement("span");
    inner.className = "line__inner line__inner--last";
    inner.textContent = text;
    line.appendChild(inner);
    el.appendChild(line);
    return inner;
  }

  // Wrap an element's existing children in a single mask/inner so the whole
  // element (e.g. a form field) reveals as one masked block. Idempotent.
  function wrapRevealBlock(el) {
    if (el.dataset.blockWrapped === "1") {
      return el.querySelector(":scope > .line__inner");
    }
    const inner = document.createElement("span");
    inner.className = "line__inner line__inner--last";
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    el.classList.add("line");
    el.dataset.blockWrapped = "1";
    return inner;
  }

  // Split every [data-reveal] text element in `root` into masked lines, and
  // reveal [data-reveal-block] elements as single masked blocks. Delays run at
  // a constant cadence (bigger step for the .panel__lede header). Returns the
  // largest delay assigned, used to time the exit handoff.
  function setupPanelReveal(root) {
    const targets = root.querySelectorAll("[data-reveal], [data-reveal-block]");
    const stagger = THEME.aboutRevealStagger;
    const headerStep = stagger * (THEME.aboutHeaderStaggerMult || 1);
    let delay = 0;
    let maxDelay = 0;

    targets.forEach((el) => {
      const step = el.classList.contains("panel__lede") ? headerStep : stagger;
      const blockStartDelay = delay;

      if (el.hasAttribute("data-reveal-block")) {
        const inner = wrapRevealBlock(el);
        if (inner) inner.style.setProperty("--reveal-delay", `${Math.round(delay)}ms`);
        maxDelay = Math.max(maxDelay, delay);
        delay += step;
        return;
      }

      splitLines(el).forEach((inner) => {
        inner.style.setProperty("--reveal-delay", `${Math.round(delay)}ms`);
        maxDelay = Math.max(maxDelay, delay);
        delay += step;
      });

      // A form field's baseline draws in sync with its label's mask-slide,
      // even though the line itself isn't part of the text-splitting above.
      if (el.classList.contains("field__label")) {
        const fieldLine = el.parentElement?.querySelector(".field__line");
        if (fieldLine) fieldLine.style.setProperty("--reveal-delay", `${Math.round(blockStartDelay)}ms`);
      }

      // Principle numbers piggyback on the delay of their title's first line.
      if (el.classList.contains("about__point-title")) {
        const num = el.closest(".about__point-header")?.querySelector(".about__point-num");
        if (num) {
          let numInner = num.querySelector(".line__inner");
          if (!numInner) numInner = wrapRevealMask(num);
          numInner.style.setProperty("--reveal-delay", `${Math.round(blockStartDelay)}ms`);
        }
      }
    });

    return maxDelay;
  }

  /* ----------------------------------------------------------------
     First-load intro

     The page chrome reveals through the same per-line masks the About
     panel uses, while the gallery animates in through the same transition
     it uses when returning from a panel. Masks are removed once the last
     line lands, so the chrome's resting DOM is exactly what it was before.
  ---------------------------------------------------------------- */
  const INTRO_SELECTORS = [
    ".site-name",
    ".meta__date",
    ".meta__time",
    ".nav__item",
    ".location",
  ];

  function unwrapRevealMask(el) {
    const inner = el.querySelector(":scope > .line > .line__inner");
    if (!inner) return;
    // Read the CURRENT text, not the value captured at wrap time — the clock
    // keeps writing into the inner while the intro plays.
    el.textContent = inner.textContent;
    delete el.dataset.revealText;
  }

  let introPlayed = false;

  // Always reachable end state: masks gone, both intro classes cleared. The
  // page must never be able to get stuck in the retracted start state.
  function finishIntro(els) {
    els.forEach(unwrapRevealMask);
    pageEl.classList.remove("page--intro", "page--intro-in");
  }

  function onIntroVisible() {
    if (document.visibilityState !== "visible") return;
    document.removeEventListener("visibilitychange", onIntroVisible);
    playIntro();
  }

  function playIntro() {
    if (introPlayed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introPlayed = true;
      finishIntro([]);
      return;
    }

    // requestAnimationFrame does not run in a background tab, so the reveal
    // below would never be triggered and the page would sit retracted and
    // invisible. Wait until it is actually on screen — there is nothing to
    // watch before then anyway.
    if (document.visibilityState === "hidden") {
      document.addEventListener("visibilitychange", onIntroVisible);
      // ...but never wait forever. If the tab is never brought forward, settle
      // to the resting state anyway rather than risk a permanently blank page.
      setTimeout(() => {
        if (introPlayed) return;
        introPlayed = true;
        document.removeEventListener("visibilitychange", onIntroVisible);
        finishIntro([]);
      }, 10000);
      return;
    }

    introPlayed = true;

    const els = INTRO_SELECTORS.flatMap((sel) =>
      Array.from(document.querySelectorAll(sel))
    );

    let delay = THEME.introStartMs;
    let maxDelay = delay;
    els.forEach((el) => {
      const inner = wrapRevealMask(el);
      inner.style.setProperty("--reveal-delay", `${Math.round(delay)}ms`);
      maxDelay = delay;
      delay += THEME.introStagger;
    });

    // Commit the masked start state before opting in, so the browser has two
    // distinct states to transition between.
    void pageEl.offsetWidth;

    // Whichever finishes last decides when it is safe to drop .page--intro-in.
    // Pulling it while the gallery is still moving would swap the transition
    // out from under a running animation and snap it into place. The 200ms
    // matches the intro chrome's transition-delay in the stylesheet.
    const textEndMs = maxDelay + THEME.aboutLineDurationMs;
    const galleryEndMs =
      200 + Math.max(THEME.introStageFadeMs, THEME.introStageScaleMs);
    const settleMs = Math.max(textEndMs, galleryEndMs) + 80;

    // Backstop first: reaching the resting state must NOT depend on a frame
    // callback. A window that reports "visible" while fully occluded can starve
    // rAF indefinitely, and without this the page would stay retracted and
    // invisible. finishIntro is idempotent, so a double call is harmless.
    let settleTimer = setTimeout(() => finishIntro(els), settleMs + 1200);
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      pageEl.classList.remove("page--intro");
      pageEl.classList.add("page--intro-in");
      // The reveal really started, so replace the backstop with tight timing.
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => finishIntro(els), settleMs);
    };

    // TWO frames, not one. init() runs before the first paint, so a single rAF
    // flips the class while the retracted state has still never been rendered —
    // the browser then has no distinct "before" value and skips the transition
    // entirely, which is why the gallery used to appear already in place.
    // Waiting for a painted frame gives the transition something to start from.
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    // ...and a timer in case rAF is being starved, so the reveal still happens.
    setTimeout(reveal, 150);
  }

  /* ----------------------------------------------------------------
     Panel registry + navigation

     Each reveal panel (About, Contact) is a full-page overlay that
     crossfades with the carousel over a shared opaque backdrop. Only one
     is open at a time; `activePanel` tracks it (null = Work).
  ---------------------------------------------------------------- */
  const panels = {};
  let panelCloseTimer = null;

  function makePanel(el, name) {
    if (!el) return null;
    const p = { el, name, maxDelay: 0 };
    panels[name] = p;
    return p;
  }

  const contactEl = document.getElementById("contact");
  const readingEl = document.getElementById("reading");
  const aboutPanel = makePanel(aboutEl, "about");
  const contactPanel = makePanel(contactEl, "contact");
  const readingPanel = makePanel(readingEl, "reading");

  /* ----------------------------------------------------------------
     Reading view — full writing pieces, opened by "Continue →".
     Reuses the same panel + line-reveal + hash-routing machinery as
     About/Contact; the only extra is a per-piece slug in the URL.
  ---------------------------------------------------------------- */
  // slug -> writing item, built from ITEMS so content lives in one place.
  const WRITING = {};
  ITEMS.forEach((it) => {
    if (it.type === "writing" && it.slug) WRITING[it.slug] = it;
  });

  const readingMetaEl = document.getElementById("readingMeta");
  const readingTitleEl = document.getElementById("readingTitle");
  const readingBodyEl = document.getElementById("readingBody");

  // Populate the reading panel's DOM for a slug. Must run BEFORE the panel
  // opens, so setupPanelReveal (called on open) splits the fresh paragraphs.
  function setReadingContent(slug) {
    const item = WRITING[slug];
    if (!item || !readingEl) return false;
    // splitLines() caches text in dataset.text on first run; these reused
    // elements start empty, so clear the cache before repopulating or the
    // reveal will replay the stale (empty) text.
    readingMetaEl.textContent = item.meta || "";
    delete readingMetaEl.dataset.text;
    readingTitleEl.textContent = item.title || "";
    delete readingTitleEl.dataset.text;
    readingBodyEl.innerHTML = "";
    (item.full || [item.body || ""]).forEach((para) => {
      const p = document.createElement("p");
      p.className = "reading__para";
      p.setAttribute("data-reveal", "");
      p.textContent = para;
      readingBodyEl.appendChild(p);
    });
    readingEl.dataset.slug = slug;
    return true;
  }

  // Open a piece: set content, write the URL, play the reveal.
  function openReading(slug) {
    if (!setReadingContent(slug)) return;
    writeReadingRoute(slug);
    navTo("reading", { updateUrl: false });
  }

  // Re-split every panel (line breaks depend on width/fonts) and restore its
  // current reveal state without animating.
  function relayoutPanels() {
    Object.values(panels).forEach((p) => {
      p.maxDelay = setupPanelReveal(p.el);
      p.el.classList.add("panel--no-anim");
      p.el.classList.toggle("is-in", activePanel === p);
      void p.el.offsetWidth;
      p.el.classList.remove("panel--no-anim");
    });
  }

  // Reveal a panel's lines from scratch (backdrop assumed already up).
  function revealPanelLines(p) {
    p.el.scrollTop = 0;
    p.el.classList.add("panel--no-anim");
    p.el.classList.remove("is-in");
    p.el.classList.add("is-active");
    requestAnimationFrame(() => {
      p.maxDelay = setupPanelReveal(p.el);
      void p.el.offsetWidth;
      p.el.classList.remove("panel--no-anim");
      requestAnimationFrame(() => p.el.classList.add("is-in"));
    });
  }

  // Clear every panel's active/leaving state and page--panel-* class except
  // `except` (if given). Used to recover cleanly if a transition is
  // interrupted mid-flight by another one.
  function resetPanelState(except) {
    Object.values(panels).forEach((p) => {
      if (p === except) return;
      p.el.classList.remove("is-active", "is-leaving", "is-in");
      p.el.setAttribute("aria-hidden", "true");
    });
    Object.keys(panels).forEach((n) => pageEl.classList.remove(`page--panel-${n}`));
  }

  // Open a panel from Work: fade in the backdrop + retire the carousel chrome,
  // then reveal the lines.
  function openPanel(p) {
    if (panelCloseTimer) { clearTimeout(panelCloseTimer); panelCloseTimer = null; }
    resetPanelState(p);
    activePanel = p;
    p.el.setAttribute("aria-hidden", "false");
    updateNavActive(p.name);
    pageEl.classList.remove("page--panel-leaving");
    pageEl.classList.add("page--panel");
    pageEl.classList.add(`page--panel-${p.name}`);
    revealPanelLines(p);
  }

  // Close the active panel back to Work: mask the lines out while the backdrop
  // stays opaque, then hand off to Work once they've gone.
  function closePanel(p) {
    if (!p) return;
    activePanel = null;
    p.el.setAttribute("aria-hidden", "true");
    updateNavActive("work");
    pageEl.classList.add("page--panel-leaving");
    p.el.classList.add("is-leaving");
    p.el.classList.remove("is-in");

    // Exiting lines all start at once (no stagger — see the CSS), so the
    // exit's own "last line" starts at delay 0 regardless of p.maxDelay
    // (which reflects the entrance's staggered spread, not the exit's).
    const exitMs = Math.round(THEME.aboutLineDurationMs * PANEL_EXIT_OVERLAP);
    if (panelCloseTimer) clearTimeout(panelCloseTimer);
    panelCloseTimer = setTimeout(() => finishPanelClose(p), exitMs);
  }

  function finishPanelClose(p) {
    if (activePanel === p) return; // reopened mid-close
    if (panelCloseTimer) { clearTimeout(panelCloseTimer); panelCloseTimer = null; }
    if (!pageEl.classList.contains("page--panel")) return; // already finished
    pageEl.classList.remove("page--panel");
    pageEl.classList.remove("page--panel-leaving");
    resetPanelState(null);
  }

  // Switch directly between two panels over the same backdrop: play the old
  // one's line-out exit (same as closing to Work), then reveal the new one
  // once it's gone.
  function switchPanel(from, to) {
    if (panelCloseTimer) { clearTimeout(panelCloseTimer); panelCloseTimer = null; }

    // If an earlier switch's exit was interrupted before it finished, snap it
    // away instantly first so we don't end up with two panels' classes live.
    resetPanelState(from);
    pageEl.classList.add(`page--panel-${from.name}`);

    activePanel = to;
    updateNavActive(to.name);

    pageEl.classList.add("page--panel-leaving");
    from.el.setAttribute("aria-hidden", "true");
    from.el.classList.add("is-leaving");
    from.el.classList.remove("is-in");

    // Exiting lines all start at once (no stagger), so the exit's own "last
    // line" starts at delay 0 regardless of from.maxDelay — see closePanel.
    const exitMs = Math.round(THEME.aboutLineDurationMs * PANEL_EXIT_OVERLAP);
    panelCloseTimer = setTimeout(() => {
      panelCloseTimer = null;
      from.el.classList.remove("is-active", "is-leaving");
      pageEl.classList.remove("page--panel-leaving");
      pageEl.classList.remove(`page--panel-${from.name}`);

      to.el.setAttribute("aria-hidden", "false");
      pageEl.classList.add(`page--panel-${to.name}`);
      revealPanelLines(to);
    }, exitMs);
  }

  /* ----------------------------------------------------------------
     Routing

     About and Contact get their own URLs while keeping the in-page
     transition: navigating never reloads, it just rewrites the URL and plays
     the same reveal. Clean paths (/about/, /read/<slug>/) rather than #hash:
     a build step (scripts/generate-routes.mjs, run in CI) emits a real
     index.html for each route, so a refresh or shared link loads directly —
     no server rewrites needed. <base href="/"> keeps assets resolving.
  ---------------------------------------------------------------- */
  const PANEL_ROUTES = ["about", "contact"];

  const ROUTE_TITLES = {
    work: "Kelsey Nichols — Creative",
    about: "Kelsey Nichols — About",
    contact: "Kelsey Nichols — Contact",
  };

  // Parse the pathname into { name, slug }. Reading pieces are a two-part
  // path (/read/<slug>/); everything else is a single-token panel name.
  // Leading/trailing slashes are stripped so "/about" and "/about/" both work.
  function parsePath() {
    const p = location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    if (p.startsWith("read/")) {
      const slug = p.slice("read/".length).replace(/\/+$/, "");
      if (WRITING[slug]) return { name: "reading", slug };
    }
    return { name: PANEL_ROUTES.includes(p) ? p : "work" };
  }

  function setRouteTitle(name, slug) {
    if (name === "reading" && slug && WRITING[slug]) {
      document.title = `Kelsey Nichols — ${(WRITING[slug].title || "").replace(/\.$/, "")}`;
      return;
    }
    document.title = ROUTE_TITLES[name] || ROUTE_TITLES.work;
  }

  function writeRoute(name, replace) {
    // Trailing slash matches the generated directory pages, so a refresh
    // hits /about/index.html directly with no host-side redirect.
    const url = name === "work" ? "/" : `/${name}/`;
    setRouteTitle(name);
    // Don't stack identical entries (Escape pressed twice on Work, say).
    if (!replace && new URL(url, location.href).href === location.href) return;
    try {
      history[replace ? "replaceState" : "pushState"](null, "", url);
    } catch (err) {
      // Some origins reject history writes; the view still navigates fine.
    }
  }

  // Same as writeRoute but for a reading piece's two-part path.
  function writeReadingRoute(slug, replace) {
    const url = `/read/${slug}/`;
    setRouteTitle("reading", slug);
    if (!replace && new URL(url, location.href).href === location.href) return;
    try {
      history[replace ? "replaceState" : "pushState"](null, "", url);
    } catch (err) {
      // Some origins reject history writes; the view still navigates fine.
    }
  }

  // Back/forward land here via popstate. navTo is idempotent, so re-syncing
  // to a URL the view already matches is harmless.
  function syncFromUrl() {
    const r = parsePath();
    setRouteTitle(r.name, r.slug);
    if (r.name === "reading") setReadingContent(r.slug);
    navTo(r.name, { updateUrl: false });
  }

  // Single entry point for navigation. `name` is "work" (or "home") or a
  // panel name ("about" / "contact"). Pass { updateUrl: false } when the URL
  // is already the source of truth, to avoid writing history back on itself.
  function navTo(name, opts) {
    const options = opts || {};
    const target = panels[name] || null;
    if (options.updateUrl !== false) {
      writeRoute(target ? target.name : "work", options.replace);
    }
    if (target === activePanel) return;
    if (!target) { closePanel(activePanel); return; }
    if (!activePanel) openPanel(target);
    else switchPanel(activePanel, target);
  }

  // Debug helper: replay just the line reveal in/out on the About panel
  // without the Work handoff, so the animation can be tuned in place.
  function playAboutPreview(direction) {
    const p = aboutPanel;
    if (!p) return;

    // If About isn't the active panel, opening it plays the "in" reveal.
    if (activePanel !== p) {
      if (direction === "in") navTo("about");
      return;
    }

    if (panelCloseTimer) { clearTimeout(panelCloseTimer); panelCloseTimer = null; }
    pageEl.classList.remove("page--panel-leaving");

    // Snap instantly to the opposite state, then animate to the target so the
    // full reveal plays every time regardless of the current state.
    p.el.classList.add("panel--no-anim");
    p.el.classList.toggle("is-in", direction !== "in");
    void p.el.offsetWidth;
    p.el.classList.remove("panel--no-anim");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p.el.classList.toggle("is-in", direction === "in");
      });
    });
  }

  function updateNavActive(section) {
    // Reading is a sub-view of Work — keep Work highlighted while it's open.
    const active = section === "reading" ? "work" : section;
    navItems.forEach((a) => {
      const nav = a.dataset.nav;
      if (nav === "about" || nav === "work" || nav === "contact") {
        a.classList.toggle("is-active", nav === active);
      }
    });
  }

  // Contact form: no backend — acknowledge the submit and reset, so the
  // floating labels settle back to their resting position.
  function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const submit = form.querySelector(".contact__submit");
    let resetTimer = null;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // No backend on a static host — compose an email the visitor sends
      // from their own client, pre-filled with what they typed.
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const subject = name ? `Website inquiry from ${name}` : "Website inquiry";
      const bodyLines = [
        message,
        "",
        "—",
        name && `Name: ${name}`,
        email && `Email: ${email}`,
        phone && `Phone: ${phone}`,
      ].filter(Boolean);
      const href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = href;

      form.reset();
      if (submit) {
        submit.textContent = "Sent";
        submit.disabled = true;
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          submit.textContent = "Send";
          submit.disabled = false;
        }, 2600);
      }
    });
  }

  /* ----------------------------------------------------------------
     Init
  ---------------------------------------------------------------- */
  function init() {
    document.querySelectorAll('.nav__item, .site-name').forEach((a) => {
      a.addEventListener("click", (e) => {
        // These are real hrefs now, so let the browser handle modified clicks
        // natively — cmd/ctrl-click still opens the route in a new tab.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        const nav = a.dataset.nav;
        if (nav === "about" || nav === "contact") navTo(nav);
        else if (nav === "work" || nav === "home") { applyFilter(null); animateOffsetTo(0, CONFIG.filterOffsetMs); navTo("work"); }
      });
    });

    setupContactForm();

    // "← Back" in the reading panel returns to Work (same as Esc / the Work nav).
    if (readingEl) {
      const backBtn = document.getElementById("readingBack");
      if (backBtn) backBtn.addEventListener("click", () => navTo("work"));
    }


    buildItems();
    buildScrubber();
    readSizes();

    // The debug panel is a development affordance — it must never be able to
    // take the site down with it. It used to be built inline here, ahead of
    // every addEventListener below, so one bad reference in it left the page
    // with no wheel/key/click handlers at all: no scrolling, no first render,
    // and no way to open the panel to find out why.
    let debugReady = true;
    try {
      buildDebug();
      setDebugTab("motion");
    } catch (err) {
      debugReady = false;
      console.error("Debug panel failed to build; continuing without it.", err);
      debugEl.remove();
    }

    applyTheme();
    Object.values(panels).forEach((p) => setupPanelReveal(p.el));

    offset = 0;
    render();
    updateClock();
    setInterval(updateClock, 1000);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);

    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    stage.addEventListener("touchcancel", onTouchEnd, { passive: true });

    scrubberEl.addEventListener("mousedown", onScrubberDown);
    window.addEventListener("mousemove", onScrubberMove);
    window.addEventListener("mouseup", onScrubberUp);

    scrubberEl.addEventListener("touchstart", onScrubberDown, { passive: false });
    window.addEventListener("touchmove", (e) => { if (scrubbing) onScrubberMove(e); }, { passive: false });
    window.addEventListener("touchend", onScrubberUp);
    window.addEventListener("touchcancel", onScrubberUp);

    if (debugReady) {
      locationEl.addEventListener("click", toggleDebug);
      debugCloseBtn.addEventListener("click", closeDebug);
      debugResetBtn.addEventListener("click", resetDebug);
      debugCopyBtn.addEventListener("click", copyDebug);
      debugTabs.forEach((btn) => {
        btn.addEventListener("click", () => setDebugTab(btn.dataset.debugTab));
      });
      window.addEventListener("pointerdown", (e) => {
        if (!debugEl.classList.contains("is-open")) return;
        if (!debugEl.contains(e.target) && !locationEl.contains(e.target)) closeDebug();
      }, true);
    }

    let resizeRaf = null;
    window.addEventListener("resize", () => {
      readSizes();
      render();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(relayoutPanels);
    });

    window.addEventListener("popstate", syncFromUrl);

    const initial = parsePath();
    // Canonicalise the URL (drop junk fragments, normalise case) in place,
    // without adding a history entry.
    if (initial.name === "reading") {
      setReadingContent(initial.slug);
      writeReadingRoute(initial.slug, true);
    } else {
      writeRoute(initial.name, true);
    }

    if (initial.name === "work") {
      playIntro();
    } else {
      // Deep-linked straight into a panel. Skip the gallery intro entirely and
      // play that panel's own line reveal instead; Work stays retracted behind
      // it and animates in normally when the user navigates back.
      introPlayed = true;
      finishIntro([]);
      navTo(initial.name, { updateUrl: false });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        readSizes();
        render();
        relayoutPanels();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Debug surface
  window.__kelsey = {
    get offset() { return offset; },
    get aboutOpen() { return activePanel ? activePanel.name === "about" : false; },
    get activePanel() { return activePanel ? activePanel.name : null; },
    openAbout: () => navTo("about"),
    closeAbout: () => navTo("work"),
    navTo,
    replayIntro: () => {
      finishIntro([]);
      introPlayed = false;
      pageEl.classList.add("page--intro");
      playIntro();
    },
    get velocity() { return velocity; },
    get snapTarget() { return snapTarget; },
    get inSet() { return inSet.slice(); },
    get presence() { return presence.slice(); },
    get sizes() { return { focusedSize, thumbSize, gap, itemPadding }; },
    config: CONFIG,
    defaults: DEFAULTS,
    theme: THEME,
    themeDefaults: THEME_DEFAULTS,
  };
})();
