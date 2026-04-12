# Animation Pattern — Page & Nav Transitions

> View Transitions API + SvelteKit onNavigate. Progressive enhancement — falls back gracefully.
> **Companion files:** `animation-components.md`, `animation-carousel.md`

---

## NavigationTransition Class

```typescript
// src/lib/animation/NavigationTransition.ts

export class NavigationTransition {
  static readonly isSupported =
    typeof document !== 'undefined' &&
    'startViewTransition' in document;

  static async startTransition(updateDOM: () => void | Promise<void>): Promise<void> {
    if (!NavigationTransition.isSupported) {
      await updateDOM();
      return;
    }
    const transition = (document as Document & {
      startViewTransition: (cb: () => void | Promise<void>) => {
        ready: Promise<void>;
        finished: Promise<void>;
        updateCallbackDone: Promise<void>;
      };
    }).startViewTransition(updateDOM);
    await transition.ready;
  }
}
```

## +layout.svelte Integration (Svelte 5)

```svelte
<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { NavigationTransition } from '$lib/animation/NavigationTransition';

  onNavigate((navigation) => {
    if (!NavigationTransition.isSupported) return;
    return new Promise((resolve) => {
      NavigationTransition.startTransition(resolve);
    });
  });
</script>

<slot />
```

## CSS — Cross-Fade + Slide

```css
/* app.css */
::view-transition-old(root) {
  animation: vt-slide-out var(--motion-exit) var(--ease-accelerate) both;
}
::view-transition-new(root) {
  animation: vt-slide-in var(--motion-enter) var(--ease-decelerate) both;
}

/* Navbar stays fixed */
.glass-navbar { view-transition-name: navbar; }
::view-transition-old(navbar),
::view-transition-new(navbar) { animation: none; }

@keyframes vt-slide-out {
  to { opacity: 0; transform: translateY(-6px); }
}
@keyframes vt-slide-in {
  from { opacity: 0; transform: translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: fade-in var(--motion-fast) linear both;
  }
}
```

---

## Sources
- [SvelteKit View Transitions](https://svelte.dev/blog/view-transitions)
