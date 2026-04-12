# Maple Leaf SVG Candidates for YCI

> Research delivered by background agent 2026-04-07. Three viable candidates evaluated; Candidate 1 shipped to production in v1.20.14.

## Requirements
SVG, single-path, `currentColor` fill, license-clean for commercial use, canonical 11-point Canadian flag leaf, must support both solid and outline variants.

## Candidates

### Candidate 1 — Wikimedia `Maple_Leaf.svg` (SHIPPED)

- **Source:** https://commons.wikimedia.org/wiki/File:Maple_Leaf.svg
- **Raw:** https://upload.wikimedia.org/wikipedia/commons/f/fd/Maple_Leaf.svg
- **License:** Public Domain — doubly verified: (a) author-released by Zscout370, (b) flagged ineligible for copyright (geometric construction).
- **Path complexity:** Single `<path>`, ~900-char `d`, no cubic beziers (lines + arcs only). Whole file 606 bytes.
- **viewBox:** `-2015 -2000 4030 4030` — symmetric square, centered on origin.
- **Why this won:** Strongest license, canonical geometry, single path, symmetric viewBox, one source serves both solid and outline variants.

### Candidate 2 — `Flag_of_Canada_(leaf).svg`
Byte-identical `d` data, tighter asymmetric viewBox `-1953 -2031 3906 4061`. Same license. Useful only if a tighter crop is needed.

### Candidate 3 — `Maple_Leaf_(Pantone).svg`
Same path, baked-in `#d52b1e` (official Pantone 485 Canada red). Useful as documentation of "correct Canada red" but irrelevant once we override to `currentColor`.

## Sources rejected
- **Government of Canada FIP** — trademark-controlled, requires departmental coordinator authorization. Not viable for third-party commercial use.
- **SVG Repo** — HTTP 429 on fetch + most results were stylized/botanical leaves, not flag geometry.
- **freesvg.org** — top result baked in "Canada" text and a full flag.
- **publicdomainvectors.org** — HTTP 403, unverified.

## Implementation notes

### Inline SVG (current pattern in `routes/young-carpets/+page.svelte`)
```svg
<svg class="yc-maple-leaf" viewBox="-2015 -2000 4030 4030" aria-hidden="true">
  <path fill="currentColor" d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"/>
</svg>
```

### Static file (alternate use)
`my-portal/static/young-carpets/maple-leaf.svg` — same content, served at `/young-carpets/maple-leaf.svg`. **Caveat:** if loaded via `<img src=...>`, currentColor will NOT inherit. Use inline SVG or a Svelte component if theming matters.

### Outline variant (CSS-only, same path)
```css
.yc-maple-leaf--outline path {
  fill: none;
  stroke: currentColor;
  stroke-width: 80;              /* viewBox units — ~2% of 4030 */
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
```

## Open questions for the user

These do not block the path swap (already shipped) — they're polish decisions:

1. **Solid or outline as the primary?** Currently solid in both hero + footer. Outline could go on the smaller footer instance for visual variety.
2. **Accent color override?** Currently inherits text color (white-ish). Option: force authentic `#d52b1e` Canada red. Option: white with red glow filter (matches "electric accents only" philosophy).
3. **Badge text pairing?** Currently "Proudly Canadian" (hero) and "Canadian Owned & Operated" (footer). Keep as-is or change.
4. **Outline `stroke-width` for crispness** at 18px badge size — not yet tuned because solid is the default.
