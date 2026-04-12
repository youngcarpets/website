# Performance — SvelteKit SSR, Bundle Optimization, CSS

> **Priority: MEDIUM-HIGH** — Employee portals must load fast on business networks.
> Source: https://svelte.dev/docs/kit/performance

---

## SSR vs Prerendering Decision Matrix

| Page Type | Strategy | Config |
|-----------|----------|--------|
| Dashboard (dynamic, auth-gated) | SSR (default) | No config needed |
| About / Home / Marketing | Prerender | `export const prerender = true` |
| Login / Auth pages | SSR | No config needed |
| Error pages | Prerender | Set in `svelte.config.js` |
| API-heavy reports | Streaming | Use `Promise` in load return |

### Enable Prerendering for Static Pages
```typescript
// src/routes/(public)/about/+page.ts
export const prerender = true
// Also: export const prerender = true in +layout.ts for entire static groups
```

### Streaming for Data-Heavy Pages
```typescript
// +page.server.ts — return Promise for non-critical data
export const load = async (event) => {
  const user = await event.locals.getUser()  // await critical auth
  if (!user) redirect(303, '/login')

  return {
    user,
    // Stream non-critical data — page renders immediately
    employees: event.locals.supabase.from('employees').select('*')
      .then(({ data }) => data ?? [])
  }
}
```

---

## Link Prefetching (Built-in SvelteKit)
```svelte
<!-- data-sveltekit-prefetch triggers on hover -->
<a href="/dashboard" data-sveltekit-prefetch>Dashboard</a>

<!-- Or enable globally in +layout.svelte -->
<svelte:head>
  <!-- SvelteKit prefetches all links on hover by default in prod -->
</svelte:head>
```

---

## Code Splitting — Dynamic Imports

SvelteKit automatically splits routes into separate chunks. For heavy components:
```typescript
// Lazy-load heavy components (charts, rich editors, etc.)
const ChartComponent = import('./HeavyChart.svelte')

// In Svelte template
{#await import('./HeavyChart.svelte') then { default: Chart }}
  <Chart data={chartData} />
{/await}
```

---

## CSS Performance — `backdrop-filter` Budget

Glass UI is GPU-expensive. Follow this budget per page:
- **Maximum**: 5-7 simultaneously visible glass panels
- **Blur radius**: Keep at ≤ 20px (25px+ causes significant GPU cost)
- **Avoid**: backdrop-filter on frequently re-rendered components (reactive lists)
- **Avoid**: backdrop-filter on or near `<video>` elements

```css
/* Limit expensive properties to fixed/positioned elements */
.glass-navbar {
  position: fixed;           /* Composited layer — rendered once */
  backdrop-filter: blur(24px);
  will-change: transform;    /* Only add here because it's fixed */
}

/* For scrolling content — use opaque backgrounds instead */
.table-row:hover {
  background: rgba(39, 39, 42, 0.8);  /* NO backdrop-filter */
}
```

---

## Image Optimization
```svelte
<!-- Use native lazy loading -->
<img src="/hero.jpg" loading="lazy" alt="..." width="1200" height="600" />

<!-- For Supabase Storage images — use transform API -->
<!-- https://supabase.com/docs/guides/storage/serving/image-transformations -->
```

---

## Bundle Analysis
```bash
# Analyze bundle composition after build
cd my-portal
npm run build
npx vite-bundle-visualizer  # or rollup-plugin-visualizer
```

Watch for:
- Large third-party libraries loaded on every page
- Duplicate dependencies (check for multiple Zod/Svelte versions)
- `bits-ui` and `@tanstack/table-core` — currently installed but unused (add or remove)

---

## Deploy Target
- **GitHub Pages**: Static adapter (for public website)
- **Vercel/Cloudflare**: Auto adapter (recommended for portal — edge functions)
- Edge deployment reduces latency by ~100-200ms for international users

---

## Sources
- https://svelte.dev/docs/kit/performance
- https://kit.svelte.dev/docs/load#streaming-with-promises
- https://sveltekit.io/blog/make-your-sveltekit-app-faster
