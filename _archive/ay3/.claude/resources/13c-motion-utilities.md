# Motion Utilities & Portal Rules

> CSS utility classes and project-specific motion constraints.
> **Companion files:** `13a-motion-tokens.md` (CSS tokens), `13b-motion-controllers.md` (TS classes)

---

## CSS Utility Classes

Add to `app.css` for declarative, reusable animations:

```css
/* Entrance */
.animate-enter {
  animation: enter var(--motion-enter) var(--ease-decelerate) both;
}
.animate-pop {
  animation: pop var(--motion-base) var(--ease-spring) both;
}

/* Hover micro-interactions (GPU-safe) */
.hover-lift {
  transition: transform var(--motion-fast) var(--ease-spring),
              box-shadow var(--motion-fast) var(--ease-standard);
}
.hover-lift:hover {
  transform: translateY(-3px) scale(var(--scale-hover));
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

/* Button press feedback */
.press-scale {
  transition: transform var(--motion-instant) var(--ease-accelerate);
}
.press-scale:active {
  transform: scale(var(--scale-press));
}

/* Keyframes */
@keyframes enter {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.93); }
  to   { opacity: 1; transform: scale(1);    }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slide-right {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
```

---

## Stagger Delay Reference

| Step | Delay @ 60ms | Delay @ 80ms |
|:----:|:------------:|:------------:|
| 0 | 0ms | 0ms |
| 1 | 60ms | 80ms |
| 2 | 120ms | 160ms |
| 3 | 180ms | 240ms |
| 4 | 240ms | 320ms |

Cap stagger at ~5-6 items visible at once. Beyond that, delay the group, not individuals.

---

## Employee Portal Motion Rules

The portal is **function-first**. Apply a strict subset of the system:

- Use `transition: opacity var(--motion-fast)` on row hover
- Use `animate-enter` on page load for the main content area
- Toast notifications use `toast-in` keyframe (already in app.css)
- No spring easing, no stagger, no parallax
- No hover-lift on table rows — too distracting in data-dense views
- No carousels

---

## Sources
- [CSS Scroll-Driven Animations — Addy Osmani](https://addyosmani.com/blog/coverflow/)
- [GSAP Carousels — Codrops](https://tympanus.net/codrops/2025/04/21/mastering-carousels-with-gsap-from-basics-to-advanced-animation/)
