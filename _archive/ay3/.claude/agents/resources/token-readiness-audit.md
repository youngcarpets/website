# YCI Theme-Readiness Audit (v1.21.0 prep)

> Source: Audit agent `adaf6186c4ad67a06` on 2026-04-07.
> Companion to `light-mode-spec.md` (Design) and `theme-toggle-plan.md` (Structure).
> Read-only deliverable. Implementation phase consumes this as a checklist.

## Summary

- Hex literals in `<style>` block: **39** (9 in neutral palette block at L2332-2340, 14 maple-gold/griege literals, 2 `#fff`, 10 parallax `#000` mask stops which are alpha-only/safe, plus a few `#0b0b0d`/`#07070a`)
- Hex literals in SVG markup: **1** (`#ffe27a` at L1832)
- `<meta name="theme-color" content="#0b0b0d">` at L950
- `rgba(255,255,255,α)` in `<style>`: **~80** (all theme-blocking)
- `rgba(0,0,0,α)` in `<style>`: **~60** (10 are parallax mask stops, alpha-only/safe; the other ~50 are drop-shadows + bottom rims, all theme-blocking)
- `rgba(255,226,122,α)` in `<style>`: **~25** (maple-gold sibling, no token yet)
- Custom near-black panel bases (`rgba(18..20,18..20,21..24,α)`): **4**
- SVG attribute rgba fills/strokes (markup, NOT css): **~44**, all inside maple-plan modal SVGs L1632-2030 — **highest-effort cluster**
- CSS gradients (linear + radial): **32**, of which ~25 have hardcoded white/black stops
- CSS filters: ~50 total, ~10 carry colour assumptions (`invert`, `brightness(0) invert(1)`, hardcoded drop-shadow rgba)
- `currentColor` SVG attributes (theme-safe automatically): **12**
- Distinct CSS variable names in use: **34** (all defined locally in `.yc-page` or in yc-tokens file — **none come from app.css**, confirmed via grep)
- Estimated lines of CSS needing theme treatment: **~320**

## Existing CSS variables in use

Confirmed: **zero** of these come from `app.css`. Every variable resolves either inside `.yc-page { ... }` (lines 2332-2386) or from `young-carpets-tokens.css` `:root`. One file + one block to theme.

### Neutral palette (locked-black, no light values yet)

| Variable | Dark value | Used by | Light variant? |
|---|---|---|---|
| `--yc-bg` | `#0b0b0d` | `.yc-page { background }` L2391 | YES (page bg) |
| `--yc-bg-2` | `#121215` | (defined, no consumer found) | YES if kept |
| `--yc-surface` | `#18181b` | (defined, no consumer) | YES if kept |
| `--yc-surface-2` | `#1f1f23` | (defined, no consumer) | YES if kept |
| `--yc-border` | `#2a2a2f` | `.yc-supplier-marquee` L3381, `.yc-footer` L3395 | YES |
| `--yc-text` | `#e6e6e8` | 22+ selectors (body, headings, hover) | YES (primary text) |
| `--yc-text-muted` | `#9a9aa1` | 18+ selectors | YES |
| `--yc-text-faint` | `#6b6b73` | 10+ selectors | YES |
| `--yc-plan-line` | `#4a4a52` | (defined, no consumer) | YES if kept |

### Accent palette (raw RGB triples)

| Variable | Dark value | Used by |
|---|---|---|
| `--accent-gold` | `212, 164, 74` | Skip-link, focus rings, glow shadows, pill hover, reserve CTA |
| `--accent-gold-hot` | `232, 184, 90` | Focus ring, badge dot, ribbon highlight |
| `--accent-orange` | `255, 122, 47` | Stat pill orange variant |
| `--accent-red` | `229, 76, 60` | Stat pill red variant |
| `--accent-teal` | `46, 196, 182` | Stat pill teal variant |
| `--accent-ocean` | `46, 138, 230` | Stat pill ocean variant |
| `--accent-green` | `60, 200, 110` | Stat pill green variant |

### Effect tokens (the most theme-blocking category)

| Variable | Dark value | Used by | Notes |
|---|---|---|---|
| `--card-accent` | `rgba(255,255,255,0.1)` | `.yc-product-card` border L3626 | **CRITICAL.** White accent vanishes on light. |
| `--badge-glow` | `rgba(255,255,255,0.12)` | `.yc-product-badge` shadow L4058 | **CRITICAL.** |
| `--section-eyebrow` | `rgba(255,255,255,0.55)` | hero/section eyebrows | **CRITICAL.** Invisible on light. |

### Tokens already in `young-carpets-tokens.css`

`--yc-griege` (`#c2b39a`), `--yc-ink` (`#080706`), `--yc-shimmer` (`rgba(255,248,235,0.18)`), plus 10 griege alpha rungs (06-55), 4 ink rungs (45-78), 8 shimmer rungs (08-40).

## Hardcoded hex literals (in `<style>` block)

| Line | Color | Selector | Suggested treatment |
|---|---|---|---|
| 950 | `#0b0b0d` | `<meta theme-color>` | Bind via reactive `<svelte:head>` |
| 1832 | `#ffe27a` | maple-leaf SVG `<path fill>` | `currentColor` + `--yc-maple-gold` |
| 2230 | `#ffe27a` | `.yc-maple-badge { color }` | `--yc-maple-gold` |
| 2249 | `#0b0b0d` | `.yc-maple-badge--motion-stuck { background }` | `var(--yc-bg)` |
| 2250 | `#fff` | same selector { color } | `var(--yc-text)` |
| 2332-2340 | 9 hexes | neutral palette block | **Already tokens — need `[data-theme=light]` overrides** |
| 2462, 2471, 2488, 2496, 2515, 2523 | `#000` | parallax L1/L2/L3 mask stops | LOVE-locked, alpha-only/safe — leave |
| 2610 | `#fff` | `.yc-nav-link.active { color }` | `var(--yc-text)` |
| 2751 | `#ffffff` | `.yc-hero-maple { color }` | `var(--yc-text)` or accent on light |
| 3376 | `#07070a` | `.yc-supplier-marquee { background }` | new `--yc-marquee-bg` |
| 3512, 3714 | `#fff` | stat number/value | `var(--yc-text)` |
| 4344, 4391, 4641, 4653, 4765, 4832, 4887, 5054 | `#ffe27a` | maple modal section headings | `--yc-maple-gold` |
| 4427, 4675, 5016 | `#c2b39a` | maple modal sub-text | `var(--yc-griege)` |
| 4580 | `#ffe27a` | maple reserve CTA bg | `--yc-maple-gold` |
| 5198-5206 | `#000` | marquee mask stops | alpha-only/safe — leave |

## Hardcoded `rgba()` literals (excluding griege/ink/shimmer triples)

### White sheens `rgba(255,255,255,α)` — ~80 matches, ALL theme-blocking

Used for inner-top 1px highlights on every glass panel, card accents, product borders, badge glow, hover bgs, section eyebrow, sheen gradients, modal bg, nav hover, maple sub-panels.

**Strategy:** introduce `--yc-sheen-XX` rungs (02, 03, 04, 05, 06, 08, 10, 12, 14, 16, 18, 20, 22, 25, 55, 65, 85, 90). Dark resolves to current `rgba(255,255,255,α)`; light resolves to ink-family `rgba(8,7,6,α)`.

### Black shadows `rgba(0,0,0,α)` — ~60 matches

Drop shadows, bottom rims (`inset 0 -1px 0`), gradient base darks, modal scrims.

Custom near-black panel bases (5 matches):
- L2553 `rgba(18,18,21,0.55)` (.yc-nav)
- L3102 `rgba(20,20,24,0.95)` (stat-card mobile)
- L3274 `rgba(18,18,21,0.7)` (tag)
- L4142 `rgba(8,8,10,0.7)` (modal overlay)

**Strategy:** `--yc-shadow-XX` rungs (14, 18, 22, 25, 30, 35, 42, 45, 50, 55, 60, 65, 70, 75, 78, 80). Dark stays black; light becomes warm brown or softer ink. Custom panels get named tokens.

### Maple-plan gold `rgba(255,226,122,α)` — ~25 matches

`#ffe27a` with alpha — sibling to `--accent-gold` but a different (lighter/buttery) hue, used throughout the maple-plan modal.

**Strategy:** new base `--yc-maple-gold: #ffe27a` + alpha rungs `08, 10, 14, 35, 40, 45, 60, 70, 92`.

### Hardcoded red drop-shadow (maple bleed)

L2779-2782: `drop-shadow(0 0 6px rgba(255,32,48,0.95)) drop-shadow(0 0 14px rgba(255,32,48,0.75)) drop-shadow(0 0 28px rgba(255,18,36,0.55))`.

**Strategy:** `--yc-maple-red-55/75/95` tokens.

### Hardcoded white drop-shadow

L5152: `filter: drop-shadow(0 0 6px rgba(255,255,255,0.15))` on marquee wordmark. Token: `--yc-marquee-wordmark-glow`.

## SVG `fill=` and `stroke=` attributes with hardcoded colours

### Theme-safe: `currentColor` (12 matches)

Lines 1060, 1079, 1117, 1133, 1147, 1178, 1220, 1240, 1260, 1287, 1309, 2146. These ride parent `color:` — free theming.

### Theme-blocking: hardcoded rgba/hex SVG attributes (~44 matches)

ALL inside the maple-plan modal architectural diagram SVGs, lines **1632-2030**. Use:
- `rgba(194,179,154, 0.22-0.95)` — griege (~12 instances)
- `rgba(255,248,235, 0.06-0.55)` — shimmer (~14 instances)
- `rgba(255,226,122, 0.55-0.92)` — maple gold (~8 instances)
- `rgba(8,7,6, 0.5)` — ink (1 instance)
- `#ffe27a` — maple gold hex (1 instance)

These are baked into MARKUP, not CSS, so a `[data-theme=light]` CSS rule does NOT affect them.

**Three options:**
1. **Best:** Lift to outer `<svg style="--plan-griege: var(--yc-griege-30); ...">` and rewrite each `fill=`/`stroke=` to `var(--plan-*)`. Modern SVG supports `var()` in attributes.
2. **Compromise:** Wrap cluster, apply `filter: invert(1) hue-rotate(180deg)` on light. Cheap, washes the gold.
3. **Worst:** Leave as-is — modal stays "dark mode" even in light. Acceptable since modal opens on a dim overlay.

**Recommended:** Option 1, post-tokens lock. ~44-edit mechanical pass.

## CSS gradients with hardcoded color stops

32 gradients, of which ~25 have hardcoded white/black stops. Key ones (need glass-pattern token migration):

- L2509-2510: parallax L3 grid (token-routable)
- L2908-3041: stat-card layers (5 gradients)
- L3261-3266: product image veil
- L3620-3674: product card layers (3 gradients)
- L3814-3953: product modal panel layers (4 gradients)
- L4156-4161: modal body
- L4967-4972: maple card
- L5257-5262: CTA card (already token-driven)
- L5317-5322: touch product card ::before

**Strategy:** every glass-pattern gradient becomes a gradient token like `--yc-glass-bg: linear-gradient(165deg, var(--yc-sheen-08) 0%, var(--yc-sheen-02) 45%, var(--yc-shadow-18) 100%)`.

## Filters that imply a specific background

| Line | Selector | Filter | Concern |
|---|---|---|---|
| 2457 | `.yc-bg-plan-layer-1` (LOVE-locked) | `invert(0.92) hue-rotate(180deg) brightness(0.7) contrast(1.1) saturate(0.25)` | **CRITICAL.** Inverts light paper scan into dark blueprint. Light wants different chain. |
| 2483 | `.yc-bg-plan-layer-2` (LOVE-locked) | `invert(0.92) hue-rotate(180deg) brightness(0.55) contrast(1.05) saturate(0.2) blur(1.5px)` | Same |
| 2779-2782 | `.yc-hero-maple` bleed | 3× `drop-shadow(rgba(255,32,48,…))` | Hardcoded red — needs `--yc-maple-red-*` tokens |
| 3250 | `.yc-product-card img` | `grayscale(0.55) brightness(0.78) contrast(1.08) saturate(0.85)` | **Dark-tuned.** On light, products muddy. |
| 3331 | supplier img | `grayscale(0.35) brightness(0.85) contrast(1.06) saturate(0.9)` | Same |
| 5152 | marquee wordmark | `drop-shadow(0 0 6px rgba(255,255,255,0.15))` | Hardcoded white |
| 5280 | `.yc-marquee-item img` | `brightness(0) invert(1)` | **CRITICAL.** Forces all supplier logos to white. Light wants `brightness(0) invert(0)`. |

**Strategy:** `--yc-parallax-filter-1`, `--yc-parallax-filter-2`, `--yc-product-img-filter`, `--yc-supplier-img-filter`, `--yc-logo-filter`, `--yc-marquee-wordmark-glow`. Each theme defines its own filter chain.

## Critical risks for light mode

If we just slap `[data-theme=light]` onto the existing tokens without further work, here's what immediately breaks (severity order):

1. **Every glass panel** — `rgba(255,255,255,0.02-0.08)` over white = invisible or negative-contrast
2. **Every drop-shadow** — `rgba(0,0,0,0.5-0.8)` over light = hard stamp not soft lift
3. **`--section-eyebrow: rgba(255,255,255,0.55)`** — invisible on white, all section headers vanish
4. **`--card-accent` and `--badge-glow`** — product card borders disappear, maple badge floats
5. **Marquee logos** — `brightness(0) invert(1)` makes every supplier logo a white ghost
6. **Parallax plan background** — `invert(0.92) hue-rotate(180deg)` is engineered for dark output
7. **Product card images** — grayscale+brightness tuned for dark surfaces, become muddy
8. **Every hardcoded `#fff` text colour** — invisible on white
9. **Maple-plan modal SVG fills** — hardcoded rgba in markup, won't theme via CSS at all
10. **`--yc-shimmer` warm pearl top-sheen** — reads as yellow haze on light

## Recommended additions to `young-carpets-tokens.css`

New token slots needed BEFORE Design agent locks light values:

```css
:root {
  /* Already present: --yc-griege, --yc-ink, --yc-shimmer + 22 alpha rungs */

  /* NEW: maple-plan accent (the buttery #ffe27a gold) */
  --yc-maple-gold: #ffe27a;
  --yc-maple-gold-rgb: 255, 226, 122;
  /* + 9 alpha rungs */

  /* NEW: maple bleed red (hero drop-shadow halo) */
  --yc-maple-red-55: rgba(255, 18, 36, 0.55);
  --yc-maple-red-75: rgba(255, 32, 48, 0.75);
  --yc-maple-red-95: rgba(255, 32, 48, 0.95);

  /* NEW: sheen rungs (white in dark, ink in light) — replaces ~80 hardcoded white rgbas */
  /* 18 rungs */

  /* NEW: shadow rungs (black in dark, warm dark in light) — replaces ~50 hardcoded black rgbas */
  /* 16 rungs */

  /* NEW: custom panel bases */
  --yc-glass-nav-bg: rgba(18, 18, 21, 0.55);
  --yc-glass-stat-mobile-bg: rgba(20, 20, 24, 0.95);
  --yc-glass-tag-bg: rgba(18, 18, 21, 0.70);
  --yc-modal-scrim: rgba(8, 8, 10, 0.70);

  /* MIGRATE OUT of .yc-page so light override is one block */
  /* 9 hexes from neutral palette */
  /* --card-accent, --badge-glow, --section-eyebrow */

  /* MIGRATE accent-* triples (so light theme can shift them) */
  /* 7 RGB triples */

  /* NEW: filter tokens */
  --yc-parallax-filter-1: invert(0.92) hue-rotate(180deg) brightness(0.70) contrast(1.10) saturate(0.25);
  --yc-parallax-filter-2: invert(0.92) hue-rotate(180deg) brightness(0.55) contrast(1.05) saturate(0.20) blur(1.5px);
  --yc-product-img-filter: grayscale(0.55) brightness(0.78) contrast(1.08) saturate(0.85);
  --yc-supplier-img-filter: grayscale(0.35) brightness(0.85) contrast(1.06) saturate(0.90);
  --yc-logo-filter: brightness(0) invert(1);
  --yc-marquee-wordmark-glow: drop-shadow(0 0 6px rgba(255, 255, 255, 0.15));
}

[data-theme='light'] {
  /* Notable inversions: */
  --yc-logo-filter: brightness(0) invert(0);  /* black logos on white */
  --yc-marquee-wordmark-glow: drop-shadow(0 0 6px rgba(8, 7, 6, 0.15));
  /* sheens go from white-α to ink-α */
  /* shadows stay black or become warm brown */
  /* parallax filters get a non-inverting chain */
}
```

## Migration order (recommended)

1. Add all new token SLOTS to yc-tokens.css (dark values only, empty light block). **No visual change.**
2. Mechanical refactor of route: hardcoded white rgbas → `var(--yc-sheen-XX)`, black rgbas → `var(--yc-shadow-XX)`, maple gold → maple-gold tokens. **No visual change if values match.**
3. Move `--yc-bg`, `--yc-text`, `--accent-*` definitions OUT of `.yc-page` into `:root` in tokens file. **No visual change.**
4. Migrate the 3 hero-maple bleed drop-shadows to maple-red tokens. **No visual change.**
5. Migrate the 10 colour-laden filter chains to filter tokens. **No visual change.**
6. Tackle the 44 SVG markup fills inside maple-plan modal — inline `style="--plan-*: …"` on outer `<svg>`, rewrite attributes to `var()`. **No visual change.**
7. NOW write the `[data-theme='light']` block (Design agent leads).
8. Add `<html data-theme>` binding + theme toggle UI.

## Files to NOT touch

- **3-layer parallax bg** (`.yc-bg-plan-layer-1/2/3`, L2455-2530) — LOVE-locked. Filter chains and mask geometry must be migrated to **tokens** without changing the current visual result. Do NOT edit values directly.
- **Anything in `/dev`** — separate track.
- **`#000` mask-image stops** (L2462, 2471, 2488, 2496, 2515, 2523, 5198, 5199, 5205, 5206) — alpha-channel only, colourless from theming POV.
- **`currentColor` SVG fills/strokes** (12 instances) — already theme-safe.
- **Motion tokens** (`--t-*`, `--e-*`) — colourless.
- **Pointer state vars** (`--ptr-*`, `--yc-scroll`, `--yc-tilt-*`) — runtime.
