# 20 — Dark Glass, Pills & Colorful Glows (Young Carpets pattern)

Dark-mode frosted-glass surfaces with floating pill navbars, 3D drafting-desk
backgrounds, lifted pop-out cards, and colorful accent glows. Built for the
Young Carpets Inc. info-site pattern where the neutral dark palette is locked
and the only new color enters via interactive highlights and glows.

Companion resources:
- `03-apple-liquid-glass-design.md` — base Liquid Glass language
- `10-apple-colors.md` — system accent colors used in the glow palette
- `11-apple-effects.md` — shadow/blur/easing tokens
- `13a-motion-tokens.md` — motion duration/curve tokens

---

## Locked neutral palette (do not change)

```
--yc-bg:         #0b0b0d   /* page background — near-black */
--yc-bg-2:       #121215   /* section strip variation */
--yc-surface:    #18181b   /* card surface base */
--yc-surface-2:  #1f1f23   /* card hover surface */
--yc-border:     #2a2a2f   /* card borders (neutral) */
--yc-text:       #e6e6e8   /* primary text */
--yc-text-muted: #9a9aa1   /* secondary text */
--yc-text-faint: #6b6b73   /* labels, footer */
--yc-plan-line:  #4a4a52   /* decorative SVG strokes */
```

These neutrals define the "floor" of the page. All glass surfaces float
above this floor and derive their color exclusively from:
- Low-alpha white for edge/highlight
- Low-alpha black for depth/shadow
- A single colorful accent for hover glow (per-element)

---

## Motion & easing tokens

```css
:root {
  /* Durations */
  --t-fast: 180ms;   /* color/border micro-transitions */
  --t-base: 350ms;   /* standard hover */
  --t-lift: 500ms;   /* card pop, scale, shadow lift */

  /* Curves */
  --e-standard: cubic-bezier(0.4, 0, 0.2, 1);      /* default ease in/out */
  --e-out-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* dramatic lift/settle */
  --e-glide:    cubic-bezier(0.2, 0.8, 0.2, 1);    /* Apple smooth settle */
  --e-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot */
}
```

Rules of thumb:
- Color/border micro-changes: `--t-fast var(--e-standard)`
- Hover background/opacity: `--t-base var(--e-standard)`
- Transform/box-shadow lift: `--t-lift var(--e-out-expo)`
- Anything pillowy/overshoot: `--e-spring`

---

## Colorful accent glow palette

Based on Apple system accent colors in dark mode (from `10-apple-colors.md`),
tuned as `rgba()` with 0.45 alpha for the bloom glow formula:

```css
:root {
  --glow-cyan:    rgba(106, 199, 234, 0.45);  /* systemCyan (dark) */
  --glow-purple:  rgba(191, 90, 240, 0.45);   /* systemPurple (dark) */
  --glow-amber:   rgba(255, 159, 10, 0.45);   /* systemOrange (dark) */
  --glow-magenta: rgba(255, 55, 95, 0.45);    /* systemPink (dark) */
}
```

Alpha range: tune between 0.30 (subtle) and 0.55 (vivid). Above 0.55 the
glow starts looking neon/toylike on dark backgrounds.

**Assignment strategy**: assign a different glow per section so adjacent
elements don't share a color. E.g. "What We Do" = cyan, "Flooring Types" =
purple, "Contact" = amber. Or per nav pill so each one feels distinct.

---

## 1. 3D drafting-desk background tilt

The fixed background plan SVG is tilted in 3D perspective as if lying flat
on a drafting table receding into the distance. Scroll position translates
the SVG along the tilted plane (paper sliding on the desk).

**Structure (outer to inner):**

```
.yc-bg-plan            — fixed full viewport, perspective stage, radial vignette mask
  .yc-bg-plan-desk     — tilted wrapper (rotateX/rotateZ)
    .yc-bg-plan-scroll — translates along Y using --yc-pan (scroll-driven)
      .yc-bg-plan-drift — slow drift animation
        <svg>           — the architectural plan
```

**CSS:**

```css
.yc-bg-plan {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  perspective: 1600px;           /* deep enough to feel architectural, not fish-eye */
  perspective-origin: 50% 30%;   /* vanishing point above center = horizon line */
  /* Vignette stays on the untilted wrapper so edges always fade in screen space */
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 40%, transparent 95%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 40%, transparent 95%);
}

.yc-bg-plan-desk {
  position: absolute;
  inset: -10% -5%;               /* overscan so tilted edges never reveal void */
  transform-origin: 50% 0%;      /* hinge along top = paper taped at top of desk */
  transform: rotateX(38deg) rotateZ(-2deg);
  transform-style: preserve-3d;
  will-change: transform;
}

.yc-bg-plan-scroll {
  position: absolute;
  inset: 0;
  /* Slide paper up the desk as user scrolls down; tune factor -0.05 to -0.30 */
  transform: translate3d(0, calc(var(--yc-pan, 0px) * -0.15), 0);
}

.yc-bg-plan-drift {
  width: 100%;
  height: 100%;
  animation: yc-plan-drift 80s ease-in-out infinite alternate;
}

@keyframes yc-plan-drift {
  0%   { transform: translate(0, 0) scale(1.02); }
  50%  { transform: translate(-1%, -0.6%) scale(1.04); }
  100% { transform: translate(0.8%, 0.4%) scale(1.02); }
}

.yc-bg-plan-svg {
  width: 100%;
  height: 100%;
  display: block;
  color: var(--yc-plan-line);
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .yc-bg-plan-desk { transform: rotateX(0) rotateZ(0); }
  .yc-bg-plan-drift { animation: none; }
}
```

**Critical knobs:**
| Knob | Default | Tune range |
|---|---|---|
| `rotateX` | 38deg | 32–44 (lower = flatter / higher = billboard) |
| `rotateZ` | -2deg | -4 to +4 (breaks symmetry, don't go big) |
| `perspective` | 1600px | 1400–1800 |
| `perspective-origin Y` | 30% | 20–40% |
| Pan factor | -0.15 | -0.05 to -0.30 |
| Drift scale range | 1.02–1.04 | keep under 1.06 |

---

## 2. Lifted frosted-glass cards

Proper Apple Liquid Glass recipe with: diagonal low-alpha gradient base,
backdrop blur + saturation, 1px low-alpha white border, inset top highlight,
multi-layer shadow stack, diagonal specular sheen overlay, and colorful
bloom on hover.

```css
.yc-card {
  position: relative;
  isolation: isolate;
  border-radius: 18px;
  padding: 28px;
  background: linear-gradient(
    135deg,
    rgba(36, 36, 42, 0.55) 0%,
    rgba(20, 20, 24, 0.65) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),  /* top edge glass highlight */
    0 2px 4px rgba(0, 0, 0, 0.30),            /* close contact shadow */
    0 18px 40px -12px rgba(0, 0, 0, 0.55),    /* mid lift */
    0 40px 80px -24px rgba(0, 0, 0, 0.65);    /* deep ambient cast */
  transition:
    transform var(--t-lift) var(--e-out-expo),
    box-shadow var(--t-lift) var(--e-out-expo),
    border-color var(--t-base) var(--e-standard);
}

/* Specular sheen — diagonal highlight across the surface */
.yc-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.10) 0%,
    transparent 35%,
    transparent 70%,
    rgba(255, 255, 255, 0.03) 100%
  );
  pointer-events: none;
  z-index: 1;
}
.yc-card > * { position: relative; z-index: 2; }

.yc-card:hover {
  transform: translateY(-6px) scale(1.012);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    0 4px 8px rgba(0, 0, 0, 0.35),
    0 28px 60px -16px rgba(0, 0, 0, 0.65),
    0 60px 120px -32px rgba(0, 0, 0, 0.70),
    0 0 60px -10px var(--card-glow, var(--glow-cyan));
}

/* Section accent inheritance */
.yc-section--what-we-do      { --card-glow: var(--glow-cyan);    }
.yc-section--flooring-types  { --card-glow: var(--glow-purple);  }
.yc-section--contact         { --card-glow: var(--glow-amber);   }

/* Accessibility: honor reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .yc-card {
    background: rgba(20, 20, 24, 0.95);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: rgba(255, 255, 255, 0.20);
  }
}
```

**Critical knobs:**
| Knob | Default | Range |
|---|---|---|
| Backdrop blur | 18px | 14–22 (cap at 20px for perf) |
| Base bg alpha | 0.55/0.65 | 0.40–0.75 |
| Border alpha (base) | 0.08 | 0.06–0.12 |
| Border alpha (hover) | 0.18 | 0.15–0.25 |
| Hover translateY | -6px | -4 to -10 |
| Hover scale | 1.012 | 1.005–1.020 |
| Glow spread | -10px / 60px blur | 40–80 blur |

---

## 3. Floating glass pill navbar

Centered floating capsule containing individual pill links, each with its
own accent glow color.

```css
.yc-nav {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 9999px;
  background: rgba(18, 18, 21, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.45),
    0 24px 60px -16px rgba(0, 0, 0, 0.55);
}

.yc-nav-brand {
  padding: 8px 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--yc-text);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  margin-right: 4px;
}

.yc-nav-link {
  --pill-glow: var(--glow-cyan);
  position: relative;
  padding: 10px 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: var(--yc-text-muted);
  text-decoration: none;
  border: 1px solid transparent;
  background: transparent;
  transition:
    color        var(--t-base) var(--e-standard),
    border-color var(--t-base) var(--e-standard),
    background   var(--t-base) var(--e-standard),
    box-shadow   var(--t-lift) var(--e-out-expo),
    transform    var(--t-lift) var(--e-out-expo);
}

.yc-nav-link:hover {
  color: #fff;
  transform: scale(1.04);
  border-color: rgba(255, 255, 255, 0.22);
  background-color: rgba(255, 255, 255, 0.04);
  box-shadow:
    0 0 0 1px var(--pill-glow),        /* outline grow — extra glowing ring */
    0 0 24px -2px var(--pill-glow),    /* inner bloom */
    0 0 48px -8px var(--pill-glow);    /* outer bloom */
}

.yc-nav-link[data-glow="cyan"]    { --pill-glow: var(--glow-cyan);    }
.yc-nav-link[data-glow="purple"]  { --pill-glow: var(--glow-purple);  }
.yc-nav-link[data-glow="amber"]   { --pill-glow: var(--glow-amber);   }
.yc-nav-link[data-glow="magenta"] { --pill-glow: var(--glow-magenta); }
```

**Markup:**

```svelte
<nav class="yc-nav">
  <span class="yc-nav-brand">Young Carpets</span>
  <a class="yc-nav-link" data-glow="cyan"    href="#what-we-do">What We Do</a>
  <a class="yc-nav-link" data-glow="purple"  href="#flooring-types">Flooring Types</a>
  <a class="yc-nav-link" data-glow="amber"   href="#about">About</a>
  <a class="yc-nav-link" data-glow="magenta" href="#contact">Contact</a>
</nav>
```

---

## Application checklist

- [ ] Root palette vars defined on `.yc-page` (neutrals) and `:root` (motion + glows)
- [ ] `.yc-bg-plan` wrapper has perspective + radial vignette mask
- [ ] `.yc-bg-plan-desk` wrapper applies rotateX/rotateZ
- [ ] `.yc-bg-plan-scroll` consumes `--yc-pan` from $state
- [ ] `.yc-bg-plan-drift` runs the drift keyframes
- [ ] SVG has `class="yc-bg-plan-svg"`
- [ ] `.yc-card` has base + hover + ::before sheen + section glow var inheritance
- [ ] `.yc-nav` pill container, `.yc-nav-link` pills with `data-glow` attributes
- [ ] Sections have `.yc-section--what-we-do` etc classes for card-glow inheritance
- [ ] `@media (prefers-reduced-motion: reduce)` disables tilt and drift
- [ ] `@media (prefers-reduced-transparency: reduce)` falls back card glass to solid

---

## Source

Young Carpets Inc. website redesign, 2026-04-06.
Branch: `claude/flooring-website-design-I9k8J`.
User brief: "Beautiful simple design but beautifully smooth transitions. Glass
feel for cards over top. Highlights/glows are colorful though. I like floating
glass transparent navbars with pills that outline grows and glows effects.
Raised pop out cards. Those things. Lots of those things."
