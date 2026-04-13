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
| backdrop-filter | Compositor layers linger after removal — fresh elements bypass this |

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

## Brightness Matching
| Element | Badge | Expanded | Match Method |
|---------|-------|----------|-------------|
| Title text | opacity via illuminate CSS | full opacity white | Same effective color |
| SVG icon | color 0.55 × opacity 0.55 | color 0.55 × opacity 0.55 | Identical values |
| Border glow | --illuminate-glow | --illuminate-glow | Same CSS variable |

## Timing
- Duration: 900ms (EXPAND_MS constant)
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- All elements use same duration + easing

## Related Resources
| File | Relevance |
|------|-----------|
| `.claude/agents/motion-expert.md` | General animation patterns, GPU compositing rules |
| `.claude/agents/indexes/motion-expert.index.md` | Motion tokens, easing curves, Safari gotchas |
| `.claude/reference/animation-components.md` | Card pop, glow effects |
