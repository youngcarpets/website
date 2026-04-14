# TODO — Young Carpets Website

Last updated: 2026-04-14 (indexes + layout tree refreshed — v0.5.17).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

---

## Live preview URL (bookmark this)

https://youngcarpets-website.pages.dev — stable production URL on Cloudflare Pages. Updates on `pnpm run deploy`.

## Where we landed (2026-04-14)

- **Dark mode is the working mode.** Body `#0b0b0d`, text `#e6e6e8`. Grayscale only — no color accents until color phase at the end.
- **System font stack.** SF Pro Display (Apple), Segoe UI (Windows), system-ui fallback. Square721 for YOUNG wordmark only.
- **Global CSS foundation.** `src/app.css` with color tokens, glass/glow tokens, motion tokens, radius tokens, font tokens, CSS reset, light theme overrides, reduced-motion/transparency media queries.
- **Product badge FLIP animation (v0.4.51 — LOCKED).** Container-transform animation: badge grows to fill grid, inner elements (title, SVG icon) FLIP to header positions with size ratios. Glow overlay uses layout animation for Safari. 900ms duration, ease-out curve. Background: shared opaque dark gradient (no backdrop-filter). Smooth scroll to center products section on open. Stagger return on close: badges fade in sequentially (unlit), then illuminate sequentially. Selected badge stays lit throughout. SVG jitter fix: removed permanent GPU layer, matched shadow structure, 2s illuminate speed. Backups at `backup/v0.4.26`, `backup/v0.4.49`.
- **Agent system organized.** `.claude/agents/INDEX.md` is the single router. FLIP animation agent with full index. Agents accumulate project-specific knowledge. Check project agents before generic dispatch.
- **Product modal content layout (v0.4.67).** Three tabs: Overview / Install / Care. Overview: lead description → spec chart (8 universal rows) → filtered supplier marquee → pinned interactive button. Install: video placeholder + method rows. Care: small icon + cleaning rows + warranty footnote. Interactive feature opens full-bleed in tab panel with "Back to overview". Carpet Tile is the prototype.
- **Supplier → product mapping (verified 2026-04-13).** All 18 suppliers verified against their actual websites by 10 parallel agents. Each supplier has `materials[]` in `suppliers.ts`. Filtered marquee in product modals via `<SupplierMarquee material="..." compact />`. Reference grid at `.claude/reference/supplier-product-mapping.md`. CIOT URL corrected to `ciot.com`.

## Resume here next session

**Branch:** `main` · **Version:** v0.5.17 · **Last session:** 2026-04-14

All major sections built. Products work (More/Accessories badges, Install/Care tabs) deferred — finishing rest of site first. Next: architect caption font, footer reconcile, color phase, landscape tuning.

**Backup:** `backup/v0.4.93` (all 8 interactive features + wiggle fix locked).

**Interactive features (all done):**
- Carpet Tile: tile morph patterns (6 patterns, pill selector)
- LVT: exploded layer diagram (4-layer auto-animate)
- Carpet: noise path IIC dampening (hard floor vs carpet+pad toggle, wave animation)
- Ceramic: grout anatomy (5-step auto-reveal + replay button)
- Rubber: impact absorption by thickness (3-column dumbbell drop + slab flash)
- Matting: lobby heatmap zones (pulsing gradient + 3-zone SCRAPE/WIPE/DRY fade-in)
- Wood+: flip cards (6-card 3×2 grid, 3D rotateY front/back)
- Sheet Vinyl: cove-build anatomy (4-step stroke-draw reveal + replay button)

**Wiggle fix (v0.4.86–v0.4.93 LOCKED):** No CSS transitions except `transform`. Illuminate glow snaps instantly. Dimmed badges use `visibility:hidden`. Badge illuminated state matches expanded card exactly. Ceramic + Carpet Tile SVGs centered. Carpet SVG enlarged 15%.

**Product modal tabs — remaining polish (deferred):**
- Install tab: video placeholder still present — decide if install videos are happening
- Care tab: care icon is a generic placeholder SVG — needs per-product icon/drawing
- Interactive features: may be tweaked later

**Layout tree (top to bottom, matches +layout.svelte → +page.svelte):**
```
✅ Skip Link (a11y, targets #main)
✅ Site Background (enhanced:img, fixed)
✅ Version Badge (top center, dev only)
✅ Header / Nav (glass pill, brand link, theme toggle, hamburger + mobile menu)
✅ Main
│  ✅ Hero Section (BrandMark + YOUNG wordmark 180ms stagger, subtitle 1000ms, blurb fade-up 1800ms)
│  ✅ Products Section (10 badges: 8 product + Accessories + More)
│  │   ✅ 8 product badges (FLIP animation, wiggle-free, 3-tab modals, interactive features)
│  │   ⬜ More badge — standard size, simple layout (deferred)
│  │   ⬜ Accessories badge — divergent layout (deferred)
│  ✅ Suppliers Section (18-brand marquee)
│  ✅ Services Section (4 glass cards + eyebrow)
│  │   ✅ 3 counter badges (35+ / 50,000+ / 250+, countUp on scroll)
│  ✅ Contact Section (Sales 6 + Accounting 2 team directory, Google Maps iframe)
✅ Footer (glass bg 0.35, BrandMark, 2-col: address + contact/hours, copyright)
```

**Next up (finish the rest of the site first, products later):**
1. **Architect caption font** — self-hosted WOFF2, one weight. Architectural hand-lettering for page captions/annotations. Candidates: Architects Daughter, Caveat, or similar.
2. **Footer reconcile** — final content review after all sections done.
3. **Color phase** — `--illuminate-color` token ready (tested pink-orange, gold, blue-green). Full palette system deferred.
4. **Landscape/desktop tuning** — deferred, more work needed.
5. **Error checking on-demand.** User will ask for `pnpm check` + `pnpm lint` when needed.

**Products (deferred — come back after rest of site is done):**
- Install tab + Care & Warranty tab — finalize content for all 8 products
- More badge — standard size (not 2-wide), simple layout
- Accessories badge — divergent layout

## Site content (building out)

- [x] Site-wide bg image (dark-mode filtered floor plan)
- [x] Glass nav bar (floating pill, hamburger menu, safe-area aware)
- [x] Theme toggle (sun/moon, functional)
- [x] Square721 font (embedded, preloaded) — brand/wordmark only
- [x] System font stack (SF Pro Display / Segoe UI / system-ui) — body/UI text
- [x] YOUNG wordmark with bounce-in animation (near-white, drop-shadow)
- [x] Hero subtitle: "COMMERCIAL FLOORING 🍁" (SVG textLength, 24px/500, auto-scales)
- [x] BrandMark.svelte component (hero + footer, bind:clientWidth for sizing)
- [x] Version badge (purple pill, top center — dev component)
- [x] Cache-busting headers for dev
- [x] Favicon (SVG traced paths + PNG + apple-touch-icon)
- [x] Footer (semi-transparent, BrandMark at top, 3-col grid, responsive)
- [x] Global CSS foundation (app.css — tokens, reset, media queries)
- [x] Section anchors (Products, Services, Suppliers, Contact)
- [x] Nav links updated (Products, Services, Suppliers, Contact)
- [x] Base meta defaults in layout `<svelte:head>`
- [x] Counter badges (35+ / 50,000+ / 250+) — placed in Contact section
- [x] countUp action with IntersectionObserver
- [x] Maple leaf SVG (currentColor, scale 0.0063)
- [x] Section: Suppliers (18-brand marquee, "Trusted Brands Include:")
- [x] Hero context blurb (est. 1991, commercial flooring, Ottawa area)
- [x] Products section: 11 badges scaffolded, FLIP animation prototype on Carpet Tile
- [x] Product badge background — shared opaque gradient, no backdrop-filter (v0.4.39)
- [x] Badge → modal transition LOCKED (FLIP grow/shrink, stagger return, scroll-to-center, SVG jitter fix — v0.4.51)
- [x] Product modal content layout (Carpet Tile prototype — 3-tab, spec chart, supplier marquee, interactive button)
- [x] Supplier → product mapping verified (18 suppliers, all websites checked)
- [x] Shared ProductContentModal — data-driven, all 8 real products rendered from product-details.ts
- [x] Badge SVGs restored from ay3 originals (200x200 viewBox, hand-crafted geometry)
- [x] Interactive features: Carpet Tile (tile morph), LVT (exploded layers), Carpet (noise IIC), Ceramic (grout anatomy)
- [x] Interactive features: Rubber (impact), Matting (heatmap), Wood+ (flip cards), Sheet Vinyl (cove anatomy)
- [x] Services section: 4 glass cards (Commercial Installation, Consultation, Maintenance & Repair, Seasonal Matting)
- [x] Supplier marquee moved below Products (before Services)
- [x] Installation badge removed (content moves to More badge)
- [x] Accessories and More badges swapped (10 badges total)
- [x] Counter badges replay on scroll re-entry (same illuminate zone)
- [x] Illuminate zone top edge extended (-35% → -28%) to catch top row
- [x] Carpet SVG enlarged 15% via viewBox zoom
- [x] SVG wiggle permanently fixed: static glow, visibility-based dimming, no transitions except transform
- [x] Contact section: team directory (Sales 6 + Accounting 2), Google Maps iframe, scroll-reveal
- [x] Hero choreography: YOUNG 180ms stagger, subtitle 1000ms, blurb fade-up 1800ms + text-shadow
- [x] Footer redesign: glass bg 0.35, softer border, 2-col on mobile, condensed address
- [x] Illuminate color tokenized: `--illuminate-color` RGB triplet (tested colors, currently white)
- [x] Counter badges moved to Services section bottom
- [x] Landscape: max 4 badge columns (deferred for further tuning)
- [x] user-select: none on product badges
- [ ] More badge (2-wide accordion + caption)
- [ ] Accessories badge (divergent layout)
- [ ] Footer final reconcile
- [ ] Header nav links wired to real sections
- [ ] `<svelte:head>` per-page meta (title, description, og)
- [ ] JSON-LD `LocalBusiness` on home page
- [ ] View transition CSS (selectors exist in JS, no CSS yet)
- [ ] Color phase — accents, glows, highlights (after all dark mode layout is done)
- [ ] Light mode color tuning (after color phase)

## Known Bugs — Revisit Later

- [x] **SVG texture sub-pixel wiggle — FIXED (v0.4.86).** Root cause: any CSS property transition (box-shadow, border-color, opacity) triggers per-frame repaints that re-rasterize SVGs at shifting sub-pixel positions. Fix: all visual properties snap instantly via class toggle, no transitions except `transform`. Badge illuminated state matches expanded card exactly.

## Phase 2 (deferred — not started)

- [ ] Authenticated employee portal with a database. Deferred until Phase 1 marketing site ships.

## Done ✓

- [x] CLAUDE.md with all protocols, TODO.md durable cross-session list
- [x] `.claude/` harness scaffolded (settings.json, hooks, commands, agents, research dirs)
- [x] Expert research file: `.claude/research/2026-04-11-expert-setup-findings.md`
- [x] Workflow cycle research: `.claude/research/2026-04-11-workflow-cycle-research.md`
- [x] Pre-flight install audit: `.claude/research/2026-04-11-preflight-install-audit.md`
- [x] ay3 archive copied to `_archive/ay3/` (local only, gitignored)
- [x] Git identity: `OnError <alanyoungjr@gmail.com>`, longpaths=true, autocrlf=input
- [x] Windows Defender exclusion on project folder
- [x] pnpm 10.33.0 via Corepack
- [x] Claude Code plugins (project scope): `feature-dev`, `frontend-design`
- [x] SvelteKit project scaffolded with pinned deps, all configs, source shell, CI, pre-push hook, lefthook pre-commit hook
- [x] Cloudflare Pages project `youngcarpets-website` created and deployed
- [x] `pnpm run deploy` script added — one-command build + deploy
- [x] `wrangler.toml` at project root (nodejs_compat flag, pages_build_output_dir)
- [x] `defaultMode: bypassPermissions` set in `.claude/settings.json`
- [x] Memory feedback rules migrated to global `~/.claude/CLAUDE.md`
- [x] Verified deploy loop speed (each `pnpm run deploy` < 15 sec)
- [x] Dark mode layout live (bg filter + mask + opacity, glass nav, theme toggle, Square721 font, YOUNG wordmark bounce)
- [x] Workflow decided: Option C (lightweight, `pnpm check` + `pnpm lint` for error checking)
- [x] Hero layout: YOUNG wordmark + COMMERCIAL FLOORING 🍁 SVG subtitle
- [x] System font stack for body/UI text (replaced Inter Variable)
- [x] Version badge for cache verification
- [x] Design tokens documented in CLAUDE.md
- [x] Deploy flow documented in CLAUDE.md
- [x] Output formatting rules in project CLAUDE.md (syncs via git)
- [x] Global `~/.claude/CLAUDE.md` with interaction preferences
- [x] Favicon: SVG traced paths (1.2KB), PNG 32x32, apple-touch-icon 180x180
- [x] Footer: semi-transparent, BrandMark component at top, 3-col grid, responsive breakpoints
- [x] 20 agents ported from ay3 + ay3-expert + motion-expert created
- [x] Master INDEX.md for all agents/resources/references
- [x] Design standards: `.claude/reference/design-standards.md`
- [x] Safe-area-inset support (Dynamic Island, landscape, footer)
- [x] Hover styles gated behind `@media (hover: hover)`
- [x] `prefers-reduced-transparency` fallback on glass nav
- [x] `format-detection` meta prevents Safari auto-linking
- [x] `viewport-fit=cover` for safe-area env vars
- [x] All gold/yellow accents removed — grayscale only
- [x] 5 expert reviews completed (svelte, a11y, design, mobile, performance)
- [x] 7 expert-reported errors fixed
- [x] Phase 0: Global foundation (app.css tokens, reset, media queries, section anchors, nav links, meta defaults)
- [x] Counter badges with countUp action (moved to Contact section)
- [x] Glass transparency tuned (0.18 opacity, 8px blur for badges/nav)
- [x] Footer transparency added (0.7 opacity, 12px blur)
- [x] SVG textLength technique for subtitle auto-scaling across orientations
- [x] BrandMark.svelte extracted — reusable component, hero + footer instances
- [x] bind:clientWidth technique for SVG-to-text width matching
- [x] Footer restructured: BrandMark above grid, 3-col grid below
- [x] Hero/About section layout done (v0.2.11)
- [x] Footer: SVG icons for phone/email/clock/address, 2-col layout, AP email removed
- [x] BrandMark: maple leaf outline with warm glow filter, COMMERCIAL FLOORING weight 200 + 0.25em tracking
- [x] Suppliers section: 18 brands, "Trusted Brands Include:" heading, marquee with black band, 70s scroll
- [x] Section heading standard: weight 200, 0.25em tracking, uppercase
- [x] Background image darkened (opacity 0.55 → 0.45)
- [x] Products section scaffolded: ProductBadge, ProductModal, ModalTabs, CarpetTileModal components
- [x] Carpet Tile modal: 3-tab layout, 6-pattern morph animation, full content
- [x] A11y: modal focus trap, keyboard nav on tabs + radio pills, roving tabindex, focus-visible
- [x] Product codes updated to architectural standards (CPTT, LVT, CPT, CT, RBR, MAT, WD, SVF)
- [x] Badge grid: 3-col on iPhone, 4/5/6 cols on wider screens
- [x] Design tokens enforced: CSS custom properties as single source of truth
- [x] Site layout structure doc updated with 11-badge plan + build approach
- [x] FLIP animation: title text (code+name) with 0.714 font ratio, matched endpoints
- [x] FLIP animation: SVG icon from badge center to header top-left, brightness matched
- [x] Glow overlay: layout-animated (top/left/width/height) for Safari box-shadow survival
- [x] Other badges vanish in 80ms on selection
- [x] Close button: instant hide on close, fade-in after expand
- [x] Sticky tabs with scrollable panel content
- [x] SVG icon moved left of title in expanded header
- [x] Title bottom-aligned to icon baseline
- [x] 900ms animation duration, ease-out curve
- [x] FLIP animation agent created with full index
- [x] Agent system organized: INDEX.md router, lean files, on-demand loading
- [x] Backup branch: `backup/v0.4.26`
- [x] Product badge background: removed backdrop-filter, shared opaque dark gradient with radial depth
- [x] Stagger return: badges fade in sequentially (unlit), then illuminate sequentially after modal close
- [x] Selected badge stays illuminated throughout return sequence
- [x] SVG jitter fix: removed permanent GPU layer, mix-blend-mode, matched shadow structure, 2s illuminate speed
- [x] Scroll-to-center: smooth scroll products section into view on badge open
- [x] Backup branch: `backup/v0.4.49`

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload https://youngcarpets-website.pages.dev.
