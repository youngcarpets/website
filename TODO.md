# TODO — Young Carpets Website

Last updated: 2026-04-11 (mobile session, branch `claude/mobile-todo-access-zZA4B`).

This file is the durable cross-session to-do list. Claude Code's in-session `TodoWrite` tool does **not** persist across sessions or machines — this file does. Edit it, commit it, push it. Both Claude and you read it at session start.

---

## Next Up (do this first)

- [ ] **Plan the ay3 archive port.** Source: `C:\dev\youngcarpets\_archive\ay3\`. Must be done on the **laptop** — this path is not reachable from remote/mobile sandboxes.
  - [ ] Start with **Apple design resources** (locate them in the ay3 tree, list the files).
  - [ ] Identify **domain content** to port: products, Ontario accounting, any brand/design material.
  - [ ] Decide final destinations:
    - Design + domain reference → `.claude/reference/`
    - Flooring product knowledge → `.claude/resources/products/`
  - [ ] Produce a written port plan (what to bring, what to rename, what to skip) before copying anything.
  - [ ] **Do not port** ay3's Claude-protocol files (`agents/`, `commands/`, `rules/`, `settings/`). Those are stale and superseded by this project's `CLAUDE.md` + `.claude/` setup.

## Project Scaffolding (not started)

The Claude harness is complete, but the SvelteKit project itself is still a skeleton. When ready, scaffold in this order:

- [ ] `package.json` + `pnpm-lock.yaml` with pinned versions from `.claude/research/2026-04-11-expert-setup-findings.md` §5
- [ ] `svelte.config.js`, `vite.config.ts`, `tsconfig.json` (extends `./.svelte-kit/tsconfig.json`)
- [ ] `.gitignore`, `.gitattributes` (Windows LF rules)
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

## Done ✓

- [x] CLAUDE.md written with all protocols (Current Status, Commands, Tooling, Workflow, Architecture, Svelte 5, TS, Import Order, Naming, Error Handling, Code Generation, SEO, a11y, Motion, Project Context, Claude Harness)
- [x] Expert research file saved: `.claude/research/2026-04-11-expert-setup-findings.md`
- [x] Claude harness scaffolded:
  - [x] `.claude/settings.json` with permissions + PostToolUse hook
  - [x] `.claude/hooks/format-on-edit.sh` (prettier on edit, safe no-op until project exists)
  - [x] `.claude/commands/add-page.md`, `check-a11y.md`, `component-review.md`
  - [x] `.claude/agents/svelte-reviewer.md`, `a11y-checker.md`
  - [x] `.claude/reference/` and `.claude/resources/products/` placeholders

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`'s "Current Status — Read First" block.
- **End of a session:** update the checkboxes, move finished items to "Done", commit and push.
- **Switching devices:** `git pull origin <branch>` on the other device; this file travels with the repo.
- Keep the list short and current. Delete stale items — don't let it rot.
