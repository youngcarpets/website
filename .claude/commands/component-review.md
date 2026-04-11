---
description: Review a Svelte 5 component for runes, types, and prop design
argument-hint: <file-path>
---

Review `$ARGUMENTS` against CLAUDE.md's **Svelte 5 Patterns**, **TypeScript**, **Import Order**, and **Code Generation** sections.

Procedure:

1. Read `$ARGUMENTS` plus any `$lib/*` modules it imports.
2. Dispatch the `svelte-reviewer` subagent. Ask it to check:
   - Runes: `$state`, `$derived`, `$derived.by`, `$effect` used correctly — no state→state sync in `$effect`.
   - Props: `interface Props` + inline destructure with defaults, no reassignment, typed `Snippet` for children.
   - Events: `onclick={fn}` not `on:click`; no `|preventDefault` modifier.
   - Class reactivity: `$state` fields; arrow methods when `this` is passed as a handler.
   - Cross-module state: exports are `const` objects, not reassignable `let`.
   - TypeScript: no `any`, typed `PageProps`/`PageLoad`, correct import order.
   - Forbidden anywhere: `$:`, `export let`, `createEventDispatcher`, `<slot>`, stores for local UI state.
   - Code generation: no placeholder `TODO` stubs, no unnecessary comments, no backwards-compat shims.

3. Return findings as: `file:line — issue — severity (error|warn|nit) — suggested fix`.

4. Do **not** auto-fix. Reports only, unless the user explicitly asks for fixes afterward.
