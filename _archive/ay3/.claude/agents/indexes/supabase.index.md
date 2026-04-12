# Supabase Agent — Resource Index

> Last updated: 2026-04-06

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/01-database-security-rls.md` | RLS rules, RBAC, default-deny, performance tips |
| `resources/02-auth-sveltekit-ssr.md` | SSR auth, dual-client pattern, route protection |

## Reference Files
| File | What's In It |
|------|-------------|
| `reference/standards.md` | Section [C] Security — server-side validation, no secrets in client |
| `reference/architecture-decisions.md` | ADR-003: Supabase backend, ADR-004: Form Actions |

## Key Project Files
| File | Purpose |
|------|---------|
| `my-portal/src/lib/supabaseClient.ts` | Browser Supabase client (PUBLIC keys only) |
| `my-portal/src/lib/server/supabase.ts` | Server client factory (createSupabaseServerClient) |
| `my-portal/src/hooks.server.ts` | Injects event.locals.supabase |
| `my-portal/src/lib/services/crud.ts` | Generic CRUD factory using Supabase |

## Research Log
| Date | Topic | Source | Added To |
|------|-------|--------|----------|
| | | | |
