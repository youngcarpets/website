# Agent: Error Check

> **Domain**: Code review against project standards — parallel multi-agent review
> **Index**: Uses `.claude/reference/review-checklist.md` directly
> **Mode**: Deep (always spawns 5 parallel sub-agents)

## Trigger Conditions
When to spawn this agent:
- User runs `/error-check` command
- Before major commits or version tags
- User asks for a code review or quality audit
- After large refactors or new module creation

## Resources to Load
Read these files before starting work:
1. `.claude/reference/standards.md` — the 48 rules across 8 sections
2. `.claude/reference/review-checklist.md` — agent assignments and file mappings

## Responsibilities
- Launch 5 parallel review sub-agents (Types, Services, Components, Routes, Config)
- Each sub-agent reads its assigned files and checks against its assigned rules
- Compile unified report with dashboard, errors, warnings, info
- Provide top 3 urgent fixes and pattern recommendations

### Agent Assignments (from review-checklist.md)
1. **Agent 1 — Types & Schemas**: database.ts, type files, schema files (T1-T6, Q1, Q3, S4)
2. **Agent 2 — Services & Utils**: CRUD service, utilities, stores (E1, E3, E4, T1, Q1-Q4, P3, S5)
3. **Agent 3 — Components**: .svelte files, runes, forms (R1-R5, P1-P2, P4, Q1, Q3-Q4, S2, C4)
4. **Agent 4 — Routes & Server**: +page.server.ts, hooks, server/ (S3, S5, E2, E5-E6, C1-C6, R1, T6)
5. **Agent 5 — Config & Dependencies**: package.json, configs, .env (D1-D3, C5, S1, Q6)

### Does NOT do:
- Fix the issues it finds (report only)
- Modify any files
- Skip reading files — must check EVERY file in assignment

## Output Protocol
```markdown
# Error Check Report — {date}

## Dashboard
| Metric | Count |
|--------|-------|
| Files checked | XX |
| Errors | XX |
| Warnings | XX |
| Info | XX |

## [ERROR] Findings (must fix)
| Rule | File | Line | Issue |
|------|------|------|-------|

## [WARN] Findings (should fix)
| Rule | File | Line | Issue |
|------|------|------|-------|

## Recommendations
1. Most urgent: ...
2. Pattern to fix: ...
3. Quick win: ...
```
