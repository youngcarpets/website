---
product: specialty-other
last-audited: 2026-04-07
auditor: parent-thread (after subagent permission block)
status: planning (NOT YET ON SITE)
sources:
  - .claude/resources/products/specialty.md
  - .claude/resources/products/sdt.md
covers:
  - epoxy / resinous
  - raised access flooring
  - stair treads & nosings
  - wall base
  - ESD / SDT (static dissipative)
---

# Specialty (Non-Matting) — Future Site Content TODO

> Covers everything in the More accordion EXCEPT matting (which has its own card and TODO file). Each sub-product below is a candidate for promotion to its own dedicated card or library page if/when YCI wants the depth.

## Currently on the marketing site
- The "More…" feature card (`+` code) opens a modal accordion with sub-cards: **epoxy**, **raised access**, **stair treads**, **wall base**, **ESD/static** (`moreSubcards` array around line 355 of `+page.svelte`).
- Each sub-card shows a label + a one-line description + a small chevron toggle. No hero visual, no supplier logos, no install detail, no pricing.
- The accordion is functional but treats every "specialty" item as equally important — the actual revenue distribution is wildly uneven (epoxy + raised access + matting are large, treads + base are high-volume but invisible, ESD is niche).

---

## EPOXY / RESINOUS

### Currently on the site
One accordion line under More…: "Chemical-resistant resinous flooring for labs, mech rooms, pharmaceutical, and food processing. Self-levelling and broadcast systems. Sika, Stonhard, Florock, Dur-A-Flex."

**Important context:** the user originally said "WE DON'T DO polished concrete or resinous" and I deleted the resinous research file. Then he reversed: "oh.. we do do EPOXY. i may have said something wrong earlier." → epoxy IS in YCI scope. The depth has not yet been re-researched and the question of "expand the accordion entry vs promote to its own card vs full library page" is still open.

### Missing data — high priority
- **Resinous research file should be re-created** (or resurrected from earlier git history if available). The original audit covered: epoxy + polyurethane + PurCem (cementitious urethane) + MMA, with supplier matrix Sika / Stonhard / Florock / Dur-A-Flex (now under Sherwin-Williams High Performance Flooring), and the data center / brewery / commercial kitchen environment matrix.
- **Sherwin-Williams HPF acquisition of Dur-A-Flex** — recent industry consolidation; YCI's Sherwin-Williams relationship now covers epoxy too. Worth confirming dealer status.
- **PurCem (cementitious urethane)** — the right answer for breweries, commercial kitchens, and any wet-process food plant. Not the same as "epoxy". Misspecified often.
- **Hyperscale data center spec** — combined raised-access + ESD-laminate panels are now spec'd as one line item. Crosses over with raised access (below).

### Suggested next step
Decide depth: (A) expand the accordion line with 3–5 sentences + supplier list, (B) promote epoxy to its own product card with a hero visual (chemical-spill-on-floor animation? data-center-aisle SVG?), or (C) spin out a full library page once research is rebuilt. **User decision required.**

---

## RAISED ACCESS FLOORING

### Currently on the site
One accordion line: "Modular pedestal-supported panels for cable management. Data centres, trading floors, command centres, modern offices. Tate, Haworth TecCrete."

### Missing data — high priority
- **Hyperscale AI data center growth** — Tate (Kingspan-owned) and Haworth TecCrete (via Camino Systems Toronto) are seeing massive 2024–2026 demand from the AI compute build-out. This is the highest-margin growth category on the site.
- **PL4 ESD-laminate combined panels** — the new spec is a single line item that combines the structural raised-access panel + the conductive top finish. Crosses over with ESD (below).
- **Camino Systems Toronto** is the YCI-adjacent relationship for Haworth TecCrete distribution.
- **Tate / Kingspan PL4** load ratings, panel sizes, plenum heights, cable management options.

### Missing data — medium priority
- **Use cases**: server rooms, NOC/SOC floors, broadcast control rooms, modern open-plan offices with raised cable trays, university CS labs.
- **Install crew certification** — raised access requires Tate / Haworth installer training; verify YCI status.
- **Pricing** — $30–80/sf installed depending on panel grade and finish.

### Suggested next step
Promote raised access to its own card OR a featured sub-section under specialty. The hyperscale data center angle is too valuable to bury in an accordion line.

---

## STAIR TREADS & NOSINGS

### Currently on the site
One accordion line: "Moulded rubber and vinyl treads with cast-in slip-resistant nosings. Every institutional stairwell in Ottawa. Johnsonite, Roppe, Musson."

### Missing data — high priority
- **Cast-in vs surface-applied nosings** — the spec-level decision. Cast-in is permanent; surface-applied is replaceable.
- **Photoluminescent nosing strips** — required by some life-safety codes for egress paths.
- **Slip rating + DCOF** for treads (ASTM C1028 / ANSI A326.3).
- **Replacement cycles** — high-traffic institutional stairs need re-treading every 8–15 years depending on substrate.

### Suggested next step
Stair treads are high-volume + low-visibility revenue. Probably stays in the accordion as-is, but the accordion line could expand to 2–3 sentences with the cast-in vs surface trade-off.

---

## WALL BASE

### Currently on the site
One accordion line: "4" and 6" coved or straight vinyl and rubber base for every commercial floor. Johnsonite, Roppe, Tarkett."

### Missing data — high priority
- **Coved vs straight** — coved seals to the floor for hygiene; straight is faster but creates a harborage line. Healthcare requires coved.
- **4" vs 6" height** — code-driven in some applications; aesthetic in others.
- **Profile catalog** — top-set, butt cove, sanitary, thermoplastic rubber, natural rubber.
- **Adhesive families** — base cement vs contact adhesive vs self-stick.
- **Cross-link to flash-coved sheet vinyl** — when a project goes from base to integrated cove (the sheet vinyl story).

### Suggested next step
Wall base is the highest-volume specialty category but the lowest-margin. Probably stays in the accordion. Worth a 2–3 sentence expansion with the coved-vs-straight + 4-vs-6 split.

---

## ESD / SDT (Static Dissipative)

### Currently on the site
One accordion line (after v1.23.10 cleanup): "Static-dissipative tile for electronics manufacturing, server rooms, MRI control rooms, and electronic labs. Installed and tested to ANSI/ESD S20.20 with conductive adhesive and a copper grounding strip. 3M, Staticworx, Forbo Colorex."

### Missing data — high priority
**Important constraint:** the user explicitly removed "old school" + "NO WAX" install ritual references from public copy in v1.23.10. Don't surface those. The internal `sdt.md` research file (covering 3M, Forbo Colorex EC/SD/Plus, Staticworx Eclipse, Tarkett iQ Granit SD, Stonhard Stonkote ESD with carbon nanotube loading, hyperscale data center spec) **exists and could be revived if/when SDT is promoted to its own card again**. Path: `.claude/resources/products/sdt.md`.

- **Hyperscale AI data center driver** — same as raised access. ESD flooring is now spec'd across entire data hall white-space footprints, not just server aisles. GPU clusters can't tolerate sub-100V ESD events.
- **Conductive vs dissipative classes** — ANSI/ESD S20.20 + ASTM F150. Conductive 2.5×10⁴–1×10⁶ Ω; dissipative 1×10⁶–1×10⁹ Ω. Different specs for different applications.
- **The ANSI/ESD S20.20-2021 walking body-voltage test** (<100 V) is the modern compliance test of record — has replaced point-to-ground ohm readings. This is the procurement gap that separates sub-bidders from prime-bidders on data center scopes.

### Suggested next step
SDT is currently the accordion line — appropriate for its market size today. **If the AI data center boom drives ESD demand into a major YCI revenue line, promote SDT back to its own card** and revive `sdt.md` for the deep content. For now, keep accordion line accurate and minimal per the v1.23.10 cleanup.

---

## Suggested information architecture (for the whole specialty area)

The current accordion is the right shape for a "miscellaneous" bucket but treats every entry as equal weight. Restructure as:

1. **Featured specialty cards** (own modal interactions): epoxy, raised access — these are real growth categories
2. **Compact accordion** (current format): treads, wall base, ESD — high-volume but low-marketing-priority items
3. **"Send us your spec" call-to-action** at the bottom — the current "if you have a spec, send it" copy stays as the catch-all for everything else YCI installs that didn't earn its own card or accordion line.

Each promoted card gets the same template as the existing 9 product cards: card → modal → bespoke or info-body interaction → supplier list.

## Standout facts worth featuring (across all specialty)

- **Sherwin-Williams acquired Dur-A-Flex** — YCI's existing Sherwin relationship may now cover epoxy without a new dealer agreement.
- **PurCem (cementitious urethane)** is the only correct chemistry for breweries + commercial kitchens — plain epoxy fails under hot wash + thermal shock.
- **Hyperscale AI data center build-out** is the #1 growth driver for raised access + ESD in 2024–2026. Combined PL4-ESD panel spec is the highest-margin scope in the category.
- **Camino Systems Toronto** is the YCI-adjacent Haworth TecCrete distribution channel.
- **Forbo Colorex Plus** dovetail loose-lay (2023+ platform) is the major "new since 2022" Forbo move on the ESD side.
- **Stonhard Stonkote ESD with carbon nanotube loading** is the meaningful 2024+ epoxy innovation — flatter resistance curves than legacy carbon-black chemistry.

## Open questions for the user

- **Epoxy depth decision** — accordion expansion / own card / full library page? (User has reversed the earlier rejection.)
- **Resinous research file** — recreate from scratch, or pull from earlier git history if it exists?
- **Sherwin-Williams HPF dealer status** — does YCI's existing Sherwin relationship cover the Dur-A-Flex epoxy line?
- **Camino Systems Toronto / Haworth TecCrete** — is this a confirmed YCI partnership, or aspirational?
- **Tate / Kingspan dealer status** — direct or via a Canadian distributor?
- **Hyperscale data center experience** — does YCI bid the AI build-outs, or refer to a specialist? This decides whether raised access + ESD get promoted to their own cards.
- **Stonhard Canada relationship** — does YCI carry Stonhard PurCem + Stonkote ESD lines?
- **Sub vs self-perform** for epoxy installs — the resinous trade is often subcontracted; clarify YCI's actual scope.
- **Stair tread refurbishment contracts** — recurring revenue play; does YCI offer this as a named service?
