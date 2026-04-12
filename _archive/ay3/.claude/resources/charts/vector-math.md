# Vector Math — Reference

> Resource file for the **Charts agent**.
> Vector operations for SVG/canvas graphics in the AY3 app.

## 2026-04-07 — Phase 1 (initial population by Charts agent)

Companion to `svg-arc-math.md`. Everything in here supports the geometry derivations in that file plus the dimension-callout arrow math in `dimension-callouts.md`.

---

## 1. Direction Vectors

Given two points `A = (ax, ay)` and `B = (bx, by)`:

```
direction      = (bx − ax, by − ay)
length         = √((bx−ax)² + (by−ay)²)
unit direction = ((bx−ax)/length, (by−ay)/length)
```

### Worked example — YCI radius callout line (v1.23.22)
Cove arc midpoint ≈ `(66.44, 153.56)`, center `(82, 138)`. Direction from midpoint toward center:

- delta = `(82 − 66.44, 138 − 153.56) = (15.56, −15.56)`
- length = `√(15.56² + 15.56²) ≈ 22.0` ✓ (equals the radius, as expected)
- unit = `(0.707, −0.707)`

That unit vector is the direction the "R 7/8″" leader arrow points (from the arc surface back to the center).

---

## 2. Perpendicular Vectors — 90° Rotation

For a 2D vector `(x, y)`:

- **CCW 90°** (left turn in math y-up): `(−y, x)`
- **CW 90°** (right turn in math y-up): `(y, −x)`

**SVG y-down flip:** because SVG y is flipped, the visual rotation is mirrored. `(−y, x)` looks like a RIGHT turn on screen, `(y, −x)` looks like a LEFT turn. Always test visually; don't trust textbook conventions.

### Worked example — arrowhead base points

Arrow tip at `T = (66.44, 153.56)`, direction of travel (away from tip, back along the shaft) = `(−0.707, 0.707)` (opposite of unit direction from §1).

Perpendicular to shaft (one side): `(−0.707, −0.707)` — via `(−y, x)`.
Perpendicular (other side): `(0.707, 0.707)` — via `(y, −x)`.

Arrow base (2 units back from tip, 1 unit each side):
- Base center = `T + 2·(−0.707, 0.707) = (65.03, 154.97)`
- Base left  = base center + `1·(−0.707, −0.707) = (64.32, 154.26)`
- Base right = base center + `1·(0.707, 0.707)   = (65.74, 155.68)`

Polygon: `T`, base-left, base-right. See `dimension-callouts.md` §arrow-math for the generalized formula.

---

## 3. Polar ↔ Cartesian

**Math convention (y-up):**
```
x = r·cos(θ)
y = r·sin(θ)
r = √(x² + y²)
θ = atan2(y, x)
```

**SVG convention (y-down):** Same formulas, but the y-axis flip means `θ = 90°` points DOWN visually, not up. Either:
- Reason in SVG directly (accept `+y = down`) — recommended
- Negate y at boundaries (flip when converting to/from math space)

Be consistent within one function.

---

## 4. Linear Interpolation

```
lerp(a, b, t) = a + (b − a)·t
```

- `t = 0` → `a`; `t = 1` → `b`; `t = 0.5` → midpoint.
- For 2D points: lerp x and y independently.
- Can extrapolate with `t < 0` or `t > 1`.

Used everywhere: tween between two positions, sample along a line, derive intermediate colors, compute stroke-dashoffset progress.

---

## 5. Easing Curves as Math Functions

CSS `cubic-bezier(x1, y1, x2, y2)` defines a curve through `(0,0)` and `(1,1)` with two control points. Common named easings:

| Name | cubic-bezier | Feel |
|---|---|---|
| linear | (0, 0, 1, 1) | Constant |
| ease | (0.25, 0.1, 0.25, 1.0) | Default CSS |
| ease-in | (0.42, 0, 1, 1) | Slow start |
| ease-out | (0, 0, 0.58, 1) | Slow end |
| ease-in-out | (0.42, 0, 0.58, 1) | Slow both ends |
| cubic-out | (0.215, 0.61, 0.355, 1) | Snappy settle |
| expo-out | (0.19, 1, 0.22, 1) | Dramatic landing |

For programmatic use (non-CSS), implement with the Bezier parametric form or look up svelte/easing which exposes them directly.

---

## 6. Bounding Boxes for Rotated Shapes

Rotating a shape changes its axis-aligned bounding box (AABB). For a square of side `s` rotated 45°, the AABB is a square of side `s·√2`. Rotating 90° returns the original AABB.

**General rule:** after rotating by angle `θ`, the AABB of a shape with original AABB `(w, h)` becomes:
```
newW = |w·cos(θ)| + |h·sin(θ)|
newH = |w·sin(θ)| + |h·cos(θ)|
```

### Carpet-tile herringbone bug (earlier in project history)
Tiles laid at 45° had their original AABB used for layout calculations → tiles overlapped by `(√2 − 1)·s ≈ 0.414·s` along each axis. Fix: multiply layout pitch by √2 when the tile is at 45°.

---

## 7. Affine Transforms as 3×3 Matrices

Any 2D transform (translate, scale, rotate, skew) can be represented as a 3×3 matrix acting on homogeneous `(x, y, 1)` vectors:

**Translate (tx, ty):**
```
| 1 0 tx |
| 0 1 ty |
| 0 0  1 |
```

**Scale (sx, sy):**
```
| sx  0  0 |
|  0 sy  0 |
|  0  0  1 |
```

**Rotate θ (math y-up, CCW):**
```
| cos θ  -sin θ  0 |
| sin θ   cos θ  0 |
|   0       0    1 |
```

### Composition order matters
Matrix multiplication is **not commutative**. `T · R ≠ R · T`.

- `T · R` (translate then rotate): rotate around the new origin
- `R · T` (rotate then translate): rotate around the original origin, then shift

CSS `transform: translate(10px, 0) rotate(45deg)` applies **right-to-left** in the token order → rotate first, then translate. Equivalent to `T · R` acting on the point. This bites everyone.

SVG `transform="translate(10,0) rotate(45)"` applies **left-to-right**: translate first, then rotate. Opposite convention from CSS. Don't mix mental models.

---

## 8. Coordinate System Conversions

### viewBox ↔ viewport pixels
SVG `viewBox="0 0 390 250"` in a `<svg width="100%">` element that renders at 780px wide → scale factor 2. A stroke-width of 4 in viewBox units renders as 8 physical pixels.

```
pixelScale = viewportWidth / viewBoxWidth
strokePixels = strokeViewBox · pixelScale
```

### viewport ↔ percentage
```
percentX = (viewportX / viewBoxWidth) · 100
```

Use `%` units inside SVG when you want responsive behavior. Use viewBox units when you want exact layout.

### Mouse event → viewBox coords
```ts
function toViewBox(svg: SVGSVGElement, evt: MouseEvent) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}
```

`getScreenCTM()` returns the current transformation matrix from viewBox to screen; inverting it goes the other way. This is the canonical way to map pointer events to SVG-internal coordinates and it handles any `preserveAspectRatio` weirdness for free.

**Spec:** https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getScreenCTM

---

## See also
- `svg-arc-math.md` §3 — uses perpendicular rotation from §2 of this file
- `dimension-callouts.md` §arrow-math — arrowhead polygons from §2 of this file
