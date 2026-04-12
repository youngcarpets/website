---
product: hardwood
last-audited: 2026-04-07
auditor: parent-thread (after subagent permission block)
status: planning (NOT YET ON SITE)
sources:
  - .claude/resources/products/hardwood.md
---

# Hardwood — Future Site Content TODO

## Currently on the marketing site
- Feature card `WD` opens a modal with a **3-card flip interaction** showing solid / engineered / parquet at high level. Each card flips on hover/tap to reveal a short blurb on the back.
- Card detail copy mentions Quebec mills (Mirage, Lauzon, Preverco, Mercier) at the card level + scheduled screen-and-recoat maintenance and after-hours refinishing across the National Capital Region. Also mentions laminate + bamboo (added v1.22.0).
- **Modal is thin** — flip cards are visually nice but carry no spec data. No Janka, no wear-layer mil spec, no NWFA standards, no install techniques table, no moisture testing.

## Missing data — high priority

- **The Quebec mill story** as a featured paragraph — Mirage, Lauzon, Preverco, Mercier are confirmed YCI suppliers and represent the strongest regional credibility play. Quebec-milled engineered hardwood handles Ottawa's 20–60% RH seasonal swing better than imports. WHY: regional advantage + verified supplier list. WHERE: `hardwood.md` §"What it is" + §"Supplier brands".
- **Wear-layer thickness spec** (2 mm = residential, 3–4 mm = commercial standard, 6 mm = premium refinishable). WHY: this is THE single number that determines whether engineered hardwood will survive a commercial install. Site silent. WHERE: `hardwood.md` §"Types / sub-products" §ENGINEERED.
- **Screen-and-recoat maintenance service** as an explicit service offer. YCI does this after-hours and on weekends to keep occupied tenants operational — high-margin recurring revenue play. WHY: differentiates YCI from new-install-only competitors. WHERE: `hardwood.md` §"What it is" closing paragraph + §"Maintenance".
- **NWFA substrate flatness tolerances** (3/16" in 10' for glue-down/floating, 1/4" in 10' for nail-down). WHY: install-failure prevention. WHERE: `hardwood.md` §"Install techniques" §"NWFA substrate flatness tolerances".
- **Moisture testing protocol** (ASTM F2170 RH probe — 3 locations per first 1,000 sf, 1 per 1,000 sf thereafter; ≤ 4% MC differential between subfloor and wood). WHY: failed moisture call on hardwood is the most expensive callback in the trade. WHERE: `hardwood.md` §"Install techniques" §"Moisture testing".
- **Site-finished vs pre-finished** trade-off — site-finished allows custom colour match for heritage restoration but means dust + VOC + slower occupancy; pre-finished is faster but locked to factory colours. WHY: this is the spec-level decision every project makes. WHERE: `hardwood.md` §"Install techniques" rows.
- **Janka hardness ratings** for the species YCI installs (white oak, red oak, hard maple, hickory, walnut, ash). WHY: clients ask "will this dent under my office chair casters" — Janka is the answer. WHERE: `hardwood.md` §"Species" (verify section name).

## Missing data — medium priority

- **Acclimation requirements** (14 days minimum on-site, conditioned space, pin moisture meter not calendar). WHY: prevents the #2 most common callback (cupping). WHERE: `hardwood.md` §"Install techniques" §"Moisture testing".
- **Adhesive families** (moisture-cure urethane only — Bostik, Mapei, Sika; never water-based). WHY: spec-level commercial gating. WHERE: `hardwood.md` §"Install techniques".
- **Install pattern catalog** (straight-lay 1/3 stagger / random stagger / herringbone / chevron / Versailles panels) with labour multipliers. WHY: clients see herringbone on Pinterest and want it; the 1.6–1.8× labour cost should be communicated. WHERE: `hardwood.md` §"Install patterns".
- **Finish chemistry** (UV-cured aluminum-oxide vs nano + ceramic + Tru-Tex from Mirage) — premium pre-finishes carry 25-year wear warranties. WHERE: `hardwood.md` §"Finishes".
- **Pricing tiers** — engineered $7–14/sf installed, solid $9–18, parquet $14–32+. WHERE: `hardwood.md` §"Pricing".
- **Best NOT used for** anti-patterns (slab-on-grade with elevated moisture, wet zones, healthcare clinical, industrial, sports floors — link to dedicated sport-floor research). WHERE: `hardwood.md` §"Best NOT used for".
- **Laminate** brief — when laminate is the right answer (budget tenant fit-outs, heavy-traffic public spaces), how it differs from engineered hardwood (printed pattern, no real wood face). WHERE: research file may need a §LAMINATE addition.
- **Bamboo** brief — strand-woven bamboo, sustainability story, Janka comparable to oak. WHERE: same.

## Missing data — low priority / nice-to-have

- **Heritage restoration** workflow (sand to bare, stain match, multi-coat finish, dust containment).
- **Shaw Contract / Mannington engineered** lines as alternatives to Quebec mills.
- **Sustainability stack** — FSC certification, low-VOC adhesive options, FloorScore.
- **Sports flooring deferral** — explicit pointer to MFMA hard maple sport floors as a separate spec (already noted in research file).
- **Ottawa client reference list** (which heritage and government buildings YCI has done hardwood work in).
- **Exotic species** brief (jatoba, Brazilian cherry, tigerwood) — niche but worth a line.

## Suggested information architecture

Promote hardwood to its own `/products/hardwood` library page. Hero: hold the existing 3-card flip interaction or replace with a side-view cross-section diagram of solid vs engineered (showing the 3–6 mm wear layer of engineered vs the 19 mm solid). Below: tabbed sections — **Solid vs Engineered** (the spec-level question), **Quebec Mills** (Mirage / Lauzon / Preverco / Mercier — regional differentiator), **Install Methods + Substrate Prep** (with NWFA flatness + moisture testing), **Site-finished vs Pre-finished**, **Patterns** (with labour multipliers), **Maintenance + Screen-and-Recoat Service** (the recurring revenue play), **Pricing**, **Heritage Restoration Case Studies**. Laminate + bamboo get their own short tab or sub-section since they're now bundled with hardwood per v1.22.0.

## Standout facts worth featuring

- **Quebec mills handle the Ottawa RH swing better than imports** — Mirage, Lauzon, Preverco, Mercier are all engineered for the Eastern Canadian climate.
- **Wear layer is the only number that matters** for engineered hardwood spec — 2 mm = residential, 3–4 mm = commercial standard, 6 mm = premium.
- **YCI does after-hours and weekend screen-and-recoat work** to keep occupied commercial tenants operational — operational continuity is the sales angle.
- **Mirage Tru-Tex finish** (nano-ceramic) carries a **25-year commercial wear warranty** — best-in-class.
- **NWFA requires ≤ 4% MC differential** between subfloor and wood before install. Calendar acclimation does not satisfy NWFA — pin meter readings do.

## Open questions for the user

- Confirm YCI's volume mix between solid / engineered / parquet (engineered is presumed dominant per the research, but verify).
- Does YCI carry **all four** Quebec mills (Mirage, Lauzon, Preverco, Mercier) or default-spec one?
- Confirm screen-and-recoat as a **named service line** with its own pricing — this is the recurring revenue angle the website should highlight.
- Does YCI handle **dust-containment site-finishing** (HEPA + sealed envelope) for occupied buildings?
- Sports flooring (MFMA hard maple gym floors): does YCI self-perform or sub out? Per CLAUDE.md context this was flagged as "separate spec, not covered here" — confirm whether to surface as a related-product cross-link or completely silent.
- Does YCI have **photo rights** to a heritage hardwood restoration project for the site?
- Bamboo + laminate were added to the card v1.22.0 — does YCI actually install them in significant volume, or are they listed for completeness?
