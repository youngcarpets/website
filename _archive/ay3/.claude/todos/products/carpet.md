---
product: carpet
last-audited: 2026-04-07
auditor: parent-thread (after subagent permission block)
status: planning (NOT YET ON SITE)
sources:
  - .claude/resources/products/carpet.md
---

# Carpet (Broadloom) — Future Site Content TODO

## Currently on the marketing site
- Feature card `CPT` opens a modal with a 5-scene auto-advancing SVG gallery (`carpetUseCases` array around line 302–328 of `+page.svelte`) — atrium / lecture hall / boardroom / corridor / hospitality scenes with a label and one-line blurb each.
- Card blurb: "Broadloom for offices, institutions, ballrooms, and theatres."
- Card detail copy: full-service supply + install of broadloom from every major commercial mill, direct glue-down + double-stick + power-stretched seams, sample boards available.
- **Zero structured spec content.** No fibre system info, no install standards, no supplier list, no environment matrix, no maintenance protocol, no pricing.

## Missing data — high priority

- **Fibre systems table** (Nylon 6,6 / Nylon 6 / PET-polyester / wool). WHY: this is the #1 question commercial spec writers ask; site has nothing. WHERE: `carpet.md` §"Fibre systems" — already a verified table.
- **Solution-dyed vs piece-dyed explainer** with the bleach-cleanable / healthcare-adjacent recommendation. WHY: a single-line clarification that wins healthcare-adjacent specs. WHERE: `carpet.md` §"Fibre systems" final paragraph.
- **CRI 104 — Standard for Installation of Commercial Carpet.** WHY: any spec that doesn't name CRI 104 is incomplete; YCI should anchor every install paragraph to it. WHERE: `carpet.md` §"Install techniques" closing block.
- **The "Interface does NOT make broadloom" disambiguation.** WHY: real misspec correction opportunity — clients pull Interface into broadloom RFPs all the time and Interface only sells tile. Pre-empting this saves YCI a sales cycle. WHERE: `carpet.md` §"Supplier brands" + product-knowledge inset.
- **Install techniques table** (direct glue-down / double-stick / cushion-back / stretch-in / heat-welded seams). WHY: site doesn't differentiate methods; double-stick is a premium acoustic offer that warrants pricing power. WHERE: `carpet.md` §"Install techniques".
- **Moisture testing (ASTM F2170 / F1869).** WHY: failed moisture call on broadloom is the single most expensive callback in the trade — this is a credibility-builder. WHERE: `carpet.md` §"Best NOT used for" + future install-prep section.
- **Ottawa context paragraph** (PSPC / GC Workplace specs lean broadloom for ministerial offices; Carleton + uOttawa lecture halls; NAC + Shaw Centre + downtown hotel ballrooms). WHY: this is the YCI-specific credibility play. WHERE: `carpet.md` §"Best used for" final paragraph.

## Missing data — medium priority

- **Construction style table** (level loop / multi-level / patterned / cut pile / frieze / cut-and-loop / woven). WHERE: `carpet.md` §"Install patterns".
- **NSF/ANSI 140 Gold sustainability stack.** Federal specs require it; site silent. WHY: PSPC and US GSA both require this minimum. WHERE: `carpet.md` (verify section).
- **CRI Green Label Plus** (low VOC). WHERE: same.
- **Acclimation rules** (24h on-site, 18–35°C, 10–65% RH; adhesive cure 72h before/during/after). WHY: install-failure prevention. WHERE: `carpet.md` §"Install techniques".
- **Roll direction rule** (all drops same direction or visible shade variation). WHY: most common site callback. WHERE: same.
- **Maintenance cycle** (vacuum frequency, hot-water extraction every X months, traffic-lane treatment). WHERE: `carpet.md` §"Maintenance".
- **Pricing ranges** (Ontario commercial installed). WHERE: `carpet.md` §"Pricing".

## Missing data — low priority / nice-to-have

- **Custom mill orders** (500–1,000 sq yd minimums, lead times for woven Axminster / Wilton).
- **Integrated walk-off broadloom** for vestibules — cross-link to matting card.
- **Wear classification** (commercial heavy / commercial moderate / executive).
- **Heritage / ecclesiastical** notes (woven specifications for places of worship).
- Supplier portal links (Tarkett, Beaulieu Canada, Mohawk, Shaw Contract, etc.).

## Suggested information architecture

Promote broadloom to its own `/products/carpet` library page. Hero: a still 3D rendered scene of a long government corridor running broadloom (or the existing 5-scene SVG gallery, rebuilt as a manual carousel). Below: tabbed sections — **Fibre & Construction** (interactive comparison of nylon 6,6 vs 6 vs PET vs wool), **Install Methods** (table + illustrations), **CRI 104 + Standards**, **Where We've Installed It** (Ottawa client list), **Maintenance**, **Pricing**, **Suppliers + SDS**. The card on `/young-carpets` stays as a teaser that deep-links into the library.

## Standout facts worth featuring

- **Interface does NOT manufacture broadloom** — only carpet tile. Disambiguating this in spec docs alone is a sales advantage.
- Solution-dyed nylon (Antron Lumena, Aquafil ECONYL) is **bleach-cleanable** — the spec for any healthcare-adjacent commercial work.
- All commercial broadloom drops must run the same direction (arrow on back); reversing to save waste produces visible shade variation under raking light — most common callback.
- Broadloom acclimation requires the carpet on-site for **24 hours minimum** at 18–35°C / 10–65% RH before cutting.
- **NAC, Shaw Centre, and major Ottawa downtown hotels** are all core ballroom + pre-function broadloom clients — this is the elite tier of broadloom in the National Capital Region.

## Open questions for the user

- Does YCI have a default spec-package broadloom line (single mill / family) for federal PSPC tenders?
- Confirm YCI dealer status for **Beaulieu Canada** (Quebec mill, big Canadian commercial player).
- Would you publish a specific Ottawa client reference list (NAC, etc.) on the public site or keep that for in-person sales?
- Does YCI offer **scheduled hot-water extraction maintenance contracts**, or is install-only?
- How does YCI handle **dye-lot drift** for replacement work on existing broadloom installs (5+ years old)?
