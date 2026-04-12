---
name: Review Checklist — Agent Assignments
description: Maps review agents to file chunks and their applicable rules from standards.md. Used by /error-check command.
type: reference
version: 0.1.0
last_updated: 2026-04-06
depends_on: standards.md
---

# Review Checklist — Agent Assignments

> **Usage**: The `/error-check` command reads this file to assign work to parallel agents.
> Each agent reviews ONLY its assigned files against its assigned rules.
> Report format: `[SEVERITY] RULE_ID | file:line | description`

---

## Agent 1 — Types & Schemas

**Files to review:**
- `my-portal/src/lib/types/*.ts`
- `my-portal/src/lib/schemas/*.ts`
- `my-portal/src/lib/modules/*/types/*.ts`
- `my-portal/src/lib/modules/*/schemas/*.ts`
- `my-portal/src/app.d.ts`

**Rules to check:**
- [ ] T1: No `any` types anywhere
- [ ] T2: Database types derive from `Tables<>` helpers
- [ ] T3: API response types use discriminated unions
- [ ] T4: Zod schemas have matching TypeScript types via `z.infer<>`
- [ ] T5: Explicit return types on nullable functions
- [ ] T6: No `as Type` assertions on external data
- [ ] Q1: No unused type definitions or schema exports
- [ ] Q3: PascalCase for types/interfaces, kebab-case + `.schema` for schema files
- [ ] S4: Barrel exports exist if 2+ exports in directory

**What to report:**
- Unused types/schemas (cross-reference with imports across codebase)
- Missing Zod schemas for forms that accept user input
- Types that don't match current database schema
- `any` or untyped fields

---

## Agent 2 — Services & Utils

**Files to review:**
- `my-portal/src/lib/services/*.ts`
- `my-portal/src/lib/utils/*.ts`
- `my-portal/src/lib/stores/*.ts`
- `my-portal/src/lib/modules/*/services/*.ts`
- `my-portal/src/lib/supabaseClient.ts`

**Rules to check:**
- [ ] E1: Every Supabase call checks error field
- [ ] E3: Async methods have try-catch for network errors
- [ ] E4: No raw error messages exposed to callers
- [ ] T1: No `any` types
- [ ] Q1: No dead code — unused functions or exports
- [ ] Q2: DRY — repeated patterns extracted to shared utility
- [ ] Q3: camelCase for functions/variables
- [ ] Q4: Single responsibility per function
- [ ] P3: Efficient Supabase queries (select specific columns, use limit)
- [ ] S5: Server-only code not importable from client

**What to report:**
- Missing error handling in service methods
- Services not using the generic CRUD factory when they should
- Utility functions that are never imported
- Store patterns using legacy writable() instead of Svelte 5 classes (if applicable)

---

## Agent 3 — Components

**Files to review:**
- `my-portal/src/lib/components/*.svelte`
- `my-portal/src/lib/components/ui/*.svelte`
- `my-portal/src/lib/components/ui/index.ts`
- `my-portal/src/lib/modules/*/components/*.svelte`

**Rules to check:**
- [ ] R1: No legacy Svelte syntax (`export let`, `<slot/>`, `$:`)
- [ ] R2: Every $effect with subscriptions/intervals returns cleanup
- [ ] R3: $derived used for computed values, not $effect
- [ ] R4: Props use destructured $props() with interface typing
- [ ] R5: $bindable only where two-way binding is needed
- [ ] P1: No memory leaks (uncleaned intervals, listeners)
- [ ] P2: No unnecessary $state on constants
- [ ] P4: Components under 300 lines
- [ ] Q1: No unused imports or variables
- [ ] Q3: PascalCase component filenames
- [ ] Q4: Single responsibility (no data fetching in display components)
- [ ] S2: No duplicate components between modules/ and lib/components/
- [ ] C4: User input sanitized if rendered as HTML

**What to report:**
- Legacy Svelte 4 syntax that needs migration
- Components doing too much (data + display + logic)
- Duplicate components across lib/components/ and modules/
- Missing accessibility attributes (aria-label, role, alt)
- Oversized components that should be split

---

## Agent 4 — Routes & Server

**Files to review:**
- `my-portal/src/routes/**/*.svelte`
- `my-portal/src/routes/**/*.ts`
- `my-portal/src/hooks.server.ts`
- `my-portal/src/lib/server/*.ts`

**Rules to check:**
- [ ] S3: Route files are thin (page <150 lines, server <100 lines)
- [ ] S5: Server-only code in lib/server/ or +page.server.ts only
- [ ] E2: Form actions use fail() on errors
- [ ] E5: handleError in hooks.server.ts sanitizes errors
- [ ] E6: Loading states for data fetching
- [ ] C1: No secrets in client-side route files
- [ ] C2: Server-side validation in all form actions
- [ ] C5: No hardcoded credentials
- [ ] C6: CSRF protection not bypassed
- [ ] R1: No legacy syntax in .svelte route files
- [ ] T6: No type assertions on form data or URL params

**What to report:**
- Business logic that should be in a service, not a route
- Missing server-side validation on form actions
- Exposed error details in responses
- Route files that are too large
- Missing error/loading UI states

---

## Agent 5 — Config & Dependencies

**Files to review:**
- `my-portal/package.json`
- `my-portal/vite.config.ts`
- `my-portal/svelte.config.js`
- `my-portal/tsconfig.json`
- `my-portal/.env.example`
- `my-portal/.gitignore`

**Rules to check:**
- [ ] D1: No unused packages in dependencies or devDependencies
- [ ] D2: Version ranges are reasonable (^ for minor/patch)
- [ ] D3: No known vulnerabilities (npm audit)
- [ ] C5: .env not committed, .env.example has no real values
- [ ] S1: Vite config has Tailwind plugin BEFORE SvelteKit plugin
- [ ] Q6: All installed packages are actually imported somewhere

**What to report:**
- Packages in package.json not imported anywhere in src/
- Outdated or vulnerable dependencies
- Missing .gitignore entries for sensitive files
- Misconfigurations in vite/svelte/ts config
- .env.example containing real credentials

**Cross-check method:**
For each package in dependencies/devDependencies, grep the codebase for its import. Flag any with zero matches (excluding framework packages that are used implicitly like `svelte`, `vite`, `typescript`).

---

## Output Format

Each agent compiles findings as:

```
## Agent {N} — {Name} Summary
Checked: {count} files | Found: {error_count} errors, {warn_count} warnings, {info_count} info

### [ERROR] Findings
- T1 | my-portal/src/lib/types/common.ts:15 | `any` type used for SelectOption value
- E1 | my-portal/src/lib/services/crud.ts:23 | Supabase error not checked after insert

### [WARN] Findings
- Q6 | package.json | `@tanstack/table-core` installed but never imported
- S2 | lib/components/EmployeeForm.svelte | Duplicate of modules/employees/components/EmployeeForm.svelte

### [INFO] Findings
- Q5 | lib/utils/ | Missing index.ts barrel export
```

---

## Agent 6 — Batch/Scripts

**Files to review:**
- `*.bat` (project root)
- `*.ps1` (if any)
- Any shell/automation scripts

**Rules to check:**
- [ ] B1: `setlocal enabledelayedexpansion` + `!VAR!` in all if/for blocks
- [ ] B2: No labels (`:name`) inside parenthesized if/for blocks
- [ ] B3: Tool existence checks (`where git`, `where node`, etc.) before use
- [ ] B4: Stale process cleanup — kill existing server/background tasks on startup
- [ ] B5: Retry loops use `!VAR!` with real backoff and max cap
- [ ] B6: Git branch name extraction trims spaces, handles multi-segment paths
- [ ] B7: Cleanup on exit kills background processes
- [ ] B8: Directory validation before `cd /d`

**What to report:**
- Variables read with `%VAR%` inside parenthesized blocks (always broken)
- Labels inside if/for blocks (corrupts control flow)
- Missing tool/directory checks
- Orphaned background processes on exit
- Port conflicts not detected
- Retry loops that spin without real delay

---

## TODO: Future Agents
- [ ] Agent 7 — Accessibility (a11y): ARIA, keyboard nav, color contrast, semantic HTML
- [ ] Agent 8 — CSS/Theme: Design system consistency, unused CSS classes, theme variable usage
- [ ] Agent 9 — Testing: Test coverage, test quality, missing test files
- [ ] Agent 10 — Git Hygiene: Commit messages, branch naming, .gitignore completeness
- [ ] Agent 11 — Supabase: RLS policies, migration state, schema drift detection
