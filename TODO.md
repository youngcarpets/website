# TODO — Young Carpets Website

Last updated: 2026-04-11 (mobile session handoff to laptop, branch `claude/review-todo-list-CfdHE`).

This file is the durable cross-session to-do list. Claude Code's in-session `TodoWrite` tool does **not** persist across sessions or machines — this file does. Edit it, commit it, push it. Both Claude and you read it at session start.

---

## Handoff from mobile session (2026-04-11)

**What happened:** Tried to give Claude Code access to `ay3` from mobile. Confirmed blocked at two layers:

1. **claude.ai/code per-project allowlist** — the `website` project is hard-wired to `youngcarpets/website`. No UI to edit this from mobile web.
2. **GitHub App install scope** — the Claude GitHub App on the `onerrorgotowtf` personal account has only `onErrorGoToWTF/ay3` selected. The `youngcarpets/website` repo is in the **YCI** org, a different account entirely.

**Cross-account means** getting Claude to read ay3 over GitHub requires: Claude GitHub App installed on BOTH accounts, repo access granted in BOTH, AND the claude.ai/code project allowlist edited. Too many moving parts for a mobile session. **Abandoned.**

**Chosen shortcut:** dump the entire ay3 archive into `_archive/ay3/` inside the website repo. Then Claude reads it like any other file. Not clean, not final — it's a staging area for the real port.

**Status:** user moving to laptop to do the copy manually. Mobile chat is done.

## First task on laptop (do this before anything else)

- [ ] **Copy ay3 into the website repo.** Destination: `<website-repo>\_archive\ay3\`. Method: Explorer copy/paste is fine, or `xcopy "<ay3-source>" "_archive\ay3" /E /I /H` (paths must be quoted on Windows).
- [ ] **Delete `_archive\ay3\.git`** if it exists — don't commit a nested git dir.
- [ ] **Commit + push** to branch `claude/review-todo-list-CfdHE`:
  ```
  git add _archive/ay3
  git commit -m "Dump ay3 archive into _archive/ay3 for porting"
  git push -u origin claude/review-todo-list-CfdHE
  ```
- [ ] **Tell Claude on laptop: "ay3 is in _archive/ay3, go."** Claude then reads the tree and proceeds with the port plan.

### Unknowns to tell Claude at laptop session start
- Exact path of the website repo on the C: drive (assumed `C:\dev\youngcarpets\website` — verify).
- Exact path of the ay3 source on the C: drive (assumed `C:\dev\youngcarpets\_archive\ay3` — verify).
- Whether `YCI/ay3` exists on GitHub (unclear from mobile chat — probably not, ay3 lives only at `onErrorGoToWTF/ay3` and/or local disk).

## Blocker — proper fix (deferred, not urgent)

- [ ] **Long-term: fix cross-account repo access for Claude Code.** Once the shortcut works, decide whether to (a) install Claude GitHub App on YCI org and grant it `ay3` access after moving/forking ay3 there, or (b) leave the archive in `_archive/ay3/` permanently. Only do this if the shortcut proves painful.

## Next Up (after the blocker is cleared)

- [ ] **Plan the ay3 archive port.** Source: either the GitHub repo (preferred) or the local archive at `C:\dev\youngcarpets\_archive\ay3\`.
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
