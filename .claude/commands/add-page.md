---
description: Scaffold a new marketing page with SEO metadata and nav integration
argument-hint: <slug> e.g. about or services/tile-installation
---

Create a new marketing page at route `$ARGUMENTS`. Follow `CLAUDE.md` exactly.

Steps:

1. **Target path**
   - If `$ARGUMENTS` contains `/`, nest accordingly inside `src/routes/(marketing)/`.
   - Otherwise `src/routes/(marketing)/$ARGUMENTS/`.

2. **`+page.svelte`**
   - One `<h1>` matching the page topic.
   - Typed data prop: `let { data }: PageProps = $props();` with `import type { PageProps } from './$types';`.
   - Semantic HTML. Landmarks come from the root layout — never nest `<main>`.
   - No placeholder comments, no `TODO` stubs.

3. **`+page.ts`** with typed load:
   ```ts
   import type { PageLoad } from './$types';
   export const load: PageLoad = async () => ({
     title: '...',
     description: '...',
     canonical: '/$ARGUMENTS'
   });
   ```
   Root `+layout.svelte` reads these via `page.data` for `<title>`, meta description, and canonical.

4. **Nav integration**
   - Edit `src/routes/+layout.svelte` only if this page belongs in the primary nav.
   - Otherwise link to it from the relevant parent page (e.g. a new service links from `/services`).

5. **JSON-LD (when applicable)**
   - Service pages → `Service` schema.
   - Deep pages → add a `BreadcrumbList`.
   - Inject via `<svelte:head>` per CLAUDE.md's Performance + SEO rules.

6. **Verify**
   - Run `pnpm check` and `pnpm lint`. Both must pass before reporting done.
   - Dispatch the `a11y-checker` subagent on the new `+page.svelte` and report findings.

Do not add features beyond a skeleton page. Content belongs in `src/lib/content/` as a typed TS module and is consumed via `load`.
