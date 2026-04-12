# Dimension Callouts — Reference

> Resource file for the **Charts agent**. Engineering-drawing dimension conventions, scoped to what's useful in app UI graphics.

## 2026-04-07 — Phase 1 (initial population by Charts agent)

Created after v1.23.22 shipped a hand-computed "R 7/8″" radius callout on the YCI cove animation. The math was standard but error-prone; future callouts should verify against this file first.

---

## 1. Dimension Types — Quick Reference

| Type | Symbol | Shape | Use |
|---|---|---|---|
| Linear | (none) | Two arrows along a baseline, extension lines from feature endpoints, value above baseline | Measure a straight distance (length, width, thickness) |
| Radius | `R` prefix | Single arrow from center (or off-arc) to arc surface, `R <value>` label | Communicate arc size |
| Diameter | `Ø` prefix | Arrow through circle center OR single arrow with `Ø` label | Communicate circle size |
| Angular | `°` suffix | Arc-shaped line between two converging lines, arrows at each end | Angle between two features |
| Leader | (none) | Short line + arrow pointing at feature, text at the other end | Label a feature that doesn't fit a dimension |

Source: ASME Y14.5 (dimensioning and tolerancing standard), ISO 129-1.

---

## 2. Linear Dimension

Anatomy:
1. Two **extension lines** perpendicular to the feature, starting just offset from the feature endpoints (gap ~1–2 stroke widths), extending past the dimension line
2. One **dimension line** parallel to the feature, with arrows at both ends
3. Two **arrows** pointing outward at the ends of the dimension line
4. **Value text** centered above the dimension line (or in a gap in the line), in engineering convention units (inches with fractions or decimals, mm for metric)

### SVG skeleton
```svg
<g stroke="gold" stroke-width="1" fill="gold" font-family="monospace">
  <line x1="60" y1="100" x2="60" y2="80"  />   <!-- ext line 1 -->
  <line x1="82" y1="100" x2="82" y2="80"  />   <!-- ext line 2 -->
  <line x1="60" y1="85"  x2="82" y2="85"  />   <!-- dim line -->
  <polygon points="60,85 65,83 65,87" />        <!-- left arrow -->
  <polygon points="82,85 77,83 77,87" />        <!-- right arrow -->
  <text x="71" y="80" text-anchor="middle">7/8"</text>
</g>
```

---

## 3. Radius Dimension — The v1.23.22 Canonical

For the YCI cove: radius 22, center `(82, 138)`, arc surface includes the midpoint `(66.44, 153.56)` (computed in `svg-arc-math.md` §4).

**Convention:** single arrow, `R <value>` label, arrow tip at the arc surface, line pointing toward the center (or the line can cross the center and extend out for clarity).

### Step-by-step

1. Pick the target point on the arc (usually the midpoint, so the callout doesn't crowd either endpoint):
   - `tip = (66.44, 153.56)`

2. Direction vector from tip toward center:
   - `delta = (82 − 66.44, 138 − 153.56) = (15.56, −15.56)`
   - `length = 22.0`
   - `unit = (0.707, −0.707)`

3. Leader line from tip toward (or beyond) center. A 30-unit leader:
   - `leaderEnd = tip + 30·unit = (66.44 + 21.21, 153.56 − 21.21) = (87.65, 132.35)`

4. Arrow polygon at the tip — see §6.

5. Text position: slightly past the leader end, offset perpendicular to avoid covering the line:
   - `perp = (0.707, 0.707)` (CCW 90° rotation of `unit` via `(−y, x) = (0.707, 0.707)`)
   - `textPos = leaderEnd + 4·perp = (90.48, 135.18)`
   - Content: `"R 7/8\""`

### Why the arrow points at the arc, not the center
Convention: the arrow identifies **what** is being measured (the arc surface). The center is implied by where the line ends. If you put the arrow at the center, it reads as "label the center point", not "measure the radius".

---

## 4. Diameter Dimension

Two variants:

**Variant A — single arrow with Ø prefix.** Same as a radius callout but labeled `Ø <value>` (diameter = 2·radius).

**Variant B — through-center double arrow.** Line passes through the center, arrows at both ends pointing outward at the two opposite surface points. Used when the feature is clearly a full circle (not an arc).

For the YCI cove (which is a quarter-arc, not a full circle), diameter callouts are inappropriate — always use radius (`R`).

---

## 5. Angular Dimension

Anatomy:
1. Two lines converging at a vertex
2. An **arc-shaped dimension line** centered on the vertex, spanning between the two lines
3. Arrows at each end of the arc
4. Value text with `°` suffix, placed along the arc or centered in it

### Computing the angular dimension arc

Given vertex `V`, two direction vectors `d1`, `d2` defining the angle, and a radius `r` for the dimension arc:

```
θ1 = atan2(d1.y, d1.x)     // SVG coords
θ2 = atan2(d2.y, d2.x)
start = V + r·(cos θ1, sin θ1)
end   = V + r·(cos θ2, sin θ2)
angle = |θ2 − θ1| (take shortest signed angle)
```

SVG arc path: `M start.x start.y A r r 0 0 <sweep> end.x end.y`.

Sweep flag follows the rule from `svg-arc-math.md` §2 — pick consciously based on direction of travel.

---

## 6. Arrow Polygon Math

The canonical formula for computing a 3-point arrow polygon given:
- `tipX`, `tipY` — where the arrow points
- `dirX`, `dirY` — the direction the line comes FROM (unit vector back along the shaft, away from the tip)
- `length` — how far back the base sits from the tip
- `width` — half the total base width (so total width = `2 × width`)

```ts
function arrowPoints(
  tipX: number, tipY: number,
  dirX: number, dirY: number,   // unit vector pointing away from tip, back along shaft
  length: number, width: number
): string {
  const baseX = tipX + dirX * length;
  const baseY = tipY + dirY * length;

  // Perpendicular (CCW 90° in math y-up; visually either side in SVG — test and flip if needed)
  const perpX = -dirY;
  const perpY =  dirX;

  const leftX  = baseX + perpX * width;
  const leftY  = baseY + perpY * width;
  const rightX = baseX - perpX * width;
  const rightY = baseY - perpY * width;

  return `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`;
}
```

### Worked example — YCI radius callout arrow

- `tip = (66.44, 153.56)`
- `dir = (0.707, −0.707)` — unit from tip toward center; note this is the shaft direction AWAY from the tip
- `length = 4`, `width = 2`

```
baseX = 66.44 + 0.707·4 = 69.27
baseY = 153.56 − 0.707·4 = 150.73
perp  = (0.707, 0.707)     // (−dirY, dirX)
leftX  = 69.27 + 0.707·2 = 70.68
leftY  = 150.73 + 0.707·2 = 152.14
rightX = 69.27 − 0.707·2 = 67.86
rightY = 150.73 − 0.707·2 = 149.32
```

Polygon: `66.44,153.56 70.68,152.14 67.86,149.32`

Width/length ratio: for a clean visual, use `length : width = 2 : 1` (length twice the half-width). Too-wide arrows look cartoonish; too-narrow arrows look like slivers.

---

## 7. Leader Callouts

A **leader** is a simple line + arrow pointing at a feature, with text at the other end. Used when the feature has no obvious dimension (e.g., labeling "heat-weld seam" on the YCI cove).

**Rules of thumb:**
- Leader length: 1–3 stroke widths from the feature if space allows; longer only when crowding forces it out
- Leader angle: avoid horizontal or vertical leaders when multiple leaders cluster (makes them look like extension lines); 30°–60° is standard
- Text: horizontal regardless of leader angle (for legibility)
- Text position: at the opposite end from the arrow, offset just past the end of the leader line

---

## 8. Label Tightness — The "Tighter to the Feature" Pattern

Short leaders communicate confidence and precision; long leaders communicate crowding and compromise. Prefer short. When multiple callouts collide:

1. First try shortening all leaders and rotating them to spread apart
2. If that fails, stagger them radially around the feature (clock positions 2, 5, 8, 11 o'clock)
3. Only as a last resort, introduce a legend or detail bubble

Never cross leaders. Crossing leaders destroy readability.

---

## 9. Color Conventions

Traditional engineering blueprint → gold/yellow on dark, or black on white. For AY3 (Apple Liquid Glass, dark surfaces, electric accents):

| Element | Color | Rationale |
|---|---|---|
| Substrate / concrete / base material | Neutral gray (~#6b7280) | Recedes visually |
| Product / feature being measured | Accent color | Matches the module's electric pill (e.g., YCI blue for sheet vinyl) |
| Dimension lines + arrows + values | **Gold** (~#facc15 or `theme.gold`) | Classic engineering blueprint convention; high contrast on dark glass |
| Leader callouts (labels) | White or light gray | Distinguishes label from dimension |
| Tolerances / notes | Muted secondary (~#94a3b8) | Lower priority than main dimensions |

**Rule:** gold is reserved for **measurements** (numeric callouts with units). Don't use gold for decorative elements — it dilutes the "this number is a dimension" signal.

Cross-reference: `feedback_design_philosophy.md` (neutral surfaces + electric accents), `agents/design.md` (visual layer decisions).

---

## See also
- `svg-arc-math.md` — arc geometry the radius callout points at
- `vector-math.md` §2 — perpendicular rotation for arrow polygons
- `chart-display-patterns.md` §7 — interactive engineering diagram pattern (where callouts live)
