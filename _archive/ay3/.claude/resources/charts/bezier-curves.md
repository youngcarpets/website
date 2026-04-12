# Bezier Curves — Reference

> Resource file for the **Charts agent** (`.claude/agents/charts.md`).
> Append-only. Companion to `svg-arc-math.md` — covers the `Q`/`C`/`S`/`T` commands that arc math doesn't.

## 2026-04-07 — Phase 2 (charts agent expansion)

`svg-arc-math.md` covers `A` (elliptical arc) which is the right tool when you need a *guaranteed-circular* shape (the YCI cove). Bezier commands (`Q`, `C`, `S`, `T`) are the right tool when you need *arbitrary* smooth curves — waves, decorative flourishes, hand-drawn-feeling paths, morphable shapes, organic blob backgrounds. This file is the math reference for those.

**Spec:** W3C SVG 2 §9.5 (https://www.w3.org/TR/SVG2/paths.html#PathDataCubicBezierCommands). MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#bezier_curves. Foundational reference: Pomax — *A Primer on Bezier Curves* (https://pomax.github.io/bezierinfo/) — the canonical free text.

---

## 1. Quadratic Bezier — `Q x1 y1 x y`

Three control points: `P0` (current point, implicit), `P1 = (x1, y1)`, `P2 = (x, y)`.

**Parametric form:**
```
B(t) = (1−t)²·P0 + 2(1−t)t·P1 + t²·P2     for t ∈ [0, 1]
```

- `t = 0` → `B(0) = P0` (curve starts at the current point)
- `t = 1` → `B(1) = P2` (curve ends at the endpoint)
- `t = 0.5` → `B(0.5) = ¼·P0 + ½·P1 + ¼·P2` (the midpoint, biased toward the control point but only halfway)

The control point `P1` is **not on the curve** — it's a magnet that pulls the curve toward itself. The curve is tangent to the line `P0→P1` at `P0`, and tangent to the line `P1→P2` at `P2`.

### Worked example — sample a quadratic Bezier in TypeScript

```ts
function quadBezier(
  P0: [number, number],
  P1: [number, number],
  P2: [number, number],
  t: number
): [number, number] {
  const u = 1 - t;
  const x = u*u*P0[0] + 2*u*t*P1[0] + t*t*P2[0];
  const y = u*u*P0[1] + 2*u*t*P1[1] + t*t*P2[1];
  return [x, y];
}
```

Use this when you need to place a label *on* a curve, animate a token along a curve, or convert a Bezier to a polyline for canvas rendering.

---

## 2. Cubic Bezier — `C x1 y1 x2 y2 x y`

Four control points: `P0` (implicit), `P1 = (x1, y1)`, `P2 = (x2, y2)`, `P3 = (x, y)`.

**Parametric form:**
```
B(t) = (1−t)³·P0 + 3(1−t)²t·P1 + 3(1−t)t²·P2 + t³·P3     for t ∈ [0, 1]
```

The cubic is the workhorse: CSS `cubic-bezier()` easings, Adobe Illustrator pen tool, Figma vector tool — all cubic Beziers under the hood. Two control points give enough flexibility to draw essentially any smooth single-segment curve.

### Worked example — TypeScript

```ts
function cubicBezier(
  P0: [number, number],
  P1: [number, number],
  P2: [number, number],
  P3: [number, number],
  t: number
): [number, number] {
  const u = 1 - t;
  const uu = u*u, uuu = uu*u;
  const tt = t*t, ttt = tt*t;
  const x = uuu*P0[0] + 3*uu*t*P1[0] + 3*u*tt*P2[0] + ttt*P3[0];
  const y = uuu*P0[1] + 3*uu*t*P1[1] + 3*u*tt*P2[1] + ttt*P3[1];
  return [x, y];
}
```

---

## 3. Tangent Vectors at the Endpoints

The derivative `B'(t)` gives the velocity vector — its direction is the tangent to the curve at parameter `t`, its magnitude is the "speed" of parameterization.

### Quadratic
```
B'(t) = 2(1−t)·(P1−P0) + 2t·(P2−P1)
B'(0) = 2·(P1 − P0)        ← tangent at start, parallel to P0→P1
B'(1) = 2·(P2 − P1)        ← tangent at end,   parallel to P1→P2
```

### Cubic
```
B'(t) = 3(1−t)²·(P1−P0) + 6(1−t)t·(P2−P1) + 3t²·(P3−P2)
B'(0) = 3·(P1 − P0)        ← tangent at start, parallel to P0→P1
B'(1) = 3·(P3 − P2)        ← tangent at end,   parallel to P2→P3
```

**Practical consequence:** the line from the endpoint to the *adjacent* control point IS the tangent direction at that endpoint. This is why pen-tool "handles" in Figma/Illustrator are drawn as lines extending from the anchor point — they're the tangent directions made visible.

Cross-ref: `svg-arc-math.md` §5 (tangent continuity for arcs). Same principle, different curve family.

---

## 4. Smooth-Curve Continuity — The `S` and `T` Commands

`S` (smooth cubic) and `T` (smooth quadratic) are *shorthand* commands. They take fewer arguments because they assume the **first control point is the reflection of the previous segment's last control point** through the current point.

**`S x2 y2 x y`** — cubic with implicit `x1, y1`:
```
implicit P1 = 2·current − previous_P2
```

**`T x y`** — quadratic with implicit `x1, y1`:
```
implicit P1 = 2·current − previous_P1
```

This forces **C¹ continuity** (continuous first derivative) at the join: the tangent direction AND magnitude match across the seam, so the curve looks perfectly smooth.

### Gotcha — `S` after a non-cubic command
If `S` follows anything other than `C` or `S`, the implicit control point is just the current point (no reflection). You almost never want this. Always pair `S` with a preceding `C`.

### Worked example — wave path with smooth cubics

A horizontal wave from `(0, 50)` to `(400, 50)` with two humps:

```svg
<path d="M 0 50
         C 50 0, 150 0, 200 50
         S 350 100, 400 50" />
```

- `C 50 0, 150 0, 200 50` — first hump UP. Control points `(50,0)` and `(150,0)` pull the curve above the baseline.
- `S 350 100, 400 50` — second hump DOWN. The implicit first control point is the reflection of `(150, 0)` through `(200, 50)` = `(250, 100)`. Together with `(350, 100)` it pulls the curve below the baseline. Smooth seam at `(200, 50)`.

The wave reads as one continuous sinuous line, not two separate humps glued together.

---

## 5. De Casteljau's Algorithm — The Geometric Construction

Bernstein polynomials (the formulas in §1 and §2) are the *algebraic* way to evaluate a Bezier. **De Casteljau's algorithm** is the *geometric* way: more lines of code, but numerically stable and naturally extends to splitting curves.

For a cubic with control points `P0, P1, P2, P3` at parameter `t`:

1. `Q0 = lerp(P0, P1, t)`
2. `Q1 = lerp(P1, P2, t)`
3. `Q2 = lerp(P2, P3, t)`
4. `R0 = lerp(Q0, Q1, t)`
5. `R1 = lerp(Q1, Q2, t)`
6. `B(t) = lerp(R0, R1, t)`

Each round of lerps reduces the number of points by one. After 3 rounds (for a cubic), you're left with one point — the point on the curve.

```ts
function deCasteljauCubic(
  P0: [number, number], P1: [number, number],
  P2: [number, number], P3: [number, number],
  t: number
): [number, number] {
  const lerp = (a: [number, number], b: [number, number], t: number): [number, number] =>
    [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const Q0 = lerp(P0, P1, t);
  const Q1 = lerp(P1, P2, t);
  const Q2 = lerp(P2, P3, t);
  const R0 = lerp(Q0, Q1, t);
  const R1 = lerp(Q1, Q2, t);
  return lerp(R0, R1, t);
}
```

Algebraically equivalent to §2; numerically more robust for `t` near 0 or 1.

---

## 6. Splitting a Curve at Parameter `t`

De Casteljau gives the split for free. The intermediate points from the algorithm form the control points of the two sub-curves:

For a cubic split at `t`:
- **Left sub-curve:** `P0, Q0, R0, B(t)`
- **Right sub-curve:** `B(t), R1, Q2, P3`

Both sub-curves are themselves cubic Beziers. Concatenated, they reproduce the original curve exactly.

**Use case:** trimming a curve to "just the part from t=0.2 to t=0.7" — split twice. Used in path-on-path animation, partial reveal effects, scissor cuts in vector editing.

---

## 7. Approximating a Circle With Cubic Beziers

A cubic Bezier *cannot* exactly represent a circular arc. But you can approximate one with very small error using the magic constant:

```
k = 4·(√2 − 1) / 3 ≈ 0.5522847498
```

### Quarter circle from `(r, 0)` to `(0, r)`, centered at origin:

```
P0 = (r,    0)
P1 = (r,    r·k)
P2 = (r·k,  r)
P3 = (0,    r)
```

Maximum radial error: ~0.027% of the radius. Visually indistinguishable from a true arc. Four such quarters chained make a full "circle" with error well under 1%.

### Why does this work?
`k` is the value that makes the Bezier curve tangent to the circle at both endpoints, with the middle of the curve hitting the circle at its midpoint. Derived by setting `B(0.5) = (r/√2, r/√2)` and the tangents matching the circle's tangents at the endpoints, then solving for `k`. Reference: Pomax — *A Primer on Bezier Curves* §"Circles and cubic Beziers".

### When to use this vs `A` command
| Need | Use |
|---|---|
| Truly circular shape, simple geometry | `A rx ry 0 large sweep x y` (see `svg-arc-math.md`) |
| Want to morph the shape into something non-circular | Bezier circle approximation (morph-friendly because point counts can match) |
| Need to sample the curve programmatically with `cubicBezier()` | Bezier approximation (no closed-form arc sampler in stdlib) |

---

## 8. Bezier vs Arc — Decision Table

| Situation | `Q`/`C` | `A` |
|---|---|---|
| YCI cove (must be exact quarter circle) | | ✓ |
| Decorative wave header background | ✓ | |
| Speech bubble with curved tail | ✓ | |
| Pie chart wedge edge | | ✓ |
| Logo with hand-drawn flourishes | ✓ | |
| Animated path morph between two arbitrary shapes | ✓ | |
| Dimension-callout angular arc (`dimension-callouts.md` §5) | | ✓ |
| Sparkline with smoothed peaks | ✓ (cubic with auto-tangent) | |

Rule of thumb: **arcs for engineering, Beziers for art**.

---

## 9. Worked Example — Smooth Wave Path With Four Cubics

A horizontal sinusoid-like wave, 800 wide, baseline at y=100, amplitude 30, four humps. Each hump is one cubic, joined smooth-cubic-style.

```ts
const W = 800;
const Y = 100;
const A = 30;
const HUMPS = 4;
const SEG = W / HUMPS;          // 200
const CTRL = SEG * 0.5;         // 100 — symmetric control offset

let d = `M 0 ${Y}`;
let upward = true;
for (let i = 0; i < HUMPS; i++) {
  const x0 = i * SEG;
  const x3 = (i + 1) * SEG;
  const peakY = upward ? Y - A : Y + A;
  const c1x = x0 + CTRL * 0.5;
  const c1y = peakY;
  const c2x = x3 - CTRL * 0.5;
  const c2y = peakY;
  d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x3} ${Y}`;
  upward = !upward;
}
```

Yields:
```
M 0 100 C 50 70, 150 70, 200 100 C 250 130, 350 130, 400 100 C 450 70, 550 70, 600 100 C 650 130, 750 130, 800 100
```

Each segment is its own cubic with explicit control points (no `S`) — the symmetry of the control points across the baseline ensures C¹ continuity at every seam without needing the shorthand. Equivalent to a single `M` + three `S` commands but more readable.

For a draw-on animation of this wave, set `pathLength="100"` and animate `stroke-dashoffset` from 100 to 0 (cross-ref: `path-animation.md`).

---

## 10. Common Pitfalls — Lookup Table

| # | Pitfall | Symptom | Fix |
|---|---|---|---|
| 1 | Confusing P1 with a point on the curve | Curve doesn't go where you expected | Sample with `cubicBezier(t)`, not the control point |
| 2 | `S` after a `M` or `L` | First sub-curve doesn't reflect; jagged | Always pair `S` after `C` (or `T` after `Q`) |
| 3 | Tangent magnitude mismatch at smooth seam | Visible "speed change" in animation along path | Use `S`/`T` shorthand or carefully match magnitudes |
| 4 | Over-using cubic when arc would do | Approximation error in engineering drawing | Use `A` for guaranteed circular |
| 5 | Wrong `k` constant for circle approximation | Visible flat or bulge | `k = 0.5523` (4(√2−1)/3), not 0.55 or 0.5 |
| 6 | Different point counts between morph endpoints | `flubber` works but jitters; hand-rolled morph fails | Match command sequences before morphing (see `path-animation.md` §morph) |
| 7 | Sampling at uniform `t` ≠ uniform arc length | Token moves "fast" through curved sections, "slow" through straight | Use `getPointAtLength()` or arc-length parameterization |

---

## See also
- `svg-arc-math.md` — when the curve must be a true circle/arc
- `vector-math.md` §5 — CSS `cubic-bezier()` easing curves are 1D Beziers; same math
- `path-animation.md` — animating along Bezier paths
- `dimension-callouts.md` §5 — angular dimension arcs (always `A`, not Bezier)
