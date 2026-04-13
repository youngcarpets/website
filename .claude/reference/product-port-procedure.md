# Product Port Procedure

Repeatable process for adding each product's content to the shared `ProductContentModal`.

## Files involved

- `src/lib/content/product-details.ts` — add content data object
- `src/lib/components/ProductContentModal.svelte` — add interactive feature (SVG + state)
- `_archive/ay3/my-portal/src/routes/young-carpets/components/YcModal*.svelte` — source content
- `_archive/ay3/my-portal/src/lib/styles/young-carpets.css` — source animation CSS
- `_archive/ay3/my-portal/src/lib/styles/young-carpets-tokens.css` — source color token definitions

## Steps per product

### 1. Read the ay3 source
- Read `_archive/ay3/.../YcModal{Product}.svelte` — full file, every line
- Read any referenced data from `_archive/ay3/.../data/interactions.ts`
- Read animation CSS from `_archive/ay3/.../young-carpets.css` (search for class names)

### 2. Map color tokens to grayscale
ay3 used warm-tinted tokens. Our site is grayscale only. Mapping:

| ay3 token | rgba value | grayscale equivalent |
|-----------|-----------|---------------------|
| `--yc-shimmer-25` | `rgba(255, 248, 235, 0.25)` | `rgba(255, 255, 255, 0.25)` |
| `--yc-shimmer-35` | `rgba(255, 248, 235, 0.35)` | `rgba(255, 255, 255, 0.22)` |
| `--yc-shimmer-40` | `rgba(255, 248, 235, 0.4)` | `rgba(255, 255, 255, 0.28)` |
| `--yc-shimmer-45` | `rgba(255, 248, 235, 0.45)` | `rgba(255, 255, 255, 0.3)` |
| `--yc-shimmer-50` | `rgba(255, 248, 235, 0.5)` | `rgba(255, 255, 255, 0.35)` |
| `--yc-shimmer-55` | `rgba(255, 248, 235, 0.55)` | `rgba(255, 255, 255, 0.4)` |
| `--yc-griege-06` | `rgba(194, 179, 154, 0.06)` | `rgba(255, 255, 255, 0.04)` |
| `--yc-griege-20` | `rgba(194, 179, 154, 0.2)` | `rgba(255, 255, 255, 0.12)` |
| `--yc-griege-25` | `rgba(194, 179, 154, 0.25)` | `rgba(255, 255, 255, 0.15)` |
| `--yc-griege-35` | `rgba(194, 179, 154, 0.35)` | `rgba(255, 255, 255, 0.2)` |
| `--yc-griege-40` | `rgba(194, 179, 154, 0.4)` | `rgba(255, 255, 255, 0.25)` |
| `--yc-griege-50` | `rgba(194, 179, 154, 0.5)` | `rgba(255, 255, 255, 0.35)` |
| `--yc-griege-55` | `rgba(194, 179, 154, 0.55)` | `rgba(255, 255, 255, 0.35)` |
| `--yc-griege-60` | `rgba(194, 179, 154, 0.6)` | `rgba(255, 255, 255, 0.4)` |
| `--yc-griege-65` | `rgba(194, 179, 154, 0.65)` | `rgba(255, 255, 255, 0.45)` |
| `--yc-griege-85` | `rgba(194, 179, 154, 0.85)` | `rgba(255, 255, 255, 0.6)` |
| `--yc-maple-gold` | `#ffe27a` | `rgba(255, 255, 255, 0.5)` — no gold |
| `--yc-maple-gold-60` | `rgba(255, 226, 122, 0.6)` | `rgba(255, 255, 255, 0.4)` |
| `--yc-text-muted` | (varies) | `var(--color-text-muted)` or `rgba(255, 255, 255, 0.45)` |
| `--yc-ink-45` | dark bg | `rgba(0, 0, 0, 0.3)` |

### 3. Add content data to `product-details.ts`
- Extract lead paragraph from ay3 "What It Is" section
- Condense ay3 lists into 8 spec rows (label: 3-6 chars, value: concise)
- Condense install methods into 3-4 spec rows
- Condense maintenance into 3-4 care rows
- Write warranty/lifecycle footnote
- Set featureLabel and featureHint

### 4. Port interactive feature SVG to `ProductContentModal.svelte`
- Add any state variables to the `<script>` block (gated by `material === '...'`)
- Add SVG markup inside the feature stage conditional: `{:else if material === '...'}`
- Add CSS for animations to the `<style>` block
- **Preserve all SVG geometry exactly**: viewBox, coordinates, dimensions, transform values
- **Preserve all animation values exactly**: durations, easing curves, delays, transition properties
- Only change: color tokens (ay3 → grayscale per mapping above)
- If ay3 used `$effect` for auto-play timing, port the exact delay values

### 5. Verify
- `pnpm check` — 0 errors
- Bump patch version in `package.json`
- `pnpm run deploy`
- Check on phone:
  - New product: all 3 tabs, interactive feature, supplier marquee
  - Carpet Tile: no regressions (tabs, tile morph, marquee)
  - All previously ported products: no regressions
- **STOP. User confirms before next product.**

## Product queue

1. [x] Carpet Tile (prototype, v0.4.67)
2. [ ] LVT (v0.4.68 — deployed, awaiting verification)
3. [ ] Carpet
4. [ ] Ceramic
5. [ ] Rubber
6. [ ] Matting
7. [ ] Wood+
8. [ ] Sheet Vinyl
9. [ ] More... (diverges — no ModalTabs, accordion sub-cards)
10. [ ] Accessories (diverges — simple list)
11. [ ] Installation (diverges — simple list)
