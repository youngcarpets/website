# Coordinate Systems — Reference

> Resource file for the **Charts agent** (`.claude/agents/charts.md`).
> The four coordinate layers in a web SVG, and how to convert between them.

## 2026-04-07 — Phase 2 (charts agent expansion)

The "off by a transform" bug is one of the most common bugs in interactive SVG. It happens because there are at least four distinct coordinate systems in play (device pixels, CSS pixels, viewport coords, viewBox coords), and any conversion between them that isn't done with the canonical APIs will eventually drift. This file is the canonical reference.

**Specs:**
- W3C SVG 2 §8 (Coordinate Systems, Transformations, Units): https://www.w3.org/TR/SVG2/coords.html
- CSSOM View Module (`getBoundingClientRect`): https://www.w3.org/TR/cssom-view-1/
- Visual Viewport API: https://www.w3.org/TR/visual-viewport/
- CSS Values 4 (`dvh`/`svh`/`lvh`): https://www.w3.org/TR/css-values-4/#viewport-relative-lengths

---

## 1. The Four Layers

```
device pixels        ← physical pixels on the screen
    ↑ × devicePixelRatio
CSS pixels           ← what window.innerWidth, clientX, getBoundingClientRect() report
    ↑ × CSS transforms (scale, etc.)
viewport coordinates ← position relative to the layout viewport (after CSS transforms)
    ↑ × SVG preserveAspectRatio + viewBox mapping
SVG viewBox units    ← what your <path d="..."> coordinates are in
```

**Every coordinate value lives in exactly one of these layers.** Mixing them produces drift. The canonical APIs (`getScreenCTM`, `createSVGPoint`, `getBBox`, `getBoundingClientRect`) each operate on a specific layer; using the wrong one for a conversion is the canonical bug source.

---

## 2. Device Pixels and `devicePixelRatio`

CSS pixels are a logical unit; device pixels are physical. The ratio is `window.devicePixelRatio`.

| Device | Resolution | DPR |
|---|---|---|
| Desktop monitor (typical) | 1920×1080 | 1.0 |
| MacBook Retina | 2880×1800 logical 1440×900 | 2.0 |
| iPhone 13 | 1170×2532 logical 390×844 | 3.0 |
| iPhone 16 Pro Max | 2868×1320 logical 440 × ~956 | ~3.0 (460 ppi panel) |
| iPad Pro M4 13" | 2752×2064 logical 1376×1032 | 2.0 |

**Why it matters:**
- **Canvas:** if you draw to a canvas at CSS-pixel size, it'll be blurry on Retina. Multiply canvas internal width/height by DPR, then use CSS to scale back down: `canvas.width = cssW * dpr; canvas.style.width = cssW + 'px'; ctx.scale(dpr, dpr);`.
- **SVG:** SVG is vector, so DPR doesn't matter for *drawing* — strokes auto-scale to physical pixels. But if you measure screen distances and compare them to viewBox units, you must know the ratio.
- **Stroke width:** `stroke-width="1"` in viewBox units will be physically thin on a Retina display unless you account for the viewBox-to-device chain.

---

## 3. `viewBox` and `preserveAspectRatio`

```svg
<svg viewBox="0 0 390 250" width="100%" preserveAspectRatio="xMidYMid meet">
```

The `viewBox` defines the **internal coordinate system** of the SVG. The `width`/`height` attributes (or CSS) define the **rendered size**. The `preserveAspectRatio` controls how the viewBox maps to the rendered size when the aspect ratios don't match.

### `preserveAspectRatio` syntax — `<align> <meetOrSlice>`

**align** — where to align inside the rendered box if there's slack (9 options + `none`):
- `xMinYMin`, `xMidYMin`, `xMaxYMin`
- `xMinYMid`, `xMidYMid` ← **default**, center alignment
- `xMaxYMid`, `xMinYMax`, `xMidYMax`, `xMaxYMax`
- `none` — stretch to fill, ignore aspect ratio

**meetOrSlice:**
- `meet` ← **default**: scale viewBox to fit *inside* the rendered box (letterbox; never crop)
- `slice`: scale viewBox to *cover* the rendered box (zoom-and-crop)

**Default behavior:** `xMidYMid meet` — center the viewBox in the rendered area, scale to fit, no cropping.

### Worked example
`viewBox="0 0 390 250"`, rendered at 780×400 px. Aspect ratios: 390:250 = 1.56, 780:400 = 1.95. ViewBox is taller-ish; rendered box is wider. With `meet`, viewBox scales to fit by height: scale = 400/250 = 1.6. Rendered viewBox area is 624×400 px, centered horizontally → 78 px of letterbox on each side.

**Spec:** https://www.w3.org/TR/SVG2/coords.html#PreserveAspectRatioAttribute

---

## 4. `getBBox()` vs `getBoundingClientRect()`

The single most common confusion in interactive SVG. **They report in different coordinate systems.**

| Method | Lives on | Coordinate system | Includes CSS transforms? |
|---|---|---|---|
| `element.getBBox()` | `SVGGraphicsElement` | viewBox units | NO |
| `element.getBoundingClientRect()` | `Element` (DOM) | viewport CSS pixels | YES |

### Concrete consequence
A `<rect x="10" y="10" width="100" height="50">` inside a `viewBox="0 0 390 250"` SVG rendered at 780 px wide:

- `getBBox()` → `{x: 10, y: 10, width: 100, height: 50}` (viewBox units)
- `getBoundingClientRect()` → `{x: ~20, y: ~20, width: ~200, height: ~100}` (CSS pixels — viewBox is scaled 2× into the rendered area)

If you compare values from these two APIs without converting, your hit-test, label placement, or animation start position will be off by the scale factor. **The canonical bug.**

**Rule:** all geometry math stays in viewBox units. Use `getBBox()` for measurement. Only touch `getBoundingClientRect()` when interfacing with pointer events or DOM positioning, and convert immediately (see §6).

---

## 5. The CTM — `getCTM()` and `getScreenCTM()`

The Current Transformation Matrix is the 3×3 affine transform that maps a coordinate from one system to another.

- `element.getCTM()` → matrix from this element's coords to its nearest viewport ancestor (`<svg>`). Composes parent `<g transform>`s.
- `element.getScreenCTM()` → matrix from this element's coords to **screen** (viewport CSS pixel) coordinates. Includes viewBox-to-rendered scaling AND any CSS transforms on ancestors.

**The killer feature:** `.inverse()` reverses any matrix. So `svg.getScreenCTM().inverse()` gives you a matrix from screen-CSS-pixels back to viewBox units, which is exactly what you need to convert pointer events.

**Spec:** https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getScreenCTM

---

## 6. Worked Example — Click Event to viewBox Coords

The canonical conversion. Required for any interactive SVG.

```ts
function pointerToViewBox(
  svg: SVGSVGElement,
  evt: PointerEvent | MouseEvent
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}
```

**What this handles for you (free):**
- viewBox-to-rendered scaling (the 2× from §4)
- `preserveAspectRatio` letterboxing offsets
- CSS transforms on ancestors (`scale`, `rotate`, etc.)
- DPR (because `clientX` is already in CSS pixels)
- Page scroll position (because `getScreenCTM` is relative to the viewport)

**What it does NOT handle:**
- Pinch-zoom on mobile — see §8 (visual viewport)
- Transforms on the `<svg>` element itself via SVG `transform` attr (handled, but check)
- 3D CSS transforms (would need a 4×4 matrix; SVG matrices are 3×3)

Use this function as the *only* way pointer events become SVG coordinates anywhere in the codebase. Lift it to a shared util.

---

## 7. The `100dvh` / `100svh` / `100lvh` Decision Tree

These viewport units exist because mobile browsers have a *retracting* URL bar. The "viewport height" changes depending on whether the URL bar is visible or scrolled away.

| Unit | Meaning | Use when |
|---|---|---|
| `vh` | The OLD unit. On iOS Safari it's the LARGE viewport (URL bar hidden). Causes content to be cropped when bar is visible. | Don't. Legacy. |
| `svh` (small viewport height) | Height when ALL UI chrome (URL bar, tab bar) is visible. Smallest possible. | When you need content to *always* fit (e.g., a hero section that should never crop) |
| `lvh` (large viewport height) | Height when ALL UI chrome is hidden. Largest possible. | When you want content to fill maximally and accept minor crop while bar is visible |
| `dvh` (dynamic viewport height) | Updates LIVE as the URL bar shows/hides. The browser repaints affected layouts. | **Default choice** — feels most natural. Watch out for layout thrash on scroll. |

**Decision tree:**
1. Need stable layout (no shifting)? → `svh` or `lvh`, depending on whether you'd rather under-fill or over-fill.
2. Want it to feel like a native app where the URL bar slides away and content expands? → `dvh`.
3. Absolutely must guarantee no crop ever? → `svh`.

**Cross-ref:** when the mobile agent's resources land, link to `mobile/viewport-and-safe-area.md` for the safe-area-inset interaction.

**Spec:** https://www.w3.org/TR/css-values-4/#viewport-relative-lengths

---

## 8. The Visual Viewport API

`window.visualViewport` exposes the **visual** viewport — what the user is currently seeing — which is different from the **layout** viewport when pinch-zoom is active.

```ts
window.visualViewport?.addEventListener('resize', () => {
  console.log({
    scale: window.visualViewport.scale,           // pinch zoom level (1.0 = no zoom)
    offsetLeft: window.visualViewport.offsetLeft, // pan offset from layout viewport
    offsetTop:  window.visualViewport.offsetTop,
    width:  window.visualViewport.width,
    height: window.visualViewport.height,
  });
});
```

**Why this matters:**
- `window.innerWidth/Height` does NOT update during pinch-zoom on iOS. Only `visualViewport` reflects what the user sees.
- For floating UI (chart tooltips, overlays) that should stay within the visible area during pinch, listen to `visualViewport.scroll` and `visualViewport.resize`.
- For pinch-aware hit testing on a chart, factor in `visualViewport.scale` when interpreting touch events.

**Spec:** https://www.w3.org/TR/visual-viewport/. iOS Safari, Chrome, Firefox all support it as of 2024.

---

## 9. Coordinate Conversion Cheatsheet

| Going from | To | Use |
|---|---|---|
| viewBox units | CSS pixels (rendered) | `pt.matrixTransform(svg.getScreenCTM())` |
| CSS pixels (event) | viewBox units | `pt.matrixTransform(svg.getScreenCTM().inverse())` (§6) |
| Element local coords | viewBox of nearest `<svg>` | `el.getCTM()` |
| viewBox units | percentage | `100 * coord / viewBoxSize` |
| CSS pixels | device pixels | `× window.devicePixelRatio` |
| device pixels | CSS pixels | `÷ window.devicePixelRatio` |
| Layout viewport | Visual viewport (during pinch) | Subtract `visualViewport.offsetLeft/Top`, divide by `visualViewport.scale` |

---

## 10. Common Pitfalls — Lookup Table

| # | Pitfall | Symptom | Fix |
|---|---|---|---|
| 1 | Using `getBoundingClientRect` for SVG-internal math | Off by scale factor (the canonical bug) | Use `getBBox()`; convert at boundaries with `getScreenCTM` |
| 2 | Pointer event with `clientX − svgRect.left` math | Wrong with letterbox or CSS transform | Use the §6 helper |
| 3 | `vh` on mobile causing crop | Bottom of layout cut off | `svh` or `dvh` |
| 4 | Canvas drawing without DPR scale | Blurry on Retina | `canvas.width = cssW * dpr; ctx.scale(dpr, dpr)` |
| 5 | Comparing `getBBox` to `clientX` directly | Drift proportional to viewBox scale | Convert one or the other |
| 6 | Reading `innerWidth` during pinch zoom | Doesn't update; tooltip drifts off-screen | `visualViewport.width` instead |
| 7 | `preserveAspectRatio="none"` + then doing geometry | Stretched coords break circles | Either use `xMidYMid meet` or accept the stretch |
| 8 | `getScreenCTM` on a not-yet-mounted SVG | Returns null | Defer to `onMount` |
| 9 | Caching the CTM and reusing across resize | Stale, drifting hit tests | Recompute every event, cheap |

---

## See also
- `vector-math.md` §8 — also covers `getScreenCTM` use, the original write-up
- `chart-display-patterns.md` §6 — mobile considerations
- `path-animation.md` §10 — `transform-box: fill-box` interacts with viewBox units
- `mobile/viewport-and-safe-area.md` — when the mobile agent's resources land
