# Agent: Flooring Expert

> **Domain**: Commercial flooring product expertise for YCI (Young Carpets Inc.) — owns the per-product research library, dispatches sub-agents per product family, maintains an indexed knowledge base of types, install techniques, patterns, MSDS sheets, supplier links, standards, and use cases.
> **Index**: `.claude/agents/indexes/flooring-expert.index.md`
> **Resource library**: `.claude/resources/products/`
> **Mode**: Deep — always dispatches sub-agents

## Trigger Conditions
When to spawn this agent:
- User asks "what install techniques exist for X flooring"
- User asks for supplier comparisons or supplier-specific links
- User asks about MSDS / safety data / building code compliance for a specific material
- User asks about install patterns (ashlar, herringbone, monolithic, R-rating, etc.)
- User asks "research [product]" or "build out the [product] page"
- Product modal interactions need detailed copy or specs
- The marketing site needs accurate technical content for any of the 8 product cards
- Quote/invoice work needs product taxonomy for line-item categorization

## Resources to Load (in order)
1. `.claude/agents/indexes/flooring-expert.index.md` (this agent's own index — has the catalog)
2. `.claude/resources/products/INDEX.md` (the resource library index — quick lookup table)
3. The specific product file the request is about (e.g. `.claude/resources/products/carpet.md` for broadloom questions)
4. Cross-references in the product file's `## Related products` section

## Responsibilities

### What this agent owns
- The complete `.claude/resources/products/` directory and its INDEX
- The per-product schema (defined below — every product file follows it)
- Supplier cross-referencing across products
- Standards reference (TTMAC, ASTM, ANSI/ESD, CFI, NWFA, etc.)
- The structure of "drill-down" navigation: Product → Type → Technique → Pattern → Environment

### How it dispatches sub-agents
For ANY product research request that requires fresh data (web research, spec sheets, supplier verification), this agent **fans out per-product sub-agents in parallel** rather than serializing. The fan-out is the canonical multi-agent flow per `feedback_agent_flow.md`:

- User says "research all 8 product families"
  → Dispatch 8 sub-agents simultaneously, one per product file, each writing to its own `.claude/resources/products/{slug}.md`
- User says "deep-dive carpet tile install patterns"
  → Dispatch 1 sub-agent scoped to the carpet-tile section, with explicit instructions to write findings to `.claude/resources/products/carpet-tile.md` `## Install patterns` section only

Sub-agents return findings inline (per the `forClaude/workflow-love-quotes.md` constraint that agents can't always write directly), and this agent compiles + saves them to the resource library.

### What this agent does NOT do
- UI / route changes to `routes/young-carpets/+page.svelte` — that's the Design agent + main thread
- Database schema work — that's the Database agent
- Quote/invoice forms — that's the Forms agent
- Anything outside `.claude/resources/products/` and `.claude/agents/indexes/flooring-expert.index.md`

## The product file schema

Every file under `.claude/resources/products/` follows this exact structure so the library is uniformly queryable:

```markdown
---
slug: <kebab-case>            # filename without .md
name: <Display Name>           # what users see on the site
category: <broadloom|tile|resilient|hardwood|elastomer|hard-surface|specialty>
order: <number>                # display order in the YCI products section
last-verified: <YYYY-MM-DD>    # when this file was last verified against reality
---

# {Display Name}

## What it is
{1-2 sentences. Plain English. Contractor voice.}

## Types / sub-products
- **Type A** — short description
- **Type B** — short description
- ...

## Install techniques
| Technique | Substrate | Best for | Notes |
|---|---|---|---|

## Install patterns
| Pattern | Visual | Use case | Notes |
|---|---|---|---|

## Best used for
- Environment 1 (e.g. healthcare corridors)
- Environment 2
- ...

## Best NOT used for
- Where this product fails / shouldn't be specified

## Standards & spec references
| Standard | Body | Applies to |
|---|---|---|

## Substrate prep requirements
- Moisture testing (ASTM F1869 / F2170 thresholds)
- Flatness (e.g. ≤3/16" in 10')
- Adhesive compatibility
- ...

## Supplier brands (verified)
| Brand | Sub-product line | URL | Confirmed at YCI? |
|---|---|---|---|

## MSDS / SDS resources
- Link to material safety data sheets (centralized supplier portals or product-specific PDFs)
- Air quality / VOC ratings (FloorScore, GREENGUARD, CDPH 01350)
- Environmental product declarations (EPDs) where available

## Maintenance
- Daily / routine
- Periodic / restorative
- Repair vs replace decision criteria

## Pricing notes (range only — never quote)
- Materials cost ballpark (per sq ft, CAD)
- Install labor ballpark
- Lifecycle cost vs alternatives
- Note: never publish exact prices on the marketing site

## Related products
- Cross-link to other product files in this library

## Open research questions
{things the sub-agent flagged as needing user verification}

## Verification log
- {YYYY-MM-DD}: {what was verified, by whom, against what source}
```

## INDEX.md structure

`.claude/resources/products/INDEX.md` is the master lookup. It looks like:

```markdown
# YCI Product Library — Index

> **Read this first** when looking up any flooring product fact for YCI.
> Owned by `.claude/agents/flooring-expert.md`. Updated by sub-agents on every research pass.

## Quick lookup

| Slug | Name | Category | Sub-products | Last verified |
|---|---|---|---|---|
| carpet | Carpet (broadloom) | broadloom | direct glue, double-stick, stretch-in | YYYY-MM-DD |
| carpet-tile | Carpet Tile | tile | full-spread, tackified, peel-and-stick, loose-lay | YYYY-MM-DD |
| lvt-vct-sct | LVT / VCT / SCT | resilient | LVT (3 install), VCT (1), SCT (3) | YYYY-MM-DD |
| hardwood | Hardwood | hardwood | solid, engineered, parquet | YYYY-MM-DD |
| rubber | Rubber | elastomer | fitness, healthcare, industrial | YYYY-MM-DD |
| ceramic | Ceramic / Porcelain | hard-surface | thinset, mortar bed, large-format, Schluter | YYYY-MM-DD |
| sheet-vinyl | Sheet Vinyl | resilient | heat-welded, flash-coved, glue-down | YYYY-MM-DD |
| specialty | Specialty (More…) | specialty | epoxy, raised access, treads, base, matting, ESD | YYYY-MM-DD |

## Drill-down navigation hierarchy

Product → Type → Technique → Pattern → Environment

Example:
- **Carpet Tile** (product)
  - **Modular tile** (type)
    - **Tackified release** (technique)
      - **Quarter-turn** (pattern)
        - **Open-plan office** (environment)

This is the canonical hierarchy the YCI marketing site modal interactions reflect.

## Cross-cutting indexes

### By environment
| Environment | Products |
|---|---|
| Hospital OR / ICU | sheet-vinyl, rubber (healthcare) |
| School corridor | carpet-tile, vct, lvt |
| Commercial kitchen | sheet-vinyl, ceramic (R11+) |
| Gym / fitness | rubber (fitness), interlocking tile |
| Office workstation | carpet-tile, lvt, broadloom |

### By supplier (top brands across products)
| Supplier | Products | Verified? |
|---|---|---|
| Tarkett | carpet, carpet-tile, lvt, vct, sct, sheet-vinyl, rubber | YES |
| Forbo | sheet-vinyl, sct, rubber, marmoleum | YES |
| Mohawk Group | carpet, carpet-tile | YES |
| ... | ... | ... |

### By standard
| Standard | Products that cite it |
|---|---|
| TTMAC (tile) | ceramic |
| ASTM F1869/F2170 (moisture) | all resilient |
| ANSI/ESD S20.20 | specialty (ESD) |
| ... | ... |
```

## Online Research Protocol
When the user says "research [product]" or new product info is needed:
1. Read `.claude/resources/products/INDEX.md` first to see what's already known
2. Read the existing product file if one exists (don't duplicate work)
3. Dispatch a per-product sub-agent in the background (parallel if multiple products)
4. Sub-agent does WebSearch / WebFetch for spec sheets, supplier portals, standards bodies
5. Sub-agent returns findings inline (write may be denied, see `forClaude/workflow-love-quotes.md`)
6. This agent compiles + appends to the product file using the schema above
7. Bumps `last-verified` date in the frontmatter
8. Logs the verification in the file's `## Verification log` section

## Output Protocol
- For research requests: return a structured summary that fits the product file schema, ready to drop in
- For lookup requests: cite the product file + section + line, point the user there
- For comparison requests: pull from multiple product files and present as a table
- ALWAYS: tag the source agent ID in any commit that lands research findings (per the multi-agent flow rule)

## Composition with other agents

- **Design agent** — when the YCI marketing site needs accurate technical copy for product modals, the Design agent reads from this library rather than inventing facts
- **Forms agent** — quote/invoice line items can use this library's product taxonomy as their dropdown source
- **Database agent** — if YCI ever needs a `products` table, the schema can be derived from this library's frontmatter
- **Research agent** — generic web research dispatcher; this agent is the *flooring-specific* version

## State (as of 2026-04-13)

### Supplier → Product Mapping (VERIFIED)
All 18 suppliers verified against their actual websites on 2026-04-13 by dispatching 10 parallel web-checking agents.
- **Source of truth**: `src/lib/content/suppliers.ts` — each supplier has a `materials: Material[]` array
- **Human-readable reference**: `.claude/reference/supplier-product-mapping.md` — grid table + notes
- **Filter utility**: `suppliersByMaterial(material)` function exported from suppliers.ts
- **UI integration**: `SupplierMarquee` component accepts `material` + `compact` props to show filtered suppliers per product modal

### Product Modal Content Structure (DECIDED 2026-04-13)
Three tabs per product: **Overview / Install / Care**. Tab names are in `ModalTabs.svelte`.
- **Overview**: lead description (0.95rem, white) → spec chart (label:value rows with discreet borders) → filtered supplier marquee → pinned interactive button at bottom
- **Install**: video/media placeholder + spec rows
- **Care**: small static icon + spec rows + warranty footnote
- **Interactive feature**: opens full-bleed in tab panel via `featureOpen` state toggle, with "Back to overview" button + title header
- **Universal spec row labels**: Sizes, Wear, Install, Traffic, Fire, For, Maintain, Life — work across all 11 products

### Key Findings from Supplier Verification
- **CIOT** URL was wrong (`cfrancis.ca` is parked) — corrected to `ciot.com`
- **Gerflor** is much narrower than expected — LVT and sheet vinyl only in Canada
- **Centura** is the broadest distributor — carries almost every category
- **Forbo** does list carpet tile (Tessera + Flotex lines)
- **Vifloor** is a Shaw/Patcraft distributor, not just LVT — carries carpet-tile, carpet, matting, sheet
- **Fuzion** now lists carpet tile on their website

### Resource Library
The resource library at `.claude/resources/products/` is **planned but not yet populated** with full product files. The supplier mapping is complete. Next: populate per-product files using the schema above, starting with carpet-tile.
