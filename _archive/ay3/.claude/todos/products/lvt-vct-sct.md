---
product: lvt-vct-sct
last-audited: 2026-04-07
auditor: resilient-family-audit-agent
status: planning (NOT YET ON SITE)
---

# LVT / VCT / SCT — Future Site Content TODO

## Currently on the marketing site
- Three-tab segmented modal (LVT / VCT / SCT) inside the `VNL` feature card — see `vinylContent` at `my-portal/src/routes/young-carpets/+page.svelte:674-730`.
- Each tab shows: tagline, one-paragraph "what it is", short "best for" list (3-4 bullets), short "install" list (3 bullets), supplier chips.
- LVT suppliers: Tarkett, Shaw Contract, Mohawk, Armstrong, COREtec, Karndean. VCT: Armstrong (Azrock), Tarkett, Mannington. SCT: Forbo (Sphera), Tarkett iQ, Gerflor (Mipolam), Nora, Altro.
- No imagery, no wear-layer spec, no pricing, no standards, no maintenance protocol, no SPC/WPC differentiation.

## Missing data — high priority

- **LVT wear-layer table (6/20/22/28/30/40 mil → use class).** WHY: single most important spec number for commercial buyers. WHERE: `lvt-vct-sct.md` §"Wear layer — the only number that matters".
- **SPC vs WPC vs flexible LVT explanation.** WHY: 2026 terminology — cores are not separate products; clients ask and site has no answer. WHERE: §"Sub-formats" + §"SPC vs. WPC vs. traditional flexible LVT".
- **VCT strip/wax/burnish maintenance protocol.** WHY: this is the gate question — if a customer can't commit, they shouldn't buy VCT; site offers VCT with no warning. WHERE: §"VCT maintenance protocol — the reason to pick or reject VCT".
- **SCT / homogeneous sheet three differentiators (heat weld, flash cove, full-spread only).** WHY: distinguishes healthcare sheet from LVT. WHERE: §"The three differentiators".
- **Substrate flatness tolerances per sub-product (LVT 3/16" vs homogeneous 1/8" in 10').** WHY: #1 callback driver. WHERE: §"Substrate prep (baseline)" table.
- **LVT install pattern library with imagery.** WHY: herringbone/chevron trending hospitality/boutique retail mid-2020s. WHERE: §"Install patterns".

## Missing data — medium priority

- **Pricing ranges (installed, 2026 CAD) per format.** WHERE: §"Pricing (Ontario commercial, installed, 2026 range)".
- **Acoustic-backed LVT options (factory vs site-applied vs SPC+IXPE).** WHERE: §"Acoustic-backed variants".
- **Standards table (ASTM F1303/F1700/F1066/F1869/F2170, FloorScore, EN 685).** WHERE: §"Standards summary table".
- **VCT "five reasons still specified in 2026" narrative.** WHY: wins public-tender work. WHERE: §"Why VCT is still specified in 2026 despite LVT dominance".
- **LVT install techniques detail (dryback vs PSA vs click vs loose-lay).** WHERE: §"Install techniques".
- **SCT healthcare use-case matrix (OR/ICU/pharmacy/lab/imaging/kitchen/decon).** WHERE: §"Healthcare and clean-room use cases".
- **Maintenance comparison table across all three.** WHERE: §"Maintenance comparison — the customer's real question".

## Missing data — low priority / nice-to-have

- Armstrong Excelon adhesive line call-outs (S-515, S-319, S-1000, PS-820, PU-100, SC-100). §"Install — full-spread acrylic adhesive".
- VCT pattern options (straight grid, quarter-turn, feature stripe). §"Patterns".
- Tarkett iQ ISO 8690 "Excellent" + ISO 14644-1 Class 4. §"Homogeneous sheet supplier brands".
- Forbo Sphera phthalate-free / betadine resistance. Same section.
- Supplier SDS/EPD/HPD portal links. §"Supplier transparency / SDS portals".
- "Best NOT used for" anti-patterns for all three. §"Best NOT used for".
- Cross-linking to sheet-vinyl, carpet-tile, rubber. §"Related products".

## Suggested information architecture

Spin this out of the single-card modal into a full `/products/lvt-vct-sct` library page with three sub-routes (`/lvt`, `/vct`, `/homogeneous-sheet`) sharing a common shell. Each sub-page: hero with a defining interactive (LVT = wear-layer slider; VCT = strip/wax cycle animation; SCT = flash-cove cutaway). Tab-style sections for "What it is", "When to spec it", "Install", "Maintenance", "Standards", "Pricing", "Suppliers + SDS", "Case studies". The card on `/young-carpets` stays as an entry teaser that deep-links into the library.

## Standout facts worth featuring

- Shaw Industries alone accounts for ~1/3 of U.S. LVT consumption.
- Karndean commercial: 30 mil / 20-year commercial warranty benchmark.
- Tarkett iQ rated "Excellent" to ISO 8690 for decontamination of radioactive surface contamination.
- Homogeneous sheet substrate tolerance ≤ 1/8" in 10' — tighter than any other resilient YCI installs.
- VCT $2–5/sqft vs LVT $4–15/sqft installed — can decide a 50,000 sqft public-school tender.

## Open questions for the user

- Confirm YCI dealer status for **Karndean Commercial** (Ontario).
- Confirm YCI dealer status for **Polyflor Canada**.
- Which **Tarkett iQ sub-lines** does YCI stock/default-spec (iQ Granit, Optima, Natural, Eminent, One)?
- Which **Mannington Commercial VCT line** does YCI actually carry?
- Does YCI have a standard **acoustic underlayment** stack for multi-level LVT builds?
- Does YCI want pricing published on the public marketing site, or kept to "contact for a quote"?
