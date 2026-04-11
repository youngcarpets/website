---
description: Audit a Svelte component for WCAG 2.2 AA compliance
argument-hint: <file-path>
---

Audit `$ARGUMENTS` against CLAUDE.md's **Accessibility (WCAG 2.2 AA)** section.

Procedure:

1. Read `$ARGUMENTS` and any imported child components it renders.
2. Dispatch the `a11y-checker` subagent with the file path. Ask it to check the full CLAUDE.md a11y checklist:
   - Landmarks + heading hierarchy
   - `<html lang>`, skip link, `#main` + `tabindex="-1"`
   - Contrast ratios (normal ≥ 4.5:1, large ≥ 3:1, UI ≥ 3:1)
   - Focus indicator ≥ 3:1, ≥ 2px
   - Target size ≥ 24×24, CTA ≥ 44×44
   - Form semantics: `<label for>`, `aria-invalid`, `aria-describedby`, live region for status
   - Alt text: informative vs decorative correctly applied
   - `prefers-reduced-motion` wrapping every transform/opacity animation
   - Any `svelte-ignore a11y_*` directives — each needs a reason

3. Return findings as a concise table: `file:line — violation — WCAG reference — suggested fix`.

4. Do **not** auto-fix. Reports only, unless the user explicitly asks for fixes afterward.
