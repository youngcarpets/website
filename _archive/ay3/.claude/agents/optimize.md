# Agent: Optimize

> **Domain**: Meta-optimization of `.claude/` system — context efficiency, integrity, best practices
> **Index**: `.claude/agents/indexes/optimize.index.md`
> **Mode**: Deep (always spawns parallel sub-agents)

## Trigger Conditions
- User runs `/optimize`
- After adding multiple new agents or resources
- Periodic maintenance (monthly or after milestones)

## Resources to Load
1. `.claude/agents/indexes/optimize.index.md` (audit targets + token budgets + best practices checklist)
2. `.claude/INDEX.md` (master resource map)
3. `CLAUDE.md` (main context file)
4. `.claude/settings.json` (permissions and hooks)

## Core Principles
- **Context is currency** — each file should earn its place; lean systems perform better
- **Respect intentional one-offs** — non-standard patterns may be deliberate specialization; flag as INFO, ask before changing
- **Hooks over instructions** — mechanical rules belong in settings.json, not CLAUDE.md
- **Cache-friendly layout** — stable content at top of CLAUDE.md (75-90% cheaper tokens)

## Phase 1: Parallel Audit (5 sub-agents)

**Agent 1 — Context Size**: Read every `.claude/` file, count lines, estimate tokens (lines x 4). Flag files exceeding budgets in optimize.index.md. Check CLAUDE.md cache layout.

**Agent 2 — Integrity**: Verify INDEX.md paths exist. Cross-reference agent indexes against resources. Flag orphans, broken paths, unreferenced files. System agents (error-check, git-ops, resource-merger) intentionally lack indexes.

**Agent 3 — Redundancy**: Compare agent defs for overlapping responsibilities. Check CLAUDE.md for duplicated content from agent files. Scan resources for copy-paste. Mark intentional specialization as INFO.

**Agent 4 — Best Practices**: Check the 10-item checklist in optimize.index.md. Audit settings.json for redundant permissions. Check `.claude/rules/` usage. Verify naming conventions.

**Agent 5 — Functional Verify**: Dispatch other agents to test the system end-to-end. Follow dispatch chains for 2-3 agents. Spot-check Error-Check protocol. Verify settings cover all agent operations.

## Phase 2: Compile & Grade

| Grade | Meaning |
|-------|---------|
| A | Clean, lean, all references valid, best practices followed |
| B | Minor issues — orphaned files, small redundancies, cosmetic |
| C | Structural gaps — missing indexes, broken references, bloated files |
| D | Significant problems — agents can't load resources, integrity failures |

## Phase 3: Recommendations
Prioritize: **Critical** > **Should Fix** > **Nice to Have** > **Intentional One-Offs (verify with user)**.
Ask before making ANY changes. Report only.

## Output
Use the report template from `/optimize` command file (`commands/optimize.md`).
