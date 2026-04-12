---
name: AY3 Code Standards
description: AI-optimized best practices index for SvelteKit + Supabase + TypeScript. Referenced by error-check agents.
type: reference
version: 0.1.0
last_updated: 2026-04-06
severity_key: "[ERROR] must fix | [WARN] should fix | [INFO] nice-to-have"
sections: S=Structure, T=TypeScript, R=Runes, E=Errors, P=Performance, Q=Quality, C=Security, D=Dependencies, B=Batch/Scripts
---

# AY3 Code Standards Index

> **Usage**: This file is the single source of truth for code review agents.
> Read this FIRST. Only search externally if a rule here is insufficient.

---

## [S] Structure — File & Folder Conventions

### S1 [ERROR] Module pattern consistency
Every feature module in `lib/modules/{name}/` MUST have:
```
{name}/
  components/   — Svelte 5 components
  types/        — TypeScript types (derived from database.ts)
  schemas/      — Zod validation schemas
  services/     — CRUD service instances
  index.ts      — Barrel export
```
Empty placeholder modules (no files inside folders) are [WARN].

### S2 [WARN] No duplicate components
Components in `lib/modules/{name}/components/` should NOT be duplicated in `lib/components/`. Shared components go in `lib/components/ui/`. Feature components go in their module.

### S3 [WARN] Routes stay thin
Route files (`+page.svelte`, `+page.server.ts`) should import from modules, not contain business logic. Max ~150 lines for page components, ~100 lines for server files.

### S4 [INFO] Barrel exports
Every directory with 2+ exports should have an `index.ts`. Use `$lib/` alias for all internal imports.

### S5 [ERROR] Server-only code isolation
Server-only code (Supabase server client, secrets, DB queries) MUST live in `lib/server/` or `+page.server.ts`. Never import from `lib/server/` in client code.

---

## [T] TypeScript — Type Safety

### T1 [ERROR] No `any` types
Never use `any`. Use `unknown` + type narrowing, or define a proper type. Exception: third-party library workarounds (add `// eslint-disable-next-line` with explanation).

### T2 [ERROR] Database types from schema
All Supabase table types MUST derive from `lib/types/database.ts` using:
```typescript
type Row = Tables<'table_name'>
type Insert = TablesInsert<'table_name'>
type Update = TablesUpdate<'table_name'>
```

### T3 [WARN] Discriminated unions for API responses
Use discriminated unions, not optional fields:
```typescript
// GOOD
type Result<T> = { ok: true; data: T } | { ok: false; error: string }
// BAD
type Result<T> = { data?: T; error?: string }
```

### T4 [WARN] Zod schemas match types
Every form/input schema in `schemas/` must have a corresponding TypeScript type. Use `z.infer<typeof Schema>` to derive types from schemas, not duplicate them.

### T5 [INFO] Strict null checks
Functions that can return null/undefined must have explicit return types. Avoid non-null assertions (`!`) — use proper narrowing.

### T6 [ERROR] No type assertions without validation
Never use `as Type` on external data (API responses, form data, URL params). Validate with Zod first, then the type is guaranteed.

---

## [R] Runes — Svelte 5 Patterns

### R1 [ERROR] No legacy syntax
Never use: `export let` (use `$props()`), `<slot/>` (use `{@render children()}`), `$:` reactive (use `$derived()`), `onMount`/`onDestroy` without cleanup.

### R2 [ERROR] $effect cleanup
Every `$effect()` that creates subscriptions, intervals, or event listeners MUST return a cleanup function:
```typescript
$effect(() => {
  const interval = setInterval(() => count++, 1000);
  return () => clearInterval(interval);  // REQUIRED
});
```

### R3 [WARN] $derived over $effect for computed values
Use `$derived()` for values computed from other state. Only use `$effect()` for side effects (DOM manipulation, API calls, subscriptions).
```typescript
// GOOD
let fullName = $derived(`${first} ${last}`);
// BAD
let fullName = $state('');
$effect(() => { fullName = `${first} ${last}`; });
```

### R4 [WARN] Props destructuring
Use `let { prop1, prop2, ...rest } = $props()` — not individual declarations. Type with interface:
```typescript
interface Props { name: string; age?: number; children?: Snippet }
let { name, age = 0, children } = $props<Props>();
```

### R5 [INFO] Bindable props
Use `$bindable()` only when two-way binding is genuinely needed (form inputs). Prefer callback props for parent-child communication.

---

## [E] Errors — Error Handling

### E1 [ERROR] Supabase error checking
EVERY Supabase call must check the error field:
```typescript
const { data, error } = await supabase.from('table').select('*');
if (error) { /* handle — never ignore */ }
```

### E2 [ERROR] Server actions use fail()
Form actions must return `fail(400, { form })` on validation errors and `fail(500, ...)` on service errors. Never throw unhandled.

### E3 [WARN] Try-catch in async service methods
All async service methods should wrap Supabase calls in try-catch to handle network errors:
```typescript
async getAll() {
  try {
    const { data, error } = await supabase.from('table').select('*');
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: { message: 'Network error' } };
  }
}
```

### E4 [WARN] User-facing error messages
Never expose raw Supabase/PostgreSQL error messages to users. Map to friendly messages:
```typescript
const friendlyErrors: Record<string, string> = {
  '23505': 'This record already exists',
  '23503': 'Referenced record not found',
};
```

### E5 [ERROR] hooks.server.ts handleError
The `handleError` hook must sanitize errors — never return stack traces or internal details to the client.

### E6 [INFO] Loading states
Every data-fetching component should show loading state. Use `$delayed` from superforms for form submissions.

---

## [P] Performance — Memory & Speed

### P1 [ERROR] No memory leaks
Every `$effect()` with cleanup requirements (intervals, listeners, subscriptions) must return cleanup. See R2.

### P2 [WARN] Avoid unnecessary reactivity
Don't wrap constants or static config in `$state()`. Only reactive values that change go in `$state()`.

### P3 [WARN] Supabase query efficiency
Always use `.select('col1, col2')` instead of `.select('*')` when you don't need all columns. Use `.limit()` for large tables.

### P4 [INFO] Component file size
Svelte components over 300 lines should be split. Extract sub-components or utility functions.

### P5 [INFO] Lazy loading
Heavy components (charts, rich editors) should use dynamic imports:
```typescript
const Chart = await import('./Chart.svelte');
```

---

## [Q] Quality — Code Cleanliness

### Q1 [ERROR] No dead code
Remove unused variables, imports, functions, and components. Don't comment out code — delete it (git has history).

### Q2 [WARN] DRY — Don't Repeat Yourself
If the same pattern appears 3+ times, extract to a utility or component. Use the generic CRUD service factory for new modules.

### Q3 [WARN] Naming conventions
| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `EmployeeForm.svelte` |
| Functions/vars | camelCase | `getEmployees()` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `Employee`, `BadgeVariant` |
| Files (non-component) | kebab-case | `employee.service.ts` |
| Schemas | kebab-case + `.schema` | `employee.schema.ts` |

### Q4 [WARN] Single Responsibility
Each function/component does one thing. A form component handles form display and validation — not data fetching. A service handles data operations — not UI logic.

### Q5 [INFO] Consistent barrel exports
Re-export from `index.ts` files. Import from the barrel, not deep paths:
```typescript
// GOOD
import { EmployeeForm, EmployeeTable } from '$lib/modules/employees';
// BAD
import EmployeeForm from '$lib/modules/employees/components/EmployeeForm.svelte';
```

### Q6 [WARN] No unused dependencies
Packages in `package.json` that aren't imported anywhere must be removed. Check both `dependencies` and `devDependencies`.

---

## [C] Security — Protection

### C1 [ERROR] No secrets in client code
Environment variables without `PUBLIC_` prefix must never be imported in client-side code. Supabase anon key is public; service role key is NOT.

### C2 [ERROR] Server-side validation
ALWAYS validate on the server (`+page.server.ts` actions) even if client validates too. Never trust client data.

### C3 [WARN] Supabase RLS
Every table should have Row Level Security enabled. Document any tables where RLS is intentionally disabled and why.

### C4 [WARN] Input sanitization
User-supplied HTML must be sanitized. For plain text fields, Zod validation with `.max()` is sufficient. For rich text, use a sanitizer.

### C5 [ERROR] No hardcoded credentials
No API keys, passwords, or secrets in source code. Use `.env` files (never committed) and `$env/static/private` or `$env/dynamic/private`.

### C6 [INFO] CSRF protection
SvelteKit form actions have built-in CSRF. Don't bypass it. For custom API endpoints, verify origin headers.

---

## [D] Dependencies — Package Management

### D1 [WARN] Remove unused packages
Run review: check if every package in `package.json` is actually imported somewhere. Currently flagged: `@tanstack/table-core`, `bits-ui` (installed but unused).

### D2 [INFO] Pin major versions
Use `^` for minor/patch updates but review major version bumps manually. Keep `package-lock.json` committed.

### D3 [INFO] Audit regularly
Run `npm audit` periodically. Address critical and high severity vulnerabilities.

---

## [B] Batch/Scripts — Windows Automation

### B1 [ERROR] Enable delayed expansion
Any batch file using variables inside `if`/`for` blocks MUST use `setlocal enabledelayedexpansion` and `!VAR!` syntax. `%VAR%` inside parenthesized blocks expands at parse time (always stale).
```batch
:: BAD — RETRY is always 0
if %RETRY% GEQ 4 (goto :done)
:: GOOD
if !RETRY! GEQ 4 (goto :done)
```

### B2 [ERROR] No labels inside IF/FOR blocks
Batch labels (`:name`) inside parenthesized `if`/`for` blocks break control flow. Always use `goto` to jump out of the block first.
```batch
:: BAD — breaks the if block
if defined X (
    :retry_loop
    echo retrying
)
:: GOOD — label outside block
if defined X (goto :do_retry)
:do_retry
echo retrying
```

### B3 [ERROR] Verify tools before use
Check `where git`, `where node`, `where npm` etc. before calling them. Fail fast with clear message.

### B4 [WARN] Kill stale processes on startup
Before starting a server, check if the port is in use (`netstat -ano | findstr ":PORT "`) and kill the occupying PID. Kill orphaned background tasks from previous runs.

### B5 [WARN] Retry loops with real backoff
Use `set /a WAIT=RETRY*N` with `timeout /t !WAIT!`. Max retries should be capped (4 is good). Always use `!VAR!` not `%VAR%` (see B1).

### B6 [WARN] Branch name extraction
`git branch -r` output has leading spaces. Always trim with `for /f "tokens=*"`. For `origin/claude/foo-bar`, use string substitution `!VAR:origin/=!` not `tokens/delims` parsing (which breaks on multi-segment paths).

### B7 [INFO] Cleanup on exit
Use `taskkill /fi "windowtitle eq NAME*"` with wildcard. Note: this is fragile — Windows may modify window titles. Consider PID-based tracking as alternative.

### B8 [INFO] Validate directories
Check `if not exist` for project dir, `.git`, `package.json` etc. before `cd /d`. Failed `cd` silently leaves you in the wrong directory.

---

## TODO: Future Sections
- [ ] Testing standards (Vitest, component testing, integration testing)
- [ ] Accessibility checklist (a11y agent)
- [ ] Supabase-specific review (RLS policies, migrations, schema drift)
- [ ] CSS/theme review (design system consistency, Apple Liquid Glass)
- [ ] Git hygiene (commit messages, branch naming, .gitignore)
- [ ] Auto-fix capabilities for [WARN] and [INFO] items
- [ ] Incremental mode (only review changed files since last check)
