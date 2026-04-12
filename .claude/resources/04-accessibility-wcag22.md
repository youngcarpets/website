# Accessibility — WCAG 2.2 AA on Glass UI

> **Priority: HIGH** — Glass/translucent UI fails WCAG by default. Must be explicitly enforced.
> Sources: https://www.w3.org/WAI/WCAG22/
>          https://axesslab.com/glassmorphism-meets-accessibility/

---

## Why Glass UI Fails Accessibility By Default
Blurred backgrounds change constantly — contrast ratios cannot be measured against a dynamic background. You **must** ensure text always renders against a sufficiently opaque surface, not just blur.

---

## Contrast Requirements (WCAG 2.2 Level AA)

| Text Type | Minimum Ratio | Examples |
|-----------|--------------|---------|
| Normal text (< 18pt / < 14pt bold) | **4.5:1** | Body copy, labels, form fields |
| Large text (≥ 18pt or ≥ 14pt bold) | **3:1** | Headings, hero text |
| UI components, icons, focus indicators | **3:1** | Buttons, inputs, checkboxes |
| Decorative elements | None | Background textures, illustrations |

**Tool**: https://webaim.org/resources/contrastchecker/

---

## Text on Glass — The Core Fix

Do NOT rely on blur alone for text legibility. Add a semi-opaque backing:

```css
/* WRONG — text sits directly on blurred glass */
.glass-text {
  color: #fafafa;
  /* relies on blur to separate from background */
}

/* CORRECT — text has opaque enough surface behind it */
.glass-panel {
  background: rgba(24, 24, 27, 0.85);  /* dark enough for 4.5:1 with #fafafa */
  backdrop-filter: blur(20px);
}

/* For critical text on potentially light backgrounds */
.text-on-glass {
  color: #fafafa;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);  /* failsafe */
}
```

**Verify**: `#fafafa` on `rgba(24,24,27, 0.85)` = ~11:1 ratio ✓

---

## Focus Indicators (WCAG 2.2 SC 2.4.11)

New in WCAG 2.2 — focus indicators must have:
- Area ≥ perimeter × 2 CSS pixels
- Contrast ratio ≥ 3:1 between focused and unfocused state

```css
/* Current app.css approach — verify this meets 3:1 */
.input-glass:focus {
  outline: 2px solid var(--color-cyan-accent);  /* #06b6d4 */
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-cyan-glow); /* rgba(6,182,212,0.25) */
}

/* Button focus */
.btn-primary:focus-visible {
  outline: 2px solid #06b6d4;
  outline-offset: 3px;
}
```

---

## `prefers-reduced-transparency` (WCAG 1.4.12 adjacent)
```css
@media (prefers-reduced-transparency: reduce) {
  .glass, .glass-navbar {
    background: rgba(9, 9, 11, 0.97);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

---

## `prefers-reduced-motion`
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  .toast {
    animation: none;
  }
}
```

---

## Semantic HTML Requirements

- Use `<button>` for actions, `<a>` for navigation — never `<div onclick>`
- Form inputs must have associated `<label>` (already done via `FormField.svelte`)
- Tables must have `<th scope="col">` headers (check `EmployeeTable.svelte`)
- Modals must trap focus and return focus on close (`ConfirmDialog.svelte` needs audit)
- Icons used as buttons must have `aria-label`

---

## Color — Not the Only Differentiator
```html
<!-- WRONG — uses only color for status -->
<span class="text-green-400">Paid</span>
<span class="text-red-400">Overdue</span>

<!-- CORRECT — uses icon or text alongside color -->
<Badge variant="success">✓ Paid</Badge>
<Badge variant="danger">⚠ Overdue</Badge>
```

---

## Testing Checklist
- [ ] Tab through entire page — every interactive element reachable and visible
- [ ] Verify contrast ratios with https://webaim.org/resources/contrastchecker/
- [ ] Test with `prefers-reduced-transparency: reduce` in DevTools
- [ ] Test with `prefers-reduced-motion: reduce`
- [ ] Verify all form inputs have visible labels (not just placeholder text)
- [ ] Confirm modal focus trap works (`ConfirmDialog.svelte`)
- [ ] Check color-blind mode — status meaning conveyed without color alone

---

## Catalog / Showcase Keyboard Patterns

For component playgrounds, library browsers, and any "pick from a list, preview on the right" UI:

| Key | Action |
|---|---|
| `Cmd/Ctrl+K` | Focus the search input (global hotkey) |
| `↑` / `↓` | Move through filtered list |
| `Enter` | Select highlighted item |
| `Escape` | Clear search / blur input |
| `Tab` / `Shift+Tab` | Move between regions (sidebar → toolbar → canvas) |
| `←` / `→` | Previous / next item (when canvas is focused) |

Implementation rules:
- Sidebar items must be `<button>` or `<a>` (focusable by default), not `<div>` with click handlers
- Use `aria-current="page"` on the active item, not just a class
- The search input is `<input type="search">` with `aria-label`
- Active sidebar item should `scrollIntoView({ block: 'nearest' })` when changed by keyboard

## Focus-Visible Ring (Apple Style)

Use `:focus-visible` (not `:focus`) so mouse clicks don't show outlines but keyboard nav does:

```css
:focus-visible {
  outline: 2px solid #007AFF;        /* Apple system blue */
  outline-offset: 2px;
  border-radius: inherit;
}

/* Larger offset on dense lists for clarity */
.sidebar-item:focus-visible {
  outline-offset: 4px;
}
```

Never use `outline: none` without an explicit replacement focus indicator.

---

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://axesslab.com/glassmorphism-meets-accessibility/
- https://webaim.org/articles/contrast/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
