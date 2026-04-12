---
slug: sdt
name: Static-Dissipative Flooring
category: specialty
order: 9
last-verified: 2026-04-07
---

# Static-Dissipative Flooring (SDT / ESD)

## What it is
Floor systems engineered to bleed off static electricity through a controlled, electrically continuous path to building ground. Specified wherever a stray static discharge can kill a chip, corrupt a measurement, ignite a fuel or propellant, or bring down a $40M rack of GPUs. The floor is only one part of a grounded system — adhesive, seams, copper ground drain, and maintenance regime all have to stay electrically continuous over the life of the install.

SDT was historically a niche electronics-manufacturing and munitions spec. The 2023–2026 hyperscale / AI data center build-out turned it into a mainstream commercial category — ESD flooring is now being specified across entire hyperscale white-space footprints, not just server aisles, because AI compute density (50 kW+ racks, 400/800 V DC distribution, GPU clusters worth millions per aisle) made even sub-100 V static events a material risk.

## Types / sub-products

### The two electrical classes (ANSI/ESD S20.20-2021 + ASTM F150)
- **Conductive (EC / C)** — point-to-ground resistance **< 1 × 10^6 Ω** (typically 2.5 × 10^4 to 1 × 10^6). Fast, aggressive discharge. Spec'd where even millivolts matter: munitions handling, EOD, propellant rooms, Class-0 ESD electronics assembly (GaAs, MR heads, legacy mil-spec).
- **Static Dissipative (SD)** — point-to-ground resistance **1 × 10^6 to 1 × 10^9 Ω**. Controlled, slower discharge. The modern mainstream spec: data centers, server rooms, SMT lines, pharma cleanrooms, MRI/cath lab control rooms, telecom COs. The ESDA and Construction Specifier consensus is that the **10^7–10^9 Ω** band is the sweet spot — low enough to pass the ANSI/ESD S20.20 walking-voltage test (<100 V body voltage), high enough to not create a shock hazard on live-equipment work.
- **The real compliance test** is body-voltage generation (<100 V walking test per ANSI/ESD STM97.1/97.2), not a single ohm number. A floor can be "conductive" on paper and still fail S20.20 if the installed system leaks voltage at seams or if the adhesive cure drifts out of spec.

### Material formats (2026 state of the market)

**Homogeneous ESD vinyl tile** — solid-pigment PVC with carbon loading running full-thickness. The data-center and cleanroom default because wear never exposes a non-conductive core.
- **Forbo Colorex SD** — 2 mm homogeneous dissipative tile. Classic cleanroom/pharma spec.
- **Forbo Colorex EC** — conductive variant (10^4–10^6 Ω). Electronics assembly, EOD.
- **Forbo Colorex Plus** loose-lay system (2023-era platform, the major "new since 2022" move) — 8 mm interlocking dovetail tiles, no field adhesive, rapid renovation of live facilities. Three SKUs:
  - **Colorex Plus EC** — conductive loose-lay, dovetail-connected, bonded to copper ground strip
  - **Colorex Plus Basic** — antistatic only (not full ESD) for retail / warehouse use
  - **Colorex Plus R10** — antistatic with R10 slip-rated texture for wet/powder environments
- **Tarkett iQ Granit SD** — 2 mm permanently dissipative homogeneous sheet + tile, carbon-coloured pigment through the mass + conductive carbon reverse. No-wax-for-life iQ surface restoration. 14 colors. Roll 6'6" × 82'7" or 24"×24" tile. Heavy NA spec for hospital surgical suites, MRI suites, data centers, SMT. *Likely YCI's single strongest cross-sell because Tarkett is already an incumbent.*
- **Gerflor Mipolam EL5** (conductive, 10^4–10^6 Ω) and **Mipolam EL7 / Robust EL7** (dissipative, 10^6–10^8 Ω). 2 mm homogeneous, Evercare PU surface treatment, no wax for life. Common European/healthcare spec, available in Canada.
- **Mannington / Roppe / Flexco** — Roppe ESD Vinyl Static Control Tile and Flexco Delane ESD (both dissipative + conductive variants) are the domestic NA alternatives. Mannington's historic "Static Solutions" line is [UNVERIFIED — no current distinct SKU surfaced in 2026 research; may have been folded into broader commercial sheet range].

**Conductive / dissipative sheet vinyl** — same chemistry as homogeneous tile but in roll form with heat-welded seams. Preferred for cleanroom and wet-process environments where seam count matters.
- **Tarkett iQ Granit SD** (sheet format — see above)
- **Gerflor Mipolam EL5 / EL7 / Biocontrol EL5** (Biocontrol adds antimicrobial for OR/pharma)
- **Polyflor SD/EC** (UK-origin, spot distribution in Canada) [UNVERIFIED for YCI-accessible dealers]

**ESD rubber tile** — carbon-loaded rubber, inherently low-charging (generates less static in the first place than vinyl does), PVC- and plasticizer-free.
- **Staticworx Eclipse EC** — the category's flagship. Manufacturer-described as "the industry's only fault-tolerant, inherently low-charging" ESD floor; holds the ESD Journal Seal of Approval for Class-0 applications. Carbon-chip terrazzo appearance. PVC-free, halogen-free, no plasticizers — relevant for LEED v5 embodied-carbon targets.
- **Staticworx Eclipse GF** — glass-filled variant for heavy static-load environments.
- **Staticworx Architectural SD Rubber** — finished-look variant for control rooms and labs where aesthetics matter.
- Note: "Diamond Plate" as a distinct current Staticworx SKU did not surface in 2026 research and may be a legacy / deprecated name [UNVERIFIED].

**ESD carpet tile** — static-dissipative modular carpet, controls static via conductive fibre or carbon grid in the backing. Not strictly ANSI/ESD S20.20 compliant on its own unless paired with heel-straps, but it's the right product for server-room aisles where people walk in street shoes and the spec only needs <100 V body voltage.
- **Interface ShadowFX SD** — distributed through Staticworx, dissipative range, the go-to spec for data center admin aisles and NOC/SOC floors.
- **Staticworx OhmStyle ESD** — carpet-tile system designed specifically for IDF/MDF rooms and network closets.
- **Milliken** — offers ESD-capable carpet tile; 2024–2025 refresh focus is on product-specific EPDs (LEED v5 material-disclosure credits) more than new ESD SKUs. [UNVERIFIED which specific current Milliken SKU is the active Canadian ESD line.]
- **Shaw Contract / Tandus** — legacy ESD carpet tile lines; [UNVERIFIED whether currently in the 2026 catalog as a distinct family].

**Conductive LVT / LVP** — This is still a thin category in 2026. Most "ESD LVT" offerings are actually ESD homogeneous vinyl tile being marketed in LVT-style visuals, not true multi-layer rigid-core LVT with a wear layer. True click-lock ESD LVT from Shaw / Interface / Karndean / Amtico / Mannington is **[UNVERIFIED — not surfaced in 2026 research]**. If a project needs the LVT aesthetic with ESD function, the current answer is Forbo Colorex Plus (dovetail loose-lay, wood/stone visuals) or Flexco Delane ESD.

**Conductive epoxy / urethane coatings** — seamless poured systems with a carbon-loaded topcoat over a copper grounding grid. Preferred where tiles or sheets won't survive (forklifts, chemical, wet-process, hot-wash).
- **Stonhard Stonshield ESD** — 2 mm (80 mil) decorative slip-resistant textured-broadcast epoxy with static control.
- **Stonhard Stonkote ESD** (recent) — the new thin-film entry, pigmented glossy epoxy with **carbon nanotube** conductive loading (distinct from legacy carbon-black chemistry — CNTs give lower, more stable resistance values with less topcoat loading and better colour stability). This is the most meaningful "new since 2022" move on the epoxy side.
- **Sika Sikafloor-200 ESD** — 4-component ESD epoxy coating system, ANSI/ESD S20.20-2021 compliant.
- **Sika Sikafloor-220 W Conductive** — water-based 2-component conductive primer, pairs with Sikafloor 200C ESD for the full ESD stack. Water-based is the green-spec move (low-VOC, LEED-friendlier than solvent).
- **Dur-A-Flex Hybri-Flex ESD** — hybrid epoxy/urethane; Dur-A-Flex is now under the **Sherwin-Williams High Performance Flooring** umbrella, which puts it on Sherwin's commercial spec sheets including a dedicated "Data Center Flooring" program.
- **Dex-O-Tex** — separate resin-flooring brand with a data-center-specific ESD epoxy line.

**Raised access flooring with ESD top (the hyperscale combo)**
- **Tate (owned by Kingspan since 2019)** — the dominant NA raised-access brand for hyperscale AI data centers. Current platform emphasis is 3,000+ lb point-load panels, directional airflow panels, and integration with **liquid cooling** (chilled-water manifolds dropped through the plenum) for AI GPU racks at 50–100 kW densities. ESD laminate finishes (HPL + conductive backer) are factory-bonded to steel-cementitious or woodcore panels — the combined "PL4 ESD panel" is the spec for Tier III/IV hyperscale white space.
- **Kingspan RMG** — European raised-access line, same parent company as Tate.
- **Haworth TecCrete** — steel-cementitious PL4+ with ESD laminate options; Canadian channel via Camino Systems (Toronto) is a known YCI-adjacent relationship.
- **2024–2026 market shift:** hyperscale builds are specifying **raised floor + ESD combined as a single line item**, not two separate trades. That changes the bid structure — the floor trade that can deliver both wins the scope.

## Install techniques

| Technique | Substrate | Best for | Notes |
|---|---|---|---|
| Full-spread conductive adhesive over copper grid | Concrete, CSP 2, F710 compliant | ESD vinyl sheet/tile, conductive carpet tile | The adhesive IS the ground path — substitute at your peril |
| Loose-lay dovetail interlock (Colorex Plus) | Concrete or existing floor | Renovations of live facilities, no downtime | Bonded to perimeter copper ground strap via dovetail chain |
| Heat-welded sheet over copper grid | Concrete, F710 | Cleanrooms, OR, pharma (minimum seams) | Weld rod can be conductive or matching; verify per spec |
| 3-coat epoxy with integral copper grounding grid | Concrete, shot-blasted CSP 3–4 | Industrial, chemical, forklift, wet process | Conductive primer + mid-coat + carbon-loaded topcoat |
| Conductive underlayment + modular carpet tile | Concrete, F710 | Server room aisles, NOC/SOC floors | Lower compliance bar than hard-surface ESD |
| Factory-bonded ESD finish on raised-access panel | Pedestal grid over structural slab | Hyperscale data halls, mission-critical | Panels arrive pre-finished — field install is mechanical only |

### Anatomy of a working ESD floor (modern 2026 version vs 1990s)
**1990s approach:** homogeneous lino or vinyl tile, copper perimeter strap, copper drain every ~1,000 sqft, conductive adhesive, annual ohm-meter test, hand-wax ban posted on the wall.

**2026 approach:** same fundamental chain (point-of-ground → copper drain → conductive adhesive/backing → electrically continuous field → footwear → person → workbench), but:
- **Permanent-conductivity materials** — modern homogeneous vinyl and inherent-rubber products don't drift with topical finish wear. The floor is the floor for 15+ years.
- **Carbon nanotube loading** (Stonhard Stonkote ESD and similar) gives flatter, more stable resistance curves across temperature and humidity than legacy carbon black.
- **Factory-bonded raised-access ESD** eliminates the field-adhesive variable for hyperscale — the panel is conductive out of the box, grounded through the pedestal grid to the building steel.
- **Walking body-voltage test (<100 V)** is now the compliance test of record per ANSI/ESD S20.20-2021, replacing pure point-to-ground ohm readings as the authoritative number.
- **Commissioning report** with body-voltage + point-to-ground + point-to-point + vertical resistance is expected on handover, not an afterthought.

**The chain is only as strong as its weakest seam.** Cutting a conductive tile with a standard utility knife and laying it with standard VCT adhesive is the single most common way modern ESD installs fail QA.

## Best used for
- **Hyperscale / AI data centers and server halls** — THE 2024–2026 growth driver. GPU clusters, 50 kW+ racks, 400/800 V DC distribution. Stray ESD events on live GPU boards can kill $40k–$100k cards and corrupt multi-day training runs. ESD is now a white-space-wide spec, not a closet spec.
- **Enterprise server rooms, MDF / IDF / telecom closets**
- **Electronics manufacturing (SMT lines, PCB assembly, semiconductor fab support areas)**
- **MRI / cath lab / imaging control rooms** — the control console, not the magnet bore
- **Operating rooms and anaesthetizing locations** — NFPA 99 requirement
- **Pharma / life-science cleanrooms** — Colorex SD is the historical default
- **Munitions, propellant, EOD handling** — conductive class only
- **Aerospace / defence assembly** — relevant to Ottawa-Gatineau DND/DRDC tenant fit-outs
- **Battery / UPS rooms** (data center + EV manufacturing) — ESD + chemical resistance combo
- **Broadcast / studio master control**

## Best NOT used for
- Residential, retail (except where antistatic-only Colorex Plus Basic is specified for image/cleanability reasons — not true ESD)
- General commercial office space — the budget doesn't justify it; use standard carpet tile
- Outdoor / exterior — no ESD system is UV-rated for sun exposure
- Wet-chemical environments where even conductive adhesive would be attacked — go to Stonhard/Sika epoxy instead of tile
- Budget-driven tenant improvements — ESD is a 2–4× multiplier on finished floor cost

## Standards & spec references

| Standard | Body | Applies to |
|---|---|---|
| **ANSI/ESD S20.20-2021** | ESDA (EOS/ESD Association) | Facility-level ESD control program; flooring systems must produce <100 V body voltage in walking test; floors must measure <1 × 10^9 Ω to ground |
| **ASTM F150-06 (2018)** | ASTM | Electrical resistance of conductive/dissipative resilient flooring — 5 lb NFPA probes, 3 ft separation, known voltage |
| **IEC 61340-4-1** | IEC | International equivalent of F150; resistance to ground, point-to-point, vertical resistance, 10^4–10^13 Ω range |
| **IEC 61340-5-1** | IEC | Facility-level ESD program (European counterpart to S20.20) |
| **ESD TR53** | ESDA | Compliance verification technical report — periodic audit procedures |
| **ANSI/ESD STM97.1 / STM97.2** | ESDA | System body-voltage test methods — the <100 V walking test itself |
| **NFPA 99** | NFPA | Healthcare Facilities Code — static control in anaesthetizing locations |
| **Motorola R56** | Motorola Solutions | Telecom communication site standards |
| **ATIS 0600321** | ATIS | Telecom central office environmental |
| **FAA 019f** | FAA | Air traffic control facility power/grounding |
| **MIL-PRF-32752** | US DoD | Military ESD floor specification |

## Substrate prep requirements
- Moisture per **ASTM F2170** (in-situ RH probes, ≤ 75% for most systems, ≤ 85% for selected Tarkett/Forbo) and **F1869** (MVER ≤ 3 lb per 1000 sqft / 24 hr)
- pH 7–9 per **ASTM F710**
- Flatness ≤ 3/16" in 10' (tile) or ≤ 1/8" in 10' (sheet heat-weld)
- CSP 2 for tile/sheet adhesive bond; CSP 3–4 for epoxy systems (shot-blasted)
- Copper grounding strap: 1" × 0.005" adhesive-backed copper foil, laid under field in a grid pattern (typically 20–40 ft spacing), bonded to building ground at minimum two points per 1000 sqft via ground drain
- Conductive primer where the adhesive manufacturer requires it

## Supplier brands (verified)

| Brand | Sub-product line | URL | Confirmed at YCI? |
|---|---|---|---|
| **3M** | **3M static-dissipative tile (the YCI-confirmed primary SDT brand — install ritual: leave one labelled "NO WAX" tile in every install)** | 3m.com | **YES — confirmed primary SDT supplier 2026-04-07** |
| Forbo Flooring Systems | Colorex SD, EC, Plus (EC/Basic/R10) — dovetail loose-lay | forbo.com/flooring | YES — shared Forbo account with Marmoleum + Coral |
| Tarkett | iQ Granit SD (sheet + tile), Johnsonite ESD rubber | commercial.tarkett.ca | YES (incumbent Tarkett dealer) |
| Staticworx | GroundSafe — Eclipse EC rubber, Eclipse GF, Architectural SD Rubber, ShadowFX SD carpet (distributes Interface), OhmStyle carpet, AmeriWorx vinyl | staticworx.com | [UNVERIFIED — confirm Canadian dealer status] |
| Gerflor | Mipolam EL5 (C), EL7 / Robust EL7 (SD), Biocontrol EL5 | gerflor.com | [UNVERIFIED for YCI direct account] |
| Interface | ShadowFX SD carpet tile (via Staticworx) | interface.com | Interface account YES; ESD SKU via Staticworx channel [UNVERIFIED] |
| Milliken | ESD-capable carpet tile (specific 2026 SKU unconfirmed) | milliken.com/flooring | [UNVERIFIED current ESD SKU] |
| Shaw Contract / Tandus | Legacy ESD carpet tile | shawcontract.com | [UNVERIFIED whether still active in 2026 catalog] |
| Mannington Commercial | Static Solutions | manningtoncommercial.com | [UNVERIFIED — current distinct SKU line not surfaced] |
| Roppe | ESD Vinyl Static Control Tile | roppe.com | [UNVERIFIED Canadian distribution] |
| Flexco | Delane ESD Vinyl (dissipative + conductive) | flexcofloors.com | [UNVERIFIED] |
| Polyflor | SD / EC sheet + tile | polyflor.com | [UNVERIFIED Canadian dealer] |
| Stonhard | Stonshield ESD, Stonkote ESD (CNT loading — 2024+) | stonhard.com | YES (covered in epoxy card) |
| Sika | Sikafloor-200 ESD, Sikafloor-220 W Conductive, Sikafloor 235/381 ESD | usa.sika.com | YES |
| Dur-A-Flex (Sherwin-Williams HPF) | Hybri-Flex ESD | sherwin-williams.com (Data Center program) | YES via Sherwin channel |
| Dex-O-Tex | Data center ESD epoxy systems | dex-o-tex.com | [UNVERIFIED] |
| Tate (Kingspan) | Raised-access panels with factory-bonded ESD laminate, PL4+ | tateglobal.com | [UNVERIFIED dealer — Kingspan channel applies] |
| Haworth TecCrete | PL4 cementitious steel panels with ESD finish | haworth.com | Relationship via **Camino Systems (Toronto)** — known YCI-adjacent |
| SelecTech | FreeStyle ESD interlocking tile (loose-lay retrofit) | staticstop.com | [UNVERIFIED] |

## MSDS / SDS resources
- Forbo Colorex SDS portal: forbo.com/flooring > downloads > ESD & Cleanroom
- Tarkett SDS: commercial.tarkett.ca/resources
- Staticworx SDS: staticworx.com/directory/safety-data-sheets
- Sikafloor SDS: usa.sika.com document library
- Stonhard SDS: stonhard.com/resources
- FloorScore / CDPH 01350: most homogeneous ESD vinyl products carry FloorScore certification
- EPDs: LEED v5 (ratified March 2025) pushes embodied carbon to the front of materials credits — Milliken, Interface, Forbo, Tarkett all have current product-specific EPDs; Staticworx Eclipse EC rubber is PVC-free, the LEED-friendliest option in the category

## Maintenance

### The "no wax" rule (this is real — and it's the single most important maintenance fact in the category)
**Wax, floor polish, acrylic finish, sealer, or any topical coating destroys the conductivity of an ESD floor and voids ANSI/ESD S20.20 compliance.** The conductive network lives in the adhesive, the tile body, and the grounding grid — a film of wax is an insulator that electrically floats the whole floor off ground. Every manufacturer (Forbo, Staticworx, Tarkett, Gerflor, Flexco) publishes the same warning in bold on page one of their maintenance guide.

**Canonical trade terminology for the no-wax practice:** Staticworx, Forbo, Tarkett all call it "**no wax / no finish / no topical polish**" in their maintenance guides — there's no single folkloric name across the industry. But the **install ritual is real and YCI-confirmed:**

> **YCI INSTALL PRACTICE (confirmed 2026-04-07):** Young Carpets installs a labelled "**NO WAX**" tile as part of every static-dissipative tile install — specifically for the **3M static-dissipative tile**, which must never be waxed because waxing kills the conductivity. The "NO WAX" tile sits in the field as a permanent visual signal to the cleaning crew. This is the canonical YCI version of the witness-tile practice, and 3M is the primary SDT brand YCI installs.
- The formal version that manufacturers DO prescribe: post an **ESD Floor Maintenance Placard** at the janitor closet / BMS station listing approved neutral-pH cleaners and explicitly banning wax/polish/finish. Staticworx and Forbo publish printable placards.
- Modern permanently-conductive products (Tarkett iQ surface restoration, Gerflor Evercare PU, Staticworx Eclipse inherent rubber) advertise "**no wax for life**" as a feature — the factory finish IS the finish, and the compliance risk from a well-meaning cleaner is reduced but not eliminated.

### Routine
- Daily: dust-mop or HEPA vacuum
- Weekly: damp-mop with manufacturer-approved **neutral-pH ESD cleaner** (Staticworx ESD Cleaner, Forbo Colorex Cleaner, or generic neutral-pH)
- Never: strippers, solvent cleaners, acrylic finishes, butcher's wax, general-purpose floor polish
- Annual: **re-test point-to-ground and body-voltage** with a calibrated megohmmeter (AEMC 6536 or equivalent) and 5 lb NFPA probes per ASTM F150 / IEC 61340-4-1. Document per ESD TR53 for the facility S20.20 audit file.

### Periodic / restorative
- Buff with white or red pad (never black — too aggressive)
- For Tarkett iQ: use the iQ surface-restoration process (dry mechanical, no chemical strip)
- For Eclipse rubber: wet-scrub with neutral cleaner; no buffing needed
- For epoxy systems: light abrade + recoat topcoat every 5–10 years depending on wear

## Pricing notes (range only — 2026 Ottawa CAD, installed)
- Forbo Colorex SD / EC homogeneous vinyl tile: **$12–22 /sqft**
- Forbo Colorex Plus loose-lay (dovetail): **$16–26 /sqft** (premium for no-adhesive / no-downtime install)
- Tarkett iQ Granit SD sheet or tile: **$14–24 /sqft**
- Gerflor Mipolam EL5 / EL7: **$14–24 /sqft**
- Staticworx Eclipse EC rubber: **$18–32 /sqft** (premium — the Class-0 spec)
- Staticworx ShadowFX / OhmStyle SD carpet tile: **$10–18 /sqft**
- ESD 3-coat epoxy with copper grid (Stonhard / Sika / Dur-A-Flex): **$14–28 /sqft**
- Stonhard Stonkote ESD (CNT thin-film): est **$10–18 /sqft** [UNVERIFIED — newer product]
- Raised-access panel with factory-bonded ESD laminate (Tate / Kingspan / Haworth TecCrete, PL4 hyperscale): **$38–58 /sqft** (the full-stack hyperscale number)
- Copper grounding strap, drains, bond-to-ground: **$1.50–3.00 /sqft** add
- Post-install ANSI/ESD S20.20 + body-voltage test report + placard kit: **$800–2,500** flat per project
- Never publish exact prices on the marketing site — these are internal estimating ranges

### Lifecycle note
Permanent-conductivity modern systems (iQ Granit SD, Eclipse, Colorex) carry 15–25 year warranties and eliminate the annual waxing cycle, so total cost of ownership beats 1990s-vintage lino-plus-copper-strip by an estimated 30–50% over 20 years even at higher install cost. That's the pitch for upgrade bids against existing ESD floors in Ottawa telecom COs and federal data centers.

## Related products
- [specialty](specialty.md) — Sub-card 2 (Raised Access) and Sub-card 1 (Epoxy) overlap heavily; hyperscale bids typically bundle raised-access + ESD as one scope
- [sheet-vinyl](sheet-vinyl.md) — Forbo Colorex shares the Forbo Canada account with Marmoleum + Coral; Tarkett iQ Granit SD is in the same Tarkett sheet-vinyl family as iQ Optima and iQ Toro
- [rubber](rubber.md) — Staticworx Eclipse is carbon-loaded rubber; Nora and Johnsonite have non-ESD rubber lines in parallel SKUs
- [carpet-tile](carpet-tile.md) — Interface ShadowFX, OhmStyle and Milliken ESD carpet tile are specified through the same dealer channels as standard carpet tile

## Open research questions
1. **Staticworx Canadian dealer network** — is YCI on the installer list? Direct factory channel or through a distributor?
2. **Forbo Colorex Plus (dovetail loose-lay)** — pricing vs. full-adhesive Colorex SD; is the premium justified for hyperscale retrofit bids where downtime is the gating factor?
3. **Tarkett iQ Granit SD** — given the Tarkett incumbency, is this the easiest first ESD project for YCI to win? What's the Tarkett Canada margin on SD vs. standard iQ Optima?
4. **Stonhard Stonkote ESD (CNT carbon nanotube)** — confirm availability in Canada through Stonhard Canada; confirm pricing; confirm it's the same Stonhard relationship as Stonshield.
5. **Sherwin-Williams HPF (Dur-A-Flex) Data Center program** — is Sherwin running a dedicated installer certification for their data-center ESD stack? YCI access?
6. **Hyperscale raised-access + ESD combined bids** — which Ottawa hyperscale projects (Microsoft, AWS, Google, Equinix, Cologix) have the factory-bonded ESD panel spec vs. field-applied ESD over standard panels? What's the minimum bid size where the combined scope wins?
7. **Camino Systems (Toronto) / Haworth TecCrete** — can the existing partnership extend into the ESD panel finish SKU, or is that a separate channel?
8. **S20.20 post-install test report capability** — does YCI own/rent a calibrated megohmmeter and have a staff member trained and logged to issue S20.20-compliant walking-body-voltage reports? This is the #1 procurement gap to close; it's the difference between sub-bidding and prime-bidding data-center ESD scopes.
9. **LEED v5 embodied-carbon angle** — Staticworx Eclipse (PVC-free rubber) and Forbo Colorex (bio-based plasticizer option) are the two ESD products with the strongest EPD story. Which federal Ottawa data-center specs require EPD disclosure?
10. ~~**"No-wax witness tile" folk practice**~~ **CONFIRMED 2026-04-07:** YCI installs a labelled "NO WAX" tile in every 3M static-dissipative install. This is real, current YCI practice — bake into all SDT customer-facing copy.
11. **Conductive LVT (true rigid-core click-lock)** — is any manufacturer actually shipping this in 2026? Research did not surface a clear product. User may know of one from a trade show.
12. **Canadian distribution matrix** — a clean table of which of the 18 brands above have confirmed Canadian dealers and which are sell-through-USA only.

## Verification log
- **2026-04-07** — Full file authored by Flooring Expert sub-agent. Hyperscale data center build-out 2024–2026 identified as the #1 growth driver. Tarkett iQ Granit SD flagged as YCI's lowest-friction first ESD win (existing incumbency). Forbo Colorex Plus dovetail loose-lay flagged as the headline Forbo "new since 2022" platform. Stonhard Stonkote ESD with carbon nanotube loading flagged as the meaningful 2024+ epoxy innovation. ANSI/ESD S20.20-2021 walking body-voltage test (<100 V) flagged as the procurement gap that separates sub-bidding from prime-bidding on data center ESD scopes.
- **2026-04-07 (user correction)** — User clarified that **3M** is the primary SDT brand YCI installs (added to supplier table at the top, with the YCI-confirmed "NO WAX" witness-tile install ritual). User also clarified that **SDT is old-school and dated** for the front of the marketing site — the SDT product card was demoted from the 10-card grid to the More accordion sub-card. SDT remains a real install scope, but it's a legacy/maintenance category, not a headline marketing card.
