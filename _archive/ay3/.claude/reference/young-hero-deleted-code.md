# YOUNG hero wordmark — pre-rebuild snapshot

Captured 2026-04-08 (v1.24.38 → rebuild). All of this was DELETED and the
hero wordmark rebuilt from scratch with new class names + a new font-load
strategy. If the new code regresses or you want to restore the old visual,
this is the source of truth for the original implementation.

## 1. YcHero.svelte — original `<h1>` block

```svelte
<h1 class="yc-hero-title" aria-label="Young">
    {#each [...'YOUNG'] as ch, i (i)}
        <span
            class="yc-hero-title-char"
            class:yc-hero-title-char--last={i === 4}
            style="--i: {i}; opacity: 0; transform: translateY(28px) scale(0.92);"
            aria-hidden="true"
            >{ch}{#if i === 4}<svg
                    class="yc-hero-leaf"
                    viewBox="-2015 -2000 4030 4030"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    ><path
                        fill="currentColor"
                        d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
                    /></svg
                >{/if}</span
        >
    {/each}
</h1>
```

## 2. young-carpets.css — original rules

### @font-face (was shared with nav/footer/hw-flip-label too)

```css
@font-face {
    font-family: 'Square721';
    src: url('/young-carpets/square721.ttf') format('truetype');
    /* v1.24.36: was `swap` — caused a visible serif→Square721 flicker on
       the YOUNG hero wordmark. Font is preloaded in app.html so `block`
       waits (up to ~3s) for the real font instead of painting fallback. */
    font-display: block;
}
```

### .yc-hero-title and chars

```css
.yc-hero-title {
    /* v1.20.15: hero wordmark is now just YOUNG in Square721 (the
       logo font). Per-letter stagger animation preserved. */
    font-family: 'Square721', serif;
    font-size: 5.5rem;
    font-weight: 400;
    line-height: 1.05;
    color: var(--yc-text);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0 0 1.25rem;
    display: inline-block;
    white-space: nowrap;
}

.yc-hero-title-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(28px) scale(0.92);
    animation: yc-hero-letter 700ms var(--e-spring) forwards;
    /* 40ms stagger per letter, started after the eyebrow has begun */
    animation-delay: calc(420ms + var(--i) * 40ms);
    will-change: transform, opacity;
}

/* The "G" gets the maple leaf as a superscript. Position relative
   so the leaf can absolute-position itself off the top-right. */
.yc-hero-title-char--last {
    position: relative;
}
```

### .yc-hero-leaf (the maple leaf exponent on the G)

```css
/* v1.20.29: white maple leaf as exponent on the G of YOUNG. Electric
   red glow on hover. The hover trigger lives on the parent .yc-hero-
   title so the user gets the effect anywhere on the wordmark. */
.yc-hero-leaf {
    position: absolute;
    top: -0.05em;
    right: -0.55em;
    width: 0.42em;
    height: 0.42em;
    color: #ffffff;
    opacity: 0;
    transform: translateY(-6px) scale(0.7);
    filter: drop-shadow(0 0 0 transparent);
    animation: yc-hero-leaf-in 700ms var(--e-out-expo) 1100ms forwards;
    transition: filter 380ms var(--e-out-expo),
        transform 380ms var(--e-out-expo);
    will-change: transform, filter;
}

@keyframes yc-hero-leaf-in {
    0% {
        opacity: 0;
        transform: translateY(-6px) scale(0.7);
    }
    60% {
        opacity: 1;
        transform: translateY(0) scale(1.08);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.yc-hero-title:hover .yc-hero-leaf,
.yc-hero-title:focus-visible .yc-hero-leaf {
    transform: translateY(-2px) scale(1.12);
    filter:
        drop-shadow(0 0 6px var(--yc-maple-red-95))
        drop-shadow(0 0 14px var(--yc-maple-red-75))
        drop-shadow(0 0 28px var(--yc-maple-red-55));
}

@media (prefers-reduced-motion: reduce) {
    .yc-hero-leaf {
        opacity: 1;
        transform: none;
        animation: none;
        transition: filter 200ms;
    }
    .yc-hero-title:hover .yc-hero-leaf {
        transform: none;
    }
}
```

### Keyframe yc-hero-letter

```css
@keyframes yc-hero-letter {
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

### prefers-reduced-motion entry that included yc-hero-title-char

```css
@media (prefers-reduced-motion: reduce) {
    .yc-hero-tag,
    .yc-hero-sub,
    .yc-hero-title-char {
        opacity: 1;
        transform: none;
        animation: none;
    }
}
```

### Responsive @ 768px

```css
@media (max-width: 768px) {
    .yc-hero-title {
        font-size: 3.75rem;
        letter-spacing: 0.12em;
        white-space: nowrap;
    }
}
```

### Light-mode overrides

```css
:global(:root[data-theme='light']) .yc-hero-leaf {
    color: #c8102e;
}
:global(:root[data-theme='light']) .yc-hero-title:hover .yc-hero-leaf,
:global(:root[data-theme='light']) .yc-hero-title:focus-visible .yc-hero-leaf {
    filter:
        drop-shadow(0 0 4px rgba(200, 16, 46, 0.45))
        drop-shadow(0 4px 10px rgba(60, 50, 30, 0.30))
        drop-shadow(0 8px 18px rgba(60, 50, 30, 0.20));
}
```

### Theme-transition selector list (yc-hero-leaf was in here)

`.yc-hero-leaf` was listed in the big selector group at line ~3155 that
applies a 280ms theme transition, and again in the
`@media (prefers-reduced-motion: reduce)` block at ~3173 that disables it.

## 3. app.html — original preload tag

```html
<!-- v1.23.24: preload Square 721 (the YOUNG hero wordmark font) so it
     starts fetching during HTML parse, BEFORE the route's <style>
     block declares the @font-face. Without this, font-display: swap
     causes a brief flash of the serif fallback on first paint. -->
<link
    rel="preload"
    href="/young-carpets/square721.ttf"
    as="font"
    type="font/ttf"
    crossorigin="anonymous"
/>
```

## 4. Other Square721 consumers (changed to placeholder font)

These three rules previously used `font-family: 'Square721', serif;`:

- `.yc-nav-brand-name` (~line 333)
- `.yc-footer-brand-name` (~line 1100)
- `.yc-hw-flip-label` (~line 2742)

If you ever want them back on Square721, restore the @font-face and
change those three `font-family` lines back to `'Square721', serif`.
