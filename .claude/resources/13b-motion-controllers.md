# Motion Controllers — TypeScript Classes

> OOP-first, portable, framework-agnostic. Svelte wrappers sit on top.
> **Companion files:** `13a-motion-tokens.md` (CSS tokens), `13c-motion-utilities.md` (CSS utils)

---

## MotionController

Wraps the Web Animations API with sane defaults. Reads CSS custom properties for tokens.

```typescript
// src/lib/animation/MotionController.ts

export interface MotionConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: FillMode;
}

export interface TransitionConfig extends MotionConfig {
  from: Partial<CSSStyleDeclaration>;
  to:   Partial<CSSStyleDeclaration>;
}

type FillMode = 'none' | 'forwards' | 'backwards' | 'both';

export class MotionController {
  private static readonly TOKENS = {
    durationFast:  '--motion-fast',
    durationBase:  '--motion-base',
    durationslow:  '--motion-slow',
    easeStandard:  '--ease-standard',
    easeDecelerate:'--ease-decelerate',
    easeAccelerate:'--ease-accelerate',
    easeSpring:    '--ease-spring',
  } as const;

  static readToken(token: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(token).trim();
  }

  static getDuration(token: string = '--motion-base'): number {
    return parseFloat(MotionController.readToken(token)) || 300;
  }

  static getEasing(token: string = '--ease-standard'): string {
    return MotionController.readToken(token) || 'cubic-bezier(0.4,0,0.2,1)';
  }

  static animate(el: HTMLElement, config: TransitionConfig): Animation {
    const duration = config.duration ?? MotionController.getDuration();
    const easing   = config.easing   ?? MotionController.getEasing();
    const delay    = config.delay    ?? 0;
    return el.animate(
      [config.from as Keyframe, config.to as Keyframe],
      { duration, easing, delay, fill: config.fill ?? 'forwards' }
    );
  }

  static enterFromBelow(el: HTMLElement, delay = 0): Animation {
    return MotionController.animate(el, {
      from: { opacity: '0', transform: 'translateY(12px)' },
      to:   { opacity: '1', transform: 'translateY(0)' },
      duration: MotionController.getDuration('--motion-enter'),
      easing:   MotionController.getEasing('--ease-decelerate'),
      delay,
    });
  }

  static popIn(el: HTMLElement, delay = 0): Animation {
    return MotionController.animate(el, {
      from: { opacity: '0', transform: 'scale(0.94)' },
      to:   { opacity: '1', transform: 'scale(1)' },
      duration: MotionController.getDuration('--motion-base'),
      easing:   MotionController.getEasing('--ease-spring'),
      delay,
    });
  }

  static popOut(el: HTMLElement): Animation {
    return MotionController.animate(el, {
      from: { opacity: '1', transform: 'scale(1)' },
      to:   { opacity: '0', transform: 'scale(0.96)' },
      duration: MotionController.getDuration('--motion-exit'),
      easing:   MotionController.getEasing('--ease-accelerate'),
    });
  }

  static stagger(
    elements: HTMLElement[],
    factory: (el: HTMLElement, delay: number) => Animation,
    stepMs = 60,
  ): Animation[] {
    return elements.map((el, i) => factory(el, i * stepMs));
  }
}
```

---

## StaggerManager

IntersectionObserver-based stagger for lists/grids. Observes when a container enters viewport, then staggers children.

```typescript
// src/lib/animation/StaggerManager.ts

import { MotionController, type MotionConfig } from './MotionController';

export class StaggerManager {
  private observer: IntersectionObserver;
  private animated = new WeakSet<Element>();

  constructor(
    private readonly childSelector: string = '[data-animate]',
    private readonly config: MotionConfig & { stepMs?: number } = {},
  ) {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.1 },
    );
  }

  observe(container: HTMLElement): void { this.observer.observe(container); }
  unobserve(container: HTMLElement): void { this.observer.unobserve(container); }
  destroy(): void { this.observer.disconnect(); }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (!entry.isIntersecting || this.animated.has(entry.target)) continue;
      this.animated.add(entry.target);
      const children = Array.from(
        entry.target.querySelectorAll<HTMLElement>(this.childSelector),
      );
      MotionController.stagger(
        children,
        (el, delay) => MotionController.enterFromBelow(el, delay),
        this.config.stepMs ?? 60,
      );
    }
  }
}
```

**Svelte 5 usage (action):**
```svelte
<ul use:stagger>
  {#each items as item}
    <li data-animate>{item.name}</li>
  {/each}
</ul>
```
