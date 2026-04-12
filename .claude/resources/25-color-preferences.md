# 25 · Young Carpets Color Preference Tracker

> **Living document.** Every session that touches color on `/young-carpets` must append to the Decision Log and flip the Current Palette Status values as things get approved, rejected, or retested. Do NOT rewrite from scratch — append and edit in place.

**Last updated:** 2026-04-07 · v1.20.1 · commit `5618551`

---

## Established Rules (locked unless user says otherwise)

1. **Palette colours appear ONLY in glows, hovers, outlines, and glass-effect accents. NEVER as text fill.** Locked in v1.20.1 after gold-as-eyebrow-text was rejected: *"The yellow looks too off for this font. Maybe in glows but not for standard heading font."*
2. **Main page elements stay NEUTRAL** — text colours, backgrounds, card borders (default), body copy. Use `--yc-text`, `--yc-text-muted`, `--yc-text-faint`, and `rgba(255,255,255, 0.x)` for these.
3. **"Electric but not whitewashed"** — glows must feel saturated and rich, not too bright or blown-out. No pure white glows from the palette. User's exact phrasing: *"Think electric but no 'whiteness' to the brightness of the glow. Should be color. Not too bright."*
4. **3-layer parallax background is 🔒 LOCKED** — see `RELAY.md` LOCKED section. Nothing in this doc ever touches `.yc-bg-plan-layer-1/2/3`.
5. **No per-link colour variants on the nav at rest** — all pill hovers currently unified to gold (from v1.20.0). If this changes, update here.

---

## Current Palette Status

| Color | RGB triple | Status | Currently applied at | Rejected from |
|---|---|---|---|---|
| **Gold** | `212, 164, 74` | ✅ LIKED (glows only) | Nav pill hover border + glow, product card focus ring | ~~Section eyebrows~~ ~~Footer brand sub~~ ~~Footer column titles~~ ~~Stat numbers~~ ~~Text-hover accents~~ |
| **Gold Hot** | `232, 184, 90` | ✅ LIKED (glows only) | Nav pill inset rim highlight on hover | Same as Gold |
| **Orange** | `255, 122, 47` | 🧪 TESTING | Product card 4 (Hardwood) hover glow | — |
| **Red** | `229, 76, 60` | 🧪 TESTING | Product card 6 (Ceramic) hover glow | — |
| **Teal** | `46, 196, 182` | 🧪 TESTING | Product card 2 (Carpet Tile) hover glow | — |
| **Ocean** | `46, 138, 230` | 🧪 TESTING | Product card 3 (LVT) hover glow | — |
| **Green** | `60, 200, 110` | 🧪 TESTING | Product card 5 (Rubber) hover glow | — |

Tokens are defined as raw RGB triples in `+page.svelte` `:root` around lines 813–835 so alpha can vary per use-case.

---

## Decision Log (chronological, append-only)

| Date | Version | Commit | Change | User reaction |
|---|---|---|---|---|
| 2026-04-07 01:06 | v1.16.1 | `f1a35a9` | Unified all nav pill hover glows to cyan; dropped per-link colour variants (cyan/purple/amber/magenta) | ✅ LIKED — "I liked the What We Do pill look the best, make them all like that" |
| 2026-04-07 02:08 | v1.18.1 | `68e2cc1` | Defined new base palette: gold (primary), gold-hot, orange, red, teal, ocean, green. Applied gold to `--section-eyebrow` token only. | ✅ LIKED direction — "electric, but no whiteness to brightness; should be color, not too bright" |
| 2026-04-07 03:24 | v1.20.0 | `4db69ab` | Nav pill hover → gold (was white). Six product cards each get a different hover glow: Carpet=gold, Carpet Tile=teal, LVT=ocean, Hardwood=orange, Rubber=green, Ceramic=red. Cards also made more transparent. | 🧪 TESTING — awaiting user verdict on the 6-card glow test |
| 2026-04-07 03:28 | v1.20.1 | `5618551` | Reverted all gold TEXT fills back to neutral white: section eyebrows, hero tag, footer brand sub, footer column titles, stat numbers, link hover accents | ❌ DISLIKED as text — "The yellow looks too off for this font. Maybe in glows but not for standard heading font." |

---

## Live test in production right now (v1.20.1)

**Test rig:** Six product cards on the Products section each have a distinct hover glow colour. All other glow surfaces (nav pill hover, focus ring) are locked to gold.

| Card # | Product | Hover glow |
|---|---|---|
| 1 | Carpet | Gold |
| 2 | Carpet Tile | Teal |
| 3 | LVT | Ocean (blue) |
| 4 | Hardwood | Orange |
| 5 | Rubber | Green |
| 6 | Ceramic | Red |

**User task:** Hover/tap each card. For each colour, note:
- Does it feel aligned with the dark bg and the parallax plan underneath?
- Is it too bright, too dull, or just right?
- Would you want this colour as a site-wide primary, as a secondary accent, or drop it entirely?

**Report format (free-form, but minimum):**
- **KEEP:** list 1–3 colours
- **DROP:** list the rest
- **Intensity adjustments:** "gold felt too muted, push alpha to X" or "ocean felt too bright, pull back"

---

## Current Ranking (based on feedback so far)

> Rough ordering. Will sharpen once the 6-card test gets a verdict.

1. **🥇 Gold** — Explicitly approved for glows, currently the only colour in live use outside the test. Rejected as text but that's fine because the rule is glows only.
2. **🥈 Gold Hot** — Companion to gold, used as the brighter rim highlight. Paired with gold, untested standalone.
3. **UNRANKED 🧪** — Orange, Red, Teal, Ocean, Green — all currently in the 6-card test. User hasn't given preference on these yet.

Previously tried palettes (superseded, do NOT reintroduce without explicit user ask):
- ❌ Cyan / Purple / Amber / Magenta — the v1.15–v1.16 palette, replaced by gold+multi in v1.18.1
- ❌ Per-link nav pill variants — rejected in v1.16.1 in favor of uniform hover

---

## Proposed narrowing path

Small commit-sized steps. User acks or nacks each before moving to the next.

### Phase 1 — Pick winners from the 6-card test  *(WHERE WE ARE NOW)*
- User hovers the 6 test cards and reports KEEP / DROP
- Expected outcome: 1 primary + maybe 1–2 secondaries
- Deliverable: this file updated with new Status values

### Phase 2 — Unify + prune
- Commit that removes the per-card glow variants and applies the primary to all product cards uniformly
- If user picked secondaries, apply them somewhere specific (e.g. badges, modal CTAs, supplier carousel items)
- Delete the DROPPED palette tokens OR mark them `🗄 ARCHIVED` in this table

### Phase 3 — Brightness + saturation pass
- Tune the winning colours' alphas/RGB for perfect "electric but not bright"
- Test against the 3-layer parallax plan to ensure glows read cleanly over the bg
- Accessibility: confirm no colour-only affordances (everything still works in monochrome)

### Phase 4 — Final lock
- Add the final palette to `.claude/INDEX.md` Global Protected table with 🔒 LOVE tag
- Freeze `--accent-*` token values
- Update this document with ✅ FINAL status at top

---

## Open questions

1. **Which colours from the 6-card test do you want to keep?** (Phase 1 gate)
2. **Should the nav pill hover stay gold regardless of what the product cards become, or do they unify?**
3. **Do you want a secondary accent somewhere** (stats badges, supplier carousel, section underlines) **or should the site be monochromatic around one primary glow colour?**
4. **Stat numbers (`250+`, `50,000+`)** are currently plain white. Is that right, or do they want the primary glow as a subtle text-shadow bloom (which is technically a glow, not a text fill, so it's allowed by the rule)?

---

## How to update this file

1. **On every color-related commit**, append a row to the Decision Log with date, version, commit hash, change, and user reaction.
2. **When a colour's Status changes** (tested → liked, tested → rejected, etc.), update the Current Palette Status table in place.
3. **When the Ranking changes**, re-sort the Current Ranking section.
4. **Phase completed?** Mark it done in the Proposed Narrowing Path and move the "WHERE WE ARE NOW" marker to the next phase.
5. **Bump the "Last updated" line** at the top with new date/version/commit.
6. **Don't rewrite the file from scratch** — history matters, append don't replace.
