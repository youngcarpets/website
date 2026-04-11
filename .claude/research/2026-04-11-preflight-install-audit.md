# Pre-flight Install Audit — 2026-04-11

Compiled during the laptop session on 2026-04-11. **Compile only — no installs performed.** Run through this with the user before starting the website build. Each item has: current state, desired state, action needed, priority.

Priority key: 🔴 must-fix before any build work · 🟡 recommended · 🟢 nice-to-have · ⚪ decision-gated (user picks first)

---

## 1. Machine-level toolchain

| Item | Current | Desired | Action | Priority |
|---|---|---|---|---|
| **Node.js** | v24.14.1 ✓ | 20+ LTS | None | — |
| **Git** | 2.53.0.windows.2 ✓ | 2.40+ | None | — |
| **Corepack** | 0.34.6 ✓ available | enabled | `corepack enable` (one-time, may need admin) | 🔴 |
| **pnpm** | **NOT INSTALLED** | latest stable (pinned via `packageManager` in `package.json` after scaffold) | `corepack prepare pnpm@latest --activate` *(preferred, uses corepack)* OR `npm i -g pnpm` | 🔴 |
| **PowerShell** | ✓ works | — | None | — |
| **Git `core.longpaths`** | **NOT SET** (needed for pnpm nested store >260 chars on Windows) | `true` | `git config --global core.longpaths true` | 🔴 |
| **Git `core.autocrlf`** | **NOT SET** | `input` | `git config --global core.autocrlf input` | 🔴 |
| **Git `user.name`** | `Windsurf` *(placeholder from editor, not Alan)* | Alan's real name | `git config --global user.name "<real name>"` — or leave if intentional for bot-scoped commits | 🟡 **FLAG: review** |
| **Git `user.email`** | `windsurf@example.com` *(placeholder)* | Alan's real email | `git config --global user.email "<real email>"` — or leave if intentional | 🟡 **FLAG: review** |
| **Windows Defender exclusion** | unknown (not checked) | exclusion for `C:\dev\youngcarpets\website` (Vite HMR performance) | PowerShell admin: `Add-MpPreference -ExclusionPath "C:\dev\youngcarpets\website"` | 🟡 |
| **`.gitattributes`** (global or per-repo) | not verified | per-repo `.gitattributes` with `* text=auto eol=lf` | Create `.gitattributes` at project root when scaffolding | 🟡 (part of scaffold step) |

---

## 2. Editors + editor extensions

Machine has installed: **Zed**, **VS Code**, **Windsurf**. No Cursor.

| Editor | Current | Needed extensions | Action | Priority |
|---|---|---|---|---|
| **Zed** | installed at `~/AppData/Local/Programs/Zed/` | Svelte extension (auto-prompts on open) | Open project in Zed — accept Svelte extension install prompt. Check `.zed/settings.json` for project-level config. | 🟢 (if Zed is primary) |
| **VS Code** | installed, configured as `core.editor` for git | `svelte.svelte-vscode`, `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode` | Install via VS Code Marketplace. Commit `.vscode/extensions.json` with these recommendations so other machines auto-prompt. | 🟡 (if VS Code is primary) |
| **Windsurf** | installed, bin at `~/AppData/Local/Programs/Windsurf/bin/` | Same as VS Code (Windsurf is a VS Code fork) | Same approach — install Svelte, ESLint, Prettier extensions. | 🟢 |

**FLAG: which editor is primary?** The `.vscode/extensions.json` file should be committed so any new clone of the repo auto-prompts for the right extensions. ay3 had `.zed/settings.json` — the website project has neither yet.

---

## 3. Claude Code plugins

**Current state at website project scope:** no plugins installed.
**Installed at ay3 project scope (not transferable automatically):** `superpowers@5.0.7`, `frontend-design@claude-plugins-official`.

Workflow research (`2026-04-11-workflow-cycle-research.md`) surveyed the official marketplace. Decisions are **⚪ decision-gated** — they depend on which workflow path (A/B/C) the user picks.

| Plugin | Official? | Purpose | Recommendation | Priority |
|---|---|---|---|---|
| **superpowers** | ✓ official | Brainstorm → plan → TDD → review. Strong phase gating. Only plugin that enforces feature → verify → advance. | **Install if user picks Path A** (strict discipline) | ⚪ |
| **frontend-design** | ✓ official | Design judgment for frontend work (typography, motion, spatial composition). Auto-activates on frontend tasks. | **Install regardless of path** — low-risk, marketing site benefits from visual intent | 🟡 |
| **feature-dev** | ✓ official | Guided 7-phase workflow with 3 agents. Sequential but skippable. | **Install if user picks Path B** (guided but flexible) | ⚪ |
| **code-review** | ✓ official | 5 parallel agents post-hoc review (compliance, bugs, git history, PR history, comments). | Optional — install just-in-time when we run our first review | 🟢 |
| **pr-review-toolkit** | ✓ official | Narrower post-hoc review (comments, tests, error handling, types). | Skip — overlaps with code-review | — |
| **commit-commands** | ✓ official | Automated git commit/push/PR in one step. | Skip — user prefers explicit git control | — |
| **pro-workflow** (community) | ✗ | LLM gates + multi-phase validation. | Skip — superpowers is the official equivalent | — |
| **claude-code-workflows** (community) | ✗ | Quality-fixer before commit. | Skip — we'll roll our own `/pre-commit` skill | — |

**Decision needed (blocks install):** Path A (superpowers + frontend-design), Path B (feature-dev + frontend-design), or Path C (no plugins, hand-rolled via TaskCreate + custom SessionStart hook + custom skills).

---

## 4. Claude Code harness (website project `.claude/`)

| Item | Current | Desired | Action | Priority |
|---|---|---|---|---|
| `.claude/settings.json` | ✓ permissions + PostToolUse prettier hook | + pre-push gate hook, + SessionStart hook (for the session-start TODO flow) | Add hooks after path decision | ⚪ |
| `.claude/settings.local.json` | ✓ exists with some extra perms | gitignored already | None | — |
| `.claude/hooks/format-on-edit.sh` | ✓ | — | None | — |
| `.claude/hooks/pre-push-check.sh` | ❌ missing | runs `pnpm check` + `pnpm lint` before `git push` | Create when scaffold is up | 🟡 |
| `.claude/hooks/session-start.sh` | ❌ missing | prints branch + pending tasks at session open | Create after path decision | ⚪ |
| `.claude/commands/` | ✓ add-page, check-a11y, component-review | + `/error-check`, `/pre-commit`, `/refactor`, `/perf-audit` | Create after path decision (or skip if plugins cover this) | ⚪ |
| `.claude/agents/` | ✓ svelte-reviewer, a11y-checker | + error-check, refactor, perf-audit | Create after path decision | ⚪ |
| `.claude/research/2026-04-11-expert-setup-findings.md` | ✓ | — | None | — |
| `.claude/research/2026-04-11-workflow-cycle-research.md` | ✓ | — | None | — |
| `.claude/research/2026-04-11-preflight-install-audit.md` | ✓ **(this file)** | — | None | — |

---

## 5. Project scaffold (website repo root)

None of the SvelteKit project files exist yet. This is expected — the scaffold runs with `pnpm create svelte@latest` (once pnpm is installed) and is then customized per the expert research file.

| File / directory | Current | Desired | Priority |
|---|---|---|---|
| `package.json` + `pnpm-lock.yaml` | ❌ | Pinned versions from expert research §5 | 🔴 (after pnpm install) |
| `svelte.config.js` | ❌ | `@sveltejs/adapter-cloudflare` | 🔴 |
| `vite.config.ts` | ❌ | `enhanced-img` plugin + tailwind if used | 🔴 |
| `tsconfig.json` | ❌ | extends `.svelte-kit/tsconfig.json` + strict + noUncheckedIndexedAccess | 🔴 |
| `.prettierrc` | ❌ | tabs, single quotes, no trailing comma, printWidth 100, svelte plugin | 🔴 |
| `eslint.config.js` | ❌ | flat config — js.recommended + tseslint.recommended + svelte/flat/recommended + svelte/flat/prettier | 🔴 |
| `lefthook.yml` | ❌ | prettier --write + eslint on staged files, parallel | 🔴 |
| `.github/workflows/ci.yml` | ❌ | checkout → pnpm → node → install → check → lint → build | 🟡 (push target) |
| `.gitignore` expansion | ✓ `_archive/` only | + `node_modules`, `.svelte-kit`, `.env*`, `Thumbs.db`, `.vscode/*` etc. | 🔴 (at scaffold time) |
| `.gitattributes` | ❌ | `* text=auto eol=lf` + binary rules | 🔴 |
| `src/app.html` | ❌ | with `lang="en"` | 🔴 |
| `src/app.d.ts` | ❌ | `App.Error` interface | 🔴 |
| `src/routes/+layout.svelte` | ❌ | header, nav, main, footer, skip link, `afterNavigate` focus, View Transitions | 🔴 |
| `src/routes/+layout.ts` | ❌ | `export const prerender = true` | 🔴 |
| `src/routes/+page.svelte` | ❌ | home | 🟡 |
| `src/routes/sitemap.xml/+server.ts` | ❌ | GET returning XML + `prerender = true` | 🟡 |
| `static/robots.txt` | ❌ | with Sitemap line | 🟡 |

All 🔴 items run after pnpm install and are part of the initial scaffold commit. All 🟡 items run after the scaffold boots.

---

## Ordered fix sequence (proposed — user approves before executing)

Each step is independently committable.

1. **🔴 Machine fixes — git config + pnpm**
   - `git config --global core.longpaths true`
   - `git config --global core.autocrlf input`
   - `corepack enable`
   - `corepack prepare pnpm@latest --activate`
   - Verify: `pnpm --version` returns a version.
   - User decides on 🟡 `git user.name` / `user.email` (keep Windsurf or set real identity).

2. **🟡 Windows Defender exclusion** — user runs PowerShell admin command (requires elevation, one-time).

3. **⚪ Workflow path decision** — Path A / B / C. This unblocks Claude Code plugin installs.

4. **⚪ Install chosen Claude Code plugins** — superpowers and/or feature-dev and/or frontend-design, per path.

5. **🟡 Editor setup** — user picks primary editor, installs Svelte/ESLint/Prettier extensions, we commit `.vscode/extensions.json` or `.zed/settings.json`.

6. **🔴 Scaffold the SvelteKit project** — `pnpm create svelte@latest` then overwrite generated files with the versions from expert research §5, install deps with pinned versions.

7. **🔴 Create `.prettierrc`, `eslint.config.js`, `lefthook.yml`** — from expert research §5 text.

8. **🟡 Create `.github/workflows/ci.yml`** — standard pnpm → check → lint → build job.

9. **🟡 `.claude/hooks/pre-push-check.sh`** — runs `pnpm check` + `pnpm lint` before any `git push`.

10. **⚪ Custom SessionStart hook, error-check/refactor agents, `/pre-commit` skill** — only if Path C is chosen; otherwise the plugins cover these.

---

## Flags requiring user input before proceeding

1. **Git identity:** `user.name=Windsurf`, `user.email=windsurf@example.com` — keep as bot attribution or set Alan's real values?
2. **Primary editor:** Zed, VS Code, or Windsurf? Determines which extensions file to commit.
3. **Workflow path:** A (superpowers strict TDD), B (feature-dev guided), or C (no plugins, hand-rolled)?
4. **Windows Defender exclusion:** run the admin PowerShell command? Requires elevation.
5. **pnpm install method:** Corepack (preferred — one less global install) or `npm i -g pnpm`?

Once these five are answered, Step 1-2 can execute immediately with no further questions.
