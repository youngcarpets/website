# Force-Directed Graphs — Reference

> Resource file for the **Charts agent** (`.claude/agents/charts.md`).
> Network visualization math, library survey, and the YCI knowledge graph context.

## 2026-04-07 — Phase 2 (charts agent expansion)

The YCI knowledge-graph visualization is parked but a data extractor is being built in parallel — a `yci-knowledge-graph-data.json` file should land soon with nodes for products, install techniques, adhesives, suppliers, standards, and environments. This file is the math + library reference for when we render that data.

**Foundational papers:**
- Eades (1984) — *A Heuristic for Graph Drawing* (the original spring-electrical model)
- Fruchterman & Reingold (1991) — *Graph Drawing by Force-Directed Placement* (the canonical algorithm everybody implements)
- Kamada & Kawai (1989) — *An algorithm for drawing general undirected graphs*

**Library docs:**
- d3-force: https://d3js.org/d3-force
- vasturiano/3d-force-graph: https://github.com/vasturiano/3d-force-graph

---

## 1. The Classical Force-Directed Algorithm

Treat the graph as a physical system:
1. **Every node repels every other node** like electric charges (Coulomb-style).
2. **Every edge acts as a spring** pulling its two endpoints together (Hooke's law).
3. **Optionally, a centering force** pulls everything toward the canvas center to keep the graph from drifting off-screen.
4. **Damping/friction** bleeds energy out of the system so it eventually settles to a steady state.

Iteratively integrate the forces over discrete time steps. After enough steps, the graph reaches a low-energy configuration where related nodes are close together and unrelated nodes are far apart. **The layout is the equilibrium of the simulated physics.**

---

## 2. Repulsion Forces — Coulomb-Style

Between every pair of nodes `i, j`:

```
r_vec = pos[j] − pos[i]
r     = |r_vec|              (distance)
F     = k_r / r²             (magnitude — inverse square)
F_vec = (r_vec / r) · F      (direction: from i toward j)

force[i] -= F_vec            (push i away from j)
force[j] += F_vec            (push j away from i)
```

`k_r` is the repulsion constant — typical values `100`–`1000` for SVG canvases of a few hundred pixels.

**Performance:** this is O(n²) per step. For 100 nodes that's 10,000 pair checks per frame — fine. For 5,000 nodes it's 25 million per frame — broken. The Barnes-Hut approximation (`d3-force`'s `forceManyBody` uses a quadtree) reduces this to O(n log n) by treating distant clusters of nodes as a single point mass. Use it for graphs >200 nodes.

**Damping the singularity:** as `r → 0`, `F → ∞`. Clamp:
```ts
const r = Math.max(distance, MIN_DISTANCE);
```
where `MIN_DISTANCE` is e.g. `1` viewBox unit. Without this, two coincident nodes blow up the simulation.

---

## 3. Attraction Forces Along Edges — Hooke's Law

For every edge `(i, j)` with rest length `r_rest`:

```
r_vec = pos[j] − pos[i]
r     = |r_vec|
F     = k_s · (r − r_rest)   (positive when stretched, negative when compressed)
F_vec = (r_vec / r) · F

force[i] += F_vec            (pull i toward j)
force[j] -= F_vec            (pull j toward i)
```

`k_s` is the spring stiffness — typical `0.05`–`0.2`. `r_rest` is the desired edge length, typically `50`–`100` units in SVG.

**Tuning:** stronger `k_s` = tighter clusters; weaker = more spread. Stronger `k_r` = nodes push apart more; weaker = nodes overlap. The visual quality of a force-directed layout is mostly about getting the ratio of these two right.

---

## 4. Centering and Damping

**Centering force** — gently pull everything toward `(cx, cy)`:
```
center_force[i] = (center − pos[i]) · k_c
```
`k_c` typically `0.01`–`0.05`. Without this, the graph drifts or rotates around its center of mass.

**Damping/friction** — multiply velocity by a damping coefficient each step:
```
vel[i] *= 0.85       // 0.85 is typical; lower = faster settle, less swing
```
Without damping, the system oscillates forever.

---

## 5. Verlet vs Euler Integration

Per-step update of position from force:

**Euler (simple):**
```
acc = force / mass
vel += acc · dt
pos += vel · dt
```

**Verlet (more stable):**
```
new_pos = 2·pos − prev_pos + acc · dt²
prev_pos = pos
pos = new_pos
```

Verlet stores the previous position instead of velocity. Each step uses two positions to imply velocity. Numerically more stable for spring systems — Euler tends to "explode" with stiff springs unless `dt` is tiny.

`d3-force` uses Verlet under the hood.

For the AY3 use case (≤150 nodes, modest stiffness), Euler with damping works fine. Reach for Verlet if you tighten springs aggressively.

---

## 6. Library Survey

| Library | Bundle | Renderer | Verdict |
|---|---|---|---|
| **`d3-force`** | ~25 KB (force module only) | Bring-your-own (SVG/canvas/WebGL) | **First choice for SvelteKit.** Battle-tested, Barnes-Hut, customizable. Bind to Svelte-rendered nodes via store/effect. |
| **`vasturiano/3d-force-graph`** | ~600 KB (Three.js bundled) | WebGL via Three.js | The 3D version. Great for >500 node graphs you want to spin in space. Heavy. There's also a 2D variant (`force-graph`) at ~200 KB if you want canvas-only 2D without Three.js. |
| **`cytoscape.js`** | ~400 KB | Canvas | Full graph-analysis library: layouts, traversal, filters, styling DSL. Overkill for a one-screen viz, perfect for an analyst tool. |
| **`vis-network`** | ~350 KB | Canvas | Easy turnkey, mediocre customization. |
| **Vanilla SVG hand-roll** | 0 KB | SVG | Fine for ≤100 nodes. ~150 lines of TypeScript (see §8). Best when you want full Svelte 5 reactive control. |
| **Sigma.js** | ~150 KB | WebGL | Specifically for large graph rendering. Use when nodes >5,000. |

### Recommendation for AY3
- **YCI knowledge graph (~50–200 nodes):** vanilla SVG + the math in this file, or `d3-force` if we want Barnes-Hut and tested layout quality.
- **Avoid `3d-force-graph`** unless we genuinely want 3D. The 2D `force-graph` variant is the lighter equivalent.
- **Never `cytoscape.js`** unless we're building an analyst workbench, not a viz.

---

## 7. The YCI Knowledge Graph Context

**Tier system** — six node tiers, each colored distinctly:

| Tier | Examples | Color hint |
|---|---|---|
| 1 — Products | Sheet vinyl, sport floor, rubber tile | YCI brand blue |
| 2 — Install techniques | Heat weld, flash cove, perimeter glue, full spread | Cyan |
| 3 — Adhesives | Acrylic, polyurethane, wet-set, dry-set | Green |
| 4 — Suppliers | Tarkett, Forbo, Shaw, Mannington | Amber |
| 5 — Standards | ASTM F970, F1869, F2170, F710 | Gold (matches `dimension-callouts.md` §9 dimension color) |
| 6 — Environments | Healthcare, school, gym, industrial | Magenta |

Edges encode "is compatible with" / "requires" / "tested per" / "specified by". Some edges are bidirectional, others directional — render directed edges with arrowheads.

**Layout considerations:**
- Tier coloring is the primary visual encoding → don't also use color for tier centrality or anything else
- Tooltip on hover must show: node label, tier, count of edges, and a one-sentence description
- Click-to-focus: clicking a node should fade unrelated nodes to ~20% opacity
- Keyboard nav: arrow keys traverse the BFS frontier from focused node

**Performance budget for 200 nodes ~500 edges:**
- SVG with `d3-force` running in `requestAnimationFrame` — ~5 ms per frame, 60 FPS, well within budget
- No need for canvas/WebGL at this scale

---

## 8. Pure-Vanilla 2D SVG Force Sim — ~150 Lines TypeScript

Drop-in implementation, no dependencies. For when we want full Svelte 5 reactive control over the simulation.

```ts
// src/lib/modules/knowledge-graph/force-sim.ts
export type Node = {
  id: string;
  x: number; y: number;
  vx: number; vy: number;
  tier: number;
  label: string;
};
export type Edge = { source: string; target: string };

export type SimConfig = {
  width: number;
  height: number;
  k_repulsion: number;     // typical 800
  k_spring: number;        // typical 0.08
  k_center: number;        // typical 0.02
  spring_rest: number;     // typical 70
  damping: number;         // typical 0.85
  min_distance: number;    // typical 1
};

export class ForceSim {
  nodes: Node[];
  edges: Edge[];
  config: SimConfig;
  private indexById: Map<string, number>;

  constructor(nodes: Node[], edges: Edge[], config: SimConfig) {
    this.nodes = nodes;
    this.edges = edges;
    this.config = config;
    this.indexById = new Map(nodes.map((n, i) => [n.id, i]));
  }

  step(dt = 1) {
    const { width, height, k_repulsion, k_spring, k_center, spring_rest, damping, min_distance } = this.config;
    const N = this.nodes.length;
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);

    // 1. Repulsion (O(n²))
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = this.nodes[j].x - this.nodes[i].x;
        const dy = this.nodes[j].y - this.nodes[i].y;
        const r2 = Math.max(dx*dx + dy*dy, min_distance*min_distance);
        const r = Math.sqrt(r2);
        const F = k_repulsion / r2;
        const ux = dx / r, uy = dy / r;
        fx[i] -= F * ux; fy[i] -= F * uy;
        fx[j] += F * ux; fy[j] += F * uy;
      }
    }

    // 2. Edge springs (Hooke)
    for (const edge of this.edges) {
      const i = this.indexById.get(edge.source)!;
      const j = this.indexById.get(edge.target)!;
      const dx = this.nodes[j].x - this.nodes[i].x;
      const dy = this.nodes[j].y - this.nodes[i].y;
      const r = Math.max(Math.hypot(dx, dy), min_distance);
      const F = k_spring * (r - spring_rest);
      const ux = dx / r, uy = dy / r;
      fx[i] += F * ux; fy[i] += F * uy;
      fx[j] -= F * ux; fy[j] -= F * uy;
    }

    // 3. Centering
    const cx = width / 2, cy = height / 2;
    for (let i = 0; i < N; i++) {
      fx[i] += (cx - this.nodes[i].x) * k_center;
      fy[i] += (cy - this.nodes[i].y) * k_center;
    }

    // 4. Integrate (Euler with damping)
    for (let i = 0; i < N; i++) {
      this.nodes[i].vx = (this.nodes[i].vx + fx[i] * dt) * damping;
      this.nodes[i].vy = (this.nodes[i].vy + fy[i] * dt) * damping;
      this.nodes[i].x += this.nodes[i].vx * dt;
      this.nodes[i].y += this.nodes[i].vy * dt;
    }
  }

  totalEnergy(): number {
    let e = 0;
    for (const n of this.nodes) e += n.vx*n.vx + n.vy*n.vy;
    return e;
  }
}
```

Drive with `requestAnimationFrame` until `totalEnergy()` drops below a threshold, then stop:

```ts
function animate() {
  sim.step();
  // trigger Svelte reactivity by reassigning the array
  nodes = [...sim.nodes];
  if (sim.totalEnergy() > 0.01) requestAnimationFrame(animate);
}
```

---

## 9. Performance Budget

| Node count | Renderer | Notes |
|---|---|---|
| ≤150 | SVG | Vanilla. ~5 ms/frame. Full DOM debugging. |
| 150–500 | SVG with `d3-force` Barnes-Hut | Still SVG-render-cost manageable. |
| 500–5,000 | Canvas 2D | SVG DOM cost dominates; switch to canvas drawing. |
| >5,000 | WebGL (Sigma.js, Three.js) | Canvas redraw becomes the bottleneck. |

For ≤150 nodes, SVG keeps you in DOM-debug land — every node is inspectable, hit-testing is free, accessibility comes along automatically. Don't trade that away unless you have to.

---

## 10. Edge Bundling for Cleaner Display

When many edges share endpoints (a hub node), the visual gets noisy. **Edge bundling** routes geometrically-similar edges along shared paths, like network cables routed through a conduit.

Two main techniques:

**Hierarchical edge bundling (Holten 2006):** treats edges as splines guided by an underlying tree (e.g., the tier hierarchy). Implement with `d3.lineRadial()` or `d3-shape`'s `linkRadial`.

**Force-directed edge bundling (Holten & van Wijk 2009):** treats edges themselves as flexible meshes that attract each other like nodes. Heavier compute, better visual.

For the YCI graph, hierarchical bundling using the 6-tier structure is the right call: edges between Products and Standards cluster together rather than fanning out individually.

**Library:** `d3-shape`'s `linkRadial` for the hierarchical case. No standard JS library for the full force-bundling algorithm — usually reimplemented per-project.

---

## 11. Common Pitfalls — Lookup Table

| # | Pitfall | Symptom | Fix |
|---|---|---|---|
| 1 | No `min_distance` clamp on repulsion | Sim explodes, nodes fly off | Clamp `r ≥ 1` |
| 2 | No damping | Sim oscillates forever | `vel *= 0.85` per step |
| 3 | O(n²) repulsion at >300 nodes | Frame drops | Barnes-Hut quadtree (`d3-force`) |
| 4 | Reactive `$effect` re-runs sim every state change | Sim never stabilizes | Run sim in `onMount`, not `$effect` |
| 5 | Random initial positions all near origin | First few frames look like an explosion | Distribute initial positions across canvas |
| 6 | Color-coding tier AND centrality | Users can't tell which is which | One encoding per visual channel |
| 7 | No "stop after settled" | Battery drain on idle pages | Stop rAF when `totalEnergy < 0.01` |

---

## See also
- `chart-display-patterns.md` §1 — when a force-directed graph is the right choice
- `vector-math.md` — distance, normalization, perpendicular calcs used throughout
- `bezier-curves.md` — for hierarchical edge bundling splines
- `coordinate-systems.md` — for hit-testing nodes from pointer events
