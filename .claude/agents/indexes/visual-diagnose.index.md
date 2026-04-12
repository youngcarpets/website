# Visual Diagnose Agent — Resource Index

> Last updated: 2026-04-08 (created with the agent itself)

## Why this agent exists

Code-only debugging hits a wall when the bug is *visual* — clipping, alignment, ghost pixels, color/contrast, font flicker, layout overflow, things that look subtly wrong. The user often knows exactly what they're seeing but can't translate it into a CSS rule, and Claude often knows the CSS rules but can't see what's on screen. Putting both in the same agent — image read + source read in one pass — closes that loop.

This agent is the loop-closer.

## How to invoke

From the parent Claude:

```
Agent({
    subagent_type: "Explore",  // or general-purpose if you need writes (you usually don't)
    description: "diagnose <thing> in screenshot",
    prompt: "
    Read this image: <absolute path>
    Then read these files: <list>
    Diagnose <specific question>.
    Report under 500 words with file:line refs.
    Do not edit files.
    "
})
```

Or, more naturally, use the agent definition at `.claude/agents/visual-diagnose.md` to brief a fresh subagent and let it follow its own playbook.

## Image drop zones

Search these in order when the user references an image without a path:

| Path | Purpose |
|------|---------|
| `C:/dev/youngcarpets/website/forClaude/` | Primary drop zone — user-provided screenshots, mockups, photos, font files, references |
| `C:/dev/youngcarpets/website/static/` | Docs-bundled screenshots (if any) |
| `C:/dev/youngcarpets/website/.claude/reference/` | Reference imagery committed to the repo |
| `C:/dev/youngcarpets/website/src/lib/assets/` | Static assets that might themselves be the subject of the question |

The Read tool ingests PNG/JPG/WebP/GIF natively — no special syntax needed.

## User preferences

**The user likes pixel-perfect positioning.** When flex (or grid) layout is fighting back on a stubborn visual bug — clipping, stuck-at-edge, won't-shrink, won't-anchor — **consider `position: absolute` early**, not as a last resort. The user explicitly stated 2026-04-08:

> "i like the ability to move things perfectly into position. obviously flex is better for resize.. but when we struggle, consider absolute."

How to apply:
- Default to flex/grid for layouts where responsive resize matters (most layouts).
- The moment a flex/grid layout produces overflow, clipping, or "the child won't go where I want it" symptoms that 1–2 patches don't fix → switch to `position: absolute` on the affected child with explicit `top`/`bottom`/`left`/`right` coordinates. Don't keep patching the flex math.
- When recommending an absolute fix, briefly call out what it gives up (resize behavior, content-driven sizing) and what it gains (deterministic positioning) so the user knows the trade.
- If absolute positioning has a known iOS Safari pitfall in the specific context (e.g. inside a `perspective + backdrop-filter` parent), surface that — but don't let it block the recommendation if mitigations exist (e.g. perspective is already stripped on touch via media query).

This preference is grounded in two recent wins (2026-04-08): (1) YOUNG hero wordmark rebuild used `visibility: hidden` + JS-gated reveal — explicit positioning beat the flex/animation race. (2) Product card body fix used `position: absolute` with `bottom/left/right` after multiple flex-based patches failed.

## Diagnosis playbook

### Step 1 — Read the image FIRST.
Before opening any source file, look at the image and write down (mentally or in scratch space) what you actually see, in plain language. Where is the bug? What does it look like? Does it span the whole screen or just one element? Is it a clipping issue, a stacking issue, a color issue, an alignment issue, a missing-element issue?

This step matters because reading code first biases you toward the rules you happen to find — you'll explain the bug with whatever you see in the CSS, even if it's not the actual cause. Reading the image first anchors the investigation to the symptom.

### Step 2 — Find the source.
The user usually names the affected component ("the YOUNG hero", "the product cards", "the navbar in light mode"). If not, grep the visible text from the screenshot to find the file. SvelteKit routes live under `src/routes/<route>/`; shared components under `src/lib/components/`; YC-specific styles in `src/routes/+layout.svelte (scoped styles)`.

### Step 3 — Read the affected element AND its ancestors.
A visual bug is often caused by an ancestor's `overflow`, `position`, `transform`, `z-index`, or `display` — not by the visible element's own styles. Walk up the DOM tree in the markup and check every wrapping container for layout-affecting properties.

### Step 4 — Check the data feeding it.
If the bug is "labels are clipped" or "text overflows," look at the actual content strings in the data file. Long strings can blow out layouts that look fine in mock data.

### Step 5 — Refute the user's guess if needed.
The user's hypothesis ("it's the SVG pushing things down") is usually shaped by what they see, not by how CSS works. Check it against the rules. If it's wrong, say so gently and explain the actual mechanism with file:line evidence.

### Step 6 — Rank hypotheses.
If multiple causes are consistent with the visible bug, list the top 1–3 with confidence percentages and what each one predicts visually. The parent agent can then test the most likely first.

### Step 7 — Recommend ONE fix.
Smallest code change that would resolve the bug. List 1–2 alternatives with tradeoffs (e.g. "lose 1 line of blurb" vs "hide blurb entirely"). Cite file:line for the change location.

### Step 8 — Stay read-only.
This agent does not edit. The parent agent applies the fix.

## Common gotchas to check first

| Symptom | Usually caused by |
|---------|-------------------|
| Text clipped at bottom of card | Card has `overflow: hidden` + flex `space-between` allowing last child to overflow downward when total content exceeds container height |
| Text clipped at top of card | Same as above, with the body element's content too tall and `align-items: stretch` interacting with min-height |
| Element invisible / opacity 0 stuck | A `forwards` keyframe animation that ends at opacity 0, OR a higher-specificity selector overriding the fade-in animation with one that doesn't touch opacity (specificity cascade conflict) |
| Font flicker on first load | Animation triggered before `document.fonts.ready` resolves; wrap the trigger in `await document.fonts.load('<size> "<family>"')` to gate it |
| Mysterious dark blob behind translucent element | `backdrop-filter` is sampling whatever's BEHIND the element, not the element's own background. Check the parent's stacking context and any underlying layers (parallax, hero images, fixed backgrounds) |
| Element appears, then disappears forever | A class that's added post-mount (often via reactive `$effect`) is binding to a higher-specificity rule that replaces the original animation with one that doesn't preserve opacity |
| Wrong stacking order | An ancestor created a stacking context (`will-change`, `transform`, `opacity < 1`, `isolation: isolate`, `position: fixed`) that traps z-index inside it |
| `position: absolute` element "pushing" siblings | It can't. Absolute elements are removed from flow. The user's intuition is wrong — find the actual in-flow culprit |
| Flex child clipped by `overflow: hidden` parent even when content < container | Flex `space-between` (or any positioning that anchors a child to a specific edge) can leave a child overflowing its parent's box when the layout math doesn't add up the way you expect. Hiding content / reducing font sizes won't fix it — only DECOUPLING the child from flex layout will. Use `position: absolute` on the affected child with explicit coordinates (`top`/`bottom`/`left`/`right`) so flex no longer manages it. The child still inherits z-index ordering and animates with the parent if the parent has `position: relative`. |

## Notable past diagnoses

| Date | Bug | Root cause | Fix |
|------|-----|-----------|-----|
| 2026-04-08 | YOUNG hero wordmark Square721→blank→Square721 flicker | Animation race against font load — `font-display: block` + preload weren't enough on slow first paint | Gate the wordmark `--ready` class behind `document.fonts.load() + document.fonts.ready` in onMount; element starts `visibility: hidden` (v1.24.39 rebuild) |
| 2026-04-08 | "Proudly Canadian" maple badge appears then disappears forever | `button.yc-maple-badge--motion-pending` (specificity 0,1,1) overrode `.yc-maple-badge--hero` (0,1,0) and replaced its `yc-hero-fade-up` animation with `yc-maple-pulse`, which only animates `box-shadow` — opacity stayed at 0 | Comma-chain both animations on the pending state so fade-up still runs before pulse begins (v1.24.38) |
| 2026-04-08 | Product card name labels clipped at bottom on iPhone | **CONFIRMED ROOT CAUSE:** Card has `overflow: hidden` + `aspect-ratio: 1/1` + `display: flex; justify-content: space-between`. Even after hiding the blurb (saved 50px) and bumping line-height (saved 3px), the body STILL clipped — meaning the body wasn't actually overflowing the card, but flex layout was anchoring it at a position the card's box couldn't accommodate. The texture SVG was a red herring (`position: absolute`, can't push). The user's own architectural instinct turned out to be correct: the only fix that worked was pulling the body OUT of flex flow entirely. | **`.yc-product-card-body { position: absolute; bottom: 0.85rem; left/right: 0.85rem }` on mobile only.** Decouples the body from flex math; pins it to explicit coordinates inside the card box. Badges (the lone remaining flex child, `min-height: 0` on mobile, almost always empty) collapses harmlessly. iOS Safari `perspective + backdrop-filter + absolute child` compositor risk is mitigated because `perspective: none` is already applied via `@media (hover: hover)` for touch devices. Multiple patches (blurb hide, line-height bump, label-to-top reorder, SVG resize, padding tweak) all failed first — it took 5 parallel agents and the user's persistence to converge on this. |

Append new entries here as the agent solves more bugs — gives future invocations a pattern library to recognize symptoms faster.
