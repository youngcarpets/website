# Motion Token System & GPU Rules

> Foundation layer: CSS custom properties for timing, easing, and scale. Framework-agnostic.
> **Companion files:** `13b-motion-controllers.md` (TS classes), `13c-motion-utilities.md` (CSS utils)

---

## 1. Motion Tokens

All timing, easing, and scale values live as CSS custom properties in `app.css`. Never hard-code values in components — always reference a token.

```css
/* app.css — add inside @theme block */

/* Duration tokens */
--motion-instant:  80ms;
--motion-fast:     160ms;
--motion-base:     300ms;
--motion-slow:     500ms;
--motion-enter:    360ms;
--motion-exit:     200ms;

/* Easing tokens */
--ease-standard:   cubic-bezier(0.4, 0.0, 0.2, 1);   /* Material standard */
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);   /* Elements entering */
--ease-accelerate: cubic-bezier(0.4, 0.0, 1.0, 1);   /* Elements exiting  */
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot/pop     */
--ease-bounce:     cubic-bezier(0.68, -0.55, 0.27, 1.55);

/* Scale tokens (card pop, button press) */
--scale-press:  0.97;
--scale-hover:  1.02;
--scale-pop:    1.04;

/* Blur tokens (glass transitions) */
--blur-glass:   20px;
--blur-nav:     24px;
```

### Reduced-motion override
Always wrap motion in a global guard — one place, zero duplication:

```css
/* app.css — append after @theme */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:   0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration:  0.01ms !important;
  }
}
```

---

## 2. GPU-Safe Property Rules

Animate **only** these properties to avoid layout/paint recalculation:

| Property     | GPU Composited | Use for                        |
|--------------|:--------------:|-------------------------------|
| `transform`  | yes            | position, scale, rotate        |
| `opacity`    | yes            | fade in/out                    |
| `filter`     | yes (partial)  | blur, brightness on GPU layer  |
| `clip-path`  | yes (Chrome 90+)| reveal wipes                  |
| `background` | no             | use `opacity` overlay instead  |
| `width/height` | no           | use `transform: scale()` instead|
| `top/left`   | no             | use `transform: translate()` instead|

**will-change — use sparingly:**
```css
/* Only on elements with imminent animation. Remove after animation via JS. */
.will-animate { will-change: transform, opacity; }
```

---

## Sources & References
- [Motion Design Tokens — ruixen.com](https://www.ruixen.com/blog/motion-design-tokens)
- [Keyframes Tokens — Smashing Magazine](https://www.smashingmagazine.com/2025/11/keyframes-tokens-standardizing-animation-across-projects/)
- [GPU Acceleration — TestMu](https://www.testmu.ai/blog/css-gpu-acceleration/)
