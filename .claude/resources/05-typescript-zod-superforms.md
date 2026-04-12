# Type Safety — TypeScript + Supabase Type Generation + Zod + Superforms

> **Priority: HIGH** — Prevents runtime errors from schema drift and unvalidated form data.
> Sources: https://supabase.com/docs/guides/api/rest/generating-types
>          https://superforms.rocks | https://zod.dev

> **IMPORTANT — Zod v4:** This project uses Zod v4 (not v3). When using Superforms adapters:
> - Server: `import { zod4 as zod } from 'sveltekit-superforms/adapters'`
> - Client: `import { zod4Client as zodClient } from 'sveltekit-superforms/adapters'`
> Using the regular `zod`/`zodClient` adapters will cause type errors.

---

## Supabase Type Generation

### Generate Types After Every Schema Change
```bash
# Run from project root (requires Supabase CLI + logged in)
npx supabase gen types typescript \
  --project-id "YOUR_PROJECT_ID" \
  --schema public \
  > my-portal/src/lib/types/database.types.ts
```

### Use Generated Types Throughout App
```typescript
// Import pattern
import type { Database } from '$lib/types/database.types'

type Employee = Database['public']['Tables']['employees']['Row']
type EmployeeInsert = Database['public']['Tables']['employees']['Insert']
type EmployeeUpdate = Database['public']['Tables']['employees']['Update']

// In Supabase client
const supabase = createClient<Database>(URL, KEY)
// Now: supabase.from('employees') is fully typed
```

### GitHub Actions — Auto-Generate on Schema Change
```yaml
# .github/workflows/generate-types.yml
name: Generate Supabase Types
on:
  push:
    paths:
      - 'supabase/migrations/**'
  schedule:
    - cron: '0 2 * * *'  # nightly at 2 AM

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase gen types typescript --project-id ${{ secrets.SUPABASE_PROJECT_ID }} > my-portal/src/lib/types/database.types.ts
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: regenerate Supabase types'
```

---

## Zod Schema Patterns

### Define Schemas at Module Top Level (Not Inside Functions)
```typescript
// src/lib/schemas/employees.ts
import { z } from 'zod'

// CORRECT — module level, cached, reusable
export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required').max(50),
})

export const updateEmployeeSchema = employeeSchema.extend({
  id: z.string().uuid('Invalid employee ID'),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
```

### Server-Side Validation with `safeParse()`
```typescript
// WRONG — throws on invalid input
const data = employeeSchema.parse(formData)

// CORRECT — returns errors without throwing
const result = employeeSchema.safeParse(formData)
if (!result.success) {
  return fail(400, { errors: result.error.flatten() })
}
const { name, email, role } = result.data
```

### AU-Specific Validations (for this project)
```typescript
// src/lib/schemas/common.ts
import { z } from 'zod'

export const auPhone = z.string().regex(
  /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,
  'Invalid Australian phone number'
)

export const abn = z.string().regex(
  /^\d{2}\s?\d{3}\s?\d{3}\s?\d{3}$/,
  'Invalid ABN format'
)

export const auPostcode = z.string().regex(/^\d{4}$/, 'Invalid postcode')

export const currency = z.number()
  .multipleOf(0.01, 'Maximum 2 decimal places')
  .nonnegative('Amount cannot be negative')
```

---

## Sveltekit-Superforms Integration

### Server — `+page.server.ts` Pattern
```typescript
import { superValidate, fail } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { employeeSchema } from '$lib/schemas/employees'

// Schema MUST be defined outside load/action functions
const schema = employeeSchema  // or import directly

export const load = async () => {
  const form = await superValidate(zod(schema))
  return { form }  // ALWAYS return form from load
}

export const actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(schema))
    
    if (!form.valid) {
      return fail(400, { form })  // ALWAYS return form on failure
    }
    
    const { data } = form  // fully typed, validated data
    const { error } = await event.locals.supabase
      .from('employees')
      .insert(data)
    
    if (error) return fail(500, { form })
    
    return { form }  // ALWAYS return form on success too
  }
}
```

### Client — `+page.svelte` Pattern
```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { employeeSchema } from '$lib/schemas/employees'

  let { data } = $props()

  // ONE superForm instance per form — do not create multiple
  const { form, errors, enhance, submitting } = superForm(data.form, {
    validators: zodClient(employeeSchema),  // client-side validation
    onUpdated({ form }) {
      if (form.valid) {
        // success actions
      }
    }
  })
</script>

<form method="POST" action="?/create" use:enhance>
  <input name="name" bind:value={$form.name} />
  {#if $errors.name}<span class="error">{$errors.name}</span>{/if}
  
  <button type="submit" disabled={$submitting}>
    {$submitting ? 'Saving...' : 'Save Employee'}
  </button>
</form>
```

---

## Rules Summary
1. Schemas at module level — never inside load/action functions
2. `safeParse()` not `parse()` on server
3. Always return `{ form }` in all code paths (load + every action branch)
4. One `superForm()` instance per form component
5. All inputs must have `name` attributes matching schema keys
6. Include `name` attribute on all `<input>` elements

---

## Sources
- https://supabase.com/docs/guides/api/rest/generating-types
- https://supabase.com/docs/guides/deployment/ci/generating-types
- https://superforms.rocks/get-started
- https://zod.dev/
