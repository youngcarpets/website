# Component & Module Patterns

> How to structure features, components, and services in AY3.

## Module Architecture

Every feature lives in `src/lib/modules/{name}/` with this structure:

```
modules/{name}/
├── components/            ← Feature-specific Svelte 5 components
│   ├── {Name}Form.svelte
│   └── {Name}Table.svelte
├── schemas/
│   └── {name}.schema.ts   ← Zod schema (single source of truth for types + validation)
├── services/
│   └── {name}.service.ts  ← DB operations (extends generic CRUD or custom)
├── types/
│   └── {name}.types.ts    ← TypeScript types derived from database.ts
└── index.ts               ← Barrel export (public API)
```

### Barrel Export Pattern
```typescript
// modules/employees/index.ts
export { default as EmployeeForm } from './components/EmployeeForm.svelte';
export { default as EmployeeTable } from './components/EmployeeTable.svelte';
export { employeeService } from './services/employee.service';
export { employeeSchema, type EmployeeFormData } from './schemas/employee.schema';
export type { Employee, EmployeeInsert, EmployeeUpdate } from './types/employee.types';
```

### Cross-Module Imports
Always import through the barrel, never reach into another module's internals:
```typescript
// GOOD
import { CustomerSelect } from '$lib/modules/customers';

// BAD
import CustomerSelect from '$lib/modules/customers/components/CustomerSelect.svelte';
```

---

## Shared UI Components (`src/lib/components/ui/`)

Primitives used across all modules. Accept only data/callback props — no business logic.

| Component | Props | Purpose |
|-----------|-------|---------|
| `FormField` | name, label, type, value ($bindable), error, required, placeholder | Label + input-glass + error message |
| `GlassPanel` | children (snippet), class, padding | Glass-themed wrapper div |
| `PageHeader` | title, subtitle, actions (snippet) | Page title with optional action buttons |
| `Badge` | variant (cyan/green/red/yellow/gray/purple/blue), children | Status/role display |
| `EmptyState` | message, actions (snippet) | "No records" placeholder |
| `ConfirmDialog` | open ($bindable), title, message, onconfirm | Delete confirmation modal |

Import via barrel: `import { FormField, Badge } from '$lib/components/ui';`

---

## Types Pattern

Derive from generated database types — define once, never duplicate:

```typescript
// modules/{name}/types/{name}.types.ts
import type { Tables, TablesInsert, TablesUpdate } from '$lib/types/database';

export type Employee = Tables<'employees'>;
export type EmployeeInsert = TablesInsert<'employees'>;
export type EmployeeUpdate = TablesUpdate<'employees'>;
```

---

## Zod Schema Pattern

Single source of truth for both validation AND TypeScript types:

```typescript
// modules/{name}/schemas/{name}.schema.ts
import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  role: z.string().min(1, 'Role is required')
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
```

---

## Service Pattern

Simple modules extend the generic CRUD factory:

```typescript
// modules/{name}/services/{name}.service.ts
import { createCrudService } from '$lib/services/crud';
import type { Employee, EmployeeInsert, EmployeeUpdate } from '../types/employee.types';

export const employeeService = createCrudService<Employee, EmployeeInsert, EmployeeUpdate>('employees');
```

Complex modules (invoices) write custom service methods.

---

## Superforms Integration

### Server (`+page.server.ts`)
```typescript
import { moduleSchema, moduleService } from '$lib/modules/{name}';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
  const { data } = await moduleService.getAll(locals.supabase, { orderBy: 'created_at' });
  const form = await superValidate(zod(moduleSchema));
  return { items: data, form };
};

export const actions = {
  create: async ({ request, locals }) => {
    const form = await superValidate(request, zod(moduleSchema));
    if (!form.valid) return fail(400, { form });
    const { error } = await moduleService.create(locals.supabase, form.data);
    if (error) return message(form, error.message, { status: 500 });
    return message(form, 'Created successfully');
  }
};
```

### Client (`+page.svelte`)
```svelte
<script lang="ts">
  import { ModuleForm, ModuleTable } from '$lib/modules/{name}';
  let { data } = $props();
</script>

<ModuleForm data={data.form} />
<ModuleTable items={data.items} />
```

### Form Component
```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
  import { moduleSchema } from '../schemas/module.schema';
  import { GlassPanel, FormField } from '$lib/components/ui';

  let { data, action = '?/create' } = $props();
  const { form, errors, enhance, delayed } = superForm(data, {
    validators: zodClient(moduleSchema),
    resetForm: true
  });
</script>
```

---

## Route Pattern

Routes are thin — they import from modules and wire data:

```
routes/(public)/{name}/
├── +page.server.ts    ← Load list
├── +page.svelte       ← Display table + "New" button
├── new/
│   ├── +page.server.ts ← superValidate + create action
│   └── +page.svelte    ← Form (create mode)
└── [id]/
    ├── +page.server.ts ← Load by ID + update/delete actions
    └── +page.svelte    ← Form (edit mode) or detail view
```

---

## Svelte 5 Component Template

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    children,
    actions,
    onchange
  }: {
    title: string;
    children: Snippet;
    actions?: Snippet;
    onchange?: (value: string) => void;
  } = $props();
</script>

<div>
  <h2>{title}</h2>
  {#if actions}{@render actions()}{/if}
  {@render children()}
</div>
```

Rules:
- Use `$props()` with destructured types — never `export let`
- Use `{@render children()}` — never `<slot/>`
- Use `$bindable()` for two-way bound props (form fields)
- Use `$derived()` for computed values — never `$effect` for derivations
- Use `$state()` only for truly mutable reactive values
