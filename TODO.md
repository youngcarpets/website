# TODO — Young Carpets Website

Last updated: 2026-04-12 (past midnight — dark mode layout, glass nav, wordmark bounce all live).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

Working branch: `claude/review-todo-list-CfdHE`. All pushes fast-forward into `main` on GitHub (`youngcarpets/website`).

---

## Live preview URL (bookmark this)

https://youngcarpets-website.pages.dev — stable production URL on Cloudflare Pages. Updates whenever you run `pnpm run deploy` locally.

## Where we landed (2026-04-12)

- **Dark mode is the working mode.** Body `#0b0b0d`, text `#e6e6e8`. Light mode toggle works (sun/moon icons) but light-mode colors are not tuned — deferred to the very end.
- **Site-wide bg image.** Moved from hero-only to layout: `position: fixed`, full-viewport `object-fit: cover`, v7 dark-mode filter (`invert(0.92) hue-rotate(180deg) brightness(0.7) contrast(1.1) saturate(0.25)`), `opacity: 0.55`, radial mask fading edges to black. Matches v7 look.
- **Glass nav bar.** Floating pill (12px inset), `backdrop-filter: blur(24px) saturate(1.8)`, YOUNG brand (Square721 font) on left, sun/moon theme toggle + hamburger on right. Hamburger opens to: Services / Gallery / About / Quote (placeholder anchors, no sections yet).
- **Square721 font embedded.** `static/fonts/square721.ttf`, preloaded in `app.html`, `@font-face` with `font-display: block` so fallback never paints.
- **YOUNG wordmark bounce.** Home page `<h1>` with per-letter stagger animation (700ms, spring cubic-bezier 0.34/1.56/0.64/1, 80ms between letters). Gated on `document.fonts.load` so it only fires after Square721 is ready. `prefers-reduced-motion` respected.
- **Workflow decided: Option C** (lightweight). Error checking = `pnpm check` + `pnpm lint`. No plugin-enforced gates, no TDD. Agents (svelte-reviewer, a11y-checker, code-reviewer) run only on explicit request.
- **Removed:** "hello" placeholder text, copyright stub in footer.
- **0 errors, 0 warnings** on `pnpm check` + `pnpm lint`.

## Resume here next session

1. **Continue adding components one at a time.** Dark mode first, light mode at the end. User's preferred flow: get each component right visually before moving on. Primary test device: iPhone portrait.
2. **Wordmark position.** Currently centered in a 52vh hero. Don't tune further until page has more content — position will re-settle naturally.
3. **Next component TBD.** User has not specified — ask at session start.
4. **Real-ESRGAN still available if LANCZOS bg isn't sharp enough on phone.** Binary + models at `C:/Users/alany/tools/realesrgan/full/`. Blocker: `vulkan-1.dll` (install Vulkan Runtime from LunarG).

## Site content (building out)

- [x] Site-wide bg image (dark-mode filtered floor plan)
- [x] Glass nav bar (floating pill, hamburger menu)
- [x] Theme toggle (sun/moon, functional)
- [x] Square721 font (embedded, preloaded)
- [x] YOUNG wordmark with bounce-in animation
- [ ] Hero content below wordmark (tagline? CTA? TBD)
- [ ] Header nav links wired to real sections
- [ ] Footer with real content
- [ ] `(marketing)/services/+page.svelte` index
- [ ] `(marketing)/services/[slug]/+page.svelte` (dynamic via `src/lib/content/services.ts`)
- [ ] `(marketing)/gallery/+page.svelte` (before/after, informative alt text)
- [ ] `(marketing)/about/+page.svelte`
- [ ] `quote/+page.svelte` + `quote/+page.server.ts` (form action, Zod, honeypot, rate limit, Resend)
- [ ] Favicon
- [ ] Body font (variable WOFF2, self-hosted)
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
- [x] Memory feedback rules (stop-and-reassess, fetch-vendor-docs, recommend-one-path, links-no-markdown, code-fence-comparisons, error-check-scope)
- [x] Verified deploy loop speed (each `pnpm run deploy` < 1 min)
- [x] Dark mode layout live (bg filter + mask + opacity, glass nav, theme toggle, Square721 font, YOUNG wordmark bounce)
- [x] Workflow decided: Option C (lightweight, `pnpm check` + `pnpm lint` for error checking)

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload https://youngcarpets-website.pages.dev.
