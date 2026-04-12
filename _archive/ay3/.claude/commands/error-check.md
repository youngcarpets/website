# Error Check — Parallel Codebase Review

> **Agent**: `.claude/agents/error-check.md` | **Mode**: Deep (5 parallel sub-agents)

## Philosophy
1. **Repo-first**: Read `reference/standards.md` and `reference/review-checklist.md` BEFORE anything else
2. **Parallel**: 5 agents simultaneously, each reviewing a logical chunk
3. **Actionable**: Every finding = severity + rule ID + file:line + description
4. **No false positives**: Unsure = [INFO], not [ERROR]

## Steps

### 1. Read the rules
- `.claude/reference/standards.md` — the 48 rules across 8 sections
- `.claude/reference/review-checklist.md` — agent assignments and file globs

### 2. Launch 5 parallel agents
Each agent gets: file globs + rule IDs from checklist + output format below.

### 3. Compile unified report
Dashboard (totals) > [ERROR] findings > [WARN] findings > [INFO] findings > Recommendations (top 3 urgent, patterns, quick wins).

## Agent Output Format
```
## Agent {N} — {Name}
Checked: {count} files | {errors} errors, {warnings} warnings, {info} info

### [ERROR] Findings
- RULE_ID | file:line | description

### [WARN] Findings
- RULE_ID | file:line | description

### [INFO] Findings
- RULE_ID | file:line | description
```
