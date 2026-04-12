# YCI Product Library — Index

> **Read this first** when looking up any flooring product fact for YCI.
> Owned by `.claude/agents/flooring-expert.md`. Updated by sub-agents on every research pass.
>
> **Phase 1 status (2026-04-07):** stubs created, not yet populated. `last-verified` dates are placeholders. Run "research products" to dispatch sub-agents.

## Quick lookup

| Slug | Name | Category | Sub-products | Last verified |
|---|---|---|---|---|
| [carpet](carpet.md) | Carpet (broadloom) | broadloom | direct glue, double-stick, stretch-in | (stub) |
| [carpet-tile](carpet-tile.md) | Carpet Tile | tile | full-spread, tackified, peel-and-stick, loose-lay | (stub) |
| [lvt-vct-sct](lvt-vct-sct.md) | LVT / VCT / SCT | resilient | LVT, VCT, SCT (3 sub-products in one card) | (stub) |
| [hardwood](hardwood.md) | Hardwood | hardwood | solid, engineered, parquet | (stub) |
| [rubber](rubber.md) | Rubber | elastomer | fitness, healthcare, industrial | (stub) |
| [ceramic](ceramic.md) | Ceramic / Porcelain | hard-surface | thinset, mortar bed, large-format, Schluter | (stub) |
| [sheet-vinyl](sheet-vinyl.md) | Sheet Vinyl | resilient | heat-welded, flash-coved, glue-down | (stub) |
| [sdt](sdt.md) | Static-Dissipative Flooring | specialty | conductive vs dissipative, vinyl tile, sheet, rubber, carpet tile, epoxy, raised-access combo | 2026-04-07 |
| [resinous](resinous.md) | Resinous Flooring (Epoxy / PU / PurCem / MMA) | specialty | epoxy seal/SL/broadcast/mortar, PU top, PurCem, MMA fast-cure, ESD adder | 2026-04-07 |
| [specialty](specialty.md) | Specialty (More…) | specialty | epoxy, raised access, treads, base, matting, ESD | (stub) |

## Drill-down navigation hierarchy

**Product → Type → Technique → Pattern → Environment**

This is the canonical hierarchy the YCI marketing site modal interactions reflect. The "drill-down flow" the user mentioned in the original product research request maps to navigating through these levels via the product file cross-references.

Example walk:
- **Carpet Tile** (product, top-level card on the marketing site)
  - **Modular tile** (type — same product, different format)
    - **Tackified release adhesive** (install technique)
      - **Quarter-turn** (install pattern)
        - **Open-plan office workstation pods** (environment / use case)

Every leaf has its own facts in the product file (substrate prep, supplier brands, MSDS link, etc.).

## Cross-cutting indexes

### By environment

| Environment | Products |
|---|---|
| Hospital OR / ICU / isolation | sheet-vinyl, rubber (healthcare) |
| School corridor / classroom | carpet-tile, vct (lvt-vct-sct), lvt (lvt-vct-sct) |
| Commercial kitchen / food prep | sheet-vinyl, ceramic (R11+) |
| Gym / fitness centre | rubber (fitness) |
| Office workstation | carpet-tile, lvt, broadloom |
| Showroom / executive office | hardwood, broadloom |
| Lobby / entrance | ceramic, entrance matting (specialty) |
| Lab / clean room | sheet-vinyl, sct (lvt-vct-sct), specialty (ESD) |
| Stair tower | specialty (treads + nosings) |
| Mech room / industrial | rubber (industrial), specialty (epoxy) |

### By supplier (top brands across products)

| Supplier | Products | Confirmed at YCI? |
|---|---|---|
| Tarkett | carpet, carpet-tile, lvt-vct-sct, sheet-vinyl, rubber, specialty | YES (confirmed in suppliers[]) |
| Forbo | sheet-vinyl, lvt-vct-sct, rubber, specialty | YES |
| Mohawk Group | carpet, carpet-tile, lvt-vct-sct | YES |
| Shaw Contract | carpet, carpet-tile, lvt-vct-sct, hardwood | YES |
| Interface | carpet-tile, carpet | YES |
| Patcraft | carpet-tile | YES |
| Beaulieu Canada | carpet, carpet-tile | YES |
| Armstrong Flooring | lvt-vct-sct, sheet-vinyl | YES |
| COREtec | lvt-vct-sct | YES |
| Gerflor | sheet-vinyl, specialty | YES |
| Johnsonite | rubber, specialty (treads, base) | YES |
| Nora | rubber (healthcare) | YES |
| ViFloor | (verify which products) | YES |
| Fuzion Flooring | hardwood | YES |
| Centura | ceramic | YES |
| Euro Tile & Stone | ceramic | YES |
| Olympia Tile | ceramic | YES |
| Ceratec | ceramic | YES |
| Cérag­rès | ceramic | YES |
| Mannington | carpet-tile, lvt-vct-sct, sheet-vinyl | (verify) |
| Karndean | lvt-vct-sct | (verify) |
| Mondo | rubber (sports) | (verify) |
| Ecore | rubber | (verify) |
| Mirage / Lauzon / Preverco / Mercier | hardwood | (verify — Quebec brands, likely yes) |

### By standard

| Standard | Body | Products that cite it |
|---|---|---|
| TTMAC (Terrazzo Tile and Marble Association of Canada) | TTMAC | ceramic |
| ASTM F1869 (calcium chloride moisture test) | ASTM | all resilient (lvt, vct, sct, sheet-vinyl, rubber) |
| ASTM F2170 (in-situ relative humidity probe) | ASTM | all resilient |
| ANSI/ESD S20.20 | ANSI / ESD Association | specialty (ESD) |
| CFI (Certified Flooring Installer) | CFI / FCICA | all (installer credential) |
| NWFA (National Wood Flooring Association) | NWFA | hardwood |
| German DIN 51130 (R-rating slip) | DIN | ceramic |
| ASTM C1028 (slip coefficient) | ASTM | ceramic |
| FloorScore VOC | SCS | resilient + carpet |
| GREENGUARD | UL | resilient + carpet |
| CDPH 01350 (California 01350) | CDPH | resilient + carpet |

## Schema for product files

Every file in this directory follows the schema defined in `.claude/agents/indexes/flooring-expert.index.md` `## The product file schema` section. Sub-agents must conform to it.

## How to use this library

**Lookup:**
```
Q: "What's the install technique for sheet vinyl in a hospital OR?"
1. Read this INDEX → see sheet-vinyl + healthcare row
2. Open sheet-vinyl.md → ## Install techniques + ## Best used for
3. Cite the section
```

**Research:**
```
Q: "Research carpet tile install patterns more deeply"
1. Flooring Expert agent reads INDEX → confirms carpet-tile.md exists
2. Dispatches a sub-agent scoped to carpet-tile.md ## Install patterns
3. Sub-agent does web research, returns inline findings
4. Flooring Expert compiles into the file, bumps last-verified
```

**Cross-reference:**
```
Q: "What products work in a commercial kitchen?"
1. Read this INDEX → cross-cutting "By environment" → kitchen row
2. Open each linked product file → ## Best used for section
3. Compile a comparison
```
