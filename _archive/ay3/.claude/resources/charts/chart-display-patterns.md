# Chart Display Patterns — Reference

> Resource file for the **Charts agent**. When and how to display data visually in AY3 app UI.

## 2026-04-07 — Phase 1 (initial population by Charts agent)

The AY3 portal will eventually show financial data, job-status flows, product inventory, and engineering diagrams. This file tells the next agent *which* visualization fits *which* data shape, and which library to reach for (considering bundle cost and Svelte-compat).

---

## 1. Chart Type → Data Shape Decision Tree

**Step 1: what's the data shape?**

| Shape | Use |
|---|---|
| Single value over time | Line, area, sparkline |
| Multiple series over time | Multi-line, stacked area |
| Single categorical distribution | Bar (ordered) or pie (2–5 slices only) |
| Two numeric dimensions | Scatter |
| Categorical × numeric (many categories) | Horizontal bar, lollipop |
| Two categorical dimensions → numeric | Heatmap |
| Flow between stages | Sankey, funnel |
| Hierarchy | Treemap, sunburst, icicle |
| Network of relationships | Force-directed graph, adjacency matrix |
| Geographic | Choropleth, symbol map |
| Multivariate comparison | Radar (≤6 axes), parallel coords |
| Single bounded metric | Gauge, progress ring |
| Engineering cross-section | Annotated SVG (the YCI cove pattern) |

**Step 2: watch for anti-patterns.**
- Pie charts with >5 slices → use bar instead
- 3D anything → use 2D (3D distorts perception)
- Dual y-axes → usually deceptive; use two stacked charts
- Truncated y-axis on bar charts → deceptive; always start at zero for bars
- Color as the only encoding → fails for colorblind users and grayscale; always pair with position/shape

**Source:** Edward Tufte — *The Visual Display of Quantitative Information*; Colin Ware — *Information Visualization: Perception for Design*.

---

## 2. Library Trade-offs

Approximate gzipped bundle sizes (as of 2026; verify with bundlephobia before picking):

| Library | ~Size | Verdict for AY3 |
|---|---|---|
| **Vanilla SVG** | 0 KB | Best for bespoke one-offs (YCI cove, dimension callouts, annotated diagrams). Zero runtime cost. Hand-compute geometry using `svg-arc-math.md` + `vector-math.md`. |
| **LayerChart** | ~30 KB | Svelte-native, composable, built on Layer Cake. **First choice for SvelteKit projects** that need real charts but don't want D3's complexity. Works with runes. |
| **D3** (modular) | ~40–80 KB (scale/selection/axis only) | Gold standard for custom charts. Import selectively (`d3-scale`, `d3-shape`, `d3-axis`) — never the full `d3` meta-package. Use with Svelte via `{@html}` or by binding D3 selections to svelte-rendered DOM. |
| **Chart.js** | ~60 KB | Easy turnkey canvas-based charts. Not Svelte-native but works via wrapper. Weak customization. |
| **Apache ECharts** | ~400 KB | Most powerful / most features (including WebGL 3D, maps, sankey, graph). Heavy. Use only if multiple complex visualizations ship together. |
| **Visx** | ~100 KB | React-only. **Inapplicable to Svelte** — do not use. |
| **Recharts** | ~100 KB | React-only. Inapplicable. |
| **Carbon Charts** | ~200 KB | IBM's D3 wrapper. Opinionated styling (Carbon DS) — fights Apple Liquid Glass. Skip. |
| **uPlot** | ~40 KB | Canvas-based, extremely fast for large time-series (millions of points). Ugly default styling. Use when performance dominates. |

### Recommendation for AY3
- **Bespoke diagrams** (cove animations, engineering cross-sections, dimension callouts): vanilla SVG + the math in this resources folder. 0 KB.
- **Financial dashboards, KPI tiles, trend charts:** LayerChart first, D3 modular second.
- **If a customer job needs a million-point time series** (unlikely): uPlot on canvas.
- **Never:** Chart.js (underpowered for our aesthetic), ECharts (too heavy), anything React-only.

---

## 3. Performance Budget

| Technique | Approx max elements before frame drops |
|---|---|
| SVG elements animated via CSS | ~500 |
| SVG elements animated via JS (requestAnimationFrame) | ~200 |
| Canvas 2D with manual redraw | ~10,000 |
| WebGL (Three.js, OGL, PixiJS) | ~1,000,000 |

**Rules of thumb:**
- <200 visible shapes → SVG is fine and keeps DOM/debug/a11y for free
- 200–5,000 → Canvas 2D
- >5,000 → WebGL
- Animating ≠ drawing — 50 SVG shapes all animating simultaneously via `requestAnimationFrame` on every frame can drop below 60 FPS; prefer CSS transforms for static layouts with motion

**Svelte 5 caveat:** `$effect` re-runs on dep changes. If your chart re-runs d3 layout inside an effect that depends on something that changes every frame, you're recomputing layout 60 times per second. Guard with memo patterns or move the layout to `onMount` and manually mutate via bindings.

---

## 4. Accessibility

- Add `role="img"` and `aria-label="<short description>"` to the outer `<svg>`.
- For complex charts, use `<title>` and `<desc>` as the first two children of the `<svg>`.
- Provide an **equivalent tabular fallback** (visually hidden `<table>` with the raw data) so screenreaders get the numbers, not a picture.
- Never rely on color alone — pair color encoding with position, shape, or pattern.
- Minimum contrast for chart text: 4.5:1 (WCAG 2.2 AA).
- Interactive charts: every data point should be keyboard-focusable with a visible focus ring.

**Spec:** [WAI-ARIA Graphics Module](https://www.w3.org/TR/graphics-aria-1.0/), WCAG 2.2 §1.4.11 (non-text contrast).

---

## 5. Animation Patterns

- **Draw-on** (path reveals stroke-first): animate `stroke-dashoffset` from `pathLength` to 0. Watch the dash-fit bug from `svg-arc-math.md` §7.
- **Morph** (shape A → shape B): use `flubber` (~15 KB) to interpolate `d` attributes, or hand-write if both paths have the same command sequence.
- **Transition between datasets:** enter/update/exit pattern from D3; in Svelte use `{#each list as item (item.id)}` with `animate:` directives for smooth key-swaps.
- **Annotation reveal** (YCI pattern): sequential steps with named states; drive via `$state` step index, each layer's `opacity`/`transform` tied to `step >= n`.

---

## 6. Mobile Considerations

- **iPhone 13 portrait = 390 CSS px wide** — the baseline (project rule from `feedback_design_agents.md`). Design for this width first.
- Touch targets ≥44×44 CSS px for any interactive chart element (Apple HIG).
- Avoid pinch-zoom conflicts: if the chart uses pinch to zoom, disable page pinch on the chart container.
- Use `viewBox` + `width="100%"` so the chart scales with its container.
- Test the aspect ratio at both 390px (phone portrait) and 1280px (laptop) — charts that look great wide often look terrible narrow and vice versa.

---

## 7. The Interactive Engineering Diagram Pattern

What the YCI flash-cove animation is: an annotated SVG cross-section with sequential reveal steps (wall → cove → sheet vinyl → heat weld → finished).

**When this pattern is right:**
- Explaining a physical product or process to non-experts
- The geometry is meaningful (not arbitrary); the viewer benefits from seeing the actual shape
- There are ≤ 10 reveal steps; more and users zone out
- The diagram is the hero, not a side-decoration
- It's a marketing or educational page, not a dashboard

**When it's wrong:**
- For dense quantitative data (use a chart)
- For interactive exploration (users want to manipulate, not watch)
- For performance-critical dashboards (animations steal paint budget from other content)

**Implementation principles:**
1. Lift geometry into named constants (the `CV` pattern in `svg-arc-math.md` §10).
2. One `$state` step counter drives every layer's visibility and transform.
3. Use `prefers-reduced-motion` to skip animation and jump to the final state.
4. Provide a "reset" control to replay.
5. Annotations (dimension callouts, labels, arrows) live in their own SVG group with their own reveal timing.

---

## See also
- `svg-arc-math.md` — hand-rolling SVG paths for bespoke diagrams
- `vector-math.md` — arrow polygons, transforms, coord conversions
- `dimension-callouts.md` — engineering-drawing annotations for diagrams
- `agents/design.md` — visual aesthetic decisions
- `agents/performance.md` — bundle cost enforcement
