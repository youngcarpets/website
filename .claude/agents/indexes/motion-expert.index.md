# Motion Expert — Resource Index

> Last updated: 2026-04-12

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/13a-motion-tokens.md` | CSS custom properties for duration/easing, GPU compositing rules |
| `resources/13b-motion-controllers.md` | TypeScript MotionController + StaggerManager classes |
| `resources/13c-motion-utilities.md` | CSS utility classes for motion |
| `resources/11-apple-effects.md` | Apple easing curves, material levels, shadow tiers, parallax tilt |
| `resources/03-apple-liquid-glass-design.md` | backdrop-filter performance, reduced-transparency |
| `resources/20-dark-glass-pills-glows.md` | YCI motion tokens, card lift, glow bloom |
| `reference/animation-navigation.md` | View Transitions API + SvelteKit page transitions |
| `reference/animation-components.md` | Card pop, button animations, glow effects |
| `reference/animation-carousel.md` | CSS-only + Embla carousel patterns |

## Project Motion Tokens (from CLAUDE.md)
```css
--fast: 120ms;
--base: 200ms;
--slow: 320ms;
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

## Apple Easing Curves (from resources)
```css
/* Standard ease-out (exits) */
cubic-bezier(0.4, 0, 0.2, 1);
/* Apple smooth settle (closest to spring) */
cubic-bezier(0.2, 0.8, 0.2, 1);
/* Spring-like overshoot */
cubic-bezier(0.34, 1.56, 0.64, 1);
/* Ease-out-expo (dramatic lift/settle) */
cubic-bezier(0.16, 1, 0.3, 1);
```

## GPU-Composited Properties (safe to animate)
- `opacity`
- `transform` (translate, scale, rotate)
- `filter` (with caution — can be expensive)
- `clip-path` (composited in modern browsers)

## Layout-Triggering Properties (never animate)
- `width`, `height`, `min-height`, `max-height` (use `transform: scale` instead when possible)
- `top`, `left`, `right`, `bottom` (use `transform: translate` instead)
- `margin`, `padding` (triggers layout recalc)
- `border-width` (triggers layout)
- `font-size` (triggers layout + paint)

Note: `max-height` is an exception for expand/collapse patterns where `transform: scaleY` would distort content. Accept the layout cost but keep transitions short (≤300ms).

## Modern Web Animation Techniques
| Technique | What It Does | Browser Support |
|-----------|-------------|----------------|
| View Transitions API | Cross-page/cross-state morphing | Chrome 111+, Safari 18+ |
| `@starting-style` | Animate from `display: none` entry | Chrome 117+, Safari 17.5+ |
| `interpolate-size: allow-keywords` | Transition to/from `auto` height | Chrome 129+ |
| `animation-timeline: scroll()` | Scroll-driven CSS animations | Chrome 115+, no Safari |
| FLIP technique | Layout animation via transform inversion | All browsers (JS required) |
| `content-visibility: auto` | Skip rendering off-screen content | Chrome 85+, no Safari |

## Known Workarounds

### box-shadow transitions cause SVG sub-pixel jitter — FIXED (v0.4.93, LOCKED)
**Root cause:** Any property transition (box-shadow, border-color, opacity) on elements containing SVGs triggers per-frame repaints that re-rasterize SVG content at shifting sub-pixel positions. This includes opacity transitions on dimmed/hidden states.
**Fix (confirmed flawless):**
1. Never transition visual properties on elements during motion — only `transform` may transition
2. All glow/border/opacity changes snap instantly via class toggle
3. Dimmed badges use `visibility: hidden` (not opacity) — visibility doesn't trigger repaint
4. Badge illuminated state uses exact same box-shadow values as expanded card: `var(--glass-shadow), var(--illuminate-glow)`
5. Elements in motion are frozen static images — no internal property changes while moving
6. SVG coordinates can be freely adjusted for centering without causing wiggle (confirmed with Ceramic and Carpet Tile)
7. SVG sizing via viewBox zoom (e.g. Carpet `viewBox="13 23 174 174"`) is safe — no coordinate changes needed

## Checklist for Every Animation
- [ ] Only animates `opacity` and/or `transform` (or justified exception)
- [ ] Duration ≤ 300ms (or documented exception)
- [ ] Has `prefers-reduced-motion: reduce` override
- [ ] No `transition: all` — specific properties listed
- [ ] No permanent `will-change` on static elements
- [ ] Enter easing ≠ exit easing (asymmetric motion)
- [ ] Max 3 concurrent animations on screen
- [ ] Tested on iPhone Safari (compositor differences)

## Key Files in This Project
| File | Animations Present |
|------|-------------------|
| `src/routes/+layout.svelte` | Nav glass, hamburger bars, theme toggle, footer expand/collapse, view transitions |
| `src/routes/+page.svelte` | Hero label fade, wordmark letter bounce, tagline fade |
