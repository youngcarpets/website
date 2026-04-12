# TODO — Young Carpets Website

Last updated: 2026-04-12 (hero layout with label + tagline, Inter font, version badge, design tokens).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

---

## Live preview URL (bookmark this)

https://youngcarpets-website.pages.dev — stable production URL on Cloudflare Pages. Updates on `pnpm run deploy`.

## Where we landed (2026-04-12)

- **Dark mode is the working mode.** Body `#0b0b0d`, text `#e6e6e8`. Light mode toggle works but light-mode colors are not tuned — deferred.
- **Site-wide bg image.** Fixed full-viewport `object-fit: cover`, dark-mode filter, radial mask. Original 2400x1850 bg.jpg.
- **Glass nav bar.** Floating pill (12px inset, 16px radius), YOUNG brand on left, sun/moon theme toggle + hamburger on right. Menu links: Services, Gallery, About, Quote (anchors, no sections yet).
- **Square721 font** for YOUNG brand/wordmark only. Preloaded in `app.html`.
- **Inter Variable font** (`@fontsource-variable/inter`) for all body/UI text. Imported in `+layout.svelte`. Consistent across all platforms.
- **Hero layout:**
  - "COMMERCIAL FLOORING" label above wordmark (Inter weight 200, fades down, 200ms delay)
  - YOUNG wordmark with per-letter bounce (Square721, 1000ms duration, 120ms stagger)
  - Tagline below: "Young Carpets Inc. — commercial flooring in Ottawa since 1991..." (Inter weight 200, fades up, 1500ms delay)
- **Version badge.** Purple pill, top center, reads from `package.json` via `$app/environment`. Bump patch on every deploy.
- **Cache-busting `_headers`** at project root — `no-cache` on all routes. **Remove before production launch.**
- **Design tokens in CLAUDE.md:** border radius (16px large / 8px small), glass effect, hover glow, body font.
- **Deploy flow:** `pnpm run deploy` after every visual change. Version bump before each deploy.
- **Global `~/.claude/CLAUDE.md`** created with interaction preferences. Project CLAUDE.md has output formatting rules.
- **Memory cleaned up.** Feedback memories moved to global CLAUDE.md. 8 project-specific memories remain.
- **0 errors, 0 warnings** on `pnpm check` + `pnpm lint`.

## Resume here next session

1. **Continue adding components one at a time.** Dark mode first, light mode at the end. Primary test device: iPhone portrait.
2. **Next component TBD.** User decides at session start.
3. **"Young Carpets Inc." branding decision:** legal name goes in the hero tagline and footer/contact/billing. Not in nav or logo. Watermark-on-bg-image approach was tried and abandoned — positioning didn't work across viewport sizes.
4. **bg-original.jpg** is backed up in `src/lib/assets/hero/` — can restore if needed.

## Site content (building out)

- [x] Site-wide bg image (dark-mode filtered floor plan)
- [x] Glass nav bar (floating pill, hamburger menu)
- [x] Theme toggle (sun/moon, functional)
- [x] Square721 font (embedded, preloaded) — brand/wordmark only
- [x] Inter Variable font (embedded) — body/UI text
- [x] YOUNG wordmark with bounce-in animation
- [x] Hero label: "COMMERCIAL FLOORING" with fade-in
- [x] Hero tagline with "Young Carpets Inc." and fade-in
- [x] Version badge (purple pill, top center)
- [x] Cache-busting headers for dev
- [ ] Header nav links wired to real sections
- [ ] Footer with real content (legal name, address, contact)
- [ ] `(marketing)/services/+page.svelte` index
- [ ] `(marketing)/services/[slug]/+page.svelte` (dynamic via `src/lib/content/services.ts`)
- [ ] `(marketing)/gallery/+page.svelte` (before/after, informative alt text)
- [ ] `(marketing)/about/+page.svelte`
- [ ] `quote/+page.svelte` + `quote/+page.server.ts` (form action, Zod, honeypot, rate limit, Resend)
- [ ] Favicon
- [ ] JSON-LD `LocalBusiness` on home page
- [ ] Light mode color tuning (deferred to end)

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

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload https://youngcarpets-website.pages.dev.
