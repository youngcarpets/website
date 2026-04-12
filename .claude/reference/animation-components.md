# Animation Patterns — Components (Cards, Buttons, Glow)

> Card pop, button micro-interactions, glow effects. All token-driven, GPU-safe.
> **Companion files:** `animation-navigation.md`, `animation-carousel.md`

---

## Card Pop (Entrance + Hover)

Cards enter with spring scale-up. Hover adds lift + glow. Press snaps down instantly.

### CSS
```css
.card-interactive {
  transition:
    transform    var(--motion-fast) var(--ease-spring),
    box-shadow   var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
  cursor: pointer;
}
.card-interactive:hover {
  transform:   translateY(-4px) scale(var(--scale-hover));
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 0 0 1px var(--color-glass-border),
    0 0 20px var(--color-cyan-glow);
  border-color: rgba(6, 182, 212, 0.35);
}
.card-interactive:active {
  transform:  scale(var(--scale-press));
  transition: transform var(--motion-instant) var(--ease-accelerate);
}
```

### Svelte 5 entrance action
```typescript
// src/lib/actions/popIn.ts
import { MotionController } from '$lib/animation/MotionController';

export function popIn(node: HTMLElement, delay = 0) {
  MotionController.popIn(node, delay);
  return {};
}
```

### Staggered card grid
```svelte
<div class="grid grid-cols-3 gap-6" use:staggerGrid>
  {#each cards as card}
    <div class="glass card-interactive" data-card>{card.title}</div>
  {/each}
</div>
```

---

## Buttons (Micro-interactions)

- **Hover:** 160ms, spring easing, translateY(-1px) + glow
- **Press:** 80ms, accelerate easing, scale(0.97) — instant feedback
- **Focus-visible:** cyan ring, never hidden (accessibility)
- **Loading state:** spinner replaces icon, button dims to 70% opacity

### CSS
```css
.btn-primary, .btn-secondary, .btn-danger {
  transform: translateZ(0);
  transition:
    transform    var(--motion-fast)    var(--ease-spring),
    box-shadow   var(--motion-fast)    var(--ease-standard),
    background   var(--motion-base)    var(--ease-standard),
    opacity      var(--motion-fast)    var(--ease-standard);
}
.btn-primary:active, .btn-secondary:active, .btn-danger:active {
  transform:  scale(var(--scale-press)) translateZ(0);
  transition: transform var(--motion-instant) var(--ease-accelerate);
}
.btn-primary:focus-visible, .btn-secondary:focus-visible {
  outline: 2px solid var(--color-cyan-accent);
  outline-offset: 2px;
}

/* Loading state */
.btn-loading { opacity: 0.7; pointer-events: none; position: relative; }
.btn-loading::after {
  content: ''; position: absolute; inset: 0; margin: auto;
  width: 16px; height: 16px;
  border: 2px solid transparent; border-top-color: currentColor;
  border-radius: 50%; animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### ButtonFeedback action
```typescript
// src/lib/actions/buttonFeedback.ts
export function buttonFeedback(node: HTMLElement) {
  const onDown = () => { node.style.willChange = 'transform'; };
  const onUp = () => { setTimeout(() => { node.style.willChange = 'auto'; }, 300); };
  node.addEventListener('pointerdown', onDown);
  node.addEventListener('pointerup', onUp);
  node.addEventListener('pointerleave', onUp);
  return {
    destroy() {
      node.removeEventListener('pointerdown', onDown);
      node.removeEventListener('pointerup', onUp);
      node.removeEventListener('pointerleave', onUp);
    },
  };
}
```

---

## Glow Effects

```css
.glow-cyan    { box-shadow: 0 0 20px var(--color-cyan-glow), 0 0 60px rgba(6, 182, 212, 0.08); }
.glow-cyan-sm { box-shadow: 0 0 10px var(--color-cyan-glow); }
.glow-danger  { box-shadow: 0 0 16px rgba(239, 68, 68, 0.30); }
```

Use `glow-cyan` on: active nav links, selected carousel slides, primary CTA buttons on hover.
Use `glow-danger` on: delete confirmations, error states.

---

## Consistency Checklist

Before shipping any new component, verify:
- Uses only `--motion-*` duration tokens (no hard-coded `300ms`)
- Uses only `--ease-*` easing tokens
- Animates only `transform`, `opacity`, or `filter`
- Has `@media (prefers-reduced-motion)` coverage
- `will-change` applied only during active animations, removed after
- Hover and focus-visible states both defined
- Active/press state gives instant (<100ms) feedback
- Employee portal variant strips spring + stagger (see `13c-motion-utilities.md`)

---

## File Structure

```
src/lib/
├── animation/
│   ├── MotionController.ts      <- Core WA-API wrapper
│   ├── StaggerManager.ts        <- IntersectionObserver stagger
│   ├── NavigationTransition.ts  <- View Transitions API
│   └── EmblaController.ts       <- Embla carousel OOP wrapper
└── actions/
    ├── popIn.ts                 <- Svelte action: spring entrance
    ├── stagger.svelte.ts        <- Svelte action: stagger children
    └── buttonFeedback.ts        <- Svelte action: will-change lifecycle
```
