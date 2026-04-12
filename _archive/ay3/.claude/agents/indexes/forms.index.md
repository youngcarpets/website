# Forms Agent — Resource Index

> Last updated: 2026-04-06

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/05-typescript-zod-superforms.md` | Type generation, Zod v4 schemas, Superforms v2 flow |
| `resources/07-svelte5-runes-patterns.md` | $props, $state, $derived for form components |

## Reference Files
| File | What's In It |
|------|-------------|
| `reference/component-patterns.md` | Superforms integration section, form component template |
| `reference/standards.md` | Section [E] Errors — form action error handling |

## Key Project Files
| File | Purpose |
|------|---------|
| `my-portal/src/lib/modules/employees/schemas/employee.schema.ts` | Simple schema example |
| `my-portal/src/lib/modules/customers/schemas/customer.schema.ts` | Complex schema (optional fields, regex) |
| `my-portal/src/lib/modules/employees/components/EmployeeForm.svelte` | Simple form example |
| `my-portal/src/lib/modules/customers/components/CustomerForm.svelte` | Complex form (200 lines) |
| `my-portal/src/lib/components/ui/FormField.svelte` | Shared input component |

## Critical Reminders
- Adapter: `import { zod4 as zod } from 'sveltekit-superforms/adapters'`
- Client: `import { zod4Client as zodClient } from 'sveltekit-superforms/adapters'`
- Server: `superValidate(zod(schema))` in load, validate in action
- Client: `superForm(data.form, { validators: zodClient(schema) })`

## Research Log
| Date | Topic | Source | Added To |
|------|-------|--------|----------|
| | | | |
