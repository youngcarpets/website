# Product Library — Future Site Content TODOs

> 9 audit files, 208 missing-content items total, status: **planning (NOT YET ON SITE)**.
> Each file is a structured audit of (a) what's currently on the marketing site, (b) what's missing, prioritized.
> Source data lives in `.claude/resources/products/*.md`. Audit date: 2026-04-07.

## Files

| File | Items | Sources | Covers |
|---|---:|---|---|
| [carpet.md](carpet.md) | 21 | `resources/products/carpet.md` | broadloom |
| [carpet-tile.md](carpet-tile.md) | 23 | `resources/products/carpet-tile.md` | modular carpet tile |
| [ceramic.md](ceramic.md) | 25 | `resources/products/ceramic.md` | ceramic + porcelain |
| [hardwood.md](hardwood.md) | 27 | `resources/products/hardwood.md` | engineered + solid |
| [lvt-vct-sct.md](lvt-vct-sct.md) | 13 | `resources/products/lvt-vct-sct.md` | LVT, VCT, SCT, LVP |
| [matting.md](matting.md) | 22 | `resources/products/matting.md` | entrance matting systems |
| [rubber.md](rubber.md) | 23 | `resources/products/rubber.md` | rubber sheet + tile |
| [sheet-vinyl.md](sheet-vinyl.md) | 16 | `resources/products/sheet-vinyl.md` | homogeneous + heterogeneous |
| [specialty-other.md](specialty-other.md) | 38 | `resources/products/specialty.md`, `sdt.md` | epoxy, raised access, stair treads, wall base, ESD |

## Common cross-cutting gaps

These appear in 5+ of the 9 audits:
- **Supplier brand tables** — site has logo marquee but no per-product supplier-to-product mapping
- **Install standards citations** (CRI 104, ASTM C627, ANSI A108, etc.) — credibility anchors missing
- **Moisture testing protocols** (ASTM F2170, F1869) — biggest callback risk in trade
- **Ottawa-specific context paragraphs** — PSPC/GC Workplace, Carleton/uOttawa, NAC/Shaw Centre
- **Maintenance protocols** — none of the 9 product cards have a maintenance section

## How to action

These are planning docs, not active work. When the user wants to advance a product card from one-liner blurb → real spec content, pick the product file, work top-down through the high-priority items, source from `.claude/resources/products/<name>.md`, ship card by card.

**Per-file scope is intentional** — each card can ship independently without touching the others. Don't try to do all 9 in one pass.

## Pending user decisions blocking depth

Per RELAY.md and memory:
- Epoxy depth (specialty-other.md depends on this)
- Altro dealer status (sheet-vinyl.md depends on this)
- Products section redesign — bigger Q: do we keep the 9-card grid + modal pattern, or move to dedicated routes?
