# TODO — Young Carpets Website

Last updated: 2026-04-11 (late evening — scaffold + Cloudflare Pages live).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

Working branch: `claude/review-todo-list-CfdHE`. All pushes fast-forward into `main` on GitHub (`youngcarpets/website`).

---

## Live preview URL (bookmark this)

**https://youngcarpets-website.pages.dev** — stable production URL on Cloudflare Pages. Never changes. Updates whenever you run `pnpm run deploy` locally. Use this on any device (phone, work computer, anywhere).

## Where we landed tonight (2026-04-11)

- **Scaffold complete and deployed.** SvelteKit 2.57 + Svelte 5.55 + TypeScript strict + all tooling. Verified with `pnpm check` (0 errors), `pnpm lint` (clean), `pnpm build`, `pnpm run deploy` (live at the URL above).
- **Home page** (`src/routes/+page.svelte`) currently shows just `<h1>hello</h1>` in a minimal hero section. Intentionally blank — **the background image is tomorrow's first task.**
- **Cloudflare Pages project:** `youngcarpets-website`, created via `wrangler pages project create` from the CLI. Dashboard-level config done: `nodejs_compat` flag enabled via `wrangler.toml`. Uses local wrangler deploys (not GitHub auto-deploys — we hit a cascade of auth issues with Cloudflare's new Workers-first UI and switched to CLI deploys, which work cleanly).
- **Deploy command:** `pnpm run deploy` — runs `pnpm build` + `wrangler pages deploy --branch=main --commit-dirty=true`. One command, one minute, URL updates.
- **Claude Code permissions:** `.claude/settings.json` now has `defaultMode: "bypassPermissions"`. Takes effect in the NEXT Claude Code session — current session will keep prompting until you restart.
- **Installed Claude plugins (project scope):** `feature-dev@claude-plugins-official`, `frontend-design@claude-plugins-official`.
- **forClaude/ folder** (untracked, local only): contains `bg.jpg` (101 KB) and `Grok Image 2026-04-11 at 19.20.20.png` (the Grok-generated background you may use). Your call whether to commit these later.

## Resume here next session

1. **Pick the hero background image.** The Grok PNG in `forClaude/` is a candidate ("probably the right size"). Decide whether to use it or generate/find a different one.
2. **Wire it in** using `@sveltejs/enhanced-img` (already installed). Target: `src/lib/assets/hero/` → imported into `src/routes/+page.svelte` as a full-bleed positioned `<enhanced:img>` under centered hero text. Prior attempt (later reverted) can be reconstructed from git — `pnpm run deploy`, reload `youngcarpets-website.pages.dev` on phone, iterate.
3. **Hero text:** decide what replaces "hello". Brand name? Tagline? Nothing (image only)?
4. **Typography + fonts:** still untouched. When background lands, need to decide on a self-hosted WOFF2 font (per CLAUDE.md: one variable WOFF2, `font-display: swap`, preload critical weight, no Google Fonts).

## Next Up (after hero background)

- [ ] **Plan the ay3 archive port.** Source: local `_archive/ay3/` on this laptop (gitignored, never pushed). Candidates:
  - Apple/design resources in ay3 tree
  - v7 reference at `_archive/ay3/my-portal/src/routes/young-carpets/dev/v7/+page.svelte` and sibling `v1–v12`
  - Flooring product knowledge → `.claude/resources/products/`
  - Written port plan before copying anything.

## Site content (after scaffold — not started)

- [ ] Real home page hero (background chosen, text decided, CTAs, JSON-LD `LocalBusiness`)
- [ ] Header nav with real links (currently stub: just the brand link)
- [ ] Footer with real content (currently stub: just copyright)
- [ ] `(marketing)/services/+page.svelte` index
- [ ] `(marketing)/services/[slug]/+page.svelte` (dynamic via `src/lib/content/services.ts`)
- [ ] `(marketing)/gallery/+page.svelte` (before/after, informative alt text)
- [ ] `(marketing)/about/+page.svelte`
- [ ] `quote/+page.svelte` + `quote/+page.server.ts` (form action, Zod, honeypot, rate limit, Resend)
- [ ] Favicon (currently removed from `app.html` — add a real one with the hero work)
- [ ] Real self-hosted font

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
- [x] `defaultMode: bypassPermissions` set in `.claude/settings.json` (active next session)
- [x] Three new memory feedback rules added: stop-and-reassess-after-second-fix-fails, fetch-vendor-docs-first, recommend-one-path
- [x] **Hello page live on production URL and verified working**

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload `https://youngcarpets-website.pages.dev`.
