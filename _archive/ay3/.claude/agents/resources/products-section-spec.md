# YCI Product Section — Per-Card Specification

> Source: 2026-04-07 user direction + Design + Research agent expansion.
> Companion to mobile handoff item 5. All 8 cards detailed for implementation.
> Read-only planning deliverable. No code changes implied — this drives the next implementation pass.

---

## Context recap (do not lose)

**Young Carpets Inc.** — commercial flooring contractor based in Ottawa, Ontario, Canada. Serving the National Capital Region since 1991. Customers: hospitals, schools, government buildings, offices, fitness/sports facilities, institutional, retail. **Not residential. Not a cleaner.** HST is 13% (Ontario). Jurisdiction is Canada — earlier agents wrongly assumed Australia. Do not repeat that.

The product section lives at `/young-carpets` on the marketing site. Currently 6 feature cards render in `featureProducts[]` (around line 39 of `+page.svelte`); this spec expands to **8 locked cards** and adds an interactive modal layer.

**Existing data shape (lines 18–31):**
```ts
type Product = {
  name: string;
  code: string;
  badges: string[];
  blurb: string;
  details?: string;
  material: 'carpet' | 'carpet-tile' | 'lvt' | 'hardwood' | 'rubber' | 'ceramic';
  image?: string | null;
};
```

This will need to extend to: add `'sheet'` and `'more'` material keys, add an `installPatterns?: InstallPattern[]` array for cards that morph, and add a `useCases?: UseCase[]` array for cards that scroll a use-case gallery instead.

---

## Global pattern

- **Grid:** 2-column on mobile (iPhone 13 Pro Max baseline = 428 CSS px viewport). `min-height: 14rem` per card. Card grid lives inside `.yc-products-grid` (line 595). Closed cards keep the existing inline-SVG hero texture as their resting visual — the textures are good and on-brand, leave them in place.
- **Modal interaction:** Tap card → existing `showProduct(p)` → modal opens at `.yc-modal` (line 966+). Modal body is the playground for the per-card interactive content described below. Existing close affordance, ESC handler, focus trap, and CTA buttons stay; the spec only adds *content layers* between the heading and the CTA row.
- **Pill rule (locked, Standing Design Rule #1):** Show pills on a card or modal **only when there are ≥6** to display (3 per row × 2 rows minimum). Below 6, use a minimalist layout: hero icon + short description + supplier links + plain text bullets. Pill labels ≤12 chars, no mid-pill wrap, no orphans.
- **Accessibility floor:**
  - All interactive elements ≥44×44 CSS px.
  - `prefers-reduced-motion: reduce` disables every morph/flip/scroll-gallery animation; static fallback shows the *first* state with a simple labeled list of the other states underneath.
  - Modal is `role="dialog"` `aria-modal="true"` `aria-labelledby="yc-modal-title"`.
  - Pill controls are real `<button>` elements with `aria-pressed` for the active pattern.
  - Flip cards expose both faces to screen readers via `aria-live="polite"` on a status node.
- **Voice:** Confident, technical, contractor-grade. Institutional/government tone, not residential showroom. "We install…" / "Suitable for…" / "Specify…" — never "Transform your space" or "Beautiful floors for your home."
- **Jurisdiction:** Ontario, Canada. HST 13%. CCDC 2 stipulated price contracts familiar territory. Pricing not shown on the site.

---

## Card 1 — Carpet (broadloom)

**Hero icon (closed card):** Existing SVG of vertical pile tufts (line 613–627). Keep. Reads as "carpet pile" at a glance.

**Card heading:** `CARPET` (large heading font, `.yc-product-name`).

**Closed-state pills:** Minimalist (no pills). Only 2 obvious facets (broadloom roll, custom inlay) — well below the 6-pill threshold. Card body shows `CPT` code + `Carpet` name + the existing one-line blurb.

**Modal interaction concept:** **Scrolling use-case gallery.** Broadloom doesn't have many distinct install "patterns" — it's roll goods, you seam it. So the playful element is a horizontally-snapping gallery of use-case scenes (corporate floor, conference room, hotel ballroom, theatre, library) rendered as small stylized SVG vignettes. Auto-advances every 4s; user can swipe/drag to scrub. Pause on tap. No autoplay if reduced-motion.

**Modal content sections:**
- **Install techniques:**
  - **Direct glue-down** — adhesive trowelled to substrate, broadloom rolled and seam-sealed. Standard for offices and corridors.
  - **Double-stick** — cushion underlay glued to slab, carpet glued to cushion. Used in ballrooms and boardrooms for acoustics and underfoot comfort.
  - **Stretch-in over pad** — tackless strip perimeter with separate cushion. Less common in commercial work; specified mostly for executive suites.
  - **Power-stretched seams + heat-seam tape** — invisible joins between rolls; required for any installation over 100 ft².
- **Best used for:**
  - Government and corporate office floors (Class A and Class B buildings)
  - University lecture halls and library reading rooms
  - Hotel ballrooms, conference centres, convention space
  - Theatres, auditoriums, places of worship
  - Long corridors where seam control matters
- **Supplier brands (broadloom):**
  - Tarkett (confirmed in current `suppliers[]`)
  - Beaulieu Canada (confirmed)
  - Shaw Contract (confirmed)
  - Mohawk Group (confirmed)
  - Interface (verify — primarily tile, but they do broadloom too)
  - Mannington Commercial (verify — not in current list, common Canadian commercial supplier)
- **CTA:** "Email about Carpet" + "Call 613-744-2744" (existing modal CTA pattern, do not change).

**Animation budget:**
- Use-case gallery: CSS scroll-snap with `scroll-behavior: smooth` and a 4s `setInterval` advance. ~60 LOC.
- Reduced-motion: gallery becomes a vertical static list with one screenshot per use-case.

**Drafted modal copy:**
> Broadloom carpet for institutional and corporate environments. We supply and install rolled carpet from every major commercial mill — including custom-coloured and custom-patterned goods on request. Broadloom is the right call when you need uninterrupted visual flow across a large floor, when acoustic dampening matters, and when you can plan around seam locations during specification.
>
> Our crews are trained on direct glue-down, double-stick over cushion, and power-stretched installations. Heat-welded seams disappear under traffic. Sample boards and on-site mockups available for design teams during specification.

---

## Card 2 — Carpet Tile

**Hero icon (closed card):** Existing 3×3 grid of staggered rounded squares (line 629–641). This is the user's reference image — keep it.

**Card heading:** `CARPET TILES`.

**Closed-state pills:** Minimalist (no pills on the closed card). The card stays clean; the *modal* is where the pattern morph lives.

**Modal interaction concept:** **The signature playful interaction.** A 6×6 SVG grid of carpet tiles fills the upper third of the modal. Six pill controls beneath let the user toggle the install layout. Tiles smooth-morph (FLIP transition or simple `transform` + `transition`) between layouts in ~400ms with stagger. This is the user's "fun" demo — make it the best one.

**Install pattern pills (exactly 6, satisfies the ≥6 rule):**
1. `MONOLITHIC` — every tile arrow same direction. Looks like broadloom.
2. `QUARTER` — quarter-turn / checkerboard rotation; alternating 90°.
3. `BRICK` — ashlar / running bond; rows offset by half a tile.
4. `HERRINGBONE` — 45° interlocked planks (only meaningful for plank format; spec note: animate the 6×6 reshaping into 3:1 plank aspect when this pill is active).
5. `RANDOM` — non-directional; each tile a random rotation.
6. `ASHLAR` — brick offset perpendicular to traffic.

Pill labels are all ≤12 chars. Two rows of three pills on the 428px modal width.

**Modal content sections:**
- **Install techniques:**
  - **Full-spread glue-down** — adhesive trowelled across the whole substrate. Highest stability; specify for high-traffic corridors.
  - **Tackified release adhesive** — pressure-sensitive adhesive holds tiles down but allows individual tile lift-out for replacement. The default for offices.
  - **Peel-and-stick (self-adhered)** — factory-applied adhesive backing. Fast install, no wet adhesive on site — useful for occupied buildings and after-hours work.
  - **Loose-lay (large-format only)** — relies on tile weight + edge friction. Limited substrate types.
- **Best used for:**
  - Open-plan offices and workstation pods (replace tiles individually as wear shows)
  - Schools and universities where damage replacement is routine
  - Government offices with security cable trenches that need access
  - Any space where future furniture reconfiguration is expected
  - Raised access floor systems (paired with the right adhesive)
- **Supplier brands (carpet tile):**
  - Interface (confirmed — flagship carpet tile brand)
  - Shaw Contract (confirmed)
  - Mohawk Group (confirmed)
  - Tarkett / Tandus Centiva (verify — Tarkett owns Tandus, the tile name varies)
  - Patcraft (confirmed)
  - Mannington Commercial (verify)
  - Milliken (verify — premium commercial tile, not in current `suppliers[]`)
- **CTA:** Standard email + call buttons.

**Animation budget:**
- Tile morph: 36 SVG `<rect>` nodes with reactive `transform` derived from selected pattern. CSS `transition: transform 400ms cubic-bezier(.2,.9,.25,1.05)`. Stagger via per-tile `transition-delay: calc(var(--i) * 8ms)`.
- Reduced-motion: 6 small static SVGs displayed in a 3×2 grid, labels under each. No transitions.

**Drafted modal copy:**
> Modular carpet tile in 24×24, 18×36, and plank formats from Interface, Shaw Contract, Mohawk, Patcraft, Tarkett and more. Tile is the right answer for almost every modern office, school, and government floor — wear hides between modules, individual tiles lift out for replacement, and the install pattern itself becomes a design tool.
>
> Try the patterns above. Each one changes how the floor reads underfoot: monolithic looks like broadloom, quarter-turn hides directionality, ashlar guides traffic, herringbone makes a strong design statement.

---

## Card 3 — LVT / VCT / SCT

**Hero icon (closed card):** Reuse existing LVT plank SVG (line 643–652). Keep.

**Card heading:** `LVT · VCT · SCT` (middle dots, not slashes — reads cleaner at the heading scale).

**Closed-state pills:** Minimalist (no pills). The three sub-products are surfaced *inside* the modal, not on the card.

**Modal interaction concept:** **Three-tab glass sub-interface.** The top of the modal has a segmented control with three tabs: `LVT`, `VCT`, `SCT`. Tapping a tab fades/slides the modal body content (use-case + install + suppliers) for that sub-product. Each tab has its own little hero animation:
- **LVT tab:** plank stagger morph (3 patterns: stagger, herringbone, brick) — smaller version of the carpet-tile demo
- **VCT tab:** scrolling use-case gallery — schools, hospitals, transit, retail back-of-house
- **SCT tab:** material cross-section diagram showing the homogeneous wear layer (key spec point)

This gives the card three personalities without three cards.

**Tabbed sub-product content:**

### LVT — Luxury Vinyl Tile / Plank
- **What it is:** Multi-layer flexible vinyl with a high-resolution print film and a wear layer (typically 20–30 mil for commercial). Visually mimics wood, stone, or abstract textures. The most-specified resilient flooring in commercial work today.
- **Install techniques:**
  - **Glue-down (dryback)** — full-spread or pressure-sensitive adhesive. Most stable; the standard for high-traffic commercial. 20–30 mil wear layer.
  - **Click-lock (floating)** — mechanical edge profile, no adhesive. Faster install, allows substrate movement. Good for retrofit over old VCT.
  - **Loose-lay (rigid core)** — heavy planks held by friction and perimeter glue. Quick replacement.
- **Install patterns:** stagger plank (1/3 offset standard), herringbone, brick (1/2 offset), random.
- **Best used for:** healthcare corridors (with welded seams), retail, hospitality, education, multi-tenant office. Acoustic-backed variants for multi-storey builds.
- **Suppliers:** Tarkett (confirmed), Shaw Contract (confirmed), Mohawk Group (confirmed), Armstrong Flooring (confirmed), COREtec (confirmed), Mannington (verify), Karndean (verify — common in Canadian commercial spec).

### VCT — Vinyl Composition Tile
- **What it is:** Rigid 12×12 vinyl tile, mostly limestone filler with a small percentage of vinyl binder. Requires stripping and waxing for the floor finish — that's a feature, not a bug, for institutions with maintenance staff.
- **Install techniques:**
  - **Full-spread acrylic adhesive** — the only real method. Spread, flash, set tile, roll.
  - **Pattern layout** — straight grid is standard; quarter-turn occasionally specified for visual interest.
- **Best used for:** schools (gymnasium corridors, classrooms), hospitals (back-of-house, mech rooms, lab support), transit stations, big-box retail back-of-house, government cafeterias. Anywhere you have a maintenance crew that strips and waxes on a schedule.
- **Suppliers:** Armstrong Flooring (confirmed — the legacy VCT brand), Tarkett / Azrock (verify), Mannington (verify).

### SCT — Solid Vinyl Tile / Sheet
- **What it is:** Homogeneous vinyl through the entire thickness — no print film, no separate wear layer. The colour and pattern run all the way through. Specified where extreme wear, chemical resistance, or seam-welding for hygiene matters.
- **Install techniques:**
  - **Heat-welded seams** — sheet goods seamed with PVC welding rod, melted into routed grooves. Creates a continuous waterproof membrane.
  - **Flash coved walls** — sheet rolled up the wall 4–6", forming a base with no horizontal seam at the floor/wall transition. Standard for OR theatres, ICUs, food service.
  - **Glue-down tile format** — when used in tile form, full-spread adhesive only.
- **Best used for:** operating theatres, ICUs, isolation rooms, pharmacy clean rooms, lab spaces, commercial kitchens, food prep, decontamination zones.
- **Suppliers:** Forbo (confirmed — Marmoleum for linoleum, Sphera for SCT), Tarkett (confirmed), Gerflor (confirmed), Nora (confirmed — premium rubber/SCT crossover), Polyflor (verify), Altro (verify — heavily specified in Canadian healthcare).

**Pills present in this modal?** The three tabs themselves are not pills; they're a segmented control. Within each sub-tab, install-pattern pills only appear on the **LVT** tab and there are exactly 4 (`STAGGER`, `BRICK`, `HERRING`, `RANDOM`) — below the 6-pill threshold, so represent them as a small inline icon row instead, *not* as pill buttons. Stay consistent with the rule.

**Modal content sections (shared structure across tabs):**
- Install techniques (detailed above per tab)
- Best used for (per tab)
- Supplier brands (per tab)
- CTA: Standard email + call buttons. Email subject line appends the active tab: `Inquiry: LVT` / `Inquiry: VCT` / `Inquiry: SCT`.

**Animation budget:**
- Tab switch: 200ms cross-fade + 8px slide. `transition: opacity, transform`.
- LVT pattern morph: same primitive as carpet-tile, smaller grid (4×8 planks).
- VCT gallery: scroll-snap horizontal, same as Carpet card.
- SCT cross-section: animated stroke-dasharray draw-on of layer labels, plays once on tab activate.
- Reduced-motion: all three tabs become stacked sections, no animations, no auto-play.

**Drafted modal copy (intro before tabs):**
> Three vinyl flooring families under one roof. LVT for design-led commercial spec. VCT for institutional durability with a maintenance crew. SCT and homogeneous sheet for healthcare and lab environments where heat-welded seams and flash-coved walls are mandatory. Tap a tab to see what each does best.

---

## Card 4 — Hardwood

**Hero icon (closed card):** Existing parquet-style staggered plank SVG (line 654–671). Keep.

**Card heading:** `HARDWOOD`.

**Closed-state pills:** Minimalist (no pills). Card stays clean.

**Modal interaction concept:** **Flip cards.** Per the user direction: a row of 3 flippable cards inside the modal — `SOLID`, `ENGINEERED`, `PARQUET` — each card flips on tap to reveal the spec sheet on the back. Front face shows a stylized cross-section illustration; back face shows specs (wear layer, thickness, finish options, install method, environments). Use CSS 3D transform with `backface-visibility: hidden`. Tap-to-flip; one card open at a time.

**Closed-card flip count = 3, but these are not "pills"** — they are touchable spec cards, ~120×160 px each. Tap targets pass the 44px floor easily. They live below the modal heading.

**Modal content sections:**
- **Cross-section flip cards:**
  - **SOLID hardwood** — 3/4" solid plank, multiple species (red oak, white oak, maple, ash). Site-finished or pre-finished. Can be screened and recoated multiple times, fully refinished 3–5 times over its life. Nailed to plywood subfloor. **Best for:** showrooms, executive offices, heritage buildings, university common rooms.
  - **ENGINEERED hardwood** — Multi-ply veneer with a real wood wear layer (commonly 2–6mm). Dimensionally stable across humidity swings. Can go over concrete with the right vapour control. Glue-down or click-lock floating. Refinishable depending on wear layer thickness. **Best for:** commercial offices, hospitality, retail, anywhere with a slab-on-grade or radiant heat.
  - **PARQUET / PATTERN** — herringbone, chevron, basketweave, Versailles panels. Engineered or solid block. Specified for design-statement spaces. **Best for:** boutique hotels, restaurants, luxury retail, executive boardrooms.
- **Install techniques:**
  - **Nail-down** (over plywood subfloor; solid only)
  - **Glue-down** (engineered over slab or plywood — full-spread urethane adhesive)
  - **Click-lock floating** (engineered only, with underlayment)
  - **Site-finishing** — sand, stain, finish coats applied on site (oil-modified poly, water-based poly, hardwax oil)
  - **Pre-finished** — UV-cured factory finish, faster install, no on-site dust
- **Best used for:**
  - Commercial showrooms, executive suites, boardrooms
  - University faculty clubs, alumni halls
  - Heritage building restoration
  - Retail and hospitality with design budgets
  - Note: **not** suitable for healthcare clinical zones, kitchens, washrooms, or wet areas
- **Supplier brands:**
  - Mirage (verify — Canadian, Quebec-made, premium pre-finished)
  - Lauzon (verify — Canadian)
  - Preverco (verify — Canadian)
  - Mercier (verify — Canadian)
  - Fuzion Flooring (confirmed)
  - Shaw Hardwood (verify)
  - Bruce / Armstrong (verify)
- **CTA:** Standard email + call buttons.

**Maintenance section (hardwood-specific, add this — institutions ask):**
> We provide hardwood maintenance contracts: scheduled screening and recoats, full sand-and-refinish projects after-hours and on weekends, board replacement for damage areas, and full refinishes across the National Capital Region.

**Animation budget:**
- Card flip: 600ms `transform: rotateY(180deg)`, perspective on parent. ~30 LOC.
- Reduced-motion: cards become non-flipping; both faces stack vertically with a divider.

**Drafted modal copy:**
> Solid and engineered hardwood for showrooms, executive offices, and design-led commercial spaces across Ottawa and the National Capital Region. We supply and install pre-finished and site-finished goods, run scheduled screen-and-recoat maintenance contracts, and handle full sand-and-refinish projects after-hours so occupied spaces stay open.
>
> Tap each card to flip and see the spec sheet.

---

## Card 5 — Rubber

**Hero icon (closed card):** Existing dot/stud pattern (line 673–691). Reads as studded rubber. Keep.

**Card heading:** `RUBBER`.

**Closed-state pills:** Minimalist (no pills). Use case differentiation lives in the modal.

**Modal interaction concept:** **Use-case toggle (segmented).** Three big toggle buttons across the top: `FITNESS`, `HEALTHCARE`, `INDUSTRIAL`. Tapping each one swaps the modal hero illustration (stylized dumbbell on rubber for fitness, hospital corridor cove for healthcare, mech room gridded matting for industrial) and the supporting spec text. The hero illustration animates a small motion (dumbbell drop bounce, footstep ripple, caster roll-over) on toggle.

**Sub-segment count = 3, not pill-buttons but bigger touch tiles** (each ~110×64 px). Within each sub-segment the spec text + supplier list updates.

**Modal content sections:**

### FITNESS sub-segment
- **Install techniques:**
  - **Interlocking tile** — high-density vulcanized rubber, 8–12mm, dry-lay over concrete, perimeter glue at walls. Most-specified for free-weight zones.
  - **Rolled rubber** — full sheets, glue-down, seams butted. Used for cardio decks and stretch zones.
  - **Poured-in-place** — granulated rubber + polyurethane binder, seamless. Specified for outdoor playgrounds and weight platforms.
  - **Drop-zone pads** — 2–4" thick high-density tiles under Olympic platforms.
- **Best used for:** university fitness centres, varsity weight rooms, corporate gyms, municipal recreation centres, school gymnasium ancillary rooms.
- **Suppliers:** Mondo (verify — premium sports rubber), Ecore (verify — recycled commercial rubber), Regupol (verify), Tarkett Sports (verify), Johnsonite (confirmed).

### HEALTHCARE sub-segment
- **Install techniques:**
  - **Sheet rubber, heat-welded seams** — same protocol as homogeneous vinyl. Continuous, cleanable.
  - **Integral coved base** — sheet rolled up the wall, forming a 4–6" base with no horizontal seam. Specified throughout most Ontario hospital projects.
  - **Static-dissipative variants** — for imaging suites, server rooms, electronics labs.
- **Best used for:** patient rooms, corridors, nurses' stations, MRI suites (non-magnetic), pharmacy, long-term care, dental clinics, veterinary.
- **Why rubber over vinyl in healthcare?** Underfoot comfort for staff who stand 12-hour shifts; sound dampening; chemical resistance; dimensional stability over heated slabs.
- **Suppliers:** Nora (confirmed — the gold-standard premium healthcare rubber), Artigo (verify), Mondo (verify), Johnsonite (confirmed), Forbo (confirmed — they do rubber as well as linoleum).

### INDUSTRIAL sub-segment
- **Install techniques:**
  - **Anti-fatigue matting** — drop-in, washable, often modular. Workstations, assembly lines, lab benches.
  - **Tile or sheet rubber** — glue-down, slip-rated, oil-resistant compounds available.
  - **Stair treads + risers** — moulded rubber treads with cast-in nosings. Schools, transit, all institutional stairwells in Ottawa.
- **Best used for:** mechanical rooms, manufacturing floors, lab workstations, school stairwells, transit stations, parking garage stair towers, electrical rooms.
- **Suppliers:** Johnsonite (confirmed), Roppe (verify — common in Canadian institutional stair work), Musson (verify), Flexco (verify).

**CTA:** Standard email + call buttons. Email subject appends the active segment.

**Animation budget:**
- Segment switch: 300ms cross-fade. Hero illustration plays a one-shot 600ms animation on activate.
- Reduced-motion: three sub-sections stack vertically with no toggles, no animations.

**Drafted modal copy:**
> Rubber flooring for the three environments where it matters most: fitness facilities where impact absorption keeps platforms and slabs intact, healthcare where heat-welded seams and integral coved bases meet infection-control standards, and industrial spaces where slip resistance, chemical compatibility, and underfoot comfort define a productive shift.
>
> We install Mondo, Nora, Ecore, Johnsonite, and Regupol — and we specify the right compound, thickness, and base detail for the use case. Tap a segment above to see specifics.

---

## Card 6 — Ceramic / Porcelain

**Hero icon (closed card):** Existing 3×3 ceramic grid with a rotated centre tile (line 693–707). Keep — the rotated centre is a nice tilt-toward-pattern hint.

**Card heading:** `CERAMIC · PORCELAIN`.

**Closed-state pills:** Minimalist (no pills).

**Modal interaction concept:** **Pattern morph + slip-rating slider.** Top half of the modal: a 5×5 tile grid that morphs between layouts (`STACK`, `OFFSET`, `HERRING`, `LARGE`, `MOSAIC`) — only 5 patterns, so use *icon buttons* not pills (under the 6-pill threshold). Bottom half: an interactive **slip-rating ramp** showing tile under a "shoe" icon at increasing angles, labelled with the corresponding R-rating (R9, R10, R11, R12, R13). Drag a thumb along the ramp to see what use cases each rating is for. This is the "playful" hook for ceramic.

**Modal content sections:**
- **Install techniques:**
  - **Thinset over cement board** — modified or unmodified thinset mortar over a cementitious backer board, taped seams. Standard for vertical and most horizontal commercial.
  - **Mortar bed (mud-set)** — traditional thick-bed installation over a cleavage membrane. Used for heritage matching, custom slope-to-drain, and large-format porcelain on uneven substrates.
  - **Large-format protocol** — back-buttering required ≥15"×15"; minimum 95% mortar coverage; movement joints per TTMAC specifications.
  - **Schluter membrane systems** — Ditra (uncoupling), Kerdi (waterproofing), Ditra-Heat (radiant), Dilex (movement joints). Standard on commercial projects.
  - **Heated underlayment** — electric mat or hydronic loop in the mortar bed; programmable for offices, mandatory for some lobby specs.
- **Slip-rating ramp (interactive):**
  - **R9** — interior dry, low slope. Lobbies, corridors above grade.
  - **R10** — entrances with mat-off, washrooms, light service.
  - **R11** — kitchens, laundries, processing areas, exterior covered entries.
  - **R12** — wet processing, food prep cooking lines, bottling, healthcare wet zones.
  - **R13** — heavy industrial wet, chemical processing, abattoirs.
- **Best used for:**
  - Building entrances and lobbies (paired with proper entry matting)
  - Washrooms — institutional, commercial, public
  - Hospital wet zones, decontamination, dialysis bays
  - Commercial kitchens and food prep (with the right slip rating + cove base)
  - Pool decks and change rooms (R11+ required)
  - Heritage restoration where tile is original to the building
- **Supplier brands:**
  - Olympia Tile (confirmed)
  - Centura (confirmed)
  - Ceragres (confirmed)
  - Ceratec (confirmed)
  - Euro Tile & Stone (confirmed)
  - Daltile (verify — major North American brand, common in Ottawa spec)
  - Crossville (verify — North American porcelain)
- **CTA:** Standard email + call buttons.

**Animation budget:**
- Tile pattern morph: same primitive as carpet-tile, 25 SVG rects.
- Slip ramp slider: HTML range input + CSS rotation transform on shoe icon, no JS animation needed.
- Reduced-motion: pattern morph becomes a 5-up static thumbnail strip; slip ramp becomes a static labeled list.

**Drafted modal copy:**
> Porcelain and ceramic tile for entrances, lobbies, washrooms, kitchens, healthcare wet zones, and pool decks. We install over Schluter membrane systems, with heated underlayment where specified, and we know the TTMAC standards for large-format porcelain that most generalists don't.
>
> The slip-rating slider above shows where each R-rating belongs. R9 lobbies, R10 washrooms, R11+ wet areas — pick the wrong rating and the space fails inspection. We don't.

---

## Card 7 — Sheet Flooring (vinyl)

**Hero icon (closed card):** **NEW asset required** — stylized SVG drawing of a corner of sheet vinyl coved up the wall a few inches, showing the integral cove transition between floor and wall. This is the user's specific direction and it's the visual signature of the card. The cove curve is the hero. Add a tiny fluorescent ceiling reflection on the floor for "hospital corridor" energy.

Add this as a new `material: 'sheet'` case in the texture switch (line 611+).

**Card heading:** `SHEET VINYL`.

**Closed-state pills:** Minimalist (no pills).

**Modal interaction concept:** **Animated "build the cove" sequence.** Modal hero is a larger version of the corner illustration. On modal open (or on tap of a "Show me how" affordance), an animation plays: (1) bare slab and wall appear, (2) sheet vinyl rolls down from above and lays flat, (3) the edge curves up the wall, (4) the cove cap snaps in at the top, (5) a dotted line traces the heat-welded seam. ~3 second sequence, replayable. Below the hero, a scrolling use-case strip: OR theatre, ICU corridor, dental clinic, school cafeteria, commercial kitchen.

**Modal content sections:**
- **Install techniques:**
  - **Heat-welded seams** — sheet seams routed, PVC welding rod melted into the groove with a hot-air welder, then skived flush. Creates a continuous waterproof membrane.
  - **Flash coving (integral cove base)** — sheet rolled up the wall over a cove former, capped with a vinyl cap strip or rolled to a top trim. No horizontal seam at the floor/wall transition. **The defining detail of healthcare and clean-room flooring.**
  - **Full-spread adhesive** — pressure-sensitive or wet-set, depending on substrate. Subfloor flatness is critical (≤3/16" in 10').
  - **Substrate prep** — patching, embossing leveller over old VCT, moisture testing (CaCl or RH probe per ASTM F1869/F2170) — non-negotiable for warranty.
- **Best used for:**
  - **Hospital operating theatres, ICUs, isolation rooms** (the headline use case)
  - Dental and medical clinics
  - Commercial kitchens, food prep, butchery, bakeries
  - Long-term care facilities, dialysis centres, infusion rooms
  - Pharmacy compounding, lab support, vivariums
  - School cafeterias and washrooms
- **Why sheet over tile in these environments?** No tile joints means no microbial harbourage, no water ingress, no failed grout, and a single continuous cleaning surface. Coved walls eliminate the floor/wall corner — the hardest spot to keep clean in any room.
- **Supplier brands:**
  - Forbo (confirmed — Marmoleum sheet linoleum + Sphera homogeneous vinyl)
  - Tarkett (confirmed — iQ Granit, iQ Optima, Acczent — the Canadian healthcare default)
  - Gerflor (confirmed — Mipolam, Tarasafe)
  - Altro (verify — heavily specified in Canadian healthcare and food service for safety flooring)
  - Polyflor (verify)
  - Armstrong Flooring (confirmed — Medintech, Medintone)
- **CTA:** Standard email + call buttons.

**Animation budget:**
- Cove-build sequence: SVG `<path>` with stroke-dasharray draw-on + transform animations. ~80 LOC, plays once on open then on user-triggered replay.
- Use-case strip: same scroll-snap pattern as Carpet card, 5 stops.
- Reduced-motion: hero shows the **final** state (fully built cove) as a static SVG; "Show me how" button is hidden; use-case strip becomes a vertical labeled list.

**Drafted modal copy:**
> Sheet vinyl is the right answer when joints are the enemy. Operating theatres, ICUs, isolation rooms, dental surgeries, commercial kitchens, dialysis bays, lab spaces — anywhere a continuous, heat-welded, coved-to-the-wall surface is what the spec calls for, sheet vinyl is what we install.
>
> The detail that defines this product is the integral cove base: the sheet rolls up the wall over a cove former, the top edge is capped, and the floor/wall corner — the hardest spot in any room to keep clean — disappears. No seam, no harbourage, no failure mode. We do the substrate prep, the moisture testing, the welding, and the inspection sign-off. Tap to watch the cove build.

---

## Card 8 — More…

**Hero icon (closed card):** **NEW asset required** — a stylized 2×2 mini-grid of four miniature material thumbnails (carpet pile, tile, plank, dot pattern) tiling within the card. Suggest a faint outline-style "+" overlay so the card reads as "more categories" rather than a static product. Use the existing inline-SVG primitives at smaller scale.

Add as `material: 'more'` in the texture switch.

**Card heading:** `MORE…` (with the ellipsis character, not three dots).

**Closed-state pills:** Minimalist (no pills).

**Modal interaction concept:** **Sub-card grid** — opens to a 2×3 grid of 6 mini-cards inside the modal. Each mini-card shows an icon + name and on tap expands inline (accordion-style) with a 2–3 sentence description. No nested modals. At the bottom, a prominent "Send us your project" CTA — emphasising that this card exists because YCI's actual product list is much longer than the 7 hero cards above.

**Sub-categories (pick 6):**
1. **EPOXY** — chemical-resistant resinous flooring; lab spaces, mech rooms, pharmaceutical, food processing. Self-levelling and broadcast systems. Suppliers: Sika (verify), Stonhard (verify), Florock (verify), Dur-A-Flex (verify).
2. **RAISED ACCESS FLOOR** — modular pedestal-supported panels for cable management; data centres, trading floors, command centres, modern offices. Suppliers: Tate (verify), Haworth TecCrete (verify).
3. **STAIR TREADS + NOSINGS** — moulded rubber/vinyl treads with cast-in slip-resistant nosings; every institutional stairwell in Ottawa. Suppliers: Johnsonite (confirmed), Roppe (verify), Musson (verify).
4. **VINYL + RUBBER WALL BASE** — 4" and 6" coved or straight base for every commercial floor. Suppliers: Johnsonite (confirmed), Roppe (verify), Tarkett (confirmed).
5. **ENTRANCE MATTING SYSTEMS** — recessed and surface-mounted mat systems to capture grit and moisture before it reaches the finish floor. Critical to lobby maintenance and slip-rating compliance. Suppliers: Construction Specialties (verify), Pedimat / Pedigrid (verify), Forbo Coral (confirmed via Forbo).
6. **SPECIALTY: STATIC-DISSIPATIVE / ESD** — for electronics manufacturing, server rooms, MRI control rooms, electronic labs. Specified to ANSI/ESD S20.20. Suppliers: Staticworx (verify), Forbo Colorex (confirmed via Forbo).

**Modal content sections:**
- 6 sub-cards as described
- A **bullet list** below the grid of *additional* categories not given their own sub-card, so the page conveys true breadth: linoleum (Marmoleum), bamboo, cork, sports flooring (sprung wood), pour-in-place playground surfacing, laboratory benchtops, transition strips, stair treads, recoats and refinishing.
- **Big CTA card at the bottom:**
  > **"Don't see what you need? We probably install it."**
  > "Our actual product list runs to dozens of categories — this page shows the most common ones. If you have a spec, send it. If you have a problem, describe it. We'll tell you what works."
  > [Email about your project] [Call 613-744-2744]

**Animation budget:**
- Sub-card accordion expand: 250ms `max-height` + opacity transition. Native `<details>` element or simple `$state` toggle.
- Reduced-motion: all 6 sub-cards expanded by default, no transitions.

**Drafted modal copy (intro):**
> Seven cards above cover the bulk of what we install. This card is everything else — and "everything else" is a lot. Here are six categories worth surfacing on their own. The list below the grid covers another dozen we install regularly. If you don't see what you're looking for, ask. The answer is almost always yes.

---

## Implementation notes for the developer (Svelte 5)

**Suggested component structure:**

```
src/lib/components/young-carpets/
  ProductCard.svelte                   # closed-state card; receives `Product` prop, dispatches openProduct
  ProductModal.svelte                  # modal shell — header, close button, CTA row, mounts the right body component by `material`
  modal-bodies/
    CarpetBody.svelte                  # use-case scroll gallery
    CarpetTileBody.svelte              # 6×6 morph + 6 pill controls (the headliner)
    LvtVctSctBody.svelte               # 3-tab segmented control
    HardwoodBody.svelte                # 3 flip cards
    RubberBody.svelte                  # 3-segment toggle
    CeramicBody.svelte                 # pattern morph + slip-rating ramp
    SheetBody.svelte                   # cove-build animation + use-case strip
    MoreBody.svelte                    # 2×3 sub-card grid
  primitives/
    PatternMorphGrid.svelte            # reusable for carpet-tile, lvt, ceramic — props: tileCount, patterns[], activeIndex
    UseCaseScroll.svelte               # reusable for carpet, vct, sheet — props: cases[]
    SegmentedControl.svelte            # reusable for lvt-vct-sct, rubber — props: options[], activeId, onChange
```

The current `+page.svelte` file is 3142 lines and growing. **This is the right time to extract.** Move the `featureProducts[]` array into `src/lib/data/yci-products.ts`, expand the `Product` type to include the new fields, and let the page consume it.

**State management:**
- Pattern morph state: local `$state(0)` for `activeIndex`, derived `$derived(patterns[activeIndex])` for the current shape array.
- Tab/segment state: `$state('lvt' as 'lvt' | 'vct' | 'sct')`.
- Flip card state: `$state<number | null>(null)` for `flippedCardIndex`, `null` = none flipped.
- Modal open: keep the existing top-level `openProduct` state on `+page.svelte`.

**Animation primitives:**
- **Default to CSS** — `transition`, `transform`, `opacity`, `stroke-dasharray`. No animation library needed.
- **Svelte transitions** (`fly`, `fade` from `svelte/transition`) for tab swaps and modal section enters.
- **No FLIP library** — the pattern morph doesn't need it; each tile is positioned absolutely with its own `transform`, and the transition does the work.
- **One global rule:** every animation respects `prefers-reduced-motion` via a `:global` media query in app.css that disables `transition` and `animation` durations on `[data-yc-anim]` containers. Apply `data-yc-anim` to every animated container in the modal bodies.

**Asset needs (flag for `forAlan/todo.md`):**
- New inline SVG hero for Sheet Flooring card (the corner cove illustration). Can live in the component directly.
- New inline SVG hero for More… card.
- Optional real product photos for any of the 8 cards — current code already supports `image: string | null`, so dropping JPGs at `static/young-carpets/materials/{slug}.jpg` and setting the field is a no-code swap.
- Use-case scene illustrations: stylized SVG vignettes for the use-case galleries. These can be stub-shaped at first and refined — flag as "needs design pass."
- Cross-section illustrations for the 3 hardwood flip cards (solid plank profile, engineered ply layers, parquet block). Inline SVG.
- Slip-rating ramp icon (shoe + wedge). Inline SVG.

**Pill rule enforcement:**
- The only modal that uses true pill buttons is **Card 2 (Carpet Tile)** with exactly 6 pills.
- Every other modal uses **segmented controls, tabs, flip cards, or icon rows** instead — because none of them clear the 6-pill threshold.
- This is intentional and correct per Standing Design Rule #1. Document it inline in the component comments so future contributors don't add a 3-pill row by mistake.

---

## Open questions to escalate to user

These are the decisions that should not be made by an agent. Ask one at a time, slow-discovery style:

1. **Card 2 install patterns — which 6?** Spec proposes: monolithic, quarter-turn, brick (running bond), herringbone, random, ashlar. Confirm or substitute. Also: should `HERRINGBONE` reshape the grid to plank format, or stay square-tile-only?
2. **Card 3 sub-product order.** Spec proposes `LVT → VCT → SCT` left-to-right (most-spec'd first). Is that the order you want, or alphabetical, or VCT first because it's the legacy product?
3. **Card 4 hardwood — supplier brand short list.** I flagged Mirage, Lauzon, Preverco, Mercier, Fuzion as Canadian brands worth surfacing. Which ones do you actually deal with? The current `suppliers[]` only has Fuzion confirmed.
4. **Card 5 Rubber — keep all 3 sub-segments?** Or is industrial too small a part of YCI's actual book to merit equal billing with fitness and healthcare?
5. **Card 7 Sheet — animation autoplay on modal open?** Spec says yes, but you might prefer explicit user-triggered "show me how" only.
6. **Card 8 More… — the 6 sub-categories.** Spec proposes epoxy, raised access, stair treads/nosings, wall base, entrance matting, ESD. Swap any of these out? Sports flooring (sprung wood) was on your verbatim list — should it replace one of these instead?
7. **Brand verification.** Many suppliers above are flagged `(verify)` because they're industry-typical but not in your current `suppliers[]` array. Want me to compare against your actual dealer list and prune?
8. **Real photos vs. inline SVG.** Long-term, do you want to commission photography for the 8 hero cards, or stay with the abstract SVG textures? The textures look great and are on-brand; photos add fidelity but cost.
9. **Modal scroll behaviour at 428px.** Some of these modals will be tall. Confirm: scroll inside the modal body (current pattern) is fine, or do you want sticky tab/pill controls that pin to the top while content scrolls underneath?
10. **CTA copy.** The existing modal CTA is "Call 613-744-2744" + "Email about {product}". Want the email subject lines to also include the active sub-tab/segment (e.g., `Inquiry: LVT — Click-Lock`)?

---

## Acceptance checklist (for the implementation pass)

- [ ] All 8 cards render in `.yc-products-grid` (4 rows × 2 cols on mobile)
- [ ] Sheet Flooring and More… cards have new inline-SVG hero icons matching this spec
- [ ] Each modal mounts the correct per-material body component
- [ ] Card 2 carpet-tile morph: 6 pills, smooth ≤500ms transition, all tiles reposition correctly per pattern
- [ ] Card 3 LVT/VCT/SCT segmented control switches sub-content cleanly
- [ ] Card 4 hardwood flip cards flip on tap, reveal back-face content, only one flipped at a time
- [ ] Card 5 rubber 3-segment toggle swaps hero illustration + body content
- [ ] Card 6 ceramic pattern morph + slip-rating slider both functional
- [ ] Card 7 sheet vinyl cove-build sequence plays on modal open and is replayable
- [ ] Card 8 more… 6 sub-cards expand-on-tap, big CTA at bottom
- [ ] Every interactive element ≥44×44 CSS px
- [ ] `prefers-reduced-motion: reduce` disables all morph/flip/scroll-gallery animations and shows static fallbacks
- [ ] Pill rule enforced: only Card 2 uses pill buttons; everything else uses segmented controls / tabs / flip cards / icon rows
- [ ] Modal close (ESC, backdrop tap, close button) all still work
- [ ] No component touches the phone edge; backgrounds extend; content respects safe-area insets
- [ ] `featureProducts` data extracted from `+page.svelte` to `src/lib/data/yci-products.ts`
- [ ] Per-material modal-body components extracted to `src/lib/components/young-carpets/modal-bodies/`
- [ ] All Canadian / Ontario / HST / "since 1991" facts intact; zero residential or Australian copy

---

*End of spec. Read this file before opening a Deep Mode implementation track on the products section. Ask the user the 10 open questions one at a time, slow-discovery style — do not batch.*
