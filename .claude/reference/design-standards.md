# Design Standards — Young Carpets Website

> Authoritative design decisions for the new website that **override** ay3 patterns.
> When ay3-expert recommends porting a visual detail that conflicts with this file, this file wins.
> Last updated: 2026-04-12

---

## Badges

| Context | Style | Reason |
|---------|-------|--------|
| Over opaque backgrounds (footer, solid panels) | **Flat** — outline only, transparent fill, no backdrop-filter | Nothing behind to blur; glass effect adds nothing |
| Over translucent/image backgrounds (hero, sections) | **Glass** — backdrop-filter, translucent fill, inset highlight, shadow | Creates floating depth over the bg image |

---

## Color Strategy

**Grayscale only during dark mode buildout.** Every element laid over the background uses only black/white/gray. The warmth comes from the charcoal background showing through transparency — not from accent colors on the elements themselves.

**No color porting from ay3.** When bringing components from the old website, strip all gold, amber, cyan, or any accent colors. Replace with grayscale equivalents. Color will be added deliberately at the end, element by element, after all dark mode layout is complete.

**Color phase (later):** After dark mode is fully built, colors, glows, and highlights will be added selectively. This is a separate phase — not mixed into layout work.

---

## Component Architecture

**Similar components share a base class.** When multiple elements have the same structure (e.g., product badges, service cards, contact items), they should inherit from a shared base style. Changing the base changes all instances.

**Pattern from ay3:** Product badges for carpet tile, LVT, etc. all shared a common card structure. The same approach applies here — build a base, then apply variant-specific overrides only where needed.

**When porting from ay3:** Extract the shared base pattern first, then the variants. Don't copy-paste individual component styles independently.

---

## Contact Info

Phone numbers and email addresses are **plain text** site-wide — no `tel:` or `mailto:` links. Users can highlight and copy. This may change later but is the current standard.

---

## Border Radius

| Element | Value | Notes |
|---------|-------|-------|
| Large containers (nav, cards, modals, panels) | `16px` | |
| Small elements (badges, pills, column titles) | `8px` | ay3 used `9999px` — deliberately changed |
| Decorative bullets | `3px` | Proportional to 11×11 element |

**No fully-round pills (`9999px`).** The new website uses squared-off radii for a more architectural feel. This applies to all interactive surfaces, labels, and decorative elements.

---

## Color Palette

| Token | Value | Notes |
|-------|-------|-------|
| Body background | `#0b0b0d` | Same as ay3 |
| Footer background | `#07070a` | Same as ay3 |
| Primary text | `#e6e6e8` | Same as ay3 |
| Muted text | `#9a9aa1` | Same as ay3 `--yc-text-muted` |
| Faint text | `#8e8e96` | **Lighter than ay3** (`#6b6b73`) — changed to pass WCAG 4.5:1 on `#07070a` |
| Hover accent | `#e6e6e8` | Grayscale — no color accents until later |
| Hover background | `rgba(255, 255, 255, 0.06)` | Subtle white glow on interactive elements |
| Focus outline | `rgba(255, 255, 255, 0.5)` | Semi-transparent white, 2px solid |

---

## Typography

| Usage | Font | Notes |
|-------|------|-------|
| Body / UI | `'Inter Variable', system-ui, sans-serif` | ay3 used system font stack |
| Brand wordmark | `Square721Nav` | Same as ay3 |
| Labels / monospace accents | `ui-monospace, 'SF Mono', monospace` | Same as ay3 — nav menu, footer col-titles, version badge |

---

## Glass Effect

| Property | Value | Notes |
|----------|-------|-------|
| Background | `rgba(18, 18, 21, 0.55)` | |
| Border | `1px solid rgba(255, 255, 255, 0.1)` | |
| Backdrop filter | `blur(24px) saturate(1.8)` | ay3 used 20px blur — increased for stronger effect |
| Inset highlight | `inset 0 1px 0 rgba(255, 255, 255, 0.08)` | |
| Shadow | `0 8px 24px rgba(0, 0, 0, 0.45)` | |

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-04-12 | No `9999px` pills anywhere | Architectural feel, more squared-off than ay3 |
| 2026-04-12 | Faint text `#8e8e96` not `#6b6b73` | WCAG 4.5:1 contrast requirement on dark backgrounds |
| 2026-04-12 | Inter Variable instead of system font | Cross-platform consistency, weight 200 for headings |
| 2026-04-12 | `blur(24px)` not `blur(20px)` on nav | Stronger glass effect, per CLAUDE.md design tokens |
| 2026-04-12 | Grayscale only — no gold/color accents | Colors will be added later; everything stays black/white/gray for now |
| 2026-04-12 | Dev components exempt from design review | Version badge, debug overlays, etc. should stand out (e.g. purple badge). Don't normalize them to site palette. |
