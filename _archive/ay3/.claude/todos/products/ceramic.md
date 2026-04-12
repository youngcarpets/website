---
product: ceramic
last-audited: 2026-04-07
auditor: parent-thread (after subagent permission block)
status: planning (NOT YET ON SITE)
sources:
  - .claude/resources/products/ceramic.md
---

# Ceramic / Porcelain — Future Site Content TODO

## Currently on the marketing site
- Feature card `CT` opens a modal with the **slip-rating slider** — a tilting ramp + walking-shoe figure that animates as the user drags through the R9 → R13 DIN 51130 slip ratings. Each rating displays its angle range and a "uses" label.
- Card detail copy: porcelain + ceramic for entrances, lobbies, washrooms, kitchens, healthcare wet zones, pool decks. Mentions Schluter membrane systems, heated underlayment, large-format protocol per TTMAC.
- **DIN 51130 slip slider was fixed in v1.21.6** to use ranges (R9 = 6–10°, R10 = 10–19°, R11 = 19–27°, R12 = 27–35°, R13 = >35°) instead of single angles. **No action needed there.** Verified at lines 561–565 of `+page.svelte`.

## Missing data — high priority

- **TTMAC Specification Guide 09 30 00 reference.** WHY: TTMAC is the Canadian tile install standard — any spec writer doing Canadian commercial work expects to see it cited. WHERE: `ceramic.md` §"Standards" — already documented.
- **Schluter membrane system depth** (Ditra, Ditra-XL, Kerdi waterproofing, Kerdi-Board, DILEX movement joints). WHY: card mentions "Schluter membrane systems" in passing but the modal doesn't explain what they're for or when each is required. Schluter is YCI-confirmed and a major install differentiator. WHERE: `ceramic.md` §"Install techniques" §"Membrane systems".
- **Large-format tile (LFT) protocol** — 90% mortar coverage rule, back-buttering, leveling-clip systems for tiles >15" on a side, ANSI A108.5. WHY: LFT (24×48, 32×32, 24×24+) is now the dominant commercial spec and improper install causes lippage callbacks. WHERE: `ceramic.md` §"Install techniques" §"Large-format protocol".
- **Heated underlayment** (Schluter Ditra-Heat, Suntouch, Warmly Yours) for entrance vestibules and wet zones. WHY: Ottawa winter spec — clients ask. WHERE: `ceramic.md` §"Heated systems".
- **The DIN 51130 slip rating + actual use cases** as teaching copy alongside the existing slider. WHY: the slider visualization is good but the user needs to know "R10 = entrance, R11 = wet kitchen, R12 = pool deck, R13 = food prep with grease". The current `uses` label is short — should be expanded. WHERE: `ceramic.md` §"Slip ratings" — DIN 51130 + ANSI A326.3 DCOF cross-reference.
- **Porcelain vs ceramic distinction** (water absorption ≤ 0.5% for porcelain per ASTM C373, body density, frost resistance, exterior eligibility). WHY: clients confuse the two; porcelain is required for exterior + freeze/thaw + heavy commercial. WHERE: `ceramic.md` §"Types / sub-products".

## Missing data — medium priority

- **Setting material families** (modified vs unmodified thinset, ANSI A118.4 / A118.11 / A118.15, epoxy grout for chemical resistance). WHERE: `ceramic.md` §"Setting materials".
- **Grout types** (cementitious, urethane, epoxy) and where each is required. Healthcare and food-prep are epoxy-only zones. WHERE: `ceramic.md` §"Grout".
- **Crack-isolation membranes** (Schluter Ditra) — when required, ANSI A118.12 spec. WHERE: `ceramic.md` §"Membrane systems".
- **Movement joint requirements** (ANSI A108.01, TTMAC) — perimeter joints, field movement joints every 20–25 ft, change-of-plane joints. WHERE: `ceramic.md` §"Movement joints".
- **DCOF (ANSI A326.3)** alongside DIN 51130 — North American slip standard. ≥ 0.42 for level interior wet areas. WHY: North American specs use DCOF; DIN is European. WHERE: `ceramic.md` §"Slip ratings".
- **Pricing tiers** — entry-level porcelain ($4–8/sf installed), mid-grade ($8–14), large-format / premium ($14–28+). WHERE: `ceramic.md` §"Pricing".
- **Supplier brands table** — Centura, Euro Tile & Stone, Olympia Tile, Ceratec, Cérag­rès — confirmed YCI dealer status for each. WHERE: `ceramic.md` §"Supplier brands".

## Missing data — low priority / nice-to-have

- **Natural stone** brief (granite / marble / slate / travertine / limestone) — even though YCI's primary scope is porcelain + ceramic, stone occasionally enters the spec for heritage and luxury work.
- **Mosaic tile** for wall + accent applications (linked to floor for shower-floor compliance).
- **Anti-microbial glaze** options for healthcare wet zones (silver-ion porcelain).
- **Sustainability** — recycled-content porcelain, GREENGUARD certification.
- **Cross-link to sheet vinyl** for the wet-zone alternative when grout maintenance is unacceptable (clinical / lab).

## Suggested information architecture

The slip slider is the right hero — keep it as the primary interaction. Below: tabbed sections — **Porcelain vs Ceramic** (water absorption + when each is required), **Slip Ratings** (the slider + a use-case grid mapping R-rating to environment), **Schluter Membrane Systems** (Ditra / Kerdi / heated), **Large-Format Protocol** (the 90% coverage rule + leveling clips), **TTMAC + ANSI Standards**, **Setting Materials + Grout** (with epoxy grout as the healthcare answer), **Suppliers + Confirmed Dealers**, **Pricing**.

## Standout facts worth featuring

- **DIN 51130 was fixed in v1.21.6** — slip slider now uses correct ranges, not single angles. The site now teaches the right spec.
- **Schluter Ditra is the de-facto crack-isolation standard** in Canadian commercial tile work — it's an ANSI A118.12 product that has saved more callbacks than any other single tile install innovation.
- **Large-format porcelain (24×48 and up) requires 90% mortar coverage** per ANSI A108.5 — a back-buttering technique most general-trade installers skip, causing lippage.
- **Porcelain water absorption ≤ 0.5%** per ASTM C373 — that's the line that separates "porcelain" from "ceramic" in spec language.
- **Centura, Euro Tile & Stone, Olympia Tile, Ceratec, Cérag­rès** — all confirmed YCI suppliers (per the existing supplier list in `+page.svelte`).

## Open questions for the user

- Does YCI have **certified Schluter installers** on staff? Schluter offers a certification program — worth highlighting if so.
- Does YCI self-perform **heated underlayment installs** (Ditra-Heat) or sub the electrical to a licensed electrician?
- Does YCI handle **large-format (>32" on a side)** installs in-house, or refer to a tile specialist? LFT requires specialized lifting + leveling equipment.
- Confirm dealer status hierarchy: which Centura / Euro Tile / Olympia line does YCI default-spec for federal + healthcare work?
- Does YCI have **photo rights** to a high-end ceramic install (NAC bathroom, hospital lobby, university atrium)?
- **Natural stone** scope — does YCI handle stone, refer to a stone specialist, or coordinate with a sub?
