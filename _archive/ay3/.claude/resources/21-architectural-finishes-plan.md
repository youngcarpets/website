# 21 — Architectural Finishes Plan Conventions

Reference for drawing authentic commercial architectural floor finishes plans
in SVG. Intended for decorative backgrounds that should read as real drafting
work to trained eyes (architects, interior designers, flooring contractors).

Companion: `20-dark-glass-pills-glows.md` (the surrounding UI these plans sit
behind in the Young Carpets pattern).

---

## 1. Column grid

Commercial buildings have a structural column grid drawn as thin continuous
lines running the full extents of the building, with labeled circular bubbles
at both ends of every grid line. Conventions:

- **Spacing**: typical office bays are 6.0m (metric) or 20' / 30' (imperial).
  For a decorative drawing at viewBox 1800×1200, use ~300 units per bay.
- **Line weight**: grid lines are thin (0.5–0.8), always thinner than walls.
- **Line style**: continuous. Some offices use long-dash-dot for grid lines;
  both are acceptable.
- **Bubbles**: circles ~30–40 units diameter, stroke 0.8, containing a
  single letter (horizontal grid A, B, C…) or number (vertical grid 1, 2, 3…).
- **Bubble placement**: outside the building envelope, at both ends of each
  grid line, centered on the line axis.
- **Columns themselves**: small filled squares (~16 units) at grid
  intersections, inside the building.

**SVG pattern (fits viewBox 0 0 1800 1200):**

```svg
<g stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.9">
  <!-- Vertical grid lines (cols A-E at x = 340, 640, 940, 1240, 1540) -->
  <line x1="340"  y1="60" x2="340"  y2="1140" />
  <line x1="640"  y1="60" x2="640"  y2="1140" />
  <line x1="940"  y1="60" x2="940"  y2="1140" />
  <line x1="1240" y1="60" x2="1240" y2="1140" />
  <line x1="1540" y1="60" x2="1540" y2="1140" />
  <!-- Horizontal grid lines (rows 1-3 at y = 340, 640, 940) -->
  <line x1="60" y1="340" x2="1740" y2="340" />
  <line x1="60" y1="640" x2="1740" y2="640" />
  <line x1="60" y1="940" x2="1740" y2="940" />
</g>
<g stroke="currentColor" fill="none" stroke-width="0.8"
   font-family="ui-monospace, monospace" font-size="14"
   text-anchor="middle" dominant-baseline="central">
  <!-- Column bubbles top -->
  <circle cx="340" cy="60" r="18" /><text x="340" y="60" stroke="none" fill="currentColor">A</text>
  <circle cx="640" cy="60" r="18" /><text x="640" y="60" stroke="none" fill="currentColor">B</text>
  <circle cx="940" cy="60" r="18" /><text x="940" y="60" stroke="none" fill="currentColor">C</text>
  <circle cx="1240" cy="60" r="18" /><text x="1240" y="60" stroke="none" fill="currentColor">D</text>
  <circle cx="1540" cy="60" r="18" /><text x="1540" y="60" stroke="none" fill="currentColor">E</text>
  <!-- Column bubbles left -->
  <circle cx="60" cy="340" r="18" /><text x="60" y="340" stroke="none" fill="currentColor">1</text>
  <circle cx="60" cy="640" r="18" /><text x="60" y="640" stroke="none" fill="currentColor">2</text>
  <circle cx="60" cy="940" r="18" /><text x="60" y="940" stroke="none" fill="currentColor">3</text>
</g>
```

---

## 2. Finish codes

Standard commercial finish code conventions (North American practice):

| Code | Material | Notes |
|---|---|---|
| CPT-1, CPT-2 | Carpet (broadloom or tile), variants | Number denotes spec variant |
| CT-1 | Ceramic tile | Not to be confused with carpet tile — context matters |
| PT-1 | Porcelain tile | Sometimes preferred over CT to disambiguate |
| LVT-1 | Luxury vinyl tile (plank or tile format) | |
| VCT-1 | Vinyl composition tile | Cheaper institutional product |
| WD-1 | Wood flooring | Engineered or solid |
| RB-1 | Rubber flooring | Gym, healthcare |
| SC-1 / CONC | Sealed concrete | Mechanical, storage |
| EP-1 | Epoxy | Industrial, food service |
| WM-1 | Walk-off mat | Entry matting |

**Placement**: codes appear inside rooms as small boxed callouts, typically
a thin-stroke rectangle with the code text centered inside, placed away from
walls so the hatch pattern is still visible. Sometimes with a leader line
pointing to the finish zone.

**SVG room tag pattern:**

```svg
<g font-family="ui-monospace, monospace" font-size="11" text-anchor="middle">
  <rect x="245" y="210" width="50" height="18" fill="rgba(11,11,13,0.85)"
        stroke="currentColor" stroke-width="0.6" />
  <text x="270" y="222" stroke="none" fill="currentColor">CPT-1</text>
</g>
```

(The dark fill punches through the hatch so the code is legible.)

---

## 3. Dimension strings

**Architectural dimension lines use slash tick marks, NOT arrowheads.**
This is a hard convention — arrowheads are for annotation/leader lines,
ticks are for dimensions.

Conventions:
- **Tick**: a short 45° slash (/) ~8 units long, centered on the dimension line
- **Extension lines**: thin perpendicular lines from the wall out to the dim line,
  with a small gap (~4 units) before touching the wall
- **Text**: above the line, centered, horizontal (not rotated on vertical dims
  in modern practice — rotated text was an old drafting-board convention)
- **Stacking**: overall dimension farthest from the building, intermediate bays
  closer, sub-dimensions (openings) closest — three tiers is standard
- **Units**: millimeters with no unit suffix is North American metric convention
  (e.g. `8400` means 8400mm); imperial uses feet-inches like `27'-6"`

**SVG dim string with proper tick marks:**

```svg
<g stroke="currentColor" fill="none" stroke-width="0.6"
   font-family="ui-monospace, monospace" font-size="12">
  <!-- Extension lines -->
  <line x1="340" y1="120" x2="340" y2="44" />
  <line x1="640" y1="120" x2="640" y2="44" />
  <!-- Dim line -->
  <line x1="340" y1="52" x2="640" y2="52" />
  <!-- Tick marks (45° slashes at each end) -->
  <line x1="336" y1="56" x2="344" y2="48" stroke-width="1" />
  <line x1="636" y1="56" x2="644" y2="48" stroke-width="1" />
  <!-- Dim text above -->
  <text x="490" y="42" text-anchor="middle" stroke="none" fill="currentColor">6000</text>
</g>
```

**Three-tier stack**: place the overall dim at y≈20, intermediate bays at y≈52,
sub-dims (openings) at y≈84. Same pattern on the left side for vertical dims.

---

## 4. Door swings

Door swings are drawn as:
- A thin line perpendicular to the wall opening (the door leaf)
- A quarter-circle arc showing the swing path
- Stroke thinner than walls (~1.0–1.2 vs 2.0 walls)

Single door opening ≈ 900mm (3'); place the arc radius equal to the door width.

```svg
<g stroke="currentColor" fill="none" stroke-width="1">
  <!-- Door in horizontal wall at (500, 300), swinging into upper-left room -->
  <line x1="500" y1="300" x2="500" y2="240" />         <!-- door leaf -->
  <path d="M 500 240 A 60 60 0 0 0 440 300" />          <!-- swing arc -->
</g>
```

---

## 5. Furniture and fixture hints

Optional minimal-line furniture that reads at small scale without cluttering:

```svg
<g stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.8">
  <!-- Meeting table (oval), 8 seats around it -->
  <ellipse cx="800" cy="500" rx="90" ry="40" />
  <!-- Workstation pod (2×2 cluster) -->
  <rect x="400" y="450" width="60" height="40" />
  <rect x="470" y="450" width="60" height="40" />
  <rect x="400" y="500" width="60" height="40" />
  <rect x="470" y="500" width="60" height="40" />
  <!-- Reception desk (L-shape) -->
  <path d="M 200 300 L 320 300 L 320 350 L 250 350 L 250 380 L 200 380 Z" />
  <!-- Washroom fixtures — WC (rectangle) + lav (oval) -->
  <rect x="1320" y="720" width="24" height="36" />
  <ellipse cx="1380" cy="738" rx="14" ry="10" />
  <!-- Kitchen counter (long thin rectangle along wall) -->
  <rect x="1250" y="360" width="200" height="24" />
</g>
```

Keep `stroke-width` and opacity lower than walls so furniture reads as a
secondary layer of information.

---

## 6. Title block

Real drafting title blocks contain, at minimum:
- Project name + address
- Client name
- Sheet title (e.g. "FLOOR FINISH PLAN")
- Sheet number (e.g. "A-101")
- Scale
- Date
- Drawn by / checked by
- Revision number and date
- Issued-for stamp (FOR CONSTRUCTION / FOR TENDER / FOR REVIEW)
- Architect firm logo or name
- Seal area (blank stamp box)
- Key plan (small inset showing this drawing's location in the overall project)

Typical placement: bottom-right corner of the sheet, bordered rectangle
divided into labeled cells.

**Compact SVG title block (540×260 at bottom-right):**

```svg
<g stroke="currentColor" fill="none" stroke-width="0.6"
   font-family="ui-monospace, monospace" fill="currentColor">
  <rect x="1240" y="900" width="540" height="260" />
  <!-- Horizontal dividers -->
  <line x1="1240" y1="940" x2="1780" y2="940" />
  <line x1="1240" y1="990" x2="1780" y2="990" />
  <line x1="1240" y1="1040" x2="1780" y2="1040" />
  <line x1="1240" y1="1090" x2="1780" y2="1090" />
  <line x1="1240" y1="1120" x2="1780" y2="1120" />
  <!-- Vertical divider -->
  <line x1="1510" y1="990" x2="1510" y2="1120" />
  <!-- Header -->
  <text x="1250" y="928" font-size="13" stroke="none" letter-spacing="1">YOUNG CARPETS INC.</text>
  <text x="1770" y="928" font-size="10" stroke="none" text-anchor="end">OTTAWA, ON</text>
  <!-- Project row -->
  <text x="1250" y="968" font-size="9" stroke="none">PROJECT</text>
  <text x="1320" y="968" font-size="10" stroke="none">TYPICAL OFFICE FLOOR — TENANT FIT-UP</text>
  <!-- Sheet title row -->
  <text x="1250" y="1018" font-size="9" stroke="none">SHEET</text>
  <text x="1320" y="1018" font-size="11" stroke="none" letter-spacing="1">FLOOR FINISH PLAN</text>
  <!-- Scale + date -->
  <text x="1250" y="1068" font-size="9" stroke="none">SCALE</text>
  <text x="1320" y="1068" font-size="10" stroke="none">1 : 100</text>
  <text x="1520" y="1068" font-size="9" stroke="none">DATE</text>
  <text x="1590" y="1068" font-size="10" stroke="none">2026.04.06</text>
  <!-- Drawn / Checked / Rev -->
  <text x="1250" y="1108" font-size="9" stroke="none">DRAWN</text>
  <text x="1320" y="1108" font-size="10" stroke="none">YCI</text>
  <text x="1400" y="1108" font-size="9" stroke="none">CHK</text>
  <text x="1440" y="1108" font-size="10" stroke="none">AY</text>
  <text x="1520" y="1108" font-size="9" stroke="none">REV</text>
  <text x="1570" y="1108" font-size="10" stroke="none">03</text>
  <!-- Sheet number (large) -->
  <text x="1510" y="1150" font-size="24" stroke="none" letter-spacing="2">A - 1 0 1</text>
  <!-- Issued-for stamp -->
  <rect x="1250" y="1132" width="240" height="22" />
  <text x="1370" y="1148" font-size="11" stroke="none" text-anchor="middle" letter-spacing="2">ISSUED FOR CONSTRUCTION</text>
</g>
```

---

## 7. North arrow

Several conventions are acceptable. In order of prevalence:

1. **Circle with triangular pointer and "N" label** (most common in commercial work)
2. **Simple arrow with "N"** (minimalist modern style)
3. **Compass rose with N/S/E/W** (formal, site plans)
4. **Octagonal badge with internal arrow** (corporate drafting standards)

The first is already standard and authentic — no change needed. If going
minimalist, use:

```svg
<g stroke="currentColor" fill="currentColor" stroke-width="1">
  <path d="M 1700 120 L 1694 150 L 1700 144 L 1706 150 Z" />
  <text x="1700" y="110" text-anchor="middle" font-size="12"
        font-family="ui-monospace, monospace" stroke="none">N</text>
</g>
```

---

## 8. Hatching pattern summary

Standard finish hatching conventions for SVG `<pattern>` elements:

| Finish | Pattern | SVG approach |
|---|---|---|
| Carpet (CPT) | Tight diagonal lines | `patternTransform="rotate(45)"`, 8–10 unit spacing |
| Carpet tile variant | Opposite diagonal or grid | `rotate(-45)` or orthogonal grid lines |
| LVT / wood plank | Staggered plank brick | Offset rectangle rows, 40×20 units |
| Ceramic tile | Dot grid or square grid | `<circle>` grid or square outlines |
| VCT | Small square grid | 12×12 orthogonal lines |
| Sealed concrete | Sparse random stipple | Scattered small circles in pattern cell |
| Epoxy | Solid tone or very subtle speckle | Near-solid fill |
| Rubber | Subtle dot grid with studs | Larger dots than CT |

---

## Source

Young Carpets Inc. commercial flooring website, 2026-04-06.
Compiled from general North American architectural drafting practice for
commercial tenant fit-out drawings.
