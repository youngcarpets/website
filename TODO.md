# TODO — Young Carpets Website

Last updated: 2026-04-13 (Hero/About complete, BrandMark component extracted, v0.2.11).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

---

## Live preview URL (bookmark this)

https://youngcarpets-website.pages.dev — stable production URL on Cloudflare Pages. Updates on `pnpm run deploy`.

## Where we landed (2026-04-13)

- **Dark mode is the working mode.** Body `#0b0b0d`, text `#e6e6e8`. Grayscale only — no color accents until color phase at the end.
- **System font stack.** SF Pro Display (Apple), Segoe UI (Windows), system-ui fallback. Square721 for YOUNG wordmark only.
- **Global CSS foundation.** `src/app.css` with color tokens, glass/glow tokens, motion tokens, radius tokens, font tokens, CSS reset, light theme overrides, reduced-motion/transparency media queries.
- **Site-wide bg image.** Fixed full-viewport `object-fit: cover`, dark-mode filter, radial mask.
- **Glass effect.** `rgba(18, 18, 21, 0.18)` bg, `blur(8px) saturate(1.4)` — light enough to see background detail through.
- **BrandMark component.** `src/lib/components/BrandMark.svelte` — reusable for hero + footer. YOUNG wordmark (Square721, near-white, bounce-in in hero) + "COMMERCIAL FLOORING 🍁" SVG subtitle (textLength auto-scaling, font 24px/500, opacity 0.7). `bind:clientWidth` ensures SVG matches YOUNG width at any scale. Drop-shadow behind. Maple leaf at scale 0.0063.
- **Counter badges.** Three glass cards (35+ years / 50,000+ jobs / 250+ experience) with `countUp` action, IntersectionObserver trigger, `prefers-reduced-motion` respected. In Contact section.
- **Nav bar.** Glass pill, safe-area-inset support. Links: Products, Services, Suppliers, Contact.
- **Footer.** Semi-transparent, BrandMark at top, 3-col grid (address/contact/hours), responsive breakpoints.
- **Component architecture.** Repeated visual elements = one component, instances differ by props only. Tree diagram maps to component classes.
- **Favicon.** SVG with traced "YCI" glyph paths (1.2KB), PNG fallback, apple-touch-icon.
- **Meta.** Base OG tags in layout `<svelte:head>`. Page-level title/description in `+page.svelte`.
- **Accessibility.** `prefers-reduced-transparency` fallback. `prefers-reduced-motion` on all animations. Focus indicators. Skip link. `afterNavigate` focus management.
- **View Transitions.** `onNavigate` hook with `startViewTransition`.
- **Section anchors.** Placeholder sections for Products, Services, Suppliers, Contact.
- **0 errors, 0 warnings** on `pnpm check` + `pnpm lint` (as of v0.2.0).

## Resume here next session

**Follow the migration workflow:** `.claude/reference/migration-workflow.md`
**Layout structure reference:** `.claude/reference/site-layout-structure.md`

1. **Suppliers section — next up.** 18-brand logo marquee. Relatively simple — get it out of the way first.
2. **Then Products section.** Top badges + More Flooring + Accessories + Installation. Product badges will be "a little bit more opaque because they have drawings/icons on them."
3. **Then Services section.** 4 service cards.
4. **Then Contact/Map section.** Team, info, Google Maps embed. Counter badges already placed.
5. **Footer reconcile.** After all sections done.
6. **Design rules:** Gold `#d4b87a` only (no yellow), glass effect, glow, 16px radii, system font, motion respected.
7. **Grayscale rule still applies.** Color phase is last.
8. **Error checking on-demand.** User will ask for `pnpm check` + `pnpm lint` when needed.

## Site content (building out)

- [x] Site-wide bg image (dark-mode filtered floor plan)
- [x] Glass nav bar (floating pill, hamburger menu, safe-area aware)
- [x] Theme toggle (sun/moon, functional)
- [x] Square721 font (embedded, preloaded) — brand/wordmark only
- [x] System font stack (SF Pro Display / Segoe UI / system-ui) — body/UI text
- [x] YOUNG wordmark with bounce-in animation (near-white, drop-shadow)
- [x] Hero subtitle: "COMMERCIAL FLOORING 🍁" (SVG textLength, 24px/500, auto-scales)
- [x] BrandMark.svelte component (hero + footer, bind:clientWidth for sizing)
- [x] Version badge (purple pill, top center — dev component)
- [x] Cache-busting headers for dev
- [x] Favicon (SVG traced paths + PNG + apple-touch-icon)
- [x] Footer (semi-transparent, BrandMark at top, 3-col grid, responsive)
- [x] Global CSS foundation (app.css — tokens, reset, media queries)
- [x] Section anchors (Products, Services, Suppliers, Contact)
- [x] Nav links updated (Products, Services, Suppliers, Contact)
- [x] Base meta defaults in layout `<svelte:head>`
- [x] Counter badges (35+ / 50,000+ / 250+) — placed in Contact section
- [x] countUp action with IntersectionObserver
- [x] Maple leaf SVG (currentColor, scale 0.0063)
- [ ] Section: Suppliers (18-brand logo marquee) ← NEXT
- [ ] Section: Products (top badges + More Flooring + Accessories + Installation)
- [ ] Section: Services (4 cards)
- [ ] Section: Contact/Map (team, info, Google Maps, counter badges already placed)
- [ ] Section: Footer (reconcile with final content)
- [ ] Header nav links wired to real sections
- [ ] `<svelte:head>` per-page meta (title, description, og)
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
- [x] Hero layout: YOUNG wordmark + COMMERCIAL FLOORING 🍁 SVG subtitle
- [x] System font stack for body/UI text (replaced Inter Variable)
- [x] Version badge for cache verification
- [x] Design tokens documented in CLAUDE.md
- [x] Deploy flow documented in CLAUDE.md
- [x] Output formatting rules in project CLAUDE.md (syncs via git)
- [x] Global `~/.claude/CLAUDE.md` with interaction preferences
- [x] Favicon: SVG traced paths (1.2KB), PNG 32x32, apple-touch-icon 180x180
- [x] Footer: semi-transparent, BrandMark component at top, 3-col grid, responsive breakpoints
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
- [x] Phase 0: Global foundation (app.css tokens, reset, media queries, section anchors, nav links, meta defaults)
- [x] Counter badges with countUp action (moved to Contact section)
- [x] Glass transparency tuned (0.18 opacity, 8px blur for badges/nav)
- [x] Footer transparency added (0.7 opacity, 12px blur)
- [x] SVG textLength technique for subtitle auto-scaling across orientations
- [x] BrandMark.svelte extracted — reusable component, hero + footer instances
- [x] bind:clientWidth technique for SVG-to-text width matching
- [x] Footer restructured: BrandMark above grid, 3-col grid below
- [x] Hero/About section complete (v0.2.11)

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload https://youngcarpets-website.pages.dev.
