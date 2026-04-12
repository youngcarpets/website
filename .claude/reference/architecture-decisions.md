# Architecture Decision Records — AY3 Portal

> Consolidated rationale for all key technology and design decisions.
> Reference this before suggesting architectural changes.

---

## ADR-001: SvelteKit as Full-Stack Framework

**Decision**: SvelteKit 2.x with Svelte 5 runes  
**Status**: Active

**Rationale**:
- Single framework handles routing, SSR, form actions, and API endpoints
- Form Actions pattern provides progressive enhancement without client-side JS requirement
- Svelte 5 runes are more explicit and performant than the legacy reactivity model
- SvelteKit's file-based routing maps cleanly to a portal with public + authenticated sections

**Consequences**:
- All components must use Svelte 5 runes syntax (`$props()`, `$state()`, `$derived()`, `$effect()`, `{@render children()}`)
- No legacy `export let` props or `<slot/>` syntax
- Server-side logic lives in `+page.server.ts` / `+layout.server.ts` files

---

## ADR-002: Tailwind CSS v4 with `@theme` Block

**Decision**: Tailwind v4 via `@tailwindcss/vite` plugin, theme defined in `app.css @theme {}`  
**Status**: Active

**Rationale**:
- Tailwind v4 eliminates `tailwind.config.js` — all configuration lives in CSS
- `@tailwindcss/vite` plugin must be listed BEFORE `sveltekit()` in `vite.config.ts`
- CSS custom properties from `@theme` are accessible as `var(--color-*)` in plain CSS
- Better integration with Svelte's scoped styles

**Critical Rule**:
```typescript
// vite.config.ts — ORDER MATTERS
plugins: [tailwindcss(), sveltekit()]  // tailwindcss FIRST
```

**Consequences**:
- No `tailwind.config.js` file — don't create one
- Theme changes go in `src/app.css @theme {}` block
- Extend with `@layer utilities {}` for custom utility classes

---

## ADR-003: Supabase as Backend (PostgreSQL + Auth + Storage)

**Decision**: Supabase with `@supabase/ssr` for server-side, `@supabase/supabase-js` for client  
**Status**: Active

**Rationale**:
- PostgreSQL with RLS provides row-level security without custom middleware
- Built-in Auth handles employee authentication (email, OAuth, magic link)
- Supabase Storage handles file uploads (documents, attachments)
- Real-time subscriptions available for future live dashboard features

**Critical Rules**:
- Always use `getUser()` (not `getSession()`) for server-side auth validation
- Dual-client pattern: `createServerClient` in hooks, `createBrowserClient` in browser
- RLS must be enabled before any table is accessed from client code

---

## ADR-004: Form Actions Over API Routes

**Decision**: SvelteKit form actions (`export const actions`) for all mutations  
**Status**: Active

**Rationale**:
- Form actions work without JavaScript (progressive enhancement)
- `use:enhance` upgrades to client-side without changing server code
- No separate API endpoint management needed
- Natural integration with sveltekit-superforms for validation

**Consequences**:
- Mutations happen via `POST` to `?/actionName`
- No REST API endpoints for the portal UI
- External API integrations (future webhooks, mobile app) would need `+server.ts` routes

---

## ADR-005: Apple Liquid Glass UI Theme

**Decision**: Apple-inspired glass morphism with dark zinc base and cyan accent  
**Status**: Active

**Rationale**:
- Differentiates from typical SaaS portals
- Aligned with Apple's 2025 HIG Liquid Glass design system
- CSS-only implementation — no external UI component library dependency for theming

**Critical Rules**:
- All glass effects via `.glass` CSS class (defined in `app.css`)
- Three-layer structure for high-fidelity glass elements
- `backdrop-filter` blur capped at 20px for performance
- Must honor `prefers-reduced-transparency` media query
- Text must maintain 4.5:1 contrast ratio against glass backgrounds (WCAG AA)

---

## ADR-006: TypeScript Strict Mode

**Decision**: TypeScript with `strict: true`  
**Status**: Active

**Rationale**:
- Catches null/undefined errors at compile time (critical for financial data)
- Enables full Supabase type safety when using generated types
- Prevents implicit `any` — all external data must be typed

**Consequences**:
- No `// @ts-ignore` comments without explicit justification
- All function parameters and return types must be typed
- Supabase types must be regenerated after schema changes

---

## ADR-007: Route Group Structure

**Decision**: `(public)` for unauthenticated routes, `(portal)` for authenticated routes  
**Status**: Planned (only `(public)` exists currently)

```
src/routes/
├── (public)/          ← Marketing, about, login pages
│   └── +layout.svelte ← Navbar without auth state
├── (portal)/          ← Employee dashboard — auth-gated
│   ├── +layout.server.ts  ← Auth check for entire group
│   └── dashboard/
└── auth/
    └── callback/      ← OAuth/magic link callback
```

**Rationale**:
- Single auth check in `(portal)/+layout.server.ts` protects all portal routes
- Clean URL structure: `/dashboard`, `/employees`, `/documents` etc.
- Public website routes remain fast (no auth overhead)

---

## ADR-008: Git Root at Project Root (Not `my-portal/`)

**Decision**: Git repository root is `/ay3/`, not `/ay3/my-portal/`  
**Status**: Active

**Rationale**:
- Tracks workflow docs, CLAUDE.md, docs/PROJECT-PLAN.md alongside app code
- `scripts/start-portal.bat` launcher committed alongside app
- `.claude/` resources committed for AI assistant context

**Consequences**:
- `npm run dev` must be run from `my-portal/` subdirectory
- `.gitignore` in `my-portal/` handles app-specific ignores
- Never commit `.env` files (caught by `.gitignore`)
