# SVG Arc Math — Reference

> Resource file for the **Charts agent** (`.claude/agents/charts.md`).
> Append-only. Every entry is dated and tied to a real bug or scenario.

## 2026-04-07 — Phase 1 (initial population by Charts agent)

This file exists because the parent thread shipped three buggy versions in a row (v1.23.13, v1.23.20, v1.23.22) on the YCI flash-cove animation while getting SVG arc math wrong. Every concept below is anchored to the YCI cove geometry so the next time we touch an arc, we verify against this file first.

---

## 1. The SVG Arc Command — Grammar

`A  rx  ry  x-axis-rotation  large-arc-flag  sweep-flag  x  y`

- `rx`, `ry` — ellipse radii (equal for a circular arc)
- `x-axis-rotation` — degrees (0 for circles)
- `large-arc-flag` — 0 = short arc, 1 = long arc
- `sweep-flag` — 0 = counterclockwise in SVG coords, 1 = clockwise
- `x`, `y` — absolute endpoint (lowercase `a` = relative)

**Spec:** W3C SVG 1.1 §F.6 (https://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes) — canonical parameterization. MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#elliptical_arc.

### SVG coordinate caveat — the bug engine
**SVG y increases downward.** "Clockwise in SVG" looks clockwise on-screen but is mathematically counterclockwise on a y-up graph. Always reason in SVG coords.

| Visual | sweep-flag |
|---|---|
| Clockwise on-screen | `1` |
| Counterclockwise on-screen | `0` |

---

## 2. THE RULE THE PARENT KEEPS GETTING WRONG

### Rule: Reversing a path direction requires flipping the sweep-flag.

Same physical curve, reversed travel direction = opposite sweep-flag. `large-arc-flag` does NOT flip.

### Worked example — v1.23.13 bug

YCI cove geometry: `CV.cornerX=60, CV.cornerY=160, CV.r=22`
- Top endpoint: `(60, 138)` — wall side (60, 160−22)
- Right endpoint: `(82, 160)` — floor side (60+22, 160)

Cove surface = concave quarter circle, center at `(82, 138)`, radius 22.

**Direction A (wall → floor) — correct:**
```
M 60 138  A 22 22 0 0 0 82 160
```
Sweep-flag 0 (CCW in SVG-visual) from (60,138) curves DOWN-RIGHT into the corner. Concave. Good.

**Direction B (floor → wall, sweep-flag not flipped) — v1.23.13 shipped this:**
```
M 82 160  A 22 22 0 0 0 60 138   ← WRONG
```
From (82,160), CCW to (60,138) wraps the OPPOSITE side of the circle → convex bulge. Off by 180° across the chord.

**Direction B — correct:**
```
M 82 160  A 22 22 0 0 1 60 138   ← sweep-flag flipped to 1
```
CW from (82,160) to (60,138) retraces the same concave arc in reverse.

**Rule in one line:** *Flip endpoints → flip sweep-flag → keep everything else.*

### Why it works

Two endpoints + a radius define TWO possible circle centers (one on each side of the chord). Each center has 2 possible arcs (short, long) → 4 candidates. `large-arc-flag` picks short vs long. `sweep-flag` picks which center. Reversing direction swaps "left of travel" ↔ "right of travel", so the center-picking flag must flip. Short/long is invariant under reversal — `large-arc-flag` stays.

---

## 3. Picking the Right Center — From First Principles

Given `P1`, `P2`, radius `r`:

1. Chord midpoint: `M = ((x1+x2)/2, (y1+y2)/2)`
2. Chord length: `d = |P2 − P1|`
3. Feasibility: `d ≤ 2r`
4. `a = d/2`
5. Center-to-chord distance: `h = √(r² − a²)`
6. Unit chord: `u = (P2 − P1) / d`
7. Perpendicular (CCW 90°): `n = (−uy, ux)`
8. Centers: `C₊ = M + h·n`, `C₋ = M − h·n`

### YCI cove worked example

`P1 = (60, 138)`, `P2 = (82, 160)`, `r = 22`

- `M = (71, 149)`
- `d = √(22² + 22²) = 22√2 ≈ 31.11`
- `a ≈ 15.56`
- `h = √(484 − 242) = √242 ≈ 15.56`
- `u ≈ (0.707, 0.707)`
- `n ≈ (−0.707, 0.707)`
- `C₊ = (60, 160)` — inside corner
- `C₋ = (82, 138)` — outside corner

Concave cove → center must be OUTSIDE the corner → `C₋ = (82, 138)`. For `M 60 138 A 22 22 0 0 0 82 160`, sweep-flag 0 picks `C₋`. Verified.

---

## 4. Arc Midpoint From Angle

```
x = cx + r · cos(θ)
y = cy + r · sin(θ)     ← SVG: +sin drops visually because y is flipped
```

`Math.sin`/`Math.cos` are radians, y-up math convention, but plotted into SVG y-down, `+sin θ` moves DOWN. Math "90° = north" visually renders as south in SVG.

### YCI cove arc midpoint

Center `(82, 138)`, `r=22`, endpoints `(60,138)` and `(82,160)`.

atan2 with SVG y-down:
- `θ₁ = atan2(0, −22) = 180°`
- `θ₂ = atan2(22, 0) = 90°`

Midpoint angle: `135°`

```
midX = 82 + 22·cos(135°) ≈ 66.44
midY = 138 + 22·sin(135°) ≈ 153.56
```

The belly of the cove, ~5 units in from both wall and floor.

---

## 5. Tangent Continuity

At any point on a circle, **tangent ⊥ radius**. For a straight line to join an arc without a kink, the line must be tangent to the circle at the join.

### YCI cove
- At `(60, 138)`: radius `(−22, 0)`. Tangent: `(0, ±1)` — vertical. Wall is vertical → no kink at top.
- At `(82, 160)`: radius `(0, +22)`. Tangent: `(±1, 0)` — horizontal. Floor is horizontal → no kink at bottom.

**Rule:** verify line direction matches tangent direction at every arc/line join.

---

## 6. stroke-linecap Interaction — The v1.23.20 Bug

`stroke-linecap="round"` adds a semicircle of radius `stroke-width/2` to each endpoint of every subpath. Two round-capped paths meeting at the same point → two semicircles stack → **full circle of diameter stroke-width**.

### v1.23.20
Border + field pieces both ended at seam `(160, 157)`, both `stroke-width="4"`, both round caps. Two 2-radius semicircles → solid 4-px disc. User saw "stray dot on curve".

**Fix:** `stroke-linecap="butt"` for abutting paths. `round` only for isolated endpoints.

**Spec:** https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap

---

## 7. stroke-dasharray Interaction — The v1.23.19 Bug

If `(dash + gap)` doesn't divide the path length evenly, the final cycle is truncated → stray partial dash = fake dot.

**Option A — compute and divide.** Quarter cove length = `22 · π/2 ≈ 34.56`. Pick cycle 5.76 (dash=2.88, gap=2.88) → 34.56/5.76 = 6.0 exact.

**Option B — normalize:** `<path pathLength="100" stroke-dasharray="5 5" />`. Browser scales dash cycle as if path = 100 units. Work in percentages.

**Spec:** https://www.w3.org/TR/SVG2/paths.html#PathLengthAttribute, https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray

**Rule:** any dashed path → either compute divisor or set `pathLength="100"`.

---

## 8. SVG Path Command Grammar — Full Reference

| Cmd | Name | Args | Notes |
|---|---|---|---|
| `M x y` | moveto | 2 | Start a new subpath |
| `L x y` | lineto | 2 | Line to (x,y) |
| `H x` | horiz | 1 | Horizontal line |
| `V y` | vert | 1 | Vertical line |
| `C x1 y1 x2 y2 x y` | cubic | 6 | Two control points + endpoint |
| `S x2 y2 x y` | smooth cubic | 4 | Reflects previous control point |
| `Q x1 y1 x y` | quadratic | 4 | One control + endpoint |
| `T x y` | smooth quad | 2 | Reflects previous control point |
| `A rx ry rot large sweep x y` | arc | 7 | This whole file |
| `Z` | closepath | 0 | Line back to last `M` |

Lowercase = relative. Spec: https://www.w3.org/TR/SVG2/paths.html

---

## 9. Common Pitfalls — Lookup Table

| # | Pitfall | Symptom | Fix |
|---|---|---|---|
| 1 | Reversed direction, unflipped sweep-flag | Arc convex/mirrored (v1.23.13) | Flip sweep-flag |
| 2 | Wrong `large-arc-flag` | Arc takes long way | 0=short, 1=long |
| 3 | y-axis confusion | Renders upside down | Use atan2 in SVG coords |
| 4 | Wrong center chosen | Curves wrong side of chord | Compute both centers, pick deliberately |
| 5 | `rx ≠ ry` accidentally | Ellipse instead of circle | `rx = ry` for circles |
| 6 | Round cap on abutting paths | Stray dot at seam (v1.23.20) | `butt` for abutting |
| 7 | Dasharray ≠ length divisor | Partial dash at end (v1.23.19) | `pathLength="100"` |
| 8 | Hardcoded endpoints, not derived | Multi-path drift on radius change | Lift to `CV` constants (§10) |
| 9 | Chord > 2r | Arc skipped by renderer | Ensure `|P2−P1| ≤ 2r` |
| 10 | Degrees ↔ radians mix | Angles off by 57.3× | SVG rotation = deg; `Math.sin/cos` = rad |

---

## 10. The CV Constants Pattern — Canonical Bug Prevention

**If a geometry value is referenced more than once, lift it into a named constant.**

```ts
const CV = {
  cornerX: 60, cornerY: 160, r: 22,
  floorRight: 230, capY: 100, inset: 3, seamX: 160
};

const CV_ARC_TOP_X    = CV.cornerX;             // 60
const CV_ARC_TOP_Y    = CV.cornerY - CV.r;      // 138
const CV_ARC_RIGHT_X  = CV.cornerX + CV.r;      // 82
const CV_ARC_RIGHT_Y  = CV.cornerY;             // 160
const CV_SHEET_R      = CV.r - CV.inset;        // 19

const COVE_STICK_D = `M ${CV_ARC_TOP_X} ${CV_ARC_TOP_Y} A ${CV.r} ${CV.r} 0 0 0 ${CV_ARC_RIGHT_X} ${CV_ARC_RIGHT_Y}`;
```

Bump `CV.r` from 22 → 24 once, every derived constant and path updates in lockstep. Without this pattern, three paths hardcode `22` in five places each → miss one → v1.23.13 drift.

**Cross-refs:** `agents/structure.md`, `agents/refactor.md`.

---

## See also
- `vector-math.md` — perpendicular rotation used in §3 center math
- `dimension-callouts.md` — radius callouts use arc geometry from this file
- `chart-display-patterns.md` — when an arc belongs in a chart at all
