# Refactor Agent — Resource Index

> Last updated: 2026-04-06

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/07-svelte5-runes-patterns.md` | $state, $derived, $effect patterns and anti-patterns |

## Reference Files
| File | What's In It |
|------|-------------|
| `reference/standards.md` | Section [Q] Quality — DRY, naming, single responsibility, dead code |
| `reference/component-patterns.md` | Module architecture, barrel exports, service patterns |

## Key Patterns to Enforce
- Components < 300 lines
- No duplicate Supabase queries — use service layer
- $derived() over $effect() for computed values
- Barrel exports for all module public APIs

## Research Log
| Date | Topic | Source | Added To |
|------|-------|--------|----------|
| | | | |
