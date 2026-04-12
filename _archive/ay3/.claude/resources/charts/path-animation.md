# Path Animation — Reference

> Resource file for the **Charts agent** (`.claude/agents/charts.md`).
> Append-only. How to animate SVG paths in 2026, with the YCI bugs that taught us each rule.

## 2026-04-07 — Phase 2 (charts agent expansion)

The YCI sheet-vinyl flash-cove animation has been the proving ground for path animation in this project. v1.23.3 (iOS Safari `<g>` keyframe failure), v1.23.6 (sheet vinyl draw-on cove), and v1.23.19 (residual-dot dasharray bug) all live here. Read this file before animating anything.

**Specs:** W3C SVG 2 §13 — Animation (https://www.w3.org/TR/SVG2/animate.html). MDN SMIL: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_animation_with_SMIL. CSS Motion Path Module Level 1: https://www.w3.org/TR/motion-1/.

---

## 1. The Draw-On Effect — `stroke-dashoffset`

The canonical "stroke draws itself in" effect. The trick: a path's stroke is a single dash longer than the path itself, offset to start out-of-sight, animated to offset zero.

```svg
<path d="..." pathLength="100"
      stroke-dasharray="100 100"
      stroke-dashoffset="100" />
```

Then animate `stroke-dashoffset` from `100` to `0`. The dash slides into view from the start of the path.

```css
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
.draw-on { animation: draw 1.2s ease-out forwards; }
```

### v1.23.6 — YCI sheet vinyl over the cove
The sheet vinyl piece is a single path that walks down the wall, around the cove arc, and out across the floor. We want it to draw on as if a roll is being unrolled into place.

Setting `pathLength="100"` means we don't have to compute the actual path length (which would change every time we tweak `CV.r`). The stroke-dasharray of `100 100` means: one dash of 100 units (the entire path), one gap of 100 units (the entire path again, off-screen). Animating offset from 100 → 0 walks the dash across.

---

## 2. The `pathLength` Attribute — Normalize to 100

`pathLength="100"` tells the browser: "pretend this path is exactly 100 units long, regardless of its actual geometry." Every dash, gap, and offset value is then in units where the entire path = 100 — i.e., percentages.

**Why this matters:**
1. You never have to compute `getTotalLength()` at runtime.
2. Geometry tweaks don't break dash math.
3. Multiple paths of different real lengths animate in lockstep.

**Spec:** https://www.w3.org/TR/SVG2/paths.html#PathLengthAttribute

**Cross-ref:** `svg-arc-math.md` §7 used `pathLength="100"` as the v1.23.19 bug fix.

---

## 3. The Residual-Dot Bug — `stroke-dasharray` Math

### v1.23.19
A dashed cove arc was leaving stray dots at the end of the path. Cause: the dash cycle didn't divide the path length evenly, so the last cycle was truncated mid-dash, leaving a partial mark that read as a "dot".

**Two fixes:**

**Fix A — math the cycle into a clean divisor.**
Quarter cove length = `22 · π/2 ≈ 34.56` units.
Pick a cycle that divides cleanly: `34.56 / 6 = 5.76` per cycle.
Use `stroke-dasharray="2.88 2.88"` → 6 complete cycles, no truncation.

**Fix B — normalize and use percentages.**
`<path pathLength="100" stroke-dasharray="5 5" />` → 10 cycles of 5+5 = 100. No truncation.

**Rule:** any dashed path → either compute the divisor or use `pathLength="100"`. Never eyeball it.

### Why "round numbers" don't help
`stroke-dasharray="5 5"` looks tidy but only tiles cleanly when path length is a multiple of 10. Without `pathLength`, the actual length depends on geometry, font of values, and floating-point — basically guaranteed to leave a residue.

---

## 4. CSS vs JS vs SMIL — When to Use Which

| Tech | Pros | Cons | Use when |
|---|---|---|---|
| **CSS @keyframes** | Hardware-accelerated, declarative, no JS, respects `prefers-reduced-motion` | Limited to animatable CSS props; iOS Safari has bugs (see §5) | Simple property animation on `<path>` itself (`stroke-dashoffset`, `opacity`, `transform`) |
| **JS rAF (`requestAnimationFrame`)** | Full programmatic control, can drive any property, can read state | Manual easing, manual frame scheduling, JS thread cost | Complex orchestration, state-dependent animation, physics |
| **SMIL `<animate>`** | Declarative, works on any SVG attribute, survives iOS Safari bugs that CSS doesn't | "Deprecated by Chrome's intent" since 2015 (never actually removed); awkward syntax | iOS Safari edge cases where CSS fails; animating non-CSS SVG attrs (`d`, `points`) |
| **Web Animations API (`element.animate()`)** | Imperative + declarative, JS control of CSS-grade animations | Less browser-coverage history but stable everywhere now | Programmatically built animations from JS without polluting stylesheets |

**Default:** CSS keyframes. Fall back to SMIL if iOS Safari breaks. Reach for rAF only when you need physics or state.

---

## 5. The iOS Safari `<g>` Keyframe Bug — v1.23.3

### Symptom
A CSS `@keyframes` animation applied to an SVG `<g>` element (group) — `transform: translateX()` over time — animated correctly in Chrome and Firefox but **silently failed** on iOS Safari. The group jumped instantly to the final state with no intermediate frames.

### Cause
WebKit historically struggles with CSS transform animation on grouping SVG elements. The CSS engine recognizes the property change but the SVG renderer doesn't pick up intermediate values from the compositor on `<g>` specifically. (Issue tracked in https://bugs.webkit.org/show_bug.cgi?id=216850 family.)

### Fix — switch to SMIL
SMIL's `<animateTransform>` is implemented inside the SVG renderer itself, not the CSS engine, so it doesn't hit the bridge bug:

```svg
<g class="matting">
  <!-- ... matting shapes ... -->
  <animateTransform
    attributeName="transform"
    type="translate"
    from="0 0" to="-300 0"
    begin="2s" dur="1.5s" fill="freeze" />
</g>
```

### Rule
Animating an SVG `<g>` transform? Use SMIL `<animateTransform>` first, CSS keyframes second. Animating a single `<path>`'s `stroke-dashoffset`? CSS is fine.

**Cross-ref:** the matting walk-off in v1.23.3 used this exact fix.

---

## 6. `motion-path` — Animating an Element Along a Path

CSS Motion Path (https://www.w3.org/TR/motion-1/) lets you attach any element to a path and animate its progress along it.

```css
.token {
  offset-path: path('M 0 0 L 100 0 Q 150 50 100 100');
  offset-distance: 0%;
  animation: travel 3s linear infinite;
}
@keyframes travel {
  to { offset-distance: 100%; }
}
```

The element follows the path at the specified `offset-distance` (0% to 100%), and `offset-rotate: auto` makes it auto-rotate to match the tangent direction.

**Browser support:** stable in all evergreen browsers as of 2025. iOS Safari supports it.

**Use case:** animating a token along a chart line, a marker along a flow diagram, an icon following a sankey ribbon.

---

## 7. Morphing Between Two `d` Attributes

You cannot just CSS-tween two `d` strings — the browser interpolates the **string**, which produces garbage. Two strategies:

### Strategy A — `flubber` library (~15 KB)
```ts
import { interpolate } from 'flubber';
const interp = interpolate(dStart, dEnd);
// interp(0) → dStart, interp(1) → dEnd, interp(0.5) → smooth tween
```
`flubber` handles different command counts and shape topologies by resampling both paths to the same number of points before interpolating. Works for any pair of paths.

### Strategy B — hand-rolled when command sequences match
If both paths have the **exact same command sequence** (e.g., both are `M L L L L Z` with 5 lines), you can tween coordinate-by-coordinate yourself:
```ts
function lerpDStrings(d1: number[], d2: number[], t: number): number[] {
  return d1.map((v, i) => v + (d2[i] - v) * t);
}
```
Faster, no dependency, but fragile — any topology mismatch produces garbage.

**Rule:** if you control both paths and can guarantee matching commands, hand-roll. Otherwise reach for `flubber`.

---

## 8. Sampling Existing Paths — `getTotalLength` and `getPointAtLength`

Two SVG DOM methods that let you query a path's geometry at runtime:

```ts
const path = document.querySelector('#mypath') as SVGPathElement;
const L = path.getTotalLength();              // total arc length in viewBox units
const p = path.getPointAtLength(L * 0.5);     // {x, y} of the point at 50% along
```

**Use cases:**
- Place a label at the midpoint of a curved path
- Animate a marker token along an arbitrary user-drawn path
- Distribute N items uniformly along a curve
- Convert a path to a polyline by sampling N points

**Caveat — uniform parameter ≠ uniform arc length.** If you sampled with `cubicBezier(t)` from `bezier-curves.md` §2 at uniform `t` steps, your samples would cluster in curved regions. `getPointAtLength()` is the canonical way to get *uniform-by-distance* samples from any path.

---

## 9. Reduced Motion — Defensive Patterns

Some users have vestibular disorders triggered by motion. The OS-level "Reduce Motion" preference exposes `(prefers-reduced-motion: reduce)`. **Honor it always.**

```css
.draw-on {
  animation: draw 1.2s ease-out forwards;
}
@media (prefers-reduced-motion: reduce) {
  .draw-on {
    animation: none;
    stroke-dashoffset: 0;     /* jump to final state */
  }
}
```

For multi-step interactive diagrams, use the preference to skip auto-playing intros and start the user already on the final step. They can still navigate steps manually.

```ts
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const initialStep = reduceMotion ? steps.length - 1 : 0;
```

**Spec:** WCAG 2.2 §2.3.3 (Animation from Interactions). https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

## 10. `transform-box: fill-box` — The Origin Trap

When you apply `transform: rotate(45deg)` to an SVG element via CSS, **the rotation origin defaults to the SVG viewport's `(0, 0)`**, not the element's own center. This is almost never what you want.

```css
.gear {
  transform-box: fill-box;        /* origin = element's bbox */
  transform-origin: center;       /* center of that bbox */
  animation: spin 4s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

Without `transform-box: fill-box`, the gear orbits the SVG's `(0, 0)` like a moon instead of spinning in place.

**Rule:** any per-element CSS transform on an SVG element → set `transform-box: fill-box` first. Always.

**Spec:** https://www.w3.org/TR/css-transforms-1/#transform-box

---

## 11. Common Pitfalls — Lookup Table

| # | Pitfall | Symptom | Fix |
|---|---|---|---|
| 1 | Dasharray not matching path length | Stray dot at end (v1.23.19) | `pathLength="100"` |
| 2 | CSS transform on `<g>` on iOS Safari | Animation jumps to end (v1.23.3) | SMIL `<animateTransform>` |
| 3 | `transform-origin` without `transform-box` | Element orbits viewport corner | `transform-box: fill-box` |
| 4 | Tweening `d` strings directly | Garbage shape | `flubber` or matching command sequences |
| 5 | Ignoring `prefers-reduced-motion` | A11y violation; nausea for sensitive users | `@media` query → static final state |
| 6 | `getPointAtLength` on a not-yet-mounted path | Returns `(0,0)` | Defer until `onMount` |
| 7 | Animating in `$effect` reactive to every state change | Animation re-triggers on every keystroke | Move to `onMount` or guard with `untrack` |
| 8 | Forgot `fill="freeze"` on SMIL | Animation snaps back to initial state at end | Add `fill="freeze"` |

---

## See also
- `svg-arc-math.md` §7 — dasharray/pathLength interaction (the v1.23.19 fix)
- `bezier-curves.md` — Beziers being animated
- `chart-display-patterns.md` §5 — high-level animation patterns for charts
- `coordinate-systems.md` — `getBBox()` returns viewBox units, used by `transform-box: fill-box`
