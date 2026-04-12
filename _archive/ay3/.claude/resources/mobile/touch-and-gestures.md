# Touch and Gestures — Mobile Reference

## 2026-04-07 — Phase 1 (initial population by Mobile agent)

> Cross-refs: `pinch-zoom-handling.md`, `safari-quirks.md`, `mobile-performance.md`
> Anchor bugs: **v1.23.8** (sticky `:hover` on iOS Safari + heavy 3D layer pressure during pinch), **v1.23.3** (CSS `@keyframes` on `<g>` invisible on iOS).

This file is the bedrock for everything else in `resources/mobile/`. Pinch-zoom, viewport, and performance are all downstream of "what does a touch event actually do, and where does the browser get confused?". Read this first.

---

## 1. Touch Events vs Pointer Events vs Mouse Events

Three event families coexist on every mobile browser. They fire in a *specific* order, and most "the click handler fires twice" bugs come from not knowing the order.

### The event cascade for a single tap on mobile WebKit

```
touchstart        → fires immediately on finger down
touchmove*        → fires only if the finger moves
touchend          → fires on finger lift
mouseover         → synthetic, fires once
mousemove         → synthetic, fires once
mousedown         → synthetic
mouseup           → synthetic
click             → synthetic, fires last
```

The synthetic mouse events exist for **legacy compatibility** with sites written before touch existed. iOS and Android both fire them. If you `preventDefault()` inside `touchstart` or `touchend`, you suppress the entire synthetic mouse cascade including `click`. This is occasionally what you want (custom gesture handlers) and almost never what you actually meant (you just wanted to stop scrolling).

**Pointer Events** (`pointerdown`, `pointermove`, `pointerup`) unify mouse + touch + pen into a single API. They are now safe to use everywhere — Safari shipped support in iOS 13. **Prefer pointer events for new code** unless you specifically need multi-touch tracking, in which case `TouchList` from touch events is still the only way to enumerate active fingers.

### Rule of thumb

| You want… | Use this |
|---|---|
| Single-finger interaction (drag, swipe, tap) | Pointer events |
| Multi-finger gestures (pinch, rotate) | Touch events (need `e.touches[]`) |
| Drawing / stylus pressure | Pointer events (`pressure`, `tiltX`, `tiltY`) |
| Hover states | **CSS `:hover` gated behind `@media (hover: hover)`** — never JS |

---

## 2. The 300ms Tap Delay (history + why it still matters in 2026)

Originally, mobile Safari (iOS 1.0) waited **300ms after every tap** to see if the user was double-tapping. Double-tap = browser zoom in. Single tap = click. The browser couldn't decide which until 300ms had passed with no second tap.

This made every mobile web app feel sluggish. Around 2014–2016 a wave of fixes landed:

1. **`<meta name="viewport" content="width=device-width">`** — Chrome decided in 2014 that any page declaring a mobile viewport opted out of double-tap zoom on the body, so the 300ms delay went away.
2. **`touch-action: manipulation`** — CSS-level opt-out of double-tap zoom on a specific element. Works on iOS Safari and all Chromium browsers.
3. **FastClick.js** (deprecated) — JS shim that replaced `click` with a synthesized one fired from `touchend`. **Do not use it in 2026** — it interferes with native form input focus on iOS and is no longer needed.

**Current state (mobile Safari, 2026):** the 300ms delay is gone on any element inside a page with a mobile viewport meta tag, and gone on any element with `touch-action: manipulation`. If you still feel a delay, it's almost always:

- A `pointerdown`/`mousedown` handler doing layout work synchronously
- A click handler that calls `confirm()` or any blocking dialog
- A backdrop-filter element that needs to recompose the layer stack on press

**The fix is rarely "remove tap delay" anymore. It's "stop doing expensive work in the click handler".**

---

## 3. Sticky `:hover` After Tap — The Underlying Cause of v1.23.8

This is THE single most impactful mobile gotcha in the YCI codebase. **It birthed this entire agent.**

### The bug

When you tap an element on iOS Safari, the browser fires the synthetic `mouseover` event, which causes any matching `:hover` CSS rules to apply. **The hover state then sticks** — it does not clear when your finger lifts. It clears only when:

- You tap somewhere else on the page (and that something-else gets the new hover state)
- You scroll
- The page navigates

This means a `:hover { transform: translateY(-10px) scale(1.018); }` on a card will visibly leave the card "lifted" after you tap it, until you tap somewhere else. **Worse**, if the hover style triggers a new compositing layer (any 3D transform, `will-change: transform`, `backdrop-filter` change), that layer is now allocated and stays allocated.

### v1.23.8 — what actually broke

Nine product cards on the YCI homepage. Each card had:

```css
.yc-product-card {
  perspective: 1200px;
  transform-style: preserve-3d;
  isolation: isolate;
  backdrop-filter: blur(14px) saturate(180%);
}
.yc-product-card:hover {
  transform: translateY(-10px) scale(1.018) rotateX(2deg);
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.4);
}
```

User reports: "if I pinch-zoom the products section the page goes white and Safari reloads the tab."

**Cause:** during pinch-zoom, mobile Safari rasterizes the visible area at the new scale. Each `backdrop-filter` element is its own compositing layer. Each `perspective` ancestor is its own 3D rendering context. Each `:hover`-applied transform creates a *new* compositing layer (because the transform promotes it). With 9 cards × {backdrop-filter layer + 3D context + sticky-hover transform layer} the GPU layer budget on the iPhone's WebKit compositor was exceeded mid-pinch and the tab crashed.

### The fix (canonical pattern — memorize this)

```css
.yc-product-card {
  touch-action: manipulation;
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
}

@media (hover: hover) and (pointer: fine) {
  .yc-product-card {
    perspective: 1200px;
    transform-style: preserve-3d;
    isolation: isolate;
    backdrop-filter: blur(14px) saturate(180%);
  }
  .yc-product-card:hover {
    transform: translateY(-10px) scale(1.018) rotateX(2deg);
  }
}

@media (hover: none) {
  .yc-product-card {
    perspective: none;
    transform-style: flat;
  }
}
```

The key insight: **`@media (hover: hover)` is the gate. Never put a `:hover` rule outside that gate on a touch-capable surface.** The combined `(hover: hover) and (pointer: fine)` is even safer — it excludes touchscreens that *report* hover capability (some Android stylus devices).

MDN refs:
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer

---

## 4. `touch-action` Values — When To Use Each

`touch-action` tells the browser **which gestures it should handle natively** vs which it should send to your event listeners. Once a touch is "claimed" by the browser (e.g., for native scroll), your event listeners stop firing for that gesture.

| Value | What the browser handles | When to use |
|---|---|---|
| `auto` (default) | All native gestures | Default. |
| `none` | Nothing — every touch goes to your JS | Custom drawing canvas, custom map. **Disables scroll**. |
| `manipulation` | Pan + pinch-zoom only. Disables double-tap-zoom. | Buttons, cards, links. **Use liberally.** |
| `pan-x` | Horizontal scroll only | Horizontal carousel inside vertical-scrolling page |
| `pan-y` | Vertical scroll only | Vertical lists where horizontal swipe means delete |
| `pinch-zoom` | Pinch-zoom only, no scroll | Image zoom viewer |

**Safe default for any tappable card / button / link in 2026:** `touch-action: manipulation`. It costs nothing, removes the double-tap-zoom ambiguity, and is the difference between "pinch breaks" and "pinch works" in many cases.

---

## 5. Double-Tap Zoom — The Quiet Saboteur

Double-tap zoom is the iOS gesture where two quick taps zoom in on the tapped element. Useful for image-heavy pages, **actively harmful** for app-like UIs where the user is double-tapping a button to confirm.

It is **enabled by default** on every element unless:
- The element has `touch-action: manipulation` (or stricter)
- An ancestor has `touch-action: manipulation`
- The page has `<meta name="viewport" content="..., user-scalable=no">` (do NOT do this — accessibility violation, see §7)

**Symptom that you're being bitten by double-tap-zoom:** the second tap "doesn't fire", or the page suddenly zooms in when the user double-clicks a button. **Fix:** add `touch-action: manipulation`.

---

## 6. Gesture Conflicts — Scroll vs Swipe vs Pinch

This is where most "weird touch bugs" live. The browser is constantly trying to decide: is this finger movement a scroll, a swipe, a pinch, a drag, or a tap-and-hold?

### How the browser decides

1. On `touchstart`, the browser doesn't know yet. It dispatches the event to JS but holds the gesture in limbo.
2. On the first `touchmove`, the browser checks `touch-action` and event listener `preventDefault()` calls:
   - If `touch-action: auto` AND nobody called `preventDefault()` on `touchstart` or the first `touchmove` → browser claims the gesture as a scroll
   - If `touch-action: none` → browser does nothing, JS owns it
   - If `touch-action: pan-y` and the movement is mostly horizontal → browser does nothing, JS can use it
3. Once claimed, the browser stops firing subsequent `touchmove` events to your listener (or fires them as `passive`).

### The scroll-vs-swipe trap

If you build a horizontal swipe handler on a vertically-scrollable page:

1. Set `touch-action: pan-y` on the swipeable element
2. In your `touchmove` listener, decide *quickly* (1–2 events) whether the gesture is horizontal or vertical
3. If horizontal, `preventDefault()` further events
4. If vertical, do nothing — let the browser scroll

**Get the order wrong** and you either lock the page from scrolling, OR fail to swipe because the browser already claimed the gesture as a scroll.

---

## 7. Never disable user-zoom (`user-scalable=no`)

```html
<!-- DO NOT DO THIS -->
<meta name="viewport" content="width=device-width, user-scalable=no, maximum-scale=1">
```

This is an **accessibility violation** under WCAG 2.1 SC 1.4.4 (Resize Text). Users with low vision rely on pinch-zoom to read text. **iOS Safari ignores `user-scalable=no` by default** in modern versions specifically because so many sites broke accessibility this way. Don't waste a meta tag on it.

If you have a "pinch-zoom breaks my page" problem, the answer is **never** to disable zoom. The answer is to fix the page (see `pinch-zoom-handling.md`).

---

## 8. `passive: true` Event Listeners

Touch event listeners default to **non-passive** in legacy code, meaning the browser must wait for the listener to return before deciding whether to scroll. This adds latency.

Modern browsers default `touchstart`/`touchmove` listeners on `window`/`document`/`body` to **passive** (Chrome 56+, Safari 11.1+). For listeners attached to other elements, opt in:

```js
element.addEventListener('touchstart', handler, { passive: true });
```

**Use `passive: true` for any listener that doesn't need `preventDefault()`** — this lets the browser scroll without waiting for your JS, keeping the page silky.

**Use `passive: false` only when you genuinely need to block scroll**, e.g., a custom drag handler. Combine with `touch-action` so the browser knows your intent before the first event fires.

---

## 9. Visual Viewport API — Tracking Pinch-Zoom From JS

The Visual Viewport API (`window.visualViewport`) lets you observe the user's current zoom level, scroll offset within the zoom, and the visible region.

```js
window.visualViewport.addEventListener('resize', () => {
  console.log('scale:', window.visualViewport.scale);
  console.log('offsetTop:', window.visualViewport.offsetTop);
  console.log('height:', window.visualViewport.height);
});
```

**Important:** the Visual Viewport API does **not** report the layout viewport. Layout viewport = the page as the browser laid it out (CSS pixels at zoom 1). Visual viewport = the rectangle the user is currently looking at. During a pinch, layout stays still and visual changes. See `viewport-and-safe-area.md` for the full split.

MDN: https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API

---

## 10. Edge Swipe Interactions on Android

Android adds gestures the iOS user never sees:

- **Edge swipe from left** = Back navigation (gesture nav)
- **Edge swipe from right** = Also Back
- **Edge swipe from bottom** = Home / multitasking
- **Pull-to-refresh from top** = Reloads the page

The first three are owned by the OS — you cannot intercept them. The fourth is browser-owned and you **can** disable it:

```css
html, body {
  overscroll-behavior-y: contain;
}
```

See `chromium-quirks.md` for the full overscroll story.

---

## 11. Sticky `:active` (Android's milder cousin to iOS sticky-hover)

Android Chromium has a milder version of the bug: `:active` can persist for a frame or two after touch end, causing button-press visuals to flash. The fix:

```css
@media (hover: none) {
  .button:active { transition: background-color 80ms ease-out; }
}
```

---

## 12. Tap highlight (the gray flash)

iOS Safari shows a translucent gray rectangle on every tapped element. Useful default — tells the user the tap registered — but looks bad on custom-styled rounded elements.

```css
* { -webkit-tap-highlight-color: transparent; }
```

**Trade-off:** if you remove the tap highlight you MUST provide your own visible feedback (a `:active` style that fires within 100ms), or the app will feel unresponsive.

---

## 13. SVG animation (the v1.23.3 lesson)

Not strictly a touch issue, but it lives at the same intersection of "iOS gets confused":

CSS `@keyframes` targeting an SVG `<g>` element with `transform: translateX(...)` does **not animate reliably on iOS Safari**. The element renders at its initial state and never moves. Same animation on `<rect>`, `<circle>`, `<path>` directly **does** work.

**Workaround:** use SMIL `<animate>` directly on the primitive's attribute (`cx`, `cy`, `x`, `y`, `opacity`, `r`).

```svg
<!-- Works on iOS: -->
<ellipse cx="100" cy="50" rx="30" ry="10">
  <animate attributeName="cx" from="100" to="500" dur="3s" repeatCount="indefinite"/>
</ellipse>

<!-- Does NOT work on iOS: -->
<g style="animation: walk 3s infinite linear;">
  <ellipse cx="100" cy="50" rx="30" ry="10"/>
</g>
```

WebKit Bugzilla: https://bugs.webkit.org/show_bug.cgi?id=166842

---

## Summary card

| Rule | Why |
|---|---|
| Gate `:hover` behind `@media (hover: hover) and (pointer: fine)` | iOS sticky-hover (v1.23.8) |
| Add `touch-action: manipulation` to every tap target | Kills double-tap-zoom ambiguity |
| Use Pointer Events for new code | Unified mouse/touch/pen API |
| Use `{ passive: true }` for touch listeners | Lets the browser scroll without waiting on JS |
| Use SMIL `<animate>` not CSS `@keyframes` on SVG `<g>` | iOS Safari bug (v1.23.3) |
| Use `overscroll-behavior: contain` to kill Android pull-to-refresh | Prevents accidental reloads |
| Never remove `tap-highlight-color` without replacing the feedback | App will feel broken |
| Drop `perspective` + `transform-style: preserve-3d` on touch devices | GPU layer pressure (v1.23.8) |
| Never set `user-scalable=no` | WCAG 1.4.4 violation |
