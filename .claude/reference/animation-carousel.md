# Animation Pattern — Carousel

> Two tiers: CSS-only (zero JS) and Embla (programmatic control).
> **Companion files:** `animation-navigation.md`, `animation-components.md`

---

## Tier A: CSS-Only (scroll-snap + scroll-driven animations)

```svelte
<div class="carousel-track">
  {#each items as item (item.id)}
    <div class="carousel-slide glass card-interactive">{item.label}</div>
  {/each}
</div>
```

```css
.carousel-track {
  display: flex; overflow-x: auto;
  scroll-snap-type: x mandatory; scroll-behavior: smooth;
  gap: 1rem; padding: 0.5rem;
  scrollbar-width: none; -ms-overflow-style: none;
}
.carousel-track::-webkit-scrollbar { display: none; }

.carousel-slide {
  flex: 0 0 clamp(260px, 30vw, 380px);
  scroll-snap-align: start;
  animation: carousel-dim linear both;
  animation-timeline: scroll(x);
}

@keyframes carousel-dim {
  0%   { opacity: 0.5; transform: scale(0.96); }
  10%  { opacity: 1;   transform: scale(1);    }
  90%  { opacity: 1;   transform: scale(1);    }
  100% { opacity: 0.5; transform: scale(0.96); }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-slide { animation: none; }
}
```

---

## Tier B: Embla Carousel (dots, autoplay, programmatic control)

Install: `npm install embla-carousel`

### EmblaController class

```typescript
// src/lib/animation/EmblaController.ts
import EmblaCarousel, {
  type EmblaCarouselType, type EmblaOptionsType,
} from 'embla-carousel';

export class EmblaController {
  private embla: EmblaCarouselType | null = null;

  constructor(
    private readonly container: HTMLElement,
    private readonly options: EmblaOptionsType = {},
  ) {}

  mount(): void {
    this.embla = EmblaCarousel(this.container, {
      loop: false, dragFree: false, align: 'start', ...this.options,
    });
  }

  destroy(): void { this.embla?.destroy(); this.embla = null; }
  scrollNext(): void { this.embla?.scrollNext(); }
  scrollPrev(): void { this.embla?.scrollPrev(); }
  scrollTo(i: number): void { this.embla?.scrollTo(i); }
  canScrollNext(): boolean { return this.embla?.canScrollNext() ?? false; }
  canScrollPrev(): boolean { return this.embla?.canScrollPrev() ?? false; }
  onSelect(cb: () => void): void { this.embla?.on('select', cb); }
  selectedIndex(): number { return this.embla?.selectedScrollSnap() ?? 0; }
}
```

### Svelte 5 component

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { EmblaController } from '$lib/animation/EmblaController';

  let { items } = $props<{ items: { id: string; label: string }[] }>();
  let viewport: HTMLElement;
  let controller: EmblaController;
  let selectedIndex = $state(0);

  onMount(() => {
    controller = new EmblaController(viewport, { loop: false });
    controller.mount();
    controller.onSelect(() => { selectedIndex = controller.selectedIndex(); });
    return () => controller.destroy();
  });
</script>

<div class="relative">
  <div bind:this={viewport} class="overflow-hidden">
    <div class="flex gap-4">
      {#each items as item (item.id)}
        <div class="flex-none w-72 glass card-interactive">{item.label}</div>
      {/each}
    </div>
  </div>
  <div class="flex gap-2 mt-4 justify-center">
    <button class="btn-secondary" onclick={() => controller.scrollPrev()}>&#8249;</button>
    {#each items as _, i}
      <button
        class="w-2 h-2 rounded-full transition-colors"
        class:bg-cyan-400={i === selectedIndex}
        class:bg-zinc-600={i !== selectedIndex}
        onclick={() => controller.scrollTo(i)}
      ></button>
    {/each}
    <button class="btn-secondary" onclick={() => controller.scrollNext()}>&#8250;</button>
  </div>
</div>
```

---

## Sources
- [Embla Carousel for Svelte](https://www.embla-carousel.com/get-started/svelte/)
- [Svelte Motion library](https://motion.svelte.page/)
