# Design Agent — Resource Index

> Last updated: 2026-04-07

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/03-apple-liquid-glass-design.md` | Glass CSS structure, color system, spacing, touch targets |
| `resources/10-apple-colors.md` | Apple system/semantic colors, dark mode variants |
| `resources/11-apple-effects.md` | Material thickness, shadows, easing curves, reduced motion |
| `resources/12-apple-typography.md` | SF Pro type scale, spacing grid, corner radii |
| `resources/04-accessibility-wcag22.md` | WCAG 2.2 AA for glass UI, contrast, focus, semantics |
| `resources/13a-motion-tokens.md` | Motion tokens (CSS custom properties), GPU rules |
| `resources/13b-motion-controllers.md` | MotionController + StaggerManager classes |
| `resources/13c-motion-utilities.md` | CSS utility classes, portal motion rules |
| `resources/20-dark-glass-pills-glows.md` | Dark-mode glass cards, floating pill nav, 3D drafting-desk tilt, colorful glow palette, lift easings (Young Carpets pattern) |
| `resources/21-architectural-finishes-plan.md` | Drafting conventions for decorative floor-finishes plan SVGs (finish codes, column grid, title block, door swings, mullion ticks, room labels) |

## Reference Files
| File | What's In It |
|------|-------------|
| `reference/animation-navigation.md` | View Transitions API + SvelteKit page transitions |
| `reference/animation-components.md` | Card pop, buttons, glow, consistency checklist |
| `reference/animation-carousel.md` | CSS-only + Embla carousel patterns |
| `reference/architecture-decisions.md` | ADR-005: Apple Liquid Glass UI (CSS-only, no component library) |

## Key Project Files
| File | Purpose |
|------|---------|
| `my-portal/src/app.css` | Tailwind v4 @theme block, glass base styles |
| `my-portal/src/lib/components/ui/GlassPanel.svelte` | Glass container primitive |
| `my-portal/src/lib/components/ui/FormField.svelte` | Glass-styled input wrapper |
| `my-portal/src/lib/components/ui/Badge.svelte` | Status labels |

## Design Tokens Quick Ref
- Accent: `--color-cyan-400`
- Base: `--color-zinc-*`
- Glass: `backdrop-filter: blur(20px)` + `rgba(255,255,255,0.05)`
- Radii: 8/12/16px
- Spacing: 4px grid

## Standing Design Rules

| # | Date | Rule | Reason |
|---|------|------|--------|
| 1 | 2026-04-07 | **Pills > buttons site-wide.** Default to `border-radius: 9999px` pill shapes for all interactive surfaces (links, buttons, badges, chips, toggles, nav items). Reserve sharp/rounded-corner buttons for rare structural cases (e.g., primary form submits inside a card). | User directive on mobile handoff 2026-04-07. Matches Apple Liquid Glass aesthetic + the existing Young Carpets pill nav, glass badges, chip secondary products, modal CTAs. Visual coherence across the portal AND the marketing site. |
| 2 | 2026-04-07 | **Tap targets ≥ 44×44 CSS px** on every interactive element (Apple HIG / WCAG 2.5.5). When converting an inline link or icon to a pill, give it `min-height: 44px` + adequate `padding`. | iPhone 13 Pro Max layout audit 2026-04-07 caught multiple sub-44 tap targets that all needed pill conversion + padding bumps. Bake it in from the start. |

## Protected (LOVE)

| # | Date | Item | What's Protected |
|---|------|------|-----------------|
| 1 | 2026-04-06 | Dev page (`/dev`) | Apple Light Glass layout, header, table cards, tab bar, CRUD panels, response panel |
| 2 | 2026-04-06 | Dev page dark mode toggle | Pill toggle in header top-right, sun/moon icons, 350ms transition, dark color scheme |

## Research Log
| Date | Topic | Source | Added To |
|------|-------|--------|----------|
| 2026-04-06 | Component playground UX (sidebar+canvas) | Storybook, Histoire, Geist, SF Symbols app | `resources/11-apple-effects.md` (Stage Bezel, Specular Highlight, Shadow Tier System, Parallax Tilt, iOS Toggle) |
| 2026-04-06 | Catalog keyboard navigation patterns | Storybook a11y docs, Apple HIG | `resources/04-accessibility-wcag22.md` (Catalog Keyboard Patterns, Focus-Visible Ring) |
| 2026-04-07 | Dark glass pills + 3D drafting-desk tilt | Apple HIG dark mode, Liquid Glass patterns, Young Carpets website | `resources/20-dark-glass-pills-glows.md` |
| 2026-04-07 | Architectural finishes plan conventions | AIA layer standards, metric working drawings | `resources/21-architectural-finishes-plan.md` |
