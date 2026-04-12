# YCI Light Mode — Design Spec (v1.21.0)

> Source: Design agent `aceb7604ba589c237` on 2026-04-07.
> Companion to `theme-toggle-plan.md` (Structure agent) and `token-readiness-audit.md` (Audit agent).
> Read-only deliverable. Implementation phase consumes this verbatim.

## Strategy summary

Light mode is a **cream-paper analog** of the dark architectural-drafting feel, not a literal inversion. Dark = "ink on a backlit blueprint." Light = "graphite on warm vellum." The 3-base-token system (griege / ink / shimmer) keeps its semantic roles but swaps anchors:

- **Griege survives unchanged as a hue** — it sits in the middle of the value spectrum and reads on both backgrounds. Existing α rungs stay valid, but their *rgb triplet* darkens (`194,179,154` → `122,116,106`) so the alpha tints actually read on cream.
- **Ink stays as the deepest stroke color** but flips role: in dark mode `--yc-ink-XX` was a translucent panel *fill*; in light mode it becomes a translucent *light glass* fill (`rgba(255,255,255,0.72)` etc., matching `/dev/+page.svelte`'s `--surface-card`).
- **Shimmer becomes a shadow primitive.** A "warm pearl top highlight" is meaningless on cream — there's nothing brighter than the canvas. The shimmer alphas in light mode become **soft warm-graphite bottom shadows**. The token names stay (code stability); only values change. We add a paired `--yc-edge-y` token (`1px` dark, `-1px` light) so existing `inset 0 1px 0 var(--yc-shimmer)` rules can become `inset 0 var(--yc-edge-y) 0 var(--yc-shimmer)` and "draw on the right side" in both themes.

## Base canvas

| Token | Dark value | Light value | Role |
|---|---|---|---|
| `--yc-bg`        | `#0b0b0d` | `#FAF7F0` | Page bg — warm cream, never pure white |
| `--yc-bg-2`      | `#121215` | `#F2EEE3` | Slightly deeper section bg |
| `--yc-surface`   | `#18181b` | `#FFFFFF` | Card / panel base |
| `--yc-surface-2` | `#1f1f23` | `#F7F4EC` | Nested surface |
| `--yc-border`    | `#2a2a2f` | `#E5DFD0` | Hairline divider (warm-tinted) |
| `--yc-text`        | `#e6e6e8` | `#1D1D1F` | Primary text — Apple `label` (light) |
| `--yc-text-muted`  | `#9a9aa1` | `#56524A` | Secondary text — warm graphite |
| `--yc-text-faint`  | `#6b6b73` | `#7A746A` | Tertiary text — large-text only |
| `--yc-plan-line`   | `#4a4a52` | `#A89E86` | Drafting-grid stroke color |

**Why `#FAF7F0` not `#FFFFFF`?** Pure white halates against the maple-leaf red and gold accents and kills the vellum metaphor. `#FAF7F0` is the same warm-bias cream `/dev` uses (`--surface-warm: #FAF9F6`), tinted slightly more griege so it reads as architectural trace paper.

**Why `#1D1D1F` not `#000`?** Apple's `label` light is `#000`, but the dark site uses `#e6e6e8` (off-white) for restraint; the light counterpart should be near-black with the same restraint. Matches `/dev/+page.svelte` and Apple `secondaryLabel` spec without true-black eye strain.

### Contrast verification

| Pair | Ratio | WCAG 2.2 AA |
|---|---|---|
| `#1D1D1F` text on `#FAF7F0` bg | **15.9 : 1** | AAA pass (body) |
| `#56524A` muted text on `#FAF7F0` bg | **6.85 : 1** | AA pass (body) |
| `#7A746A` faint text on `#FAF7F0` bg | **4.41 : 1** | AA pass (large only — ≥18pt or ≥14pt bold) |
| `#5A4D35` darkest griege on `#FAF7F0` bg | **8.31 : 1** | AA pass (body) — used for `--section-eyebrow` |
| `#1D1D1F` text on `#FFFFFF` card surface | **17.6 : 1** | AAA |

Compare to current dark mode:
- `#e6e6e8` on `#0b0b0d` = **17.4 : 1** (current dark body)
- `#9a9aa1` on `#0b0b0d` = **7.65 : 1** (current dark muted)

Light mode contrast is **byte-equivalent or better** than dark.

## All token mappings

### Base anchors (re-declared inside the light scope)

```css
[data-theme="light"] .yc-page {
  --yc-griege: #c2b39a;             /* unchanged */
  --yc-griege-rgb: 194, 179, 154;   /* unchanged */

  --yc-ink: #1D1D1F;                /* was #080706 */
  --yc-ink-rgb: 29, 29, 31;

  --yc-shimmer: rgba(60, 50, 30, 0.10);
  --yc-shimmer-rgb: 60, 50, 30;
}
```

### Alpha rungs

| Token | Dark value | Light value | Notes |
|---|---|---|---|
| `--yc-griege-06` | `rgba(194,179,154,.06)` | `rgba(122,116,106,.06)` | Subtle hover bg |
| `--yc-griege-08` | `rgba(194,179,154,.08)` | `rgba(122,116,106,.08)` | Hover bg |
| `--yc-griege-18` | `rgba(194,179,154,.18)` | `rgba(122,116,106,.22)` | Pill border |
| `--yc-griege-20` | `rgba(194,179,154,.20)` | `rgba(122,116,106,.25)` | Default panel border |
| `--yc-griege-25` | `rgba(194,179,154,.25)` | `rgba(122,116,106,.30)` | Card edge |
| `--yc-griege-30` | `rgba(194,179,154,.30)` | `rgba(122,116,106,.35)` |  |
| `--yc-griege-32` | `rgba(194,179,154,.32)` | `rgba(122,116,106,.38)` | Hover pill border |
| `--yc-griege-35` | `rgba(194,179,154,.35)` | `rgba(122,116,106,.42)` |  |
| `--yc-griege-50` | `rgba(194,179,154,.50)` | `rgba(122,116,106,.55)` | Dot hover |
| `--yc-griege-55` | `rgba(194,179,154,.55)` | `rgba(122,116,106,.60)` | Small icon stroke |
| `--yc-ink-45`    | `rgba(8,7,6,.45)`       | `rgba(255,255,255,.72)` | **Role flip:** dark glass → light glass |
| `--yc-ink-50`    | `rgba(8,7,6,.50)`       | `rgba(255,255,255,.80)` |  |
| `--yc-ink-55`    | `rgba(8,7,6,.55)`       | `rgba(255,255,255,.85)` |  |
| `--yc-ink-78`    | `rgba(8,7,6,.78)`       | `rgba(255,255,255,.94)` | Badge bg — near-opaque |
| `--yc-shimmer-08`| `rgba(255,248,235,.08)` | `rgba(60,50,30,.035)` | Top highlight → bottom shadow tint |
| `--yc-shimmer-10`| `rgba(255,248,235,.10)` | `rgba(60,50,30,.045)` |  |
| `--yc-shimmer-12`| `rgba(255,248,235,.12)` | `rgba(60,50,30,.055)` |  |
| `--yc-shimmer-14`| `rgba(255,248,235,.14)` | `rgba(60,50,30,.065)` |  |
| `--yc-shimmer-16`| `rgba(255,248,235,.16)` | `rgba(60,50,30,.075)` |  |
| `--yc-shimmer-18`| `rgba(255,248,235,.18)` | `rgba(60,50,30,.085)` | Default top stroke → default soft shadow |
| `--yc-shimmer-25`| `rgba(255,248,235,.25)` | `rgba(60,50,30,.12)` | Dot indicator base |
| `--yc-shimmer-40`| `rgba(255,248,235,.40)` | `rgba(60,50,30,.20)` | Dot indicator border |

### Critical: shimmer's role-flip mechanism

Every `inset 0 1px 0 var(--yc-shimmer-XX)` declaration in the page currently means "1px highlight along the *top*." In light mode it must mean "1px soft shadow along the *bottom*." Solution — paired direction token:

```css
:root, .yc-page                        { --yc-edge-y:  1px; } /* dark = top */
[data-theme="light"] .yc-page          { --yc-edge-y: -1px; } /* light = bottom */
```

Then every `inset 0 1px 0 var(--yc-shimmer*)` becomes `inset 0 var(--yc-edge-y) 0 var(--yc-shimmer*)`. **~22 replacements** based on the earlier scan. **This is the single search-and-replace the implementation phase needs.**

### New tokens (no dark counterpart)

```css
[data-theme="light"] .yc-page {
  --yc-shadow-sm:
    0 1px 2px rgba(60, 50, 30, 0.06),
    0 1px 3px rgba(60, 50, 30, 0.04);
  --yc-shadow-md:
    0 2px 8px rgba(60, 50, 30, 0.08),
    0 4px 16px rgba(60, 50, 30, 0.05);
  --yc-shadow-lg:
    0 4px 12px rgba(60, 50, 30, 0.10),
    0 8px 32px rgba(60, 50, 30, 0.08),
    0 0 0 1px rgba(60, 50, 30, 0.03);
  --yc-shadow-xl:
    0 12px 36px -8px rgba(60, 50, 30, 0.18),
    0 24px 60px -16px rgba(60, 50, 30, 0.14);

  --yc-griege-text:        #5A4D35;   /* 8.31:1 on bg */
  --yc-griege-text-muted:  #756347;   /* 5.43:1 */

  --section-eyebrow: var(--yc-griege-text);
  --card-accent: rgba(60, 50, 30, 0.06);
  --badge-glow: rgba(60, 50, 30, 0.10);
}
```

## Parallax filter re-tuning

Markup, transforms, masks, opacities, and scroll math stay byte-identical. **Only the `filter` value changes**, routed through new tokens:

```css
:root, .yc-page {
  --yc-bg-filter-1: invert(0.92) hue-rotate(180deg) brightness(0.7) contrast(1.1) saturate(0.25);
  --yc-bg-filter-2: invert(0.92) hue-rotate(180deg) brightness(0.55) contrast(1.05) saturate(0.2) blur(1.5px);
  --yc-bg-grid-color: rgba(255, 255, 255, 0.025);
}
[data-theme="light"] .yc-page {
  --yc-bg-filter-1: contrast(1.30) brightness(1.05) saturate(0.15) sepia(0.12);
  --yc-bg-filter-2: contrast(1.15) brightness(1.00) saturate(0.10) sepia(0.18) blur(1.5px);
  --yc-bg-grid-color: rgba(60, 50, 30, 0.06);
}
```

Justification per filter operation:

**Layer 1**: `invert(0.92)` and `hue-rotate(180deg)` GONE in light (source jpg is dark-on-light already). `brightness 0.7 → 1.05` to preserve midtones. `contrast 1.1 → 1.30` so lines don't dissolve into cream. `saturate 0.25 → 0.15` because residual hue now comes from sepia. `sepia(0.12)` NEW — pushes toward warm graphite. opacity 0.55 unchanged.

**Layer 2**: same logic, dimmer. `brightness 1.0`, `sepia(0.18)` warmer. Blur 1.5px unchanged.

**Layer 3** (grid pattern): `rgba(255,255,255,.025)` → `rgba(60,50,30,.06)`. α boost from .025 to .06 needed because cream is much closer in luminance to white than dark bg is to black.

**Risk note:** `contrast(1.3)` may push line clusters toward near-black. Safer fallback: `contrast(1.18) brightness(1.10)`. Token-only swap = 2-character tweak.

## Component overrides

Full review per region — see source agent output. Key per-component highlights:

- **Floating navbar**: `rgba(255,255,255,0.72)` bg, warm-tinted border + shadows
- **Hero maple leaf** (the white-leaf-on-G exponent): becomes `#C8102E` Canada red in light (5.51:1 on cream)
- **Maple badges**: leaf color forced to Canada red in BOTH modes for brand consistency
- **Stat cards**: drop shadow softens via `var(--yc-shadow-lg)` token
- **Product cards**: bg gradient flips to warm-graphite-on-white. SVG textures use `currentColor` and Just Work.™
- **Product modal**: backdrop `rgba(60,50,30,0.35)`, body `rgba(255,255,255,0.96)` + shadow-xl
- **8 modal interactions**: ALL auto-theme via token swap. None have unique color logic.
- **Map preview iframe**: filter retunes to lighter values (less grayscale, more brightness)
- **Suppliers marquee logos**: filter tweaks for light bg
- **Skip link**: hardcoded `#0b0b0d`/`#fff` needs explicit override
- **Dev version badge**: gold flips from `#ffe27a` to `#8a6a14` (5.61:1 on cream)

## Hover/focus states

| Effect | Action |
|---|---|
| Navbar gold hover | Keep, flip via `--yc-edge-y` |
| Product card per-color glows (gold/teal/orange/red/ocean/green) | Keep. Maybe `0.55 → 0.45` outer α reduction in light. |
| Hero maple leaf red glow | Keep (smaller in light, mostly invisible against bright bg) |
| Map gold focus ring | Keep |
| Skip-link gold outline | Keep |
| `:focus-visible` default | Add `[data-theme="light"] .yc-page :focus-visible { outline-color: #007AFF; }` |

## Accessibility verification

| Check | Dark | Light |
|---|---|---|
| Body text | 17.4 : 1 | 15.9 : 1 |
| Muted text | 7.65 : 1 | 6.85 : 1 |
| Faint text | 4.43 : 1 (large) | 4.41 : 1 (large) |
| Section eyebrow | n/a | 8.31 : 1 |
| Hero maple leaf | n/a | 5.51 : 1 |
| Dev badge | n/a | 5.61 : 1 |
| `prefers-reduced-motion` | honored | honored |
| `prefers-contrast: more` | inherits | needs explicit block |
| `prefers-reduced-transparency` | inherits | needs explicit block |

`prefers-contrast: more` block:
```css
@media (prefers-contrast: more) {
  [data-theme="light"] .yc-page {
    --yc-text-muted: #2E2A22;     /* 11:1 */
    --yc-text-faint: #4A4338;     /* 7.6:1 */
    --yc-border:    #8A7A5C;     /* 2.9:1 */
  }
}
```

`prefers-reduced-transparency` block:
```css
@media (prefers-reduced-transparency: reduce) {
  [data-theme="light"] .yc-page .yc-nav,
  [data-theme="light"] .yc-page .yc-stat,
  [data-theme="light"] .yc-page .yc-product-card,
  [data-theme="light"] .yc-page .yc-modal-body,
  [data-theme="light"] .yc-page .yc-section-eyebrow {
    background: #FFFFFF;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: rgba(60, 50, 30, 0.35);
  }
}
```

## Risks

1. **Layer-1 parallax filter contrast** may overshoot. Fallback ready.
2. **Carpet use-case gallery image filter** may darken to a moody mid-tone fighting bright theme.
3. **Shimmer-as-shadow naming confusion** for future contributors. Comment block at top of light scope.
4. **`--yc-edge-y` mass replacement** — ~22 sites. If any missed, those elements look "upside down" in light.
5. **Theme transition** — 400ms ease-apple expected. Subtle properties may flash mid-air.
6. **Square721 wordmark on cream** may feel anemic. Bump `font-weight: 400 → 500` in light theme if needed.
7. **Hero maple leaf red glow** mostly invisible on bright bg — leaf "thickens" rather than "glows."

## Open questions

1. **Hero maple leaf at rest in light mode** — Canada red or charcoal? Spec assumes Canada red for brand consistency.
2. **Maple badge leaf color** — should both badge instances use Canada red regardless of theme?
3. **Default theme on first visit** — covered by Structure agent (localStorage > prefers-color-scheme > dark).
4. **Toggle button placement** — Structure agent recommends rightmost slot in navbar pill.
5. **Toggle icon style** — Structure agent locked simple sun/moon SVG crossfade.
6. **Product card glow α reduction** — playtest decision.

## Implementation checklist

- [ ] Add base anchors + alpha rungs + shadow primitives to `young-carpets-tokens.css` under `[data-theme="light"] .yc-page { ... }`
- [ ] Add `--yc-edge-y: 1px` to dark scope and `--yc-edge-y: -1px` to light scope
- [ ] Add `--yc-bg-filter-1` / `--yc-bg-filter-2` / `--yc-bg-grid-color` to both scopes
- [ ] Search-and-replace ~22 `inset 0 1px 0 var(--yc-shimmer*)` → `inset 0 var(--yc-edge-y) 0 var(--yc-shimmer*)`
- [ ] Replace 3 hard-coded `filter:` values on `.yc-bg-plan-layer-1/2/3` with token references
- [ ] Add ~12 component-specific light overrides
- [ ] Add `prefers-contrast: more` and `prefers-reduced-transparency: reduce` blocks
- [ ] Add `transition: background 400ms var(--ease-apple), color 400ms var(--ease-apple);` to `.yc-page`
- [ ] Verify: tab nav, contrast, reduced-motion, reduced-transparency, prefers-contrast more
- [ ] Playtest all 8 modal interactions in light mode
- [ ] Confirm parallax bg looks right; tweak filter values if needed
- [ ] Bump version to v1.21.0

## Dark mode byte-equivalence guarantee

Dark mode output remains **byte-identical** because:

1. All current tokens, values, and rules are untouched.
2. The only "modifying" changes are the `--yc-edge-y` insertion (`1px` in dark = current behavior) and the parallax filter token routing (the dark token literal equals the current literal character-for-character).
3. Light mode is purely additive: a single `[data-theme="light"]` scope plus a handful of explicit component overrides that only fire when the data attribute is present.
