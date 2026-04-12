# Svelte 5 Runes — Best Practices & Anti-Patterns

> **Priority: MEDIUM-HIGH** — Wrong rune usage causes silent reactivity bugs and performance issues.
> Sources: https://svelte.dev/docs/svelte/best-practices
>          https://svelte.dev/blog/runes

---

## Rune Decision Guide

| Rune | Use For | Avoid When |
|------|---------|-----------|
| `$state()` | Values that must be reactive in the UI | Constants, computed values, non-UI state |
| `$state.raw()` | Large objects reassigned wholesale (API responses) | Objects mutated in-place |
| `$derived()` | Computed values based on state — pure functions | Side effects, async operations |
| `$effect()` | Side effects: DOM manipulation, subscriptions, logging | Computing derived values (use $derived instead) |
| `$props()` | Component inputs | Anything that should be local state |

---

## `$state` — Only for Truly Reactive Values

```svelte
<script lang="ts">
  // CORRECT — UI needs to react to these
  let count = $state(0)
  let isEditing = $state(false)
  let selectedEmployee = $state<Employee | null>(null)

  // WRONG — doesn't need to be reactive (constant config)
  let pageSize = $state(20)  // if it never changes, just use:
  const PAGE_SIZE = 20       // plain const

  // WRONG — computed values
  let fullName = $state('')   // anti-pattern
  $effect(() => { fullName = `${first} ${last}` })  // DON'T DO THIS
  let fullName = $derived(`${first} ${last}`)        // DO THIS INSTEAD
</script>
```

---

## `$state.raw()` — For API Responses and Large Objects

When an object is replaced wholesale (not mutated), `$state.raw` avoids the deep proxy overhead:
```svelte
<script lang="ts">
  // API response assigned wholesale on fetch — use raw
  let employees = $state.raw<Employee[]>([])
  
  async function loadEmployees() {
    const { data } = await supabase.from('employees').select('*')
    employees = data ?? []  // full reassignment — raw is optimal
  }
  
  // Individual fields mutated in-place — use regular $state
  let formData = $state({ name: '', email: '', role: '' })
  formData.name = 'Alice'  // mutation — regular state is correct
</script>
```

---

## `$derived` — Pure Computed Values Only

```svelte
<script lang="ts">
  let employees = $state<Employee[]>([])
  let searchQuery = $state('')

  // CORRECT — pure computation, no side effects
  let filteredEmployees = $derived(
    employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  let employeeCount = $derived(employees.length)

  // For complex multi-step derivations
  let stats = $derived.by(() => {
    const active = employees.filter(e => e.status === 'active')
    return {
      total: employees.length,
      active: active.length,
      inactive: employees.length - active.length
    }
  })
</script>
```

---

## `$effect` — Side Effects Only (Escape Hatch)

```svelte
<script lang="ts">
  // CORRECT — DOM manipulation after state change
  $effect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }  // cleanup
    }
  })

  // CORRECT — external library integration
  $effect(() => {
    const chart = new Chart(canvas, { data: chartData })
    return () => chart.destroy()  // cleanup on destroy
  })

  // WRONG — updating state inside $effect (causes cascading reactivity)
  $effect(() => {
    filteredItems = items.filter(...)  // DON'T — use $derived instead
  })

  // WRONG — using $effect just to watch and derive
  $effect(() => {
    total = items.reduce((sum, i) => sum + i.price, 0)  // DON'T
  })
  let total = $derived(items.reduce((sum, i) => sum + i.price, 0))  // DO
</script>
```

---

## `$props()` — Component API

```svelte
<script lang="ts">
  import type { Employee } from '$lib/types/database.types'

  // All props declared via $props()
  let {
    employee,
    onEdit,
    onDelete,
    class: className = '',  // renamed to avoid keyword conflict
  }: {
    employee: Employee
    onEdit: (emp: Employee) => void
    onDelete: (id: string) => void
    class?: string
  } = $props()

  // Bindable prop (two-way)
  let { value = $bindable('') } = $props()
</script>
```

---

## Global State — Svelte Stores vs Rune Modules

```typescript
// src/lib/stores/ui.svelte.ts  (note: .svelte.ts extension)
// Use rune-based module state for global app state

let _sidebarOpen = $state(false)

export const sidebar = {
  get isOpen() { return _sidebarOpen },
  open() { _sidebarOpen = true },
  close() { _sidebarOpen = false },
  toggle() { _sidebarOpen = !_sidebarOpen }
}

// In component:
import { sidebar } from '$lib/stores/ui.svelte'
// sidebar.isOpen — reactive
```

---

## Anti-Pattern Summary

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| `$state` for constants | Unnecessary proxy overhead | Use `const` |
| Update state in `$effect` | Cascading reactive loops | Use `$derived` |
| `$effect` for computed values | Timing issues, over-runs | Use `$derived` |
| `$state.raw` for mutated objects | Mutations not tracked | Use `$state` |
| Multiple reactive copies of same data | Sync bugs | Single source of truth |

---

## Sources
- https://svelte.dev/docs/svelte/best-practices
- https://svelte.dev/blog/runes
- https://mainmatter.com/blog/2025/03/11/global-state-in-svelte-5/
- https://www.htmlallthethings.com/blog-posts/understanding-svelte-5-runes-derived-vs-effect
