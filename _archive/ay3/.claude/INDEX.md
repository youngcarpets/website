# AY3 Resource Index

> **Load this file first.** It maps every task to the right agent and resources.

## Agent Dispatch

| Task Domain | Agent | Index File |
|------------|-------|-----------|
| Connection / network / env / infra debugging | `agents/troubleshoot.md` | `agents/indexes/troubleshoot.index.md` |
| Commercial flooring product expertise (YCI) | `agents/flooring-expert.md` | `agents/indexes/flooring-expert.index.md` |
| Database / schema / migrations | `agents/database.md` | `agents/indexes/database.index.md` |
| Supabase / RLS / auth | `agents/supabase.md` | `agents/indexes/supabase.index.md` |
| Code review / quality audit | `agents/error-check.md` | (uses `reference/review-checklist.md`) |
| Refactoring / DRY / cleanup | `agents/refactor.md` | `agents/indexes/refactor.index.md` |
| Module architecture / structure | `agents/structure.md` | `agents/indexes/structure.index.md` |
| UI / styling / glass design | `agents/design.md` | `agents/indexes/design.index.md` |
| Forms / validation / Zod | `agents/forms.md` | `agents/indexes/forms.index.md` |
| Performance / optimization | `agents/performance.md` | `agents/indexes/performance.index.md` |
| Online research | `agents/research.md` | `agents/indexes/research.index.md` |
| Math / vectors / arcs / chart geometry | `agents/charts.md` | `agents/indexes/charts.index.md` |
| Phone / touch / gestures / iPhone 16 Pro Max (iOS 26.4) | `agents/mobile.md` | `agents/indexes/mobile.index.md` |
| Visual bug diagnosis from screenshots / mockups / photos | `agents/visual-diagnose.md` | `agents/indexes/visual-diagnose.index.md` |
| Resource file merging | `agents/resource-merger.md` | (system agent) |
| Git / GitHub operations | `agents/git-ops.md` | (system agent) |
| Financial / money / GST | `agents/financial.md` | `agents/indexes/financial.index.md` |
| Claude system optimization | `agents/optimize.md` | `agents/indexes/optimize.index.md` |

---

## Global Agent Rules

### 1. Learn and Save
When any agent discovers new patterns, fixes bugs, or solves a novel problem — **save the learnings** to that agent's resource files and index. Every insight gets persisted for future sessions. No knowledge gets lost.

### 2. LOVE = Locked
When the user says **"LOVE"** about anything:
- **Protected** — do not change unless functionally broken (crashes, data loss, accessibility failure)
- Log in the relevant agent's index under a `## Protected (LOVE)` table
- If no agent fits, log in the **Global Protected** table below
- **Repeated LOVE** on an existing item → bump it to row 1 (top = highest priority)
- Before modifying any LOVE'd item, **warn the user first**

### Global Protected (LOVE)
> Cross-domain items not owned by a single agent.

| # | Date | Item | What's Protected |
|---|------|------|-----------------|
| 1 | 2026-04-07 | Young Carpets 3-layer parallax bg | `routes/young-carpets/+page.svelte` `.yc-bg-plan-layer-1/2/3` transforms, filters, masks, opacities, scroll multipliers, + the `$effect` setting `--yc-scroll`. Do not remove layer markup. Additive transforms (tilt) OK as composing vars. New effects ABOVE the stack OK. See `.claude/RELAY.md` 🔒 LOCKED section for full rules. **Hero of the page — user's favorite effect.** |
| 2 | 2026-04-06 | Version bumping | Bump version on every commit — CLAUDE.md + dev page VERSION constant + `.claude/rules/versioning.md` |
| 3 | 2026-04-06 | Mobile dev workflow | `ay3-mobile-dev.bat` + `ay3-auto-pull.bat` — one-click server, auto-pull, --host |

---

## Quick Lookup (Legacy — still valid)

| Task | Load These |
|------|-----------|
| **New feature module** | `reference/component-patterns.md`, `resources/07`, `resources/05` |
| **Database changes** | `resources/09`, `resources/01`, `resources/08` |
| **Forms & validation** | `resources/05` (Zod + Superforms), `resources/07` (runes) |
| **Styling & theme** | `resources/03`, `resources/10`, `resources/11`, `resources/12`, `resources/04` |
| **Animation** | `reference/animation-navigation.md`, `reference/animation-components.md`, `reference/animation-carousel.md`, `resources/13a`, `resources/13b`, `resources/13c` |
| **Performance** | `resources/06` |
| **Auth & security** | `resources/02`, `resources/01`, `reference/standards.md` [C] |
| **Code review** | `reference/standards.md`, `reference/review-checklist.md` |
| **Financial / invoicing** | `resources/08`, `resources/09` |
| **Architecture decisions** | `reference/architecture-decisions.md` |
| **Mobile testing / LAN** | `reference/mobile-testing.md`, `scripts/mobile.bat`, `scripts/auto-pull.bat` |

---

## Resources (Portable — append-only, copy to any SvelteKit project)

| # | File | Topic |
|---|------|-------|
| 01 | `01-database-security-rls.md` | Supabase RLS rules, RBAC, default-deny |
| 02 | `02-auth-sveltekit-ssr.md` | SSR auth, dual-client pattern, route protection |
| 03 | `03-apple-liquid-glass-design.md` | Glass CSS, color system, spacing, touch targets |
| 04 | `04-accessibility-wcag22.md` | WCAG 2.2 AA for glass UI, contrast, focus, semantics |
| 05 | `05-typescript-zod-superforms.md` | Type generation, Zod v4 schemas, Superforms flow |
| 06 | `06-performance-sveltekit.md` | SSR, prefetch, code splitting, glass budget |
| 07 | `07-svelte5-runes-patterns.md` | $state, $derived, $effect, $props, anti-patterns |
| 08 | `08-financial-accuracy.md` | Money math, round2(), AU GST, server recalculation |
| 09 | `09-database-schema-patterns.md` | Table templates, triggers, indexes, enums, multi-tenancy |
| 10 | `10-apple-colors.md` | Apple system/semantic colors, dark mode variants |
| 11 | `11-apple-effects.md` | Glass CSS, shadows, easing curves, reduced motion |
| 12 | `12-apple-typography.md` | SF Pro type scale, spacing grid, corner radii |
| 13a | `13a-motion-tokens.md` | Motion tokens (CSS custom properties), GPU rules, reduced-motion |
| 13b | `13b-motion-controllers.md` | MotionController + StaggerManager TypeScript classes |
| 13c | `13c-motion-utilities.md` | CSS utility classes, stagger reference, portal motion rules |

## Reference (Project-specific — adapt per project)

| File | Purpose |
|------|---------|
| `standards.md` | Code review rules: [S]tructure, [T]ypes, [R]unes, [E]rrors, [P]erf, [Q]uality, [C]ecurity, [D]eps |
| `review-checklist.md` | Agent assignments + file mappings for `/error-check` |
| `architecture-decisions.md` | ADRs: SvelteKit, Tailwind v4, Supabase, Form Actions, Glass UI, TypeScript strict |
| `component-patterns.md` | Module architecture, barrel exports, Superforms integration, UI primitives |
| `animation-navigation.md` | Page/nav transitions — View Transitions API + SvelteKit onNavigate |
| `animation-components.md` | Card pop, button micro-interactions, glow effects, consistency checklist |
| `animation-carousel.md` | CSS-only carousel + Embla carousel OOP wrapper |
| `mobile-testing.md` | LAN dev server access from mobile devices (--host, auto-pull) |
| `ontario-accounting.md` | Canonical Ontario HST/Construction Act/ITC rules — YCI tax + invoicing reference |
| `known-deferred-fixes.md` | Known issues postponed until gating events (schema migration, etc.) — agents check before re-flagging |

## Commands

| Command | What It Does |
|---------|-------------|
| `/error-check` | Launch 5 parallel agents to review codebase against standards.md |
| `/new-module` | Scaffold a feature module (types, schema, service, components, barrel, routes) |
| `/pre-commit` | Quality gate: verify branch, check staged files, run svelte-check |
| `/deep-mode` | Activate multi-agent Deep Mode for complex tasks |
| `/optimize-claude` | Audit and optimize the .claude/ system — context size, integrity, redundancy, best practices |
| `/save` | Commit, sync with main, push — version-bump aware, handles conflicts |

## Claude Code Documentation (Local)

110 markdown files downloaded from `code.claude.com/docs` on 2026-04-10.
Location: `reference/claude-code-docs/`
Index: `reference/claude-code-docs/INDEX.md`

Use `Grep` or `Read` against these files for any Claude Code questions — settings, hooks, skills, plugins, MCP, Agent SDK, CLI, permissions, etc. No external fetch needed.

Key files for common lookups:
- **Settings/config:** `settings.md`, `env-vars.md`, `model-config.md`, `permission-modes.md`
- **Skills/plugins:** `skills.md`, `plugins.md`, `discover-plugins.md`, `plugins-reference.md`
- **Hooks:** `hooks.md`, `hooks-guide.md`
- **CLI:** `cli-reference.md`, `commands.md`, `interactive-mode.md`
- **Memory:** `memory.md`, `claude-directory.md`
- **Agent SDK:** `agent-sdk/` subdirectory (29 files)

---

## Archive

Historical files in `.claude/archive/` — no longer active:
- `setup-worflow.md` — Original Phase 0+1 setup instructions (completed)
- `RESOURCE-SYSTEM-TODO.md` — Original resource system plan (superseded)
