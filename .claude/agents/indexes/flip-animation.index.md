# FLIP Animation Expert — Resource Index

> Last updated: 2026-04-13

## Core Knowledge (embedded in agent)
| Topic | What's Covered |
|-------|---------------|
| FLIP pattern | First/Last/Invert/Play with transform: translate() scale() |
| Endpoint matching | Source and dest must be visually identical at animation boundaries |
| Font-size ratio | `ratio = sourceSize / destSize`, applied as `scale(ratio / scaleX)` |
| Open vs close math | Open: `dx = (target - current) / scale`. Close: `dx = (target - badgeRect) / scale - current` |
| Double rAF | Required for both open AND close to ensure paint before transition |
| Safari box-shadow | Crushed by GPU during `transform: scale()` — use layout animation instead |
| Glow overlay | Separate div animated via top/left/width/height, never transform |
| backdrop-filter | REMOVED from products — breaks during transform: scale() |

## Project Files
| File | Role |
|------|------|
| `src/lib/components/ExpandedProduct.svelte` | All FLIP logic — open $effect, handleClose, glow overlay |
| `src/lib/components/ProductBadge.svelte` | Source rects, texture/text brightness values |
| `src/routes/+page.svelte` | Rect capture in openBadge(), state management |

## Current FLIP Elements
| Element | Source (Badge) | Dest (Expanded) | Size Ratio |
|---------|---------------|-----------------|------------|
| Card container | badge rect | fill grid | scaleX/Y from rect |
| Title (code+name) | bottom-left, 0.9rem/0.5rem | header, 1.26rem/0.7rem | 0.714 |
| SVG icon | center, ~60% badge | header top-left, 44×44px | runtime: badgeSvgW/44 |
| Glow border | illuminate box-shadow | illuminate box-shadow | layout-animated (no scale) |

## Background (LOCKED v0.4.39)
Both badge and expanded use identical background — zero visual pop at FLIP boundaries:
```css
background:
  radial-gradient(ellipse 80% 60% at 25% 15%, rgba(255, 255, 255, 0.04) 0%, transparent 70%),
  radial-gradient(ellipse 50% 50% at 80% 85%, rgba(0, 0, 0, 0.2) 0%, transparent 70%),
  rgba(11, 11, 13, 0.82);
```
- No `backdrop-filter` — removed because it breaks during `transform: scale()`
- 82% opaque dark base for text/SVG legibility, 18% transparent for floor plan show-through
- Radial gradients add depth (highlight top-left, shadow bottom-right)
- All CSS gradients scale perfectly with `transform: scale()` — no rasterization artifacts

## LOCKED — Grow/Shrink Animation (v0.4.93)
The FLIP grow and shrink animations are working perfectly — zero wiggle, confirmed flawless. Do NOT modify the transform logic, timing, easing, title/icon counter-FLIP, glow overlay, or badge illuminate approach. All visual properties snap instantly (no transitions except transform). Dimmed badges use `visibility: hidden`. Illuminate zone rootMargin: `-28% 0px -35% 0px`. Backup at `backup/v0.4.93`.

## Brightness Matching
| Element | Badge | Expanded | Match Method |
|---------|-------|----------|-------------|
| Title text | opacity via illuminate CSS | full opacity white | Same effective color |
| SVG icon | color 0.55 × opacity 0.55 | color 0.55 × opacity 0.55 | Identical values |
| Border glow | --illuminate-glow | --illuminate-glow | Same CSS variable |
| Background | identical gradient | identical gradient | Same CSS declaration |

## Timing
- Duration: 900ms (EXPAND_MS constant)
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- All elements use same duration + easing

## Workarounds / Patterns

### SVG sub-pixel jitter — ROOT CAUSE FIXED (v0.4.86)
**Root cause:** Any CSS property transition (box-shadow, border-color, opacity) on badge elements triggers per-frame repaints, which re-rasterize SVG content at different sub-pixel positions on fractional CSS grid columns.
**Fix:** Make ALL visual properties static — no transitions on glow, border, opacity, or text. Only `transform` transitions (for hover lift). The illuminate glow snaps on/off instantly via class toggle, no animation. Badge illuminated state uses the exact same `box-shadow: var(--glass-shadow), var(--illuminate-glow)` as the expanded card — identical at every point in the FLIP chain.
**Rule:** During any motion (FLIP expand/shrink, stagger return), nothing inside the badge should be transitioning. The badge moves as a frozen static image. Transitions only exist for `transform` (hover). Dimmed badges use `visibility: hidden` (not opacity) to avoid repaint.

### backdrop-filter + transform: scale() = broken blur
**Problem:** `backdrop-filter` gets rasterized at pre-scale size then stretched by GPU. Blur looks wrong during FLIP.
**Solution:** Remove `backdrop-filter` entirely. Replace with opaque-enough CSS gradients that provide legibility without needing blur. CSS gradients are math — they scale perfectly with transforms.

## Modal Content After FLIP (2026-04-13)

After the FLIP expand animation completes, `CarpetTileModal` renders inside `ExpandedProduct.svelte`. The modal content uses `ModalTabs` with 3 tabs (Overview / Install / Care). The FLIP animation is **not affected** by the tab content — it operates on the card container, title group, and SVG icon only. Tab content fades in after animation completes via `tabsVisible` + `contentVisible` states.

Key: the `featureOpen` state in `CarpetTileModal` swaps the Overview tab between text content and full-bleed interactive. This swap is purely inside the tab panel — no FLIP involvement.

## Related Resources
| File | Relevance |
|------|-----------|
| `.claude/agents/motion-expert.md` | General animation patterns, GPU compositing rules |
| `.claude/agents/indexes/motion-expert.index.md` | Motion tokens, easing curves, Safari gotchas |
| `.claude/reference/animation-components.md` | Card pop, glow effects |
