# AY3 Archive Index

Quick-access map of everything in `_archive/ay3/`. Use this to find things fast.

## Root Files

| File | What it is |
|------|-----------|
| `CLAUDE.md` | Old Claude Code config — session rules, agent dispatch, mode detection. **Stale — superseded by new CLAUDE.md** |
| `AGENTS.md` | Universal AI tool rules — main-only branch, save workflow, no force-push. **Stale** |

## docs/

| File | Contents |
|------|----------|
| `PROJECT-PLAN.md` | Roadmap: Employees done, Customers next, then Invoices (5 tables, line items, status workflow) |
| `WEBSITE-IMPROVEMENTS.md` | Curated feature list from dev versions V1–V6. Navbar corners, bigger map, product categories, greyscale palette, V6 contact layout. Parked: Flooring Advisor wizard, Portfolio section |

## forAlan/

| File | Contents |
|------|----------|
| `todo.md` | Manual asset download list — 6 material photos, 17 supplier logos, maple leaf SVG, with exact file paths and code update instructions |

## scripts/

| File | What it does |
|------|-------------|
| `show-version.sh` | Displays portal version + branch from package.json |
| `start-portal.bat` | Windows launcher: `cd my-portal && npm run dev -- --host` |

## my-portal/ — SvelteKit App

### Route Tree

```
routes/
├── +layout.svelte                    Root layout
├── (public)/
│   ├── +layout.svelte                Public section wrapper + navbar
│   ├── +page.svelte                  Dashboard home
│   ├── about/+page.svelte
│   ├── customers/                    CRUD: list, new, [id]
│   ├── employees/                    CRUD: list, new, [id]
│   └── invoices/                     CRUD: list, new, [id], [id]/edit
├── dev/
│   ├── +page.svelte                  Dev dashboard
│   ├── next/+page.svelte
│   └── playground/+page.svelte
└── young-carpets/
    ├── +page.svelte                  Main marketing page (all sections)
    ├── +layout.svelte                Marketing nav wrapper
    ├── components/                   Section components
    ├── data/                         products.ts, suppliers.ts, team.ts
    └── dev/v1–v12/                   12 design iteration variants
```

### Website Sections (scroll order on young-carpets page)

```
Hero         — Wordmark, "Proudly Canadian" badge, tagline
Products     — 9 product cards with modals (carpet, LVT, hardwood, etc.)
Services     — 4 cards (install, consultation, maintenance, matting)
Suppliers    — Infinite logo carousel (15+ brands)
About        — "Since 1991", 2 stat counters
Map          — Address + embedded Google Maps
Contact      — Team roster by department (name, phone, email)
Footer       — Address, phone, hours, social
```

### Key Data Files

| Path | Contents |
|------|----------|
| `young-carpets/data/products.ts` | 9 product types with descriptions, SVG textures |
| `young-carpets/data/suppliers.ts` | 15+ brand names with links |
| `young-carpets/data/team.ts` | Team roster grouped by department |

### Lib Structure

```
lib/
├── modules/
│   ├── employees/      schemas, services, types, components (EmployeeForm, EmployeeTable)
│   ├── customers/      schemas, services, types, components (CustomerForm, CustomerTable, CustomerSelect)
│   └── invoices/       schemas, services, types, components (InvoiceForm, LineItemsEditor, TotalsSummary, StatusBadge)
├── components/
│   ├── Navbar.svelte, ThemeToggle.svelte, Toast.svelte
│   ├── primitives/     Modal, DataTable, SegmentedControl
│   └── ui/             PageHeader, GlassPanel, Badge, EmptyState, FormField, ConfirmDialog
├── actions/            reveal, scrollToHash, countUp, cardPointer
├── stores/             theme.svelte.ts, toast.ts
├── styles/             young-carpets-tokens.css, young-carpets.css
├── utils/              format.ts, money.ts
├── types/              database.ts, common.ts
├── schemas/            common.ts (shared Zod)
├── services/           crud.ts (CRUD factory)
├── server/             supabase.ts (SSR client)
└── dev/                playground, workspaces, tools (component showcase system)
```

### Static Assets

| Path | What |
|------|------|
| `static/young-carpets/bg.jpg` | Hero background image |
| `static/young-carpets/square721.ttf` | Square721 font |
| `static/young-carpets/maple-leaf.svg` | Canada badge (placeholder) |

## .claude/ — Old Agent & Resource System

**Not for porting** — protocol files are stale. But resource content is valuable.

### Useful Resources

| Path | Contents |
|------|----------|
| `resources/products/` | 11 product type specs (carpet, LVT, hardwood, rubber, ceramic, etc.) with descriptions, applications, suppliers, pricing |
| `resources/products/INDEX.md` | Product catalog structure |
| `resources/03-apple-liquid-glass-design.md` | Glass effect CSS + variables |
| `resources/10-apple-colors.md` | Color palette (system colors, glass, light/dark) |
| `resources/11-apple-effects.md` | Shadow, blur, backdrop filters |
| `resources/12-apple-typography.md` | Font sizes, weights, leading |
| `resources/13a-motion-tokens.md` | Duration, easing, spring constants |
| `resources/20-dark-glass-pills-glows.md` | Glass pill buttons with glow |
| `resources/25-color-preferences.md` | Greyscale + accent color philosophy |
| `reference/ontario-accounting.md` | Canadian tax, HST, accounting rules |
| `reference/pending-assets.md` | Outstanding asset checklist |
| `reference/young-hero-deleted-code.md` | Archive of removed hero code |
| `notes/animation-ideas.md` | Animation brainstorming |

### Design Notes (from WEBSITE-IMPROVEMENTS.md)

- Greyscale palette (charcoal/grey/black/white/greige)
- Color accents only for highlights (underlines, glows, outlines)
- V6 contact layout = gold standard
- Squared navbar corners (less pill-shaped)
- Product categories: Soft Surfaces, Hard Surfaces, Resilient, Rubber & Impact, Wood + Natural, Specialty, Accessories
