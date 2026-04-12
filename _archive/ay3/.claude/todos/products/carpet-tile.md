---
product: carpet-tile
last-audited: 2026-04-07
auditor: parent-thread (after subagent permission block)
status: planning (NOT YET ON SITE)
sources:
  - .claude/resources/products/carpet-tile.md
---

# Carpet Tile — Future Site Content TODO

## Currently on the marketing site
- Feature card `CPT-T` opens the **headliner interaction** — a 6-pattern morph SVG (`tilePatternList` around line 275–282 of `+page.svelte`). Tap a pill (monolithic / quarter-turn / brick / herringbone / ashlar / random) and the 36 tiles smoothly rearrange. Strongest interaction on the entire site.
- Card detail copy: "modular tile in 24×24, 18×36, and plank formats. Tap to play with monolithic, quarter-turn, brick, herringbone, ashlar, and random install layouts. Glue-down, tackified release, and peel-and-stick."
- **The 6 pattern pills have NO teaching copy attached.** The user can play with the morph but the page never explains what each pattern is for, what it costs, or what trade-offs it carries. Biggest single content win on the site.

## Missing data — high priority

- **One- to two-sentence caption per pattern pill** explaining when to spec it and what trade-off it carries. WHY: the headliner interaction is currently teaching nothing. Wire each pill's `id` to a corresponding `desc` array. WHERE: `carpet-tile.md` §"Install patterns" table — every pattern already has the "best use" + "trade-offs" columns drafted.
  - **Quarter-turn** (YCI default) — hides traffic wear, dye-lot drift, and installer error. The "why it's the default" answer is gold for spec writers.
  - **Herringbone** — plank format only, ~10–15% cut waste, install labour 30–50% higher. Good to flag the cost up front.
  - **Random** — the safest pattern for long-term replaceability; any new tile from any dye lot blends in. K–12 / municipal sweet spot.
- **The 4-layer tile anatomy** (face fibre / primary backing / dimensional backing / tile geometry). WHY: this is what differentiates a $20/sf tile from a $4/sf tile and where the sustainability story lives. WHERE: `carpet-tile.md` §"What it is" → 4-layer breakdown.
- **Interface CQuestBioX — carbon-negative backing** + **TacTiles glue-free** + **ReEntry / Aspera Canadian recycling**. WHY: Interface's sustainability story is unmatched in the category and YCI is a confirmed Interface dealer. Federal and LEED v4.1/v5 specs are won and lost on this. WHERE: `carpet-tile.md` §"Supplier brands" Interface row.
- **Install techniques table** (full-spread vs tackified release vs peel-and-stick vs TacTiles vs loose-lay) with the **YCI default = tackified release for 80%+ of installs** call-out. WHY: differentiates YCI install method from competitors who default to full-spread. WHERE: `carpet-tile.md` §"Install techniques".
- **The Ottawa substrate-moisture rule** — release adhesive over peel-and-stick because Ottawa basement slabs see seasonal humidity swing that re-engages adhesive on humid August days. WHY: regional installer wisdom. WHERE: `carpet-tile.md` §"Install techniques" closing paragraph.
- **NSF/ANSI 140 Gold + CRI Green Label Plus** sustainability cert stack. WHY: federal PSPC + CCOHS specs require these minimums. WHERE: `carpet-tile.md` §"Sustainability standards".

## Missing data — medium priority

- **Format table** (24×24 / 50×50 cm / 18×36 / 9×36 plank / 36×36 large-format). WHY: clients ask "what sizes are available"; site shows zero formats. WHERE: `carpet-tile.md` §"Types / sub-products".
- **Most-spec'd Ottawa format** — 24×24 is ~55–65% of YCI volume (unverified, flag with user). WHERE: same section.
- **Pricing tiers** — base ($3–6/sf), mid ($6–12/sf), premium ($12–24/sf), with what each tier buys. WHERE: `carpet-tile.md` §"Pricing".
- **Supplier table** — Tarkett, Forbo (Tessera), Mohawk Group, Shaw Contract, Interface, Patcraft, Beaulieu Canada, Milliken, Mannington — who YCI is a confirmed dealer for vs partial-line. WHERE: `carpet-tile.md` §"Supplier brands".
- **Moisture testing requirements** (ASTM F2170 RH probe ≤ 75%, F1869 MVER ≤ 3 lbs / 1,000 sf / 24h). WHERE: `carpet-tile.md` §"Substrate prep".
- **Maintenance comparison** vs broadloom (vacuum, spot extraction, tile replacement, no full-floor extraction needed). WHERE: `carpet-tile.md` §"Maintenance".
- **The "broadloom is now the exception, not the rule" statement** as a positioning paragraph. WHERE: `carpet-tile.md` §"What it is" first paragraph.

## Missing data — low priority / nice-to-have

- **Raised access floor compatibility** — TacTiles + release adhesive both lift with the access panel.
- **Cross-link to broadloom** for the wet-zone / non-clinical-healthcare exclusions.
- **Heat-welded seam vs sewn** alternatives for the rare cases broadloom-style continuous installs are wanted.
- **Mill-specific lead times** (Interface global default 50×50, Quebec mills, Ontario stock).

## Suggested information architecture

The 6-pattern morph is already the right hero for this product. Don't replace it — wrap it. Below the morph: a **dynamic caption block** that updates with the active pattern (1–2 sentence explanation pulled from the research file). Then tabbed sections: **The 4 Layers** (anatomy diagram), **Sub-formats** (24×24 vs 18×36 vs plank etc.), **Install Methods** (with YCI's tackified-release default highlighted), **Sustainability** (Interface CQuestBioX + ReEntry + NSF 140 + Green Label Plus), **Standards & Spec**, **Pricing Tiers**, **Suppliers + Confirmed Dealer Status**.

## Standout facts worth featuring

- **Interface CQuestBioX backing is carbon-negative** (sequesters more CO₂ than is emitted to make it). The only flooring product on the market that can claim this in 2026.
- **TacTiles** = glue-free 3" adhesive squares that connect tile-to-tile, not tile-to-substrate. ~4–5 TacTiles per m². Near-zero VOC. Tiles + TacTiles recycle together through ReEntry.
- **Aspera (Belleville, Ontario)** is Interface's Canadian ReEntry processing partner — old tiles get ground and re-extruded into new backing on-shore.
- **Quarter-turn pattern** is YCI's default for plain/tonal tile because it hides traffic wear, dye-lot drift, AND installer error in one design decision.
- **Carpet tile is the default commercial flooring in Ottawa in 2026** — broadloom is now the exception. Federal, K–12, municipal, healthcare admin, university — all carpet tile.

## Open questions for the user

- Confirm YCI's carpet-tile volume mix by format (is 24×24 really ~60%? Confirm with shop data).
- Confirm which Interface lines YCI defaults to spec — World Woven, Equal Measure, Open Air, Knit One Purl Two, etc.
- Does YCI default to tackified release on 80% of installs as the research states, or is the mix different?
- Does YCI participate in Interface's **ReEntry recycling pickup program**? If yes, this is a sustainability claim worth featuring on the site.
- Confirm dealer status for **Milliken** and **Mannington** carpet-tile lines.
- Would YCI publish a specific Ottawa client reference list (OCDSB, City of Ottawa, federal departments) on the public site?
