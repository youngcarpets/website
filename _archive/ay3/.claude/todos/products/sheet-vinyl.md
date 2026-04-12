---
product: sheet-vinyl
last-audited: 2026-04-07
auditor: resilient-family-audit-agent
status: planning (NOT YET ON SITE)
sources:
  - .claude/resources/products/sheet-vinyl.md
  - .claude/resources/products/sheet-vinyl-coving.md
---

# Sheet Vinyl (Heat-Welded + Flash Cove) — Future Site Content TODO

> Folds `sheet-vinyl.md` (product research) + `sheet-vinyl-coving.md` (install-method research) into one plan. The coving file is the authoritative source on install methods and component anatomy.

## Currently on the marketing site
- Feature card `SHT` opens a modal with an **annotated cross-section SVG** of a flash cove: substrate, cap strip, cove stick (~7/8" radius), two sheet pieces meeting at a heat-weld seam, and a heat-weld marker. Step-sequenced reveal. See `+page.svelte:2065-2197`.
- Caption: *"Monolithic floor-to-wall — no seam, no shadow line, nowhere for bacteria to hide."* + replay button.
- Card blurb mentions OR, ICU, dental, kitchens, dialysis, labs; heat-welded seams, flash-coved bases, ASTM moisture testing. Suppliers in teaser: Forbo, Tarkett, Gerflor, Altro, Armstrong.
- **Only the two-piece (Method 2) flash cove method is visualized** — silent on why a two-piece vs one-piece vs border method would be chosen.

## Missing data — high priority

- **The three install methods (one-piece / two-piece / border) and when each is used.** WHY: animation shows one method without context; installers and spec writers need the taxonomy. WHERE: `sheet-vinyl-coving.md` §"1b. The three flash cove install methods".
- **Full component anatomy with all 7 parts** (wall substrate, cove stick, cap strip, sheet, flash-cove adhesive, heat-weld rod, corner fills). WHY: site SVG shows only 4 of 7; adhesive, corner fills, substrate prep missing. WHERE: `sheet-vinyl-coving.md` §"1. Anatomy of a Flash Cove".
- **Ottawa-area healthcare reference project list** (Ottawa Hospital, CHEO, Royal, Montfort, Bruyère, Queensway Carleton). WHY: dominant credibility driver; YCI has been doing this since 1991. WHERE: `sheet-vinyl.md` §"Ottawa-area reference projects".
- **Sub-products: heterogeneous, homogeneous, linoleum (Marmoleum), safety sheet, ESD/SD, acoustic-backed.** WHY: page treats sheet vinyl as monolithic; 6 distinct families. WHERE: `sheet-vinyl.md` §"Types / sub-products".
- **Why sheet over tile in healthcare (7 bullets).** WHY: the sales pitch — no joints, rolling-load tolerance, ISO 8690, IPC compliance. WHERE: `sheet-vinyl.md` §"Why sheet over tile in these environments".
- **Substrate prep spec (moisture, pH, flatness ≤ 3/16" in 10' AND ≤ 1/16" in 1', asbestos protocol).** WHY: prep failure is #1 callback; 1/16" in 1' is tighter than any other resilient. WHERE: `sheet-vinyl.md` §"Substrate prep — critical specs".

## Missing data — medium priority

- **Standards table** (ASTM F1303/F1700/F1869/F2170/F710/F1913/F925, EN ISO 10581/10582/10874, DIN 51130, ISO 8690, CSA Z8000, CSA Z317.13, FloorScore, CDPH 01350). WHY: Canadian CSA standards are load-bearing for healthcare. WHERE: `sheet-vinyl.md` §"Standards & spec references".
- **Full 5-step cove build sequence as text** (bare wall → sheet down → sheet curves up → cap snaps in → weld line traces). WHERE: `sheet-vinyl.md` §"The cove-build sequence — defining detail".
- **Pricing ranges** (heterogeneous $7–16, homogeneous+cove $14–32, linoleum+cove $16–34, safety+cove $16–36, ESD $28–55+; prep adders $2–10). WHERE: `sheet-vinyl.md` §"Pricing notes".
- **Maintenance protocol per sub-product** (homogeneous no-wax PUR, linoleum neutral-only, safety flooring NO burnishing rule). WHY: wrong maintenance destroys slip rating/surface. WHERE: `sheet-vinyl.md` §"Maintenance".
- **Install technique table** (heat-weld at 400–450 °C, full-spread adhesive only, double-cut seams, cove former install). WHERE: `sheet-vinyl.md` §"Install techniques".
- **HACCP / Altro Whiterock integrated wall-clad system.** WHY: sells the system, not just the floor. WHERE: `sheet-vinyl-coving.md` §"Altro".
- **"Best NOT used for" anti-patterns.** WHERE: `sheet-vinyl.md` §"Best NOT used for".

## Missing data — low priority / nice-to-have

- Marketing copy snippets ("monolithic floor-to-wall", "integral cove base — not a rubber strip glued on later", HACCP). `sheet-vinyl-coving.md` §"6. Marketing Copy Snippets".
- Buzzwords-to-avoid note (don't over-claim "waterproof" or "antimicrobial"). Same section.
- Prefab corner fills (FlashCove Prefabricated Bases Inc., Nora prefab corners). `sheet-vinyl-coving.md` §"4. Manufacturer Summary" + §"Specialty".
- SDS / technical-portal deep links per manufacturer. `sheet-vinyl.md` §"MSDS / SDS / technical portals".
- "With cove vs without cove" comparison as secondary showcase slot. `sheet-vinyl-coving.md` §"3. Recommended Visual Showcase Approaches" (ranked #2).
- Real on-site reference photo from a past YCI flash-cove install (eventual replacement/complement for the SVG). Both files §"Open research questions".

## Suggested information architecture

Promote sheet vinyl to its own full library page (`/products/sheet-vinyl`) with the current modal cross-section animation pinned in the hero. Below: six collapsible or tab sections — **What It Is / Sub-Products**, **Why Sheet Over Tile**, **Install Methods** (interactive toggle between one-piece, two-piece, border diagrams), **Substrate & Standards**, **Maintenance**, **Suppliers + SDS**. A dedicated **Ottawa Healthcare Projects** strip lists hospital network typical specs. Architects, infection-control leads, and estimators land here from the card; casual browsers get the card-only teaser.

## Standout facts worth featuring

- Tarkett iQ Granit rated "Excellent" to **ISO 8690 / DIN 25415** for decontamination of radioactive surface contamination.
- Homogeneous sheet flatness tolerance **≤ 3/16" in 10' AND ≤ 1/16" in 1'** — tighter than any other resilient finish.
- Heat-weld rod fuses at **~400–450 °C**, skived in two passes (hot mooncutter + cooled spatula).
- YCI installing heat-welded flash-coved sheet for Ottawa healthcare networks since **1991**.
- Forbo Marmoleum: BREEAM A+, naturally bacteriostatic, 25+ year lifecycle, CHEO pediatric spec favourite.

## Open questions for the user

- **Altro dealer status — flagged UNVERIFIED and NOT to be published as a fact.** Both research files explicitly say Altro Canada Inc. dealer status is unconfirmed; user has re-flagged this. This TODO deliberately does NOT include "claim Altro dealer status" as a task. Internal action: phone Altro Canada (Mississauga, 1-800-565-4658) and confirm YCI dealer account before any Altro-specific copy goes public.
- Which install method(s) does YCI default to in real work — one-piece, two-piece, or variable by room geometry? Would a method-picker showing all three help?
- Is YCI's install crew **certified** through Tarkett or Forbo installer training programs?
- Which **heat-welding tool brand** does the crew use (Leister, Wagner, Turbo)?
- YCI's **preferred cove former** — wood, aluminum, or extruded PVC? Standard radius (7/8" NA vs 20mm/38mm Altro metric)?
- **Photo rights** to any completed flash-cove project for the site?
- Confirm YCI dealer status for **Polyflor Canada Inc.** (Mississauga).
- Which **Forbo Marmoleum and Sphera lines** are stocked locally vs. special-order?
