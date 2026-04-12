# Claude Resource System — Implementation Plan
> Goal: Maximize Claude's speed & accuracy via chunked, on-demand resource loading.
> Strategy: Lean CLAUDE.md → master INDEX → small focused chunks → custom commands.

---

## Why This Architecture

Claude loads CLAUDE.md **every session** (unavoidable). Everything else is loaded
**on-demand** via the Read tool. The key insight: small, focused files load fast and
waste zero context. One master INDEX lets Claude navigate without guessing file paths.
Custom commands eliminate repetitive prompt writing. Hooks automate quality gates.

---

## PHASE 1 — Directory Scaffold

Create the full `.claude/` directory structure first.

```
.claude/
├── settings.json              ← Permissions, hooks, tool allowlists
├── commands/                  ← Custom slash commands (/new-component, etc.)
│   ├── new-component.md
│   ├── new-route.md
│   ├── add-crud-entity.md
│   └── check-svelte5.md
└── resources/
    ├── _INDEX.md              ← Master map: topic → file path (LOAD THIS FIRST)
    ├── svelte5-patterns.md
    ├── tailwind-v4.md
    ├── glass-ui.md
    ├── supabase-patterns.md
    ├── superforms-zod.md
    ├── component-anatomy.md
    ├── database-schema.md
    └── git-workflow.md
```

Tasks:
- [ ] `mkdir -p .claude/commands .claude/resources`

---

## PHASE 2 — settings.json

`.claude/settings.json` controls permissions and hooks. Hooks run shell commands
automatically in response to tool events — Claude does NOT need to be told to run them.

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run check:*)",
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(git diff:*)",
      "Bash(git status)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd /home/user/ay3/my-portal && npx svelte-check --threshold warning 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

**Why**: The PostToolUse hook runs `svelte-check` after every file edit, catching
Svelte 5 rune errors and TypeScript issues immediately without Claude having to ask.

Tasks:
- [ ] Create `.claude/settings.json` with above content
- [ ] Test hook fires correctly after a file edit
- [ ] Tune `svelte-check` output (tail -20 keeps it brief)

---

## PHASE 3 — Master Resource Index

`.claude/resources/_INDEX.md` — The first file Claude should load when starting any task.
Must be SHORT. Maps task type → file(s) to load. No content, only navigation.

```markdown
# Resource Index

> Load this file first. Then load ONLY the files relevant to your task.

## By Task Type

| Task | Load These Files |
|------|-----------------|
| Create/edit a Svelte component | svelte5-patterns.md, component-anatomy.md |
| Style with Tailwind or Glass theme | tailwind-v4.md, glass-ui.md |
| Supabase queries / server load | supabase-patterns.md |
| Form with validation | superforms-zod.md, supabase-patterns.md |
| Add new DB table/entity | database-schema.md, supabase-patterns.md, add-crud-entity.md |
| New route/page | svelte5-patterns.md, new-route.md |
| Git commit/push | git-workflow.md |

## File Map

| File | Contents | Size |
|------|----------|------|
| svelte5-patterns.md | Runes, slots→render, reactivity, lifecycle | ~80 lines |
| tailwind-v4.md | v4 syntax changes, @theme, utility patterns | ~60 lines |
| glass-ui.md | Glass component CSS, backdrop-filter, tokens | ~70 lines |
| supabase-patterns.md | Client setup, CRUD, SSR auth, error handling | ~90 lines |
| superforms-zod.md | Form setup, validation, server actions | ~80 lines |
| component-anatomy.md | This project's component structure and conventions | ~50 lines |
| database-schema.md | Tables, columns, RLS policies, TypeScript types | ~60 lines |
| git-workflow.md | Branch strategy, commit format, push protocol | ~30 lines |
```

Tasks:
- [ ] Create `.claude/resources/_INDEX.md`
- [ ] Add instruction in CLAUDE.md: "For detailed info, load `.claude/resources/_INDEX.md` first."

---

## PHASE 4 — Resource Chunks

Each file must be FOCUSED (one topic), SCANNABLE (headers, code blocks), and SHORT
(target 50–100 lines; hard max 150). No prose. Only patterns that actually apply.

### 4a. `svelte5-patterns.md`
Critical — Svelte 5 rune violations are the #1 source of bugs in this project.

Must include:
- `$props()` vs `export let` — show CORRECT and WRONG side by side
- `$state()`, `$derived()`, `$effect()` — brief examples
- `{@render children()}` vs `<slot/>` — show both forms
- `$bindable()` for two-way prop binding
- `$inspect()` for debugging (dev only)
- Event handling: `onclick={handler}` NOT `on:click`
- Common migration mistakes (the exact errors Claude tends to make)

Tasks:
- [ ] Create `.claude/resources/svelte5-patterns.md`
- [ ] Include at least 2 real patterns from this project's components

### 4b. `tailwind-v4.md`
Must include:
- `@import "tailwindcss"` (NOT `@tailwind base/components/utilities`)
- `@theme { }` block for custom tokens (replaces `theme.extend`)
- CSS variable syntax: `var(--color-glass-bg)` in utilities
- `@tailwindcss/vite` plugin order (BEFORE sveltekit())
- Differences from v3: no `theme()` function in CSS, no `@apply` with arbitrary values

Tasks:
- [ ] Create `.claude/resources/tailwind-v4.md`
- [ ] Extract actual token names from `my-portal/src/app.css`

### 4c. `glass-ui.md`
Must include:
- The Glass CSS tokens/variables defined in app.css
- GlassPanel, PageHeader, Badge usage patterns
- `backdrop-filter: blur()` + `background: rgba()` recipe
- Dark mode behavior
- Component import paths (`$lib/components/ui/index.ts`)

Tasks:
- [ ] Create `.claude/resources/glass-ui.md`
- [ ] Extract actual CSS variable values from `my-portal/src/app.css`
- [ ] Document all 9 UI components with their props

### 4d. `supabase-patterns.md`
Must include:
- Client-side vs server-side client (`supabaseClient.ts` vs `lib/server/supabase.ts`)
- CRUD patterns from `lib/services/crud.ts` (actual function signatures)
- Error handling pattern used in this project
- Environment variable names: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- SSR cookie pattern via `@supabase/ssr`
- TypeScript `Database` type import path

Tasks:
- [ ] Create `.claude/resources/supabase-patterns.md`
- [ ] Copy actual function signatures from `crud.ts` (don't paraphrase)

### 4e. `superforms-zod.md`
Must include:
- `superValidate()` in `+page.server.ts` load function
- `superForm()` in component `$props`
- `zod(schema)` adapter import
- Form action pattern with `fail()` and `message()`
- `lib/schemas/common.ts` — actual schema definitions
- Error display in Svelte template

Tasks:
- [ ] Create `.claude/resources/superforms-zod.md`
- [ ] Extract actual schema from `lib/schemas/common.ts`
- [ ] Show the full round-trip: schema → load → action → component

### 4f. `component-anatomy.md`
Must include:
- This project's component file structure (where things live)
- Import conventions (`$lib/...`)
- How feature components differ from UI components
- Prop patterns for each UI component (from actual source)
- How Toast store is used

Tasks:
- [ ] Create `.claude/resources/component-anatomy.md`
- [ ] List all 13 components with their props extracted from source

### 4g. `database-schema.md`
Must include:
- `employees` table: all columns, types, constraints
- TypeScript type from `lib/types/database.ts`
- Any RLS policies (document even if none yet)
- Naming convention for future tables

Tasks:
- [ ] Create `.claude/resources/database-schema.md`
- [ ] Read actual TypeScript types from `lib/types/database.ts` and `lib/types/common.ts`

### 4h. `git-workflow.md`
Must include:
- Branch: always `main` (not master)
- Remote: `https://github.com/onerrorgotowtf/ay3.git`
- Git root: repo root, NOT `my-portal/`
- Commit timing: after every file creation or major edit
- Never commit: `.env`
- Push command: `git push -u origin main`

Tasks:
- [ ] Create `.claude/resources/git-workflow.md` (short, ~30 lines)

---

## PHASE 5 — Custom Slash Commands

`.claude/commands/*.md` files become `/command-name` slash commands. Each should be
a complete, self-contained prompt that loads its own resources and executes a workflow.

### `/new-component`
```markdown
Create a new Svelte 5 component for this project.

1. Load `.claude/resources/svelte5-patterns.md`
2. Load `.claude/resources/component-anatomy.md`
3. Load `.claude/resources/glass-ui.md`
4. Ask: component name, type (feature|ui), props needed
5. Create file at correct path
6. Export from index.ts if it's a UI component
7. Commit with message: "feat: add [Name] component"
```

### `/new-route`
```markdown
Create a new SvelteKit route for this project.

1. Load `.claude/resources/svelte5-patterns.md`
2. Load `.claude/resources/supabase-patterns.md`
3. Ask: route path, needs server load? needs form actions?
4. Create +page.svelte (and +page.server.ts if needed)
5. Add to Navbar if it's a top-level route
6. Commit changes
```

### `/add-crud-entity`
```markdown
Add a new CRUD entity to this project (new DB table + full UI).

1. Load `.claude/resources/database-schema.md`
2. Load `.claude/resources/supabase-patterns.md`
3. Load `.claude/resources/superforms-zod.md`
4. Load `.claude/resources/svelte5-patterns.md`
5. Ask: entity name, columns/types
6. Add TypeScript type to lib/types/
7. Add Zod schema to lib/schemas/
8. Add CRUD functions to lib/services/crud.ts
9. Create Table + Form components
10. Create route with server load + actions
11. Commit all files
```

### `/check-svelte5`
```markdown
Audit the current file for Svelte 5 compliance.

1. Load `.claude/resources/svelte5-patterns.md`
2. Read the target file (ask user which file)
3. Check for: export let (should be $props), <slot/> (should be {@render}),
   on:event (should be onevent), reactive declarations (should be $derived/$effect)
4. Report violations with line numbers and correct replacements
5. Apply fixes if user approves
```

Tasks:
- [ ] Create `.claude/commands/new-component.md`
- [ ] Create `.claude/commands/new-route.md`
- [ ] Create `.claude/commands/add-crud-entity.md`
- [ ] Create `.claude/commands/check-svelte5.md`

---

## PHASE 6 — CLAUDE.md Optimization

Current CLAUDE.md is 53 lines — reasonable but can be tightened. Changes needed:

1. **Remove** the verbose directory tree (move key info to _INDEX.md)
2. **Add** single line: `For detailed patterns, load .claude/resources/_INDEX.md first`
3. **Add** "Critical Gotchas" section — the 3 things that break most often:
   - Svelte 5: NO `export let`, NO `<slot/>`, NO `on:event`
   - Tailwind v4: plugin order in vite.config.ts is mandatory
   - Supabase: two different clients (client-side vs server-side)
4. **Keep**: git protocol, commands, env var names — these are needed every session

Tasks:
- [ ] Edit CLAUDE.md: add `_INDEX.md` pointer near top
- [ ] Edit CLAUDE.md: add "Critical Gotchas" section (3–5 bullet points)
- [ ] Edit CLAUDE.md: slim the directory tree to just the key paths

---

## PHASE 7 — Validation & Iteration

After building the system, verify it actually improves Claude's behavior.

Tasks:
- [ ] Test `/new-component` command end-to-end
- [ ] Test `/check-svelte5` on an existing component
- [ ] Verify PostToolUse hook fires and shows svelte-check output
- [ ] Ask Claude to create a new route — verify it loads INDEX first
- [ ] Check that no resource file exceeds 150 lines
- [ ] Update _INDEX.md size estimates to reflect actual file sizes

---

## Design Principles (Reference)

These informed every decision above — useful when extending the system:

1. **CLAUDE.md = session header**: Lean. Only what's needed every single time.
   If it's only needed occasionally, it belongs in a resource file.

2. **INDEX = navigation, not content**: _INDEX.md tells Claude what to load.
   It should be <50 lines. No code examples in the index.

3. **One topic per file**: A file about "Supabase + Svelte 5 + Forms" is useless.
   A file about Supabase patterns only is powerful.

4. **Real code, not descriptions**: Resource files should contain actual patterns
   from THIS project, not generic framework docs Claude already knows.

5. **Commands = workflow, not just prompts**: Custom commands should include
   resource-loading steps so Claude doesn't have to reason about what to load.

6. **Hooks = automated quality gates**: Don't ask Claude to run svelte-check —
   hook it to happen automatically after every edit.

7. **Small files = fast loading**: A 60-line file loads in one Read call.
   A 600-line file costs 10x the context. Keep files focused.

8. **Update as you go**: Resource files go stale. When a pattern changes,
   update the resource file in the same commit that changes the code.
