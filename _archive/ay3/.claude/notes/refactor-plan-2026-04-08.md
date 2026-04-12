# AY3 Refactor Plan — 2026-04-08

> Compiled from 3 parallel agent audits: **Structure**, **Refactor**, **Design**.
> User goals: OOP grouping, single-variable-controls-group, component portability.
> Less focus on error-checking (separate pass after this refactor).

---

## Executive summary

3 agents independently surfaced the **same top issues**:

1. **`routes/young-carpets/+page.svelte` is 6,048 lines** — needs decomposition. ~3,400 lines are CSS in a single style block, ~450 lines are inline data, ~300 lines are 9 SVG textures, ~700 lines are 9 product modal bodies. Each of these is a clean extraction target.
2. **YC tokens live in 3 places out of sync** — `lib/styles/young-carpets-tokens.css` (~175 tokens), an inline `.yc-page { }` block (line ~2748, 31 tokens), and a `@media (prefers-color-scheme: light)` block (line ~5882, ~150 lines of overrides). Single-source-of-truth violation.
3. **3 form components are 80–90% identical** (`CustomerForm`, `EmployeeForm`, `InvoiceForm`) — share scaffold, only fields differ. `ModuleForm` wrapper would shrink each by ~50 lines and centralize the Superforms+Zod call site.
4. **3 table components share the same scaffold** (`CustomerTable`, `EmployeeTable`, `InvoiceTable`) — generic `DataTable<T>` with column config is the right abstraction.
5. **`invoice.service.ts` ignores `createCrudService`** (the existing factory). Other modules use it. Inconsistency.
6. **Portal `app.css` has tokens** (`@theme` block) but **hardcodes** `--glass-blur: 20px`, `border-radius`, `300ms cubic-bezier(...)` inline in 6+ rules. Easy token win.
7. **`Badge.svelte` has 7 hardcoded color variants** with raw rgba/hex. No token layer.
8. **2 deep-import violations** in `routes/(public)/invoices/{new,[id]/edit}/+page.server.ts` — bypass the module barrel.
9. **`lib/supabaseClient.ts`** at root is likely stale (224 bytes, unclear consumers).
10. **`hooks.server.ts` violates ADR-003** — single shared client instead of `@supabase/ssr` dual-client pattern. Auth-blocking. **NOT this refactor's scope** — flag for Supabase agent.

## What's NOT in scope for this refactor

- Auth/Supabase fix (separate Supabase pass)
- Error handling / boundaries (separate Error-Check pass — happens AFTER this refactor per user)
- Business logic changes
- New features
- Big visual redesigns (token consolidation OK, redesign NOT)
- The locked YC parallax stack (Layer 1/2/3 transforms — protected)
- Per-product SVG textures + modal interaction code (preserved per `feedback_preserve_svg_animations.md`)

---

## Compiled chunk plan (deduped across 3 agents)

Chunks ordered: **lowest risk first**, dependencies respected. Each is one commit + version bump.

| # | Chunk | Risk | Files affected | Notes |
|---|---|---|---|---|
| 1 | Fix invoice deep imports | LOW | `routes/(public)/invoices/new/+page.server.ts`, `routes/(public)/invoices/[id]/edit/+page.server.ts` | 2 line edits — re-route through `$lib/modules/invoices` barrel |
| 2 | Audit + remove stale `lib/supabaseClient.ts` | LOW | `lib/supabaseClient.ts` | If unused, delete. If used, leave + comment. |
| 3 | Move YC inline tokens to tokens.css | LOW (HIGH value) | `lib/styles/young-carpets-tokens.css`, `routes/young-carpets/+page.svelte` (delete lines 2748-2805) | The single biggest "change one variable" win |
| 4 | Collapse YC light-mode override block | LOW | `lib/styles/young-carpets-tokens.css` (extend existing light block), `routes/young-carpets/+page.svelte` (delete lines 5882-5897) | Eliminates ~20% of light-mode duplication |
| 5 | Extract YC CSS block to separate file | LOW (HIGH value) | `routes/young-carpets/+page.svelte` → `lib/styles/young-carpets.css` | ~3400 lines moved. File drops 6048 → ~2650 |
| 6 | Extract YC data to `data/` folder | LOW | new files in `routes/young-carpets/data/` | products, suppliers, team, interaction-data, geometry constants |
| 7 | Extract YC actions to `lib/actions/` | LOW | new files in `lib/actions/` | reveal, cardPointer, countUp, scrollToHash, deviceTilt — portable to future sites |
| 8 | Add missing tokens to portal `app.css` `@theme` | LOW (MED if defaults shift) | `my-portal/src/app.css` only | `--glass-blur`, `--glass-sat`, `--radius-panel`, `--motion-base`, `--ease` |
| 9 | Build `lib/components/primitives/Modal.svelte` | LOW | new file | Foundation for product modal extraction |
| 10 | Extract YC leaf sections (Nav, Hero, Services, About, Contact, Footer, SuppliersMarquee) | LOW | 7 new components in `routes/young-carpets/components/` | Static, leaf-first extraction |
| 11 | Extract `YcProductTexture.svelte` + per-material textures | LOW | new component + texture map | Removes ~275 lines of repeated SVG |
| 12 | Extract `YcProductsSection.svelte` + `YcProductCard.svelte` | LOW-MED | new components | Uses chunk 11 |
| 13 | Build `<FormSection>` + `<FormActions>` primitives | LOW | new files in `lib/components/ui/forms/` | Foundation for ModuleForm |
| 14 | Build `<ModuleForm>` wrapper | MED | new file | Generic over Zod schema. Prototype with 1 form first. |
| 15 | Migrate Customer + Employee forms to `<ModuleForm>` | LOW | 2 form components | After 14 lands |
| 16 | Build `<DataTable>` primitive | MED | new file | Column config type is the design decision |
| 17 | Migrate 3 module tables to `<DataTable>` | LOW | 3 table components | After 16 lands |
| 18 | `invoice.service.ts` adopts `createCrudService` + extract `buildLineItemRows` helper | LOW-MED | invoice service | Test create/update carefully |
| 19 | Extract `YcMapSection.svelte` + `YcMapModal.svelte` | MED | new components | Google Maps init effect |
| 20 | Extract `YcProductModal.svelte` shell (consume Modal primitive) | MED | new component | Shell only — no body variants yet |
| 21 | Extract per-material modal bodies (one at a time) | **HIGH** | 9 new components | DO ONE PER COMMIT. Preserve every SVG path + timing. Memory `feedback_preserve_svg_animations.md` applies. |
| 22 | Build `<SegmentedControl>` primitive | LOW | new file | Used by LVT/rubber/tile switchers in modal bodies |
| 23 | `<YcCard>` unification (variant prop) | MED | new component + CSS consolidation | After 21 — easier once modals out |
| 24 | Decouple `ConfirmDialog` from glass classes (consume Modal primitive) | LOW | existing component | Portability cleanup |
| 25 | Backdrop-filter consolidation (collapse 13 blur sites to 4 tokens) | **HIGH** | YC page style block | Approval gate — material feel is subjective |
| 26 | YC light-mode rgba sweep | **HIGH** | YC page lines 5899-6046 | Many overrides may become redundant after token swap |
| 27 | Dev page split (defer) | LOW | `routes/dev/+page.svelte` (1769 lines) | Internal tool — defer until after YC done |

**Stop criteria for autonomous execution:** chunks 1–13 are all LOW risk and should ship without human review. Chunks 14+ need approval per chunk.

---

## Deferred — LOW PRIORITY backlog (per user 2026-04-08)

These were planned but deferred. Pick up only if user explicitly requests:

1. **9 per-material modal body sub-extraction** — split `YcProductModal.svelte` (currently 903 lines) into 9 child components, one per material. PURE structural refactor — modal already works perfectly. No functional gain. HIGH risk for breaking the locked modal interaction code. **Only do this if the modal needs maintenance that benefits from per-material isolation.**
2. **YcCard unification** (variant prop) — unify `.yc-product-card` / `.yc-card` / `.yc-team-row` into one component. MED risk on CSS, marginal value.
3. **Backdrop-filter consolidation** — collapse 13 distinct `blur(N) saturate(X%)` literals to 4 token tiers in `young-carpets.css`. HIGH risk on perceived material feel — needs visual approval per change.
4. **Light-mode rgba sweep** — replace `rgba(60,50,30,X)` literal blocks in light-mode overrides with token references. HIGH risk on light-mode coverage — many overrides may be redundant once tokens swap. **NOT DONE in v1.24.x autonomous run** because: 13 unique warm-graphite alphas + 8 unique white alphas = 21 distinct values, many one-off. Byte-identical migration would mean creating 21 tokens that nobody else uses. The honest fix is per-site visual review with side-by-side screenshots — not safe to do autonomously.
5. **Dev page split** — **DO NOT REFACTOR.** Per user 2026-04-08: dev page is throwaway, will be removed at project end. Should stay **maximally isolated** so it can be pulled out cleanly. No deeper integration with portal modules. Hands off.
6. **`SegmentedControl` migration** — primitive exists at `lib/components/primitives/SegmentedControl.svelte`. Migrate the 3 sites in `YcProductModal` (LVT tabs, rubber segments, slip rating pills) when there's appetite.

---

## Detailed reports (verbatim from agents)

### Structure agent — full report

#### Module pattern compliance
Portal modules (`employees`, `customers`, `invoices`) all follow canonical shape with `types/schemas/services/components/index.ts` barrel. Invoices correctly bypasses `createCrudService` for line-item complexity but should still adopt the helper pattern for shared bits.

#### Route organization
- `(public)/` group holds portal CRUD routes — should move to `(portal)/` per ADR-007 (separate pass).
- `routes/young-carpets/+page.svelte` 6,048 lines — see decomposition below.
- `routes/dev/+page.svelte` 1,769 lines — combined CRUD + playground tool.

#### Cross-module imports — 1 violation
```
routes/(public)/invoices/new/+page.server.ts:3:     import { invoiceSchema } from '$lib/modules/invoices/schemas/invoice.schema';
routes/(public)/invoices/[id]/edit/+page.server.ts:3: import { invoiceSchema } from '$lib/modules/invoices/schemas/invoice.schema';
```
Both should import from `$lib/modules/invoices` barrel.

#### `lib/` placement — clean except:
- `lib/supabaseClient.ts` (224 bytes) — likely stale
- `lib/dev/` (3,000+ lines, no barrel) — should add `lib/dev/index.ts`

#### File naming — consistent
PascalCase components, camelCase functions, kebab-case files. No violations.

#### Top 3 OOP groupings
1. **Product modals (CRITICAL)** — 9 material-specific bodies in one file → split into `routes/young-carpets/modals/{Material}Modal.svelte` + shared `ProductModal.svelte` shell.
2. **`.yc-card` family** — `.yc-product-card`, `.yc-card`, `.yc-team-row` all use `cardPointer` + `.yc-card-shine` + cushion shadows. Unify into `<YcCard variant="product|service|team|scene">`.
3. **3 form components** — 80–90% identical. `<ModuleForm>` wrapper.

#### Single-variable group control
- **T1 — Token consolidation (CRITICAL):** YC tokens scattered across 3 places (file + 2 inline blocks). Consolidate into `young-carpets-tokens.css`.
- **T2 — Material accent map:** per-product glow color in `data/products.ts` `materialTheme` map.
- **T3 — Elevation tokens** (`--yc-elev-1/2/3`) for shadow scale.
- **T4 — Portal glass tokens:** `--glass-blur`, `--glass-saturate`, `--radius-panel`, `--transition-snappy` to `app.css @theme`.

#### Component portability
- **Already portable:** `FormField`, `GlassPanel`, `Badge`, `EmptyState`, `PageHeader`, `ConfirmDialog`, `Toast`, `crud.ts`
- **Coupled but extractable:** module forms/tables (need ModuleForm + DataTable primitives)
- **Promote to `lib/actions/`:** `reveal`, `cardPointer`, `countUp`, `scrollToHash`, `deviceTilt`

---

### Refactor agent — full report

#### Headline numbers
- `routes/young-carpets/+page.svelte` — **6,048 lines** (script ~800, template ~1,800, style ~3,400)
- `routes/dev/+page.svelte` — **1,769 lines**
- `lib/dev/playground/ComponentEditor.svelte` — **1,070 lines**
- `lib/dev/playground/PlaygroundShell.svelte` — **593 lines**
- 4 more files >300 lines
- Module code is healthy (largest = `invoice.service.ts` at 221 lines)

#### YC decomposition order (low coupling first)
1. CSS extraction → `lib/styles/young-carpets.css` (~3400 lines, LOW risk)
2. Data extraction → `routes/young-carpets/data/{products,suppliers,carpet-use-cases,vinyl-tabs,...}.ts` (~450 lines, LOW)
3. Layout sections → `YcNav`, `YcHero`, `YcSuppliersMarquee`, `YcServicesSection`, `YcAboutSection`, `YcContactSection`, `YcFooter` (LOW each)
4. `YcMapSection` + `YcMapModal` (MED — Google Maps init)
5. `YcProductsSection` + `YcProductCard` + `YcProductTexture` (MED)
6. `YcProductModal` shell (MED)
7. 9 per-material modal bodies (HIGH — one at a time, preserve everything)

#### DRY violations
- 9 inline SVG textures in product cards → `YcProductTexture` + `young-carpets/textures/` map
- Form `FormField name="..." bind:value={$form.x} error={$errors.x?.[0] ?? ''}` repeated 20+ times across 3 forms → `<AutoField>` (optional) or `<FormField>` snippet
- Form sections (`<GlassPanel><h2>...<div class="grid">`) → `<FormSection>`
- Form button row repeated 8 lines × 3 forms → `<FormActions>`
- Tables share 80% scaffold → `<DataTable>` generic
- Invoice service duplicates `lineItemRows.map(...)` between create and update → `buildLineItemRows()` helper
- Custom service methods bypass `createCrudService` networkError wrapper → `withNetworkGuard()` helper
- Modal autoplay/timer pattern repeated in 3 places → `createAutoAdvance()` composable

#### OOP factory: `createResourceModule<T>()`
- Wraps `createCrudService` + schema + form config + table columns into one factory
- Each module becomes a 30-line declaration
- **Risk: MED** — over-abstraction. Prototype with employees first, don't force invoices into it (line items too custom)

---

### Design agent — full report

#### Token inventory
- `app.css @theme`: 13 portal-wide color tokens (`--color-glass`, `--color-cyan-accent`, etc). **Missing motion/radius/blur.**
- `young-carpets-tokens.css`: 114 tokens dark + 82 rebound in light. Already well-structured: griege/ink/shimmer primitives + alpha rungs + role tokens (cushion, edge-y, parallax filters).
- `young-carpets/+page.svelte` `.yc-page {}` block (lines 2748-2805): **31 duplicate tokens** in wrong file (--yc-bg, --yc-surface, --yc-text, motion easings, accent rgbs, glow colors).
- Light-mode override block (lines 5882-6046): ~150 lines of `rgba(60,50,30,X)` literals — much could become token rebinds.

#### Hot spots (top 10)
1. `.yc-page` token block (31 tokens in wrong file)
2. Light-mode override block (150 lines of magic rgbas)
3. **13 distinct `backdrop-filter: blur(Npx) saturate(X%)` literals** in YC page (blurs 8/10/12/14/20/22/24/28/30; saturations 150/160/170/180)
4. `.yc-nav` hardcoded `rgba(18,18,21,0.55)` + literal `1px` instead of `--yc-edge-y`
5. `.yc-skip-link` raw colors + 8px radius
6. `app.css .glass` — `blur(20px)`, `saturate(1.4)`, `1rem`, `300ms cubic-bezier(...)` all inline
7. `app.css .btn-primary/.btn-secondary/.btn-danger` — `0.625rem` radius, `300ms` transitions, `#22d3ee` hover, danger alphas all hardcoded
8. `app.css .input-glass` — `rgba(39,39,42,0.40)` inline
9. `Badge.svelte` — 7 variants with raw hex (`#eab308`, `#a855f7`, `#3b82f6`) + raw rgba alphas
10. YC parallax-layer mask stops — 6+ raw `rgba(0,0,0,0.X)` stops repeated across 3 layers

#### Inconsistencies
- **4 different "near black" values:** `#09090b`, `#0a0a0b`, `#0b0b0d`, `#080706`
- **2 separate motion systems:** portal `300ms` vs YC `180/350/500/700ms`
- Border radii: portal `1rem / 0.625rem / 0.75rem` vs YC `9999px / 8px / 16px / 20px / 24px` — no shared scale
- Same `cubic-bezier(0.4,0,0.2,1)` defined 6× in app.css and as `--e-standard` in YC

#### Proposed 3-tier system
- **Primitive layer** (`lib/styles/tokens/_primitives.css`): raw colors, rgb triples, raw px/ms/curves
- **Semantic layer** (`lib/styles/tokens/_semantic.css`): `--surface`, `--ink`, `--accent`, `--glass-blur`, `--motion-base`, `--ease` — theme-aware
- **Component layer** (inline): `--card-bg`, `--btn-bg`, `--modal-blur` — narrowly scoped to components

#### Group-control table
| Token | Controls | Default |
|---|---|---|
| `--glass-blur` | All backdrop-filter blurs (13+ sites) | `20px` |
| `--glass-sat` | All saturations | `160%` |
| `--radius` | Card-grade corners | `16px` |
| `--radius-pill` | Pills/nav/chips | `9999px` |
| `--motion-base` | Base transitions | `300ms` |
| `--ease` | Standard easing | `cubic-bezier(0.4,0,0.2,1)` |
| `--edge-y` | Top inset highlight (light flips) | `1px` |
| `--surface` | Page bg | `#09090b` portal / `#0b0b0d` yc |
| `--ink` | Primary text | `#fafafa` portal / `#e6e6e8` yc |
| `--accent` | Portal accent | `#06b6d4` |
| `--yc-shimmer` | YC candlelight sheen | `rgba(255,248,235,0.18)` |

---

## Execution notes for autonomous run

- One chunk per commit. Bump version each commit.
- After each chunk: run `cd my-portal && npx svelte-check --tsconfig ./tsconfig.json` and confirm 0 errors.
- After each chunk: read sample files visually for sanity (no broken refs, no orphaned classes).
- Stop and report if anything mid-LOW chunk turns out to be MED+.
- LOCKED parallax stack (`feedback_preserve_svg_animations.md` + RELAY locked block) is untouchable.
