# Apple Effects & Motion Reference

## Liquid Glass CSS

> Full glass implementation (three-layer structure, performance rules, reduced-transparency) is in `resources/03-apple-liquid-glass-design.md`. This file covers material thickness levels and supplementary effects only.

### Material Thickness Levels

| Material | Blur | Opacity | Use |
|---|---|---|---|
| Ultra Thin | ~5px | High translucency | Subtle backgrounds |
| Thin | ~10px | Moderate | Tab bars, toolbars |
| Regular | ~20px | Standard | Default surfaces |
| Thick | ~30px | Less translucent | Nav bars, prominent UI |
| Chrome | ~40px | Very opaque | Maximum contrast |

## Shadows

```css
/* Subtle — cards, list items */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Medium — dropdowns, popovers */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.10);

/* Prominent — modals, floating panels */
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
```

Note: Apple's `shadowRadius` = CSS blur / 2. No spread support on native platforms.

## Animation & Motion

### Durations

| Token | Duration | Use |
|---|---|---|
| fast | 150ms | Micro-interactions, toggles |
| normal | 300ms | Standard transitions |
| slow | 500ms | Page transitions, dramatic reveals |

### CSS Easing Curves

```css
/* Standard ease-out (Apple default for exits) */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Ease-in (slow entry) */
transition-timing-function: cubic-bezier(0.42, 0, 1, 1);

/* Ease-in-out (Apple standard) */
transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

/* Spring-like bounce */
transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Smooth settle (closest to Apple spring) */
transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Stage / Bezel Frame (Showcase Surfaces)

For preview canvases, device mockups, and component playground stages — wrap content in a "bezel" that creates the illusion of a screen sitting inside a physical frame. Three-layer technique: outer shadow, inset highlight, inner padding gap.

```css
.stage-frame {
  position: relative;
  background: var(--surface-warm);
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
  padding: 12px;                    /* gap between bezel and screen */
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.12),               /* outer ambient */
    inset 0 1px 0 rgba(255, 255, 255, 0.4),     /* top light edge */
    inset 0 -2px 6px rgba(0, 0, 0, 0.04);       /* bottom inner shadow */
  backdrop-filter: blur(8px) saturate(1.2);
}

/* Inner "screen" surface */
.stage-frame__screen {
  border-radius: 20px;              /* concentric: outer 24 - padding 12 = 20 */
  background: var(--surface-warm);
  overflow: hidden;
  position: relative;
}
```

### Concentric Radii Rule
Inner radius = outer radius − padding. Always. Apple's HIG calls this "concentric design" — corners stay parallel as you nest surfaces.

---

## Specular Highlight Layer

Apple's Liquid Glass uses a top-left light refraction overlay on every glass surface. Implemented as a `::before` pseudo-element so it doesn't need extra DOM.

```css
.glass-surface {
  position: relative;
  background: var(--surface-card);
  backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.glass-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.04) 100%
  );
  pointer-events: none;
}

/* Dark mode: brighter highlight */
.dark .glass-surface::before {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.16) 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.08) 100%
  );
}
```

---

## Shadow Tier System (Default / Hover / Selected)

Use three escalating shadow levels for interactive surfaces. Selected = shadow + accent ring + accent glow. This is what makes "active" states feel alive on Apple's surfaces.

```css
/* Default — at rest */
.tier-default {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.04);
}

/* Hovered — subtle lift + faint glow */
.tier-hover {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 0 20px rgba(0, 122, 255, 0.10);
  transform: translateY(-1px);
}

/* Selected — prominent depth + accent ring + glow */
.tier-selected {
  box-shadow:
    0 8px 24px rgba(0, 122, 255, 0.20),
    0 0 0 1px rgba(0, 122, 255, 0.25),
    0 0 30px rgba(0, 122, 255, 0.15);
}
```

Substitute the cyan with any Apple system color when the surface has a category accent.

---

## Parallax Hover Tilt

Subtle 3D perspective tilt on hover — used for canvas stages, hero cards, anything that should feel "lift toward viewer". Disable on touch devices and reduced-motion.

```css
.parallax-surface {
  transform-style: preserve-3d;
  transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .parallax-surface:hover {
    transform: perspective(1200px) rotateX(2deg) rotateY(-1deg);
  }
}
```

Keep angles subtle (≤ 2°). More than that feels gimmicky and breaks the Apple "restraint" principle.

---

## iOS-Style Toggle Switch

Pill-shaped track with sliding thumb. Use for any binary on/off control where the system iOS toggle would appear. 52×32 is the standard touch-friendly size.

```css
.ios-toggle {
  position: relative;
  width: 52px;
  height: 32px;
  padding: 2px;
  background: #E5E5EA;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: background 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ios-toggle--on {
  background: #34C759;  /* Apple system green */
}

.ios-toggle::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ios-toggle--on::before {
  transform: translateX(20px);
}
```

For theme toggles specifically, use a neutral grey background (not green) and crossfade sun/moon icons inside the thumb.

---

## Sources (added 2026-04-06)
- Storybook, Histoire — sidebar + canvas layout patterns
- Vercel Geist — preview frame and depth shadows
- shadcn/ui — concentric radii and surface tiers
- Apple SF Symbols app — visual catalog navigation patterns
- https://www.cssscript.com/ios-vc-toggle-switch/
