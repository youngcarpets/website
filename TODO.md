# TODO — Young Carpets Website

Last updated: 2026-04-11 (laptop session — reversed the ay3-to-GitHub plan).

This file is the durable cross-session to-do list. Claude Code's in-session `TodoWrite` tool does **not** persist across sessions or machines — this file does. Edit it, commit it, push it. Both Claude and you read it at session start.

Working branch: `claude/review-todo-list-CfdHE`. All pushes fast-forward into `main` on GitHub (`youngcarpets/website`).

---

## Decisions locked in this session (2026-04-11)

- **ay3 archive stays local-only.** The folder lives at `_archive/ay3/` on this laptop (215 MB, full tree, nested `.git` intact so it's still its own functional git repo). It is **gitignored** by the outer website repo via root `.gitignore` containing `_archive/`. It does **not** go to GitHub. Reason: 215 MB in git history forever would bloat every future clone of the website repo, and the archive is reference-only — when we need something from it, we port/copy deliberately rather than carry the whole thing.
- **Implication for other devices.** On the work computer or any fresh clone, `_archive/` will not exist. If reference material is needed there, either re-copy ay3 from its canonical location or port specific pieces into the website repo proper.
- **Push target.** Everything under `website/` goes to `main` on GitHub. No long-lived feature branches for solo work.

## Next Up

- [ ] **Plan the ay3 archive port.** Source: local `_archive/ay3/` on this laptop.
  - [ ] Start with **Apple/design resources** — locate them in the ay3 tree, list the files.
  - [ ] Identify **domain content** to port: products, Ontario accounting, any brand/design material.
  - [ ] **v7 reference** — `_archive/ay3/my-portal/src/routes/young-carpets/dev/v7/+page.svelte` is the visual target. Also relevant: sibling `v1–v12` folders and shared components under `_archive/ay3/my-portal/src/routes/young-carpets/components/`. These are reference snippets for animations and layout ideas, not code to import.
  - [ ] Decide final destinations:
    - Design + domain reference → `.claude/reference/`
    - Flooring product knowledge → `.claude/resources/products/`
  - [ ] Produce a written port plan (what to bring, what to rename, what to skip) before copying anything.
  - [ ] **Do not port** ay3's Claude-protocol files (`agents/`, `commands/`, `rules/`, `settings/`). Those are stale and superseded by this project's `CLAUDE.md` + `.claude/` setup.

## Project Scaffolding (not started)

The Claude harness is complete, but the SvelteKit project itself is still a skeleton. When ready, scaffold in this order:

- [ ] `package.json` + `pnpm-lock.yaml` with pinned versions from `.claude/research/2026-04-11-expert-setup-findings.md` §5
- [ ] `svelte.config.js`, `vite.config.ts`, `tsconfig.json` (extends `./.svelte-kit/tsconfig.json`)
- [ ] `.gitignore` expansion (currently only has `_archive/` — add Node/SvelteKit/OS entries at scaffold time), `.gitattributes` (Windows LF rules)
- [ ] `.prettierrc` (tabs, single quotes, no trailing comma, printWidth 100)
- [ ] `eslint.config.js` (flat config, recommended only)
- [ ] `lefthook.yml` (pre-commit: prettier + eslint, parallel — **never** svelte-check)
- [ ] `.github/workflows/ci.yml` (checkout → pnpm → node → install → check → lint → build)
- [ ] `src/app.d.ts` with `App.Error` shape
- [ ] `src/routes/+layout.svelte` (header, nav, main, footer, skip link, `afterNavigate` focus, View Transitions)
- [ ] `src/routes/+layout.ts` with `export const prerender = true`
- [ ] `src/routes/sitemap.xml/+server.ts`
- [ ] `static/robots.txt`

## Content / Routes (after scaffold)

- [ ] Home page `+page.svelte` with hero + `LocalBusiness` JSON-LD
- [ ] `(marketing)/services/+page.svelte` index
- [ ] `(marketing)/services/[slug]/+page.svelte` (dynamic via `src/lib/content/services.ts`)
- [ ] `(marketing)/gallery/+page.svelte` (before/after, informative alt text)
- [ ] `(marketing)/about/+page.svelte`
- [ ] `quote/+page.svelte` + `quote/+page.server.ts` (form action, Zod, honeypot, rate limit, Resend)

## Phase 2 (deferred — not started)

- [ ] Authenticated employee portal with a database. Deferred until Phase 1 marketing site ships.

## Done ✓

- [x] CLAUDE.md written with all protocols (Current Status, Commands, Tooling, Workflow, Architecture, Svelte 5, TS, Import Order, Naming, Error Handling, Code Generation, SEO, a11y, Motion, Project Context, Claude Harness)
- [x] Expert research file saved: `.claude/research/2026-04-11-expert-setup-findings.md`
- [x] Claude harness scaffolded:
  - [x] `.claude/settings.json` with permissions + PostToolUse hook
  - [x] `.claude/hooks/format-on-edit.sh` (prettier on edit, safe no-op until project exists)
  - [x] `.claude/commands/add-page.md`, `check-a11y.md`, `component-review.md`
  - [x] `.claude/agents/svelte-reviewer.md`, `a11y-checker.md`
  - [x] `.claude/reference/` and `.claude/resources/products/` placeholders
- [x] ay3 archive copied to `_archive/ay3/` on this laptop for local reference (2026-04-11)
- [x] Root `.gitignore` created with `_archive/` so the archive stays local-only
- [x] **Superseded:** "copy + commit + push ay3 to GitHub" plan from the mobile handoff. Briefly executed and immediately reverted via force-push back to `c172a31` after deciding the 215 MB would bloat history forever. Replaced by the local-only decision above.

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately — don't leave stale instructions at the top.
- **End of a session:** update checkboxes, move finished items to Done, commit and push.
- **Switching devices:** `git pull origin main` on the other device; this file travels with the repo.
- Keep the list short and current. Delete stale items — don't let it rot.
