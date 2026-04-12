# Migration Workflow — ay3 → New Site

Step-by-step workflow for building out the new Young Carpets website by pulling components from ay3 and adapting them to the new design system.

Layout structure reference: `.claude/reference/site-layout-structure.md`

---

## Design Rules (enforced on every section)

- **No yellow.** Gold accent `#d4b87a` only.
- **Glass effect:** `rgba(18, 18, 21, 0.55)` bg, `blur(24px) saturate(1.8)`, consistent on all glass containers.
- **Glow:** `rgba(212, 184, 122, 0.08)` hover, gold accent. Same on all interactive elements.
- **Border radius:** `16px` large containers, `8px` smaller elements.
- **Font:** Inter Variable, weight 200 headings, default body.
- **Motion:** 200ms fade, `prefers-reduced-motion` respected. Max 300ms duration.
- **Runes only:** Every ay3 component must be rewritten to Svelte 5 patterns.

---

## Phase 0: Global Foundation

Before any section work. Get this right so components drop in without friction.

- [ ] Color system — CSS custom properties, gold accent, no yellow anywhere
- [ ] Glass effect + glow tokens as shared CSS
- [ ] Motion tokens (`--fast`, `--base`, `--slow`, easing curves)
- [ ] `prefers-reduced-motion` utility — define once, use everywhere
- [ ] Responsive breakpoint tokens — 3-4 shared breakpoints
- [ ] CSS reset / base styles — port or replace ay3's reset
- [ ] Font loading (Inter Variable, preload critical weight) in `+layout.svelte`
- [ ] Landmark structure in layout scaffold: skip link, `<header>`, `<nav>`, `<main id="main">`, `<footer>`
- [ ] Section anchors in layout/page for all planned sections
- [ ] `afterNavigate` focus management in `+layout.svelte`
- [ ] View Transitions `onNavigate` hook in `+layout.svelte`
- [ ] `<svelte:head>` base meta defaults (title, description, og)
- [ ] Nav updated with final section links

---

## Phase 1: Sections (top to bottom, one at a time)

For each section:
1. Pull ay3 component
2. Rewrite to Svelte 5 runes (`$props`, `$derived`, `{@render}`, `onclick`)
3. Adapt to new design system (colors, glass, glow, motion)
4. Fix asset paths
5. Replace any stores with `$state` modules
6. Expert review (design + a11y)
7. Integrate into page

### 1. Hero/About
- [ ] Animated wordmark
- [ ] "COMMERCIAL FLOORING" label
- [ ] Tagline
- [ ] "Since 1991" eyebrow (from ay3 About)
- [ ] 250+ counter (from ay3 About)
- [ ] 50,000+ counter (from ay3 About)

### 2. Products
- [ ] Top seller badges (Carpet Tile, LVT, Broadloom, Ceramic, Rubber, Matting, Wood, Sheet Vinyl)
- [ ] More Flooring badge → full catalog by expert taxonomy
- [ ] Accessories badge
- [ ] Installation badge
- [ ] Product detail view (3-tab layer — design deferred)

### 3. Services
- [ ] Commercial Installation card
- [ ] Consultation card
- [ ] Maintenance & Repair card
- [ ] Seasonal Matting card

### 4. Suppliers
- [ ] 18-brand logo marquee (COREtec removed)

### 5. Contact/Map
- [ ] Sales team
- [ ] Accounting
- [ ] Phone / Fax / Email
- [ ] Address
- [ ] Google Maps embed

### 6. Footer
- [ ] Already partially built — reconcile with final content
- [ ] Brand block, address, contact, hours, copyright

---

## Migration Gotchas (reference)

- **Runes rewrite is mandatory.** `export let` → `$props()`, `$:` → `$derived`, `<slot>` → `{@render}`, `on:click` → `onclick`, no `|preventDefault` modifier.
- **Asset paths will break.** Audit imports per component, don't bulk-copy.
- **Stores → `$state` modules.** Design decision per case, not mechanical port.

---

## Error Checking

On-demand, not automatic. User will ask when needed. Checks: `pnpm check` + `pnpm lint`.
