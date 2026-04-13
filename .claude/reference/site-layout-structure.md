# Site Layout Structure

Working document for organizing sections and content hierarchy for the new Young Carpets website.

---

## ay3 Sections (original scroll order)

```
Nav        → #products, #what, #about, #contact
Hero       → "COMMERCIAL FLOORING" label, "YOUNG" wordmark, tagline, maple badge
Products   → 9 feature cards + secondary chips + per-product modals
Services   → 4 cards (installation, consultation, maintenance, seasonal matting)
About      → "Since 1991" eyebrow, company paragraph, 250+ / 50,000+ counters
Suppliers  → 19-brand logo marquee
Contact    → Sales team, accounting, phone/fax/email
Map        → Address + Google Maps embed
Footer     → Brand, address, contact, hours, copyright
```

---

## New Site Sections (decided)

```
Hero/About   ("Since 1991", counters, company identity — merged, no standalone About)
Products     (11 top-level badges — 8 product types + More Flooring + Accessories + Installation)
Services
Suppliers    (18-brand marquee, "Trusted Brands We Carry Include:")
Contact/Map  (combined into one section)
Footer
```

Gallery deferred to later phase.
Quote removed from section list.

## Build Approach — Products Section

- **11 badges total** (not 9 like ay3). Added Accessories and Installation as top-level badges.
- **One component, many instances.** All badges are the same ProductBadge component with different content/props.
- **Build Carpet Tile first** as the prototype. Get design, animations, sub-categories, and 3-tab modal exactly right.
- **Then clone the pattern** for the other 10 badges — same component, different data.
- **Each badge is self-contained** — content stays within its own container/constraints.
- **Grid layout:** minimum 3 badges across on iPhone portrait (375px). Condensed cards — code + name + SVG texture only, no blurb.
- **Sub-categories exist in the data model** but top-level badges are built first, deeper taxonomy later.
- **Grayscale only** during build phase. Color accents added at the end.
- **Design tokens are single source of truth.** All visual properties flow through CSS custom properties in app.css. Never hardcode rgba/px values in components.

### Product Modal Content Structure (decided 2026-04-13)

**Three tabs**: Overview / Install / Care (labels in `ModalTabs.svelte`).

**Overview tab** (the main content tab):
1. Lead description (0.95rem, white text — stands out from specs)
2. Spec chart — label:value rows with discreet horizontal borders
   - Universal labels: Sizes, Wear, Install, Traffic, Fire, For, Maintain, Life
3. Filtered supplier marquee — `<SupplierMarquee material="..." compact />`
4. Interactive feature button — pinned at bottom, play-circle icon, "(interactive)" hint
   - Tapping opens full-bleed interactive in the tab panel
   - "Back to overview" button to return

**Install tab**: media/video area + spec rows (methods, techniques)
**Care tab**: small static icon (32px) + cleaning schedule rows + warranty footnote

**Supplier data**: `src/lib/content/suppliers.ts` — each supplier has `materials[]` array. Verified against all 18 supplier websites 2026-04-13. Reference grid at `.claude/reference/supplier-product-mapping.md`.

**Prototype**: Carpet Tile (`CarpetTileModal.svelte`). All other 10 products clone this pattern with different data.

---

## New Site — Full Layout

```
Hero/About
├── "COMMERCIAL FLOORING" label
├── "YOUNG" animated wordmark
├── BrandMark component (maple leaf, subtitle)
└── Context blurb (est. 1991, Young Carpets Inc., commercial flooring, Ottawa area — format TBD)

Products
├── Carpet Tile          (top badge)
├── LVT                  (top badge)
├── Carpet (Broadloom)   (top badge)
├── Ceramic              (top badge)
├── Rubber               (top badge)
├── Matting              (top badge)
├── Wood                 (top badge)
├── Sheet Vinyl          (top badge)
├── More Flooring        (badge → full catalog by category)
│   ├── Soft Floor Coverings
│   │   ├── Carpet Tile
│   │   ├── Broadloom
│   │   └── Custom Carpet
│   ├── Resilient
│   │   ├── LVT / LVP
│   │   ├── Rigid Core / SPC
│   │   ├── Sheet Vinyl
│   │   ├── VCT
│   │   ├── Linoleum
│   │   ├── Rubber
│   │   ├── Safety Flooring
│   │   └── Cork
│   ├── Hard Surface
│   │   ├── Ceramic & Porcelain
│   │   ├── Stone
│   │   ├── Terrazzo
│   │   └── Wood (engineered, solid, parquet)
│   ├── Specialty / Performance
│   │   ├── Resinous (epoxy, urethane, MMA)
│   │   ├── Polished Concrete
│   │   ├── ESD / Static Control
│   │   ├── Sports Flooring
│   │   ├── Raised Access Flooring
│   │   └── Subfloor Systems
│   └── Entryway & Matting
│       ├── Recessed Grilles
│       ├── Scraper Mats
│       ├── Entrance Tile
│       ├── Elevator Cab
│       └── Drainage / Anti-Fatigue
├── Accessories          (badge)
│   ├── Wall Base & Millwork
│   │   ├── Vinyl Base
│   │   ├── Rubber Base
│   │   ├── Millwork Profiles
│   │   └── Corner Guards & Wall Protection
│   ├── Stairwell Systems
│   │   ├── Treads & Risers
│   │   ├── Nosings
│   │   └── Tactile Warning
│   └── Trims & Transitions
│       ├── Transition Strips
│       ├── Reducers
│       ├── Metal Profiles
│       └── Feature Strips
└── Installation         (badge)
    └── Adhesives, Floor Prep, Moisture Mitigation, Setting Materials

Services
├── Commercial Installation
├── Consultation
├── Maintenance & Repair
└── Seasonal Matting

Suppliers
└── 18-brand marquee ("Trusted Brands We Carry Include:")

Contact/Map
├── Sales team
├── Accounting
├── Phone / Fax / Email
├── Address (intentional redundancy with Footer)
└── Google Maps embed

Footer
├── Brand block
├── Address
├── Contact
├── Hours
└── Copyright
```

---

## Product Taxonomy — Full Reference

Comprehensive commercial flooring taxonomy (expert-reviewed). This is the **data model** — the canonical structure for all products, used for sorting, filtering, and supplier mapping.

### Two surfaces, one data model

- **Marketing site (public):** Shows top product badges only (Carpet Tile, LVT, Broadloom, etc.) — simple, visual cards like ay3. The full taxonomy lives underneath but isn't exposed.
- **Employee portal (future):** Full category browsing, search by category/supplier/product, master index. The taxonomy drives navigation and filtering here.
- **Supplier ↔ Product mapping:** Each supplier is tagged to the products they actually offer. Filtering by supplier shows only relevant product badges. Filtering by product shows only relevant suppliers. This relationship is bidirectional and lives in the data layer.
- **Category filtering:** Taxonomy groups (Soft, Resilient, Hard Surface, Specialty, Entryway) are metadata tags, not visible page sections. Filtering by a group (e.g. "Soft Floor Coverings") narrows the product badges shown to only those that belong to that group. The page layout stays flat — cards don't rearrange into category sections.
- **More Flooring badge:** The full catalog — every flooring type lives here. If you tap a product that already has its own top-level badge (e.g. Carpet Tile, LVT), it routes to that badge's detail view. Products without their own badge get a simpler treatment (format TBD). Organized by expert taxonomy categories.

### Flooring Products

```
Soft Floor Coverings
├── Carpet Tile
├── Broadloom
└── Custom Carpet

Resilient Flooring
├── LVT / LVP
├── Rigid Core / SPC
├── Sheet Vinyl (homogeneous + heterogeneous)
├── VCT
├── Linoleum
├── Rubber
├── Safety Flooring
└── Cork

Hard Surface
├── Ceramic & Porcelain
├── Stone
├── Terrazzo
└── Wood (engineered, solid, parquet)

Specialty / Performance
├── Resinous (epoxy, urethane, MMA)
├── Polished Concrete
├── ESD / Static Control
├── Sports Flooring
├── Raised Access Flooring
└── Subfloor Systems

Entryway & Matting
├── Recessed Grilles
├── Scraper Mats
├── Entrance Tile
├── Elevator Cab
└── Drainage / Anti-Fatigue
```

### Accessories & Finishing

```
Wall Base & Millwork
├── Vinyl Base
├── Rubber Base
├── Millwork Profiles
└── Corner Guards & Wall Protection

Stairwell Systems
├── Treads & Risers
├── Nosings
└── Tactile Warning

Trims & Transitions
├── Transition Strips
├── Reducers
├── Metal Profiles
└── Feature Strips
```

### Installation Materials (optional on site)

```
└── Adhesives, Floor Prep, Moisture Mitigation, Setting Materials
```

### Taxonomy Notes

- **Porcelain/Ceramic:** merge into one category (industry standard)
- **Bamboo/Cork:** Cork fits under Resilient; bamboo fits under Wood
- **"Wood+":** non-industry naming — use "Wood" with subtypes
- **Epoxy:** broaden to "Resinous" (includes urethane, MMA)
- **Skip for commercial site:** Laminate (residential), Area Rugs, Outdoor products
