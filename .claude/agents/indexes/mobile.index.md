# Mobile Agent — Index

> **Agent**: `.claude/agents/mobile.md`
> **Resource directory**: `.claude/resources/mobile/`
> **Created**: 2026-04-07 after the v1.23.8 pinch-zoom + v1.23.3 SMIL-fix bugs showed the parent thread keeps tripping over phone-specific behaviour

## Quick Reference

| Topic | File | Status |
|---|---|---|
| Touch + gesture handling (touch vs pointer events, sticky hover, tap delay, gesture conflicts) | `resources/mobile/touch-and-gestures.md` | Phase 1 — initial population |
| Pinch-zoom defense patterns (the v1.23.8 fix, plus general defensive CSS) | `resources/mobile/pinch-zoom-handling.md` | Phase 1 |
| iOS Safari + WebKit running list of quirks + workarounds | `resources/mobile/safari-quirks.md` | Phase 1 |
| Android Chromium + Samsung Internet quirks for cross-mobile cases | `resources/mobile/chromium-quirks.md` | Phase 1 |
| Viewport + safe area (dvh/svh/lvh, visual viewport API, env(safe-area-inset-*)) | `resources/mobile/viewport-and-safe-area.md` | Phase 1 |
| Mobile performance (compositing layer budgets, backdrop-filter limits, ProMotion frame budget) | `resources/mobile/mobile-performance.md` | Phase 1 |
| User's primary device — iPhone 16 Pro Max specifics | `resources/mobile/user-device-iphone-16-pro-max.md` | Phase 1 |
| iOS 26 features that affect web dev | `resources/mobile/ios-26-features.md` | Future |
| PWA / Add to Home Screen behaviour | `resources/mobile/pwa-and-home-screen.md` | Future |
| Mobile form inputs (date pickers, keyboard handling) | `resources/mobile/form-inputs.md` | Future |

## The user's primary device

**iPhone 16 Pro Max running iOS 26.4** as of 2026-04-07.

- 6.9" display, 2868×1320, 460 ppi
- ProMotion 120 Hz adaptive refresh, Always-On display
- Apple A18 Pro, 8 GB RAM
- Dynamic Island + Action Button
- Browser: Mobile Safari (no third-party browser engines on iOS — Chrome, Firefox, Edge are all WebKit shells on this device)
- The user previews dev server via Cloudflare Quick Tunnel from `cloudflared.exe`

When in doubt about which device behaviour to optimize for, **assume this device first**.

## The "gate behind hover/none" pattern

The single biggest defensive pattern this agent enforces:

**Any styles that depend on hover state must be gated behind `@media (hover: hover)`.** iOS Safari fires `:hover` styles on tap (sticky hover) and doesn't always clear them, which causes hover transforms to persist visually and to interfere with pinch-zoom. The v1.23.8 fix is the canonical example:

```css
/* desktop hover styles — only fire on devices with a real hover capability */
@media (hover: hover) {
  .yc-product-card:hover {
    transform: translateY(-10px) scale(1.018) ...;
    box-shadow: ...heavy stack...;
  }
}

/* mobile defenses — only fire on touch-primary devices */
.yc-product-card { touch-action: manipulation; }

@media (hover: none) {
  .yc-product-card {
    perspective: none;
    transform-style: flat;
    backdrop-filter: blur(8px) saturate(150%);  /* dial down from 14px */
    -webkit-backdrop-filter: blur(8px) saturate(150%);
  }
}
```

The pattern: **never break the desktop visual to fix the mobile bug.** Defensive CSS goes behind a media query.

## Known mobile gotchas (will be expanded in `safari-quirks.md` once Phase 1 lands)

1. **CSS @keyframes on SVG `<g>` elements doesn't reliably animate on iOS Safari.** Use SMIL `<animate>` on the underlying primitive's attributes (cx, cy, x, y, opacity) instead. (v1.23.3)

2. **Sticky `:hover` after tap on iOS.** The hover state persists after touch end and doesn't clear until the user taps somewhere else. Gate hover styles behind `@media (hover: hover)`.

3. **`backdrop-filter` has a hard compositing layer budget on iOS Safari.** Multiple elements with heavy backdrop-filter (blur >12px, multiple filter functions) can crash the compositor mid-pinch-zoom. Dial down on touch devices.

4. **`perspective` + `transform-style: preserve-3d` adds GPU layer pressure** even when no 3D transform is active. Drop them on touch devices unless the 3D effect is essential.

5. **`touch-action: manipulation`** disables iOS double-tap-zoom on the element, removing gesture ambiguity that can leave the page in a broken state during pinch.

6. **`100vh` ≠ visible height on mobile.** The URL bar collapse changes the actual visible area. Use `100dvh` (dynamic) for "always full visible", `100svh` (small) for "smallest possible", `100lvh` (large) for "largest possible".

7. **`position: fixed` jumps during pinch-zoom.** Long-standing WebKit issue. Fixed elements reposition relative to the visual viewport during the gesture. Usually accept the jump rather than fight it.

8. **No third-party browser engines on iOS.** Chrome, Firefox, Edge on iPhone are all WebKit shells. If a bug only repros on iOS, it's a WebKit bug regardless of which "browser" the user opens.

9. **Safe area insets.** The Dynamic Island, notch, home indicator, and status bar all crop content if not handled. Use `env(safe-area-inset-top|right|bottom|left)` and `viewport-fit=cover` in the meta tag.

## Cross-references

- `agents/design.md` — visual layer / Apple Liquid Glass aesthetic (Design owns "what it looks like", Mobile owns "how the device handles it")
- `agents/charts.md` — SVG geometry; many SVG-on-mobile bugs are jointly Mobile + Charts (the SMIL fix is both)
- `agents/performance.md` — bundle + render perf; Mobile provides the mobile-specific constraints
- `agents/troubleshoot.md` — env / network debugging; Mobile handles the device-side specifically
- `resources/mobile/pinch-zoom-handling.md` — the canonical v1.23.8 reference

## Planned future resource files

The user has explicitly said *"i don't mind if some agents are almost never used. we can deal with cleaning that up if everything gets too big."* — file count is not a concern. When a new mobile hurdle appears, create a new file.

Candidate future files (beyond Phase 1):
- `ios-26-features.md` — what's new in iOS 26 that affects web dev
- `android-15-features.md` — symmetric Android coverage
- `pwa-and-home-screen.md` — Add to Home Screen, splash, manifest
- `form-inputs.md` — date pickers, keyboard handling, autofill quirks
- `device-orientation.md` — portrait/landscape, orientation lock, the existing tilt-parallax interaction
- `haptic-and-vibration.md` — the haptic feedback API differences between iOS and Android
- `network-quality-api.md` — `navigator.connection`, mobile-data-aware loading
- `print-styles-on-mobile.md` — yes, mobile users print sometimes
