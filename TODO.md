# TODO — Young Carpets Website

Last updated: 2026-04-12 (footer complete, agents ported, design standards established).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

---

## Live preview URL (bookmark this)

https://youngcarpets-website.pages.dev — stable production URL on Cloudflare Pages. Updates on `pnpm run deploy`.

## Where we landed (2026-04-12)

- **Dark mode is the working mode.** Body `#0b0b0d`, text `#e6e6e8`. Grayscale only — no color accents until color phase at the end.
- **Site-wide bg image.** Fixed full-viewport `object-fit: cover`, dark-mode filter, radial mask. The charcoal warmth of the background shows through transparent elements.
- **Glass nav bar.** Floating pill with safe-area-inset support (Dynamic Island, landscape). Hover styles gated behind `@media (hover: hover)` to prevent sticky hover on iOS.
- **Footer.** Static 4-column grid: YOUNG brand | address | contact (phone, email, AP) | hours (office only). No headings/badges, no clickable links, plain selectable text. Responsive: 2-col at 960px, 1-col at 520px with centered brand.
- **Favicon.** SVG with traced "YCI" glyph paths (1.2KB), PNG fallback, apple-touch-icon.
- **Fonts.** Inter Variable (body), Square721 (brand/wordmark only).
- **Safari.** `format-detection` meta prevents auto-linking phone/email/address. `viewport-fit=cover` enables safe-area env vars.
- **Accessibility.** `prefers-reduced-transparency` fallback on glass nav. `prefers-reduced-motion` on all animations. Focus indicators on all interactive elements. Footer text passes WCAG 4.5:1 contrast.
- **Agent library.** 20 agents ported from ay3 + 2 new (ay3-expert, motion-expert). Master INDEX.md. Design standards at `.claude/reference/design-standards.md`.
- **Design standards.** Grayscale only, no color porting from ay3, 8px/16px radii (no 9999px pills), shared base classes for similar components, dev components exempt from design review.
- **0 errors, 0 warnings** on `pnpm check` + `pnpm lint`.

## Resume here next session

**Follow the migration workflow:** `.claude/reference/migration-workflow.md`
**Layout structure reference:** `.claude/reference/site-layout-structure.md`

1. **Phase 0: Global Foundation.** Color system, glass/glow tokens, motion tokens, breakpoints, CSS reset, landmarks, View Transitions, meta defaults. Must be solid before any section work.
2. **Phase 1: Sections top-to-bottom.** Hero/About → Products → Services → Suppliers → Contact/Map → Footer. Pull from ay3, rewrite to Svelte 5 runes, adapt to new design system, expert review each.
3. **Design rules:** Gold `#d4b87a` only (no yellow), glass effect, glow, 16px radii, Inter Variable, motion respected.
4. **Grayscale rule still applies.** Color phase is last.
5. **Error checking on-demand.** User will ask for `pnpm check` + `pnpm lint` when needed.

## Site content (building out)

- [x] Site-wide bg image (dark-mode filtered floor plan)
- [x] Glass nav bar (floating pill, hamburger menu, safe-area aware)
- [x] Theme toggle (sun/moon, functional)
- [x] Square721 font (embedded, preloaded) — brand/wordmark only
- [x] Inter Variable font (embedded) — body/UI text
- [x] YOUNG wordmark with bounce-in animation
- [x] Hero label: "COMMERCIAL FLOORING" with fade-in
- [x] Hero tagline with "Young Carpets Inc." and fade-in
- [x] Version badge (purple pill, top center — dev component)
- [x] Cache-busting headers for dev
- [x] Favicon (SVG traced paths + PNG + apple-touch-icon)
- [x] Footer (static 4-col grid, grayscale, plain text, responsive)
- [ ] Phase 0: Global foundation (tokens, reset, landmarks, transitions, meta)
- [ ] Section: Hero/About (wordmark, label, tagline, "Since 1991", counters)
- [ ] Section: Products (top badges + More Flooring + Accessories + Installation)
- [ ] Section: Services (4 cards)
- [ ] Section: Suppliers (18-brand marquee)
- [ ] Section: Contact/Map (team, info, Google Maps)
- [ ] Section: Footer (reconcile with final content)
- [ ] Header nav links wired to real sections
- [ ] `<svelte:head>` base meta defaults (title, description, og)
- [ ] JSON-LD `LocalBusiness` on home page
- [ ] View transition CSS (selectors exist in JS, no CSS yet)
- [ ] Color phase — accents, glows, highlights (after all dark mode layout is done)
- [ ] Light mode color tuning (after color phase)

## Phase 2 (deferred — not started)

- [ ] Authenticated employee portal with a database. Deferred until Phase 1 marketing site ships.

## Done ✓

- [x] CLAUDE.md with all protocols, TODO.md durable cross-session list
- [x] `.claude/` harness scaffolded (settings.json, hooks, commands, agents, research dirs)
- [x] Expert research file: `.claude/research/2026-04-11-expert-setup-findings.md`
- [x] Workflow cycle research: `.claude/research/2026-04-11-workflow-cycle-research.md`
- [x] Pre-flight install audit: `.claude/research/2026-04-11-preflight-install-audit.md`
- [x] ay3 archive copied to `_archive/ay3/` (local only, gitignored)
- [x] Git identity: `OnError <alanyoungjr@gmail.com>`, longpaths=true, autocrlf=input
- [x] Windows Defender exclusion on project folder
- [x] pnpm 10.33.0 via Corepack
- [x] Claude Code plugins (project scope): `feature-dev`, `frontend-design`
- [x] SvelteKit project scaffolded with pinned deps, all configs, source shell, CI, pre-push hook, lefthook pre-commit hook
- [x] Cloudflare Pages project `youngcarpets-website` created and deployed
- [x] `pnpm run deploy` script added — one-command build + deploy
- [x] `wrangler.toml` at project root (nodejs_compat flag, pages_build_output_dir)
- [x] `defaultMode: bypassPermissions` set in `.claude/settings.json`
- [x] Memory feedback rules migrated to global `~/.claude/CLAUDE.md`
- [x] Verified deploy loop speed (each `pnpm run deploy` < 15 sec)
- [x] Dark mode layout live (bg filter + mask + opacity, glass nav, theme toggle, Square721 font, YOUNG wordmark bounce)
- [x] Workflow decided: Option C (lightweight, `pnpm check` + `pnpm lint` for error checking)
- [x] Hero layout: label + wordmark + tagline with staggered animations
- [x] Inter Variable font embedded for body/UI text
- [x] Version badge for cache verification
- [x] Design tokens documented in CLAUDE.md
- [x] Deploy flow documented in CLAUDE.md
- [x] Output formatting rules in project CLAUDE.md (syncs via git)
- [x] Global `~/.claude/CLAUDE.md` with interaction preferences
- [x] Favicon: SVG traced paths (1.2KB), PNG 32x32, apple-touch-icon 180x180
- [x] Footer: static 4-col grid, plain text, grayscale, responsive breakpoints
- [x] 20 agents ported from ay3 + ay3-expert + motion-expert created
- [x] Master INDEX.md for all agents/resources/references
- [x] Design standards: `.claude/reference/design-standards.md`
- [x] Safe-area-inset support (Dynamic Island, landscape, footer)
- [x] Hover styles gated behind `@media (hover: hover)`
- [x] `prefers-reduced-transparency` fallback on glass nav
- [x] `format-detection` meta prevents Safari auto-linking
- [x] `viewport-fit=cover` for safe-area env vars
- [x] All gold/yellow accents removed — grayscale only
- [x] 5 expert reviews completed (svelte, a11y, design, mobile, performance)
- [x] 7 expert-reported errors fixed

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload https://youngcarpets-website.pages.dev.
