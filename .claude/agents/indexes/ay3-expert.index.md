# AY3 Expert — Resource Index

> Last updated: 2026-04-12
> Archive location: `_archive/ay3/my-portal/src/`

## Site Architecture

The ay3 Young Carpets site is a **single-page scrolling site** with modal overlays. All sections live in one `+page.svelte`. Navigation scrolls to anchored sections.

### Route Files
| File | Purpose |
|------|---------|
| `routes/young-carpets/+page.svelte` | Main page — scroll parallax, tilt, modal state, all section imports |
| `routes/young-carpets/+layout.svelte` | Minimal wrapper (renders children only) |
| `routes/young-carpets/dev/v7-v12/` | Version archive pages |

### Page Section Order (top to bottom)
1. **Hero** — YOUNG wordmark, tagline, maple badge
2. **Services** — 4 service cards
3. **Products** — 9 feature products grid
4. **Suppliers** — Infinite marquee of brand logos
5. **About** — Company copy + animated stat counters
6. **Contact** — Team roster table
7. **Map** — Google Maps embed
8. **Footer** — Brand + address + contact + hours

---

## Component Inventory

| Component | File | What It Does |
|-----------|------|-------------|
| YcNav | `components/YcNav.svelte` | Floating glass navbar, scroll-to-hash links, theme toggle |
| YcHero | `components/YcHero.svelte` | Staggered letter entrance for "YOUNG", tagline fade-up |
| YcCard | `components/YcCard.svelte` | Generic card with 3D pointer-tilt, shine sweep, shadow blob |
| YcProductsSection | `components/YcProductsSection.svelte` | 9-product grid with SVG textures |
| YcSuppliersMarquee | `components/YcSuppliersMarquee.svelte` | Infinite brand logo carousel, pauses on hover/touch |
| YcServicesSection | `components/YcServicesSection.svelte` | 4 service cards with tilt |
| YcAboutSection | `components/YcAboutSection.svelte` | About copy + countUp stat counters |
| YcContactSection | `components/YcContactSection.svelte` | Team roster with click-to-call/email |
| YcMapSection | `components/YcMapSection.svelte` | Google Maps preview + expand button |
| YcFooter | `components/YcFooter.svelte` | Static footer: brand block + 3 contact columns |
| YcProductModal | `components/YcProductModal.svelte` | Modal dispatcher for product details |
| YcModal* (7 types) | `components/YcModal*.svelte` | Material-specific modals (carpet, LVT, hardwood, etc.) |
| YcMapModal | `components/YcMapModal.svelte` | Fullscreen map modal |

---

## Animation & Effect Inventory

### A. Scroll Parallax (3-Layer Background)
- **Files:** `+page.svelte` lines 208-222 (scroll listener), `young-carpets.css` lines 180-256
- **Mechanism:** `--yc-scroll` CSS var set by rAF-debounced scroll listener
- **Layers:** 3 plan image layers at 0.25×, 0.50×, 0.75× scroll speeds
- **Masks:** Radial gradient vignette on each layer

### B. Pointer/Device Tilt Parallax
- **File:** `+page.svelte` lines 162-191
- **Mechanism:** mousemove → normalize to -1..1 → rAF lerp (ease 0.12) → `--yc-tilt-x/y` CSS vars
- **Layer multipliers:** Layer 1 ×6px, Layer 2 ×14px, Layer 3 ×26px (×18/34/58 on mobile)
- **Device orientation:** PARKED (disabled v1.24.49)

### C. Hero Entrance
- **Files:** `YcHero.svelte`, `young-carpets.css` line 385+
- **Effects:**
  - Hero tag: `yc-hero-fade-up` 700ms ease-out-expo @ 100ms delay
  - Letters: `young-mark-letter-in` 700ms spring-bounce, staggered ×80ms per letter
  - Tagline: `yc-hero-fade-up` 800ms @ 1500ms delay
  - Font-load gate: `visibility: hidden` until `document.fonts.load()` resolves

### D. Card Hover/Lift
- **Files:** `cardPointer.ts` (action), `young-carpets.css` lines 576-653
- **Effects:**
  - Pointer-follow sheen: radial gradient at `--ptr-x/y` (normalized 0..1)
  - 3D tilt: `rotateX((y-0.5)*-8deg) rotateY((x-0.5)*8deg)`
  - Shine sweep: 12s periodic diagonal animation (88% idle, 6% sweep)
  - Shadow blob (::after): blur + offset follows pointer
  - Touch: no tilt, only translateY lift + scale

### E. Reveal-on-Scroll
- **File:** `reveal.ts` action
- **Mechanism:** IntersectionObserver (threshold 0.12, rootMargin -8% bottom) adds `.is-visible`
- **One-shot:** Observer disconnects after first reveal
- **CSS:** Default visible → transition on `.is-visible`

### F. Count-Up Numbers
- **File:** `countUp.ts` action
- **Mechanism:** IntersectionObserver → rAF-driven 1800ms cubic ease-out counter
- **Formatting:** `Intl.NumberFormat('en-CA')` + suffix

### G. Modal Animations
- **CSS:** `young-carpets.css` lines 1763-1808
- **Backdrop:** `yc-modal-bg` 350ms ease-out-expo (opacity 0→1)
- **Body:** `yc-modal-in` 500ms ease-out-expo (opacity + translateY 20px + scale 0.97)

### H. Marquee Scroll
- **CSS:** `young-carpets.css` lines 3113-3127
- **Duration:** 50s linear infinite, pauses on hover/touch
- **Markup:** 2× duplicated supplier list for seamless loop

### I. Tile Pattern Morph
- **File:** `YcModalCarpetTile.svelte` lines 24-55
- **Mechanism:** Reactive SVG transform recalculation per pattern type (6 patterns × 36 tiles)

---

## Svelte Actions (Portable Utilities)
| Action | File | Mechanism | Ported? |
|--------|------|-----------|---------|
| reveal | `src/lib/actions/reveal.ts` | IntersectionObserver → `.is-visible` class | No |
| cardPointer | `src/lib/actions/cardPointer.ts` | Pointer tracking → `--ptr-x/y` CSS vars | No |
| countUp | `src/lib/actions/countUp.ts` | IntersectionObserver → rAF counter | No |
| scrollToHash | `src/lib/actions/scrollToHash.ts` | Smooth scroll to anchor | No |

---

## Style Files
| File | Size | Contents |
|------|------|----------|
| `src/lib/styles/young-carpets.css` | ~37KB | All component styles, 12 @keyframes, parallax, modals |
| `src/lib/styles/young-carpets-tokens.css` | ~10KB | ~100 CSS variables: colors, motion, blur, accents |

---

## Data Files
| File | Contents |
|------|----------|
| `data/products.ts` | 9 feature products + 18 other products |
| `data/interactions.ts` | Tile patterns, vinyl tabs, slip ratings, use cases |
| `data/suppliers.ts` | Brand logos and links |
| `data/team.ts` | Sales/accounting/office roster |

---

## Footer Specifics (for porting reference)

**YcFooter.svelte** is a **static component** — no scroll-driven expand/compress animation on the footer itself. The visual effect of the footer "expanding" as you scroll comes from:
1. The **reveal action** on sections above — sections fade/slide in as you scroll down
2. The **parallax background** layers creating depth as the page scrolls
3. The footer having a **solid `#07070a` background** that contrasts with the glass/transparent sections above

### Footer CSS (from young-carpets.css)
- Background: `#07070a` (slightly darker than body `#0b0b0d`)
- Border-top: `1px solid var(--yc-border)` (`#2a2a2f`)
- Safe-area padding: `env(safe-area-inset-bottom)`
- Column titles: glass pill treatment (backdrop-filter + griege border)
- List bullets: checkbox-style squares (11×11, 3px radius, white border)
- Responsive: 4-col → 2-col @ 880px → 1-col @ 520px

### Footer Token Dependencies
- `--yc-text`, `--yc-text-muted`, `--yc-text-faint` (text hierarchy)
- `--yc-border` (separator lines)
- `--yc-griege-06/18` (column title pill background/border)
- `--yc-sheen-02/04/06/18` (list bullet decorative elements)
- `--yc-shimmer-10` (inset highlight on column titles)
- `--yc-blur-10`, `--yc-sat-150` (column title backdrop-filter)

---

## Porting Checklist Template

When porting a component from ay3:
- [ ] Read the component source
- [ ] Read the CSS for that component in `young-carpets.css`
- [ ] Check for token dependencies in `young-carpets-tokens.css`
- [ ] Check for Svelte action dependencies (`use:reveal`, `use:cardPointer`, etc.)
- [ ] Check for scroll/resize listeners in `+page.svelte` that affect the component
- [ ] Check for data file dependencies
- [ ] Adapt CSS from global to scoped `<style>`
- [ ] Replace token variables with inline values from CLAUDE.md
- [ ] Replace Tailwind classes with plain CSS
- [ ] Verify reduced-motion and reduced-transparency fallbacks
- [ ] Verify touch/mobile behavior
