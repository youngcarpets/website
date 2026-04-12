# /new-module — Scaffold a Feature Module

> **Agents**: `.claude/agents/structure.md` (architecture), `.claude/agents/forms.md` (schemas), `.claude/agents/database.md` (types) | **Mode**: Deep

When invoked, scaffold a complete feature module following the AY3 module architecture.

## Steps

1. **Ask** the user for:
   - Module name (e.g., "products", "payments")
   - Supabase table name (defaults to module name)
   - Key fields for the Zod schema

2. **Read** `.claude/reference/component-patterns.md` for the exact patterns to follow.

3. **Create** the folder structure:
   ```
   src/lib/modules/{name}/
   ├── components/
   │   ├── {Name}Form.svelte
   │   └── {Name}Table.svelte
   ├── schemas/
   │   └── {name}.schema.ts
   ├── services/
   │   └── {name}.service.ts
   ├── types/
   │   └── {name}.types.ts
   └── index.ts
   ```

4. **Generate** each file:
   - `types/` — Import from `$lib/types/database` (Tables, TablesInsert, TablesUpdate)
   - `schemas/` — Zod schema with the specified fields + `z.infer` type export
   - `services/` — `createCrudService()` call with proper generics
   - `components/{Name}Form.svelte` — Superforms-powered form using `FormField` UI components
   - `components/{Name}Table.svelte` — Glass-themed table with Badge, EmptyState, ConfirmDialog
   - `index.ts` — Barrel export of all public items

5. **Create** route stubs:
   ```
   src/routes/(public)/{name}/
   ├── +page.server.ts    ← Load + create/delete actions
   ├── +page.svelte       ← List page
   ├── new/
   │   ├── +page.server.ts
   │   └── +page.svelte
   └── [id]/
       ├── +page.server.ts
       └── +page.svelte
   ```

6. **Update** Navbar to include the new module link.

7. **Run** `npx svelte-check` to verify no type errors.

8. **Commit** with message: `Add {name} module scaffold`

## Key Rules
- Use `zod4 as zod` / `zod4Client as zodClient` (Zod v4 project)
- Use `locals.supabase` (SSR client from hooks), never global client
- Follow barrel export pattern — all public API through `index.ts`
- Components use shared UI primitives from `$lib/components/ui`
