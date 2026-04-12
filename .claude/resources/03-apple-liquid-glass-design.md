# Apple Liquid Glass Design System

> **Priority: HIGH** — Core visual identity for both public website and employee portal.
> Sources: https://developer.apple.com/design/human-interface-guidelines/
>          https://css-tricks.com/getting-clarity-on-apples-liquid-glass/

---

## What Liquid Glass Is
Apple's 2025 redesign (WWDC 2025) is a translucent, dynamic material that:
- Tints to content underneath it (chromatic adaptation)
- Has specular highlights that respond to real-time content changes
- Creates visual depth through layering, not flat color
- Adapts across Light / Dark / Increased Contrast modes

---

## CSS Implementation — Three-Layer Structure

Every glass element uses a three-part structure:

```css
/* Main element — borders and base fill */
.glass {
  background: rgba(24, 24, 27, 0.60);         /* --color-glass */
  border: 1px solid rgba(161, 161, 170, 0.15); /* --color-glass-border */
  border-radius: 16px;
}

/* ::before — inner shadow / light refraction */
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
}

/* ::after — blur layer (keep <20px for performance) */
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  pointer-events: none;
  z-index: -1;
}
```

---

## Typography — Apple System Font Stack

SF Pro is NOT licensed for web embedding. Use system stack:
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
             'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
             'Apple Color Emoji', 'Segoe UI Emoji';
```

Apple HIG 2025 Typography Rules:
- **Headers**: Bold weight (700+), left-aligned, large size for hierarchy clarity
- **Body**: Regular weight, comfortable line-height (1.5 minimum)
- **Labels**: Medium weight, all-caps with tracking for section headers
- **Hierarchy**: Size + weight differentiation (avoid color-only hierarchy)

---

## Color System (Current `app.css` variables — keep these)
```css
@theme {
  --color-glass: rgba(24, 24, 27, 0.60);
  --color-glass-border: rgba(161, 161, 170, 0.15);
  --color-glass-hover: rgba(24, 24, 27, 0.75);
  --color-cyan-accent: #06b6d4;           /* primary action color */
  --color-surface: #09090b;               /* zinc-950 base */
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
}
```

**Dark Mode Background Rule**: Do NOT use pure black (`#000000`). Use deep zinc (`#09090b` or `#0a0a0b`) — pure black causes eye strain and halation against white text.

---

## `backdrop-filter` Performance Rules

```css
/* ONLY animate backdrop-filter on elements that actually move */
.glass {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  /* Add will-change ONLY if the element animates */
  /* will-change: backdrop-filter;  ← only for animated glass */
}
```

- Keep blur radius **under 20px** — rendering cost rises sharply above this
- **Never apply** `backdrop-filter` to video elements (causes choppy playback)
- Limit total number of simultaneously rendered glass elements per page
- Use `transform: translateZ(0)` or `will-change: transform` to force GPU layer
- Remove `will-change` after animation completes to free GPU memory

---

## `prefers-reduced-transparency`

Honor the OS-level transparency preference:
```css
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: rgba(24, 24, 27, 0.95);  /* near-opaque fallback */
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: rgba(161, 161, 170, 0.4); /* stronger border */
  }
}
```

---

## Spacing & Shape System (HIG 2025)
- **Capsule shapes** for buttons (border-radius: 9999px or very high value)
- **Concentric design**: Inner padding proportional to outer rounded corners
- **Consistent 8px grid**: Spacing in multiples of 4 or 8
- **Extra margin on touch targets**: Minimum 44px hit target for buttons

---

## Sources
- https://developer.apple.com/design/human-interface-guidelines/
- https://developer.apple.com/videos/play/wwdc2025/356/
- https://css-tricks.com/getting-clarity-on-apples-liquid-glass/
- https://dev.to/gruszdev/apples-liquid-glass-revolution-how-glassmorphism-is-shaping-ui-design-in-2025-with-css-code-1221
