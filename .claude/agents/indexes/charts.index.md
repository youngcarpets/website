# Charts Agent — Index

> Ported from ay3 (2026-04-12). `my-portal/` paths reference archive examples at `_archive/ay3/`.
> **Agent**: `.claude/agents/charts.md`
> **Resource directory**: `.claude/resources/charts/`
> **Created**: 2026-04-07 after the v1.23.13 → v1.23.20 sweep-flag debugging cycle

## Quick Reference

| Topic | File | Status |
|---|---|---|
| SVG arc math (sweep flags, midpoints, parametrization) | `resources/charts/svg-arc-math.md` | Phase 1 — initial population |
| Vector math (perpendiculars, basis transforms, projections) | `resources/charts/vector-math.md` | Phase 1 |
| Chart display patterns for apps (when to use which chart, library trade-offs) | `resources/charts/chart-display-patterns.md` | Phase 1 |
| Dimension callouts (engineering-drawing conventions) | `resources/charts/dimension-callouts.md` | Phase 1 |
| Force-directed graphs / network visualization (for the parked YCI knowledge graph idea) | `resources/charts/force-directed-graphs.md` | Future |
| Animation along paths (stroke-dashoffset, motion-path, morph) | `resources/charts/path-animation.md` | Future |

## The "Lift Math Into Constants" Pattern

The single biggest bug-prevention pattern this agent enforces:

**If a piece of geometry is referenced more than once, it must live in named constants.** The YCI cove geometry is the canonical example:

```ts
const CV = {
  cornerX: 60,        // inside corner where wall meets floor
  cornerY: 160,
  r: 22,              // cove radius (~7/8" at the SVG's working scale)
  floorRight: 230,
  capY: 100,
  inset: 3,           // gap between sheet line and substrate
  seamX: 160          // heat-weld seam location
};

const CV_ARC_TOP_X    = CV.cornerX;             // 60
const CV_ARC_TOP_Y    = CV.cornerY - CV.r;      // 138
const CV_ARC_RIGHT_X  = CV.cornerX + CV.r;      // 82
const CV_ARC_RIGHT_Y  = CV.cornerY;             // 160
const CV_SHEET_R      = CV.r - CV.inset;        // 19
// ... etc.

const COVE_STICK_D = `M ${CV_ARC_TOP_X} ${CV_ARC_TOP_Y} L ${CV.cornerX} ${CV.cornerY} ...`;
const BORDER_PIECE_D = `M ${CV_SHEET_WALL_X} ${CV.capY} ...`;
const FIELD_PIECE_D = `M ${CV.floorRight} ${CV_SHEET_FLOOR_Y} ...`;
```

**Touch `CV.r` once, every path that depends on the radius updates.** This is the only way to keep multi-path geometry self-consistent over a series of refactors.

Where it's used: `my-portal/src/routes/young-carpets/+page.svelte` lines ~395–445 (cove geometry), `matDots[]` array for the matting animation (similar pattern with `dropDelay()` synced to `SHOE_SPEED`).

## Known SVG Arc Gotchas

(These will be expanded in `svg-arc-math.md` once Phase 1 research lands.)

1. **Reversing a path direction requires flipping the sweep-flag.** This is the bug that ate v1.23.13 → v1.23.14. Same physical curve, different direction = different sweep-flag value.

2. **Round line caps create circles at endpoints.** If two paths meet at the same point and both have `stroke-linecap="round"`, the overlapping caps create a visible dot at the meeting point. Use `butt` caps when paths are designed to meet seamlessly. (v1.23.20)

3. **Stroke-dasharray doesn't naturally fit any line length.** If your dasharray cycle (dash + gap) doesn't divide evenly into the line length, you'll get a stray partial dash at the end that renders as a small dot. Either pick dasharray values that divide evenly OR use `pathLength` to normalize. (v1.23.19)

4. **SVG y-axis is flipped.** Math angle `135°` (math = upper-left) corresponds to SVG-coord `(positive, negative)` which is visually upper-right. Always derive arc midpoints from the SVG-coord version of the equation, not the textbook one.

5. **`var(--undefined-token)` in SVG `fill` falls back to BLACK silently.** Caught by `npm run check:tokens` after v1.23.9. The matting foot was rendering as black on near-black for several minutes before the user noticed.

## Cross-references

- `agents/design.md` — visual layer for any chart Charts derives the math for
- `agents/structure.md` — where to put math constants in the codebase
- `agents/performance.md` — bundle cost decisions for chart libraries
- `resources/products/sheet-vinyl-coving.md` — uses cove geometry derived by this agent

## Planned Future Resource Files

When the user runs into a math hurdle that doesn't fit any existing file in `.claude/resources/charts/`, create a new one. The directory is intentionally append-only and broad — file count is not a concern, the user has explicitly said *"i don't mind if some agents are almost never used. we can deal with cleaning that up if everything gets too big."*

Candidate future files:
- `bezier-curves.md` — quadratic + cubic Bezier control point math
- `path-animation.md` — stroke-dashoffset, motion-path, morphSVG
- `force-directed-graphs.md` — for the parked YCI knowledge graph
- `coordinate-systems.md` — viewBox vs viewport vs pixel ratio handling
- `clipping-and-masks.md` — clipPath vs mask, when each
- `gradient-math.md` — radial gradient stops, conic, mesh
