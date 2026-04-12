# YCI Light Mode v1.21.0 — Compiled Implementation Plan

> Compiled by main thread on 2026-04-07 from 3 parallel agent outputs:
> - `light-mode-spec.md` (Design agent `aceb7604`)
> - `theme-toggle-plan.md` (Structure agent `a379d451`)
> - `token-readiness-audit.md` (Audit agent `adaf6186`)
>
> This is the **single source of truth** for the implementation phase.
> Each chunk below maps 1:1 to a SAVE CHECKPOINT in the master todo.

## Strategy (1 paragraph)

**Cream-paper analog of the dark architectural-drafting feel.** Dark mode = "ink on a backlit blueprint." Light mode = "graphite on warm vellum." The token system stays unchanged in name and structure — the alpha rungs simply resolve to different rgb triplets when `<html data-theme="light">` is set. Three role flips drive the whole thing: griege rgb darkens (`194,179,154 → 122,116,106`), ink flips role from "translucent dark fill" to "translucent light fill" (`rgba(8,7,6,α) → rgba(255,255,255,α)`), and shimmer flips from "warm pearl top highlight" to "warm graphite bottom shadow" via a paired `--yc-edge-y` direction token (`1px → -1px`). The 3-layer LOVE-locked parallax keeps its markup, transforms, masks, and scroll math 100% byte-identical — only its filter values get migrated to tokens that swap per theme. A new sun/moon toggle lives in the floating navbar, backed by a shared `theme.svelte.ts` runes store that handles localStorage + matchMedia + cross-tab sync. A FOUC-prevention script in `app.html` paints the right theme before hydration.

## Key compile decisions

The 3 agents agreed on most things. Where they diverged or left gaps:

### Decision 1 — Token file location (Design vs Audit)
- Design agent assumed light overrides go in `[data-theme="light"] .yc-page { ... }` inside `young-carpets-tokens.css`
- Audit agent recommended migrating ALL color tokens (`--yc-bg`, `--accent-*`, etc.) OUT of `.yc-page` into `:root` first so the light scope can be one block
- **Decision:** Follow Audit. Move neutral palette + accent triples + effect tokens (`--card-accent`, `--badge-glow`, `--section-eyebrow`) into `young-carpets-tokens.css` `:root`. Light overrides target `[data-theme='light'] .yc-page { ... }` (Design agent's selector) AND `[data-theme='light'] :root { ... }` for things that should always flip (e.g., `--yc-logo-filter`).

### Decision 2 — `--yc-edge-y` shimmer direction flip (Design)
- Design agent's clever solution: dark sets `--yc-edge-y: 1px`, light sets `-1px`. Every existing `inset 0 1px 0 var(--yc-shimmer-XX)` becomes `inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-XX)`.
- **Decision:** YES, do this. ~22 search-and-replaces. Audit agent's "no visual change" rule applies — dark mode output stays byte-identical because `--yc-edge-y: 1px` matches the current literal.

### Decision 3 — SVG markup colors in maple-plan modal (Audit)
- Audit found ~44 hardcoded rgba `fill=` / `stroke=` attributes inside maple-plan modal SVGs at lines 1632-2030
- Audit gave 3 mitigation options: (1) lift to outer SVG style with `var()`, (2) wrap and apply invert filter, (3) leave dark
- **Decision:** **Defer the maple-plan SVG markup colors to v1.21.1** — they're inside a single modal that the user rarely sees, and v1.21.0 is already a big chunk. Light mode v1.21.0 will leave the maple-plan modal as "always dark" (option 3) with a TODO comment to fix in the next minor.

### Decision 4 — Hero maple leaf at rest in light mode (Design open Q1)
- Design left this open: charcoal at rest (parallel to dark) or Canada red at rest (brand-forward)?
- **Decision:** **Canada red `#C8102E`** at rest in light mode. Brand-forward, contrast verified at 5.51:1. The hover glow stays red in both modes (red bleeds harder on dark, softer on cream — that's fine).

### Decision 5 — Maple badge leaf color (Design open Q2)
- Should the leaf inside the "Proudly Canadian" badge be Canada red in both modes?
- **Decision:** **Yes, Canada red in both modes.** Add explicit `.yc-maple-badge .yc-maple-leaf { color: #C8102E; }` rule that overrides currentColor inheritance.

### Decision 6 — Sweep scope for v1.21.0 (Audit critical risks)
- Audit identified ~80 white rgbas + ~60 black rgbas + ~25 maple-gold rgbas + ~32 gradients + 10 filters that need tokens
- Doing ALL of them in v1.21.0 = ~2000-line diff, high risk
- **Decision:** v1.21.0 ships the **base mechanism** (token file, sweep, toggle, parallax filters, key component overrides) that makes light mode WORK on the majority of the page. Edge cases (the gradients, the maple-plan SVG, the supplier marquee logo invert) get followup hotfixes v1.21.1 / v1.21.2. The user can toggle and see most of the page light/dark in v1.21.0.

## Implementation chunks (= save checkpoint boundaries)

### Chunk 1 — Token slots in `young-carpets-tokens.css`
**No visual change.** Add new token slots, dark values only.

What gets added to the `:root` block in `young-carpets-tokens.css`:

```css
:root {
  /* Existing: griege/ink/shimmer + 22 alpha rungs (do NOT remove) */

  /* NEW: edge direction (dark=top, light=bottom) */
  --yc-edge-y: 1px;

  /* NEW: maple-plan accent (the buttery #ffe27a gold) */
  --yc-maple-gold: #ffe27a;
  --yc-maple-gold-rgb: 255, 226, 122;
  --yc-maple-gold-08: rgba(255, 226, 122, 0.08);
  --yc-maple-gold-10: rgba(255, 226, 122, 0.10);
  --yc-maple-gold-14: rgba(255, 226, 122, 0.14);
  --yc-maple-gold-35: rgba(255, 226, 122, 0.35);
  --yc-maple-gold-40: rgba(255, 226, 122, 0.40);
  --yc-maple-gold-45: rgba(255, 226, 122, 0.45);
  --yc-maple-gold-60: rgba(255, 226, 122, 0.60);
  --yc-maple-gold-70: rgba(255, 226, 122, 0.70);
  --yc-maple-gold-92: rgba(255, 226, 122, 0.92);

  /* NEW: maple bleed red (hero drop-shadow halo) */
  --yc-maple-red: #C8102E;
  --yc-maple-red-55: rgba(255, 18, 36, 0.55);
  --yc-maple-red-75: rgba(255, 32, 48, 0.75);
  --yc-maple-red-95: rgba(255, 32, 48, 0.95);

  /* NEW: parallax filter tokens (LOVE-locked dark values) */
  --yc-parallax-filter-1: invert(0.92) hue-rotate(180deg) brightness(0.7) contrast(1.1) saturate(0.25);
  --yc-parallax-filter-2: invert(0.92) hue-rotate(180deg) brightness(0.55) contrast(1.05) saturate(0.2) blur(1.5px);
  --yc-parallax-grid-color: rgba(255, 255, 255, 0.025);

  /* NEW: image filter tokens */
  --yc-product-img-filter: grayscale(0.55) brightness(0.78) contrast(1.08) saturate(0.85);
  --yc-supplier-img-filter: grayscale(0.35) brightness(0.85) contrast(1.06) saturate(0.9);
  --yc-logo-filter: brightness(0) invert(1);
  --yc-marquee-wordmark-glow: drop-shadow(0 0 6px rgba(255, 255, 255, 0.15));
}
```

**Migration of existing `.yc-page`-scoped tokens** — leave them alone in chunk 1; chunk 5 moves them to `:root` as part of the light mode wiring (Audit's recommendation).

**Acceptance:** svelte-check 0 errors. Page renders byte-identically to v1.20.29.

### Chunk 2 — Hardcoded rgba sweep
**No visual change.** Mechanical sweep replacing the most common hardcoded rgbas with token references.

Scope (per Audit, the highest-impact items):
- Maple gold (~25 sites): `rgba(255, 226, 122, X)` → `var(--yc-maple-gold-XX)` and `#ffe27a` → `var(--yc-maple-gold)`
- Maple red bleed (3 sites in `.yc-hero-leaf` hover): hardcoded rgbas → maple-red tokens

**Defer to chunk 4 / 5:** white-rgba sheens (~80 sites) and black-rgba shadows (~60 sites). These are too many for one chunk and will be handled by component overrides in chunk 5 instead. Most existing component CSS already uses `--yc-shimmer-*` and `--yc-ink-*` from v1.20.26 — only the leftover hardcoded inline rgbas in this chunk need tokens.

**Acceptance:** svelte-check 0 errors, byte-identical render.

### Chunk 3 — Parallax filter tokenization (LOVE-locked safe migration)
**No visual change.** Replace the 3 hardcoded filter values on `.yc-bg-plan-layer-1/2/3` with `var(--yc-parallax-filter-1)`, `var(--yc-parallax-filter-2)`, and the layer-3 grid color with `var(--yc-parallax-grid-color)`.

This is the **only edit** to the LOVE-locked parallax stack. The token values match the current literals character-for-character, so dark mode output is byte-identical. Justification documented inline:

```css
/* v1.21.0 — filter values lifted to tokens for theme support.
   Dark token resolves to the current literal — byte-identical. */
.yc-bg-plan-layer-1 {
  filter: var(--yc-parallax-filter-1);
  /* opacity, mask, transform UNCHANGED */
}
```

**Acceptance:** svelte-check 0 errors. Byte-identical parallax render. Visual diff against v1.20.29 produces zero pixel differences.

### Chunk 4 — Toggle infrastructure
**No visual change yet** (toggle isn't wired into navbar in this chunk).

Files created:
1. `src/lib/stores/theme.svelte.ts` — full content from `theme-toggle-plan.md`
2. `src/lib/components/ThemeToggle.svelte` — full content from `theme-toggle-plan.md`
3. Edit `src/app.html` — inject pre-hydration FOUC script

**Acceptance:** svelte-check 0 errors. Page still renders dark. Browser console shows `localStorage 'ay3:theme'` writable. `<html data-theme="dark">` set on first paint.

### Chunk 5 — Wire toggle into navbar + light mode block (THE BIG ONE)
**Visual change:** light mode becomes available via the toggle.

Steps:
1. Migrate the existing `.yc-page` color tokens (`--yc-bg`, `--yc-text`, `--accent-*`, `--card-accent`, `--badge-glow`, `--section-eyebrow`, `--yc-bg-2`, `--yc-surface*`, `--yc-border`, `--yc-text-muted`, `--yc-text-faint`, `--yc-plan-line`) from `.yc-page` to `:root` in `young-carpets-tokens.css`.

2. Add the full `[data-theme="light"] .yc-page { ... }` block per Design agent's spec — base canvas, all 22 alpha rungs flipped, new shadow primitives, griege-text variants, edge-y flip, parallax filter retunes, accessibility overrides (`prefers-contrast: more`, `prefers-reduced-transparency`).

3. Apply the ~22 `inset 0 1px 0 var(--yc-shimmer-*)` → `inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-*)` search-and-replace.

4. Add component-specific light overrides per Design spec:
   - `.yc-nav` — translucent white pill
   - `.yc-hero-leaf` — Canada red default + red glow on hover (smaller)
   - `.yc-maple-badge .yc-maple-leaf` — explicit Canada red
   - `.yc-stat` — soft warm shadows instead of black drop
   - `.yc-product-card` — warm-graphite-on-white gradient
   - `.yc-modal` + `.yc-modal-body` — light glass + warm scrim
   - `.yc-map-preview-iframe` — re-tuned filter for cream
   - `.yc-marquee-item img` — `brightness(0) invert(0)` so logos are black on white
   - `.yc-skip-link` — light bg, dark text
   - `.yc-dev-version-badge` — deeper gold (`#8a6a14`) for contrast on cream

5. Add `<ThemeToggle />` to the navbar markup with a divider, plus the `.yc-nav-divider` CSS.

6. Add the cross-theme transition: `.yc-page, .yc-nav, .yc-nav-brand, .yc-nav-link { transition: background-color 280ms, color 280ms, border-color 280ms, box-shadow 280ms; }` + reduced-motion override.

**Acceptance:** Click toggle → page flips. Refresh → theme persists. iOS dark/light system preference followed when no localStorage entry. svelte-check 0 errors.

### Chunk 6 — Re-review (parallel agents) + ship

Dispatch 2 agents in parallel:
1. **Error-check agent** — runs svelte-check, scans the route file for any new hardcoded colors that snuck in, verifies no ESM/runes errors.
2. **Design re-review agent** — opens the page mentally in light mode, checks every section against the spec's contrast targets, flags anything that looks broken.

Compile their outputs, fix anything they catch, bump version to **v1.21.0**, update RELAY.md `📌 LATEST` pin, push.

## Acceptance criteria

- [ ] Sun/moon toggle visible in floating navbar on `/young-carpets`
- [ ] Tap toggle → entire page flips to light theme in ~280ms
- [ ] Refresh → theme persists via localStorage
- [ ] Cold load with empty localStorage on light-mode OS → renders light
- [ ] Cold load with empty localStorage on dark-mode OS → renders dark
- [ ] No FOUC on reload (test with Slow 3G throttling)
- [ ] All text ≥ 4.5:1 contrast in both themes (body text)
- [ ] All UI elements ≥ 3:1 contrast in both themes
- [ ] All tap targets ≥ 44×44 in both themes
- [ ] Parallax bg looks right in both themes (architectural drafting feel preserved)
- [ ] All 8 product modals work in both themes
- [ ] Hero maple leaf is white in dark, Canada red in light
- [ ] Hero maple leaf hover glow is red in both
- [ ] Maple badge leaf is Canada red in both modes
- [ ] Marquee logos are white in dark, black in light
- [ ] Skip link reads in both
- [ ] Dev version badge readable in both
- [ ] svelte-check 0 errors
- [ ] prefers-reduced-motion disables theme transition
- [ ] prefers-contrast: more darkens muted/faint text in light
- [ ] prefers-reduced-transparency drops backdrop-filter in light
- [ ] Multi-tab toggle sync via storage events

## Deferred to v1.21.1+

- Maple-plan modal SVG markup colors (~44 sites). User rarely sees this modal; ship light-mode v1.21.0 with it as "always dark."
- Full hardcoded white-rgba sweep (~80 sites) — many are inside component-specific gradients that get overridden in chunk 5 anyway.
- Full hardcoded black-rgba sweep (~60 sites) — same reasoning.
- Full gradient migration to glass-pattern tokens (~32 sites) — chunk 5 component overrides handle the highest-visibility gradients; rest can be tokenized later.
- Theme-aware `<meta name="theme-color">` — needs reactive svelte:head; non-blocking polish.

## Risks

1. **Parallax filter contrast may overshoot** — fallback ready (`contrast(1.18) brightness(1.10)`).
2. **`--yc-edge-y` mass replacement** — if any of the ~22 sites missed, those elements look "upside down" in light. Mitigation: grep audit before commit.
3. **Theme transition jank** — if too many properties animate at once. Mitigation: scoped transition, not global.
4. **Square721 wordmark on cream** may look anemic. Mitigation: bump weight 400→500 in light if needed (simple override).
5. **iOS Safari matchMedia** — wrapped in try/catch for older iOS.
