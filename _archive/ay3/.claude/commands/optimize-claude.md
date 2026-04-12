# /optimize-claude — Claude System Optimizer

> **Agent**: `.claude/agents/optimize.md` | **Mode**: Deep (5 parallel sub-agents)

You are running the `/optimize-claude` command. Audit and optimize the `.claude/` system only.

**IMMUTABLE RULES — NEVER modify these sections of CLAUDE.md:**
- Session Info block
- Mode Detection (Intent-Based)
- Rule 1: Agent-First
- Rule 2: Two Operating Modes
- Rule 3: Resource Growth Protocol
- Rule 4: Silent GitHub Operations
- Rule 5: Dynamic Agent Creation
- Tech Stack, Critical Gotchas, Git Protocol, Commands sections

These are the user's core protocols. Optimization applies to agent files, indexes, resources, and references ONLY — never the base rules.

## Philosophy
1. **Context is currency** — every auto-loaded token costs money and attention
2. **Respect one-offs** — non-standard patterns may be intentional specialization
3. **Hooks over instructions** — mechanical rules belong in settings.json, not CLAUDE.md
4. **Report, don't fix** — present findings and ask before changing anything

## Execution Steps

### Step 1: Load the system
Read these files:
- `CLAUDE.md` + `.claude/INDEX.md` + `.claude/settings.json`
- `.claude/agents/optimize.md` (full agent definition)
- `.claude/agents/indexes/optimize.index.md` (audit targets, token budgets, best practices checklist)

### Step 2: Launch 5 parallel audit agents

**Agent 1 — Context Size Audit**
Read every file in .claude/ (agents, indexes, commands). Count lines, estimate tokens (lines × 4). Report table with status per file. Check if CLAUDE.md has stable content at top for cache optimization. Flag any file exceeding the token budgets in optimize.index.md.

**Agent 2 — Integrity & Cross-Reference**
Read INDEX.md. Verify every listed path exists on disk. Verify every agent has definition + index + dispatch entry. Cross-reference: which agent indexes reference which resources? Flag orphans, broken paths, unreferenced files. Note: system agents (error-check, git-ops, resource-merger) intentionally lack indexes.

**Agent 3 — Redundancy & Overlap**
Read CLAUDE.md, all agent defs, all resources, all references. Find duplicate content between any two files. Check if CLAUDE.md repeats content from agent files. Flag overlapping agent responsibilities. Mark intentional specialization as INFO, not ERROR.

**Agent 4 — Best Practices Review**
Check the 10-item best practices checklist from optimize.index.md against the actual system. Check settings.json for redundant permissions. Check if any CLAUDE.md rules could become hooks. Check if .claude/rules/ is being used. Verify naming conventions.

**Agent 5 — Functional Verification**
Dispatch other agents to verify the system works end-to-end:
- Follow the dispatch chain for 2-3 agents: INDEX.md → agent def → index → resources. Confirm every file loads.
- Check that mode detection in CLAUDE.md is clear and unambiguous.
- Verify settings.json permissions cover all agent operations.
- Spot-check one agent (e.g., Error-Check) — does its definition make sense, can it execute?

### Step 3: Compile & grade
Merge all 5 reports. Assign a grade (A/B/C/D) based on findings. Use the output template from the agent definition.

### Step 4: Recommendations
Prioritize into: Critical → Should Fix → Nice to Have → Intentional One-Offs.
For one-offs, explain why it might be intentional and ask the user to confirm.

**Ask before making ANY changes.**
