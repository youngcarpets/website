# Performance Agent — Resource Index

> Last updated: 2026-04-06

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/06-performance-sveltekit.md` | SSR, prefetch, code splitting, glass budget |

## Reference Files
| File | What's In It |
|------|-------------|
| `reference/standards.md` | Section [P] Performance — memory leaks, reactivity, queries, file size |

## Key Budgets
- Glass blur layers: max 3 concurrent on viewport
- Component file size: <300 lines
- Supabase queries: select specific columns, use limits
- $effect(): always include cleanup function

## System Token Budgets (from optimize agent)
| Item | Target | Warning | Critical |
|------|--------|---------|----------|
| CLAUDE.md | <200 lines | 200-300 | >300 |
| Agent def | <80 lines | 80-150 | >150 |
| Agent index | <80 lines | 50-100 | >100 |
| Single resource | <250 lines | 250-400 | >400 |

## System Best Practices
- Progressive disclosure — tell Claude how to find info, not all the info
- Sub-agents compress findings — don't pollute main context
- One source of truth per fact — duplicates drift apart
- Clear between unrelated tasks — context degradation is real

## Research Log
| Date | Topic | Source | Added To |
|------|-------|--------|----------|
| 2026-04-06 | Claude Code best practices | Anthropic docs | Token budgets, checklist |
